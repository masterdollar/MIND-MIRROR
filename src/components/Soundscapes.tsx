import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Radio, Play, Square, Volume2, Sparkles, Waves, ShieldCheck } from 'lucide-react';
import { GlassCard } from './GlassCard';
import { NeonButton } from './NeonButton';
import { cyberAudio } from '../utils/audio';

interface FrequencyPreset {
  id: string;
  name: string;
  category: string;
  hz: number;
  description: string;
  color: string;
  glow: string;
}

export const Soundscapes: React.FC = () => {
  const [activeFrequencyId, setActiveFrequencyId] = useState<string | null>(null);

  const presets: FrequencyPreset[] = [
    {
      id: 'gamma-40',
      name: 'Gamma 40Hz Flow Catalyst',
      category: 'Deep Focus & Synaptic Binding',
      hz: 40,
      description: 'Used by neuroscientists to synchronize cross-hemispheric communication and induce hyper-focus states.',
      color: 'from-cyan-400 to-blue-600',
      glow: 'rgba(6, 182, 212, 0.6)',
    },
    {
      id: 'alpha-10',
      name: 'Alpha 10Hz Calm Alertness',
      category: 'Stress Dissipation & Flow',
      hz: 10,
      description: 'Calms the nervous system while preserving razor-sharp executive attention. Perfect for design & reading.',
      color: 'from-purple-400 to-indigo-600',
      glow: 'rgba(168, 85, 247, 0.6)',
    },
    {
      id: 'solfeggio-432',
      name: '432Hz Solfeggio Harmonic',
      category: 'Cellular Restoration & Peace',
      hz: 432,
      description: 'The golden acoustic ratio of natural resonance. Clears cognitive residue and somatic tension.',
      color: 'from-emerald-400 to-teal-600',
      glow: 'rgba(16, 185, 129, 0.6)',
    },
    {
      id: 'theta-6',
      name: 'Theta 6Hz Subconscious Drift',
      category: 'Lucid Imagination & Rest',
      hz: 110,
      description: 'Induces twilight hypnagogic receptivity. Ideal for deep contemplation and creative ideation.',
      color: 'from-amber-400 to-orange-600',
      glow: 'rgba(245, 158, 11, 0.6)',
    },
  ];

  const handleToggle = (preset: FrequencyPreset) => {
    if (activeFrequencyId === preset.id) {
      cyberAudio.stopFrequency();
      setActiveFrequencyId(null);
    } else {
      cyberAudio.playFrequency(preset.hz);
      setActiveFrequencyId(preset.id);
      cyberAudio.play('success');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-bold text-xl text-white flex items-center gap-2">
            <Radio className="w-5 h-5 text-cyan-400" />
            Neural Soundscapes & Frequency Synthesizer
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Pure mathematical sine tones and harmonic waves generated client-side via Web Audio API.
          </p>
        </div>

        {activeFrequencyId && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span>TRANSMITTING FREQUENCY ACTIVE</span>
          </div>
        )}
      </div>

      {/* Live Waveform Visualizer Bar */}
      <GlassCard glowColor="cyan" className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
            <Waves className="w-4 h-4 text-cyan-400" />
            <span>SPECTRAL WAVEFORM DYNAMICS</span>
          </div>
          <span className="text-[11px] font-mono text-cyan-400">
            {activeFrequencyId ? 'ACTIVE RESONANCE' : 'STANDBY MODE'}
          </span>
        </div>

        {/* Animated Visualizer Bars */}
        <div className="h-20 flex items-end justify-between gap-1 px-2 pt-2">
          {Array.from({ length: 42 }).map((_, i) => {
            const isActive = !!activeFrequencyId;
            return (
              <motion.div
                key={i}
                animate={
                  isActive
                    ? {
                        height: [
                          `${Math.sin(i * 0.3) * 35 + 40}%`,
                          `${Math.cos(i * 0.4) * 45 + 50}%`,
                          `${Math.sin(i * 0.2) * 30 + 35}%`,
                        ],
                        opacity: [0.6, 1, 0.6],
                      }
                    : { height: '8%', opacity: 0.25 }
                }
                transition={
                  isActive
                    ? {
                        duration: 0.8 + (i % 5) * 0.15,
                        repeat: Infinity,
                        repeatType: 'reverse',
                        ease: 'easeInOut',
                      }
                    : { duration: 0.3 }
                }
                className="w-full rounded-t bg-gradient-to-t from-cyan-500 via-indigo-500 to-purple-500"
                style={{
                  boxShadow: isActive ? '0 0 8px rgba(6,182,212,0.5)' : 'none',
                }}
              />
            );
          })}
        </div>
      </GlassCard>

      {/* Preset Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {presets.map((preset) => {
          const isPlaying = activeFrequencyId === preset.id;

          return (
            <GlassCard
              key={preset.id}
              interactive
              glowColor={isPlaying ? 'cyan' : 'purple'}
              className="p-6"
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono font-bold text-cyan-300">
                      {preset.hz} Hz
                    </span>
                    <span className="text-slate-600">·</span>
                    <span className="text-xs text-purple-300 font-medium">
                      {preset.category}
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-lg text-white">
                    {preset.name}
                  </h3>
                </div>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.92 }}
                  onClick={() => handleToggle(preset)}
                  className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                    isPlaying
                      ? 'bg-rose-500 text-white shadow-[0_0_20px_rgba(244,63,94,0.7)]'
                      : 'bg-gradient-to-tr from-cyan-500 to-purple-600 text-white shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                  }`}
                >
                  {isPlaying ? (
                    <Square className="w-5 h-5 fill-current" />
                  ) : (
                    <Play className="w-5 h-5 fill-current ml-0.5" />
                  )}
                </motion.button>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                {preset.description}
              </p>

              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-3 border-t border-white/[0.06]">
                <span>STATUS: {isPlaying ? 'TRANSMITTING' : 'IDLE'}</span>
                <span className="text-cyan-400 font-semibold">100% SYNTHESIZED</span>
              </div>
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
};
