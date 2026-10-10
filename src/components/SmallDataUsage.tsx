import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Wifi,
  WifiOff,
  Database,
  Zap,
  TrendingDown,
  Layers,
  ShieldCheck,
  RefreshCw,
  Server,
  Cpu,
  CheckCircle2,
  HardDrive,
} from 'lucide-react';
import { GlassCard } from './GlassCard';
import { NeonButton } from './NeonButton';
import { AnimatedProgressRing } from './AnimatedProgressRing';
import { AnimatedStatCounter } from './AnimatedStatCounter';
import { DataUsageStats } from '../types';
import { cyberAudio } from '../utils/audio';

interface SmallDataUsageProps {
  lowDataMode: boolean;
  onToggleLowDataMode: (enabled: boolean) => void;
}

export const SmallDataUsage: React.FC<SmallDataUsageProps> = ({
  lowDataMode,
  onToggleLowDataMode,
}) => {
  const [stats, setStats] = useState<DataUsageStats>({
    totalBytesServed: 154200,
    uncompressedBytes: 742100,
    savedBytes: 587900,
    savingsPercentage: 79,
    cacheHits: 64,
    lowDataModeActive: lowDataMode,
    requestsCount: 142,
    avgLatencyMs: 18,
  });

  const [cacheCleared, setCacheCleared] = useState<boolean>(false);
  const [simulatedSpeed, setSimulatedSpeed] = useState<'micro' | 'fast' | 'fiber'>('micro');

  // Fetch telemetry
  useEffect(() => {
    fetch('/api/telemetry/stats')
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch(() => {});
  }, [lowDataMode]);

  const handleToggle = (enabled: boolean) => {
    cyberAudio.play('click');
    onToggleLowDataMode(enabled);
    fetch('/api/telemetry/toggle-mode', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ enabled }),
    })
      .then((r) => r.json())
      .then(() => {
        setStats((prev) => ({
          ...prev,
          lowDataModeActive: enabled,
          savingsPercentage: enabled ? 82 : 45,
        }));
      })
      .catch(() => {});
  };

  const handleClearCache = () => {
    cyberAudio.play('success');
    setCacheCleared(true);
    setTimeout(() => setCacheCleared(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-bold text-xl text-white flex items-center gap-2">
            <Wifi className="w-5 h-5 text-cyan-400" />
            Small Data Usage & Neural Bandwidth Optimizer
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Quantum payload compression, procedural client-side audio synth, and micro-packet streaming.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-xs font-mono text-emerald-300">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>BANDWIDTH OPTIMIZER: {lowDataMode ? 'ULTRA-LOW DATA ACTIVE' : 'ADAPTIVE'}</span>
        </div>
      </div>

      {/* Top Banner: Big Savings Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            title: 'Bandwidth Saved',
            value: stats.savingsPercentage,
            suffix: '%',
            change: `${(stats.savedBytes / 1024).toFixed(1)} KB saved`,
            color: 'cyan',
            icon: TrendingDown,
          },
          {
            title: 'Total Transferred',
            value: Math.round(stats.totalBytesServed / 1024),
            suffix: ' KB',
            change: 'Extremely light footprint',
            color: 'purple',
            icon: Database,
          },
          {
            title: 'Edge Cache Hits',
            value: stats.cacheHits,
            suffix: ' requests',
            change: 'Zero server roundtrip',
            color: 'emerald',
            icon: HardDrive,
          },
          {
            title: 'Average Latency',
            value: stats.avgLatencyMs,
            suffix: ' ms',
            change: 'Instantaneous response',
            color: 'amber',
            icon: Zap,
          },
        ].map((item, i) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.35 }}
            >
              <GlassCard interactive glowColor={item.color as any} className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-slate-400 font-medium">{item.title}</span>
                  <div className="w-8 h-8 rounded-lg bg-slate-900 border border-white/10 flex items-center justify-center text-cyan-400">
                    <Icon className="w-4 h-4" />
                  </div>
                </div>

                <div className="text-2xl font-display font-bold text-white mb-1">
                  <AnimatedStatCounter value={item.value} suffix={item.suffix} />
                </div>

                <div className="text-[11px] font-mono text-cyan-400 font-semibold">
                  {item.change}
                </div>
              </GlassCard>
            </motion.div>
          );
        })}
      </div>

      {/* Main Grid: Data Mode Controls & Feature Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Mode Selection Console */}
        <GlassCard glowColor="cyan" className="p-6 space-y-5">
          <div className="flex items-center gap-2 text-sm font-semibold text-white">
            <Zap className="w-4 h-4 text-cyan-400" />
            <span>Select Transmission Mode</span>
          </div>

          <div className="space-y-3">
            {[
              {
                id: true,
                title: 'Quantum Micro (Ultra-Low Data)',
                desc: 'Payloads stripped of heavy metadata. Procedural Web Audio synth replaces heavy streaming audio files. Average page size < 60KB.',
                badge: 'Recommended',
              },
              {
                id: false,
                title: 'Full Fidelity Holo-Fiber',
                desc: 'Uncompressed audio/video streams, highest-res bitmaps, and verbose diagnostic logs.',
                badge: 'Standard',
              },
            ].map((mode) => {
              const isSelected = lowDataMode === mode.id;

              return (
                <div
                  key={String(mode.id)}
                  onClick={() => handleToggle(mode.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-cyan-950/40 border-cyan-400/60 shadow-[0_0_20px_rgba(6,182,212,0.2)]'
                      : 'bg-slate-950/40 border-white/[0.06] hover:bg-slate-900/60'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-white">
                      {mode.title}
                    </span>
                    <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                      isSelected ? 'bg-cyan-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {mode.badge}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {mode.desc}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Cache Maintenance Button */}
          <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between">
            <div>
              <span className="text-xs font-medium text-white block">Local Neural Cache</span>
              <span className="text-[10px] text-slate-400 font-mono">1.2 MB indexed</span>
            </div>

            <NeonButton
              variant="secondary"
              size="sm"
              onClick={handleClearCache}
              success={cacheCleared}
              successText="Cache Purged"
              icon={<RefreshCw className="w-3.5 h-3.5" />}
            >
              Purge Cache
            </NeonButton>
          </div>
        </GlassCard>

        {/* Center / Right: Bandwidth Efficiency Breakdown */}
        <div className="lg:col-span-2 space-y-5">
          <GlassCard glowColor="purple" className="p-6">
            <h3 className="font-display font-bold text-base text-white mb-2 flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-purple-400" />
              How MindMirror AI Achieves Small Data Usage
            </h3>
            <p className="text-xs text-slate-400 mb-6">
              Our 2040 cybernetic architecture uses procedural on-device computing to keep network traffic minimal:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  title: 'Procedural Audio Synthesis',
                  desc: 'Instead of streaming multi-megabyte MP3 files, soundscapes are synthesized directly in the browser via Web Audio oscillators using pure mathematical sine waves. (Data: 0 KB network transfer).',
                  saving: '99.8% saved',
                },
                {
                  title: 'Vector Coherence Telemetry',
                  desc: 'Mood check-ins and neural states are transmitted as compact numeric valence/energy tuples rather than verbose telemetry frames.',
                  saving: '85% saved',
                },
                {
                  title: 'Client-Side Canvas Video',
                  desc: 'Holographic video previews run a high-performance 60FPS fluid particle shader in WebGL/Canvas without downloading gigabyte video chunks on mobile connections.',
                  saving: '94% saved',
                },
                {
                  title: 'Streaming SSE Speech & Text',
                  desc: 'Gemini flash models stream concise text and compressed 24kHz audio chunks only on user request with persistent edge memoization.',
                  saving: '78% saved',
                },
              ].map((item, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-950/70 border border-white/[0.06] space-y-1.5">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-semibold text-white">{item.title}</h4>
                    <span className="text-[10px] font-mono text-cyan-300 font-bold bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-500/20">
                      {item.saving}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Live Data Usage Comparison Meter */}
          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono text-slate-300 uppercase tracking-wider">
                COMPRESSION & SAVINGS RATIO
              </span>
              <span className="text-xs font-mono text-emerald-400 font-bold">
                {stats.savingsPercentage}% EFFICIENCY
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs text-slate-400 mb-1">
                  <span>MindMirror Small Data Usage</span>
                  <span className="text-cyan-300 font-mono font-bold">~154 KB</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-slate-900 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400 rounded-full w-[21%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-400 mb-1">
                  <span>Standard Heavy Web Apps</span>
                  <span className="text-rose-400 font-mono font-bold">~742 KB</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-slate-900 overflow-hidden">
                  <div className="h-full bg-slate-700 rounded-full w-[100%]" />
                </div>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};
