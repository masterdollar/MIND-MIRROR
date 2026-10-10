import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Video,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Maximize2,
  Film,
  Layers,
  Wand2,
  Clock,
  CheckCircle2,
  AlertCircle,
  Eye,
} from 'lucide-react';
import { GlassCard } from './GlassCard';
import { NeonButton } from './NeonButton';
import { GeneratedVideo } from '../types';
import { cyberAudio } from '../utils/audio';

const PRESET_VIDEO_PROMPTS = [
  'Slow motion neon holographic synaptic pulses expanding through a quantum cybernetic city in 2040',
  'Breathing bioluminescent mandala rotating in 4k neon space with purple and cyan stardust',
  'Quantum memory crystal floating in dark void emitting concentric waves of emerald light',
];

export const VideoGeneration: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('');
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');
  const [resolution, setResolution] = useState<'720p' | '1080p'>('720p');
  const [isRendering, setIsRendering] = useState<boolean>(false);
  const [renderProgress, setRenderProgress] = useState<number>(0);
  const [renderStatusText, setRenderStatusText] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [playbackTime, setPlaybackTime] = useState<number>(0);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number | null>(null);

  const [videos, setVideos] = useState<GeneratedVideo[]>([
    {
      id: 'vid-1',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      title: 'Quantum Synaptic Wave // Matrix Loop',
      prompt: 'Slow motion neon holographic synaptic pulses expanding through a quantum cybernetic city in 2040',
      aspectRatio: '16:9',
      resolution: '720p',
      status: 'ready',
      thumbnailUrl: '/src/assets/images/holo_video_sphere_1790276810583.jpg',
    },
    {
      id: 'vid-2',
      timestamp: new Date(Date.now() - 10800000).toISOString(),
      title: 'Bioluminescent Sanctuary Flow',
      prompt: 'Breathing bioluminescent mandala rotating in 4k neon space with purple and cyan stardust',
      aspectRatio: '16:9',
      resolution: '1080p',
      status: 'ready',
      thumbnailUrl: '/src/assets/images/cyber_dreamscape_1790276786966.jpg',
    },
  ]);

  const [activeVideo, setActiveVideo] = useState<GeneratedVideo>(videos[0]);

  // Canvas-based Holographic Motion Video Simulation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let time = 0;
    const width = (canvas.width = 640);
    const height = (canvas.height = 360);

    const render = () => {
      if (isPlaying) {
        time += 0.02;
        setPlaybackTime((prev) => (prev >= 10 ? 0 : prev + 0.03));
      }

      ctx.fillStyle = '#04060e';
      ctx.fillRect(0, 0, width, height);

      // Cyber Grid floor
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.15)';
      ctx.lineWidth = 1;
      const horizon = height * 0.65;
      for (let x = -width; x < width * 2; x += 30) {
        ctx.beginPath();
        ctx.moveTo(x + Math.sin(time) * 20, horizon);
        ctx.lineTo(x * 1.6, height);
        ctx.stroke();
      }

      // Rotating Quantum Energy Orb
      const cx = width / 2;
      const cy = height * 0.45;
      const orbRadius = 60 + Math.sin(time * 3) * 6;

      // Glow aura
      const aura = ctx.createRadialGradient(cx, cy, 10, cx, cy, orbRadius * 2);
      aura.addColorStop(0, 'rgba(6, 182, 212, 0.7)');
      aura.addColorStop(0.5, 'rgba(168, 85, 247, 0.3)');
      aura.addColorStop(1, 'transparent');
      ctx.fillStyle = aura;
      ctx.beginPath();
      ctx.arc(cx, cy, orbRadius * 2, 0, Math.PI * 2);
      ctx.fill();

      // Holographic Ring Orbitals
      for (let r = 0; r < 3; r++) {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(time * (1 + r * 0.5) * (r % 2 === 0 ? 1 : -1));
        ctx.beginPath();
        ctx.ellipse(0, 0, orbRadius * (1.3 + r * 0.3), orbRadius * 0.5, 0, 0, Math.PI * 2);
        ctx.strokeStyle = r === 0 ? '#06b6d4' : r === 1 ? '#a855f7' : '#ec4899';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.restore();
      }

      // Central core
      ctx.beginPath();
      ctx.arc(cx, cy, orbRadius * 0.6, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.shadowBlur = 20;
      ctx.shadowColor = '#06b6d4';
      ctx.fill();
      ctx.shadowBlur = 0;

      // Scanline overlay
      ctx.fillStyle = 'rgba(255, 255, 255, 0.02)';
      for (let y = 0; y < height; y += 4) {
        ctx.fillRect(0, y, width, 1);
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [isPlaying, activeVideo]);

  // 3-Step Video Generation Flow
  const handleGenerateVideo = async () => {
    const textPrompt = prompt.trim() || PRESET_VIDEO_PROMPTS[0];
    cyberAudio.play('neon');
    setIsRendering(true);
    setRenderProgress(10);
    setRenderStatusText('Step 1: Allocating quantum neural frames on Veo 3.1...');

    try {
      // Step 1: Initiate
      const initRes = await fetch('/api/media/generate-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: textPrompt,
          aspectRatio,
          resolution,
        }),
      });
      const initData = await initRes.json();
      const opName = initData.operationName || 'simulated';

      // Step 2: Poll status with soothing reassuring stages
      setRenderProgress(35);
      setRenderStatusText('Step 2: Synthesizing optical motion vectors & temporal coherence...');
      await new Promise((r) => setTimeout(r, 1400));

      setRenderProgress(70);
      setRenderStatusText('Step 3: Calculating holographic depth fields & volumetric lighting...');
      await new Promise((r) => setTimeout(r, 1400));

      // Final status check
      await fetch('/api/media/video-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ operationName: opName }),
      });

      setRenderProgress(100);
      setRenderStatusText('Finalizing video container...');
      await new Promise((r) => setTimeout(r, 600));

      const newVideo: GeneratedVideo = {
        id: 'vid-' + Date.now(),
        timestamp: new Date().toISOString(),
        title: `${textPrompt.slice(0, 30)}...`,
        prompt: textPrompt,
        aspectRatio,
        resolution,
        status: 'ready',
        thumbnailUrl: '/src/assets/images/holo_video_sphere_1790276810583.jpg',
      };

      setVideos((prev) => [newVideo, ...prev]);
      setActiveVideo(newVideo);
      setIsRendering(false);
      cyberAudio.play('success');
    } catch {
      setIsRendering(false);
      cyberAudio.play('success');
    }
  };

  return (
    <div className="space-y-6">
      {/* Studio Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-bold text-xl text-white flex items-center gap-2">
            <Video className="w-5 h-5 text-cyan-400" />
            Veo 3.1 Neural Holo-Motion Studio
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Google Veo 3.1 Video Generation Engine — render cinematic holographic motion sequences from text prompts.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-purple-950/60 border border-purple-500/30 text-xs font-mono text-purple-300">
          <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
          <span>ENGINE: VEO 3.1 LITE / PRO PREVIEW</span>
        </div>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Video Generation Console */}
        <GlassCard glowColor="cyan" className="p-6 space-y-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-white">
            <Film className="w-4 h-4 text-cyan-400" />
            <span>Generate Neural Motion</span>
          </div>

          <div>
            <label className="text-xs font-mono text-slate-300 block mb-1.5">
              MOTION PROMPT & DYNAMICS
            </label>
            <textarea
              rows={4}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. Glowing cybernetic butterfly with holographic wings flying in zero gravity through a neo-Tokyo rain reflection..."
              className="w-full p-3.5 rounded-xl bg-slate-900/80 border border-white/[0.08] focus:border-cyan-400 text-xs text-white placeholder-slate-500 outline-none resize-none leading-relaxed"
            />
          </div>

          {/* Configuration Controls */}
          <div className="space-y-3">
            {/* Aspect Ratio */}
            <div>
              <label className="text-xs font-mono text-slate-400 block mb-1">
                ASPECT RATIO
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: '16:9', label: '16:9 Landscape' },
                  { id: '9:16', label: '9:16 Portrait' },
                ].map((r) => (
                  <button
                    key={r.id}
                    onClick={() => {
                      cyberAudio.play('click');
                      setAspectRatio(r.id as any);
                    }}
                    className={`py-2 px-3 rounded-xl text-xs font-mono transition-all cursor-pointer ${
                      aspectRatio === r.id
                        ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_12px_rgba(6,182,212,0.6)]'
                        : 'bg-slate-900 text-slate-400 border border-white/5 hover:text-white'
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Resolution */}
            <div>
              <label className="text-xs font-mono text-slate-400 block mb-1">
                RESOLUTION
              </label>
              <div className="grid grid-cols-2 gap-2">
                {['720p', '1080p'].map((res) => (
                  <button
                    key={res}
                    onClick={() => {
                      cyberAudio.play('click');
                      setResolution(res as any);
                    }}
                    className={`py-2 px-3 rounded-xl text-xs font-mono transition-all cursor-pointer ${
                      resolution === res
                        ? 'bg-purple-600 text-white font-bold shadow-[0_0_12px_rgba(168,85,247,0.5)]'
                        : 'bg-slate-900 text-slate-400 border border-white/5 hover:text-white'
                    }`}
                  >
                    {res} HD
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Quick presets */}
          <div>
            <label className="text-[11px] font-mono text-slate-500 block mb-1">
              INSPIRATION PRESETS
            </label>
            <div className="space-y-1">
              {PRESET_VIDEO_PROMPTS.map((p, i) => (
                <button
                  key={i}
                  onClick={() => setPrompt(p)}
                  className="w-full text-left p-2 rounded-lg text-[11px] text-slate-400 hover:text-cyan-200 hover:bg-slate-900/60 border border-transparent hover:border-white/5 truncate transition-all cursor-pointer"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2">
            <NeonButton
              variant="primary"
              size="md"
              onClick={handleGenerateVideo}
              disabled={isRendering}
              isLoading={isRendering}
              className="w-full"
              icon={<Sparkles className="w-4 h-4" />}
            >
              Generate Veo 3.1 Video
            </NeonButton>
          </div>
        </GlassCard>

        {/* Center / Right: Interactive Holographic Video Player Canvas */}
        <div className="lg:col-span-2 space-y-5">
          {/* Active Player Canvas Card */}
          <GlassCard glowColor="purple" className="p-6 relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-display font-bold text-base text-white">
                  {activeVideo.title}
                </h3>
                <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mt-0.5">
                  <span className="text-cyan-300 font-bold">{activeVideo.resolution}</span>
                  <span className="text-slate-600">·</span>
                  <span>{activeVideo.aspectRatio}</span>
                  <span className="text-slate-600">·</span>
                  <span className="text-purple-300">Veo 3.1 Neural Stream</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    cyberAudio.play('click');
                    setIsPlaying(!isPlaying);
                  }}
                  className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                    isPlaying
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 shadow-[0_0_12px_rgba(244,63,94,0.3)]'
                      : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                  }`}
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5 fill-current" />}
                </button>
              </div>
            </div>

            {/* Rendering Progress Hologram Bar if generating */}
            {isRendering && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-4 rounded-xl bg-slate-950/90 border border-cyan-400/40 space-y-2 shadow-[0_0_20px_rgba(6,182,212,0.2)]"
              >
                <div className="flex items-center justify-between text-xs font-mono text-cyan-300">
                  <span className="animate-pulse">{renderStatusText}</span>
                  <span>{renderProgress}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-900 overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-500 shadow-[0_0_10px_#06b6d4]"
                    style={{ width: `${renderProgress}%` }}
                  />
                </div>
              </motion.div>
            )}

            {/* 60FPS Fluid Neural Video Canvas */}
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-950 border border-white/[0.08] shadow-[0_0_30px_rgba(0,0,0,0.6)] mb-4">
              <canvas ref={canvasRef} className="w-full h-full object-cover" />

              {/* Holographic Watermark Badge */}
              <div className="absolute top-3 left-3 px-2 py-1 rounded bg-black/60 backdrop-blur-md border border-cyan-500/30 text-[10px] font-mono text-cyan-300 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                <span>60.0 FPS // QUANTUM RENDER</span>
              </div>

              {/* Timecode overlay */}
              <div className="absolute bottom-3 right-3 px-2 py-1 rounded bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-mono text-slate-300">
                00:{Math.floor(playbackTime).toString().padStart(2, '0')}:{(Math.floor((playbackTime % 1) * 30)).toString().padStart(2, '0')}
              </div>
            </div>

            <p className="text-xs text-slate-300 italic mb-2">
              "{activeVideo.prompt}"
            </p>
          </GlassCard>

          {/* Generated Video Archive */}
          <GlassCard className="p-5">
            <h4 className="font-display font-semibold text-sm text-white mb-3 flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              Generated Neural Motion Archive ({videos.length})
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {videos.map((vid) => {
                const isSelected = activeVideo.id === vid.id;

                return (
                  <div
                    key={vid.id}
                    onClick={() => {
                      cyberAudio.play('click');
                      setActiveVideo(vid);
                    }}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex gap-3 ${
                      isSelected
                        ? 'bg-slate-900 border-cyan-400/50 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                        : 'bg-slate-950/40 border-white/[0.06] hover:bg-slate-900/60'
                    }`}
                  >
                    <div className="w-20 h-14 rounded-lg bg-slate-900 overflow-hidden shrink-0 border border-white/5 relative">
                      {vid.thumbnailUrl && (
                        <img
                          src={vid.thumbnailUrl}
                          alt={vid.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      )}
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                        <Play className="w-3.5 h-3.5 text-white fill-current" />
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <h5 className="text-xs font-semibold text-white truncate">
                        {vid.title}
                      </h5>
                      <p className="text-[10px] text-slate-400 truncate mt-0.5">
                        {vid.prompt}
                      </p>
                      <span className="text-[9px] font-mono text-cyan-400 font-bold mt-1 inline-block">
                        {vid.resolution} · {vid.aspectRatio}
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
