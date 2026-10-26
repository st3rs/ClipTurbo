"""
FastAPI Production API Gateway for ClipTurbo TH / Thai Social Commerce Video Generator.
Deprecates Streamlit webui.py; handles asynchronous task dispatch, credit ledger,
SSE progress streaming, and PromptPay payment webhooks.
"""

from __future__ import annotations

import asyncio
import json
import logging
import time
import uuid
from typing import Any, AsyncGenerator, Dict, List, Optional

from fastapi import BackgroundTasks, FastAPI, HTTPException, Request, Response, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, StreamingResponse
from pydantic import BaseModel, Field

from app.services.llm import BANNED_THAI_ADVERTISING_CLAIMS, ProductScriptRequest, ScriptGenerator
from app.services.subtitle import SubtitleConfig, SubtitleService, ThaiTextNormalizer
from app.services.voice import AVAILABLE_VOICES

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")
logger = logging.getLogger("clipturbo.api")

app = FastAPI(
    title="ClipTurbo TH API",
    description="High-throughput Thai Social Commerce Video Generator Cloud Engine",
    version="2.4.0",
)

# CORS middleware for Next.js / React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory session mock storage for user credits & tasks (backed by Redis/PostgreSQL in full deployment)
USER_WALLET_DB: Dict[str, Dict[str, Any]] = {
    "default_user": {
        "balance_thb": 240.0,
        "available_credits": 24,
        "subscription_tier": "Creator Popular (35 คลิป)",
        "total_generated": 148,
    }
}

TASKS_STORE: Dict[str, Dict[str, Any]] = {}


class GenerateVideoRequest(BaseModel):
    user_id: str = "default_user"
    product_name: str = Field(..., example="Hya Booster Glow Serum 30ml")
    product_url: Optional[str] = Field(None, example="https://shop.tiktok.com/view/product/17293849")
    price_thb: float = Field(290.0, example=290.0)
    key_benefits: List[str] = Field(default_factory=lambda: ["ไฮยาเข้มข้น 8 มิติ", "ผิวฉ่ำโกลว์ใน 7 วัน", "ผิวแพ้ง่ายใช้ได้ ไม่อุดตัน"])
    voice_character: str = Field("excited_influencer", example="excited_influencer")
    voice_id: str = Field("th-TH-PremwadeeNeural", example="th-TH-PremwadeeNeural")
    tts_provider: str = Field("edge_tts", example="edge_tts")
    font_name: str = Field("Prompt Bold", example="Prompt Bold")
    subtitle_preset: str = Field("yellow_black_outline", example="yellow_black_outline")
    safe_zone_lock: bool = Field(True, example=True)


class GenerateVideoResponse(BaseModel):
    task_id: str
    status: str
    message: str
    remaining_credits: int
    estimated_duration_sec: float = 28.4


class PromptPayWebhookPayload(BaseModel):
    transaction_id: str
    amount_thb: float
    sender_bank: str = "K PLUS"
    qr_reference: str
    paid_at: str
    user_id: str = "default_user"


@app.get("/healthz", tags=["System"])
async def health_check():
    return {
        "status": "healthy",
        "service": "ClipTurbo TH Production API",
        "version": "2.4.0",
        "timestamp": time.time(),
    }


@app.get("/api/v1/user/wallet", tags=["Wallet"])
async def get_wallet(user_id: str = "default_user"):
    user = USER_WALLET_DB.get(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User wallet not found")
    return user


@app.get("/api/v1/voices", tags=["Voice Engine"])
async def list_voices():
    return {"voices": list(AVAILABLE_VOICES.values())}


@app.post("/api/v1/video/generate", response_model=GenerateVideoResponse, tags=["Video Engine"])
async def create_video_job(payload: GenerateVideoRequest, background_tasks: BackgroundTasks):
    """
    Submits video generation job to queue, deducts 1 credit from user wallet,
    and returns task_id for polling or SSE streaming.
    """
    user = USER_WALLET_DB.get(payload.user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User account not found")

    if user["available_credits"] < 1:
        raise HTTPException(
            status_code=status.HTTP_402_PAYMENT_REQUIRED,
            detail="Insufficient rendering credits. Please top up via PromptPay QR."
        )

    # Deduct credit
    user["available_credits"] -= 1
    user["total_generated"] += 1

    task_id = f"task_{uuid.uuid4().hex[:12]}"
    TASKS_STORE[task_id] = {
        "task_id": task_id,
        "user_id": payload.user_id,
        "product_name": payload.product_name,
        "status": "QUEUED",
        "progress": 5,
        "current_stage": "กำลังจัดคิวเรนเดอร์ GPU Cluster (TH-BKK-02)",
        "created_at": time.time(),
        "stages": [
            {"name": "ดึงรูปภาพ & สเปกสินค้าจาก TikTok Shop", "duration": "0.4 วินาที", "status": "pending"},
            {"name": "เรียบเรียงสคริปต์ อย./สคบ. 30s (Gemini 2.5 Flash)", "duration": "1.2 วินาที", "status": "pending"},
            {"name": "สังเคราะห์เสียงพากย์ด้วยโมเดล Neural Voice TH", "duration": "กำลังดำเนินการ", "status": "pending"},
            {"name": "ตรวจคำตัดไทย (PyThaiNLP) และแม่นยำ Safe Zone", "duration": "รอดำเนินการ", "status": "pending"},
            {"name": "รวมวิดีโอ 9:16 ด้วย FFmpeg GPU Cluster 60fps", "duration": "รอดำเนินการ", "status": "pending"},
        ]
    }

    # Dispatch to Celery in production; simulate background task for standalone runtime
    async def _simulate_task():
        try:
            # Stage 1
            await asyncio.sleep(0.8)
            TASKS_STORE[task_id]["progress"] = 25
            TASKS_STORE[task_id]["current_stage"] = "เรียบเรียงสคริปต์สั้นป้ายยา (Claude/Gemini)"
            TASKS_STORE[task_id]["stages"][0]["status"] = "completed"
            TASKS_STORE[task_id]["stages"][1]["status"] = "running"

            # Stage 2
            await asyncio.sleep(1.2)
            TASKS_STORE[task_id]["progress"] = 50
            TASKS_STORE[task_id]["current_stage"] = "สังเคราะห์เสียงพากย์ Neural Voice TH (น้องฟ้า 1.1x)"
            TASKS_STORE[task_id]["stages"][1]["status"] = "completed"
            TASKS_STORE[task_id]["stages"][2]["status"] = "running"

            # Stage 3
            await asyncio.sleep(1.0)
            TASKS_STORE[task_id]["progress"] = 75
            TASKS_STORE[task_id]["current_stage"] = "ตรวจสอบตัดคำไทย (PyThaiNLP) และเรนเดอร์ ASS ซับไตเติล"
            TASKS_STORE[task_id]["stages"][2]["status"] = "completed"
            TASKS_STORE[task_id]["stages"][3]["status"] = "running"

            # Stage 4
            await asyncio.sleep(1.2)
            TASKS_STORE[task_id]["progress"] = 90
            TASKS_STORE[task_id]["current_stage"] = "คอมโพสิต FFmpeg NVENC 9:16 & Audio Ducking 0.12x"
            TASKS_STORE[task_id]["stages"][3]["status"] = "completed"
            TASKS_STORE[task_id]["stages"][4]["status"] = "running"

            # Finish
            await asyncio.sleep(1.0)
            TASKS_STORE[task_id]["progress"] = 100
            TASKS_STORE[task_id]["status"] = "COMPLETED"
            TASKS_STORE[task_id]["current_stage"] = "เสร็จสมบูรณ์ พร้อมดาวน์โหลดและยิงแอด TikTok Shop"
            TASKS_STORE[task_id]["stages"][4]["status"] = "completed"
            TASKS_STORE[task_id]["output_video_url"] = "/media/rendered_sample.mp4"
            TASKS_STORE[task_id]["ass_subtitle_url"] = "/media/rendered_sample.ass"
        except Exception as e:
            TASKS_STORE[task_id]["status"] = "FAILED"
            TASKS_STORE[task_id]["error"] = str(e)

    background_tasks.add_task(_simulate_task)

    return GenerateVideoResponse(
        task_id=task_id,
        status="SUBMITTED",
        message="Video rendering task submitted to GPU Cluster. Deducted 1 credit.",
        remaining_credits=user["available_credits"],
        estimated_duration_sec=28.4
    )


@app.get("/api/v1/video/status/{task_id}", tags=["Video Engine"])
async def get_task_status(task_id: str):
    task = TASKS_STORE.get(task_id)
    if not task:
        raise HTTPException(status_code=404, detail=f"Task {task_id} not found")
    return task


@app.get("/api/v1/video/stream/{task_id}", tags=["Video Engine"])
async def stream_task_progress(task_id: str):
    """
    Server-Sent Events (SSE) streaming endpoint for live progress updates.
    """
    if task_id not in TASKS_STORE:
        raise HTTPException(status_code=404, detail="Task not found")

    async def event_generator() -> AsyncGenerator[str, None]:
        while True:
            task = TASKS_STORE.get(task_id)
            if not task:
                break
            payload = json.dumps(task, ensure_ascii=False)
            yield f"data: {payload}\n\n"
            if task.get("status") in ["COMPLETED", "FAILED"]:
                break
            await asyncio.sleep(0.5)

    return StreamingResponse(event_generator(), media_type="text/event-stream")


@app.post("/api/v1/payment/promptpay-webhook", tags=["Payment"])
async def handle_promptpay_webhook(payload: PromptPayWebhookPayload):
    """
    Receives automated Instant QR webhook payment notifications from bank / Opn / Omise / Stripe
    to instantly top up user wallet credits.
    """
    user = USER_WALLET_DB.get(payload.user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Conversion rate: ~฿8.20 per clip for Popular package, or calculate added credits
    credits_added = 0
    if payload.amount_thb >= 690:
        credits_added = 100
    elif payload.amount_thb >= 290:
        credits_added = 35
    elif payload.amount_thb >= 99:
        credits_added = 10
    else:
        credits_added = int(payload.amount_thb / 9.9)

    user["balance_thb"] += payload.amount_thb
    user["available_credits"] += credits_added

    logger.info(
        f"[PromptPay Webhook] Received ฿{payload.amount_thb} from {payload.sender_bank} "
        f"(Ref: {payload.qr_reference}). Added {credits_added} credits to {payload.user_id}."
    )

    return {
        "status": "success",
        "transaction_id": payload.transaction_id,
        "amount_received_thb": payload.amount_thb,
        "credits_added": credits_added,
        "new_balance_credits": user["available_credits"],
        "received_at": time.strftime("%Y-%m-%d %H:%M:%S"),
    }


# Testing & Debug Endpoints
@app.post("/api/v1/test/tokenize", tags=["Testing"])
async def test_thai_tokenizer(request: Request):
    data = await request.json()
    text = data.get("text", "น้ำพริกหนุ่มสูตรเมืองเหนือแท้ ลำแต๊ๆ เจ้า")
    normalizer = ThaiTextNormalizer()
    service = SubtitleService()

    tokens = service.tokenize_thai_words(text)
    visual_len = normalizer.get_visual_length(text)
    standard_len = len(text)
    wrapped = service.wrap_thai_text(text, max_visual_chars=20)

    return {
        "original_text": text,
        "standard_length": standard_len,
        "visual_length_excluding_diacritics": visual_len,
        "pythainlp_word_tokens": tokens,
        "wrapped_ass_lines": wrapped.split(r"\N"),
    }


@app.post("/api/v1/test/compliance", tags=["Testing"])
async def test_compliance(request: Request):
    data = await request.json()
    text = data.get("text", "")
    llm = ScriptGenerator()
    passed, flagged = llm.validate_thai_compliance(text)
    return {
        "text": text,
        "compliance_passed": passed,
        "flagged_claims": flagged,
        "advice": "ข้อความผ่านเกณฑ์ อย. & สคบ." if passed else f"พบคำโฆษณาเกินจริงที่ผิดกฎหมาย: {', '.join(flagged)}"
    }
