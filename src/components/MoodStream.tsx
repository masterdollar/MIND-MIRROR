import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { InteractiveMoodSelector, PRESET_MOODS } from './InteractiveMoodSelector';
import { NeuralChart } from './NeuralChart';
import { AnimatedProgressRing } from './AnimatedProgressRing';
import { GlassCard } from './GlassCard';
import { Mood, MoodLog } from '../types';
import { Activity, Clock, Filter, Sparkles, TrendingUp, Calendar } from 'lucide-react';
import { cyberAudio } from '../utils/audio';

interface MoodStreamProps {
  moodLogs: MoodLog[];
  onLogMood: (log: MoodLog) => void;
}

export const MoodStream: React.FC<MoodStreamProps> = ({ moodLogs, onLogMood }) => {
  const [selectedRange, setSelectedRange] = useState<'7d' | '30d'>('7d');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Chart data
  const chartData7d = [
    { label: 'Mon', valence: 75, energy: 68, coherence: 82 },
    { label: 'Tue', valence: 88, energy: 90, coherence: 91 },
    { label: 'Wed', valence: 65, energy: 45, coherence: 74 },
    { label: 'Thu', valence: 92, energy: 85, coherence: 94 },
    { label: 'Fri', valence: 86, energy: 78, coherence: 89 },
    { label: 'Sat', valence: 94, energy: 60, coherence: 95 },
    { label: 'Sun', valence: 90, energy: 75, coherence: 92 },
  ];

  const chartData30d = [
    { label: 'W1', valence: 78, energy: 70, coherence: 80 },
    { label: 'W2', valence: 84, energy: 82, coherence: 87 },
    { label: 'W3', valence: 72, energy: 60, coherence: 76 },
    { label: 'W4', valence: 91, energy: 85, coherence: 93 },
  ];

  const activeChartData = selectedRange === '7d' ? chartData7d : chartData30d;

  return (
    <div className="space-y-6">
      {/* Top Interactive Mood Check-in */}
      <InteractiveMoodSelector onLogMood={onLogMood} />

      {/* Analytics & Biometric Waveform Drawing */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-base text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              Emotional Biometric Stream
            </h3>

            {/* Timeframe segmented control */}
            <div className="flex items-center gap-1 p-1 bg-slate-900/80 rounded-xl border border-white/[0.08]">
              <button
                onClick={() => {
                  cyberAudio.play('click');
                  setSelectedRange('7d');
                }}
                className={`px-3 py-1 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                  selectedRange === '7d'
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_12px_rgba(6,182,212,0.6)]'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                7 Days
              </button>
              <button
                onClick={() => {
                  cyberAudio.play('click');
                  setSelectedRange('30d');
                }}
                className={`px-3 py-1 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                  selectedRange === '30d'
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_12px_rgba(6,182,212,0.6)]'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                30 Days
              </button>
            </div>
          </div>

          <NeuralChart
            data={activeChartData}
            metric="coherence"
            title={`${selectedRange === '7d' ? 'Weekly' : 'Monthly'} Synaptic Coherence Wave`}
            height={220}
          />
        </div>

        {/* Progress Rings & Distribution Breakdown */}
        <div className="flex flex-col justify-between p-5 rounded-2xl bg-[#080d22]/80 border border-white/[0.08] backdrop-blur-xl">
          <div>
            <h4 className="font-display font-semibold text-sm text-slate-200 mb-4 flex items-center gap-2">
              <Activity className="w-4 h-4 text-purple-400" />
              Bio-Resonance Breakdown
            </h4>

            <div className="flex items-center justify-around py-3">
              <AnimatedProgressRing
                progress={88}
                size={95}
                color="cyan"
                label="Mind Balance"
                sublabel="Flow"
              />
              <AnimatedProgressRing
                progress={74}
                size={95}
                color="purple"
                label="Synaptic Rest"
                sublabel="Recovery"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-white/[0.06] space-y-2">
            <div className="text-xs text-slate-400 font-mono flex items-center justify-between">
              <span>PEAK COGNITIVE WINDOW</span>
              <span className="text-cyan-300 font-bold">09:30 - 12:00</span>
            </div>
            <div className="text-xs text-slate-400 font-mono flex items-center justify-between">
              <span>AVERAGE VALENCE</span>
              <span className="text-purple-300 font-bold">84% Positive</span>
            </div>
          </div>
        </div>
      </div>

      {/* Historical Stream Feed */}
      <div className="space-y-3">
        <h3 className="font-display font-bold text-base text-white flex items-center gap-2">
          <Clock className="w-4 h-4 text-cyan-400" />
          Temporal Resonance Log
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence initial={false}>
            {moodLogs.map((log, index) => {
              const mood = PRESET_MOODS.find((m) => m.id === log.moodId) || PRESET_MOODS[0];
              const dateStr = new Date(log.timestamp).toLocaleDateString([], {
                month: 'short',
                day: 'numeric',
              });
              const timeStr = new Date(log.timestamp).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                >
                  <GlassCard
                    interactive
                    glowColor="cyan"
                    className="p-4"
                  >
                    <div className="flex items-center justify-between mb-2.5">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-3 h-3 rounded-full bg-gradient-to-tr ${mood.color}`}
                          style={{ boxShadow: `0 0 10px ${mood.glowColor}` }}
                        />
                        <span className="font-semibold text-sm text-white">{mood.name}</span>
                      </div>
                      <span className="text-xs font-mono font-bold text-cyan-300 bg-cyan-950/50 px-2 py-0.5 rounded border border-cyan-500/20">
                        {log.intensity}/10
                      </span>
                    </div>

                    {log.note && (
                      <p className="text-xs text-slate-300 mb-3 italic">"{log.note}"</p>
                    )}

                    {/* Unboxed metadata tags per frontend design instructions */}
                    <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-400 mb-2">
                      {log.tags.map((t, ti) => (
                        <React.Fragment key={ti}>
                          <span className="text-cyan-400/90">#{t}</span>
                          {ti < log.tags.length - 1 && <span aria-hidden="true" className="text-slate-600">·</span>}
                        </React.Fragment>
                      ))}
                    </div>

                    <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-[10px] text-slate-500 font-mono">
                      <span>{dateStr}</span>
                      <span>{timeStr}</span>
                    </div>
                  </GlassCard>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
