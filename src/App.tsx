import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Menu,
  X,
  Volume2,
  VolumeX,
  Sparkles,
  Cpu,
  Activity,
  Layers,
  Search,
  Mic,
  Image,
  Music,
  Video,
  Wifi,
} from 'lucide-react';
import { Sidebar, NavSection } from './components/Sidebar';
import { CyberBackground } from './components/CyberBackground';
import { Dashboard } from './components/Dashboard';
import { AICompanion } from './components/AICompanion';
import { SpeechActivities } from './components/SpeechActivities';
import { PictureGeneration } from './components/PictureGeneration';
import { MusicGeneration } from './components/MusicGeneration';
import { VideoGeneration } from './components/VideoGeneration';
import { MoodStream } from './components/MoodStream';
import { NeuralJournal } from './components/NeuralJournal';
import { SmallDataUsage } from './components/SmallDataUsage';
import { SystemSettings } from './components/SystemSettings';
import { PRESET_MOODS } from './components/InteractiveMoodSelector';
import { Mood, MoodLog, JournalEntry, SystemSettings as ISystemSettings } from './types';
import { cyberAudio } from './utils/audio';

export default function App() {
  const [currentSection, setCurrentSection] = useState<NavSection>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [currentMood, setCurrentMood] = useState<Mood>(PRESET_MOODS[0]);

  const [settings, setSettings] = useState<ISystemSettings>({
    reducedMotion: false,
    motionSpeed: 1.0,
    soundEnabled: true,
    soundVolume: 0.25,
    theme: 'cyber-cyan',
    particleDensity: 'medium',
    lowDataMode: true,
  });

  // Seed rich initial data
  const [moodLogs, setMoodLogs] = useState<MoodLog[]>([
    {
      id: 'log-1',
      timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
      moodId: 'flow',
      intensity: 9,
      tags: ['Deep Work', 'Coding', 'Alpha Waves'],
      note: 'Constructed new neural animation pipelines. Pure effortless flow.',
    },
    {
      id: 'log-2',
      timestamp: new Date(Date.now() - 3600000 * 14).toISOString(),
      moodId: 'euphoric',
      intensity: 8,
      tags: ['Music', 'Creative Flow'],
      note: 'Morning ambient music ignited profound somatic clarity and optimism.',
    },
    {
      id: 'log-3',
      timestamp: new Date(Date.now() - 3600000 * 28).toISOString(),
      moodId: 'serenity',
      intensity: 7,
      tags: ['Nature Walk', 'Meditation'],
      note: '20-minute sensory disconnect in the rain garden. Nervous system fully reset.',
    },
  ]);

  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([
    {
      id: 'entry-1',
      timestamp: new Date(Date.now() - 3600000 * 4).toISOString(),
      title: 'Architecting the 2040 Emotional Matrix',
      content:
        'When technology aligns with human emotion rather than demanding attention, interface friction dissolves. Today I felt the distinction between reactive urgency and intentional creative flow. Realizing that stillness is not the absence of energy, but energy perfectly synchronized.',
      moodId: 'flow',
      coherenceScore: 94,
      emotionalArchetype: 'Lucid Architect',
      keyInsights: [
        'High conscious discernment separating external static from core intent',
        'Sustained mental velocity without adrenal exhaustion',
      ],
      recommendedAction: 'Protect this sacred evening wind-down window with zero digital notifications.',
      tags: ['Flow', 'Architecture', 'Mindfulness'],
    },
    {
      id: 'entry-2',
      timestamp: new Date(Date.now() - 3600000 * 26).toISOString(),
      title: 'The Resonance of Quiet Spaces',
      content:
        'Noticed how my cognitive bandwidth expands exponentially when external noise drops beneath 30 decibels. Synthesized three complex system abstractions within forty minutes. Rest is not a reward for work; it is the soil from which insight grows.',
      moodId: 'serenity',
      coherenceScore: 91,
      emotionalArchetype: 'Deep Seeker',
      keyInsights: [
        'Acoustic calm directly correlates with architectural lucidity',
        'Subconscious pattern processing accelerates during physical decompression',
      ],
      recommendedAction: 'Anchor each morning with 10 minutes of non-directive mindfulness.',
      tags: ['Serenity', 'Insight', 'Sound'],
    },
  ]);

  // Apply reduced motion class to root
  useEffect(() => {
    if (settings.reducedMotion) {
      document.documentElement.classList.add('reduced-motion-active');
    } else {
      document.documentElement.classList.remove('reduced-motion-active');
    }
  }, [settings.reducedMotion]);

  const handleLogMood = (newLog: MoodLog) => {
    setMoodLogs((prev) => [newLog, ...prev]);
    const matched = PRESET_MOODS.find((m) => m.id === newLog.moodId);
    if (matched) setCurrentMood(matched);
  };

  const handleAddJournalEntry = (newEntry: JournalEntry) => {
    setJournalEntries((prev) => [newEntry, ...prev]);
  };

  const handleUpdateSettings = (newSettings: Partial<ISystemSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const handleSelectSection = (sec: NavSection) => {
    setCurrentSection(sec);
    setMobileMenuOpen(false);
  };

  // Page animation variants
  const pageVariants = {
    initial: {
      opacity: 0,
      y: 14,
      filter: 'blur(5px)',
    },
    animate: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: {
        duration: 0.32,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
    exit: {
      opacity: 0,
      y: -14,
      filter: 'blur(5px)',
      transition: {
        duration: 0.22,
        ease: 'easeIn' as const,
      },
    },
  };

  const getSectionTitle = () => {
    switch (currentSection) {
      case 'dashboard':
        return 'Neural Overview 2040';
      case 'companion':
        return 'Nova AI Companion';
      case 'speech':
        return 'Speech Activities & TTS Studio';
      case 'pictures':
        return 'Neural Picture Generation Studio';
      case 'music':
        return 'Neuro-Acoustic Music Studio';
      case 'video':
        return 'Veo 3.1 Neural Holo-Motion Studio';
      case 'mood':
        return 'Biometric Mood Stream';
      case 'journal':
        return 'Cognitive Memory Vault';
      case 'data-usage':
        return 'Small Data Usage & Bandwidth Optimizer';
      case 'settings':
        return 'OS Engine Diagnostics';
      default:
        return 'MindMirror OS';
    }
  };

  return (
    <div className="relative min-h-screen bg-[#04060e] text-slate-100 flex overflow-hidden">
      {/* Dynamic Cybernetic Animated Background */}
      <CyberBackground
        density={settings.particleDensity}
        reducedMotion={settings.reducedMotion}
      />

      {/* Desktop Persistent Sidebar */}
      <div className="hidden lg:block h-screen sticky top-0 shrink-0 z-30">
        <Sidebar
          currentSection={currentSection}
          onSelectSection={handleSelectSection}
          soundEnabled={settings.soundEnabled}
          onToggleSound={() => {
            const next = !settings.soundEnabled;
            cyberAudio.setSoundEnabled(next);
            handleUpdateSettings({ soundEnabled: next });
            if (next) cyberAudio.play('success');
          }}
          lowDataMode={settings.lowDataMode}
          activeMoodCount={moodLogs.length}
        />
      </div>

      {/* Main View Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto relative z-10">
        {/* Top Floating Cyber Header */}
        <header className="sticky top-0 z-20 px-6 py-4 bg-[#04060e]/85 backdrop-blur-xl border-b border-white/[0.06] flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Mobile Menu Trigger */}
            <button
              onClick={() => {
                cyberAudio.play('click');
                setMobileMenuOpen(!mobileMenuOpen);
              }}
              className="lg:hidden p-2 rounded-xl bg-slate-900 border border-white/10 text-slate-300 hover:text-white cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_10px_#06b6d4] animate-pulse" />
              <span className="font-display font-bold text-sm tracking-wide text-white uppercase">
                {getSectionTitle()}
              </span>
            </div>
          </div>

          {/* Quick Header Telemetry & Controls */}
          <div className="flex items-center gap-3">
            {/* Small Data Indicator Tag */}
            <button
              onClick={() => {
                cyberAudio.play('click');
                handleSelectSection('data-usage');
              }}
              className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-mono transition-all cursor-pointer ${
                settings.lowDataMode
                  ? 'bg-emerald-950/60 border-emerald-500/30 text-emerald-300 hover:border-emerald-400'
                  : 'bg-slate-900 border-white/10 text-slate-400'
              }`}
            >
              <Wifi className="w-3.5 h-3.5 text-emerald-400" />
              <span>{settings.lowDataMode ? 'Lite Data (79% Saved)' : 'Full Holo'}</span>
            </button>

            {/* Current Active Frequency Badge */}
            <button
              onClick={() => {
                cyberAudio.play('mood');
                handleSelectSection('mood');
              }}
              className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-cyan-500/25 text-xs hover:border-cyan-400 transition-all cursor-pointer"
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: currentMood.color.includes('cyan') ? '#06b6d4' : '#a855f7' }}
              />
              <span className="text-slate-300 font-medium">State:</span>
              <span className="text-cyan-300 font-semibold">{currentMood.name}</span>
            </button>

            {/* Quick Audio Mute Toggle */}
            <button
              onClick={() => {
                const next = !settings.soundEnabled;
                cyberAudio.setSoundEnabled(next);
                handleUpdateSettings({ soundEnabled: next });
                if (next) cyberAudio.play('success');
              }}
              title={settings.soundEnabled ? 'Mute Audio' : 'Unmute Audio'}
              className="p-2 rounded-xl bg-slate-900/80 border border-white/[0.08] text-slate-400 hover:text-cyan-300 hover:border-cyan-400/40 transition-all cursor-pointer"
            >
              {settings.soundEnabled ? (
                <Volume2 className="w-4 h-4 text-cyan-400" />
              ) : (
                <VolumeX className="w-4 h-4 text-slate-500" />
              )}
            </button>
          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-[#070b1c]/95 border-b border-white/[0.08] backdrop-blur-2xl px-6 py-4 space-y-1.5 z-30"
            >
              {[
                { id: 'dashboard', label: 'Dashboard' },
                { id: 'companion', label: 'AI Companion (Live)' },
                { id: 'speech', label: 'Speech Activities' },
                { id: 'pictures', label: 'Picture Studio' },
                { id: 'music', label: 'Music Studio' },
                { id: 'video', label: 'Video Studio' },
                { id: 'mood', label: 'Mood Stream' },
                { id: 'journal', label: 'Neural Journal' },
                { id: 'data-usage', label: 'Small Data Usage' },
                { id: 'settings', label: 'OS Settings' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleSelectSection(item.id as NavSection)}
                  className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    currentSection === item.id
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Animated Page Transitions Container */}
        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSection}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="h-full"
            >
              {currentSection === 'dashboard' && (
                <Dashboard
                  currentMood={currentMood}
                  moodLogs={moodLogs}
                  journalEntries={journalEntries}
                  onNavigate={(sec) => handleSelectSection(sec)}
                  lowDataMode={settings.lowDataMode}
                />
              )}

              {currentSection === 'companion' && (
                <AICompanion currentMood={currentMood} />
              )}

              {currentSection === 'speech' && (
                <SpeechActivities />
              )}

              {currentSection === 'pictures' && (
                <PictureGeneration />
              )}

              {currentSection === 'music' && (
                <MusicGeneration />
              )}

              {currentSection === 'video' && (
                <VideoGeneration />
              )}

              {currentSection === 'mood' && (
                <MoodStream moodLogs={moodLogs} onLogMood={handleLogMood} />
              )}

              {currentSection === 'journal' && (
                <NeuralJournal
                  entries={journalEntries}
                  onAddEntry={handleAddJournalEntry}
                  currentMood={currentMood}
                />
              )}

              {currentSection === 'data-usage' && (
                <SmallDataUsage
                  lowDataMode={settings.lowDataMode}
                  onToggleLowDataMode={(enabled) =>
                    handleUpdateSettings({ lowDataMode: enabled })
                  }
                />
              )}

              {currentSection === 'settings' && (
                <SystemSettings
                  settings={settings}
                  onUpdateSettings={handleUpdateSettings}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
