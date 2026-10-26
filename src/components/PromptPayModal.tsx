import React, { useState, useEffect } from 'react';
import { 
  X, 
  CheckCircle2, 
  QrCode, 
  Clock, 
  ShieldCheck, 
  Building2, 
  Sparkles, 
  ArrowRight,
  Zap,
  Check
} from 'lucide-react';

interface PromptPayModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess: (amount: number, credits: number) => void;
}

export const PromptPayModal: React.FC<PromptPayModalProps> = ({
  isOpen,
  onClose,
  onPaymentSuccess,
}) => {
  const [selectedPlan, setSelectedPlan] = useState<'starter' | 'popular' | 'power'>('popular');
  const [timeLeft, setTimeLeft] = useState(891); // ~14:51
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  const planDetails = {
    starter: { price: 99, credits: 10, perClip: '9.9 บาท', name: 'Starter (10 คลิป)' },
    popular: { price: 290, credits: 35, perClip: '8.2 บาท (ประหยัด 20%)', name: 'Creator Popular (35 คลิป)' },
    power: { price: 690, credits: 100, perClip: '6.9 บาท (คุ้มสุด)', name: 'Power Seller (100 คลิป)' },
  };

  const currentPlan = planDetails[selectedPlan];

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleSimulatePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setPaymentSuccess(true);
      setTimeout(() => {
        onPaymentSuccess(currentPlan.price, currentPlan.credits);
        setPaymentSuccess(false);
        onClose();
      }, 1500);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-100 overflow-hidden relative">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-md shadow-blue-500/20">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">เติมเครดิตสร้างคลิป PromptPay QR</h3>
              <p className="text-xs text-slate-500">สแกนจ่ายเงินได้ทันที เครดิตเข้าเร็วใน 3 วินาที ไม่มีวันหมดอายุ</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {paymentSuccess ? (
          <div className="p-10 flex flex-col items-center text-center justify-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-2xl animate-bounce">
              <Check className="w-8 h-8 stroke-[3]" />
            </div>
            <h4 className="text-xl font-bold text-slate-900">ชำระเงินสำเร็จแล้ว!</h4>
            <p className="text-sm text-slate-600 max-w-xs">
              ระบบได้รับยอด ฿{currentPlan.price} THB ผ่าน PromptPay เรียบร้อยแล้ว เพิ่ม <strong className="text-blue-600">+{currentPlan.credits} เครดิต</strong> เข้ากระเป๋าของคุณทันที
            </p>
          </div>
        ) : (
          <div className="p-6 space-y-6">
            {/* Plan selection buttons */}
            <div className="grid grid-cols-3 gap-2.5">
              {(['starter', 'popular', 'power'] as const).map((pKey) => {
                const p = planDetails[pKey];
                const isSelected = selectedPlan === pKey;
                return (
                  <button
                    key={pKey}
                    onClick={() => setSelectedPlan(pKey)}
                    className={`p-3 rounded-2xl border text-left transition-all relative ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/70 shadow-sm ring-2 ring-blue-500/20'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    {pKey === 'popular' && (
                      <span className="absolute -top-2.5 right-2 px-2 py-0.5 rounded-full bg-blue-600 text-white text-[9px] font-bold">
                        ยอดนิยม ✨
                      </span>
                    )}
                    <div className="text-xs font-medium text-slate-600">{p.name.split(' ')[0]}</div>
                    <div className="text-lg font-bold text-slate-900 mt-0.5">฿{p.price}</div>
                    <div className="text-[10px] text-blue-700 font-semibold">{p.credits} คลิป</div>
                  </button>
                );
              })}
            </div>

            {/* QR Card Container */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 flex flex-col items-center text-center relative overflow-hidden">
              <div className="w-full flex items-center justify-between text-xs pb-3 border-b border-slate-200 mb-4">
                <div className="flex items-center gap-1.5 text-slate-600">
                  <span className="font-semibold text-slate-800">แพ็กเกจ:</span> {currentPlan.name}
                </div>
                <div className="flex items-center gap-1 text-orange-600 font-semibold">
                  <Clock className="w-3.5 h-3.5" />
                  <span>หมดอายุใน {formatTimer(timeLeft)}</span>
                </div>
              </div>

              {/* Thai PromptPay QR Box */}
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 relative mb-3">
                <div className="w-48 h-48 bg-slate-900 rounded-xl flex items-center justify-center p-3 relative overflow-hidden">
                  {/* Stylized QR Matrix Pattern */}
                  <div className="w-full h-full bg-white rounded-lg p-2 flex flex-col justify-between relative">
                    <div className="flex justify-between">
                      <div className="w-9 h-9 border-4 border-slate-900 rounded-md p-1">
                        <div className="w-full h-full bg-slate-900 rounded-xs"></div>
                      </div>
                      <div className="w-9 h-9 border-4 border-slate-900 rounded-md p-1">
                        <div className="w-full h-full bg-slate-900 rounded-xs"></div>
                      </div>
                    </div>
                    {/* Center PromptPay badge */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="px-2.5 py-1 bg-[#003D6B] text-white rounded font-bold text-[10px] shadow-sm tracking-wider">
                        PROMPTPAY
                      </div>
                    </div>
                    <div className="flex justify-between items-end">
                      <div className="w-9 h-9 border-4 border-slate-900 rounded-md p-1">
                        <div className="w-full h-full bg-slate-900 rounded-xs"></div>
                      </div>
                      <div className="w-9 h-9 flex flex-wrap gap-0.5 p-1">
                        <div className="w-2 h-2 bg-slate-900"></div>
                        <div className="w-2 h-2 bg-slate-900"></div>
                        <div className="w-2 h-2 bg-slate-900"></div>
                        <div className="w-2 h-2 bg-slate-900"></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-[11px] text-slate-500 font-mono mt-2">
                  Ref : CT-202605-8914A
                </div>
              </div>

              <div className="text-xs text-slate-500 mb-1">
                ยอดชำระสุทธิ: <strong className="text-lg text-slate-900 font-bold">฿{currentPlan.price}</strong> THB
              </div>

              <div className="text-[11px] text-slate-400 flex items-center gap-1.5 justify-center">
                <span>รองรับทุกแอปธนาคารไทย</span>
                <span className="font-semibold text-slate-600">K PLUS, SCB EASY, Krungthai NEXT, Bangkok Bank</span>
              </div>
            </div>

            {/* Instant webhook simulation trigger */}
            <div className="space-y-2">
              <button
                onClick={handleSimulatePayment}
                disabled={isProcessing}
                className="w-full py-3.5 px-4 rounded-2xl bg-orange-600 hover:bg-orange-700 active:scale-[0.99] text-white font-semibold text-sm shadow-md shadow-orange-500/20 transition-all flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>กำลังตรวจสอบการชำระเงิน...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>สแกนแล้ว หรือ แจ้งชำระเงิน (จำลองรับยอดทันที)</span>
                  </>
                )}
              </button>

              <div className="text-center text-[11px] text-slate-500 flex items-center justify-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>ระบบตรวจจับอัตโนมัติเปิดการใช้งานใน 3 วินาที</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
