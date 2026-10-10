import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Sliders,
  Eye,
  Zap,
  Volume2,
  VolumeX,
  Sparkles,
  Layers,
  Cpu,
  RefreshCw,
  CheckCircle2,
} from 'lucide-react';
import { GlassCard } from './GlassCard';
import { NeonButton } from './NeonButton';
import {
  NeonCircularLoader,
  PulsingBrainLoader,
  GlowingProgressBar,
  SkeletonGlassCard,
} from './LoadingStates';
import { SystemSettings as ISystemSettings } from '../types';
import { cyberAudio } from '../utils/audio';

interface SystemSettingsProps {
  settings: ISystemSettings;
  onUpdateSettings: (newSettings: Partial<ISystemSettings>) => void;
}

export const SystemSettings: React.FC<SystemSettingsProps> = ({
  settings,
  onUpdateSettings,
}) => {
  const [activeLoaderDemo, setActiveLoaderDemo] = useState<'circular' | 'brain' | 'progress' | 'skeleton'>('circular');
  const [testSuccess, setTestSuccess] = useState<boolean>(false);

  const handleTestHaptic = () => {
    cyberAudio.play('success');
    setTestSuccess(true);
    setTimeout(() => setTestSuccess(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display font-bold text-xl text-white flex items-center gap-2">
          <Sliders className="w-5 h-5 text-cyan-400" />
          MindMirror OS 2040 // Engine Diagnostics & Motion Control
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Fine-tune the cybernetic animation physics, sensory audio feedback, and accessibility parameters.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Motion & Physics Controller */}
        <GlassCard glowColor="cyan" className="p-6 space-y-5">
          <div className="flex items-center gap-2 text-sm font-semibold text-white">
            <Zap className="w-4 h-4 text-cyan-400" />
            <span>Animation Engine & Motion Physics</span>
          </div>

          {/* Reduced Motion Toggle */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900/60 border border-white/[0.06]">
            <div>
              <span className="text-sm font-medium text-white block">
                Reduced Motion Mode
              </span>
              <span className="text-xs text-slate-400">
                Disables floating orbs and particle drift for high accessibility
              </span>
            </div>

            <button
              onClick={() => {
                cyberAudio.play('click');
                onUpdateSettings({ reducedMotion: !settings.reducedMotion });
              }}
              className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                settings.reducedMotion ? 'bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.6)]' : 'bg-slate-800'
              }`}
            >
              <motion.div
                animate={{ x: settings.reducedMotion ? 26 : 2 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                className="w-5 h-5 rounded-full bg-white mt-0.5"
              />
            </button>
          </div>

          {/* Particle Density */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-slate-300 flex items-center justify-between">
              <span>Background Particle Mesh</span>
              <span className="text-cyan-400 font-mono uppercase">{settings.particleDensity}</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['off', 'medium', 'high'] as const).map((density) => (
                <button
                  key={density}
                  onClick={() => {
                    cyberAudio.play('click');
                    onUpdateSettings({ particleDensity: density });
                  }}
                  className={`py-2 rounded-xl text-xs font-medium uppercase font-mono transition-all cursor-pointer ${
                    settings.particleDensity === density
                      ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_12px_rgba(6,182,212,0.6)]'
                      : 'bg-slate-900/60 text-slate-400 border border-white/5 hover:text-white'
                  }`}
                >
                  {density}
                </button>
              ))}
            </div>
          </div>

          {/* Sound & Sensory Feedback */}
          <div className="pt-2 border-t border-white/[0.06] space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-medium text-white block">
                  Web Audio Harmonic Feedback
                </span>
                <span className="text-xs text-slate-400">
                  Subtle harmonic chimes, clicks, and neon frequency pulses
                </span>
              </div>

              <button
                onClick={() => {
                  const next = !settings.soundEnabled;
                  cyberAudio.setSoundEnabled(next);
                  onUpdateSettings({ soundEnabled: next });
                  if (next) cyberAudio.play('success');
                }}
                className={`p-2 rounded-xl border transition-all cursor-pointer ${
                  settings.soundEnabled
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                    : 'bg-slate-900 text-slate-500 border-white/10'
                }`}
              >
                {settings.soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
              </button>
            </div>

            <div className="flex justify-end">
              <NeonButton
                variant="secondary"
                size="sm"
                onClick={handleTestHaptic}
                success={testSuccess}
                successText="Resonance Verified"
                icon={<Sparkles className="w-3.5 h-3.5" />}
              >
                Test Sound & Neon Burst
              </NeonButton>
            </div>
          </div>
        </GlassCard>

        {/* Futuristic Loading States Showroom */}
        <GlassCard glowColor="purple" className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-semibold text-white">
              <Layers className="w-4 h-4 text-purple-400" />
              <span>Futuristic Loading States Showcase</span>
            </div>

            <span className="text-[10px] font-mono text-purple-300 uppercase">
              INTERACTIVE
            </span>
          </div>

          <p className="text-xs text-slate-400">
            Interactive preview of custom cybernetic loaders replacing standard boring spinners:
          </p>

          {/* Loader Selector Tabs */}
          <div className="grid grid-cols-4 gap-1 p-1 bg-slate-900/80 rounded-xl border border-white/[0.08]">
            {[
              { id: 'circular', label: 'Neon Ring' },
              { id: 'brain', label: 'AI Brain' },
              { id: 'progress', label: 'Glowing Bar' },
              { id: 'skeleton', label: 'Skeleton' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  cyberAudio.play('click');
                  setActiveLoaderDemo(tab.id as any);
                }}
                className={`py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                  activeLoaderDemo === tab.id
                    ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold shadow-[0_0_12px_rgba(168,85,247,0.5)]'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Loader Canvas Preview */}
          <div className="min-h-[170px] rounded-xl bg-slate-950/70 border border-white/[0.06] flex items-center justify-center p-4">
            {activeLoaderDemo === 'circular' && (
              <NeonCircularLoader label="QUANTUM ENCRYPTION ROTATING..." />
            )}
            {activeLoaderDemo === 'brain' && (
              <PulsingBrainLoader label="SYNTHESIZING NEURAL SYNAPSE..." />
            )}
            {activeLoaderDemo === 'progress' && (
              <div className="w-full max-w-xs space-y-3">
                <div className="flex justify-between text-xs font-mono text-cyan-300">
                  <span>COGNITIVE MATRIX SHIELD</span>
                  <span>78%</span>
                </div>
                <GlowingProgressBar progress={78} indeterminate={false} />
              </div>
            )}
            {activeLoaderDemo === 'skeleton' && (
              <div className="w-full max-w-sm">
                <SkeletonGlassCard />
              </div>
            )}
          </div>
        </GlassCard>
      </div>

      {/* System Telemetry Specs */}
      <GlassCard className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <h4 className="font-display font-semibold text-sm text-white">
              MindMirror OS Hardware & Neural Telemetry
            </h4>
          </div>
          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-500/20 px-2 py-0.5 rounded">
            ALL SIGNALS NOMINAL
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono text-slate-400">
          <div>
            <span className="block text-[10px] text-slate-500">MODEL INFERENCE</span>
            <span className="text-white font-bold">gemini-3.8-flash</span>
          </div>
          <div>
            <span className="block text-[10px] text-slate-500">RENDER REFRESH</span>
            <span className="text-cyan-300 font-bold">60.0 FPS SMOOTH</span>
          </div>
          <div>
            <span className="block text-[10px] text-slate-500">AUDIO ENGINE</span>
            <span className="text-purple-300 font-bold">Web Audio 44.1kHz</span>
          </div>
          <div>
            <span className="block text-[10px] text-slate-500">BUILD ARCHITECTURE</span>
            <span className="text-white font-bold">Vite 8 + Tailwind v4</span>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};
