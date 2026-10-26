import React, { useState } from 'react';
import { 
  Mic2, 
  Play, 
  Pause, 
  Volume2, 
  Sliders, 
  Sparkles, 
  CheckCircle2, 
  Layers, 
  Cpu, 
  Settings2,
  RefreshCw,
  Radio
} from 'lucide-react';
import { VOICE_OPTIONS } from '../data/mockData';

export const VoiceEngineView: React.FC = () => {
  const [selectedVoiceId, setSelectedVoiceId] = useState(VOICE_OPTIONS[0].id);
  const [stability, setStability] = useState(0.45);
  const [similarity, setSimilarity] = useState(0.80);
  const [speed, setSpeed] = useState(1.05);
  const [testText, setTestText] = useState(
    'ตัวนี้เลยทุกคน! ใครที่ตามหาเซรั่มไฮยาหน้าฉ่ำฟู ทาคืนเดียวตื่นมาผิวโกลว์มาก กลิ่นหอมละมุนไม่เหนียวเหนอะหนะ จัดโปรลดเหลือ 290 บาท รีบกดสั่งที่ตะกร้าเหลืองซ้ายล่างได้เลยนะ!'
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const [generatedCount, setGeneratedCount] = useState(148);

  const handleSynthesizeTest = () => {
    setIsPlaying(true);
    // Web audio synthesis simulation
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(540, audioCtx.currentTime + 0.4);
      gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 2.5);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 2.5);
    } catch (e) {}

    setTimeout(() => {
      setIsPlaying(false);
      setGeneratedCount(prev => prev + 1);
    }, 2800);
  };

  return (
    <div className="flex flex-col w-full pb-16 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              High-Inflection Thai Speech Engine
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-500 font-medium">Provider: EdgeTTS + ElevenLabs + Botnoi</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            สตูดิโอเสียงพากย์ AI สไตล์ป้ายยา (Thai Voice AI Engine)
          </h1>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-600 bg-white border border-slate-200 px-3.5 py-1.5 rounded-2xl shadow-xs">
          <Mic2 className="w-4 h-4 text-blue-600" />
          <span>ประมวลผลไปแล้ว: <strong className="text-slate-900">{generatedCount} ครั้ง</strong></span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Voice Models & Tuning Controls (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Voice Models List */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">เลือกโมเดลเสียงพากย์ภาษาไทย</h3>
              <span className="text-xs text-slate-500">4 สไตล์ตอบโจทย์ทุกกลุ่มสินค้า</span>
            </div>

            <div className="space-y-3">
              {VOICE_OPTIONS.map((v) => {
                const isSelected = selectedVoiceId === v.id;
                return (
                  <div
                    key={v.id}
                    onClick={() => setSelectedVoiceId(v.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/70 shadow-xs ring-2 ring-blue-500/20'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
                          isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                        }`}>
                          <Mic2 className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 text-sm">{v.name}</span>
                            <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono">
                              {v.provider}
                            </span>
                          </div>
                          <div className="text-xs text-slate-500 mt-0.5">{v.style}</div>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-semibold text-blue-700 bg-blue-100 px-2.5 py-1 rounded-full">
                          {v.speed}x Speed
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Voice Parameter Sliders (ElevenLabs Fine-Tuning) */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-orange-500" />
                <h3 className="font-bold text-slate-900 text-sm">การปรับแต่งความลื่นไหล & อารมณ์พากย์ (Tuning)</h3>
              </div>
              <span className="text-[11px] bg-orange-50 text-orange-700 font-semibold px-2.5 py-0.5 rounded-full border border-orange-200">
                eleven_multilingual_v2
              </span>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <div className="flex justify-between font-semibold text-slate-700 mb-1.5">
                  <span>Stability (เสถียรภาพน้ำเสียง)</span>
                  <span className="font-mono text-blue-600">{stability.toFixed(2)} (ค่าแนะนำ 0.45 สำหรับรีวิวตื่นเต้น)</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="1.0"
                  step="0.05"
                  value={stability}
                  onChange={(e) => setStability(parseFloat(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>มีลูกเล่นสูง / ตื่นเต้นมาก</span>
                  <span>นิ่งเรียบร้อย / ทางการ</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between font-semibold text-slate-700 mb-1.5">
                  <span>Similarity Boost (ความใกล้เคียงต้นฉบับ)</span>
                  <span className="font-mono text-blue-600">{similarity.toFixed(2)} (ค่าแนะนำ 0.80)</span>
                </div>
                <input
                  type="range"
                  min="0.3"
                  max="1.0"
                  step="0.05"
                  value={similarity}
                  onChange={(e) => setSimilarity(parseFloat(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between font-semibold text-slate-700 mb-1.5">
                  <span>Speech Rate (ความเร็วบทพูด)</span>
                  <span className="font-mono text-blue-600">{speed.toFixed(2)}x</span>
                </div>
                <input
                  type="range"
                  min="0.8"
                  max="1.3"
                  step="0.05"
                  value={speed}
                  onChange={(e) => setSpeed(parseFloat(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Speech Testing Studio (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-blue-600" />
                <h3 className="font-bold text-slate-900 text-sm">ทดสอบสังเคราะห์เสียงสด</h3>
              </div>
              <span className="text-xs text-slate-500">Live Preview</span>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700">ข้อความบทพูดภาษาไทย:</label>
              <textarea
                value={testText}
                onChange={(e) => setTestText(e.target.value)}
                rows={5}
                className="w-full p-3.5 rounded-2xl border border-slate-200 text-xs text-slate-900 leading-relaxed focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none resize-none"
                placeholder="พิมพ์ข้อความที่ต้องการให้ AI พากย์..."
              />
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>ความยาว: {testText.length} ตัวอักษร</span>
                <span>ระยะเวลาประมาณ: ~12.5 วินาที</span>
              </div>
            </div>

            {/* Audio Waveform Animation when playing */}
            <div className="p-4 rounded-2xl bg-slate-900 text-white flex flex-col items-center justify-center space-y-3">
              <div className="flex items-center gap-1.5 h-10">
                {[12, 24, 38, 16, 28, 40, 20, 32, 14, 26, 36, 18, 30].map((h, i) => (
                  <div
                    key={i}
                    className={`w-1.5 rounded-full bg-blue-500 transition-all duration-150 ${
                      isPlaying ? 'animate-pulse' : 'opacity-40'
                    }`}
                    style={{ height: isPlaying ? `${Math.max(8, (h * Math.sin(i + Date.now())) % 40)}px` : `${h / 2}px` }}
                  />
                ))}
              </div>
              <div className="text-xs font-mono text-slate-400">
                {isPlaying ? 'กำลังสังเคราะห์เสียงพากย์ไทย...' : 'พร้อมทดลองเล่น (Click Generate)'}
              </div>
            </div>

            {/* Generate Test Button */}
            <button
              onClick={handleSynthesizeTest}
              disabled={isPlaying}
              className={`w-full py-3.5 rounded-2xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 ${
                isPlaying
                  ? 'bg-blue-400 text-white cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white shadow-blue-500/20'
              }`}
            >
              {isPlaying ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>กำลังแปลงเสียงพากย์ Neural...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>ทดลองฟังเสียงพากย์ (Instant Test)</span>
                </>
              )}
            </button>

            {/* Specifications checklist */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2 text-xs text-slate-600">
              <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>คุณสมบัติระบบเสียงพากย์ ClipTurbo TH:</span>
              </div>
              <ul className="space-y-1 text-[11px] text-slate-500 pl-5 list-disc">
                <li>รองรับคำแสลง, ภาษาพูด, มุก TikTok ล่าสุด</li>
                <li>เว้นวรรคหายใจสมจริง ไม่มีเสียงหุ่นยนต์กระตุก</li>
                <li>Boost ระดับเสียง 1.2x เพื่อแข่งกับเสียงเพลงประกอบในคลิป</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
