import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, Sparkles } from 'lucide-react';
import { cyberAudio } from '../utils/audio';

interface NeonButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'glow-subtle';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  success?: boolean;
  successText?: string;
  glowColor?: 'cyan' | 'purple' | 'emerald' | 'amber';
  icon?: React.ReactNode;
  children: React.ReactNode;
}

interface Ripple {
  x: number;
  y: number;
  id: number;
}

export const NeonButton: React.FC<NeonButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  success = false,
  successText,
  glowColor = 'cyan',
  icon,
  children,
  onClick,
  className = '',
  disabled,
  ...props
}) => {
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || isLoading) return;

    // Calculate click coordinates for ripple wave
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const newRipple = { x, y, id: Date.now() };

      setRipples((prev) => [...prev.slice(-3), newRipple]);
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
      }, 700);
    }

    cyberAudio.play('click');
    if (onClick) {
      onClick(e);
    }
  };

  const handleMouseEnter = () => {
    if (!disabled && !isLoading) {
      cyberAudio.play('hover');
    }
  };

  // Base sizing
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs rounded-lg gap-1.5',
    md: 'px-4 py-2.5 text-sm rounded-xl gap-2',
    lg: 'px-6 py-3.5 text-base rounded-2xl gap-2.5 font-medium',
  }[size];

  // Variant styling
  const variantStyles = {
    primary:
      'relative text-white font-medium bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-600 bg-[length:200%_auto] animate-flowing hover:shadow-[0_0_25px_rgba(6,182,212,0.55),0_0_50px_rgba(168,85,247,0.35)] border border-cyan-300/30',
    secondary:
      'relative text-cyan-200 font-medium bg-slate-900/80 backdrop-blur-md hover:bg-slate-800/90 border border-cyan-500/30 hover:border-cyan-400 hover:shadow-[0_0_20px_rgba(6,182,212,0.3)]',
    ghost:
      'relative text-slate-300 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10 hover:shadow-[0_0_15px_rgba(255,255,255,0.08)]',
    danger:
      'relative text-rose-200 font-medium bg-gradient-to-r from-rose-600 to-pink-700 hover:shadow-[0_0_25px_rgba(244,63,94,0.5)] border border-rose-400/30',
    'glow-subtle':
      'relative text-slate-200 font-medium bg-slate-900/60 hover:bg-slate-800/80 border border-slate-700/60 hover:border-purple-400/50 hover:shadow-[0_0_20px_rgba(168,85,247,0.25)]',
  }[variant];

  return (
    <motion.button
      ref={buttonRef}
      whileHover={disabled ? {} : { scale: 1.03, y: -1 }}
      whileTap={disabled ? {} : { scale: 0.97, y: 1 }}
      transition={{ type: 'spring', stiffness: 450, damping: 22 }}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      disabled={disabled || isLoading}
      className={`relative inline-flex items-center justify-center overflow-hidden transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none ${sizeStyles} ${variantStyles} ${className}`}
      {...(props as any)}
    >
      {/* Light sheen sweeping across primary button */}
      {variant === 'primary' && (
        <span
          className="absolute inset-0 -translate-x-full hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none"
          aria-hidden="true"
        />
      )}

      {/* Ripple wave elements */}
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="absolute rounded-full bg-cyan-300/40 pointer-events-none animate-ripple"
          style={{
            left: ripple.x - 30,
            top: ripple.y - 30,
            width: 60,
            height: 60,
          }}
          aria-hidden="true"
        />
      ))}

      {/* Success state animation */}
      <AnimatePresence mode="wait">
        {success ? (
          <motion.span
            key="success-state"
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.6, opacity: 0 }}
            className="inline-flex items-center gap-1.5 text-emerald-300"
          >
            <motion.span
              initial={{ rotate: -45, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ type: 'spring', stiffness: 500, damping: 18 }}
            >
              <Check className="w-4 h-4 stroke-[2.5]" />
            </motion.span>
            <span>{successText || 'Synchronized'}</span>
          </motion.span>
        ) : isLoading ? (
          <motion.span
            key="loading-state"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="inline-flex items-center gap-2"
          >
            <span className="w-4 h-4 rounded-full border-2 border-cyan-200 border-t-transparent animate-spin" />
            <span>Processing...</span>
          </motion.span>
        ) : (
          <motion.span
            key="default-state"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="inline-flex items-center gap-2 z-10"
          >
            {icon && (
              <span className="transition-transform duration-200 group-hover:scale-110">
                {icon}
              </span>
            )}
            <span>{children}</span>
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
};
