import React, { useRef, useState } from 'react';
import { motion } from 'motion/react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  glowOnHover?: boolean;
  glowColor?: 'cyan' | 'purple' | 'emerald' | 'amber';
  interactive?: boolean;
  onClick?: () => void;
  style?: React.CSSProperties;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  glowOnHover = true,
  glowColor = 'cyan',
  interactive = false,
  onClick,
  style,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number; active: boolean }>({
    x: 0,
    y: 0,
    active: false,
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!glowOnHover || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      active: true,
    });
  };

  const handleMouseLeave = () => {
    setMousePos((prev) => ({ ...prev, active: false }));
  };

  const glowShadow = {
    cyan: 'hover:shadow-[0_0_30px_rgba(6,182,212,0.18)] hover:border-cyan-500/35',
    purple: 'hover:shadow-[0_0_30px_rgba(168,85,247,0.18)] hover:border-purple-500/35',
    emerald: 'hover:shadow-[0_0_30px_rgba(16,185,129,0.18)] hover:border-emerald-500/35',
    amber: 'hover:shadow-[0_0_30px_rgba(245,158,11,0.18)] hover:border-amber-500/35',
  }[glowColor];

  const radialColor = {
    cyan: 'rgba(6, 182, 212, 0.12)',
    purple: 'rgba(168, 85, 247, 0.12)',
    emerald: 'rgba(16, 185, 129, 0.12)',
    amber: 'rgba(245, 158, 11, 0.12)',
  }[glowColor];

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      whileHover={interactive ? { y: -4, transition: { duration: 0.25, ease: 'easeOut' } } : undefined}
      className={`relative overflow-hidden rounded-2xl bg-[#090d1f]/75 backdrop-blur-xl border border-white/[0.08] transition-all duration-300 ${glowShadow} ${
        interactive ? 'cursor-pointer' : ''
      } ${className}`}
      style={style}
    >
      {/* Dynamic Cursor Light Glare */}
      {mousePos.active && (
        <div
          className="pointer-events-none absolute -inset-px rounded-2xl opacity-100 transition-opacity duration-300"
          style={{
            background: `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, ${radialColor}, transparent 70%)`,
          }}
          aria-hidden="true"
        />
      )}

      {/* Subtle top border illumination */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent"
        aria-hidden="true"
      />

      <div className="relative z-10">{children}</div>
    </motion.div>
  );
};
