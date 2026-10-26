"""
Backend service modules for subtitle processing, FFmpeg video compositing,
Thai E-Commerce LLM scripting, and high-inflection TTS.
"""

from .subtitle import SubtitleService, SubtitleConfig, ThaiTextNormalizer
from .video import VideoCompositor, VideoCompositionConfig, HardwareEncoder
from .llm import ScriptGenerator, ProductScriptRequest, VideoScriptResponse
from .voice import TTSServiceFactory, BaseTTSProvider, EdgeTTSProvider, ElevenLabsTTSProvider, BotnoiTTSProvider

__all__ = [
    "SubtitleService",
    "SubtitleConfig",
    "ThaiTextNormalizer",
    "VideoCompositor",
    "VideoCompositionConfig",
    "HardwareEncoder",
    "ScriptGenerator",
    "ProductScriptRequest",
    "VideoScriptResponse",
    "TTSServiceFactory",
    "BaseTTSProvider",
    "EdgeTTSProvider",
    "ElevenLabsTTSProvider",
    "BotnoiTTSProvider",
]
