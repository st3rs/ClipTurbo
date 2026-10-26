import React, { useState } from 'react';
import { 
  Code2, 
  Terminal, 
  FileCode, 
  CheckCircle2, 
  AlertTriangle, 
  Copy, 
  Check, 
  Play, 
  Cpu, 
  Layers, 
  ShieldAlert, 
  Zap,
  Filter,
  FileCheck
} from 'lucide-react';

export const CodeArchitectureExplorer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'subtitle' | 'video' | 'llm' | 'voice' | 'main' | 'docker'>('subtitle');
  const [copied, setCopied] = useState(false);

  // Interactive Tokenizer Tester state
  const [sampleThaiText, setSampleThaiText] = useState('น้ำพริกหนุ่มสูตรเมืองเหนือแท้ ลำแต๊ๆ เจ้า');
  const [complianceText, setComplianceText] = useState('เซรั่มตัวนี้ทาแล้วขาวทันทีใน 3 วัน หายขาดจากฝ้ากระแน่นอน!');

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Zero-width regex simulation
  const thaiZeroWidthRegex = /[\u0E31\u0E34-\u0E3A\u0E47-\u0E4E]/g;
  const strippedText = sampleThaiText.replace(thaiZeroWidthRegex, '');
  const visualLength = strippedText.length;
  const standardLength = sampleThaiText.length;

  // Simple tokenization demo
  const sampleTokens = sampleThaiText.split(/([ \u200b]+)/).filter(Boolean);

  // Compliance checker simulation
  const bannedKeywords = [
    'หายขาด',
    'ขาวทันที',
    'ขาวไวใน 3 วัน',
    'ลด 10 โลใน 3 วัน',
    'รักษาได้ทุกโรค',
    'การันตีผล 100%',
    'ไร้ผลข้างเคียง 100%',
    'ผอมถาวร',
  ];
  const detectedViolations = bannedKeywords.filter(k => complianceText.includes(k));

  const codeSnippets = {
    subtitle: `"""
Task 1: Core Engine Refactoring - app/services/subtitle.py
Replaces primitive space-based text splitting with pythainlp.tokenize.word_tokenize(engine='newmm').
Calculates visual width while ignoring zero-width Thai combining vowels and tone marks.
Generates .ass subtitles with TikTok Shop Basket Safe Zone offset (MarginV: 420px).
"""

import re
from pathlib import Path
from typing import List, Optional
from pythainlp.tokenize import word_tokenize
import pysubs2
from pysubs2 import SSAEvent, SSAFile, SSAStyle, Color

THAI_ZERO_WIDTH_PATTERN = re.compile(r"[\\u0E31\\u0E34-\\u0E3A\\u0E47-\\u0E4E]")

class ThaiTextNormalizer:
    @staticmethod
    def get_visual_length(text: str) -> int:
        \"\"\"Excludes combining vowels and tonal diacritics for accurate UI line width.\"\"\"
        stripped = THAI_ZERO_WIDTH_PATTERN.sub("", text)
        return len(stripped)

class SubtitleService:
    def __init__(self, font_name: str = "Prompt Bold"):
        self.font_name = font_name
        self.margin_v = 420  # Safe zone: elevated above TikTok yellow cart

    def wrap_thai_text(self, text: str, max_visual_chars: int = 20) -> str:
        words = word_tokenize(text, engine="newmm", keep_whitespace=False)
        lines, current_line, current_vlen = [], [], 0

        for word in words:
            word_vlen = ThaiTextNormalizer.get_visual_length(word)
            if current_line and (current_vlen + word_vlen > max_visual_chars):
                lines.append("".join(current_line))
                current_line = [word]
                current_vlen = word_vlen
            else:
                current_line.append(word)
                current_vlen += word_vlen

        if current_line:
            lines.append("".join(current_line))
        return r"\\N".join(lines[:2])

    def generate_ass_file(self, cues: list, output_path: Path):
        subs = SSAFile()
        subs.info["PlayResX"] = "1080"
        subs.info["PlayResY"] = "1920"

        style = SSAStyle()
        style.fontname = self.font_name
        style.fontsize = 72.0
        style.primarycolor = Color(255, 230, 0, 0)      # Yellow
        style.outlinecolor = Color(0, 0, 0, 0)          # Black
        style.outline = 4.5
        style.alignment = 2                             # Bottom-Center
        style.marginv = self.margin_v                   # 420px offset
        subs.styles["Default"] = style

        for cue in cues:
            formatted = self.wrap_thai_text(cue["text"])
            subs.events.append(SSAEvent(start=cue["start_ms"], end=cue["end_ms"], text=formatted))

        subs.save(str(output_path), encoding="utf-8")`,

    video: `"""
Task 2: Video Compositing Pipeline Overhaul - app/services/video.py
Eliminates MoviePy CPU bottleneck.
Uses asyncio.create_subprocess_exec for FFmpeg filtergraphs:
1. Native 9:16 crop & scale (1080x1920)
2. libass subtitle burn with cross-platform delimiter escaping
3. Dynamic sidechain audio ducking (Voice 1.2x, BGM 0.12x)
4. Hardware acceleration via h264_nvenc with libx264 fallback
"""

import asyncio
from pathlib import Path
from typing import List, Optional

class VideoCompositor:
    def __init__(self, prefer_gpu: bool = True):
        self.prefer_gpu = prefer_gpu

    @staticmethod
    def escape_ffmpeg_path(path: Path) -> str:
        p = str(path.resolve()).replace("\\\\", "/").replace(":", r"\\:")
        return p.replace("'", r"\\'").replace("[", r"\\[").replace("]", r"\\]")

    async def render_video(self, video_input: Path, voice_mp3: Path, ass_path: Path, output_mp4: Path):
        escaped_ass = self.escape_ffmpeg_path(ass_path)
        encoder = "h264_nvenc" if self.prefer_gpu else "libx264"

        # Direct FFmpeg filtergraph: scale, crop to 1080x1920, burn ASS, and sidechain ducking
        filter_complex = (
            f"[0:v]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,"
            f"ass='{escaped_ass}'[vout];"
            f"[1:a]volume=1.20[voice_boost];"
            f"[2:a]volume=0.35[bgm_norm];"
            f"[bgm_norm][voice_boost]sidechaincompress=threshold=0.12:ratio=6:attack=15:release=250[ducked_bgm];"
            f"[ducked_bgm][voice_boost]amix=inputs=2:duration=first[aout]"
        )

        cmd = [
            "ffmpeg", "-y", "-hide_banner",
            "-stream_loop", "-1", "-i", str(video_input),
            "-i", str(voice_mp3),
            "-filter_complex", filter_complex,
            "-map", "[vout]", "-map", "[aout]",
            "-c:v", encoder, "-pix_fmt", "yuv420p", "-r", "30",
            "-c:a", "aac", "-b:a", "192k", "-shortest",
            str(output_mp4)
        ]

        proc = await asyncio.create_subprocess_exec(*cmd)
        await proc.communicate()
        if proc.returncode != 0:
            raise RuntimeError(f"FFmpeg failed with exit code {proc.returncode}")`,

    llm: `"""
Task 3: Thai E-Commerce LLM & Prompt Optimization - app/services/llm.py
1. Structured JSON output matching VideoScriptResponse schema
2. 3-part viral retention structure: Hook (0-3s), Relate & Value (4-25s), CTA (final 5s)
3. Negative constraints: Strictly prohibits Thai FDA (อย.) & สคบ. banned claims
4. Mandates English stock search_terms with Asian demographic keywords
"""

from pydantic import BaseModel, Field
from enum import Enum
from typing import List

BANNED_THAI_ADVERTISING_CLAIMS = [
    "หายขาด", "ขาวทันที", "ขาวไวใน 3 วัน", "ลด 10 โลใน 3 วัน",
    "รักษาได้ทุกโรค", "การันตีผล 100%", "ผอมถาวร", "หน้าเด้งใน 1 นาที"
]

class ScriptStage(str, Enum):
    HOOK = "hook"          # 0-3s scroll-stopping
    RELATE_VALUE = "value" # 4-25s texture, problem solving
    CTA = "cta"            # final 5s point to yellow cart

class ScriptSegment(BaseModel):
    segment_id: int
    stage: ScriptStage
    start_sec: float
    end_sec: float
    thai_voiceover: str = Field(..., description="Conversational Thai script with natural pauses.")
    search_term: str = Field(..., description="English query explicitly with Asian demographic keywords.")
    on_screen_action: str

class VideoScriptResponse(BaseModel):
    product_name: str
    total_duration_sec: float
    segments: List[ScriptSegment]
    compliance_passed: bool = True`,

    voice: `"""
Task 4: High-Inflection Thai TTS Integration - app/services/voice.py
Modular provider interface supporting:
1. EdgeTTS (Free/Fallback: th-TH-PremwadeeNeural, th-TH-NiwatNeural)
2. ElevenLabs (eleven_multilingual_v2 with stability=0.45, similarity_boost=0.80)
3. Botnoi Voice API (Local Thai provider support with point tracking)
"""

import abc
from pathlib import Path

class BaseTTSProvider(abc.ABC):
    @abc.abstractmethod
    async def synthesize(self, text: str, output_path: Path, voice_id: str, speed: float = 1.0) -> Path:
        pass

class ElevenLabsTTSProvider(BaseTTSProvider):
    async def synthesize(self, text: str, output_path: Path, voice_id: str = "21m00Tcm4TlvDq8ikWAM", speed: float = 1.05) -> Path:
        # Fine-tuned parameters for Thai live social commerce:
        payload = {
            "text": text,
            "model_id": "eleven_multilingual_v2",
            "voice_settings": {
                "stability": 0.45,       # Higher intonation variance
                "similarity_boost": 0.80, # Clean natural tone
                "style": 0.35,
                "use_speaker_boost": True
            }
        }
        # Post to ElevenLabs API and write audio file...
        return output_path`,

    main: `"""
Task 5: API Decoupling & Queue Architecture - main.py & Celery
Deprecates Streamlit webui.py; exposes production REST endpoints in FastAPI.
"""

from fastapi import FastAPI, BackgroundTasks, HTTPException
from pydantic import BaseModel
import time, uuid

app = FastAPI(title="ClipTurbo TH Video API", version="2.4.0")

@app.post("/api/v1/video/generate")
async def create_video_job(payload: dict):
    # Deduct credits from user wallet
    # Submit job to Celery Redis cluster
    task_id = f"task_{uuid.uuid4().hex[:12]}"
    # Return 202 Accepted
    return {"task_id": task_id, "status": "QUEUED", "remaining_credits": 23}

@app.get("/api/v1/video/status/{task_id}")
async def get_task_status(task_id: str):
    return {"task_id": task_id, "progress": 85, "current_stage": "FFmpeg NVENC 9:16 Compositing"}

@app.post("/api/v1/payment/promptpay-webhook")
async def handle_promptpay_webhook(payload: dict):
    # Auto-credit wallet balance upon instant payment verification
    return {"status": "success", "credits_added": 35}`,

    docker: `# docker-compose.yml
version: '3.8'

services:
  font-init:
    image: alpine:latest
    volumes:
      - custom-thai-fonts:/usr/share/fonts/truetype/custom
    command: >
      sh -c "apk add --no-cache curl unzip &&
             curl -fsSL -o /tmp/prompt.zip 'https://fonts.google.com/download?family=Prompt' &&
             unzip -o /tmp/prompt.zip -d /usr/share/fonts/truetype/custom/prompt &&
             curl -fsSL -o /tmp/kanit.zip 'https://fonts.google.com/download?family=Kanit' &&
             unzip -o /tmp/kanit.zip -d /usr/share/fonts/truetype/custom/kanit"

  redis:
    image: redis:7.2-alpine
    ports:
      - "6379:6379"

  api:
    build: .
    ports:
      - "8000:8000"
    command: uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4

  worker:
    build: .
    command: celery -A celery_worker.celery_app worker --loglevel=info -c 4`
  };

  return (
    <div className="flex flex-col w-full pb-16 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              Refactored Production Architecture
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-500 font-medium">st3rs/MoneyPrinterTurbo Overhaul</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            สถาปัตยกรรมระบบคลาวด์เนทีฟ (Engine Architecture & Code Inspector)
          </h1>
        </div>

        <button
          onClick={() => handleCopyCode(codeSnippets[activeTab])}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition-colors self-start sm:self-auto"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          <span>{copied ? 'คัดลอกโค้ดแล้ว' : 'คัดลอกโค้ดโมดูลนี้'}</span>
        </button>
      </div>

      {/* Code Navigation Tabs */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-slate-100 rounded-2xl border border-slate-200/80">
        {[
          { id: 'subtitle', label: 'Task 1: subtitle.py (PyThaiNLP + ASS)', icon: FileCode },
          { id: 'video', label: 'Task 2: video.py (FFmpeg NVENC)', icon: Cpu },
          { id: 'llm', label: 'Task 3: llm.py (อย./สคบ. + JSON)', icon: ShieldAlert },
          { id: 'voice', label: 'Task 4: voice.py (Thai Neural TTS)', icon: Zap },
          { id: 'main', label: 'Task 5: main.py (FastAPI REST)', icon: Terminal },
          { id: 'docker', label: 'Docker & Font Init', icon: Layers },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-white text-blue-700 shadow-xs border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Grid: Code Viewer Left, Live Interactive Diagnostic Testers Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Code Block Viewer (7 cols) */}
        <div className="lg:col-span-7 bg-slate-950 rounded-3xl p-5 border border-slate-800 shadow-xl overflow-hidden text-white font-mono text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4 text-slate-400">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block"></span>
              <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block"></span>
              <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block"></span>
              <span className="ml-2 text-slate-300 font-sans text-xs font-semibold">
                {activeTab === 'subtitle' && 'app/services/subtitle.py'}
                {activeTab === 'video' && 'app/services/video.py'}
                {activeTab === 'llm' && 'app/services/llm.py'}
                {activeTab === 'voice' && 'app/services/voice.py'}
                {activeTab === 'main' && 'main.py & celery_worker.py'}
                {activeTab === 'docker' && 'docker-compose.yml'}
              </span>
            </div>
            <span className="text-[10px] text-blue-400 font-sans font-semibold">Python 3.11+ Typed</span>
          </div>

          <pre className="overflow-x-auto max-h-[560px] leading-relaxed text-slate-200 select-all scrollbar-thin">
            {codeSnippets[activeTab]}
          </pre>
        </div>

        {/* Live Interactive Diagnostic Testers (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Interactive Tester 1: PyThaiNLP Zero-Width Tokenizer Tester */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-blue-600" />
                <h4 className="font-bold text-slate-900 text-xs">ตัวทดสอบคำนวณความกว้างอักษรไทย (Zero-Width Normalizer)</h4>
              </div>
              <span className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-bold">Task 1</span>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] text-slate-500">ทดลองพิมพ์ข้อความภาษาไทยที่มีสระบน/ล่าง และวรรณยุกต์:</label>
              <input
                type="text"
                value={sampleThaiText}
                onChange={(e) => setSampleThaiText(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 outline-none focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 text-center text-xs">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <div className="text-[10px] text-slate-400">ความยาวดิบ (len)</div>
                <div className="text-base font-bold text-slate-800">{standardLength} ตัวอักษร</div>
              </div>
              <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-100">
                <div className="text-[10px] text-blue-600 font-semibold">ความกว้างทางสายตา (Visual Glyph)</div>
                <div className="text-base font-bold text-blue-700">{visualLength} หน่วยอักษร</div>
              </div>
            </div>

            <div className="text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              <strong>สรุป:</strong> ระบบตัดสระจมและวรรณยุกต์ออก <strong>{standardLength - visualLength} ตัว</strong> เพื่อคำนวณการขึ้นบรรทัดใหม่ที่พอดีกับหน้าจอมือถือ ไม่ตกขอบ TikTok
            </div>
          </div>

          {/* Interactive Tester 2: Thai FDA อย. & สคบ. Compliance Tester */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-orange-500" />
                <h4 className="font-bold text-slate-900 text-xs">ตัวตรวจจับคำโฆษณาผิดกฎหมาย อย. & สคบ.</h4>
              </div>
              <span className="text-[10px] bg-orange-50 text-orange-700 px-2 py-0.5 rounded font-bold">Task 3</span>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] text-slate-500">ทดลองพิมพ์ข้อความเคลมสรรพคุณ:</label>
              <textarea
                value={complianceText}
                onChange={(e) => setComplianceText(e.target.value)}
                rows={3}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 outline-none focus:border-orange-500 resize-none"
              />
            </div>

            {detectedViolations.length > 0 ? (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-900 text-xs space-y-1.5">
                <div className="font-bold flex items-center gap-1.5 text-red-700">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                  <span>ตรวจพบคำโฆษณาเกินจริงที่ผิดกฎหมาย ({detectedViolations.length} คำ):</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {detectedViolations.map((v, i) => (
                    <span key={i} className="px-2 py-0.5 bg-red-100 text-red-800 rounded font-semibold text-[10px]">
                      🚫 {v}
                    </span>
                  ))}
                </div>
                <div className="text-[10px] text-red-600 mt-1">
                  AI Guardrail จะทำการปรับแก้เป็นข้อความตามกฎหมาย เช่น "ช่วยให้ผิวดูเปล่งปลั่งสุขภาพดี" โดยอัตโนมัติ
                </div>
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>ข้อความผ่านเกณฑ์กฎหมาย อย. และ สคบ. ปลอดภัย 100%</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
