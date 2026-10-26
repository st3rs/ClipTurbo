export type AppTab = 
  | 'video-studio'
  | 'dashboard'
  | 'voice-ai'
  | 'code-architecture'
  | 'landing'
  | 'pricing';

export type Language = 'th' | 'en' | 'zh';

export interface ProductData {
  id: string;
  name: string;
  priceThb: number;
  originalPriceThb?: number;
  url: string;
  category: string;
  images: string[];
  rating: number;
  salesCount: string;
  keyBenefits: string[];
  stock: number;
  shopName: string;
  affiliateCommissionRate: string;
}

export interface VoiceOption {
  id: string;
  name: string;
  gender: 'female' | 'male';
  provider: 'edge_tts' | 'elevenlabs' | 'botnoi';
  style: string;
  speed: number;
  audioPreviewUrl?: string;
  badge?: string;
  isPopular?: boolean;
}

export interface RenderPipelineStage {
  id: number;
  name: string;
  duration: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  detail?: string;
}

export interface RenderTask {
  id: string;
  productName: string;
  voiceName: string;
  safeZonePassed: boolean;
  renderTimeSec: number;
  status: 'completed' | 'processing' | 'failed';
  date: string;
  thumbnailUrl: string;
  format: 'ป้ายยาตะกร้า' | 'รีวิวเจาะลึก' | 'Storytelling';
  viewsCount?: string;
}

export interface UserWallet {
  balanceThb: number;
  availableCredits: number;
  subscriptionTier: string;
  totalRendered: number;
}
