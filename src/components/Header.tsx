import React, { useState } from 'react';
import { 
  Bell, 
  Store, 
  Sparkles, 
  CheckCircle2, 
  Layers, 
  ChevronDown, 
  ExternalLink,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { UserWallet } from '../types';

interface HeaderProps {
  wallet: UserWallet;
  onOpenPromptPay: () => void;
}

export const Header: React.FC<HeaderProps> = ({ wallet, onOpenPromptPay }) => {
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  return (
    <header className="fixed top-0 left-64 right-0 h-16 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-[0_1px_8px_rgba(0,0,0,0.02)] z-40 flex items-center justify-between px-8">
      {/* Left: Engine Status Badge */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-900 text-sm">Thai Creator Engine</span>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-200/60">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></span>
            v2.4 Active
          </span>
        </div>

        <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-xl bg-slate-50 border border-slate-200/60 text-xs text-slate-600">
          <Zap className="w-3.5 h-3.5 text-amber-500" />
          <span>GPU Cluster: <strong>TH-BKK-02 (NVENC Ready)</strong></span>
        </div>
      </div>

      {/* Right: Shop status, credits, notifications, avatar */}
      <div className="flex items-center gap-4">
        {/* TikTok Shop integration pill */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 text-xs font-medium">
          <Store className="w-4 h-4 text-orange-500" />
          <span>TikTok Shop TH:</span>
          <span className="text-emerald-700 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            เชื่อมต่อแล้ว
          </span>
        </div>

        {/* Credit count pill */}
        <button
          onClick={onOpenPromptPay}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100/80 text-blue-700 text-xs font-medium border border-blue-200/80 transition-colors"
        >
          <Layers className="w-3.5 h-3.5" />
          <span>เครดิตคงเหลือ: <strong>{wallet.availableCredits} คลิป</strong></span>
        </button>

        {/* Notification bell */}
        <div className="relative">
          <button 
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors relative"
            title="การแจ้งเตือนระบบ"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-orange-500 ring-2 ring-white"></span>
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 z-50 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2">
                <span className="font-semibold text-slate-900">การแจ้งเตือนงานเรนเดอร์</span>
                <span className="text-slate-400">เมื่อสักครู่</span>
              </div>
              <div className="space-y-2.5">
                <div className="p-2 rounded-xl bg-blue-50/60 border border-blue-100 text-slate-700">
                  <div className="font-semibold text-blue-900">#CT-8921 เรนเดอร์สำเร็จ (26.2 วินาที)</div>
                  <div className="text-slate-500 mt-0.5">เซรั่มโสมเกาหลี พร้อมดาวน์โหลด MP4 60fps & ASS</div>
                </div>
                <div className="p-2 rounded-xl bg-emerald-50/60 border border-emerald-100 text-slate-700">
                  <div className="font-semibold text-emerald-900">ผ่าน Safe Zone 100%</div>
                  <div className="text-slate-500 mt-0.5">ไม่มีข้อความทับตะกร้าเหลือง TikTok</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User profile avatar */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
          <img 
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
            alt="Pimmy Profile"
            className="w-8 h-8 rounded-full object-cover ring-2 ring-blue-500/20"
          />
          <div className="hidden sm:block text-left">
            <div className="text-xs font-semibold text-slate-900 leading-tight">คุณแพรว (Bella Shop)</div>
            <div className="text-[10px] text-slate-500">TikTok Creator Pro</div>
          </div>
        </div>
      </div>
    </header>
  );
};
