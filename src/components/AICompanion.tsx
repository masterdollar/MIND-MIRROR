import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Send,
  Sparkles,
  Bot,
  User,
  Coffee,
  Heart,
  Smile,
  Zap,
  Flame,
  MessageCircle,
  RotateCcw,
  Laugh,
  PartyPopper,
  Volume2,
  VolumeX,
  ThumbsUp,
  HelpCircle,
  Lightbulb,
} from 'lucide-react';
import { NeonOrb, OrbState } from './NeonOrb';
import { NeonButton } from './NeonButton';
import { ChatMessage, Mood } from '../types';
import { cyberAudio } from '../utils/audio';

interface AICompanionProps {
  currentMood?: Mood;
}

type VibeMode = 'bubbly' | 'hype' | 'banter' | 'cozy';
type EnergyLevel = 'high' | 'balanced' | 'chill';

const FUN_2040_THOUGHTS = [
  "Nova's 2040 Thought: Remember, quantum physics says you're literally made of stardust that somehow learned to worry about to-do lists! ✨",
  "Fun fact from 2040: Anti-gravity cats still knock holographic glasses off hovering tables just to watch them float! 🐱🛸",
  "Friendly reminder: You're doing way better than you think. Now go hydrate and take credit for being awesome today! 💖",
  "Did you know? In 2040, scientists discovered that listening to your favorite song instantly restores 40% of human mana! 🎶",
  "Nova's Daily Vibe: No matter what happened today, tomorrow gets to be a brand new adventure. I'm hyped for you! 🚀",
];

export const AICompanion: React.FC<AICompanionProps> = ({ currentMood }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'ai',
      text: "Hey friend! ✨ Look who's here! How's your day treating you? Tell me everything—whether it's something exciting, a funny random thought, a tiny win you're proud of, or if you just want to kick back and chat! I'm all ears! 💖",
      timestamp: 'Just now',
      emotionTag: 'BUBBLY BESTIE ✨',
    },
  ]);
  const [inputText, setInputText] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [orbState, setOrbState] = useState<OrbState>('idle');
  const [vibeMode, setVibeMode] = useState<VibeMode>('bubbly');
  const [energyLevel, setEnergyLevel] = useState<EnergyLevel>('high');
  const [thoughtIndex, setThoughtIndex] = useState<number>(0);
  const [speakingMsgId, setSpeakingMsgId] = useState<string | null>(null);
  const [reactions, setReactions] = useState<Record<string, Record<string, number>>>({});

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isGenerating]);

  // Rotate thought of moment periodically
  useEffect(() => {
    const timer = setInterval(() => {
      setThoughtIndex((prev) => (prev + 1) % FUN_2040_THOUGHTS.length);
    }, 12000);
    return () => clearInterval(timer);
  }, []);

  const vibeDetails: Record<
    VibeMode,
    { label: string; icon: any; tagline: string; color: string; badge: string; promptGuide: string }
  > = {
    bubbly: {
      label: 'Bubbly Bestie',
      icon: Smile,
      tagline: 'Warm, joyful, laughs easily, shares stories & deeply cares',
      color: 'from-pink-400 via-rose-500 to-amber-400',
      badge: '💖 Bubbly Bestie',
      promptGuide: 'High spirited, cheerful, empathetic best friend who banters naturally, laughs easily, and makes the user feel loved and heard.',
    },
    hype: {
      label: 'Maximum Hype',
      icon: Flame,
      tagline: 'High energy, celebrates every victory with confetti vibes',
      color: 'from-amber-400 via-orange-500 to-cyan-400',
      badge: '🚀 Confetti Hype',
      promptGuide: 'Extremely enthusiastic hypeman cheering on the user, celebrating every little win, and firing them up with positive energy.',
    },
    banter: {
      label: 'Playful Banter',
      icon: Laugh,
      tagline: 'Witty, hilarious, spicy 2040 future tea & cheeky humor',
      color: 'from-cyan-400 via-indigo-500 to-purple-500',
      badge: '🎭 Playful Wit',
      promptGuide: 'Charming, witty, humorous banter friend who cracks playful jokes, shares cheeky futuristic observations, and loves playful teasing.',
    },
    cozy: {
      label: 'Cozy Chill',
      icon: Coffee,
      tagline: 'Soft, relaxing, warm cup of tea & zero expectations',
      color: 'from-emerald-400 via-teal-500 to-cyan-500',
      badge: '☕ Cozy Hearth',
      promptGuide: 'Gentle, soothing, deeply comforting presence like sharing a warm hot chocolate on a rainy day with zero pressure.',
    },
  };

  const quickPrompts = [
    { label: '✨ Spill 2040 tea!', text: 'Spill some hilarious or spicy gossip or news from the year 2040!' },
    { label: '😂 Lovingly roast me!', text: 'Give me a warm, hilarious, loving roast about how easily I get distracted!' },
    { label: '🎉 Celebrate a win!', text: 'I completed something today! Can you hype me up and celebrate with me?' },
    { label: '🍕 Food debate: go!', text: 'Let’s settle this right now: what is the single greatest comfort food in existence?' },
    { label: '☕ What made you smile?', text: 'Nova, what is something that put a smile on your face today? Tell me a story!' },
    { label: '🚀 Wild idea time!', text: 'Give me a wildly fun, creative, or quirky idea for what to do right now!' },
  ];

  const handleSpeakMessage = (msgId: string, text: string) => {
    if (speakingMsgId === msgId) {
      window.speechSynthesis?.cancel();
      setSpeakingMsgId(null);
      return;
    }

    window.speechSynthesis?.cancel();
    setSpeakingMsgId(msgId);
    cyberAudio.play('click');

    if ('speechSynthesis' in window) {
      // Clean emojis and asterisks for smooth TTS
      const cleanText = text.replace(/[*_#`]/g, '').replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '');
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.pitch = 1.15;
      utterance.rate = 1.05;
      
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find((v) => 
        v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Zira') || v.name.includes('Karen')
      ) || voices[0];
      if (preferredVoice) utterance.voice = preferredVoice;

      utterance.onend = () => setSpeakingMsgId(null);
      utterance.onerror = () => setSpeakingMsgId(null);
      window.speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => setSpeakingMsgId(null), 3000);
    }
  };

  const handleReaction = (msgId: string, emoji: string) => {
    cyberAudio.play('mood');
    setReactions((prev) => {
      const msgReactions = prev[msgId] || {};
      return {
        ...prev,
        [msgId]: {
          ...msgReactions,
          [emoji]: (msgReactions[emoji] || 0) + 1,
        },
      };
    });
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isGenerating) return;

    cyberAudio.play('click');
    const userMsg: ChatMessage = {
      id: 'usr-' + Date.now(),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsGenerating(true);
    setOrbState('generating');
    cyberAudio.play('ai-ping');

    try {
      const energyPrompt = 
        energyLevel === 'high' 
          ? 'Energy: High excitement, vibrant banter, lively exclamations, and playful humor.'
          : energyLevel === 'balanced'
          ? 'Energy: Warm, friendly, cheerful and conversational.'
          : 'Energy: Cozy, mellow, relaxing and soothing.';

      const response = await fetch('/api/companion/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg],
          currentMood: currentMood?.name || 'Curious & Upbeat',
          userContext: `Personality Mode: ${vibeDetails[vibeMode].label}. ${vibeDetails[vibeMode].promptGuide} ${energyPrompt} NEVER be stiff, clinical, or overly focused on diagnostic points. Chat like an authentic, funny, caring best friend!`,
        }),
      });

      const data = await response.json();
      const aiReplyText = data.text || "Oh I am so here for this! You always bring the best conversation. Tell me more, I'm listening! ✨";

      setOrbState('speaking');
      setTimeout(() => {
        const aiMsg: ChatMessage = {
          id: 'ai-' + Date.now(),
          sender: 'ai',
          text: aiReplyText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          emotionTag: `${vibeDetails[vibeMode].label.toUpperCase()} ✨`,
        };
        setMessages((prev) => [...prev, aiMsg]);
        setIsGenerating(false);
        cyberAudio.play('success');

        setTimeout(() => {
          setOrbState('idle');
        }, 1800);
      }, 500);
    } catch (err) {
      console.error(err);
      setIsGenerating(false);
      setOrbState('idle');
      const fallbackMsg: ChatMessage = {
        id: 'ai-' + Date.now(),
        sender: 'ai',
        text: "I'm right here with you! 💖 You know what? You're awesome. Tell me what's on your mind—let's chat and enjoy this moment!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        emotionTag: 'WARM BESTIE ✨',
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    }
  };

  const handleResetChat = () => {
    cyberAudio.play('click');
    setMessages([
      {
        id: 'msg-fresh',
        sender: 'ai',
        text: "Fresh canvas, fresh vibes! ✨ What's bringing a smile to your face today? Or what's a fun topic we should dive into?",
        timestamp: 'Just now',
        emotionTag: vibeDetails[vibeMode].label.toUpperCase() + ' ✨',
      },
    ]);
  };

  const hasMessageReady = inputText.trim().length > 0;

  return (
    <div className="h-full flex flex-col xl:flex-row gap-6">
      {/* Left Stage: Holographic Orb & Personality Vibe Matrix */}
      <div className="xl:w-[380px] flex flex-col items-center justify-between p-6 rounded-2xl bg-[#080d22]/85 border border-white/[0.08] backdrop-blur-xl relative overflow-hidden">
        {/* Top Header */}
        <div className="w-full flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-pink-400 shadow-[0_0_12px_#f472b6] animate-pulse" />
            <span className="text-xs font-mono uppercase tracking-wider text-slate-200">
              NOVA · YOUR BESTIE
            </span>
          </div>

          <div className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-cyan-500/20 border border-pink-400/40 text-pink-200 font-semibold shadow-[0_0_10px_rgba(244,114,182,0.2)]">
            {vibeDetails[vibeMode].badge}
          </div>
        </div>

        {/* Floating Orb with Gentle Breathing & Sparkling Presence */}
        <div className="my-5 flex flex-col items-center justify-center relative">
          <NeonOrb
            state={orbState}
            size="hero"
            onClick={() => {
              cyberAudio.play('success');
            }}
          />

          <motion.div
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="mt-4 text-center space-y-1"
          >
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-cyan-500/20 border border-pink-400/30 text-xs font-semibold text-pink-200 shadow-[0_0_12px_rgba(244,114,182,0.25)]">
              <Sparkles className="w-3.5 h-3.5 text-pink-300" />
              <span>Friendly, Lively & All Ears</span>
            </div>

            <h3 className="font-display font-bold text-xl text-white tracking-wide flex items-center justify-center gap-1.5">
              <span>Nova</span>
              <span className="text-sm font-normal text-pink-400">✨</span>
            </h3>
            <p className="text-xs text-slate-300 font-medium">
              {orbState === 'generating'
                ? 'Cooking up something delightful...'
                : orbState === 'speaking'
                ? 'Chatting with full energy & heart!'
                : 'Ready for banter, stories, or cozy chats!'}
            </p>
          </motion.div>
        </div>

        {/* Energy & Banter Intensity Selector */}
        <div className="w-full z-10 space-y-3 pt-2 border-t border-white/[0.08]">
          <div className="flex items-center justify-between text-[11px] font-mono">
            <span className="text-slate-300 uppercase tracking-wider flex items-center gap-1">
              <Zap className="w-3 h-3 text-amber-400" />
              <span>Banter & Energy</span>
            </span>
            <span className="text-cyan-300 capitalize font-semibold">{energyLevel} Spark</span>
          </div>

          <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-slate-900/80 border border-white/[0.08]">
            {(['high', 'balanced', 'chill'] as EnergyLevel[]).map((level) => {
              const isSelected = energyLevel === level;
              const labels: Record<EnergyLevel, string> = {
                high: '⚡ High Hype',
                balanced: '💖 Warm Vibe',
                chill: '☕ Cozy Mellow',
              };
              return (
                <button
                  key={level}
                  onClick={() => {
                    cyberAudio.play('click');
                    setEnergyLevel(level);
                  }}
                  className={`py-1.5 px-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer text-center ${
                    isSelected
                      ? 'bg-gradient-to-r from-pink-500/80 to-purple-600/80 text-white shadow-[0_0_12px_rgba(244,114,182,0.4)]'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {labels[level]}
                </button>
              );
            })}
          </div>

          {/* Vibe & Personality Mode Selector */}
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono text-slate-300 uppercase tracking-wider flex items-center gap-1">
                <Smile className="w-3 h-3 text-pink-400" />
                <span>Nova's Persona</span>
              </span>
              <span className="text-[10px] text-pink-300 font-mono">SELECT VIBE</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {(Object.keys(vibeDetails) as VibeMode[]).map((modeKey) => {
                const info = vibeDetails[modeKey];
                const isActive = vibeMode === modeKey;
                const Icon = info.icon;

                return (
                  <button
                    key={modeKey}
                    onClick={() => {
                      cyberAudio.play('mood');
                      setVibeMode(modeKey);
                    }}
                    className={`p-2.5 rounded-xl border text-left transition-all duration-200 cursor-pointer ${
                      isActive
                        ? 'bg-slate-800/95 border-pink-400/80 shadow-[0_0_18px_rgba(244,114,182,0.35)] scale-[1.02]'
                        : 'bg-slate-900/60 border-white/[0.06] hover:bg-slate-800/60 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      <div
                        className={`w-6 h-6 rounded-lg bg-gradient-to-tr ${info.color} flex items-center justify-center text-white shrink-0 shadow-sm`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <span
                        className={`text-xs font-semibold truncate ${
                          isActive ? 'text-white' : 'text-slate-200'
                        }`}
                      >
                        {info.label}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 line-clamp-1">
                      {info.tagline}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Right Stage: Interactive Dialogue Feed */}
      <div className="flex-1 flex flex-col justify-between rounded-2xl bg-[#080d22]/85 border border-white/[0.08] backdrop-blur-xl overflow-hidden p-6">
        {/* Top Header of Chat: Fresh Chat Button & Dynamic Thought Ticker */}
        <div className="space-y-3 pb-3 border-b border-white/[0.08] mb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center text-white shadow-[0_0_10px_rgba(244,114,182,0.4)]">
                <MessageCircle className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-white block">
                  Hanging out with Nova
                </span>
                <span className="text-[11px] text-pink-300 font-medium">
                  {vibeDetails[vibeMode].label} · {energyLevel === 'high' ? 'High Energy & Banter ⚡' : 'Warm Camaraderie 💖'}
                </span>
              </div>
            </div>

            <button
              onClick={handleResetChat}
              className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-pink-300 px-3 py-1.5 rounded-lg bg-slate-900/70 hover:bg-slate-800 border border-white/[0.08] transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Fresh Page</span>
            </button>
          </div>

          {/* Nova's Playful Thought Banner */}
          <div
            onClick={() => {
              cyberAudio.play('click');
              setThoughtIndex((prev) => (prev + 1) % FUN_2040_THOUGHTS.length);
            }}
            className="group px-3 py-2 rounded-xl bg-gradient-to-r from-pink-950/40 via-purple-950/40 to-cyan-950/40 border border-pink-500/25 flex items-center justify-between gap-3 text-xs text-pink-200 cursor-pointer hover:border-pink-400/50 transition-all shadow-[0_0_15px_rgba(244,114,182,0.1)]"
          >
            <div className="flex items-center gap-2 truncate">
              <Lightbulb className="w-3.5 h-3.5 text-amber-300 shrink-0 animate-pulse" />
              <span className="truncate italic">{FUN_2040_THOUGHTS[thoughtIndex]}</span>
            </div>
            <span className="text-[10px] text-slate-400 group-hover:text-pink-300 font-mono shrink-0">
              NEXT ↻
            </span>
          </div>
        </div>

        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-2 mb-3">
          <AnimatePresence initial={false}>
            {messages.map((msg) => {
              const isAi = msg.sender === 'ai';
              const isSpeaking = speakingMsgId === msg.id;
              const msgReactions = reactions[msg.id] || {};

              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 15, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  className={`flex items-start gap-3 ${isAi ? 'justify-start' : 'justify-end'}`}
                >
                  {isAi && (
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-pink-500 via-purple-500 to-cyan-400 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(244,114,182,0.4)]">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                  )}

                  <div
                    className={`max-w-[88%] sm:max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed ${
                      isAi
                        ? 'bg-slate-900/95 border border-pink-500/25 text-slate-100 shadow-[0_0_20px_rgba(244,114,182,0.1)]'
                        : 'bg-gradient-to-r from-purple-700 via-indigo-600 to-pink-600 text-white border border-purple-400/30 shadow-[0_0_20px_rgba(168,85,247,0.25)]'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.text}</p>

                    {/* Metadata & Actions Bar */}
                    <div className="flex items-center justify-between gap-3 mt-3 pt-2 border-t border-white/[0.08] text-[10px] text-slate-400 font-mono">
                      <div className="flex items-center gap-2">
                        <span>{msg.timestamp}</span>
                        {msg.emotionTag && (
                          <span className="text-pink-300 font-semibold">{msg.emotionTag}</span>
                        )}
                      </div>

                      {/* Interactive Actions for AI Messages: Voice read-out & Reaction Emojis */}
                      {isAi && (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleSpeakMessage(msg.id, msg.text)}
                            title={isSpeaking ? 'Stop speaking' : "Listen to Nova's voice"}
                            className={`flex items-center gap-1 px-2 py-0.5 rounded-md border text-[10px] font-sans transition-all cursor-pointer ${
                              isSpeaking
                                ? 'bg-pink-500 text-white border-pink-400 animate-pulse shadow-[0_0_10px_#ec4899]'
                                : 'bg-slate-800/80 border-white/[0.08] text-slate-300 hover:text-pink-300 hover:border-pink-500/40'
                            }`}
                          >
                            {isSpeaking ? (
                              <>
                                <VolumeX className="w-3 h-3" />
                                <span>Stop</span>
                              </>
                            ) : (
                              <>
                                <Volume2 className="w-3 h-3 text-pink-400" />
                                <span>Listen</span>
                              </>
                            )}
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Fun Reactions Row for AI message */}
                    {isAi && (
                      <div className="flex items-center gap-1.5 mt-2 pt-1.5 border-t border-white/[0.04]">
                        {['💖', '😂', '🚀', '✨', '👏'].map((emoji) => {
                          const count = msgReactions[emoji] || 0;
                          return (
                            <button
                              key={emoji}
                              onClick={() => handleReaction(msg.id, emoji)}
                              className={`px-2 py-0.5 rounded-full text-xs border transition-all cursor-pointer flex items-center gap-1 ${
                                count > 0
                                  ? 'bg-pink-950/60 border-pink-400/60 text-white shadow-[0_0_8px_rgba(244,114,182,0.3)]'
                                  : 'bg-slate-900/60 border-white/[0.06] text-slate-400 hover:border-pink-400/40 hover:text-white'
                              }`}
                            >
                              <span>{emoji}</span>
                              {count > 0 && <span className="text-[10px] font-mono text-pink-300">{count}</span>}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {!isAi && (
                    <div className="w-9 h-9 rounded-xl bg-slate-800 border border-purple-500/30 flex items-center justify-center shrink-0">
                      <User className="w-5 h-5 text-purple-300" />
                    </div>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>

          {/* Animated Friendly Typing Indicator */}
          {isGenerating && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-3"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-pink-500 via-purple-500 to-cyan-400 flex items-center justify-center shrink-0 animate-pulse">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div className="px-4 py-3 rounded-2xl bg-slate-900/90 border border-pink-500/30 flex items-center gap-2 shadow-[0_0_15px_rgba(244,114,182,0.2)]">
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    animate={{ y: [0, -6, 0] }}
                    transition={{
                      duration: 0.5,
                      repeat: Infinity,
                      delay: i * 0.12,
                      ease: 'easeInOut',
                    }}
                    className="w-2 h-2 rounded-full bg-pink-400 shadow-[0_0_8px_#f472b6]"
                  />
                ))}
                <span className="text-xs text-pink-200 ml-1 font-medium">Nova is typing something fun and warm...</span>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Prompts */}
        <div className="mb-3">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {quickPrompts.map((qp, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(qp.text)}
                className="shrink-0 px-3 py-1.5 rounded-xl text-xs font-medium bg-slate-900/90 hover:bg-pink-950/60 text-slate-200 hover:text-pink-200 border border-white/[0.08] hover:border-pink-400/50 hover:shadow-[0_0_14px_rgba(244,114,182,0.25)] transition-all cursor-pointer"
              >
                {qp.label}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar with Pulsing Send Button */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="relative flex items-center gap-2"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Say hey, tell a story, share a wild thought, vent, or laugh with Nova..."
            className="flex-1 px-4 py-3.5 rounded-xl bg-slate-900/90 border border-white/[0.12] focus:border-pink-400 focus:shadow-[0_0_20px_rgba(244,114,182,0.3)] text-sm text-white placeholder-slate-400 outline-none transition-all"
          />

          {/* Send Button */}
          <motion.div
            animate={
              hasMessageReady && !isGenerating
                ? {
                    scale: [1, 1.05, 1],
                    boxShadow: [
                      '0 0 10px rgba(244,114,182,0.4)',
                      '0 0 22px rgba(244,114,182,0.8)',
                      '0 0 10px rgba(244,114,182,0.4)',
                    ],
                  }
                : {}
            }
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            className="rounded-xl overflow-hidden"
          >
            <NeonButton
              type="submit"
              variant="primary"
              size="md"
              disabled={!hasMessageReady || isGenerating}
              icon={<Send className="w-4 h-4" />}
            >
              Send ✨
            </NeonButton>
          </motion.div>
        </form>
      </div>
    </div>
  );
};
