export interface Mood {
  id: string;
  name: string;
  tagline: string;
  valence: number; // 0 to 100
  energy: number; // 0 to 100
  color: string;
  glowColor: string;
  iconName: string;
  category: 'peak' | 'calm' | 'reflective' | 'turbulent';
}

export interface MoodLog {
  id: string;
  timestamp: string;
  moodId: string;
  intensity: number; // 1 to 10
  tags: string[];
  note: string;
}

export interface JournalEntry {
  id: string;
  timestamp: string;
  title: string;
  content: string;
  moodId: string;
  coherenceScore: number;
  emotionalArchetype: string;
  keyInsights: string[];
  recommendedAction: string;
  tags: string[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  emotionTag?: string;
}

export interface SpeechActivity {
  id: string;
  title: string;
  category: 'grounding' | 'affirmation' | 'pacing' | 'dialogue';
  text: string;
  voice: 'Puck' | 'Charon' | 'Kore' | 'Fenrir' | 'Zephyr';
  durationSec: number;
  recommendedMood: string;
}

export interface GeneratedImage {
  id: string;
  timestamp: string;
  prompt: string;
  imageUrl: string;
  aspectRatio: string;
  isAiGenerated?: boolean;
}

export interface GeneratedTrack {
  id: string;
  timestamp: string;
  title: string;
  genre: string;
  mood: string;
  prompt: string;
  audioUrl?: string;
  bpm: number;
  duration: number;
  isAiGenerated?: boolean;
}

export interface GeneratedVideo {
  id: string;
  timestamp: string;
  title: string;
  prompt: string;
  aspectRatio: string;
  resolution: string;
  status: 'rendering' | 'ready' | 'failed';
  videoUrl?: string;
  thumbnailUrl?: string;
}

export interface DataUsageStats {
  totalBytesServed: number;
  uncompressedBytes: number;
  savedBytes: number;
  savingsPercentage: number;
  cacheHits: number;
  lowDataModeActive: boolean;
  requestsCount: number;
  avgLatencyMs: number;
}

export interface SystemSettings {
  reducedMotion: boolean;
  motionSpeed: number;
  soundEnabled: boolean;
  soundVolume: number;
  theme: 'cyber-cyan' | 'ultra-violet' | 'matrix-emerald' | 'solar-gold';
  particleDensity: 'high' | 'medium' | 'off';
  lowDataMode: boolean;
}
