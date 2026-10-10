import React from 'react';
import { motion } from 'motion/react';
import { Brain, Cpu, Sparkles } from 'lucide-react';

// 1. Neon Circular Loader
export const NeonCircularLoader: React.FC<{ size?: number; label?: string }> = ({
  size = 54,
  label,
}) => {
  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className="relative" style={{ width: size, height: size }}>
        {/* Outer neon spinning arc */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0 rounded-full border-2 border-transparent border-t-cyan-400 border-r-purple-500 shadow-[0_0_15px_rgba(6,182,212,0.6)]"
        />

        {/* Counter spinning inner ring */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-2 rounded-full border border-dashed border-cyan-300/40 border-b-pink-400"
        />

        {/* Pulsing center nucleus */}
        <motion.div
          animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute inset-0 m-auto w-2.5 h-2.5 rounded-full bg-cyan-300 shadow-[0_0_10px_#06b6d4]"
        />
      </div>
      {label && <span className="text-xs font-mono text-cyan-300 tracking-wider animate-pulse">{label}</span>}
    </div>
  );
};

// 2. Pulsing AI Brain Icon
export const PulsingBrainLoader: React.FC<{ label?: string }> = ({
  label = 'SYNTHESIZING NEURAL THOUGHTS...',
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-6 gap-3 select-none">
      <div className="relative flex items-center justify-center">
        {/* Expanding pulse ripple */}
        <motion.div
          animate={{ scale: [1, 1.8], opacity: [0.8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut' }}
          className="absolute w-14 h-14 rounded-full border border-cyan-400/50"
        />

        <motion.div
          animate={{ scale: [1, 1.4], opacity: [0.6, 0] }}
          transition={{ duration: 1.8, delay: 0.4, repeat: Infinity, ease: 'easeOut' }}
          className="absolute w-14 h-14 rounded-full border border-purple-400/50"
        />

        {/* Central brain box */}
        <motion.div
          animate={{ scale: [0.95, 1.08, 0.95] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          className="relative z-10 w-12 h-12 rounded-xl bg-gradient-to-tr from-cyan-500/20 via-indigo-600/30 to-purple-600/20 border border-cyan-400/40 shadow-[0_0_20px_rgba(6,182,212,0.4)] flex items-center justify-center"
        >
          <Brain className="w-6 h-6 text-cyan-300 animate-pulse" />
        </motion.div>
      </div>

      <div className="text-center">
        <p className="text-xs font-mono text-cyan-200 tracking-wider">{label}</p>
        <span className="text-[10px] text-slate-500 font-mono">QUANTUM COGNITION ACTIVE</span>
      </div>
    </div>
  );
};

// 3. Animated Glowing Progress Bar
export const GlowingProgressBar: React.FC<{ progress?: number; indeterminate?: boolean }> = ({
  progress = 65,
  indeterminate = true,
}) => {
  return (
    <div className="w-full">
      <div className="relative w-full h-2 rounded-full bg-slate-900/80 border border-white/[0.08] overflow-hidden">
        {indeterminate ? (
          <motion.div
            animate={{ x: ['-100%', '200%'] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            className="w-1/2 h-full rounded-full bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-500 shadow-[0_0_12px_rgba(6,182,212,0.8)]"
          />
        ) : (
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-500 shadow-[0_0_12px_rgba(6,182,212,0.8)]"
          />
        )}
      </div>
    </div>
  );
};

// 4. Skeleton Loading Card with Subtle Futuristic Gradient
export const SkeletonGlassCard: React.FC = () => {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-[#080d22]/60 border border-white/[0.06] p-5">
      {/* Animated shimmer sweep */}
      <motion.div
        animate={{ x: ['-100%', '200%'] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
        className="pointer-events-none absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-cyan-400/[0.08] to-transparent"
      />

      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-800/80" />
          <div className="space-y-1.5 flex-1">
            <div className="w-1/3 h-3.5 rounded bg-slate-800/80" />
            <div className="w-1/4 h-2.5 rounded bg-slate-800/60" />
          </div>
        </div>

        <div className="space-y-2">
          <div className="w-full h-3 rounded bg-slate-800/60" />
          <div className="w-5/6 h-3 rounded bg-slate-800/60" />
          <div className="w-2/3 h-3 rounded bg-slate-800/40" />
        </div>

        <div className="flex justify-between pt-2">
          <div className="w-20 h-5 rounded-md bg-slate-800/70" />
          <div className="w-16 h-5 rounded-md bg-slate-800/70" />
        </div>
      </div>
    </div>
  );
};
