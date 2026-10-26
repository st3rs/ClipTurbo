import React, { useState } from 'react';
import { 
  BarChart3, 
  Video, 
  Zap, 
  ShieldCheck, 
  CreditCard, 
  Download, 
  TrendingUp, 
  CheckCircle2, 
  PieChart, 
  Clock, 
  Share2, 
  Link as LinkIcon, 
  ChevronRight,
  Plus,
  ArrowUpRight,
  Layers,
  Sparkles
} from 'lucide-react';
import { UserWallet } from '../types';
import { RECENT_RENDER_TASKS } from '../data/mockData';

interface DashboardAnalyticsProps {
  wallet: UserWallet;
  onOpenPromptPay: () => void;
}

export const DashboardAnalytics: React.FC<DashboardAnalyticsProps> = ({
  wallet,
  onOpenPromptPay,
}) => {
  const [dateRange, setDateRange] = useState<'7d' | '30d' | 'month' | 'quarter'>('7d');
  const [copiedLink, setCopiedLink] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleCopyLink = () => {
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleExportCSV = () => {
    setDownloadSuccess(true);
    // Generate real CSV string and trigger download
    const headers = "Task ID,Product Name,Voice,Safe Zone,Render Time (s),Status,Date\n";
    const rows = RECENT_RENDER_TASKS.map(
      t => `"${t.id}","${t.productName}","${t.voiceName}","Passed",${t.renderTimeSec},"${t.status}","${t.date}"`
    ).join("\n");
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `ClipTurbo_Render_Report_${dateRange}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => setDownloadSuccess(false), 2500);
  };

  return (
    <div className="flex flex-col w-full pb-16 space-y-8">
      {/* Top Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-slate-500 text-xs">
            <span>หน้าหลัก</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span>วิเคราะห์ข้อมูล</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-blue-600 font-semibold">แดชบอร์ดภาพรวม</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            แดชบอร์ดภาพรวม & สถิติการผลิตคลิป
          </h1>
          <p className="text-sm text-slate-500 max-w-2xl">
            วิเคราะห์แนวโน้มการสร้างคลิป ประสิทธิภาพการเรนเดอร์ และอัตราความสำเร็จของงาน TikTok Shop แบบเรียลไทม์
          </p>
        </div>

        {/* Date Filter & Export CSV */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-slate-100 p-1 rounded-2xl flex items-center shadow-xs border border-slate-200/60">
            <button
              onClick={() => setDateRange('7d')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                dateRange === '7d' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              7 วันล่าสุด
            </button>
            <button
              onClick={() => setDateRange('30d')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                dateRange === '30d' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              30 วันที่ผ่านมา
            </button>
            <button
              onClick={() => setDateRange('month')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                dateRange === 'month' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              เดือนนี้
            </button>
            <button
              onClick={() => setDateRange('quarter')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                dateRange === 'quarter' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              ไตรมาสนี้
            </button>
          </div>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-2xl border border-slate-200 shadow-xs transition-colors"
          >
            <Download className="w-4 h-4 text-blue-600" />
            <span>{downloadSuccess ? 'ดาวน์โหลดสำเร็จ!' : 'ส่งออก CSV'}</span>
          </button>
        </div>
      </div>

      {/* Key Metric Stat Cards (Grid of 4) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {/* Card 1: Total Rendered Videos */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-500">Total Rendered Videos</span>
            <div className="w-9 h-9 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <Video className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-3xl font-bold text-slate-900 tracking-tight">{wallet.totalRendered}</span>
            <span className="text-xs text-slate-500">คลิป</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs">
            <span className="inline-flex items-center text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full font-semibold border border-blue-100">
              <TrendingUp className="w-3 h-3 mr-0.5" />
              +24.5%
            </span>
            <span className="text-slate-500">เทียบกับสัปดาห์ก่อน</span>
          </div>
        </div>

        {/* Card 2: Avg Generation Time */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-500">Avg Generation Time</span>
            <div className="w-9 h-9 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-3xl font-bold text-slate-900 tracking-tight">28.4</span>
            <span className="text-xs text-slate-500">วินาที / คลิป</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs">
            <span className="inline-flex items-center text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full font-semibold border border-blue-100">
              <Zap className="w-3 h-3 mr-0.5" />
              เร็วขึ้น 40%
            </span>
            <span className="text-slate-500">กว่าเกณฑ์มาตรฐาน</span>
          </div>
        </div>

        {/* Card 3: Safe Zone Pass Rate */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-500">Safe Zone Pass Rate</span>
            <div className="w-9 h-9 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-600 group-hover:bg-orange-500 group-hover:text-white transition-colors">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-3xl font-bold text-slate-900 tracking-tight">98.4%</span>
            <span className="text-xs text-slate-500">ผ่านเกณฑ์</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs">
            <span className="inline-flex items-center text-orange-700 bg-orange-50 px-2 py-0.5 rounded-full font-semibold border border-orange-100">
              <CheckCircle2 className="w-3 h-3 mr-0.5" />
              พร้อมยิงแอด
            </span>
            <span className="text-slate-500 truncate">ตรงตามข้อกำหนด TikTok Shop</span>
          </div>
        </div>

        {/* Card 4: Remaining Credits */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-500">Remaining Credits</span>
            <div className="w-9 h-9 rounded-2xl bg-orange-100 flex items-center justify-center text-orange-700">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between gap-2 mb-2">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-slate-900 tracking-tight">{wallet.availableCredits}</span>
              <span className="text-xs text-slate-500">คลิป</span>
            </div>
            <button
              onClick={onOpenPromptPay}
              className="px-2.5 py-1 rounded-xl bg-orange-500 text-white hover:bg-orange-600 text-xs font-semibold shadow-xs transition-all flex items-center gap-1"
            >
              <Plus className="w-3 h-3" />
              <span>เติมเครดิตด่วน</span>
            </button>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div className="bg-orange-500 h-full rounded-full" style={{ width: '38%' }}></div>
          </div>
        </div>
      </div>

      {/* Prominent Activity Trends Section (Large central SVG graph) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse"></span>
              <h2 className="text-lg font-bold text-slate-900">
                แนวโน้มกิจกรรมการสร้างคลิป & ยอดวิวเฉลี่ย (Activity Trends)
              </h2>
            </div>
            <p className="text-xs text-slate-500">
              การเปรียบเทียบสัดส่วนรอบการเรนเดอร์และโมเมนตัมยอดเข้าชมแบบออร์แกนิก 7 วันย้อนหลัง
            </p>
          </div>

          {/* Chart Legend */}
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <span className="w-3.5 h-3.5 rounded bg-blue-600"></span>
              <span>จำนวนคลิปที่เรนเดอร์ (คลิป)</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <span className="w-4 h-1.5 rounded-full bg-orange-500"></span>
              <span>ยอด View TikTok โดยเฉลี่ย (K)</span>
            </div>
          </div>
        </div>

        {/* Responsive SVG Line Graph */}
        <div className="relative w-full overflow-x-auto">
          <div className="min-w-[680px] h-72 w-full relative">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 800 260" preserveAspectRatio="none">
              <defs>
                <linearGradient id="primaryAreaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2563eb" stopOpacity="0.28" />
                  <stop offset="100%" stopColor="#2563eb" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="secondaryAreaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#fd761a" stopOpacity="0.18" />
                  <stop offset="100%" stopColor="#fd761a" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Horizontal Soft Gridlines */}
              <line x1="40" y1="30" x2="780" y2="30" stroke="#e2e8f0" strokeDasharray="4 4" strokeWidth="1" />
              <line x1="40" y1="85" x2="780" y2="85" stroke="#e2e8f0" strokeDasharray="4 4" strokeWidth="1" />
              <line x1="40" y1="140" x2="780" y2="140" stroke="#e2e8f0" strokeDasharray="4 4" strokeWidth="1" />
              <line x1="40" y1="195" x2="780" y2="195" stroke="#e2e8f0" strokeDasharray="4 4" strokeWidth="1" />
              <line x1="40" y1="240" x2="780" y2="240" stroke="#cbd5e1" strokeWidth="1" />

              {/* Y-Axis Labels */}
              <text x="30" y="34" textAnchor="end" fill="#64748b" fontSize="11" fontFamily="Montserrat">40</text>
              <text x="30" y="89" textAnchor="end" fill="#64748b" fontSize="11" fontFamily="Montserrat">30</text>
              <text x="30" y="144" textAnchor="end" fill="#64748b" fontSize="11" fontFamily="Montserrat">20</text>
              <text x="30" y="199" textAnchor="end" fill="#64748b" fontSize="11" fontFamily="Montserrat">10</text>
              <text x="30" y="244" textAnchor="end" fill="#64748b" fontSize="11" fontFamily="Montserrat">0</text>

              {/* TikTok Average Views Area & Line (Orange Dashed) */}
              <polygon points="70,240 70,165 170,140 270,120 370,135 470,75 570,95 670,60 750,85 750,240" fill="url(#secondaryAreaGrad)" />
              <path d="M70,165 C120,150 140,145 170,140 C220,130 240,122 270,120 C320,118 340,138 370,135 C420,130 440,80 470,75 C520,70 540,100 570,95 C620,90 640,62 670,60 C710,58 730,80 750,85" fill="none" stroke="#fd761a" strokeWidth="2.5" strokeDasharray="6 4" strokeLinecap="round" />

              {/* Rendered Videos Area & Line (Blue Solid) */}
              <polygon points="70,240 70,180 170,150 270,110 370,130 470,55 570,70 670,40 750,65 750,240" fill="url(#primaryAreaGrad)" />
              <path d="M70,180 C120,168 140,155 170,150 C220,140 240,115 270,110 C320,105 340,135 370,130 C420,122 440,62 470,55 C520,48 540,75 570,70 C620,65 640,42 670,40 C710,38 730,60 750,65" fill="none" stroke="#2563eb" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />

              {/* Data points */}
              <circle cx="70" cy="180" r="4.5" fill="#ffffff" stroke="#2563eb" strokeWidth="2.5" />
              <circle cx="170" cy="150" r="4.5" fill="#ffffff" stroke="#2563eb" strokeWidth="2.5" />
              <circle cx="270" cy="110" r="4.5" fill="#ffffff" stroke="#2563eb" strokeWidth="2.5" />
              <circle cx="370" cy="130" r="4.5" fill="#ffffff" stroke="#2563eb" strokeWidth="2.5" />

              {/* Thursday Peak Halo */}
              <circle cx="470" cy="55" r="9" fill="#2563eb" fillOpacity="0.25" />
              <circle cx="470" cy="55" r="6" fill="#ffffff" stroke="#2563eb" strokeWidth="3" />

              <circle cx="570" cy="70" r="4.5" fill="#ffffff" stroke="#2563eb" strokeWidth="2.5" />
              <circle cx="670" cy="40" r="4.5" fill="#ffffff" stroke="#2563eb" strokeWidth="2.5" />
              <circle cx="750" cy="65" r="4.5" fill="#ffffff" stroke="#2563eb" strokeWidth="2.5" />

              {/* X-Axis Labels */}
              <text x="70" y="258" textAnchor="middle" fill="#64748b" fontSize="11" fontFamily="'Noto Sans Thai', sans-serif">จ. 24 ก.พ.</text>
              <text x="170" y="258" textAnchor="middle" fill="#64748b" fontSize="11" fontFamily="'Noto Sans Thai', sans-serif">อ. 25 ก.พ.</text>
              <text x="270" y="258" textAnchor="middle" fill="#64748b" fontSize="11" fontFamily="'Noto Sans Thai', sans-serif">พ. 26 ก.พ.</text>
              <text x="470" y="258" textAnchor="middle" fill="#2563eb" fontSize="11" fontWeight="700" fontFamily="'Noto Sans Thai', sans-serif">พฤ. 27 ก.พ.</text>
              <text x="570" y="258" textAnchor="middle" fill="#64748b" fontSize="11" fontFamily="'Noto Sans Thai', sans-serif">ศ. 28 ก.พ.</text>
              <text x="670" y="258" textAnchor="middle" fill="#64748b" fontSize="11" fontFamily="'Noto Sans Thai', sans-serif">ส. 1 มี.ค.</text>
              <text x="750" y="258" textAnchor="middle" fill="#64748b" fontSize="11" fontFamily="'Noto Sans Thai', sans-serif">อา. 2 มี.ค.</text>
            </svg>

            {/* Floating Peak Tooltip */}
            <div className="absolute left-[54%] top-2 -translate-x-1/2 bg-slate-900 text-white px-3.5 py-2 rounded-xl shadow-xl pointer-events-none flex flex-col gap-0.5 z-10 border border-slate-700">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300">
                <span className="w-2 h-2 rounded-full bg-orange-400"></span>
                <span>วันพฤหัสบดี 27 ก.พ. (ยอดสูงสุด)</span>
              </div>
              <div className="text-[11px] text-slate-300 flex items-center gap-2">
                <span>เรนเดอร์สำเร็จ: <strong className="text-white font-bold">32 คลิป</strong></span>
                <span>•</span>
                <span className="text-orange-300 font-semibold">Conversion 4.8%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Task Completion & Health Metrics (2 columns grid with 2 Donut Charts) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Donut Chart 1: Render Success Rate */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-bold text-slate-900 text-base">
                อัตราความสำเร็จของกระบวนการเรนเดอร์
              </h3>
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            </div>
            <p className="text-xs text-slate-500 mb-6">
              Task Completion Rate & การตรวจสอบความสมบูรณ์ไฟล์เสียงและภาพ
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-6 justify-center my-3">
              {/* SVG Donut */}
              <div className="relative w-44 h-44 flex items-center justify-center flex-shrink-0">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#f1f5f9"
                    strokeWidth="3.8"
                  />
                  {/* Amber segment (0.5%) */}
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#f97316"
                    strokeWidth="3.8"
                    strokeDasharray="100 100"
                    strokeDashoffset="0"
                    strokeLinecap="round"
                  />
                  {/* Cyan segment (1.3%) */}
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#0284c7"
                    strokeWidth="3.8"
                    strokeDasharray="99.5 100"
                    strokeDashoffset="0"
                    strokeLinecap="round"
                  />
                  {/* Primary Blue segment (98.2%) */}
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#2563eb"
                    strokeWidth="3.8"
                    strokeDasharray="98.2 100"
                    strokeDashoffset="0"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-2xl font-bold text-slate-900 leading-tight">98.2%</span>
                  <span className="text-xs text-blue-600 font-semibold">สำเร็จสมบูรณ์</span>
                </div>
              </div>

              {/* Legend breakdown */}
              <div className="flex flex-col gap-2.5 w-full sm:max-w-xs">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-blue-600"></span>
                    <span className="text-xs text-slate-700 font-medium">เรนเดอร์สำเร็จ</span>
                  </div>
                  <span className="text-xs font-bold text-slate-900">98.2%</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-sky-500"></span>
                    <span className="text-xs text-slate-700 font-medium">กำลังประมวลผล</span>
                  </div>
                  <span className="text-xs font-bold text-slate-900">1.3%</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-orange-500"></span>
                    <span className="text-xs text-slate-700 font-medium truncate">ต้องแก้ไขลิงก์สินค้า</span>
                  </div>
                  <span className="text-xs font-bold text-slate-900">0.5%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Donut Chart 2: Content Breakdown */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-bold text-slate-900 text-base">
                การกระจายประเภทคอนเทนต์
              </h3>
              <PieChart className="w-5 h-5 text-orange-600" />
            </div>
            <p className="text-xs text-slate-500 mb-6">
              Content Format Breakdown แยกตามสไตล์คลิปยอดนิยมบน TikTok Shop TH
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-6 justify-center my-3">
              {/* SVG Donut */}
              <div className="relative w-44 h-44 flex items-center justify-center flex-shrink-0">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#f1f5f9"
                    strokeWidth="3.8"
                  />
                  {/* Storytelling 12% */}
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#9d4300"
                    strokeWidth="3.8"
                    strokeDasharray="100 100"
                    strokeDashoffset="0"
                    strokeLinecap="round"
                  />
                  {/* Unboxing 24% */}
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#fd761a"
                    strokeWidth="3.8"
                    strokeDasharray="88 100"
                    strokeDashoffset="0"
                    strokeLinecap="round"
                  />
                  {/* Hard-sell 64% */}
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#2563eb"
                    strokeWidth="3.8"
                    strokeDasharray="64 100"
                    strokeDashoffset="0"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-2xl font-bold text-slate-900 leading-tight">64%</span>
                  <span className="text-xs text-orange-600 font-semibold">ป้ายยาตื่นเต้น</span>
                </div>
              </div>

              {/* Legend breakdown */}
              <div className="flex flex-col gap-2.5 w-full sm:max-w-xs">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-blue-600"></span>
                    <span className="text-xs text-slate-700 font-medium truncate">คลิปป้ายยาตะกร้า</span>
                  </div>
                  <span className="text-xs font-bold text-slate-900">64%</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-orange-500"></span>
                    <span className="text-xs text-slate-700 font-medium truncate">รีวิวเจาะลึกแกะกล่อง</span>
                  </div>
                  <span className="text-xs font-bold text-slate-900">24%</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-amber-800"></span>
                    <span className="text-xs text-slate-700 font-medium truncate">เล่าเรื่อง Storytelling</span>
                  </div>
                  <span className="text-xs font-bold text-slate-900">12%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Activity Log / Recent Batch Tasks Table */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div>
            <h3 className="font-bold text-slate-900 text-base">
              ประวัติการเรนเดอร์คลิปล่าสุด (Recent Video Batch Tasks)
            </h3>
            <p className="text-xs text-slate-500">
              รายการประมวลผลวิดีโอ 5 รายการล่าสุด พร้อมการตรวจสอบอัตราส่วนภาพ Safe Zone และเสียงพากย์ AI
            </p>
          </div>
          <button 
            onClick={() => alert("เปิดแสดงคลังวิดีโอที่เรนเดอร์เสร็จแล้วทั้งหมด 148 คลิป")}
            className="inline-flex items-center gap-1 text-xs text-blue-600 font-bold hover:underline"
          >
            <span>ดูทั้งหมดในคลังคลิป</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Table Container */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 text-xs font-semibold">
                <th className="py-3 px-4 rounded-l-xl">สินค้า & หัวข้อคลิป</th>
                <th className="py-3 px-4">ผู้พากย์ AI (Voice)</th>
                <th className="py-3 px-4">TikTok Safe Zone</th>
                <th className="py-3 px-4">เวลาเรนเดอร์</th>
                <th className="py-3 px-4 text-center rounded-r-xl">สถานะ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {RECENT_RENDER_TASKS.map((task) => (
                <tr key={task.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4 font-medium flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0 border border-slate-200">
                      <img src={task.thumbnailUrl} alt={task.productName} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900 truncate max-w-xs">{task.productName}</div>
                      <div className="text-[11px] text-slate-400">ID: {task.id} • ตะกร้า TikTok Shop</div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 font-medium">
                      <Zap className="w-3.5 h-3.5 text-blue-600" />
                      {task.voiceName}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 font-semibold border border-blue-200/60">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      ผ่านฉลุย (9:16)
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-500">
                    {task.renderTimeSec.toFixed(1)} วินาที
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200">
                      เสร็จสิ้น
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Prominent Bottom Action Bar / Executive Share */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 flex-shrink-0">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-base">
              ส่งออกและแชร์รายงานสรุปภาพรวมให้ทีมหรือลูกค้าได้ทันที
            </h4>
            <p className="text-xs text-slate-500">
              Daily & Weekly Executive Summary พร้อมอินไซต์อัตราการแปลงผล (Conversion Insights) แบบครบวงจร
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <button
            onClick={handleCopyLink}
            className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-all flex items-center gap-2"
          >
            <LinkIcon className="w-4 h-4 text-blue-600" />
            <span>{copiedLink ? 'คัดลอกเรียบร้อย!' : 'คัดลอกลิงก์รายงาน'}</span>
          </button>
          <button
            onClick={() => alert("ระบบสร้างลิงก์สำหรับแชร์รายงานผู้บริหารเรียบร้อย")}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-md shadow-blue-500/20 transition-all flex items-center gap-2"
          >
            <Share2 className="w-4 h-4" />
            <span>แชร์สรุปภาพรวม</span>
          </button>
        </div>
      </div>
    </div>
  );
};
