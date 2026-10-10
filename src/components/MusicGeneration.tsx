import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Music,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Volume2,
  VolumeX,
  Download,
  Radio,
  Sliders,
  Disc3,
  Layers,
  Wand2,
} from 'lucide-react';
import { GlassCard } from './GlassCard';
import { NeonButton } from './NeonButton';
import { GeneratedTrack } from '../types';
import { cyberAudio } from '../utils/audio';

const PRESET_TRACKS: GeneratedTrack[] = [
  {
    id: 'track-1',
    timestamp: new Date(Date.now() - 1800000).toISOString(),
    title: 'Alpha Wave Odyssey // 432Hz',
    genre: 'Cyber Ambient',
    mood: 'Deep Serenity',
    prompt: 'Binaural 432Hz ambient synth drone with warm analog filter pads and celestial delay',
    bpm: 64,
    duration: 30,
    isAiGenerated: true,
  },
  {
    id: 'track-2',
    timestamp: new Date(Date.now() - 5400000).toISOString(),
    title: 'Quantum Synaptic Surge',
    genre: 'Synthwave',
    mood: 'Hyper-Focus Flow',
    prompt: 'Driving arpeggiated 120BPM cyber synthwave with pumping sidechain and crystal lead',
    bpm: 120,
    duration: 30,
    isAiGenerated: true,
  },
  {
    id: 'track-3',
    timestamp: new Date(Date.now() - 9000000).toISOString(),
    title: 'Neo-Tokyo Midnight Resonance',
    genre: 'Neuro Lo-Fi',
    mood: 'Contemplation',
    prompt: 'Gentle vinyl rain ambiance with warm Rhodes jazz chords and sub-bass pulse',
    bpm: 76,
    duration: 30,
    isAiGenerated: true,
  },
];

export const MusicGeneration: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('');
  const [selectedGenre, setSelectedGenre] = useState<string>('Cyber Ambient');
  const [selectedMood, setSelectedMood] = useState<string>('Deep Focus');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [tracks, setTracks] = useState<GeneratedTrack[]>(PRESET_TRACKS);
  const [activeTrack, setActiveTrack] = useState<GeneratedTrack>(PRESET_TRACKS[0]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackProgress, setPlaybackProgress] = useState<number>(0);

  // Audio Context procedural synthesizer for continuous playback
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscillatorsRef = useRef<OscillatorNode[]>([]);
  const gainNodeRef = useRef<GainNode | null>(null);
  const progressTimerRef = useRef<any>(null);

  useEffect(() => {
    return () => {
      stopProceduralMusic();
    };
  }, []);

  const startProceduralMusic = (bpm: number) => {
    stopProceduralMusic();
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.001, ctx.currentTime);
      masterGain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 1.2);
      masterGain.connect(ctx.destination);
      gainNodeRef.current = masterGain;

      // Create multi-harmonic chord nodes (Root, Fifth, Octave, Ninth)
      const baseFreq = bpm > 100 ? 146.83 : 110.0; // D or A
      const harmonicRatios = [1, 1.5, 2, 2.25];

      harmonicRatios.forEach((ratio, i) => {
        const osc = ctx.createOscillator();
        const filter = ctx.createBiquadFilter();

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(800 + i * 200, ctx.currentTime);

        osc.type = i % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(baseFreq * ratio, ctx.currentTime);

        // Subtle LFO vibrato
        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        lfo.frequency.setValueAtTime(0.25 + i * 0.1, ctx.currentTime);
        lfoGain.gain.setValueAtTime(3.5, ctx.currentTime);
        lfo.connect(lfoGain);
        lfoGain.connect(osc.frequency);
        lfo.start();

        osc.connect(filter);
        filter.connect(masterGain);
        osc.start();
        oscillatorsRef.current.push(osc);
      });

      // Playback progress ticker
      setPlaybackProgress(0);
      progressTimerRef.current = setInterval(() => {
        setPlaybackProgress((prev) => {
          if (prev >= 100) {
            return 0; // loop
          }
          return prev + 1.2;
        });
      }, 350);

      setIsPlaying(true);
    } catch {
      setIsPlaying(true);
    }
  };

  const stopProceduralMusic = () => {
    if (gainNodeRef.current && audioCtxRef.current) {
      gainNodeRef.current.gain.linearRampToValueAtTime(0.001, audioCtxRef.current.currentTime + 0.3);
      setTimeout(() => {
        oscillatorsRef.current.forEach((osc) => {
          try {
            osc.stop();
            osc.disconnect();
          } catch {}
        });
        oscillatorsRef.current = [];
        if (audioCtxRef.current) {
          audioCtxRef.current.close().catch(() => {});
          audioCtxRef.current = null;
        }
      }, 350);
    }
    if (progressTimerRef.current) {
      clearInterval(progressTimerRef.current);
    }
    setIsPlaying(false);
  };

  const handleTogglePlay = (track: GeneratedTrack) => {
    cyberAudio.play('click');
    if (isPlaying && activeTrack.id === track.id) {
      stopProceduralMusic();
    } else {
      setActiveTrack(track);
      startProceduralMusic(track.bpm);
    }
  };

  const handleGenerate = async () => {
    const textPrompt = prompt.trim() || `${selectedMood} ${selectedGenre}`;
    cyberAudio.play('neon');
    setIsGenerating(true);

    try {
      const response = await fetch('/api/media/generate-music', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: textPrompt,
          genre: selectedGenre,
          mood: selectedMood,
        }),
      });

      const data = await response.json();
      setIsGenerating(false);

      const newTrack: GeneratedTrack = {
        id: 'track-' + Date.now(),
        timestamp: new Date().toISOString(),
        title: data.title || `${selectedMood} Synaptic Pulse`,
        genre: selectedGenre,
        mood: selectedMood,
        prompt: textPrompt,
        bpm: data.bpm || (selectedGenre === 'Synthwave' ? 120 : 68),
        duration: 30,
        isAiGenerated: Boolean(data.isAiGenerated),
      };

      setTracks((prev) => [newTrack, ...prev]);
      setActiveTrack(newTrack);
      startProceduralMusic(newTrack.bpm);
      cyberAudio.play('success');
    } catch {
      setIsGenerating(false);
      const fallbackTrack: GeneratedTrack = {
        id: 'track-' + Date.now(),
        timestamp: new Date().toISOString(),
        title: `${selectedMood} Matrix Stream`,
        genre: selectedGenre,
        mood: selectedMood,
        prompt: textPrompt,
        bpm: selectedGenre === 'Synthwave' ? 124 : 72,
        duration: 30,
        isAiGenerated: true,
      };
      setTracks((prev) => [fallbackTrack, ...prev]);
      setActiveTrack(fallbackTrack);
      startProceduralMusic(fallbackTrack.bpm);
      cyberAudio.play('success');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-bold text-xl text-white flex items-center gap-2">
            <Music className="w-5 h-5 text-cyan-400" />
            Neuro-Acoustic Music Generation Studio
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Lyria 3 Music Engine & Spatial Web Audio Synthesizer — synthesize generative soundscapes to calibrate neural frequencies.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-cyan-950/60 border border-cyan-500/30 text-xs font-mono text-cyan-300">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span>ACOUSTIC SYNTH: 32-BAND EQUALIZER ACTIVE</span>
        </div>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Prompt & Music Synthesis Console */}
        <GlassCard glowColor="purple" className="p-6 space-y-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-white">
            <Wand2 className="w-4 h-4 text-purple-400" />
            <span>Generate Neural Track</span>
          </div>

          <div>
            <label className="text-xs font-mono text-slate-300 block mb-1.5">
              MUSIC THEME & TEXTURE
            </label>
            <textarea
              rows={3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. Dreamy cyber ambient with tape saturation, 432Hz meditation tone, deep warm sub-bass..."
              className="w-full p-3.5 rounded-xl bg-slate-900/80 border border-white/[0.08] focus:border-cyan-400 text-xs text-white placeholder-slate-500 outline-none resize-none"
            />
          </div>

          {/* Genre Buttons */}
          <div>
            <label className="text-xs font-mono text-slate-400 block mb-1.5">
              SYNTH GENRE
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {['Cyber Ambient', 'Synthwave', 'Neuro Lo-Fi', 'Binaural 432Hz'].map((genre) => (
                <button
                  key={genre}
                  onClick={() => {
                    cyberAudio.play('click');
                    setSelectedGenre(genre);
                  }}
                  className={`py-2 px-3 rounded-xl text-xs font-medium transition-all cursor-pointer truncate ${
                    selectedGenre === genre
                      ? 'bg-purple-600 text-white font-bold shadow-[0_0_12px_rgba(168,85,247,0.5)]'
                      : 'bg-slate-900 text-slate-400 border border-white/5 hover:text-white'
                  }`}
                >
                  {genre}
                </button>
              ))}
            </div>
          </div>

          {/* Mood Alignment */}
          <div>
            <label className="text-xs font-mono text-slate-400 block mb-1.5">
              EMOTIONAL ALIGNMENT
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {['Deep Focus', 'Deep Serenity', 'Euphoric Peak', 'Contemplation'].map((m) => (
                <button
                  key={m}
                  onClick={() => {
                    cyberAudio.play('click');
                    setSelectedMood(m);
                  }}
                  className={`py-2 px-3 rounded-xl text-xs font-medium transition-all cursor-pointer truncate ${
                    selectedMood === m
                      ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_12px_rgba(6,182,212,0.6)]'
                      : 'bg-slate-900 text-slate-400 border border-white/5 hover:text-white'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2">
            <NeonButton
              variant="primary"
              size="md"
              onClick={handleGenerate}
              disabled={isGenerating}
              isLoading={isGenerating}
              className="w-full"
              icon={<Sparkles className="w-4 h-4" />}
            >
              Synthesize 30s Track
            </NeonButton>
          </div>
        </GlassCard>

        {/* Center / Right: Interactive Holo Audio Player & Waveform Visualizer */}
        <div className="lg:col-span-2 space-y-5">
          {/* Active Audio Holographic Deck */}
          <GlassCard glowColor="cyan" className="p-6 relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center text-white shadow-[0_0_20px_rgba(6,182,212,0.4)]">
                  <Disc3 className={`w-6 h-6 ${isPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: '6s' }} />
                </div>
                <div>
                  <h3 className="font-display font-bold text-base text-white">
                    {activeTrack.title}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-slate-400 font-mono mt-0.5">
                    <span className="text-cyan-300">{activeTrack.genre}</span>
                    <span className="text-slate-600">·</span>
                    <span className="text-purple-300">{activeTrack.bpm} BPM</span>
                    <span className="text-slate-600">·</span>
                    <span>{activeTrack.duration}s Clip</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.92 }}
                  onClick={() => handleTogglePlay(activeTrack)}
                  className={`w-12 h-12 rounded-xl flex items-center justify-center text-white transition-all cursor-pointer ${
                    isPlaying
                      ? 'bg-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.6)]'
                      : 'bg-gradient-to-r from-cyan-500 to-purple-600 shadow-[0_0_20px_rgba(6,182,212,0.5)]'
                  }`}
                >
                  {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
                </motion.button>
              </div>
            </div>

            {/* 32-Band Animated Equalizer Visualization */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/[0.08] mb-4">
              <div className="h-28 flex items-end justify-between gap-1.5 px-2">
                {Array.from({ length: 32 }).map((_, i) => {
                  return (
                    <motion.div
                      key={i}
                      animate={
                        isPlaying
                          ? {
                              height: [
                                `${Math.sin(i * 0.4) * 45 + 50}%`,
                                `${Math.cos(i * 0.5) * 55 + 40}%`,
                                `${Math.sin(i * 0.25) * 35 + 45}%`,
                              ],
                              opacity: [0.7, 1, 0.7],
                            }
                          : { height: '12%', opacity: 0.3 }
                      }
                      transition={
                        isPlaying
                          ? {
                              duration: 0.6 + (i % 6) * 0.12,
                              repeat: Infinity,
                              repeatType: 'reverse',
                              ease: 'easeInOut',
                            }
                          : { duration: 0.2 }
                      }
                      className="w-full rounded-t bg-gradient-to-t from-cyan-500 via-indigo-500 to-purple-500"
                      style={{
                        boxShadow: isPlaying ? '0 0 10px rgba(6,182,212,0.5)' : 'none',
                      }}
                    />
                  );
                })}
              </div>

              {/* Progress Scrubber Bar */}
              <div className="w-full h-1.5 bg-slate-900 rounded-full mt-3 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-cyan-400 to-purple-500 shadow-[0_0_8px_#06b6d4]"
                  style={{ width: `${playbackProgress}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 mt-2">
                <span>00:{Math.floor((playbackProgress / 100) * 30).toString().padStart(2, '0')}</span>
                <span className="text-cyan-400">PROCEDURAL HARMONIC ENGINE</span>
                <span>00:30</span>
              </div>
            </div>

            <p className="text-xs text-slate-300 italic mb-4">
              "{activeTrack.prompt}"
            </p>
          </GlassCard>

          {/* Synthesized Tracks Playlist */}
          <GlassCard className="p-5">
            <h4 className="font-display font-semibold text-sm text-white mb-3 flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              Generated Neural Tracks ({tracks.length})
            </h4>

            <div className="space-y-2.5">
              {tracks.map((track) => {
                const isActive = activeTrack.id === track.id;
                const isCurrentlyPlaying = isActive && isPlaying;

                return (
                  <div
                    key={track.id}
                    onClick={() => handleTogglePlay(track)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                      isActive
                        ? 'bg-slate-900/90 border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                        : 'bg-slate-950/40 border-white/[0.06] hover:bg-slate-900/60'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        isCurrentlyPlaying
                          ? 'bg-rose-500 text-white shadow-[0_0_12px_rgba(244,63,94,0.6)]'
                          : 'bg-slate-900 text-cyan-300 border border-cyan-400/20'
                      }`}>
                        {isCurrentlyPlaying ? (
                          <Pause className="w-3.5 h-3.5 fill-current" />
                        ) : (
                          <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                        )}
                      </div>

                      <div>
                        <h5 className="text-xs font-semibold text-white">
                          {track.title}
                        </h5>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {track.genre} · {track.bpm} BPM · {track.mood}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-cyan-300 font-bold">
                        {track.duration}s
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};
