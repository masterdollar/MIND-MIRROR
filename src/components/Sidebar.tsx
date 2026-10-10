import React from 'react';
import { motion } from 'motion/react';
import {
  LayoutDashboard,
  Sparkles,
  Mic,
  Image,
  Music,
  Video,
  Activity,
  BookOpen,
  Wifi,
  Sliders,
  Cpu,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { cyberAudio } from '../utils/audio';

export type NavSection =
  | 'dashboard'
  | 'companion'
  | 'speech'
  | 'pictures'
  | 'music'
  | 'video'
  | 'mood'
  | 'journal'
  | 'data-usage'
  | 'settings';

interface SidebarProps {
  currentSection: NavSection;
  onSelectSection: (section: NavSection) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  activeMoodCount?: number;
  lowDataMode?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentSection,
  onSelectSection,
  soundEnabled,
  onToggleSound,
  lowDataMode = true,
}) => {
  const navItems: { id: NavSection; label: string; icon: React.FC<any>; badge?: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'companion', label: 'AI Companion', icon: Sparkles, badge: 'Live' },
    { id: 'speech', label: 'Speech Activities', icon: Mic, badge: 'TTS' },
    { id: 'pictures', label: 'Picture Studio', icon: Image, badge: 'Gen' },
    { id: 'music', label: 'Music Studio', icon: Music, badge: 'Audio' },
    { id: 'video', label: 'Video Studio', icon: Video, badge: 'Veo' },
    { id: 'mood', label: 'Mood Stream', icon: Activity },
    { id: 'journal', label: 'Neural Journal', icon: BookOpen },
    { id: 'data-usage', label: 'Small Data Usage', icon: Wifi, badge: lowDataMode ? 'Lite' : undefined },
    { id: 'settings', label: 'OS Settings', icon: Sliders },
  ];

  const handleItemClick = (id: NavSection) => {
    if (id !== currentSection) {
      cyberAudio.play('neon');
      onSelectSection(id);
    }
  };

  return (
    <aside className="w-64 h-full flex flex-col justify-between py-5 px-3 bg-[#070a18]/90 backdrop-blur-2xl border-r border-white/[0.08] select-none z-30 overflow-y-auto">
      {/* Brand Header */}
      <div>
        <div className="flex items-center gap-3 px-3 mb-6">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-purple-600 shadow-[0_0_18px_rgba(6,182,212,0.5)]">
            <Cpu className="w-5 h-5 text-white" />
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping opacity-75" />
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-cyan-300" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-display font-bold text-base tracking-wide bg-gradient-to-r from-cyan-200 via-white to-purple-200 bg-clip-text text-transparent">
                MINDMIRROR
              </span>
              <span className="text-[10px] font-mono text-cyan-400 font-semibold px-1 py-0.2 bg-cyan-500/10 border border-cyan-500/20 rounded">
                2040
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Multimedia Cognitive OS</p>
          </div>
        </div>

        {/* Menu Navigation */}
        <nav className="space-y-1" aria-label="Main Navigation">
          {navItems.map((item) => {
            const isActive = currentSection === item.id;
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className={`relative w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-colors duration-200 group cursor-pointer ${
                  isActive
                    ? 'text-cyan-200 font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
                }`}
              >
                {/* Active Moving Highlight Background */}
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active-bg"
                    className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-500/15 via-purple-500/10 to-transparent border border-cyan-500/30 shadow-[inset_0_0_15px_rgba(6,182,212,0.15)]"
                    transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                  />
                )}

                {/* Glowing Neon Beam along the left edge */}
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active-beam"
                    className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-full bg-gradient-to-b from-cyan-400 to-purple-500 shadow-[0_0_12px_rgba(6,182,212,0.9)]"
                    transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                  />
                )}

                <div className="relative z-10 flex items-center gap-2.5">
                  <motion.div
                    animate={isActive ? { scale: [1, 1.15, 1] } : { scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className={`transition-colors duration-200 ${
                      isActive ? 'text-cyan-300 drop-shadow-[0_0_8px_rgba(6,182,212,0.6)]' : 'group-hover:text-slate-200'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </motion.div>
                  <span className="truncate">{item.label}</span>
                </div>

                {item.badge && (
                  <span className="relative z-10 text-[9px] font-mono font-medium px-1.5 py-0.5 rounded bg-cyan-400/15 text-cyan-300 border border-cyan-400/30 shadow-[0_0_8px_rgba(6,182,212,0.3)]">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer System Status & Sound Controller */}
      <div className="space-y-2 pt-4 border-t border-white/[0.06] mt-4">
        {/* Real-time Synaptic Pulse & Low Data Mode Indicator */}
        <div className="p-2.5 rounded-xl bg-slate-900/60 border border-white/[0.06] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 shadow-[0_0_8px_#10b981]" />
            </span>
            <span className="text-[11px] text-slate-300 font-mono">
              {lowDataMode ? 'Lite Data (79% Saved)' : 'Full Holo Sync'}
            </span>
          </div>
          
          <button
            onClick={onToggleSound}
            title={soundEnabled ? 'Mute Neural Audio' : 'Enable Neural Audio'}
            className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-white/[0.05] transition-colors cursor-pointer"
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5 text-slate-600" />}
          </button>
        </div>

        <div className="px-2 text-[9px] text-slate-500 font-mono flex items-center justify-between">
          <span>GEMINI 3.8 / VEO 3.1</span>
          <span className="text-cyan-400">READY</span>
        </div>
      </div>
    </aside>
  );
};
