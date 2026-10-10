import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Zap,
  Flame,
  Brain,
  Wind,
  CloudLightning,
  Moon,
  CheckCircle2,
  Tag,
  Smile,
} from 'lucide-react';
import { Mood, MoodLog } from '../types';
import { NeonButton } from './NeonButton';
import { cyberAudio } from '../utils/audio';

export const PRESET_MOODS: Mood[] = [
  {
    id: 'flow',
    name: 'Hyper-Focus Flow',
    tagline: 'Deep cognitive immersion & high output',
    valence: 92,
    energy: 88,
    color: 'from-cyan-400 to-blue-600',
    glowColor: 'rgba(6, 182, 212, 0.7)',
    iconName: 'Zap',
    category: 'peak',
  },
  {
    id: 'euphoric',
    name: 'Euphoric Peak',
    tagline: 'Expansive joy, gratitude & vitality',
    valence: 96,
    energy: 90,
    color: 'from-purple-400 to-pink-600',
    glowColor: 'rgba(168, 85, 247, 0.7)',
    iconName: 'Sparkles',
    category: 'peak',
  },
  {
    id: 'serenity',
    name: 'Deep Serenity',
    tagline: 'Balanced stillness & inner quietude',
    valence: 85,
    energy: 38,
    color: 'from-emerald-400 to-teal-600',
    glowColor: 'rgba(16, 185, 129, 0.7)',
    iconName: 'Wind',
    category: 'calm',
  },
  {
    id: 'creative',
    name: 'Creative Catalyst',
    tagline: 'Pattern synthesis & imaginative spark',
    valence: 88,
    energy: 82,
    color: 'from-amber-400 to-orange-500',
    glowColor: 'rgba(245, 158, 11, 0.7)',
    iconName: 'Flame',
    category: 'peak',
  },
  {
    id: 'contemplative',
    name: 'Contemplation',
    tagline: 'Internal processing & philosophical drift',
    valence: 68,
    energy: 44,
    color: 'from-indigo-400 to-purple-600',
    glowColor: 'rgba(99, 102, 241, 0.7)',
    iconName: 'Brain',
    category: 'reflective',
  },
  {
    id: 'turbulence',
    name: 'Static Turbulence',
    tagline: 'Overstimulated or anxious friction',
    valence: 36,
    energy: 84,
    color: 'from-rose-500 to-red-600',
    glowColor: 'rgba(244, 63, 94, 0.7)',
    iconName: 'CloudLightning',
    category: 'turbulent',
  },
  {
    id: 'fatigue',
    name: 'Neural Fatigue',
    tagline: 'Low bandwidth & synaptic recovery needed',
    valence: 42,
    energy: 22,
    color: 'from-slate-400 to-zinc-600',
    glowColor: 'rgba(148, 163, 184, 0.6)',
    iconName: 'Moon',
    category: 'calm',
  },
];

interface InteractiveMoodSelectorProps {
  onLogMood: (log: MoodLog) => void;
  selectedMoodId?: string;
}

export const InteractiveMoodSelector: React.FC<InteractiveMoodSelectorProps> = ({
  onLogMood,
  selectedMoodId: initialMoodId = 'flow',
}) => {
  const [selectedMoodId, setSelectedMoodId] = useState<string>(initialMoodId);
  const [intensity, setIntensity] = useState<number>(8);
  const [note, setNote] = useState<string>('');
  const [selectedTags, setSelectedTags] = useState<string[]>(['Deep Work', 'Alpha Waves']);
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);

  const availableTags = [
    'Deep Work',
    'Coding',
    'Creative Flow',
    'Meditation',
    'Coffee',
    'Nature Walk',
    'Music',
    'Social Sync',
    'Physical Training',
    'Sensory Rest',
  ];

  const getIcon = (name: string) => {
    switch (name) {
      case 'Zap':
        return <Zap className="w-6 h-6" />;
      case 'Sparkles':
        return <Sparkles className="w-6 h-6" />;
      case 'Wind':
        return <Wind className="w-6 h-6" />;
      case 'Flame':
        return <Flame className="w-6 h-6" />;
      case 'Brain':
        return <Brain className="w-6 h-6" />;
      case 'CloudLightning':
        return <CloudLightning className="w-6 h-6" />;
      case 'Moon':
        return <Moon className="w-6 h-6" />;
      default:
        return <Smile className="w-6 h-6" />;
    }
  };

  const handleSelectMood = (id: string) => {
    setSelectedMoodId(id);
    cyberAudio.play('mood');
  };

  const toggleTag = (tag: string) => {
    cyberAudio.play('click');
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleCommitLog = () => {
    const log: MoodLog = {
      id: 'mood-' + Date.now(),
      timestamp: new Date().toISOString(),
      moodId: selectedMoodId,
      intensity,
      tags: selectedTags,
      note: note.trim(),
    };

    cyberAudio.play('success');
    setShowConfirmation(true);
    onLogMood(log);

    setTimeout(() => {
      setShowConfirmation(false);
      setNote('');
    }, 2400);
  };

  const currentMood = PRESET_MOODS.find((m) => m.id === selectedMoodId) || PRESET_MOODS[0];

  return (
    <div className="relative p-6 rounded-2xl bg-[#090d22]/80 border border-white/[0.08] backdrop-blur-xl shadow-[0_0_35px_rgba(0,0,0,0.5)]">
      {/* Confirmation Hologram Overlay */}
      <AnimatePresence>
        {showConfirmation && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.08 }}
            transition={{ type: 'spring', stiffness: 450, damping: 25 }}
            className="absolute inset-0 z-40 rounded-2xl bg-[#070b1c]/95 backdrop-blur-2xl border border-cyan-400/50 flex flex-col items-center justify-center p-6 text-center shadow-[0_0_50px_rgba(6,182,212,0.4)]"
          >
            {/* Hologram Pulse Ring */}
            <motion.div
              initial={{ scale: 0.5, opacity: 1 }}
              animate={{ scale: 2.2, opacity: 0 }}
              transition={{ duration: 1.2, repeat: Infinity }}
              className="absolute w-24 h-24 rounded-full border-2 border-cyan-400"
            />
            
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: 'spring', stiffness: 500 }}
              className="w-16 h-16 rounded-full bg-gradient-to-tr from-cyan-400 to-purple-600 flex items-center justify-center mb-3 shadow-[0_0_25px_rgba(6,182,212,0.8)]"
            >
              <CheckCircle2 className="w-8 h-8 text-white stroke-[2.5]" />
            </motion.div>
            
            <h4 className="font-display font-bold text-xl text-white">Biometric State Anchored</h4>
            <p className="text-sm text-cyan-200 mt-1">
              Synchronized: <span className="font-semibold text-white">{currentMood.name}</span> at Level {intensity}/10
            </p>
            <p className="text-xs text-slate-400 mt-3 font-mono">Neural vectors indexed in temporal memory</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="font-display font-bold text-lg text-white flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_10px_#06b6d4]" />
            Neuro-Emotional Check-In
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Select your real-time frequency to recalibrate the OS feedback loop.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-cyan-300 bg-cyan-950/40 border border-cyan-500/25 px-3 py-1.5 rounded-lg">
          <span>COGNITIVE RESONANCE:</span>
          <span className="font-bold text-white">{currentMood.valence}%</span>
        </div>
      </div>

      {/* Mood Node Grid with Soft Bounce & Glowing Rings */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3 mb-6">
        {PRESET_MOODS.map((mood) => {
          const isSelected = selectedMoodId === mood.id;

          return (
            <motion.button
              key={mood.id}
              onClick={() => handleSelectMood(mood.id)}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.96 }}
              className={`relative flex flex-col items-center p-3 rounded-xl transition-all duration-200 cursor-pointer ${
                isSelected
                  ? 'bg-slate-800/80 border border-cyan-400/60 shadow-[0_0_20px_rgba(6,182,212,0.35)]'
                  : 'bg-slate-900/40 border border-white/[0.06] hover:bg-slate-800/50 hover:border-white/20'
              }`}
            >
              {/* Animated Glowing Ring Around Selected Mood */}
              {isSelected && (
                <motion.div
                  layoutId="selected-mood-ring"
                  className="absolute -inset-1 rounded-2xl border-2 border-cyan-400 pointer-events-none"
                  initial={false}
                  transition={{ type: 'spring', stiffness: 450, damping: 28 }}
                  style={{
                    boxShadow: `0 0 15px ${mood.glowColor}`,
                  }}
                />
              )}

              {/* Bouncing Icon on Select */}
              <motion.div
                animate={
                  isSelected
                    ? {
                        y: [0, -7, 0],
                        scale: [1, 1.14, 1],
                        transition: { duration: 0.45, ease: 'easeInOut' },
                      }
                    : { y: 0, scale: 1 }
                }
                className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-tr ${mood.color} text-white shadow-lg mb-2`}
              >
                {getIcon(mood.iconName)}
              </motion.div>

              <span className={`text-xs font-semibold text-center leading-tight line-clamp-1 ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                {mood.name}
              </span>
              <span className="text-[10px] text-slate-500 font-mono mt-0.5">
                {mood.energy}% E
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* Selected Mood Detail Banner */}
      <motion.div
        key={currentMood.id}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="p-3.5 rounded-xl bg-slate-900/60 border border-white/[0.06] mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
      >
        <div>
          <span className="text-xs font-semibold text-cyan-300 uppercase tracking-wider">
            Active Archetype: {currentMood.name}
          </span>
          <p className="text-xs text-slate-300 mt-0.5">{currentMood.tagline}</p>
        </div>

        {/* Intensity Selector */}
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400">Intensity:</span>
          <div className="flex items-center gap-1.5">
            {[2, 4, 6, 8, 10].map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => {
                  cyberAudio.play('click');
                  setIntensity(level);
                }}
                className={`w-7 h-7 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                  intensity === level
                    ? 'bg-cyan-500 text-slate-950 shadow-[0_0_12px_rgba(6,182,212,0.8)] scale-110'
                    : 'bg-slate-800/80 text-slate-400 hover:text-white border border-white/5'
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Cognitive Tags */}
      <div className="mb-5">
        <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5 mb-2.5">
          <Tag className="w-3.5 h-3.5 text-cyan-400" />
          Stimulus Triggers & Context Tags:
        </label>
        <div className="flex flex-wrap gap-1.5">
          {availableTags.map((tag) => {
            const isTagged = selectedTags.includes(tag);
            return (
              <button
                key={tag}
                type="button"
                onClick={() => toggleTag(tag)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer ${
                  isTagged
                    ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-400/50 shadow-[0_0_10px_rgba(6,182,212,0.25)]'
                    : 'bg-slate-900/60 text-slate-400 border border-white/[0.06] hover:bg-slate-800/60 hover:text-slate-200'
                }`}
              >
                {tag}
              </button>
            );
          })}
        </div>
      </div>

      {/* Note input & Commit Button */}
      <div className="space-y-4">
        <div className="relative">
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Add brief neural note (e.g. Completed deep architecture sprint, flow uninterrupted...)"
            className="w-full px-4 py-2.5 rounded-xl bg-slate-900/70 border border-white/[0.08] focus:border-cyan-400 focus:shadow-[0_0_15px_rgba(6,182,212,0.3)] text-xs text-white placeholder-slate-500 outline-none transition-all"
          />
        </div>

        <div className="flex justify-end">
          <NeonButton
            variant="primary"
            size="md"
            onClick={handleCommitLog}
            icon={<Sparkles className="w-4 h-4" />}
          >
            Synchronize Real-Time Frequency
          </NeonButton>
        </div>
      </div>
    </div>
  );
};
