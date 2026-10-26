import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { VideoStudio } from './components/VideoStudio';
import { DashboardAnalytics } from './components/DashboardAnalytics';
import { LandingPage } from './components/LandingPage';
import { VoiceEngineView } from './components/VoiceEngineView';
import { CodeArchitectureExplorer } from './components/CodeArchitectureExplorer';
import { PromptPayModal } from './components/PromptPayModal';
import { AppTab, Language, UserWallet } from './types';
import { INITIAL_USER_WALLET } from './data/mockData';

export default function App() {
  const [currentTab, setCurrentTab] = useState<AppTab>('video-studio');
  const [wallet, setWallet] = useState<UserWallet>(INITIAL_USER_WALLET);
  const [promptPayModalOpen, setPromptPayModalOpen] = useState(false);
  const [language, setLanguage] = useState<Language>('th');

  const handleDeductCredit = () => {
    setWallet((prev) => ({
      ...prev,
      availableCredits: Math.max(0, prev.availableCredits - 1),
      totalRendered: prev.totalRendered + 1,
    }));
  };

  const handlePaymentSuccess = (amount: number, credits: number) => {
    setWallet((prev) => ({
      ...prev,
      balanceThb: prev.balanceThb + amount,
      availableCredits: prev.availableCredits + credits,
    }));
  };

  return (
    <div className="min-h-screen bg-[#f8f9ff] text-[#0b1c30]">
      {/* Sidebar Navigation */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        wallet={wallet}
        onOpenPromptPay={() => setPromptPayModalOpen(true)}
        language={language}
        onSelectLanguage={setLanguage}
      />

      {/* Main Content Area */}
      <div className="pl-64 flex flex-col min-h-screen">
        {/* Sticky Header */}
        <Header 
          wallet={wallet} 
          onOpenPromptPay={() => setPromptPayModalOpen(true)} 
        />

        {/* Viewport Content */}
        <main className="relative pt-20 px-8 flex-1">
          {currentTab === 'video-studio' && (
            <VideoStudio
              wallet={wallet}
              onDeductCredit={handleDeductCredit}
              onOpenPromptPay={() => setPromptPayModalOpen(true)}
            />
          )}

          {currentTab === 'dashboard' && (
            <DashboardAnalytics
              wallet={wallet}
              onOpenPromptPay={() => setPromptPayModalOpen(true)}
            />
          )}

          {currentTab === 'voice-ai' && <VoiceEngineView />}

          {currentTab === 'code-architecture' && <CodeArchitectureExplorer />}

          {currentTab === 'landing' && (
            <LandingPage
              onGoToStudio={() => setCurrentTab('video-studio')}
              onOpenPromptPay={() => setPromptPayModalOpen(true)}
            />
          )}

          {currentTab === 'pricing' && (
            <LandingPage
              onGoToStudio={() => setCurrentTab('video-studio')}
              onOpenPromptPay={() => setPromptPayModalOpen(true)}
            />
          )}
        </main>
      </div>

      {/* PromptPay QR Top-up Modal */}
      <PromptPayModal
        isOpen={promptPayModalOpen}
        onClose={() => setPromptPayModalOpen(false)}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </div>
  );
}
