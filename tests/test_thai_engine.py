"""
Unit Tests for Thai Social Commerce Video Generator Core Logic.
Validates:
- Thai zero-width vowel and tone mark length normalization
- 18-22 character line wrapping
- Subtitle ASS Safe Zone configuration (1080x1920, MarginV: 420px, Alignment: 2)
- FFmpeg libass path escaping (Windows and Linux)
- Thai FDA (อย.) & สคบ. prohibited advertising claims detector
"""

import unittest
from pathlib import Path

from app.services.subtitle import ThaiTextNormalizer, SubtitleConfig, SubtitleService, SubtitleSegment
from app.services.video import VideoCompositor
from app.services.llm import ScriptGenerator, BANNED_THAI_ADVERTISING_CLAIMS


class TestThaiSubtitleEngine(unittest.TestCase):
    def test_zero_width_normalization(self):
        # "น้ำพริก" -> น (1) + ้ำ (2: ำ is sara am or mai tho + sara am) + พ (1) + ร (1) + ิ (zero width) + ก (1)
        # raw len is 7, but visual width must strip diacritics
        text = "น้ำพริกหนุ่ม"
        raw_len = len(text)
        visual_len = ThaiTextNormalizer.get_visual_length(text)
        self.assertLess(visual_len, raw_len)

    def test_line_wrapping(self):
        service = SubtitleService()
        long_sentence = "ตัวนี้เลยทุกคน ทาคินเดียวตื่นมาผิวฟูอิ่มน้ำมาก ชุ่มชื้นแบบสุดๆ"
        wrapped = service.wrap_thai_text(long_sentence, max_visual_chars=20)
        self.assertIn(r"\N", wrapped)

    def test_ass_safe_zone_config(self):
        config = SubtitleConfig()
        self.assertEqual(config.play_res_x, 1080)
        self.assertEqual(config.play_res_y, 1920)
        self.assertEqual(config.margin_v, 420)  # TikTok cart basket safe zone
        self.assertEqual(config.alignment, 2)   # Bottom Center
        self.assertEqual(config.font_size, 72)
        self.assertEqual(config.primary_color, "&H0000E6FF")  # Yellow

    def test_ffmpeg_path_escaping(self):
        # Test Windows drive letter and backslash escaping
        fake_win_path = "C:\\video\\sub.ass"
        escaped = VideoCompositor.escape_ffmpeg_path(fake_win_path)
        self.assertIn(r"\:", escaped)
        self.assertNotIn("C:", escaped)  # unescaped colon should not exist



class TestThaiComplianceValidator(unittest.TestCase):
    def test_banned_claims_detection(self):
        generator = ScriptGenerator()
        violating_text = "เซรั่มตัวนี้ช่วยให้หายขาดจากฝ้า และขาวทันทีใน 3 วัน การันตี 100%"
        passed, flagged = generator.validate_thai_compliance(violating_text)
        self.assertFalse(passed)
        self.assertIn("หายขาด", flagged)
        self.assertIn("ขาวทันที", flagged)

    def test_compliant_claims_pass(self):
        generator = ScriptGenerator()
        safe_text = "เซรั่มไฮยาบำรุงผิว ช่วยให้ผิวดูอิ่มน้ำชุ่มชื้น สบายผิวตลอดวัน"
        passed, flagged = generator.validate_thai_compliance(safe_text)
        self.assertTrue(passed)
        self.assertEqual(len(flagged), 0)


if __name__ == "__main__":
    unittest.main()
