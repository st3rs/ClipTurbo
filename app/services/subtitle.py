"""
Subtitle Processing & ASS Generation Engine for Thai Social Commerce.
Eliminates MoviePy text rendering issues, floating vowels (สระลอย),
and TikTok UI collision by leveraging PyThaiNLP word boundary tokenization,
zero-width character normalization, and pysubs2 ASS filter styling.
"""

from __future__ import annotations

import logging
import os
import re
from dataclasses import dataclass, field
from pathlib import Path
from typing import List, Optional, Tuple

logger = logging.getLogger("clipturbo.subtitle")

# Thai combining vowels and tone marks unicode range regex:
# U+0E31 (Mai Han-Akat), U+0E34-U+0E3A (Sara I .. Phinthu), U+0E47-U+0E4E (Maitaikhu .. Yamakkan)
THAI_ZERO_WIDTH_PATTERN = re.compile(r"[\u0E31\u0E34-\u0E3A\u0E47-\u0E4E]")

try:
    from pythainlp.tokenize import word_tokenize
    PYTHAINLP_AVAILABLE = True
except ImportError:
    PYTHAINLP_AVAILABLE = False
    logger.warning("pythainlp is not installed. Fallback simple tokenizer will be used.")

try:
    import pysubs2
    from pysubs2 import SSAEvent, SSAFile, SSAStyle, Color
    PYSUBS2_AVAILABLE = True
except ImportError:
    PYSUBS2_AVAILABLE = False
    logger.warning("pysubs2 is not installed. Subtitle generation will fallback to manual ASS string builder.")


class ThaiTextNormalizer:
    """
    Normalizes Thai text and calculates accurate visual character width
    by excluding zero-width combining vowels and tonal marks.
    """

    @staticmethod
    def get_visual_length(text: str) -> int:
        """
        Calculate visual glyph count ignoring zero-width combining diacritics and tone marks.
        Example: 'น้ำพริก' -> standard len is 7, but visual glyph length is 5.
        """
        stripped = THAI_ZERO_WIDTH_PATTERN.sub("", text)
        return len(stripped)

    @staticmethod
    def clean_thai_spaces(text: str) -> str:
        """
        Cleans redundant whitespace, zero-width spaces, and normalizes consecutive marks.
        """
        text = text.replace("\u200b", "")  # remove zero-width spaces
        text = re.sub(r"\s+", " ", text)
        return text.strip()


@dataclass
class SubtitleConfig:
    """
    Configuration parameters strictly calibrated for TikTok 9:16 safe zones.
    """
    play_res_x: int = 1080
    play_res_y: int = 1920
    font_name: str = "Prompt Bold"  # or 'Kanit SemiBold'
    font_size: int = 72
    # ASS colors are encoded in BGR order with hex prefix &H00BBGGRR
    # Yellow: &H0000E6FF (RGB: 255, 230, 0 -> BGR: 00, E6, FF)
    primary_color: str = "&H0000E6FF"
    secondary_color: str = "&H00000000"
    outline_color: str = "&H00000000"
    back_color: str = "&H64000000"  # 40% translucent shadow
    outline_width: float = 4.5
    shadow_depth: float = 2.0
    alignment: int = 2  # ASS Alignment 2 = Bottom-Center
    margin_v: int = 420  # Safe zone offset above TikTok yellow cart basket
    margin_l: int = 40
    margin_r: int = 40
    max_chars_per_line: int = 20  # Limit between 18-22 display glyphs
    max_lines_per_cue: int = 2
    karaoke_highlight: bool = True
    highlight_color: str = "&H0038D7FF"  # Bright Amber/Orange highlight (&H001AD6FD)


@dataclass
class SubtitleSegment:
    start_ms: int
    end_ms: int
    text: str
    speaker: Optional[str] = None


class SubtitleService:
    """
    Production Subtitle Engine handling Thai word segmentation,
    dynamic line-wrapping without mid-word splits, and ASS generation.
    """

    def __init__(self, config: Optional[SubtitleConfig] = None):
        self.config = config or SubtitleConfig()
        self.normalizer = ThaiTextNormalizer()

    def tokenize_thai_words(self, text: str) -> List[str]:
        """
        Tokenizes Thai sentence into natural lexical words using pythainlp 'newmm' dictionary engine.
        Prevents broken words across line boundaries.
        """
        cleaned = self.normalizer.clean_thai_spaces(text)
        if PYTHAINLP_AVAILABLE:
            tokens = word_tokenize(cleaned, engine="newmm", keep_whitespace=False)
            return [t for t in tokens if t.strip()]
        
        # Fallback if pythainlp not present in test env
        tokens = cleaned.split(" ")
        return [t for t in tokens if t.strip()]

    def wrap_thai_text(self, text: str, max_visual_chars: Optional[int] = None) -> str:
        """
        Wraps Thai text onto 1-2 lines based on maximum visual characters per line.
        Never breaks a word in half.
        """
        limit = max_visual_chars or self.config.max_chars_per_line
        words = self.tokenize_thai_words(text)

        if not words:
            return ""

        lines: List[str] = []
        current_line: List[str] = []
        current_visual_len = 0

        for word in words:
            word_vlen = self.normalizer.get_visual_length(word)

            if current_line and (current_visual_len + word_vlen > limit):
                lines.append("".join(current_line))
                current_line = [word]
                current_visual_len = word_vlen
            else:
                current_line.append(word)
                current_visual_len += word_vlen

        if current_line:
            lines.append("".join(current_line))

        # Join with ASS hard line-break sequence \N
        return r"\N".join(lines[: self.config.max_lines_per_cue])

    def generate_ass_file(
        self,
        segments: List[SubtitleSegment],
        output_path: str | Path,
    ) -> Path:
        """
        Generates production-grade .ass subtitle file with TikTok Safe Zone styles.
        """
        out_path = Path(output_path).resolve()
        out_path.parent.mkdir(parents=True, exist_ok=True)

        if PYSUBS2_AVAILABLE:
            subs = SSAFile()
            subs.info["Title"] = "ClipTurbo TH TikTok Social Commerce Subtitles"
            subs.info["ScriptType"] = "v4.00+"
            subs.info["PlayResX"] = str(self.config.play_res_x)
            subs.info["PlayResY"] = str(self.config.play_res_y)
            subs.info["WrapStyle"] = "0"
            subs.info["ScaledBorderAndShadow"] = "yes"

            # Primary Style for TikTok Safe Zone
            # PySubs2 colors: Color(r, g, b, a)
            # Default Yellow: R=255, G=230, B=0
            style = SSAStyle()
            style.fontname = self.config.font_name
            style.fontsize = float(self.config.font_size)
            style.primarycolor = Color(255, 230, 0, 0)
            style.outlinecolor = Color(0, 0, 0, 0)
            style.backcolor = Color(0, 0, 0, 100)
            style.outline = self.config.outline_width
            style.shadow = self.config.shadow_depth
            style.alignment = self.config.alignment
            style.marginv = self.config.margin_v
            style.marginl = self.config.margin_l
            style.marginr = self.config.margin_r
            style.bold = True

            subs.styles["Default"] = style

            for seg in segments:
                formatted_text = self.wrap_thai_text(seg.text)
                event = SSAEvent(
                    start=seg.start_ms,
                    end=seg.end_ms,
                    text=formatted_text,
                    style="Default",
                )
                subs.events.append(event)

            subs.save(str(out_path), encoding="utf-8")
        else:
            # Native ASS formatter fallback
            content = self._render_ass_raw(segments)
            out_path.write_text(content, encoding="utf-8")

        logger.info(f"Generated ASS subtitle file at: {out_path} ({len(segments)} cues)")
        return out_path

    def _render_ass_raw(self, segments: List[SubtitleSegment]) -> str:
        """
        Raw ASS script generator compliant with libass specs.
        """
        lines = [
            "[Script Info]",
            "Title: ClipTurbo TH Subtitles",
            "ScriptType: v4.00+",
            f"PlayResX: {self.config.play_res_x}",
            f"PlayResY: {self.config.play_res_y}",
            "WrapStyle: 0",
            "ScaledBorderAndShadow: yes",
            "",
            "[V4+ Styles]",
            "Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding",
            f"Style: Default,{self.config.font_name},{self.config.font_size},{self.config.primary_color},&H00000000,{self.config.outline_color},{self.config.back_color},-1,0,0,0,100,100,0,0,1,{self.config.outline_width},{self.config.shadow_depth},{self.config.alignment},{self.config.margin_l},{self.config.margin_r},{self.config.margin_v},1",
            "",
            "[Events]",
            "Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text",
        ]

        def _format_time(ms: int) -> str:
            hours = ms // 3600000
            ms %= 3600000
            minutes = ms // 60000
            ms %= 60000
            seconds = ms // 1000
            centis = (ms % 1000) // 10
            return f"{hours}:{minutes:02d}:{seconds:02d}.{centis:02d}"

        for seg in segments:
            start_str = _format_time(seg.start_ms)
            end_str = _format_time(seg.end_ms)
            text = self.wrap_thai_text(seg.text)
            lines.append(f"Dialogue: 0,{start_str},{end_str},Default,,0,0,0,,{text}")

        return "\n".join(lines) + "\n"
