import React, { useRef, useState, useEffect } from 'react';
import { SoundToggle } from './SoundToggle.jsx';
import { playTabChime, playBubblePopSound, playLanternResonance } from '../utils/audio.js';
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

  const navItems = [
    { id: 'portfolio-home', label: '☁️ Dreamland', icon: 'cloud' },
    { id: 'bedtime-storybook', label: '📖 Storybook', icon: 'auto_stories' },
    { id: 'dream-inventions', label: '🛠️ Toy Lab', icon: 'toys' },
    { id: 'dreamcatcher-arcade', label: '🎮 Star Arcade', icon: 'sports_esports' },
    { id: 'bedtime-wall', label: '💌 Dream Wall', icon: 'edit_note' },
    { id: 'about-pip', label: '🧸 Meet Pip', icon: 'face' },
  ];

  const checkScroll = () => {
    const el = navScrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 6);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 6);
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, []);

  useEffect(() => {
    if (navScrollRef.current) {
      const activeBtn = navScrollRef.current.querySelector('[data-active="true"]');
      if (activeBtn) {
        activeBtn.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      }
    }
    const timer = setTimeout(checkScroll, 300);
    return () => clearTimeout(timer);
  }, [currentTab]);

  const scrollNav = (direction) => {
    if (navScrollRef.current) {
      const amount = direction === 'left' ? -180 : 180;
      navScrollRef.current.scrollBy({ left: amount, behavior: 'smooth' });
      setTimeout(checkScroll, 250);
    }
  };

  const handleTabClick = (tab) => {
    playTabChime();
    onSelectTab(tab);
  };

  const cycleMood = () => {
    const nextMood = mood === 'day' ? 'night' : mood === 'night' ? 'dream' : 'day';
    playLanternResonance(nextMood === 'night' ? 30 : nextMood === 'dream' ? 90 : 60);
    onMoodChange?.(nextMood);
  };

  const moodDetails = {
    day: { icon: 'light_mode', label: 'Day Warmth', color: 'text-amber-500 bg-amber-50 border-amber-200' },
    night: { icon: 'dark_mode', label: 'Night Cozy', color: 'text-indigo-400 bg-indigo-950/80 border-indigo-700' },
    dream: { icon: 'auto_awesome', label: 'Dream Mood', color: 'text-purple-400 bg-purple-950/80 border-purple-700' },
  };

  const currentMoodMeta = moodDetails[mood] || moodDetails.day;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#fff7f9]/95 backdrop-blur-xl shadow-[0_2px_12px_rgba(139,114,190,0.08)] border-b border-[#F3E8DC]/80">
      {/* Top Bar: Brand on Left, Tools on Right */}
      <div className="h-14 sm:h-16 max-w-[1240px] mx-auto px-2 sm:px-6 flex items-center justify-between gap-1.5 sm:gap-3">
        {/* Brand Group */}
        <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 shrink">
          <button
            onClick={() => handleTabClick('portfolio-home')}
            className="flex items-center gap-1.5 sm:gap-2.5 group text-left focus:outline-none cursor-pointer min-w-0"
            aria-label="Pip the Skull Baby Home"
          >
            <div className="relative flex items-center justify-center shrink-0">
              <span className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#faeaf2] flex items-center justify-center text-[#80244a] group-hover:scale-105 transition-transform shadow-[0_2px_8px_rgba(247,183,49,0.25)] ring-2 ring-[#ffd9e2]">
                <span className="material-symbols-outlined text-[18px] sm:text-[22px]">bedtime</span>
              </span>
              <span className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3 sm:h-3.5 sm:w-3.5 items-center justify-center rounded-full bg-[#F7B731]">
                <span className="material-symbols-outlined text-[#7d5800] text-[8px] sm:text-[9px]">star</span>
              </span>
            </div>

            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-headline font-bold text-xs sm:text-base lg:text-[17px] text-[#3F2837] tracking-tight group-hover:text-[#80244a] transition-colors truncate">
                  Pip the Skull Baby
                </span>
                <span className="hidden md:inline-flex rounded-full bg-[#FFE3E8] px-2 py-0.5 text-[9px] font-bold text-[#80244a] uppercase tracking-wide shrink-0">
                  Junior Dream Engineer
                </span>
              </div>
              <span className="text-[9px] sm:text-[11px] text-[#62535F] flex items-center gap-1 truncate">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#F7B731] animate-pulse shrink-0"></span>
                <span className="hidden xs:inline">Midnight Nursery ·</span> Room 07
              </span>
            </div>
          </button>
        </div>

        {/* Right Tools & Toggles */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {/* Day / Night / Mood Toggle (Tier 1 Requirement) */}
          <button
            onClick={cycleMood}
            className={`flex items-center gap-1 p-1.5 sm:px-3 sm:py-1 rounded-full text-xs font-bold border transition-all cursor-pointer shadow-xs active:scale-95 ${currentMoodMeta.color}`}
            title={`Current: ${currentMoodMeta.label}. Click to cycle Day -> Night -> Dream`}
          >
            <span className="material-symbols-outlined text-[15px] sm:text-[17px]">
              {currentMoodMeta.icon}
            </span>
            <span className="hidden md:inline text-[10px] uppercase font-bold tracking-wider">
              {mood}
            </span>
          </button>

          {/* Flashlight / Nightlight Beam Toggle (Tier 2 Requirement) */}
          <button
            onClick={() => {
              playBubblePopSound(true);
              onToggleFlashlight?.(!flashlightActive);
            }}
            className={`flex items-center gap-1 p-1.5 sm:px-2.5 sm:py-1 rounded-full text-xs border transition-all cursor-pointer shadow-xs active:scale-95 ${
              flashlightActive
                ? 'bg-amber-400 text-stone-900 border-amber-500 font-bold'
                : 'bg-white hover:bg-amber-50 text-stone-700 border-[#F3E8DC]'
            }`}
            title="Toggle Nightlight Flashlight Cursor (Hotkey: F)"
          >
            <span className="text-[13px]">🔦</span>
            <span className="hidden lg:inline text-[10px] font-bold uppercase">
              {flashlightActive ? 'Beam ON' : 'Beam'}
            </span>
          </button>

          {/* Character Bedtime Radio Chat Button (Tier 3 Requirement) */}
          <button
            onClick={() => {
              playBubblePopSound(true);
              onOpenChat?.();
            }}
            className="flex items-center gap-1 px-2 py-1 sm:px-3 sm:py-1 bg-gradient-to-r from-[#80244a] to-[#9e3c62] hover:from-[#6c1b3d] hover:to-[#80244a] text-white rounded-full text-xs font-bold shadow-xs cursor-pointer active:scale-95 transition-all shrink-0"
            title="Chat with Pip the Skull Baby in Character Voice"
          >
            <span className="material-symbols-outlined text-[15px]">chat</span>
            <span className="hidden sm:inline text-[10px] uppercase">Chat</span>
          </button>

          {/* Odometer Hit Counter */}
          <div className="hidden lg:flex items-center gap-1.5 bg-[#FFFAEB] px-2.5 py-1 rounded-full ring-1 ring-[#FFEAA7] shadow-xs shrink-0">
            <span className="text-[9px] font-bold uppercase tracking-wider text-[#5f4200]">
              Dreams:
            </span>
            <span className="font-headline font-bold text-[11px] text-[#80244a] tracking-wider font-mono">
              {dreamCount.toString().padStart(6, '0').replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            </span>
            <span className="material-symbols-outlined text-[#F7B731] text-[12px]">star</span>
          </div>

          {/* Master Sound & Ambient Lullaby Toggle - Clearly shows ON/OFF */}
          <SoundToggle />

          {/* Interactive Profile Avatar & Badge Button */}
          <button
            onClick={() => onOpenProfile?.()}
            className="relative group flex items-center gap-1 focus:outline-none cursor-pointer shrink-0 p-0.5"
            title={
              milestone.isUnlocked
                ? 'Official Dream Engineer Badge Awarded - Click to view certificate'
                : `Apprentice Profile (${dreamCount} dreams) - Click to view`
            }
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#faeaf2] p-0.5 ring-2 ring-[#ffd9e2] group-hover:ring-[#80244a] transition-all flex items-center justify-center overflow-hidden shadow-2xs">
              <span className="material-symbols-outlined text-base sm:text-lg text-[#80244a]">
                badge
              </span>
            </div>
            {milestone.isUnlocked && (
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#F7B731] flex items-center justify-center text-[8px] text-[#5f4200] font-bold ring-1 ring-white">
                ★
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Navigation Bar Strip: Responsive, Touch-Smooth & Scrollable with Directional Chevrons */}
      <nav className="relative border-t border-[#F3E8DC]/60 bg-[#FFFDF7]/95 px-1 sm:px-3 select-none">
        {/* Left Scroll Button on Mobile */}
        {canScrollLeft && (
          <button
            onClick={() => scrollNav('left')}
            className="absolute left-1 top-1/2 -translate-y-1/2 z-20 w-6 h-6 rounded-full bg-white shadow-md border border-[#F3E8DC] text-[#80244a] flex items-center justify-center cursor-pointer active:scale-90 transition-transform md:hidden"
            aria-label="Scroll navigation left"
          >
            <span className="material-symbols-outlined text-sm font-bold">chevron_left</span>
          </button>
        )}

        {/* Left Edge Fade Mask */}
        {canScrollLeft && (
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-[#FFFDF7] to-transparent pointer-events-none z-10 md:hidden" />
        )}

        {/* Scrollable Container with Momentum Touch Support */}
        <div
          ref={navScrollRef}
          onScroll={checkScroll}
          className="max-w-[1240px] mx-auto flex items-center justify-start md:justify-center gap-1.5 sm:gap-2 py-1.5 overflow-x-auto touch-pan-x scroll-smooth scrollbar-none px-7 md:px-0"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                data-active={isActive}
                onClick={() => handleTabClick(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                  isActive
                    ? 'bg-[#80244a] text-white shadow-xs font-bold ring-2 ring-[#ffd9e2]'
                    : 'text-[#62535F] hover:text-[#80244a] hover:bg-[#FFE3E8]/60 bg-white/70 border border-[#F3E8DC]/60'
                }`}
              >
                <span className="material-symbols-outlined text-sm">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right Edge Fade Mask */}
        {canScrollRight && (
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#FFFDF7] to-transparent pointer-events-none z-10 md:hidden" />
        )}

        {/* Right Scroll Button on Mobile */}
        {canScrollRight && (
          <button
            onClick={() => scrollNav('right')}
            className="absolute right-1 top-1/2 -translate-y-1/2 z-20 w-6 h-6 rounded-full bg-white shadow-md border border-[#F3E8DC] text-[#80244a] flex items-center justify-center cursor-pointer active:scale-90 transition-transform md:hidden"
            aria-label="Scroll navigation right"
          >
            <span className="material-symbols-outlined text-sm font-bold">chevron_right</span>
          </button>
        )}
      </nav>
    </header>
  );
};
