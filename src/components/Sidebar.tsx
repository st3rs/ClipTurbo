import React from 'react';
import { 
  Video, 
  Mic2, 
  QrCode, 
  CreditCard, 
  BarChart3, 
  Code2, 
  Sparkles, 
  HelpCircle, 
  ExternalLink,
  Flame,
  Globe2
} from 'lucide-react';
import { AppTab, Language, UserWallet } from '../types';

interface SidebarProps {
  currentTab: AppTab;
  onSelectTab: (tab: AppTab) => void;
  wallet: UserWallet;
  onOpenPromptPay: () => void;
  language: Language;
  onSelectLanguage: (lang: Language) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  wallet,
  onOpenPromptPay,
  language,
  onSelectLanguage,
}) => {
  const navItems = [
    { id: 'video-studio' as AppTab, label: 'Video Studio', icon: Video, badge: 'GPU Active' },
    { id: 'dashboard' as AppTab, label: 'แดชบอร์ดภาพรวม', icon: BarChart3, badge: '148 คลิป' },
    { id: 'voice-ai' as AppTab, label: 'Thai Voice AI', icon: Mic2, badge: '4 เสียง' },
    { id: 'code-architecture' as AppTab, label: 'Engine Architecture', icon: Code2, badge: 'Tasks 1-5' },
    { id: 'landing' as AppTab, label: 'Landing & Feature Tour', icon: Sparkles },
    { id: 'pricing' as AppTab, label: 'PromptPay Top-up & Plans', icon: QrCode },
  ];

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-slate-200 shadow-[0_1px_8px_rgba(0,0,0,0.03)] z-50 flex flex-col justify-between py-5 select-none">
      <div className="flex flex-col gap-6">
        {/* Brand Logo */}
        <div className="px-6 flex items-center justify-between">
          <button 
            onClick={() => onSelectTab('landing')}
            className="flex items-center gap-3 text-left group"
          >
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <span className="text-lg">⚡</span>
            </div>
            <div>
              <div className="text-lg font-bold tracking-tight text-slate-900 leading-none">
                ClipTurbo <span className="text-blue-600">TH</span>
              </div>
              <div className="text-[10px] text-slate-500 font-medium tracking-wide mt-1">
                TikTok Commerce Engine
              </div>
            </div>
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="px-3 flex flex-col gap-1">
          <div className="px-3 pb-1 text-[11px] font-semibold tracking-wider text-slate-600 uppercase">
            แผงควบคุมระบบ
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-150 ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 font-semibold shadow-sm border border-blue-200/60'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                    isActive ? 'bg-blue-200/70 text-blue-800' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Wallet Balance & Utilities */}
      <div className="px-4 flex flex-col gap-3">
        {/* Wallet Credit Card */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-b from-blue-50/70 to-slate-50 border border-blue-100/80 shadow-xs flex flex-col gap-2.5">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span className="flex items-center gap-1">
              <CreditCard className="w-3.5 h-3.5 text-blue-600" />
              เครดิตสร้างคลิป
            </span>
            <span className="text-blue-700 font-bold text-sm">฿{wallet.balanceThb.toFixed(0)} THB</span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-600">คงเหลือ</span>
            <span className="font-semibold text-slate-900">{wallet.availableCredits} คลิป</span>
          </div>

          <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
            <div 
              className="bg-blue-600 h-full rounded-full transition-all duration-500" 
              style={{ width: `${Math.min(100, (wallet.availableCredits / 35) * 100)}%` }} 
            />
          </div>

          <button
            onClick={onOpenPromptPay}
            className="w-full mt-1 py-2 px-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-medium text-xs shadow-sm hover:shadow transition-all flex items-center justify-center gap-1.5"
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>+ เติมเงิน PromptPay</span>
          </button>
        </div>

        {/* Language & Affiliate footer */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 px-1">
          <div className="flex items-center gap-1">
            <Globe2 className="w-3.5 h-3.5 text-slate-400" />
            <button
              onClick={() => onSelectLanguage('th')}
              className={`text-xs px-1.5 py-0.5 rounded ${language === 'th' ? 'bg-blue-100 text-blue-700 font-bold' : 'text-slate-400 hover:text-slate-600'}`}
            >
              TH
            </button>
            <span className="text-slate-300 text-xs">/</span>
            <button
              onClick={() => onSelectLanguage('en')}
              className={`text-xs px-1.5 py-0.5 rounded ${language === 'en' ? 'bg-blue-100 text-blue-700 font-bold' : 'text-slate-400 hover:text-slate-600'}`}
            >
              EN
            </button>
            <span className="text-slate-300 text-xs">/</span>
            <button
              onClick={() => onSelectLanguage('zh')}
              className={`text-xs px-1.5 py-0.5 rounded ${language === 'zh' ? 'bg-blue-100 text-blue-700 font-bold' : 'text-slate-400 hover:text-slate-600'}`}
            >
              CN
            </button>
          </div>

          <a 
            href="#help" 
            onClick={(e) => { e.preventDefault(); alert("เปิดดูแนวทางการทำคลิป TikTok Affiliate 100k views/วัน"); }}
            className="text-xs text-slate-500 hover:text-blue-600 flex items-center gap-1 transition-colors"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>คู่มือ</span>
          </a>
        </div>
      </div>
    </aside>
  );
};
