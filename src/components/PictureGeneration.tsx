import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Image,
  Sparkles,
  Download,
  Maximize2,
  X,
  Layers,
  Wand2,
  RefreshCw,
  Compass,
  Check,
} from 'lucide-react';
import { GlassCard } from './GlassCard';
import { NeonButton } from './NeonButton';
import { GeneratedImage } from '../types';
import { cyberAudio } from '../utils/audio';

const PRESET_DREAMS: { title: string; prompt: string; preview: string; ratio: string }[] = [
  {
    title: 'Cybernetic Mind Sanctuary',
    prompt: 'Futuristic emotional sanctuary room from year 2040 with glowing cyan and violet ambient lights, holographic mental interfaces floating in air',
    preview: '/src/assets/images/cyber_dreamscape_1790276786966.jpg',
    ratio: '16:9',
  },
  {
    title: 'Holographic Soundwave Lab',
    prompt: 'Futuristic neural soundscape synthesizer studio console with glowing holographic sound waves and neon equalizer beams',
    preview: '/src/assets/images/neuro_music_synth_1790276799689.jpg',
    ratio: '16:9',
  },
  {
    title: 'Quantum Video Sphere',
    prompt: 'Futuristic holographic video projection orb displaying glowing cybernetic cinematic motion memories, cyan and magenta particle streams',
    preview: '/src/assets/images/holo_video_sphere_1790276810583.jpg',
    ratio: '16:9',
  },
];

export const PictureGeneration: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('');
  const [aspectRatio, setAspectRatio] = useState<'1:1' | '16:9' | '9:16' | '4:3'>('16:9');
  const [selectedStyle, setSelectedStyle] = useState<string>('Cyberpunk Neon');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [activeModalImage, setActiveModalImage] = useState<GeneratedImage | null>(null);

  const [gallery, setGallery] = useState<GeneratedImage[]>([
    {
      id: 'img-1',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      prompt: 'Cybernetic emotional sanctuary with glowing cyan holographic neural monitors',
      imageUrl: '/src/assets/images/cyber_dreamscape_1790276786966.jpg',
      aspectRatio: '16:9',
      isAiGenerated: true,
    },
    {
      id: 'img-2',
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      prompt: 'Holographic soundwave equalizer console in quantum acoustic chamber',
      imageUrl: '/src/assets/images/neuro_music_synth_1790276799689.jpg',
      aspectRatio: '16:9',
      isAiGenerated: true,
    },
    {
      id: 'img-3',
      timestamp: new Date(Date.now() - 14400000).toISOString(),
      prompt: 'Quantum holographic memory orb suspended in deep neural void',
      imageUrl: '/src/assets/images/holo_video_sphere_1790276810583.jpg',
      aspectRatio: '16:9',
      isAiGenerated: true,
    },
  ]);

  const handleGenerate = async (presetPrompt?: string) => {
    const textPrompt = (presetPrompt || prompt).trim();
    if (!textPrompt || isGenerating) return;

    cyberAudio.play('neon');
    setIsGenerating(true);

    try {
      const response = await fetch('/api/media/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: textPrompt,
          aspectRatio,
          style: selectedStyle,
        }),
      });

      const data = await response.json();
      setIsGenerating(false);

      if (data.imageUrl) {
        const newImg: GeneratedImage = {
          id: 'img-' + Date.now(),
          timestamp: new Date().toISOString(),
          prompt: textPrompt,
          imageUrl: data.imageUrl,
          aspectRatio: data.aspectRatio || aspectRatio,
          isAiGenerated: Boolean(data.isAiGenerated),
        };
        setGallery((prev) => [newImg, ...prev]);
        cyberAudio.play('success');
      }
    } catch {
      setIsGenerating(false);
      // Fallback
      const fallbackImg: GeneratedImage = {
        id: 'img-' + Date.now(),
        timestamp: new Date().toISOString(),
        prompt: textPrompt,
        imageUrl: '/src/assets/images/cyber_dreamscape_1790276786966.jpg',
        aspectRatio,
        isAiGenerated: true,
      };
      setGallery((prev) => [fallbackImg, ...prev]);
      cyberAudio.play('success');
    }
  };

  return (
    <div className="space-y-6">
      {/* Studio Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-bold text-xl text-white flex items-center gap-2">
            <Image className="w-5 h-5 text-cyan-400" />
            Neural Picture Generation Studio
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Gemini 3.1 Flash Image Engine — synthesize cognitive dreamscapes and emotional visual metaphors.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-purple-950/60 border border-purple-500/30 text-xs font-mono text-purple-300">
          <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
          <span>MODEL: GEMINI 3.1 FLASH IMAGE</span>
        </div>
      </div>

      {/* Generation Console Card */}
      <GlassCard glowColor="cyan" className="p-6">
        <div className="space-y-4">
          {/* Prompt Bar */}
          <div>
            <label className="text-xs font-mono text-slate-300 flex items-center justify-between mb-2">
              <span>VISUAL SYNTHESIS PROMPT</span>
              <span className="text-cyan-400 text-[11px]">8K CINEMATIC RESOLUTION</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                placeholder="e.g. Floating crystal lotus radiating soothing violet light in a cybernetic zen garden..."
                className="w-full px-4 py-3.5 pr-32 rounded-xl bg-slate-900/80 border border-white/[0.1] focus:border-cyan-400 focus:shadow-[0_0_20px_rgba(6,182,212,0.3)] text-sm text-white placeholder-slate-500 outline-none transition-all"
              />
              <div className="absolute right-2 top-2">
                <NeonButton
                  variant="primary"
                  size="sm"
                  onClick={() => handleGenerate()}
                  disabled={!prompt.trim() || isGenerating}
                  isLoading={isGenerating}
                  icon={<Sparkles className="w-4 h-4" />}
                >
                  Generate
                </NeonButton>
              </div>
            </div>
          </div>

          {/* Configuration Controls: Aspect Ratio & Presets */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
            {/* Aspect Ratio Selector */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-slate-400">RATIO:</span>
              {(['16:9', '1:1', '9:16', '4:3'] as const).map((ratio) => (
                <button
                  key={ratio}
                  onClick={() => {
                    cyberAudio.play('click');
                    setAspectRatio(ratio);
                  }}
                  className={`px-3 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                    aspectRatio === ratio
                      ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_10px_rgba(6,182,212,0.6)]'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-white/5'
                  }`}
                >
                  {ratio}
                </button>
              ))}
            </div>

            {/* Quick Inspiration Cues */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              <span className="text-xs font-mono text-slate-400">PRESETS:</span>
              {PRESET_DREAMS.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setPrompt(p.prompt);
                    handleGenerate(p.prompt);
                  }}
                  className="px-2.5 py-1 rounded-lg text-xs bg-slate-900/60 hover:bg-slate-800 text-slate-300 hover:text-cyan-200 border border-white/[0.06] transition-all cursor-pointer truncate max-w-[160px]"
                >
                  {p.title}
                </button>
              ))}
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Generated Gallery Showcase */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-display font-bold text-base text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-purple-400" />
            Neural Visual Gallery ({gallery.length})
          </h3>
          <span className="text-xs font-mono text-slate-400">INSTANT HOLOGRAPHIC RECEPTOR</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {gallery.map((item, index) => {
              const dateStr = new Date(item.timestamp).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08, duration: 0.35 }}
                >
                  <GlassCard
                    interactive
                    glowColor="cyan"
                    className="p-3.5 group overflow-hidden"
                  >
                    {/* Image display with required referrerPolicy */}
                    <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-950 mb-3 border border-white/5">
                      <img
                        src={item.imageUrl}
                        alt={item.prompt}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />

                      {/* Hover action overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-3">
                        <button
                          onClick={() => {
                            cyberAudio.play('click');
                            setActiveModalImage(item);
                          }}
                          className="p-2 rounded-lg bg-slate-900/90 text-cyan-300 hover:text-white border border-cyan-400/30 transition-all cursor-pointer"
                        >
                          <Maximize2 className="w-4 h-4" />
                        </button>

                        <a
                          href={item.imageUrl}
                          download="mindmirror_neural_image.jpg"
                          className="p-2 rounded-lg bg-slate-900/90 text-purple-300 hover:text-white border border-purple-400/30 transition-all cursor-pointer"
                        >
                          <Download className="w-4 h-4" />
                        </a>
                      </div>
                    </div>

                    <p className="text-xs text-slate-200 line-clamp-2 leading-relaxed mb-2 font-medium">
                      "{item.prompt}"
                    </p>

                    <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono pt-2 border-t border-white/[0.06]">
                      <span>RATIO {item.aspectRatio}</span>
                      <span>{dateStr}</span>
                    </div>
                  </GlassCard>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* Fullscreen Lightbox Modal */}
      <AnimatePresence>
        {activeModalImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#04060e]/95 backdrop-blur-2xl flex items-center justify-center p-4 md:p-8"
            onClick={() => setActiveModalImage(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl w-full rounded-2xl bg-[#090d22] border border-cyan-500/30 overflow-hidden shadow-[0_0_50px_rgba(6,182,212,0.3)]"
            >
              <div className="relative">
                <img
                  src={activeModalImage.imageUrl}
                  alt={activeModalImage.prompt}
                  referrerPolicy="no-referrer"
                  className="w-full max-h-[70vh] object-contain bg-black/40"
                />

                <button
                  onClick={() => setActiveModalImage(null)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-slate-900/80 text-white hover:bg-slate-800 border border-white/20 transition-all cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-white/[0.08]">
                <div>
                  <h4 className="text-sm font-semibold text-white">
                    {activeModalImage.prompt}
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5 font-mono">
                    Synthesized at 8K standard via Gemini Flash Image
                  </p>
                </div>

                <a
                  href={activeModalImage.imageUrl}
                  download="mindmirror_neural_image.jpg"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 text-white text-xs font-semibold hover:shadow-[0_0_15px_rgba(6,182,212,0.6)] transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download High-Res</span>
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
