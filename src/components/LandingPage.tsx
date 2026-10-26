import React, { useState } from 'react';
import { 
  Sparkles, 
  CheckCircle2, 
  Check,
  Zap, 
  QrCode, 
  ShieldCheck, 
  Play, 
  ArrowRight, 
  Layers, 
  Download, 
  Star, 
  Volume2, 
  XCircle,
  TrendingUp,
  Cpu,
  ChevronRight
} from 'lucide-react';

import { AppTab } from '../types';

interface LandingPageProps {
  onGoToStudio: () => void;
  onOpenPromptPay: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onGoToStudio,
  onOpenPromptPay,
}) => {
  const [instantUrl, setInstantUrl] = useState('https://vt.tiktok.com/ZS6Y9qR1A/');
  const [instantVoice, setInstantVoice] = useState('เสียง: เพื่อนสาวขี้วี้ป้ายยา (Energy สูง)');
  const [activeVoiceSample, setActiveVoiceSample] = useState<string | null>(null);

  const toggleVoiceSample = (id: string) => {
    setActiveVoiceSample(activeVoiceSample === id ? null : id);
  };

  return (
    <div className="flex flex-col w-full pb-20 space-y-16">
      {/* Hero Section */}
      <div className="relative pt-6 sm:pt-10 flex flex-col items-center text-center max-w-4xl mx-auto space-y-6 px-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-semibold shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>AI Video Generator อันดับ 1 เพื่อครีเอเตอร์ TikTok Shop ไทย</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
          ปั๊มคลิปป้ายยา TikTok Shop ใน 30 วิ ด้วย AI ภาษาไทยแท้ 100%
        </h1>

        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs sm:text-sm text-slate-600 font-medium">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>แก้ปัญหาสระลอย ตัดคำไม่แตก</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>บทพูดรีวิวมั่นใจเป็นธรรมชาติ</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>จ่ายผ่าน PromptPay ทันที ไม่ผูกบัตร</span>
          </div>
        </div>

        {/* Instant Generator Bar Container */}
        <div className="w-full max-w-2xl bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-xl space-y-3.5 text-left">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span className="flex items-center gap-1.5 text-slate-800 font-bold">
              <Zap className="w-4 h-4 text-orange-500" />
              ทดลองสร้างวิดีโอป้ายยาทันที (Instant Generator)
            </span>
            <span className="text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-mono">
              TikTok Shop & Shopee Ready
            </span>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] text-slate-500">URL สินค้าจาก TikTok Shop หรือ Shopee</label>
            <div className="flex items-center gap-2 border border-slate-200 rounded-xl px-3 py-2 bg-slate-50/50 focus-within:border-blue-500 focus-within:bg-white transition-colors">
              <span className="text-slate-400 text-xs">🔗</span>
              <input
                type="text"
                value={instantUrl}
                onChange={(e) => setInstantUrl(e.target.value)}
                className="w-full bg-transparent text-xs font-mono outline-none text-slate-900"
                placeholder="https://vt.tiktok.com/..."
              />
              <button 
                onClick={() => setInstantUrl('https://vt.tiktok.com/ZS6Y9qR1A/')}
                className="text-[10px] text-blue-600 font-semibold hover:underline whitespace-nowrap"
              >
                ตัวอย่างลิงก์
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <select
              value={instantVoice}
              onChange={(e) => setInstantVoice(e.target.value)}
              className="px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-700 outline-none"
            >
              <option>เสียง: เพื่อนสาวขี้วี้ป้ายยา (Energy สูง)</option>
              <option>เสียง: แกะกล่องเมาท์มอย (Casual Honest)</option>
              <option>เสียง: ผู้เชี่ยวชาญน่าเชื่อถือ (Official)</option>
              <option>เสียง: เรื่องเล่าแรงบันดาลใจ (Storytelling)</option>
            </select>

            <button
              onClick={onGoToStudio}
              className="py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>เจนคลิปทดลองฟรี (ไม่ต้องล็อกอิน)</span>
            </button>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-100">
            <span>สร้างไปแล้วกว่า <strong>148,200</strong> คลิปในไทย</span>
            <span className="text-emerald-700 font-semibold">📈 Conversion เพิ่มขึ้นเฉลี่ย 3.4x</span>
          </div>
        </div>

        {/* Social Proof Avatars */}
        <div className="flex items-center gap-3 pt-2">
          <div className="flex -space-x-2">
            <img className="w-7 h-7 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=50&auto=format&fit=crop&q=80" alt="user" />
            <img className="w-7 h-7 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&auto=format&fit=crop&q=80" alt="user" />
            <img className="w-7 h-7 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=50&auto=format&fit=crop&q=80" alt="user" />
          </div>
          <span className="text-xs text-slate-500 font-medium">
            ได้รับการไว้วางใจจากครีเอเตอร์และยอดขายหลักล้านกว่า <strong>18,500+ คน</strong>
          </span>
        </div>
      </div>

      {/* Feature 1: Subtitle Perfection (PyThaiNLP Engine) */}
      <div className="max-w-4xl mx-auto w-full px-4 space-y-6">
        <div className="text-center space-y-2">
          <div className="text-xs font-bold text-blue-700 tracking-wider uppercase">
            BUILT SPECIFICALLY FOR THAI SOCIAL COMMERCE
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            ทำไมครีเอเตอร์ไทย 18,500+ คนเลือก ClipTurbo TH
          </h2>
          <p className="text-sm text-slate-500 max-w-xl mx-auto">
            หมดปัญหาใช้วิดีโอ AI เมืองนอกที่ซับไตเติลภาษาไทยเพี้ยน สระลอย คำขาดตอน และเสียงพากย์ไร้อารมณ์
          </p>
        </div>

        {/* Comparison Showcase Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">เทคโนโลยี Subtitle Perfection (สระไม่ลอย คำไม่แตก)</h3>
                <p className="text-xs text-slate-500">ขับเคลื่อนด้วย PyThaiNLP Dictionary Engine + libass 4K Renderer มาตรฐานสตรีมมิ่ง</p>
              </div>
            </div>
            <span className="text-xs text-blue-700 bg-blue-50 px-3 py-1 rounded-full font-semibold border border-blue-200/60 hidden sm:inline-block">
              100% Thai Tokenization
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Bad Foreign AI */}
            <div className="p-5 rounded-2xl bg-slate-900 text-white space-y-3 relative overflow-hidden border border-red-500/30">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-red-400 flex items-center gap-1.5">
                  <XCircle className="w-4 h-4" />
                  ก่อนใช้ (Foreign AI ทั่วไป)
                </span>
                <span className="text-[10px] bg-red-500/20 text-red-300 px-2 py-0.5 rounded">ตัดคำผิด • สระลอย</span>
              </div>
              
              <div className="p-4 rounded-xl bg-black/60 border border-red-500/20 text-center font-mono">
                <div className="text-[11px] text-red-300 mb-1">Rendering Error Sample:</div>
                <div className="text-lg font-bold tracking-widest text-slate-300">
                  น้ำ พ รั ก ห นุ่ ม
                </div>
                <div className="text-[10px] text-red-400 mt-1">สระชำรุด + คำตัดกลางวรรค</div>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">
                ระบบเดิมไม่เข้าใจภาษาไทย และแยกพยางค์ผิด ทำให้ผู้ชมรู้สึกสะดุด ส่งผลให้ยอด Retention ตกฮวบใน 3 วินาทีแรก
              </p>
            </div>

            {/* Perfect ClipTurbo Engine */}
            <div className="p-5 rounded-2xl bg-blue-950 text-white space-y-3 relative overflow-hidden border border-blue-500/40">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  หลังใช้ (ClipTurbo TH Engine)
                </span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded">แม่นยำ 99.8% • คมชัด 4K</span>
              </div>

              <div className="p-4 rounded-xl bg-blue-900/40 border border-blue-500/30 text-center">
                <div className="text-[11px] text-blue-300 mb-1">PyThaiNLP + ASS Perfect Shaper:</div>
                <div className="text-lg font-bold text-yellow-300">
                  "น้ำพริกหนุ่มสูตรเมืองเหนือแท้ ลำแต๊ๆ เจ้า"
                </div>
                <div className="text-[10px] text-emerald-400 mt-1">✨ ตัดตามความหมาย • สระและวรรณยุกต์เรียงระเบียบ 100%</div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                วิเคราะห์พยางค์ภาษาไทยตามไวยากรณ์และแสลง TikTok ล่าสุด จัดวางตำแหน่งอักษรและวรรณยุกต์สมบูรณ์แบบ เพิ่มเวลาการดูคลิปทันที
              </p>
            </div>
          </div>
        </div>

        {/* 2 Key Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Feature 2: 4 Voice Characters */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">ระบบพากย์เสียงไทยแท้ 4 คาแรคเตอร์</h3>
                <p className="text-xs text-slate-500">จังหวะหายใจ ทรงพลัง มีลูกเล่น เหมือนเพื่อนมานั่งป้ายยาข้างหู</p>
              </div>
            </div>

            <div className="space-y-2">
              {[
                { id: 'v1', name: 'เพื่อนสาวป้ายยา (Energy สูง)', quote: '"แกรรรร ตัวนี้ดีจนอยากมารีวิว สรุปคือดีจริงไม่จกตา!"' },
                { id: 'v2', name: 'แกะกล่องเมาท์มอย (Casual Honest)', quote: '"เพิ่งได้พัสดุมาเลย มารอดูกันว่าจะคุ้มราคาหลักร้อยมั้ย..."' },
                { id: 'v3', name: 'ผู้เชี่ยวชาญน่าเชื่อถือ (Official)', quote: '"นวัตกรรมสารสกัดเข้มข้น มีใบรับรองมาตรฐานระดับสากล"' },
                { id: 'v4', name: 'เรื่องเล่าแรงบันดาลใจ (Storytelling)', quote: '"ใครที่กำลังเจอปัญหานี้ ฟังคลิปนี้ให้จบ 30 วินาทีรู้เรื่อง"' },
              ].map((v) => (
                <div key={v.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                  <div className="min-w-0 pr-2">
                    <div className="font-bold text-slate-800">{v.name}</div>
                    <div className="text-[11px] text-slate-500 italic truncate mt-0.5">{v.quote}</div>
                  </div>
                  <button
                    onClick={() => toggleVoiceSample(v.id)}
                    className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors flex-shrink-0 ${
                      activeVoiceSample === v.id ? 'bg-orange-500 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {activeVoiceSample === v.id ? <Volume2 className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current ml-0.5" />}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Feature 3: One-click export & CapCut */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center font-bold">
                  3
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">One-Click Export & CapCut Ready</h3>
                  <p className="text-xs text-slate-500">ยืดหยุ่นสูงสุด เรนเดอร์คลิปรวดเร็ว นำไปยิงแอดได้สละสลวย</p>
                </div>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-800">โหมด A: เรนเดอร์ครบในคลิกเดียว</strong>
                    <div className="text-slate-500 text-[11px] mt-0.5">ได้ไฟล์ MP4 60fps ความละเอียด Full HD พร้อมเพลงฮิตติดเทรนด์ TikTok ไม่ติดลิขสิทธิ์</div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-800">โหมด B: แยกแอสเซ็ตอิสระ (CapCut / Premiere)</strong>
                    <div className="text-slate-500 text-[11px] mt-0.5">แยกเสียงพากย์ MP3 + แคปชั่น ASS/SRT + ฟุตเทจ B-Roll เหมาะกับสายตัดต่อที่ต้องการปรับแต่งเพิ่มเติม</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-blue-50 text-blue-900 border border-blue-100 text-xs flex items-center justify-between">
              <span className="flex items-center gap-1.5 font-medium">
                <Zap className="w-4 h-4 text-blue-600" />
                เรนเดอร์เฉลี่ยเพียง 28 วินาทีต่อคลิป
              </span>
              <span className="font-bold text-[11px] bg-blue-600 text-white px-2 py-0.5 rounded">GPU Boost Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Section with PromptPay Instant QR */}
      <div className="max-w-4xl mx-auto w-full px-4 space-y-8">
        <div className="text-center space-y-2">
          <div className="text-xs font-bold text-orange-600 tracking-wider uppercase">
            NO SUBSCRIPTION • PROMPTPAY INSTANT CREDIT
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            แพ็กเกจเติมเครดิตตามจริง (ไม่ผูกบัตร ไม่หักต่ออายุอัตโนมัติ)
          </h2>
          <p className="text-sm text-slate-500">
            จ่ายผ่าน QR Code พร้อมเพย์ เงินเข้าเครดิตภายใน 3 วินาที เครดิตไม่มีวันหมดอายุ
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {/* Starter Plan */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div>
                <div className="text-sm font-bold text-slate-900">Starter</div>
                <div className="text-xs text-slate-500">เหมาะสำหรับมือใหม่เริ่มต้นช่อง TikTok Shop</div>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-slate-900">฿99</span>
                <span className="text-xs text-slate-500">/ 10 คลิป</span>
              </div>
              <div className="text-[11px] text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md font-semibold inline-block">
                ตกคลิปละ 9.9 บาท
              </div>
              <ul className="space-y-2 text-xs text-slate-600">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>สร้างได้ 10 วิดีโอ Full HD</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>4 เสียงพากย์ภาษาไทยแท้</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>เครดิตไม่มีวันหมดอายุ</span>
                </li>
              </ul>
            </div>

            <button
              onClick={onOpenPromptPay}
              className="w-full py-2.5 rounded-xl border border-slate-200 hover:border-slate-300 text-slate-800 text-xs font-semibold transition-colors"
            >
              เลือกแพ็กเกจนี้
            </button>
          </div>

          {/* Creator Popular Plan */}
          <div className="bg-white rounded-3xl p-6 border-2 border-blue-600 shadow-lg flex flex-col justify-between space-y-6 relative">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-bold shadow-xs">
              ยอดนิยม 🔥
            </span>

            <div className="space-y-4">
              <div>
                <div className="text-sm font-bold text-slate-900">Creator Popular</div>
                <div className="text-xs text-slate-500">สำหรับนายหน้า TikTok & Shopee มือโปร</div>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-slate-900">฿290</span>
                <span className="text-xs text-slate-500">/ 35 คลิป</span>
              </div>
              <div className="text-[11px] text-orange-700 bg-orange-50 px-2.5 py-1 rounded-md font-semibold inline-block">
                ตกคลิปละ 8.2 บาท (ประหยัด 20%)
              </div>
              <ul className="space-y-2 text-xs text-slate-600">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>สร้างได้ 35 วิดีโอ Full HD</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>ระบบวิเคราะห์สินค้าไวรัล AI</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>แยกแอสเซ็ตไฟล์ CapCut XML ได้</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>ระบบเร่งความเร็ว GPU Turbo</span>
                </li>
              </ul>
            </div>

            <button
              onClick={onOpenPromptPay}
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all"
            >
              เลือกแพ็กเกจยอดนิยม
            </button>
          </div>

          {/* Power Seller Plan */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div>
                <div className="text-sm font-bold text-slate-900">Power Seller</div>
                <div className="text-xs text-slate-500">สำหรับร้านค้า Official & เอเจนซี่ยิงหลายช่อง</div>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-slate-900">฿690</span>
                <span className="text-xs text-slate-500">/ 100 คลิป</span>
              </div>
              <div className="text-[11px] text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md font-semibold inline-block">
                ถูกสุดเพียง 6.9 บาท/คลิป
              </div>
              <ul className="space-y-2 text-xs text-slate-600">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>สร้างได้ 100 วิดีโอ 4K UHD</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>สิทธิ์เรนเดอร์ Batch 10 คลิปพร้อมกัน</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>ออกใบเสร็จภาษีเต็มรูป ภพ.20 ได้</span>
                </li>
              </ul>
            </div>

            <button
              onClick={onOpenPromptPay}
              className="w-full py-2.5 rounded-xl border border-slate-200 hover:border-slate-300 text-slate-800 text-xs font-semibold transition-colors"
            >
              เลือกแพ็กเกจนี้
            </button>
          </div>
        </div>
      </div>

      {/* 4 Stats Grid */}
      <div className="max-w-4xl mx-auto w-full px-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
        <div className="p-4 rounded-2xl bg-white border border-slate-200">
          <div className="text-2xl sm:text-3xl font-bold text-slate-900">28 วินาที</div>
          <div className="text-xs text-slate-500 mt-1">ความเร็วเรนเดอร์เฉลี่ย</div>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-slate-200">
          <div className="text-2xl sm:text-3xl font-bold text-slate-900">148K+</div>
          <div className="text-xs text-slate-500 mt-1">คลิปที่ส่งออกบน TikTok</div>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-slate-200">
          <div className="text-2xl sm:text-3xl font-bold text-blue-600">3.4x</div>
          <div className="text-xs text-slate-500 mt-1">ยอด Conversion คลิกตะกร้า</div>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-slate-200">
          <div className="text-2xl sm:text-3xl font-bold text-emerald-600">99.8%</div>
          <div className="text-xs text-slate-500 mt-1">ความถูกต้องซับไตเติลภาษาไทย</div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="max-w-4xl mx-auto w-full px-4 grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-3">
          <div className="flex text-amber-400 text-xs">★★★★★</div>
          <p className="text-xs text-slate-600 italic leading-relaxed">
            "ปกติจ้างตัดคลิป TikTok ตัวละ 300-500 บาท แถมแก้งาน 3 วัน มาใช้ ClipTurbo TH วางลิงก์แป๊บเดียวได้คลิปพร้อมเสียงพากย์ตื่นเต้นมาก ยอดขายตะกร้าแดงแตะล้าน คุ้มสุดๆ ค่ะ"
          </p>
          <div className="flex items-center gap-2.5 pt-1">
            <img className="w-8 h-8 rounded-full object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60&auto=format&fit=crop&q=80" alt="Bella" />
            <div>
              <div className="text-xs font-bold text-slate-900">คุณแพรว (Bella Shop)</div>
              <div className="text-[10px] text-slate-400">ยอดขาย TikTok Shop ฿850k / เดือน</div>
            </div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-3">
          <div className="flex text-amber-400 text-xs">★★★★★</div>
          <p className="text-xs text-slate-600 italic leading-relaxed">
            "จุดตายของ AI เจ้าอื่นคือ สระกับวรรณยุกต์ชอบบินจนคนดูด่า แต่ของ ClipTurbo ทำซับไทยได้เนียนกริบจริง มี Safe zone ไม่บังตะกร้าเหลือง ไม่ต้องมานั่งแต่งเองใน CapCut"
          </p>
          <div className="flex items-center gap-2.5 pt-1">
            <img className="w-8 h-8 rounded-full object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&auto=format&fit=crop&q=80" alt="Benz" />
            <div>
              <div className="text-xs font-bold text-slate-900">คุณเบนซ์ นายหัวสายสต็อก</div>
              <div className="text-[10px] text-slate-400">Affiliate Creator 12 ช่องทาง</div>
            </div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-3">
          <div className="flex text-amber-400 text-xs">★★★★★</div>
          <p className="text-xs text-slate-600 italic leading-relaxed">
            "ชอบระบบสแกน PromptPay มากที่สุด ไม่ต้องกลัวโดนหักบัตรเครดิตรายเดือนลืมๆ อยากปั๊มคลิปช่วงแคมเปญ 9.9 หรือ 11.11 ค่อยเติม 690 บาท คล่องตัวสุดๆ สำหรับเอเจนซี่"
          </p>
          <div className="flex items-center gap-2.5 pt-1">
            <img className="w-8 h-8 rounded-full object-cover" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=60&auto=format&fit=crop&q=80" alt="Kaew" />
            <div>
              <div className="text-xs font-bold text-slate-900">คุณแก้ว Agency Manager</div>
              <div className="text-[10px] text-slate-400">Live Commerce Solutions TH</div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Bottom Banner */}
      <div className="max-w-4xl mx-auto w-full px-4">
        <div className="p-8 sm:p-10 rounded-3xl bg-blue-600 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-blue-500/20">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-200">START GENERATING IN 30 SECONDS</span>
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              พร้อมดันยอดขาย TikTok Shop ของคุณให้พุ่งทะยานหรือยัง?
            </h3>
            <p className="text-xs text-blue-100 max-w-md">
              ทดลองเจนคลิปฟรีทันที ไม่ต้องกรอกบัตรเครดิต ไม่ต้องติดตั้งโปรแกรม รองรับทั้งคอมพิวเตอร์และมือถือ
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <button
              onClick={onGoToStudio}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-white hover:bg-slate-50 text-blue-700 text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>เริ่มสร้างคลิปแรกฟรี</span>
            </button>
            <button
              onClick={onOpenPromptPay}
              className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold transition-all flex items-center justify-center gap-2"
            >
              <QrCode className="w-4 h-4" />
              <span>ดูแพ็กเกจพร้อมเพย์</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
