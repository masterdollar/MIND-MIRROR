import React from 'react';
import { motion } from 'motion/react';
import {
  Activity,
  Sparkles,
  Zap,
  TrendingUp,
  Brain,
  Shield,
  Layers,
  ArrowUpRight,
  Clock,
  Radio,
  Plus,
  Mic,
  Image,
  Music,
  Video,
  Wifi,
} from 'lucide-react';
import { GlassCard } from './GlassCard';
import { AnimatedProgressRing } from './AnimatedProgressRing';
import { AnimatedStatCounter } from './AnimatedStatCounter';
import { NeuralChart } from './NeuralChart';
import { NeonButton } from './NeonButton';
import { NeonOrb } from './NeonOrb';
import { Mood, MoodLog, JournalEntry } from '../types';
import { NavSection } from './Sidebar';
import { PRESET_MOODS } from './InteractiveMoodSelector';
import { cyberAudio } from '../utils/audio';

interface DashboardProps {
  currentMood?: Mood;
  moodLogs: MoodLog[];
  journalEntries: JournalEntry[];
  onNavigate: (section: NavSection) => void;
  lowDataMode?: boolean;
}

export const Dashboard: React.FC<DashboardProps> = ({
  currentMood = PRESET_MOODS[0],
  moodLogs,
  journalEntries,
  onNavigate,
  lowDataMode = true,
}) => {
  const chartData = [
    { label: '06:00', valence: 70, energy: 50, coherence: 78 },
    { label: '09:00', valence: 92, energy: 88, coherence: 94 },
    { label: '12:00', valence: 85, energy: 80, coherence: 89 },
    { label: '15:00', valence: 76, energy: 65, coherence: 82 },
    { label: '18:00', valence: 89, energy: 72, coherence: 90 },
    { label: '21:00', valence: 94, energy: 45, coherence: 96 },
  ];

  const multimediaStudios = [
    {
      id: 'speech' as NavSection,
      title: 'Speech Activities',
      desc: 'Gemini 3.8 Flash TTS speech pacing & somatic voice exercises',
      icon: Mic,
      color: 'from-cyan-400 to-blue-600',
      badge: 'Flash TTS',
      glow: 'cyan',
    },
    {
      id: 'pictures' as NavSection,
      title: 'Picture Studio',
      desc: 'Generate 8K cognitive dreamscapes & emotion metaphors',
      icon: Image,
      color: 'from-purple-400 to-pink-600',
      badge: 'Flash Image',
      glow: 'purple',
    },
    {
      id: 'music' as NavSection,
      title: 'Music Generation',
      desc: 'Lyria 3 30s clips & Web Audio 32-band harmonic synth',
      icon: Music,
      color: 'from-indigo-400 to-cyan-500',
      badge: 'Lyria 3',
      glow: 'cyan',
    },
    {
      id: 'video' as NavSection,
      title: 'Video Generation',
      desc: 'Veo 3.1 Neural Holo-Motion text-to-video rendering',
      icon: Video,
      color: 'from-pink-500 to-purple-600',
      badge: 'Veo 3.1',
      glow: 'purple',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Hero OS Status with Live Neon Orb & Cursor Spotlight */}
      <GlassCard glowColor="cyan" className="p-6 md:p-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3 text-center md:text-left flex-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span>NOVA OS // VIBRANT & READY ✨</span>
              {lowDataMode && (
                <span className="ml-2 text-emerald-400 font-bold bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">
                  LITE DATA ACTIVE
                </span>
              )}
            </div>

            <h2 className="font-display font-bold text-2xl md:text-3xl text-white">
              Welcome back! ✨ Nova is feeling joyful and ready to hang out with you in{' '}
              <span className="bg-gradient-to-r from-cyan-300 via-indigo-300 to-purple-300 bg-clip-text text-transparent">
                {currentMood.name}
              </span>
              .
            </h2>

            <p className="text-sm text-slate-300 max-w-xl leading-relaxed">
              Your overall energy is in a great place today (<strong className="text-cyan-300 font-semibold">92.4% harmony</strong>).
              Whether you want to have a fun chat with Nova, generate some music, test speech pacing, or brainstorm creative ideas, we're ready!
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-3">
              <NeonButton
                variant="primary"
                size="md"
                onClick={() => onNavigate('companion')}
                icon={<Sparkles className="w-4 h-4" />}
              >
                Chat with Nova ✨
              </NeonButton>

              <NeonButton
                variant="secondary"
                size="md"
                onClick={() => onNavigate('speech')}
                icon={<Mic className="w-4 h-4" />}
              >
                Voice Activities 🎙️
              </NeonButton>

              <NeonButton
                variant="glow-subtle"
                size="md"
                onClick={() => onNavigate('music')}
                icon={<Music className="w-4 h-4" />}
              >
                Make Music 🎵
              </NeonButton>

              <NeonButton
                variant="ghost"
                size="md"
                onClick={() => onNavigate('data-usage')}
                icon={<Wifi className="w-4 h-4" />}
              >
                Data Usage (79% Saved)
              </NeonButton>
            </div>
          </div>

          {/* Interactive Floating Orb Widget */}
          <div className="relative shrink-0 flex flex-col items-center">
            <NeonOrb
              state="idle"
              size="lg"
              onClick={() => {
                cyberAudio.play('neon');
                onNavigate('companion');
              }}
            />
            <span className="text-[11px] font-mono text-cyan-400 mt-2 tracking-wider">
              TAP TO ENGAGE NOVA
            </span>
          </div>
        </div>
      </GlassCard>

      {/* Multimedia Generation Hub: Speech, Pictures, Music, Video */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <h3 className="font-display font-bold text-base text-white">
              Multimodal Generative Studios
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-400">
            GOOGLE GENAI SDK 2040
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {multimediaStudios.map((studio, idx) => {
            const Icon = studio.icon;
            return (
              <motion.div
                key={studio.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08, duration: 0.3 }}
              >
                <GlassCard
                  interactive
                  glowColor={studio.glow as any}
                  onClick={() => {
                    cyberAudio.play('click');
                    onNavigate(studio.id);
                  }}
                  className="p-5 h-full flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${studio.color} flex items-center justify-center text-white shadow-lg`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-mono font-bold text-cyan-300 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-500/20">
                        {studio.badge}
                      </span>
                    </div>

                    <h4 className="font-display font-bold text-sm text-white mb-1">
                      {studio.title}
                    </h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {studio.desc}
                    </p>
                  </div>

                  <div className="pt-3 mt-3 border-t border-white/[0.06] flex items-center justify-between text-xs text-cyan-300 font-medium group-hover:text-white">
                    <span>Enter Studio</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </div>
                </GlassCard>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Primary Statistics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            title: 'Cognitive Coherence',
            value: 94,
            suffix: '%',
            change: '+6.2% vs baseline',
            color: 'cyan',
            icon: Brain,
          },
          {
            title: 'Emotional Valence',
            value: 88,
            suffix: '%',
            change: 'Optimal resonance',
            color: 'purple',
            icon: Sparkles,
          },
          {
            title: 'Bandwidth Saved',
            value: 79,
            suffix: '%',
            change: 'Small Data Usage active',
            color: 'emerald',
            icon: Wifi,
          },
          {
            title: 'Memory Vault Entries',
            value: journalEntries.length,
            suffix: ' reflections',
            change: 'All synthesized',
            color: 'amber',
            icon: Layers,
          },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.35 }}
            >
              <GlassCard interactive glowColor={stat.color as any} className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-slate-400 font-medium">{stat.title}</span>
                  <div className="w-8 h-8 rounded-lg bg-slate-900 border border-white/10 flex items-center justify-center text-cyan-400">
                    <Icon className="w-4 h-4" />
                  </div>
                </div>

                <div className="text-2xl font-display font-bold text-white mb-1">
                  <AnimatedStatCounter value={stat.value} suffix={stat.suffix} />
                </div>

                <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                  <span className="text-cyan-400 font-semibold">{stat.change}</span>
                </div>
              </GlassCard>
            </motion.div>
          );
        })}
      </div>

      {/* Main Charts & Progress Rings Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Drawing Waveform Chart */}
        <div className="lg:col-span-2">
          <NeuralChart
            data={chartData}
            metric="coherence"
            title="Circadian Cognitive Waveform (Today)"
            height={220}
          />
        </div>

        {/* Dynamic Animated Progress Rings */}
        <GlassCard glowColor="purple" className="p-6 flex flex-col justify-between">
          <div>
            <h4 className="font-display font-semibold text-sm text-slate-100 mb-5 flex items-center gap-2">
              <Activity className="w-4 h-4 text-purple-400" />
              Real-Time Equilibrium Rings
            </h4>

            <div className="grid grid-cols-2 gap-4 py-2">
              <AnimatedProgressRing
                progress={94}
                size={100}
                color="cyan"
                label="Mind Sync"
                sublabel="Flow"
              />
              <AnimatedProgressRing
                progress={82}
                size={100}
                color="purple"
                label="Equanimity"
                sublabel="Zen"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-white/[0.06] text-center">
            <span className="text-xs text-cyan-300 font-mono">
              ALL SYSTEMS IN HARMONIC BALANCE
            </span>
          </div>
        </GlassCard>
      </div>

      {/* Bottom Row: Recent Journal Cards & Small Data Mode Banner */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent Journal Reflections */}
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-display font-bold text-base text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-400" />
              Latest Neural Reflections
            </h4>
            <button
              onClick={() => onNavigate('journal')}
              className="text-xs text-cyan-300 hover:text-white flex items-center gap-1 font-medium cursor-pointer"
            >
              <span>View Vault</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {journalEntries.slice(0, 2).map((entry) => (
              <div
                key={entry.id}
                onClick={() => onNavigate('journal')}
                className="p-3.5 rounded-xl bg-slate-900/60 border border-white/[0.06] hover:border-cyan-500/30 transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-sm text-white line-clamp-1">
                    {entry.title}
                  </span>
                  <span className="text-[10px] text-cyan-400 font-mono">
                    {entry.coherenceScore}% COH
                  </span>
                </div>
                <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                  {entry.content}
                </p>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Small Data Usage Efficiency Banner */}
        <GlassCard glowColor="cyan" className="p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2 text-emerald-400 font-mono text-xs">
              <Wifi className="w-4 h-4 animate-pulse" />
              <span>QUANTUM BANDWIDTH COMPRESSION</span>
            </div>
            <h4 className="font-display font-bold text-lg text-white mb-2">
              Small Data Usage & 79% Less Bandwidth
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              On-device procedural synthesis and compressed micro-packets allow MindMirror AI to run blazingly fast even on low-bandwidth mobile connections.
            </p>
          </div>

          <NeonButton
            variant="primary"
            size="md"
            onClick={() => onNavigate('data-usage')}
            icon={<Wifi className="w-4 h-4" />}
          >
            Inspect Bandwidth Optimizer
          </NeonButton>
        </GlassCard>
      </div>
    </div>
  );
};
