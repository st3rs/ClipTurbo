import React, { useState } from 'react';
import { 
  Link2, 
  FileText, 
  Upload, 
  CheckCircle2, 
  Play, 
  Pause, 
  Volume2, 
  Sparkles, 
  ShieldCheck, 
  Download, 
  Copy, 
  Eye, 
  EyeOff, 
  Layers, 
  Zap, 
  Clock, 
  Check, 
  AlertCircle,
  HelpCircle,
  ArrowRight
} from 'lucide-react';
import { ProductData, UserWallet, VoiceOption } from '../types';
import { SAMPLE_PRODUCTS, VOICE_OPTIONS } from '../data/mockData';

interface VideoStudioProps {
  wallet: UserWallet;
  onDeductCredit: () => void;
  onOpenPromptPay: () => void;
}

export const VideoStudio: React.FC<VideoStudioProps> = ({
  wallet,
  onDeductCredit,
  onOpenPromptPay,
}) => {
  // State
  const [selectedProduct, setSelectedProduct] = useState<ProductData>(SAMPLE_PRODUCTS[0]);
  const [inputUrl, setInputUrl] = useState('https://shop.tiktok.com/view/product/17293849');
  const [selectedVoice, setSelectedVoice] = useState<VoiceOption>(VOICE_OPTIONS[0]);
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);
  const [selectedFont, setSelectedFont] = useState<'prompt' | 'kanit'>('prompt');
  const [subtitleStyle, setSubtitleStyle] = useState<'yellow' | 'white' | 'karaoke'>('karaoke');
  const [safeZoneLocked, setSafeZoneLocked] = useState(true);
  const [showTikTokMask, setShowTikTokMask] = useState(true);
  const [activeStep, setActiveStep] = useState<1 | 2 | 3>(2);

  // Render Pipeline Execution State
  const [isRendering, setIsRendering] = useState(false);
  const [renderProgress, setRenderProgress] = useState(0);
  const [pipelineStageIndex, setPipelineStageIndex] = useState(2); // In progress stage
  const [renderComplete, setRenderComplete] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleVoicePreview = (voiceId: string) => {
    if (playingVoiceId === voiceId) {
      setPlayingVoiceId(null);
    } else {
      setPlayingVoiceId(voiceId);
      // Play brief simulated sound tone using Web Audio API
      try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.3);
        gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 1.2);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 1.2);
      } catch (e) {
        // audio context fallback
      }
      setTimeout(() => setPlayingVoiceId(null), 2500);
    }
  };

  const handleStartRender = () => {
    if (wallet.availableCredits < 1) {
      onOpenPromptPay();
      return;
    }

    onDeductCredit();
    setIsRendering(true);
    setRenderProgress(10);
    setPipelineStageIndex(1);
    setRenderComplete(false);

    // Simulate pipeline progression
    setTimeout(() => {
      setPipelineStageIndex(2);
      setRenderProgress(40);
    }, 1200);

    setTimeout(() => {
      setPipelineStageIndex(3);
      setRenderProgress(70);
    }, 2400);

    setTimeout(() => {
      setPipelineStageIndex(4);
      setRenderProgress(90);
    }, 3600);

    setTimeout(() => {
      setPipelineStageIndex(5);
      setRenderProgress(100);
      setIsRendering(false);
      setRenderComplete(true);
      setActiveStep(3);
      showToast("เรนเดอร์วิดีโอ 9:16 สำเร็จ พร้อมส่งออก TikTok!");
    }, 4800);
  };

  return (
    <div className="flex flex-col w-full pb-16 space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-slate-700 animate-in slide-in-from-bottom duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Top Banner / Campaign Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">
              <Zap className="w-3 h-3 text-blue-600" />
              โหมดเร่งสปีด (Fast Render Engine v2.4)
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-500 font-medium">GPU Cloud Cluster: TH-BKK-02</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            แคมเปญ: ป้ายยาเซรั่มไฮยาหน้าใส (TikTok Shop Affiliate)
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-medium text-slate-600 shadow-xs">
            <Layers className="w-4 h-4 text-blue-600" />
            <span>เครดิตคงเหลือ: <strong className="text-slate-900">{wallet.availableCredits} คลิป</strong></span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-medium text-slate-600 shadow-xs">
            <Clock className="w-4 h-4 text-emerald-600" />
            <span>คิวเรนเดอร์: <strong className="text-emerald-700">0 คิว (พร้อมทันที)</strong></span>
          </div>
        </div>
      </div>

      {/* 3-Step Wizard Navigation */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <button
          onClick={() => setActiveStep(1)}
          className={`p-3.5 rounded-2xl border text-left flex items-center gap-3 transition-all ${
            activeStep === 1
              ? 'bg-blue-50 border-blue-600 shadow-xs'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">
            <Check className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs text-emerald-600 font-semibold">ขั้นตอนที่ 1 • เรียบร้อย</div>
            <div className="text-sm font-bold text-slate-900">ใส่ข้อมูลสินค้า & รูปภาพ</div>
          </div>
        </button>

        <button
          onClick={() => setActiveStep(2)}
          className={`p-3.5 rounded-2xl border text-left flex items-center gap-3 transition-all ${
            activeStep === 2
              ? 'bg-orange-50/70 border-orange-500 shadow-xs ring-2 ring-orange-500/20'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center font-bold text-sm">
            2
          </div>
          <div>
            <div className="text-xs text-orange-600 font-semibold">ขั้นตอนที่ 2 • กำลังปรับแต่ง</div>
            <div className="text-sm font-bold text-slate-900">เลือกน้ำเสียง & ซับไตเติล</div>
          </div>
        </button>

        <button
          onClick={() => setActiveStep(3)}
          className={`p-3.5 rounded-2xl border text-left flex items-center gap-3 transition-all ${
            activeStep === 3
              ? 'bg-blue-50 border-blue-600 shadow-xs'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center font-bold text-sm">
            3
          </div>
          <div>
            <div className="text-xs text-slate-500 font-semibold">ขั้นตอนที่ 3 • พร้อมเรนเดอร์</div>
            <div className="text-sm font-bold text-slate-900">เรนเดอร์ & พรีวิวไทม์ไลน์</div>
          </div>
        </button>
      </div>

      {/* Main Studio Grid: Left Configuration & Pipeline, Right Phone Mockup */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Input Hub, Voice & Subtitle config, Pipeline Status (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Box 1: Input Hub */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-xl bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
                  1
                </div>
                <h3 className="font-bold text-slate-900 text-base">ศูนย์รวมข้อมูลสินค้า (Input Hub)</h3>
              </div>
              <span className="text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full font-semibold border border-emerald-200/60 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                วิเคราะห์สำเร็จ
              </span>
            </div>

            {/* Input tabs */}
            <div className="flex gap-2 p-1 bg-slate-100 rounded-2xl">
              <button className="flex-1 py-2 px-3 rounded-xl bg-white text-blue-700 font-semibold text-xs shadow-xs flex items-center justify-center gap-1.5">
                <Link2 className="w-3.5 h-3.5" />
                ลิงก์สินค้า TikTok/Shopee
              </button>
              <button 
                onClick={() => showToast("เปิดโหมดเขียนสคริปต์อิสระ")}
                className="flex-1 py-2 px-3 rounded-xl text-slate-600 hover:text-slate-900 font-medium text-xs flex items-center justify-center gap-1.5"
              >
                <FileText className="w-3.5 h-3.5" />
                สคริปต์เขียนเอง
              </button>
              <button 
                onClick={() => showToast("เปิดระบบอัปโหลดภาพสินค้า HD")}
                className="flex-1 py-2 px-3 rounded-xl text-slate-600 hover:text-slate-900 font-medium text-xs flex items-center justify-center gap-1.5"
              >
                <Upload className="w-3.5 h-3.5" />
                อัปโหลดรูปภาพ
              </button>
            </div>

            {/* URL input bar */}
            <div className="space-y-2">
              <label className="text-xs text-slate-500 font-medium">วางลิงก์หน้าร้านสินค้า TikTok Shop Affiliate เพื่อดูรูปภาพ & ไฮไลท์</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Link2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    value={inputUrl}
                    onChange={(e) => setInputUrl(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs font-mono focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                    placeholder="https://shop.tiktok.com/view/product/..."
                  />
                </div>
                <button 
                  onClick={() => showToast("ดึงสเปกและรูปภาพสินค้าสำเร็จ 6 ภาพ")}
                  className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs flex items-center gap-1.5 whitespace-nowrap"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>ดึงข้อมูลสินค้าอัตโนมัติ</span>
                </button>
              </div>

              {/* Sample Quick Selector */}
              <div className="flex items-center gap-2 pt-1 text-xs text-slate-500">
                <span>ลองตัวอย่าง:</span>
                <button 
                  onClick={() => { setSelectedProduct(SAMPLE_PRODUCTS[0]); setInputUrl(SAMPLE_PRODUCTS[0].url); }}
                  className="text-blue-600 hover:underline font-medium"
                >
                  เซรั่ม Hya Booster
                </button>
                <span>•</span>
                <button 
                  onClick={() => { setSelectedProduct(SAMPLE_PRODUCTS[1]); setInputUrl(SAMPLE_PRODUCTS[1].url); }}
                  className="text-blue-600 hover:underline font-medium"
                >
                  กนกวรรณ น้ำพริกแกง
                </button>
                <span>•</span>
                <button 
                  onClick={() => { setSelectedProduct(SAMPLE_PRODUCTS[2]); setInputUrl(SAMPLE_PRODUCTS[2].url); }}
                  className="text-blue-600 hover:underline font-medium"
                >
                  หูฟังบลูทูธ 5.3
                </button>
              </div>
            </div>

            {/* Product Card Details */}
            <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100 flex items-center gap-4">
              <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-white shadow-xs flex-shrink-0">
                <img 
                  src={selectedProduct.images[0]} 
                  alt={selectedProduct.name}
                  className="w-full h-full object-cover" 
                />
                <span className="absolute bottom-1 left-1 bg-black/75 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                  HD 4K
                </span>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h4 className="font-bold text-slate-900 text-sm truncate">{selectedProduct.name}</h4>
                  <span className="px-2.5 py-0.5 rounded-full bg-orange-500 text-white text-xs font-bold">
                    ฿{selectedProduct.priceThb} THB
                  </span>
                </div>
                <div className="text-xs text-slate-500 flex items-center gap-2 mb-2">
                  <span>ดึงรูปสำเร็จ 6 ภาพ</span>
                  <span>•</span>
                  <span>คะแนนรีวิวร้าน {selectedProduct.rating}/5</span>
                  <span>•</span>
                  <span>ขายแล้ว {selectedProduct.salesCount}</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {selectedProduct.keyBenefits.map((b, idx) => (
                    <span key={idx} className="text-[11px] bg-white border border-blue-200 text-blue-700 px-2 py-0.5 rounded-md font-medium">
                      💧 {b}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Box 2: Voice & Safe Zone Subtitle Config */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-xl bg-orange-500 text-white flex items-center justify-center text-xs font-bold">
                  2
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">เลือกน้ำเสียงพากย์ & ซับไตเติล Safe Zone</h3>
                  <p className="text-xs text-slate-500">ปรับแต่งเสียงพากย์ภาษาไทย และตำแหน่งซับเพื่อไม่ให้โดนปุ่ม TikTok บัง</p>
                </div>
              </div>
              <span className="text-[11px] bg-orange-50 text-orange-700 border border-orange-200 font-semibold px-2.5 py-0.5 rounded-full">
                Neural Voice TH
              </span>
            </div>

            {/* Voice Grid Selection */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-xs font-semibold text-slate-700">น้ำเสียงแนะนำสำหรับแคมเปญป้ายยาความงาม:</label>
                <button 
                  onClick={() => showToast("เปิดคลังเสียงพากย์ภาษาไทยทั้งหมด 16 เสียง")}
                  className="text-xs text-blue-600 hover:underline font-medium"
                >
                  ฟังเสียงตัวอย่างทั้งหมด (16 เสียง)
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {VOICE_OPTIONS.map((v) => {
                  const isSelected = selectedVoice.id === v.id;
                  const isPlaying = playingVoiceId === v.id;
                  return (
                    <div
                      key={v.id}
                      onClick={() => setSelectedVoice(v)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer relative ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50/70 shadow-xs ring-2 ring-blue-500/20'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleVoicePreview(v.id);
                            }}
                            className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${
                              isPlaying 
                                ? 'bg-orange-500 text-white animate-pulse' 
                                : 'bg-blue-600 text-white hover:bg-blue-700'
                            }`}
                            title="กดเพื่อฟังเสียงพากย์ตัวอย่าง"
                          >
                            {isPlaying ? <Volume2 className="w-4 h-4" /> : <Play className="w-3.5 h-3.5 fill-current ml-0.5" />}
                          </button>
                          <div>
                            <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                              <span>{v.name}</span>
                              <span className="text-[10px] text-blue-700 font-semibold">{v.speed}x</span>
                            </div>
                            <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                              {v.style}
                            </div>
                          </div>
                        </div>

                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center mt-1 ${
                          isSelected ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-300'
                        }`}>
                          {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Subtitle Font & Safe Zone Setting */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {/* Font Selector */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-2">
                  ฟอนต์ภาษาไทย (ตัดคำถูกต้องด้วย PyThaiNLP):
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setSelectedFont('prompt')}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${
                      selectedFont === 'prompt'
                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                        : 'border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    Prompt (โมเดิร์นคลีน)
                  </button>
                  <button
                    onClick={() => setSelectedFont('kanit')}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${
                      selectedFont === 'kanit'
                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                        : 'border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    Kanit (ตัวหนาสะดุดตา)
                  </button>
                </div>
              </div>

              {/* Subtitle Style */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-2">
                  พรีเซ็ตซับไตเติล:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setSubtitleStyle('yellow')}
                    className={`py-2 px-2 rounded-xl border text-[11px] font-semibold transition-all flex items-center justify-center gap-1 ${
                      subtitleStyle === 'yellow'
                        ? 'border-blue-600 bg-blue-50 text-blue-800'
                        : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    <span className="w-3 h-3 rounded-full bg-yellow-400 border border-slate-900"></span>
                    สีเหลืองขอบดำ
                  </button>

                  <button
                    onClick={() => setSubtitleStyle('white')}
                    className={`py-2 px-2 rounded-xl border text-[11px] font-semibold transition-all flex items-center justify-center gap-1 ${
                      subtitleStyle === 'white'
                        ? 'border-blue-600 bg-blue-50 text-blue-800'
                        : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    <span className="w-3 h-3 rounded-full bg-white border border-slate-400"></span>
                    พื้นขาวอักษรดำ
                  </button>

                  <button
                    onClick={() => setSubtitleStyle('karaoke')}
                    className={`py-2 px-2 rounded-xl border text-[11px] font-semibold transition-all flex items-center justify-center gap-1 ${
                      subtitleStyle === 'karaoke'
                        ? 'border-blue-600 bg-blue-50 text-blue-800 ring-1 ring-blue-500'
                        : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    <Sparkles className="w-3 h-3 text-orange-500" />
                    คาราโอเกะเด้ง
                  </button>
                </div>
              </div>
            </div>

            {/* Safe Zone Lock Toggle */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">ล็อก Safe Zone อัตโนมัติ</div>
                  <div className="text-[11px] text-slate-500">ยกซับไตเติลเหนือตะกร้าช้อปปิ้ง TikTok (+420px จากขอบล่าง)</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSafeZoneLocked(!safeZoneLocked)}
                className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                  safeZoneLocked ? 'bg-blue-600' : 'bg-slate-300'
                }`}
              >
                <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  safeZoneLocked ? 'translate-x-6' : 'translate-x-0'
                }`} />
              </button>
            </div>
          </div>

          {/* Box 3: Real-time Pipeline EventStream */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-blue-600" />
                <h3 className="font-bold text-slate-900 text-sm">การประมวลผลวิดีโอ (Real-time Pipeline)</h3>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>EventStream: <strong>active-channel-id: #TK-84920</strong></span>
              </div>
            </div>

            <div className="space-y-2.5">
              {[
                { name: '1. ดึงรูปภาพ & สเปกสินค้าจาก TikTok Shop สำเร็จ', duration: '0.4 วินาที', completed: pipelineStageIndex >= 1 },
                { name: '2. เรียบเรียงสคริปต์เพื่อป้ายยา ความยาว 30s (Gemini 2.5 Flash)', duration: '1.2 วินาที', completed: pipelineStageIndex >= 2 },
                { name: '3. สังเคราะห์เสียงพากย์ด้วยโมเดล Neural Voice TH (น้องพิม)', duration: pipelineStageIndex === 3 ? 'กำลังดำเนินการ 75%' : 'สำเร็จ', running: pipelineStageIndex === 3, completed: pipelineStageIndex > 3 },
                { name: '4. ตรวจสอบการตัดคำไทย (PyThaiNLP) และแม่นยำตำแหน่งซับไตเติล', duration: pipelineStageIndex === 4 ? 'กำลังประมวลผล...' : pipelineStageIndex > 4 ? 'สำเร็จ' : 'รอคิว', running: pipelineStageIndex === 4, completed: pipelineStageIndex > 4 },
                { name: '5. รวมวิดีโอ 9:16 ด้วย FFmpeg GPU Cluster 60fps MP4', duration: pipelineStageIndex === 5 ? 'กำลังคอมโพสิต...' : pipelineStageIndex > 5 ? 'สำเร็จ' : 'รอคิว', running: pipelineStageIndex === 5, completed: pipelineStageIndex > 5 },
              ].map((stage, idx) => (
                <div 
                  key={idx}
                  className={`p-2.5 rounded-xl border flex items-center justify-between text-xs transition-colors ${
                    stage.running
                      ? 'bg-blue-50/70 border-blue-200 text-blue-900 font-medium'
                      : stage.completed
                      ? 'bg-slate-50 border-slate-200 text-slate-700'
                      : 'bg-white border-slate-100 text-slate-400'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {stage.completed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    ) : stage.running ? (
                      <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin flex-shrink-0"></div>
                    ) : (
                      <Clock className="w-4 h-4 text-slate-300 flex-shrink-0" />
                    )}
                    <span>{stage.name}</span>
                  </div>
                  <span className={`text-[11px] font-mono ${stage.running ? 'text-blue-700 font-bold' : 'text-slate-400'}`}>
                    {stage.duration}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: 9:16 Interactive TikTok Phone Mockup & Actions (5 cols) */}
        <div className="lg:col-span-5 flex flex-col items-center space-y-4">
          <div className="w-full flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-slate-500" />
              <span className="text-xs font-bold text-slate-900">พรีวิวสมจริง (9:16)</span>
            </div>
            <button
              onClick={() => setShowTikTokMask(!showTikTokMask)}
              className="text-xs px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 font-medium flex items-center gap-1.5 transition-colors"
            >
              {showTikTokMask ? <EyeOff className="w-3.5 h-3.5 text-orange-500" /> : <Eye className="w-3.5 h-3.5 text-blue-600" />}
              <span>{showTikTokMask ? 'ปิด TikTok UI Mask' : 'เปิด TikTok UI Mask'}</span>
            </button>
          </div>

          {/* Phone Frame Mockup (9:16 Aspect Ratio) */}
          <div className="relative w-[340px] h-[640px] bg-black rounded-[42px] p-3 shadow-2xl ring-1 ring-slate-800 overflow-hidden flex flex-col">
            {/* Phone Screen Area */}
            <div className="relative w-full h-full rounded-[32px] overflow-hidden bg-slate-900 select-none flex flex-col justify-between">
              {/* Background Video / Image preview */}
              <img
                src={selectedProduct.images[1] || selectedProduct.images[0]}
                alt="Product video background"
                className="absolute inset-0 w-full h-full object-cover opacity-85"
              />

              {/* Top TikTok UI overlay */}
              <div className="relative z-10 pt-4 px-4 flex items-center justify-between text-white text-xs">
                <div className="flex items-center gap-1">
                  <span className="text-slate-300">กำลังติดตาม</span>
                  <span className="font-bold text-white border-b-2 border-white pb-0.5 ml-2">สำหรับคุณ</span>
                </div>
                <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                  <span className="text-[10px]">🔍</span>
                </div>
              </div>

              {/* Right Side TikTok Interaction Buttons */}
              {showTikTokMask && (
                <div className="absolute right-3 bottom-28 z-20 flex flex-col items-center gap-4 text-white">
                  <div className="relative">
                    <img 
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60&auto=format&fit=crop&q=80" 
                      className="w-10 h-10 rounded-full border-2 border-white object-cover" 
                      alt="Creator"
                    />
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-red-500 text-white flex items-center justify-center text-[10px] font-bold">
                      +
                    </div>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-xl">❤️</span>
                    <span className="text-[10px] font-medium">14.8k</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-xl">💬</span>
                    <span className="text-[10px] font-medium">892</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-xl">↗️</span>
                    <span className="text-[10px] font-medium">แชร์</span>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-slate-800 border-2 border-white/60 animate-spin flex items-center justify-center">
                    <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                  </div>
                </div>
              )}

              {/* Safe Zone Indicator Line (Strict MarginV: 420px offset) */}
              {safeZoneLocked && (
                <div className="absolute bottom-[200px] left-3 right-3 z-15 border-b border-dashed border-amber-400/80 pointer-events-none flex justify-between items-center text-[9px] text-amber-300 font-mono">
                  <span className="bg-black/60 px-1 rounded">Safe Zone: Margin-Bottom 420px</span>
                  <span className="bg-black/60 px-1 rounded">1080x1920</span>
                </div>
              )}

              {/* Subtitle Display Layer (Positioned perfectly above basket) */}
              <div className={`relative z-20 px-4 text-center ${safeZoneLocked ? 'mb-4' : 'mb-20'} transition-all`}>
                <div 
                  style={{ fontFamily: selectedFont === 'kanit' ? "'Kanit', 'Noto Sans Thai', sans-serif" : "'Prompt', 'Noto Sans Thai', sans-serif" }}
                  className={`inline-block py-1.5 px-3.5 rounded-xl backdrop-blur-xs ${
                    subtitleStyle === 'yellow'
                      ? 'bg-black/75 text-yellow-300 font-bold drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]'
                      : subtitleStyle === 'white'
                      ? 'bg-black/85 text-white font-bold'
                      : 'bg-black/70 text-yellow-300 font-bold border border-yellow-400/40 shadow-lg'
                  }`}
                >
                  <p className="text-sm sm:text-base leading-snug">
                    "ตัวนี้เลยทุกคน! ทาคินเดียวตื่นมา
                  </p>
                  <p className="text-sm sm:text-base leading-snug text-amber-300">
                    ผิวฟูอิ่มน้ำมาก ✨"
                  </p>
                </div>
              </div>


              {/* Bottom TikTok Basket & Caption */}
              <div className="relative z-20 pb-4 px-4 space-y-2 text-white">
                {/* Yellow Cart Basket (Strict TikTok Shop Affiliate Anchor) */}
                <div className="bg-white/95 rounded-xl p-2 text-slate-900 flex items-center justify-between shadow-lg max-w-[250px]">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-7 h-7 rounded-lg bg-amber-400 flex items-center justify-center text-slate-900 font-bold text-xs flex-shrink-0">
                      🛒
                    </div>
                    <div className="min-w-0">
                      <div className="text-[11px] font-bold truncate">Hya Booster Glow Serum</div>
                      <div className="text-[10px] text-slate-500">฿290 THB • ส่งฟรี</div>
                    </div>
                  </div>
                  <button className="px-2 py-1 rounded bg-orange-500 text-white text-[10px] font-bold flex-shrink-0">
                    สั่งเลย
                  </button>
                </div>

                {/* Creator Caption */}
                <div className="text-[11px] space-y-0.5 pr-12">
                  <div className="font-bold text-white">@pimmy.glowup</div>
                  <div className="text-slate-200 line-clamp-1">
                    ป้ายยาแรงมาก เซรั่มลูกรักที่ต้องมีติดโต๊ะเครื่องแป้ง #tiktokshopครีเอเตอร์
                  </div>
                </div>

                {/* Video Playback Bar */}
                <div className="flex items-center justify-between text-[10px] text-slate-300 pt-1">
                  <div className="flex items-center gap-1.5 flex-1 mr-2">
                    <div className="w-2 h-2 rounded-full bg-white"></div>
                    <div className="w-full bg-white/30 h-1 rounded-full overflow-hidden">
                      <div className="bg-white h-full rounded-full" style={{ width: '40%' }}></div>
                    </div>
                  </div>
                  <span>00:24 / 00:60</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Button: สั่งเรนเดอร์คลิปเต็ม */}
          <div className="w-full max-w-[340px] space-y-2">
            <button
              onClick={handleStartRender}
              disabled={isRendering}
              className={`w-full py-3.5 px-4 rounded-2xl font-bold text-sm shadow-lg transition-all flex items-center justify-center gap-2 ${
                isRendering
                  ? 'bg-blue-400 text-white cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white shadow-blue-500/25'
              }`}
            >
              {isRendering ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>กำลังเรนเดอร์ GPU Cluster ({renderProgress}%)...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  <span>สั่งเรนเดอร์คลิปเต็ม (ใช้ 1 เครดิต)</span>
                </>
              )}
            </button>

            {/* Sub-actions */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => showToast("ดาวน์โหลดไฟล์เสียง MP3 และซับ .ASS สำเร็จ")}
                className="py-2.5 px-3 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs shadow-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-blue-600" />
                <span>โหลด MP3 + ซับ .ASS</span>
              </button>
              <button
                onClick={() => showToast("ระบบสร้าง 5 สคริปต์ย่อยเรียบร้อย")}
                className="py-2.5 px-3 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs shadow-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <Copy className="w-3.5 h-3.5 text-orange-500" />
                <span>โคลนเป็น 5 คลิปย่อย</span>
              </button>
            </div>

            {/* Safe zone compliance confirmation card */}
            <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-[11px] flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">ผ่านเกณฑ์ Safe Zone Guidelines 2026: </span>
                <span>ซับไตเติลและข้อความหัวเรื่องถูกคำนวณไว้ในระยะปลอดภัย 100% ไม่ถูกปุ่มแชร์ แคปชั่น และตะกร้าเหลืองบดบังตอนคลิปไวรัล</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
