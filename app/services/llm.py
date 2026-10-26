"""
Thai E-Commerce LLM Script Generator with Regulatory Guardrails.
Enforces a 3-part viral retention structure (Hook 0-3s, Value 4-25s, CTA final 5s),
strict Thai FDA (อย.) & สคบ. compliance filtering, and Asian-demographic footage search queries.
"""

from __future__ import annotations

import json
import logging
import os
import re
from enum import Enum
from typing import Any, Dict, List, Optional
try:
    from pydantic import BaseModel, Field
    HAS_PYDANTIC = True
except ImportError:
    HAS_PYDANTIC = False
    from dataclasses import dataclass, field
    class BaseModel:
        def __init__(self, **kwargs):
            for k, v in kwargs.items():
                setattr(self, k, v)
        @classmethod
        def model_validate(cls, d):
            return cls(**d)
    def Field(*args, **kwargs):
        default = kwargs.get("default", ...)
        default_factory = kwargs.get("default_factory")
        if default_factory:
            return field(default_factory=default_factory)
        return default


# Prohibited exaggerated medical/cosmetic claims under Thai FDA (อย.) & สคบ. regulations
BANNED_THAI_ADVERTISING_CLAIMS = [
    "หายขาด",
    "ขาวทันที",
    "ขาวไวใน 3 วัน",
    "ขาวถาวร",
    "ลด 10 โลใน 3 วัน",
    "ลดความอ้วนเร่งด่วน",
    "รักษาได้ทุกโรค",
    "การันตีผล 100%",
    "ไร้ผลข้างเคียง 100%",
    "ยาเทวดา",
    "เห็นผลทันทีตั้งแต่เม็ดแรก",
    "ผอมถาวร",
    "หน้าเด้งใน 1 นาที",
]


class ScriptStage(str, Enum):
    HOOK = "hook"          # 0-3 seconds: High curiosity, scroll-stopping
    RELATE_VALUE = "value" # 4-25 seconds: Pain point, demonstration, benefits
    CTA = "cta"            # final 5 seconds: Basket tap, urgency, discount voucher


class ScriptSegment(BaseModel):
    segment_id: int
    stage: ScriptStage
    start_sec: float
    end_sec: float
    thai_voiceover: str = Field(
        ...,
        description="Natural conversational Thai voiceover script with natural emotional pauses."
    )
    search_term: str = Field(
        ...,
        description="Dedicated English stock footage query explicitly containing Asian demographic keywords."
    )
    on_screen_action: str = Field(
        ...,
        description="Description of what appears on screen, product close-ups, and text badge overlays."
    )


class VideoScriptResponse(BaseModel):
    product_name: str
    target_audience: str
    total_duration_sec: float
    hook_angle: str
    segments: List[ScriptSegment]
    compliance_passed: bool = True
    flagged_terms: List[str] = Field(default_factory=list)


class ProductScriptRequest(BaseModel):
    product_name: str
    product_url: Optional[str] = None
    price_thb: Optional[float] = 290.0
    key_selling_points: List[str]
    target_persona: str = "Thai TikTok Shopper / Gen Z & Millennials"
    voice_character: str = "excited_influencer"  # excited_influencer, casual_honest, official_expert, storytelling
    duration_target_sec: int = 30


class ScriptGenerator:
    """
    Generates viral TikTok Shop scripts with built-in regulatory compliance checks.
    """

    SYSTEM_PROMPT = """
You are the Lead Thai Social Commerce Creative Director and Conversion Copywriter for TikTok Shop Thailand.
Your mission is to generate viral, high-converting 9:16 short-form video scripts for Thai consumers.

STRICT RETENTION STRUCTURE:
1. Hook (0-3s): Stop the scroll immediately. Use curiosity, relatable daily frustration, or startling contrast.
2. Relate & Value (4-25s): Showcase real experience, authentic texture/usage, address pain points without being robotic.
3. Call-to-Action (Final 5s): Direct users to the yellow basket (ตะกร้าเหลืองซ้ายล่าง), highlight flash vouchers, or free shipping.

STRICT LEGAL & COMPLIANCE GUARDRAILS (Thai FDA อย. & สคบ.):
You must NEVER use illegal exaggerated claims such as:
- 'หายขาด'
- 'ขาวทันที'
- 'ขาวไวใน 3 วัน'
- 'ลด 10 โลใน 3 วัน'
- 'รักษาได้ทุกโรค'
- 'การันตี 100%'
- 'ผอมถาวร'
Instead, use compliant lifestyle claims like 'ผิวดูชุ่มชื้นอิ่มน้ำ', 'ช่วยดูแลผิวอย่างอ่อนโยน', 'คุมมันระหว่างวัน', 'รู้สึกสบายผิว'.

DEMOGRAPHIC & B-ROLL MANDATE:
For EVERY segment, provide a high-intent English 'search_term' for stock video search.
It MUST explicitly include Asian demographic and situational context keywords:
Examples:
- 'Asian woman applying glowing serum face mirror bathroom morning light'
- 'Thai creator unboxing skincare bottle natural sunlight texture swatch'
- 'Close up Asian hands holding product pointing yellow cart discount'

OUTPUT FORMAT:
Return pure structured JSON matching the VideoScriptResponse schema.
"""

    def validate_thai_compliance(self, text: str) -> Tuple[bool, List[str]]:
        """
        Validates whether script contains forbidden Thai FDA or consumer protection keywords.
        """
        flagged: List[str] = []
        for term in BANNED_THAI_ADVERTISING_CLAIMS:
            if term in text:
                flagged.append(term)
        return len(flagged) == 0, flagged

    def generate_script_sync_fallback(self, request: ProductScriptRequest) -> VideoScriptResponse:
        """
        High-performing deterministic fallback generator when LLM API keys are offline or in mock test mode.
        """
        p_name = request.product_name
        bullets = ", ".join(request.key_selling_points[:3]) if request.key_selling_points else "ของดีประจำตะกร้า"
        price_str = f"{request.price_thb:.0f}" if request.price_thb else "หลักร้อย"

        segments = [
            ScriptSegment(
                segment_id=1,
                stage=ScriptStage.HOOK,
                start_sec=0.0,
                end_sec=3.2,
                thai_voiceover=f"ตัวนี้เลยทุกคน! ใครที่มองหา{p_name} บอกเลยว่าคลิปนี้มีคำตอบ!",
                search_term="Surprised Asian woman looking at phone screen excited expression indoor",
                on_screen_action="Fast zoom on creator holding product with curiosity badge"
            ),
            ScriptSegment(
                segment_id=2,
                stage=ScriptStage.RELATE_VALUE,
                start_sec=3.2,
                end_sec=12.5,
                thai_voiceover=f"น้องช่วยเรื่อง{bullets} ใช้งานง่ายมาก แถมเนื้อสัมผัสบางเบา ไม่เหนียวเหนอะหนะ",
                search_term="Asian young woman skincare application close up smooth glowing skin texture",
                on_screen_action="B-roll demo of product texture and application on skin"
            ),
            ScriptSegment(
                segment_id=3,
                stage=ScriptStage.RELATE_VALUE,
                start_sec=12.5,
                end_sec=24.0,
                thai_voiceover=f"เค้าจัดโปรลดเหลือแค่ {price_str} บาทในตะกร้าตอนนี้ คุ้มเกินราคาไปมาก!",
                search_term="Asian creator showing product packaging genuine smile cozy room desk",
                on_screen_action="Unboxing shot with flash voucher animation overlay"
            ),
            ScriptSegment(
                segment_id=4,
                stage=ScriptStage.CTA,
                start_sec=24.0,
                end_sec=29.5,
                thai_voiceover="กดสั่งที่ตะกร้าเหลืองซ้ายล่างได้เลยก่อนคูปองส่งฟรีจะหมดนะทุกคน!",
                search_term="Asian hand tapping yellow cart icon smartphone screen TikTok shopping",
                on_screen_action="Finger pointing down to TikTok yellow basket safe zone"
            ),
        ]

        full_text = " ".join([s.thai_voiceover for s in segments])
        passed, flagged = self.validate_thai_compliance(full_text)

        return VideoScriptResponse(
            product_name=p_name,
            target_audience=request.target_persona,
            total_duration_sec=29.5,
            hook_angle="Curiosity & Price Drop Urgency",
            segments=segments,
            compliance_passed=passed,
            flagged_terms=flagged
        )

    async def generate_script(self, request: ProductScriptRequest) -> VideoScriptResponse:
        """
        Asynchronously generates script using Gemini API if GEMINI_API_KEY is available,
        otherwise gracefully falls back to deterministic e-commerce template engine.
        """
        api_key = os.environ.get("GEMINI_API_KEY")

        if not api_key or api_key == "MY_GEMINI_API_KEY":
            logger.info("GEMINI_API_KEY not configured. Using deterministic viral template generator.")
            return self.generate_script_sync_fallback(request)

        try:
            from google import genai
            from google.genai import types

            client = genai.Client(api_key=api_key)
            prompt = f"""
Generate a 30-second Thai TikTok Shop video script for:
Product: {request.product_name}
Price: {request.price_thb} THB
Key Benefits: {', '.join(request.key_selling_points)}
Target Persona: {request.target_persona}
Voice Character: {request.voice_character}

Remember:
- Hook (0-3s)
- Relate & Value (4-25s)
- CTA (25-30s) pointing to yellow cart
- Strictly NO banned FDA claims (no หายขาด, ขาวทันที, ลด 10 โล)
- English search_term with Asian demographic keywords for stock footage.
"""
            response = client.models.generate_content(
                model="gemini-2.5-flash",
                contents=prompt,
                config=types.GenerateContentConfig(
                    system_instruction=self.SYSTEM_PROMPT,
                    response_mime_type="application/json",
                    response_schema=VideoScriptResponse,
                    temperature=0.7,
                ),
            )

            result_dict = json.loads(response.text)
            script_resp = VideoScriptResponse.model_validate(result_dict)

            # Re-verify compliance locally
            all_thai = " ".join([s.thai_voiceover for s in script_resp.segments])
            passed, flagged = self.validate_thai_compliance(all_thai)
            script_resp.compliance_passed = passed
            script_resp.flagged_terms = flagged

            return script_resp

        except Exception as e:
            logger.warning(f"Gemini API generation failed: {e}. Falling back to template generator.")
            return self.generate_script_sync_fallback(request)
