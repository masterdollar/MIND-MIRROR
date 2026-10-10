import React, { useEffect, useRef } from 'react';
import { motion } from 'motion/react';

export type OrbState = 'idle' | 'listening' | 'generating' | 'speaking';

interface NeonOrbProps {
  state?: OrbState;
  size?: 'sm' | 'md' | 'lg' | 'hero';
  className?: string;
  onClick?: () => void;
}

export const NeonOrb: React.FC<NeonOrbProps> = ({
  state = 'idle',
  size = 'md',
  className = '',
  onClick,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Dimension settings
  const dimensions = {
    sm: { container: 64, core: 38, particles: 12 },
    md: { container: 130, core: 76, particles: 22 },
    lg: { container: 200, core: 120, particles: 36 },
    hero: { container: 280, core: 170, particles: 50 },
  }[size];

  // Particle field around the orb
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;

    const count = dimensions.particles;
    const particles = Array.from({ length: count }, () => {
      const angle = Math.random() * Math.PI * 2;
      const radius = dimensions.core * 0.7 + Math.random() * (dimensions.container * 0.45);
      const speed = (0.004 + Math.random() * 0.008) * (Math.random() > 0.5 ? 1 : -1);
      const size = 1 + Math.random() * 2.2;
      return {
        angle,
        radius,
        baseRadius: radius,
        speed,
        size,
        alpha: 0.3 + Math.random() * 0.6,
        pulseSpeed: 0.02 + Math.random() * 0.03,
      };
    });

    let time = 0;
    const render = () => {
      time += 1;
      ctx.clearRect(0, 0, width, height);

      // Speed up particles if generating
      const speedMultiplier = state === 'generating' ? 3.2 : state === 'listening' ? 1.6 : 1;

      particles.forEach((p) => {
        p.angle += p.speed * speedMultiplier;
        const currentRadius = p.baseRadius + Math.sin(time * p.pulseSpeed) * 6;
        const x = centerX + Math.cos(p.angle) * currentRadius;
        const y = centerY + Math.sin(p.angle) * currentRadius * 0.85;

        ctx.beginPath();
        ctx.arc(x, y, p.size, 0, Math.PI * 2);
        
        let color = 'rgba(6, 182, 212, '; // Cyan
        if (state === 'generating') {
          color = Math.random() > 0.5 ? 'rgba(236, 72, 153, ' : 'rgba(168, 85, 247, ';
        } else if (state === 'speaking') {
          color = 'rgba(129, 140, 248, ';
        }

        ctx.fillStyle = `${color}${p.alpha * (0.6 + Math.sin(time * 0.05) * 0.4)})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = state === 'generating' ? '#ec4899' : '#06b6d4';
        ctx.fill();
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [state, dimensions]);

  // Color dynamics based on state
  const getGlowStyles = () => {
    switch (state) {
      case 'generating':
        return {
          coreGradient: 'from-pink-500 via-purple-600 to-cyan-400',
          ringColor1: 'border-pink-400/60 shadow-[0_0_20px_rgba(236,72,153,0.6)]',
          ringColor2: 'border-cyan-400/60 shadow-[0_0_20px_rgba(6,182,212,0.6)]',
          auraBlur: 'bg-gradient-to-tr from-pink-500/40 via-purple-500/40 to-cyan-400/40',
        };
      case 'listening':
        return {
          coreGradient: 'from-cyan-400 via-teal-500 to-indigo-600',
          ringColor1: 'border-cyan-300/70 shadow-[0_0_25px_rgba(6,182,212,0.7)]',
          ringColor2: 'border-teal-400/50 shadow-[0_0_15px_rgba(20,184,166,0.5)]',
          auraBlur: 'bg-gradient-to-tr from-cyan-500/40 via-teal-400/30 to-blue-600/40',
        };
      case 'speaking':
        return {
          coreGradient: 'from-indigo-400 via-purple-500 to-cyan-300',
          ringColor1: 'border-indigo-400/60 shadow-[0_0_20px_rgba(99,102,241,0.6)]',
          ringColor2: 'border-purple-400/60 shadow-[0_0_20px_rgba(168,85,247,0.6)]',
          auraBlur: 'bg-gradient-to-tr from-indigo-500/40 via-purple-400/40 to-cyan-400/40',
        };
      case 'idle':
      default:
        return {
          coreGradient: 'from-cyan-400 via-indigo-600 to-purple-600',
          ringColor1: 'border-cyan-400/40 shadow-[0_0_18px_rgba(6,182,212,0.45)]',
          ringColor2: 'border-purple-400/40 shadow-[0_0_18px_rgba(168,85,247,0.45)]',
          auraBlur: 'bg-gradient-to-tr from-cyan-500/30 via-indigo-500/25 to-purple-600/30',
        };
    }
  };

  const currentGlow = getGlowStyles();

  return (
    <div
      onClick={onClick}
      className={`relative flex items-center justify-center select-none cursor-pointer ${className}`}
      style={{ width: dimensions.container, height: dimensions.container }}
    >
      {/* Background canvas for orbiting dust motes */}
      <canvas
        ref={canvasRef}
        width={dimensions.container}
        height={dimensions.container}
        className="pointer-events-none absolute inset-0 z-0"
      />

      {/* Floating Gentle Breathing Motion */}
      <motion.div
        animate={
          state === 'generating'
            ? {
                y: [-4, 4, -4],
                scale: [0.98, 1.05, 0.98],
                transition: { duration: 1.2, repeat: Infinity, ease: 'easeInOut' },
              }
            : {
                y: [-7, 7, -7],
                scale: [0.98, 1.02, 0.98],
                transition: { duration: 4.5, repeat: Infinity, ease: 'easeInOut' },
              }
        }
        className="relative flex items-center justify-center"
      >
        {/* Ambient Blur Aura */}
        <div
          className={`absolute rounded-full filter blur-2xl transition-all duration-700 pointer-events-none ${currentGlow.auraBlur}`}
          style={{
            width: dimensions.core * 1.5,
            height: dimensions.core * 1.5,
          }}
          aria-hidden="true"
        />

        {/* Outer Ring - Gyro Notched / Dashed */}
        <div
          className={`absolute rounded-full border border-dashed transition-all duration-500 pointer-events-none ${
            currentGlow.ringColor1
          } ${state === 'generating' ? 'animate-spin-medium' : 'animate-spin-slow'}`}
          style={{
            width: dimensions.core * 1.35,
            height: dimensions.core * 1.35,
          }}
          aria-hidden="true"
        />

        {/* Inner Counter-Rotating Ring */}
        <div
          className={`absolute rounded-full border border-dotted transition-all duration-500 pointer-events-none ${
            currentGlow.ringColor2
          } ${state === 'generating' ? 'animate-spin-medium' : 'animate-spin-reverse-slow'}`}
          style={{
            width: dimensions.core * 1.15,
            height: dimensions.core * 1.15,
          }}
          aria-hidden="true"
        />

        {/* Dynamic Expanding Ripple when Generating or Listening */}
        {state === 'generating' && (
          <div
            className="absolute rounded-full border border-pink-400/40 pointer-events-none animate-ripple"
            style={{
              width: dimensions.core,
              height: dimensions.core,
            }}
            aria-hidden="true"
          />
        )}
        {state === 'listening' && (
          <div
            className="absolute rounded-full border border-cyan-400/50 pointer-events-none animate-ripple"
            style={{
              width: dimensions.core,
              height: dimensions.core,
            }}
            aria-hidden="true"
          />
        )}

        {/* Spherical Glowing Core */}
        <div
          className={`relative rounded-full overflow-hidden shadow-2xl bg-gradient-to-tr ${currentGlow.coreGradient} ${
            state === 'generating' ? 'animate-flowing-fast' : 'animate-flowing'
          }`}
          style={{
            width: dimensions.core,
            height: dimensions.core,
            boxShadow:
              state === 'generating'
                ? '0 0 45px rgba(236,72,153,0.8), inset 0 0 25px rgba(255,255,255,0.7)'
                : '0 0 35px rgba(6,182,212,0.65), inset 0 0 20px rgba(255,255,255,0.5)',
          }}
        >
          {/* Internal Plasma Waves */}
          <div
            className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.8)_0%,transparent_60%)] pointer-events-none"
            aria-hidden="true"
          />
          <div
            className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_70%_70%,rgba(0,0,0,0.5)_0%,transparent_70%)] pointer-events-none"
            aria-hidden="true"
          />

          {/* Central Neural Nucleus Eye */}
          <motion.div
            animate={
              state === 'generating'
                ? { scale: [0.7, 1.25, 0.7], opacity: [0.7, 1, 0.7] }
                : { scale: [0.9, 1.05, 0.9], opacity: [0.8, 1, 0.8] }
            }
            transition={{
              duration: state === 'generating' ? 0.7 : 2.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute inset-0 m-auto rounded-full bg-white/70 blur-[2px]"
            style={{
              width: dimensions.core * 0.28,
              height: dimensions.core * 0.28,
            }}
          />
        </div>
      </motion.div>
    </div>
  );
};
