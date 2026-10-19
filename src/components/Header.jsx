import React, { useRef, useState, useEffect } from 'react';
import { SoundToggle } from './SoundToggle.jsx';
import {
  playTabChime,
  playBubblePopSound,
  playChimeNote,
  playEasterEggChime,
  playLanternResonance,
} from '../utils/audio.js';
import { triggerStarConfetti } from './SparkleCanvas.jsx';
import { getMilestoneInfo } from '../utils/badge.js';

export const Header = ({
  currentTab,
  onSelectTab,
  dreamCount = 1204,
  onOpenProfile,
  mood = 'day',
  onMoodChange,
  flashlightActive = false,
  onToggleFlashlight,
  onOpenChat,
}) => {
  const milestone = getMilestoneInfo(dreamCount);
  const navScrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [letterOpen, setLetterOpen] = useState(false);

  // Exact matching navigation items from reference screenshot
  const navItems = [
    { id: 'portfolio-home', label: 'home' },
    { id: 'bedtime-storybook', label: 'story' },
    { id: 'dream-inventions', label: 'work' },
    { id: 'dreamcatcher-arcade', label: 'play' },
    { id: 'bedtime-wall', label: 'wall' },
    { id: 'about-pip', label: 'about' },
  ];

  const checkScroll = () => {
    if (navScrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = navScrollRef.current;
      setCanScrollLeft(scrollLeft > 4);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 4);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, []);

  const handleTabClick = (id) => {
    playTabChime();
    onSelectTab(id);
  };

  const cycleMood = () => {
    playBubblePopSound(true);
    const nextMood = mood === 'day' ? 'night' : mood === 'night' ? 'dream' : 'day';
    onMoodChange?.(nextMood);
  };

  const handleChaosClick = () => {
    playBubblePopSound(true);
    triggerStarConfetti();
    playChimeNote('C5', 0.6);
  };

  const handleOpenLetter = () => {
    playEasterEggChime();
    triggerStarConfetti();
    setLetterOpen(true);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#1A1028]/95 backdrop-blur-xl border-b border-[#69519A]/40 shadow-[0_4px_24px_rgba(0,0,0,0.45)] text-white">
        <div className="max-w-[1340px] mx-auto px-3 sm:px-6">
          {/* Main Top Bar */}
          <div className="h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-4">
            {/* Left: Pill Brand (matches hello-world-pip reference) */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleTabClick('portfolio-home')}
                className="flex items-center gap-2 bg-[#2D1B46]/90 hover:bg-[#3D255E] border border-[#69519A]/60 px-3.5 py-1.5 rounded-full text-white font-headline font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer shrink-0"
              >
                <span className="text-[#FFEAA7] text-sm">🌙</span>
                <span className="tracking-tight">Pip's Midnight Nursery</span>
              </button>
            </div>

            {/* Center: Navigation Pills (home, story, work, play, wall, about) */}
            <nav
              ref={navScrollRef}
              onScroll={checkScroll}
              className="flex items-center gap-1 sm:gap-2 overflow-x-auto touch-pan-x scroll-smooth scrollbar-none py-1"
              style={{ WebkitOverflowScrolling: 'touch' }}
            >
              {navItems.map((item) => {
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    data-active={isActive}
                    onClick={() => handleTabClick(item.id)}
                    className={`px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-xs font-headline font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                      isActive
                        ? 'bg-[#80244A] text-white shadow-[0_0_12px_rgba(128,36,74,0.7)] border border-[#FFB0C8]/60 scale-105'
                        : 'text-purple-200 hover:text-white hover:bg-white/10 border border-transparent'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </nav>

            {/* Right: Sound, Torch, Day/Night, Chaos buttons */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              {/* Master Sound Toggle */}
              <SoundToggle />

              {/* Pip's Bedtime Nightlight Torch Toggle */}
              <button
                onClick={() => {
                  playLanternResonance(80);
                  onToggleFlashlight?.();
                }}
                className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer shadow-xs active:scale-95 border ${
                  flashlightActive
                    ? 'bg-[#F7B731] text-[#422C38] border-amber-200 shadow-[0_0_14px_rgba(247,183,49,0.7)] scale-105'
                    : 'bg-[#2D1B4E] hover:bg-[#3D255E] border-[#69519A]/60 text-amber-200'
                }`}
                title="Pip's Bedtime Torch (Press F or click to explore hidden constellations!)"
              >
                <span className="text-[14px]">🔦</span>
                <span className="hidden xs:inline text-[10px] font-bold uppercase tracking-wider">
                  {flashlightActive ? 'torch on' : 'torch'}
                </span>
              </button>

              {/* Day / Night Mood Toggle */}
              <button
                onClick={cycleMood}
                className="flex items-center gap-1 px-2.5 sm:px-3 py-1 rounded-full text-xs font-bold bg-[#2D1B46] hover:bg-[#3D255E] border border-[#69519A]/60 text-amber-200 transition-all cursor-pointer shadow-xs active:scale-95"
                title={`Current mood: ${mood}. Click to cycle.`}
              >
                <span className="material-symbols-outlined text-[15px]">
                  {mood === 'night' ? 'dark_mode' : mood === 'dream' ? 'auto_awesome' : 'light_mode'}
                </span>
                <span className="hidden xs:inline text-[10px] font-bold uppercase tracking-wider">
                  {mood}
                </span>
              </button>

              {/* Chaos Magic Sparkle Button (matches hello-world-pip) */}
              <button
                onClick={handleChaosClick}
                className="flex items-center gap-1 px-2.5 sm:px-3 py-1 bg-gradient-to-r from-[#69519A] to-[#80244A] hover:from-[#553D85] hover:to-[#6C1B3D] text-white rounded-full text-xs font-bold shadow-xs cursor-pointer active:scale-95 transition-all"
                title="Trigger Chaos Dream Sparkles!"
              >
                <span className="material-symbols-outlined text-[14px] text-[#FFEAA7]">auto_fix_high</span>
                <span className="hidden sm:inline text-[10px] uppercase font-bold tracking-wider">chaos</span>
              </button>

              {/* Profile / Badge Avatar */}
              <button
                onClick={() => onOpenProfile?.()}
                className="relative p-0.5 rounded-full bg-[#2D1B46] border border-[#69519A]/60 hover:border-[#FFEAA7] transition-all cursor-pointer shrink-0"
                title="Inspect Official Dreamer Medallion"
              >
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#80244A] flex items-center justify-center text-xs">
                  <span className="material-symbols-outlined text-sm text-[#FFEAA7]">badge</span>
                </div>
                {milestone.isUnlocked && (
                  <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#F7B731] flex items-center justify-center text-[8px] text-[#5F4200] font-bold ring-1 ring-white">
                    ★
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Sub Ribbon Quote + Envelope (Exact match to screenshot!) */}
          <div className="hidden sm:flex items-center gap-2 pb-2 -mt-1">
            <div className="bg-[#2D1B46]/70 border border-[#69519A]/40 px-3 py-0.5 rounded-full text-[11px] text-[#FFEAA7] italic font-medium shadow-xs">
              “I build the dreams you fall asleep inside.”
            </div>
            <button
              onClick={handleOpenLetter}
              className="bg-[#2D1B46]/70 hover:bg-[#3D255E] border border-[#69519A]/40 px-2 py-0.5 rounded-full text-xs text-pink-300 hover:text-white transition-all cursor-pointer shadow-xs flex items-center gap-1 active:scale-90"
              title="A note from Pip! Click to open ✉️"
            >
              <span>✉️</span>
              <span className="text-[10px] font-bold">pip's letter</span>
            </button>
          </div>
        </div>
      </header>

      {/* Floating Bottom Right 'talk to pip (1)' widget (matches reference screenshot!) */}
      <button
        onClick={() => onOpenChat?.()}
        className="fixed bottom-4 right-4 z-40 bg-[#2D1B46]/95 hover:bg-[#3D255E] border-2 border-pink-400/60 hover:border-pink-300 text-white pl-1.5 pr-3.5 py-1.5 rounded-full shadow-[0_8px_25px_rgba(0,0,0,0.5)] flex items-center gap-2 transition-all transform hover:scale-105 active:scale-95 cursor-pointer backdrop-blur-md group"
      >
        <div className="relative w-8 h-8 rounded-full bg-gradient-to-tr from-pink-300 to-purple-200 p-0.5 overflow-hidden shadow-inner">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCd5MJ7oP6VykoZLhwGPh-OjfPDOadl0cLfcumC_RAn4_u9pu7edGRULyOJZ-8njSzYBt5pzneURCd262RBX6psJzfSH2q2ctV1VcacdLz9Wy1WIU4rSWSYJDqMmFwSPO64e7mHoUXz8uy0KvfWfMyiSqCi-f3RzVKeOtXDhtX5kis-ajlBxzsWOAtaal1Ub724PAktGzOxvoKit11R40Ibsu_pqpMYy5MXrM9-sFhT0isErJuJDpkbC698NuSGh6cZhA"
            alt="Pip"
            className="w-full h-full object-contain"
          />
          <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-[#E84393] text-white text-[9px] font-bold flex items-center justify-center ring-1 ring-white">
            1
          </span>
        </div>
        <span className="font-headline font-bold text-xs text-[#FFEAA7] group-hover:text-white transition-colors">
          talk to pip
        </span>
      </button>

      {/* Letter Modal when ✉️ is clicked */}
      {letterOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#231538] border-2 border-pink-300/40 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl text-white relative">
            <button
              onClick={() => setLetterOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center font-bold cursor-pointer"
            >
              ✕
            </button>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">✉️</span>
              <div>
                <span className="text-[10px] text-[#FFEAA7] uppercase font-bold tracking-widest block">
                  Confidential Midnight Note
                </span>
                <h3 className="font-display text-xl text-pink-300">From Pip to You</h3>
              </div>
            </div>
            <p className="text-sm text-purple-200 leading-relaxed font-serif bg-black/30 p-4 rounded-2xl border border-white/10 mb-4">
              "Dear Dreamer, thank you for stopping by my Midnight Nursery! Whether you’re listening to lullabies, crafting inventions, or playing in Mushroom Hollow, remember: the stars are always keeping you safe while you sleep. Sweet dreams! ☁️✨"
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setLetterOpen(false);
                  onOpenChat?.();
                }}
                className="px-4 py-2 rounded-full bg-[#80244A] hover:bg-[#9e3c62] text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
              >
                <span>💬 Talk with Pip</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
