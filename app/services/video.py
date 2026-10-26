"""
High-Performance Cloud-Native Video Compositor.
Replaces slow MoviePy TextClips with asynchronous FFmpeg filtergraphs,
libass native Thai rendering, NVENC hardware acceleration, and dynamic audio ducking.
"""

from __future__ import annotations

import asyncio
import logging
import os
import platform
import re
import shutil
import subprocess
from dataclasses import dataclass, field
from pathlib import Path
from typing import AsyncGenerator, Callable, Dict, List, Optional, Tuple

logger = logging.getLogger("clipturbo.video")


@dataclass
class VideoCompositionConfig:
    """
    Video compositing settings for TikTok 9:16 1080x1920 format.
    """
    width: int = 1080
    height: int = 1920
    fps: int = 30
    voice_gain: float = 1.20       # Boost speech clarity
    bgm_duck_volume: float = 0.12  # Auto-duck BGM down to 12% during speech
    bgm_base_volume: float = 0.35  # BGM volume when no voice is playing
    video_crf: int = 22
    preset: str = "veryfast"
    pixel_format: str = "yuv420p"
    prefer_gpu: bool = True
    custom_font_dir: Optional[str] = "/usr/share/fonts/truetype/custom"


class HardwareEncoder:
    """
    Detects NVIDIA NVENC GPU acceleration and selects the optimal video encoder.
    """
    _cached_encoder: Optional[str] = None

    @classmethod
    async def detect_best_encoder(cls, prefer_gpu: bool = True) -> str:
        if cls._cached_encoder:
            return cls._cached_encoder

        if not prefer_gpu:
            cls._cached_encoder = "libx264"
            return cls._cached_encoder

        # Check if ffmpeg supports h264_nvenc
        try:
            proc = await asyncio.create_subprocess_exec(
                "ffmpeg", "-encoders",
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE
            )
            stdout, _ = await proc.communicate()
            output = stdout.decode("utf-8", errors="ignore")
            if "h264_nvenc" in output:
                # Also verify nvidia-smi exists to confirm active GPU device
                nvidia_smi = shutil.which("nvidia-smi")
                if nvidia_smi:
                    logger.info("NVIDIA GPU detected. Using hardware accelerated encoder: h264_nvenc")
                    cls._cached_encoder = "h264_nvenc"
                    return "h264_nvenc"
        except Exception as e:
            logger.debug(f"GPU detection failed: {e}. Falling back to libx264.")

        logger.info("Using software encoder: libx264 (preset=veryfast, crf=22)")
        cls._cached_encoder = "libx264"
        return "libx264"


class VideoCompositor:
    """
    Asynchronous FFmpeg pipeline runner replacing MoviePy.
    Executes native scale/crop, libass subtitle burn, sidechain ducking,
    and concurrent chunk encoding.
    """

    def __init__(self, config: Optional[VideoCompositionConfig] = None):
        self.config = config or VideoCompositionConfig()

    @staticmethod
    def escape_ffmpeg_path(path: str | Path) -> str:
        """
        Escapes file paths for libass filter in FFmpeg.
        Crucial for Windows drive colons and backslashes vs Linux paths.
        """
        p_str = str(Path(path).resolve())
        # Replace Windows backslashes with forward slashes
        p_str = p_str.replace("\\", "/")
        # Escape colons (especially Windows drive letters C:)
        p_str = p_str.replace(":", r"\:")
        # Escape single quotes and brackets
        p_str = p_str.replace("'", r"\'").replace("[", r"\[").replace("]", r"\]")
        return p_str

    def build_video_filter(self, ass_path: Optional[Path] = None) -> str:
        """
        Builds the FFmpeg video filtergraph:
        1. scale & crop to 1080x1920 without stretching or letterboxing
        2. sets aspect ratio & pixel format
        3. burns ASS subtitle natively via libass
        """
        filters = [
            f"scale={self.config.width}:{self.config.height}:force_original_aspect_ratio=increase",
            f"crop={self.config.width}:{self.config.height}",
            "setsar=1",
        ]

        if ass_path and ass_path.exists():
            escaped_ass = self.escape_ffmpeg_path(ass_path)
            # Use fontsdir if custom fonts directory is configured
            if self.config.custom_font_dir and Path(self.config.custom_font_dir).exists():
                escaped_fonts = self.escape_ffmpeg_path(self.config.custom_font_dir)
                filters.append(f"ass='{escaped_ass}':fontsdir='{escaped_fonts}'")
            else:
                filters.append(f"ass='{escaped_ass}'")

        return ",".join(filters)

    def build_audio_filter(self, has_bgm: bool = True) -> str:
        """
        Builds dynamic sidechain compression for automatic speech ducking.
        Speech [1:a] is boosted by 1.2x.
        BGM [2:a] is compressed down to 0.12x when speech triggers threshold.
        """
        if not has_bgm:
            return f"[1:a]volume={self.config.voice_gain}[aout]"

        # Sidechain compress filter:
        # [bgm][voice] sidechaincompress: ducks bgm whenever voice speaks
        return (
            f"[2:a]volume={self.config.bgm_base_volume}[bgm_norm];"
            f"[1:a]volume={self.config.voice_gain}[voice_boost];"
            f"[bgm_norm][voice_boost]sidechaincompress="
            f"threshold={self.config.bgm_duck_volume}:ratio=6:attack=15:release=250[ducked_bgm];"
            f"[ducked_bgm][voice_boost]amix=inputs=2:duration=first:dropout_transition=2[aout]"
        )

    async def render_video(
        self,
        video_inputs: List[Path],
        voice_audio_path: Path,
        ass_subtitle_path: Optional[Path],
        output_path: Path,
        bgm_audio_path: Optional[Path] = None,
        progress_callback: Optional[Callable[[float, str], None]] = None,
    ) -> Path:
        """
        Executes asynchronous FFmpeg pipeline to render 9:16 TikTok video.
        """
        output_path = Path(output_path).resolve()
        output_path.parent.mkdir(parents=True, exist_ok=True)

        encoder = await HardwareEncoder.detect_best_encoder(self.config.prefer_gpu)

        # Assemble FFmpeg command
        cmd: List[str] = ["ffmpeg", "-y", "-hide_banner"]

        # 1. Video Input(s)
        # If multiple video clips, use concat demuxer or chain
        if len(video_inputs) == 1:
            cmd.extend(["-stream_loop", "-1", "-i", str(video_inputs[0])])
        else:
            # Create temporary concat list
            concat_list = output_path.parent / f"concat_{output_path.stem}.txt"
            lines = [f"file '{self.escape_ffmpeg_path(v)}'" for v in video_inputs]
            concat_list.write_text("\n".join(lines), encoding="utf-8")
            cmd.extend(["-f", "concat", "-safe", "0", "-i", str(concat_list)])

        # 2. Voice Audio Input
        cmd.extend(["-i", str(voice_audio_path)])

        # 3. Optional BGM Input
        has_bgm = bgm_audio_path is not None and bgm_audio_path.exists()
        if has_bgm:
            cmd.extend(["-stream_loop", "-1", "-i", str(bgm_audio_path)])

        # Video Filtergraph
        vf = self.build_video_filter(ass_subtitle_path)

        # Audio Filtergraph
        af = self.build_audio_filter(has_bgm=has_bgm)

        # Complex Filtergraph setup
        filter_complex = f"[0:v]{vf}[vout];{af}"

        cmd.extend([
            "-filter_complex", filter_complex,
            "-map", "[vout]",
            "-map", "[aout]",
            "-c:v", encoder,
            "-pix_fmt", self.config.pixel_format,
            "-r", str(self.config.fps),
        ])

        if encoder == "h264_nvenc":
            cmd.extend(["-preset", "p4", "-cq", str(self.config.video_crf), "-b:v", "5000k"])
        else:
            cmd.extend(["-preset", self.config.preset, "-crf", str(self.config.video_crf)])

        cmd.extend([
            "-c:a", "aac",
            "-b:a", "192k",
            "-shortest",  # Cut video when voice ends
            "-movflags", "+faststart",
            str(output_path),
        ])

        cmd_str = " ".join(cmd)
        logger.info(f"Launching FFmpeg: {cmd_str}")

        if progress_callback:
            progress_callback(10.0, "Starting FFmpeg 9:16 compositing...")

        # Execute async subprocess
        proc = await asyncio.create_subprocess_exec(
            *cmd,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE
        )

        stdout, stderr = await proc.communicate()

        if proc.returncode != 0:
            error_log = stderr.decode("utf-8", errors="replace")
            logger.error(f"FFmpeg compositing failed with code {proc.returncode}:\n{error_log}")
            raise RuntimeError(f"FFmpeg pipeline crashed (exit code {proc.returncode}): {error_log[-800:]}")

        if progress_callback:
            progress_callback(100.0, "FFmpeg video render complete.")

        logger.info(f"Video rendered successfully: {output_path} ({output_path.stat().st_size} bytes)")
        return output_path
