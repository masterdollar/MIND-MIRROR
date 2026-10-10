import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Mic,
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Radio,
  Sliders,
  Download,
  CheckCircle2,
  Brain,
  Wind,
  Shield,
  Layers,
} from 'lucide-react';
import { GlassCard } from './GlassCard';
import { NeonButton } from './NeonButton';
import { SpeechActivity } from '../types';
import { cyberAudio } from '../utils/audio';

const PRESET_ACTIVITIES: SpeechActivity[] = [
  {
    id: 'activity-1',
    title: "Nova's Cozy & Warm Pep Talk",
    category: 'affirmation',
    recommendedMood: 'Warm Hug & Encouragement',
    voice: 'Kore',
    durationSec: 35,
    text: 'Hey friend, take a big, gentle breath with me. Inhale that fresh positive energy, and exhale whatever is weighing you down. You are doing so much better than you realize, and I am genuinely so proud of you. Today is your day to smile, take it easy, and enjoy the moment!',
  },
  {
    id: 'activity-2',
    title: 'Maximum Hype & Confidence Boost',
    category: 'dialogue',
    recommendedMood: 'Unstoppable Energy & Hype',
    voice: 'Puck',
    durationSec: 30,
    text: "Let's go! Put that confident smile on your face! You have got unmatched creativity and brilliant ideas. Whatever challenge is ahead, you are going to knock it completely out of the park. Turn up the music, trust your gut, and let's celebrate every win!",
  },
  {
    id: 'activity-3',
    title: 'Cozy Couch Reset & Unwind',
    category: 'grounding',
    recommendedMood: 'Evening Rest & Relaxation',
    voice: 'Zephyr',
    durationSec: 40,
    text: 'Permission granted to put down the to-do list, drop your shoulders, and let out a gentle sigh. You worked hard today, friend. Picture your absolute favorite cozy spot, a warm delicious drink, and zero obligations. Rest your eyes and soak in this well-deserved peace.',
  },
  {
    id: 'activity-4',
    title: 'Playful Laughter & Cosmic Perspective',
    category: 'pacing',
    recommendedMood: 'Lighthearted & Cheerful',
    voice: 'Fenrir',
    durationSec: 35,
    text: "Here is your friendly reminder: you are a brilliant human made of cosmic stardust on a grand adventure! Do not take the little hiccups too seriously. Laugh off the awkward moments, treat yourself to a great snack, and remember that I am always in your corner!",
  },
];

export const SpeechActivities: React.FC = () => {
  const [selectedActivity, setSelectedActivity] = useState<SpeechActivity>(PRESET_ACTIVITIES[0]);
  const [customText, setCustomText] = useState<string>('');
  const [selectedVoice, setSelectedVoice] = useState<'Kore' | 'Puck' | 'Charon' | 'Fenrir' | 'Zephyr'>('Kore');
  const [speechSpeed, setSpeechSpeed] = useState<number>(1.0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [downloadReady, setDownloadReady] = useState<boolean>(false);
  const [activeWordIndex, setActiveWordIndex] = useState<number>(-1);

  const synthRef = useRef<SpeechSynthesisUtterance | null>(null);
  const audioElemRef = useRef<HTMLAudioElement | null>(null);

  const activeText = customText.trim() || selectedActivity.text;
  const words = activeText.split(' ');

  // Stop speech on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleSynthesizeAndPlay = async () => {
    if (isPlaying) {
      handleStop();
      return;
    }

    cyberAudio.play('neon');
    setIsGenerating(true);
    setDownloadReady(false);

    try {
      const response = await fetch('/api/speech/synthesize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: activeText,
          voice: selectedVoice,
          speed: speechSpeed,
          style: 'Empathetic futuristic cognitive wellness guide',
        }),
      });

      const data = await response.json();
      setIsGenerating(false);

      if (data.audioBase64) {
        // High fidelity audio playback
        const audioBlob = new Blob(
          [Uint8Array.from(atob(data.audioBase64), (c) => c.charCodeAt(0))],
          { type: 'audio/wav' }
        );
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        setDownloadReady(true);

        const audio = new Audio(url);
        audio.playbackRate = speechSpeed;
        audioElemRef.current = audio;

        audio.onended = () => {
          setIsPlaying(false);
          setActiveWordIndex(-1);
        };

        audio.play();
        setIsPlaying(true);
        simulateWordHighlighting();
      } else {
        // High quality Web Speech API speech synthesis
        playViaWebSpeech(activeText);
      }
    } catch {
      setIsGenerating(false);
      playViaWebSpeech(activeText);
    }
  };

  const playViaWebSpeech = (text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    synthRef.current = utterance;
    utterance.rate = speechSpeed;
    utterance.pitch = selectedVoice === 'Fenrir' || selectedVoice === 'Charon' ? 0.85 : 1.05;

    // Pick best local voice if available
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      const preferred = voices.find(
        (v) =>
          v.lang.startsWith('en') &&
          (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Premium'))
      );
      if (preferred) utterance.voice = preferred;
    }

    utterance.onboundary = (e) => {
      if (e.name === 'word') {
        const textBefore = text.substring(0, e.charIndex);
        const wordCount = textBefore.trim().split(/\s+/).length;
        setActiveWordIndex(wordCount - 1);
      }
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setActiveWordIndex(-1);
    };

    utterance.onerror = () => {
      setIsPlaying(false);
      setActiveWordIndex(-1);
    };

    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
  };

  const simulateWordHighlighting = () => {
    const totalWords = words.length;
    const intervalTime = (400 / speechSpeed);
    let current = 0;
    const interval = setInterval(() => {
      if (current >= totalWords || !audioElemRef.current || audioElemRef.current.paused) {
        clearInterval(interval);
        return;
      }
      setActiveWordIndex(current);
      current++;
    }, intervalTime);
  };

  const handleStop = () => {
    if (audioElemRef.current) {
      audioElemRef.current.pause();
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
    setActiveWordIndex(-1);
    cyberAudio.play('click');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-bold text-xl text-white flex items-center gap-2">
            <Mic className="w-5 h-5 text-cyan-400" />
            Speech Activities & Neural TTS Studio
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Gemini 3.8 Flash TTS synthesis for neuro-verbal mindfulness, somatic breathing, and voice practice.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-cyan-950/60 border border-cyan-500/30 text-xs font-mono text-cyan-300">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span>AUDIO ENGINE: GEMINI 3.8 FLASH LITE TTS</span>
        </div>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Preset Speech Activities */}
        <div className="space-y-3">
          <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block">
            Guided Activities
          </span>

          {PRESET_ACTIVITIES.map((act) => {
            const isSelected = selectedActivity.id === act.id && !customText.trim();
            return (
              <GlassCard
                key={act.id}
                interactive
                glowColor={isSelected ? 'cyan' : 'purple'}
                onClick={() => {
                  cyberAudio.play('click');
                  handleStop();
                  setSelectedActivity(act);
                  setCustomText('');
                  setSelectedVoice(act.voice);
                }}
                className={`p-4 transition-all ${
                  isSelected ? 'border-cyan-400/60 shadow-[0_0_20px_rgba(6,182,212,0.25)]' : ''
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-semibold text-white">{act.title}</span>
                  <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-500/20">
                    {act.durationSec}s
                  </span>
                </div>
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-2">
                  "{act.text}"
                </p>
                <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
                  <span>VOICE: {act.voice}</span>
                  <span className="text-purple-300">{act.recommendedMood}</span>
                </div>
              </GlassCard>
            );
          })}
        </div>

        {/* Center / Right: Interactive Voice Player & Custom Script Console */}
        <div className="lg:col-span-2 space-y-5">
          {/* Active Speaking Card */}
          <GlassCard glowColor="cyan" className="p-6 relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#06b6d4]" />
                <h3 className="font-display font-bold text-base text-white">
                  {customText.trim() ? 'Custom Speech Script' : selectedActivity.title}
                </h3>
              </div>

              {/* Dynamic Sound Wave Bars */}
              <div className="flex items-center gap-1 h-6">
                {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                  <motion.div
                    key={i}
                    animate={
                      isPlaying
                        ? {
                            height: ['20%', `${Math.sin(i * 0.8) * 60 + 40}%`, '20%'],
                          }
                        : { height: '20%' }
                    }
                    transition={
                      isPlaying
                        ? {
                            duration: 0.5 + i * 0.1,
                            repeat: Infinity,
                            repeatType: 'reverse',
                            ease: 'easeInOut',
                          }
                        : { duration: 0.2 }
                    }
                    className="w-1 rounded-full bg-gradient-to-t from-cyan-500 to-purple-500"
                  />
                ))}
              </div>
            </div>

            {/* Live Synchronized Highlighting Script Canvas */}
            <div className="p-5 rounded-2xl bg-slate-950/70 border border-white/[0.08] min-h-[140px] flex items-center justify-center text-center mb-6">
              <p className="text-base md:text-lg leading-relaxed font-medium">
                {words.map((word, idx) => {
                  const isCurrent = idx === activeWordIndex;
                  return (
                    <span
                      key={idx}
                      className={`inline-block mr-1.5 transition-all duration-150 ${
                        isCurrent
                          ? 'text-cyan-300 font-bold scale-110 drop-shadow-[0_0_12px_rgba(6,182,212,0.9)]'
                          : idx < activeWordIndex
                          ? 'text-slate-400'
                          : 'text-slate-100'
                      }`}
                    >
                      {word}
                    </span>
                  );
                })}
              </p>
            </div>

            {/* Voice Controls: Persona, Speed & Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              {/* Voice Persona Selector */}
              <div>
                <label className="text-xs font-mono text-slate-400 block mb-1.5">
                  VOICE PERSONA (FRIENDLY AI VOICES)
                </label>
                <div className="grid grid-cols-5 gap-1.5">
                  {[
                    { name: 'Kore', vibe: 'Warm' },
                    { name: 'Puck', vibe: 'Hype' },
                    { name: 'Charon', vibe: 'Story' },
                    { name: 'Fenrir', vibe: 'Deep' },
                    { name: 'Zephyr', vibe: 'Calm' },
                  ].map(({ name, vibe }) => (
                    <button
                      key={name}
                      onClick={() => {
                        cyberAudio.play('click');
                        setSelectedVoice(name as any);
                      }}
                      className={`py-1.5 px-1 rounded-xl text-center transition-all cursor-pointer ${
                        selectedVoice === name
                          ? 'bg-cyan-500 text-slate-950 shadow-[0_0_12px_rgba(6,182,212,0.6)]'
                          : 'bg-slate-900/80 text-slate-400 border border-white/5 hover:text-white'
                      }`}
                    >
                      <span className="text-xs font-mono font-bold block">{name}</span>
                      <span className="text-[9px] block opacity-80 font-sans">{vibe}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Speed Slider */}
              <div>
                <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-1.5">
                  <span>SPEED PACING</span>
                  <span className="text-cyan-300">{speechSpeed.toFixed(1)}x</span>
                </div>
                <div className="flex items-center gap-2 pt-1">
                  {[0.8, 1.0, 1.2, 1.5].map((speed) => (
                    <button
                      key={speed}
                      onClick={() => {
                        cyberAudio.play('click');
                        setSpeechSpeed(speed);
                      }}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                        speechSpeed === speed
                          ? 'bg-purple-600 text-white font-bold shadow-[0_0_10px_rgba(168,85,247,0.5)]'
                          : 'bg-slate-900 text-slate-400 hover:text-white border border-white/5'
                      }`}
                    >
                      {speed}x
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Primary Action Button Bar */}
            <div className="flex items-center justify-between pt-2 border-t border-white/[0.06]">
              <div className="flex items-center gap-2">
                <NeonButton
                  variant="primary"
                  size="md"
                  onClick={handleSynthesizeAndPlay}
                  isLoading={isGenerating}
                  icon={isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5 fill-current" />}
                >
                  {isPlaying ? 'Pause Speech' : 'Synthesize & Speak'}
                </NeonButton>

                {isPlaying && (
                  <NeonButton
                    variant="ghost"
                    size="md"
                    onClick={handleStop}
                    icon={<RotateCcw className="w-4 h-4" />}
                  >
                    Reset
                  </NeonButton>
                )}
              </div>

              {downloadReady && audioUrl && (
                <a
                  href={audioUrl}
                  download="mindmirror_neural_speech.wav"
                  className="inline-flex items-center gap-1.5 text-xs text-cyan-300 hover:text-white bg-slate-900/80 border border-cyan-500/30 px-3 py-2 rounded-xl transition-all cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download WAV</span>
                </a>
              )}
            </div>
          </GlassCard>

          {/* Custom Text Prompt Input */}
          <GlassCard className="p-5">
            <h4 className="font-display font-semibold text-sm text-white mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              Custom Cognitive Voice Script
            </h4>
            <p className="text-xs text-slate-400 mb-3">
              Type custom mantras, questions, or scripts to test custom voice personas.
            </p>

            <textarea
              rows={3}
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              placeholder="e.g. My cognitive systems are fully synchronized with my core purpose today..."
              className="w-full p-3.5 rounded-xl bg-slate-900/70 border border-white/[0.08] focus:border-cyan-400 text-xs text-white placeholder-slate-500 outline-none resize-none mb-3"
            />

            <div className="flex justify-end">
              <NeonButton
                variant="secondary"
                size="sm"
                onClick={handleSynthesizeAndPlay}
                disabled={!customText.trim() || isGenerating}
                icon={<Mic className="w-3.5 h-3.5" />}
              >
                Synthesize Custom Script
              </NeonButton>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};
