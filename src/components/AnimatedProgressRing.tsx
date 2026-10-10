import React from 'react';
import { motion } from 'motion/react';

interface AnimatedProgressRingProps {
  progress: number; // 0 to 100
  size?: number;
  strokeWidth?: number;
  color?: 'cyan' | 'purple' | 'emerald' | 'amber' | 'rose';
  label?: string;
  sublabel?: string;
  showValue?: boolean;
}

export const AnimatedProgressRing: React.FC<AnimatedProgressRingProps> = ({
  progress,
  size = 110,
  strokeWidth = 8,
  color = 'cyan',
  label,
  sublabel,
  showValue = true,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.min(100, Math.max(0, progress));
  const strokeDashoffset = circumference - (clamped / 100) * circumference;

  const colorMap = {
    cyan: {
      stroke: 'url(#gradient-cyan)',
      glow: 'rgba(6, 182, 212, 0.5)',
      from: '#06b6d4',
      to: '#3b82f6',
    },
    purple: {
      stroke: 'url(#gradient-purple)',
      glow: 'rgba(168, 85, 247, 0.5)',
      from: '#a855f7',
      to: '#ec4899',
    },
    emerald: {
      stroke: 'url(#gradient-emerald)',
      glow: 'rgba(16, 185, 129, 0.5)',
      from: '#10b981',
      to: '#06b6d4',
    },
    amber: {
      stroke: 'url(#gradient-amber)',
      glow: 'rgba(245, 158, 11, 0.5)',
      from: '#f59e0b',
      to: '#ef4444',
    },
    rose: {
      stroke: 'url(#gradient-rose)',
      glow: 'rgba(244, 63, 94, 0.5)',
      from: '#f43f5e',
      to: '#a855f7',
    },
  }[color];

  const gradientId = `ring-grad-${color}-${size}`;

  return (
    <div className="relative inline-flex flex-col items-center justify-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={colorMap.from} />
              <stop offset="100%" stopColor={colorMap.to} />
            </linearGradient>
            <filter id={`glow-${gradientId}`} x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Background track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="rgba(255, 255, 255, 0.07)"
            strokeWidth={strokeWidth}
            fill="transparent"
          />

          {/* Animated progress circle */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={`url(#${gradientId})`}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
            strokeLinecap="round"
            fill="transparent"
            style={{
              filter: `drop-shadow(0 0 6px ${colorMap.glow})`,
            }}
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          {showValue && (
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="font-display font-bold text-slate-100 leading-none"
              style={{ fontSize: size * 0.22 }}
            >
              {clamped}%
            </motion.span>
          )}
          {sublabel && (
            <span className="text-[10px] uppercase tracking-wider text-slate-400 mt-0.5">
              {sublabel}
            </span>
          )}
        </div>
      </div>

      {label && (
        <span className="text-xs font-medium text-slate-300 mt-2 text-center">
          {label}
        </span>
      )}
    </div>
  );
};
