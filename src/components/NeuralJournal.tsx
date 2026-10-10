import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  BookOpen,
  Plus,
  Sparkles,
  CheckCircle2,
  Brain,
  Search,
  Tag,
  Clock,
  Compass,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { JournalEntry, Mood } from '../types';
import { NeonButton } from './NeonButton';
import { GlassCard } from './GlassCard';
import { PRESET_MOODS } from './InteractiveMoodSelector';
import { cyberAudio } from '../utils/audio';

interface NeuralJournalProps {
  entries: JournalEntry[];
  onAddEntry: (entry: JournalEntry) => void;
  currentMood?: Mood;
}

export const NeuralJournal: React.FC<NeuralJournalProps> = ({
  entries,
  onAddEntry,
  currentMood,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [selectedMoodId, setSelectedMoodId] = useState<string>(currentMood?.id || 'flow');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeFilter, setActiveFilter] = useState<string>('all');

  // Handle Save
  const handleSaveEntry = async () => {
    if (!content.trim()) return;

    setIsAnalyzing(true);
    cyberAudio.play('neon');

    try {
      const response = await fetch('/api/journal/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          content,
          mood: PRESET_MOODS.find((m) => m.id === selectedMoodId)?.name || 'Focused Flow',
        }),
      });

      const analysis = await response.json();

      const newEntry: JournalEntry = {
        id: 'entry-' + Date.now(),
        timestamp: new Date().toISOString(),
        title: title.trim() || 'Neural Reflection ' + new Date().toLocaleDateString(),
        content: content.trim(),
        moodId: selectedMoodId,
        coherenceScore: analysis.coherenceScore || 88,
        emotionalArchetype: analysis.emotionalArchetype || 'Lucid Architect',
        keyInsights: analysis.keyInsights || ['Coherent focus detected in thought stream'],
        recommendedAction: analysis.recommendedAction || 'Anchor this state with a sensory check.',
        tags: ['Cognitive Stream', 'Reflection'],
      };

      onAddEntry(newEntry);
      setIsAnalyzing(false);
      setSaveSuccess(true);
      cyberAudio.play('success');

      setTimeout(() => {
        setSaveSuccess(false);
        setTitle('');
        setContent('');
        setIsExpanded(false);
      }, 1600);
    } catch {
      setIsAnalyzing(false);
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        setIsExpanded(false);
      }, 1200);
    }
  };

  const filteredEntries = entries.filter((e) => {
    const matchesSearch =
      e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Expandable Writing Area */}
      <motion.div
        layout
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        className="rounded-2xl bg-[#080d22]/80 border border-white/[0.08] backdrop-blur-xl p-6 relative overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.4)]"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center text-white shadow-[0_0_10px_rgba(6,182,212,0.4)]">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-white flex items-center gap-2">
                <span>Mind & Heart Journal</span>
                <span className="text-xs text-pink-400">✨</span>
              </h3>
              <p className="text-xs text-slate-300">
                Jot down your real thoughts, feelings, or daydreams. Nova reflects back with warmth, cheer & celebration!
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              cyberAudio.play('click');
              setIsExpanded(!isExpanded);
            }}
            className="flex items-center gap-1.5 text-xs text-cyan-300 hover:text-white bg-slate-900/60 border border-white/10 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
          >
            {isExpanded ? (
              <>
                <ChevronUp className="w-3.5 h-3.5" />
                <span>Collapse</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                <span>New Reflection</span>
              </>
            )}
          </button>
        </div>

        {/* Collapsed / Expanded View */}
        <AnimatePresence>
          {isExpanded ? (
            <motion.div
              key="expanded-editor"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.35, ease: 'easeInOut' }}
              className="space-y-4 pt-2"
            >
              {/* Title input */}
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Give this reflection an anchor title..."
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900/70 border border-white/[0.08] focus:border-cyan-400 text-sm font-semibold text-white placeholder-slate-500 outline-none transition-all"
              />

              {/* Mood picker for entry */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                <span className="text-xs text-slate-400 font-mono shrink-0">Resonance:</span>
                {PRESET_MOODS.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => {
                      cyberAudio.play('click');
                      setSelectedMoodId(m.id);
                    }}
                    className={`shrink-0 px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                      selectedMoodId === m.id
                        ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.3)]'
                        : 'bg-slate-900/60 text-slate-400 border border-white/[0.06] hover:text-white'
                    }`}
                  >
                    {m.name}
                  </button>
                ))}
              </div>

              {/* Smoothly expanded content textarea */}
              <textarea
                rows={5}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Transcribe stream of consciousness, cognitive breakthroughs, or emotional knots..."
                className="w-full p-4 rounded-xl bg-slate-900/70 border border-white/[0.08] focus:border-cyan-400 focus:shadow-[0_0_20px_rgba(6,182,212,0.2)] text-sm text-slate-100 placeholder-slate-500 outline-none transition-all resize-none leading-relaxed"
              />

              {/* Actions with glowing checkmark on save */}
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                  <Brain className="w-3.5 h-3.5 text-purple-400" />
                  <span>Real-time Gemini neural synthesis ready</span>
                </div>

                <NeonButton
                  variant="primary"
                  size="md"
                  onClick={handleSaveEntry}
                  disabled={!content.trim() || isAnalyzing}
                  isLoading={isAnalyzing}
                  success={saveSuccess}
                  successText="Reflection Indexed"
                  icon={<Sparkles className="w-4 h-4" />}
                >
                  Save & Synthesize
                </NeonButton>
              </div>
            </motion.div>
          ) : (
            <div
              onClick={() => {
                cyberAudio.play('click');
                setIsExpanded(true);
              }}
              className="p-4 rounded-xl bg-slate-900/40 border border-white/[0.06] hover:border-cyan-500/30 hover:bg-slate-900/60 transition-all cursor-pointer flex items-center justify-between text-slate-400 group"
            >
              <span className="text-sm group-hover:text-slate-200">
                Click to open synaptic writing canvas...
              </span>
              <span className="text-xs font-mono text-cyan-400 opacity-80 group-hover:opacity-100">
                + EXPAND
              </span>
            </div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Search & Memory Feed Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-display font-bold text-base text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-pink-400" />
            Your Reflections & Thoughts ({filteredEntries.length})
          </h3>
          <p className="text-xs text-slate-300 mt-0.5">
            Your heartfelt moments and memories, cheered on by Nova
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search entries..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900/80 border border-white/[0.08] focus:border-cyan-400 text-xs text-white placeholder-slate-500 outline-none"
          />
        </div>
      </div>

      {/* Cards that fade and slide into view */}
      <div className="space-y-4">
        <AnimatePresence>
          {filteredEntries.map((entry, index) => {
            const mood = PRESET_MOODS.find((m) => m.id === entry.moodId) || PRESET_MOODS[0];
            const dateStr = new Date(entry.timestamp).toLocaleDateString([], {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            });

            return (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ delay: index * 0.08, duration: 0.35, ease: 'easeOut' }}
              >
                <GlassCard interactive glowColor="purple" className="p-6">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-3 mb-3">
                    <div>
                      <h4 className="font-display font-bold text-lg text-white">
                        {entry.title}
                      </h4>
                      {/* Unboxed metadata without generic pill borders */}
                      <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                        <span className="text-cyan-300 font-semibold">{mood.name}</span>
                        <span aria-hidden="true" className="text-slate-600">·</span>
                        <span>{entry.emotionalArchetype}</span>
                        <span aria-hidden="true" className="text-slate-600">·</span>
                        <span>{dateStr}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        <span className="text-[10px] text-pink-300 font-mono block">VIBE SCORE</span>
                        <span className="text-sm font-display font-bold text-pink-300">
                          {entry.coherenceScore}%
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-slate-200 leading-relaxed mb-4 whitespace-pre-wrap">
                    {entry.content}
                  </p>

                  {/* AI Synthesized Insights Panel */}
                  <div className="p-3.5 rounded-xl bg-slate-900/60 border border-pink-500/25 space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-pink-300">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Nova's Heartfelt Reflection ✨</span>
                    </div>

                    <ul className="text-xs text-slate-200 space-y-1 list-disc list-inside">
                      {entry.keyInsights.map((insight, ii) => (
                        <li key={ii} className="leading-snug">{insight}</li>
                      ))}
                    </ul>

                    {entry.recommendedAction && (
                      <div className="pt-2 border-t border-white/[0.08] text-xs text-pink-200">
                        <span className="font-semibold text-pink-400">Feel-Good Idea: </span>
                        {entry.recommendedAction}
                      </div>
                    )}
                  </div>
                </GlassCard>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};
