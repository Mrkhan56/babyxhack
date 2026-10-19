import React, { useState } from 'react';
import {
  playChimeNote,
  playBubblePopSound,
  playEasterEggChime,
  playWoodBlockSound,
  playMelody,
  playHeartPopSound,
  playLanternResonance,
} from '../utils/audio.js';
import { triggerStarConfetti } from './SparkleCanvas.jsx';
import { PipInteractivePortrait } from './PipInteractivePortrait.jsx';

export const DreamlandHero = ({
  mood = 'day',
  dreamCount,
  onIncrementDreams,
  onSelectTab,
  onOpenProfile,
  onOpenChat,
  flashlightActive = false,
  onToggleFlashlight,
}) => {
  const [heroMode, setHeroMode] = useState('map'); // default to 'map' to match the user's screenshot!
  const [bowTapped, setBowTapped] = useState(false);
  const [isWindingMusicBox, setIsWindingMusicBox] = useState(false);
  const [activeChime, setActiveChime] = useState(null);
  const [blockOffsets, setBlockOffsets] = useState({ 0: 0, 1: 0, 2: 0, 3: 0 });
  const [bubbles, setBubbles] = useState([
    { id: 1, x: 12, y: 28, size: 44 },
    { id: 2, x: 82, y: 32, size: 52 },
    { id: 3, x: 16, y: 68, size: 38 },
    { id: 4, x: 84, y: 64, size: 46 },
    { id: 5, x: 50, y: 14, size: 40 },
  ]);

  const handlePopBubble = (id) => {
    playBubblePopSound(true);
    triggerStarConfetti();
    onIncrementDreams?.();
    setBubbles((prev) => prev.filter((b) => b.id !== id));
    setTimeout(() => {
      setBubbles((prev) => [
        ...prev,
        {
          id,
          x: Math.floor(Math.random() * 75) + 10,
          y: Math.floor(Math.random() * 60) + 15,
          size: Math.floor(Math.random() * 18) + 36,
        },
      ]);
    }, 2200);
  };

  const handleBowTap = () => {
    setBowTapped(true);
    playEasterEggChime();
    triggerStarConfetti();
    onIncrementDreams?.();
    setTimeout(() => setBowTapped(false), 900);
  };

  const handleMobileStarClick = (note, id) => {
    setActiveChime(id);
    playChimeNote(note, 0.8);
    triggerStarConfetti();
    setTimeout(() => setActiveChime(null), 400);
  };

  const handleWindMusicBox = () => {
    if (isWindingMusicBox) return;
    setIsWindingMusicBox(true);
    playHeartPopSound();
    const lullaby = [
      { note: 'C4', d: 340 },
      { note: 'E4', d: 340 },
      { note: 'G4', d: 440 },
      { note: 'A4', d: 500 },
      { note: 'G4', d: 340 },
      { note: 'E4', d: 680 },
    ];
    playMelody(lullaby, () => setIsWindingMusicBox(false));
  };

  const toggleBlockWobble = (index, note) => {
    playWoodBlockSound(250 + index * 40);
    setTimeout(() => playChimeNote(note, 0.4), 25);
    setBlockOffsets((prev) => ({
      ...prev,
      [index]: prev[index] === 0 ? (index % 2 === 0 ? -10 : 10) : 0,
    }));
  };

  return (
    <section className="w-full relative rounded-3xl overflow-hidden shadow-2xl border-2 border-[#69519A]/50 bg-[#160B24] text-white">
      {/* Visual Mode Selector Tabs (Top Bar) */}
      <div className="relative z-30 px-3 sm:px-6 pt-3 pb-2 flex flex-wrap items-center justify-between gap-2 border-b border-white/10 bg-[#160B24]/85 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <span className="text-sm">✨</span>
          <span className="font-headline font-bold text-xs uppercase tracking-wider text-[#FFEAA7]">
            Pip's Dreamland World
          </span>
        </div>

        {/* 3 View Tabs: Dreamland Map (Default) | Cloudscape | Nursery Room */}
        <div className="flex items-center gap-1 bg-white/10 p-1 rounded-full border border-white/15">
          <button
            onClick={() => {
              playBubblePopSound(true);
              setHeroMode('map');
            }}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              heroMode === 'map'
                ? 'bg-[#80244A] text-white shadow-xs'
                : 'text-white/80 hover:text-white hover:bg-white/10'
            }`}
          >
            <span>🗺️</span>
            <span>Dreamland Map</span>
          </button>

          <button
            onClick={() => {
              playBubblePopSound(true);
              setHeroMode('cloudscape');
            }}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              heroMode === 'cloudscape'
                ? 'bg-[#80244A] text-white shadow-xs'
                : 'text-white/80 hover:text-white hover:bg-white/10'
            }`}
          >
            <span>☁️</span>
            <span>Cloudscape</span>
          </button>

          <button
            onClick={() => {
              playBubblePopSound(true);
              setHeroMode('nursery');
            }}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              heroMode === 'nursery'
                ? 'bg-[#80244A] text-white shadow-xs'
                : 'text-white/80 hover:text-white hover:bg-white/10'
            }`}
          >
            <span>🧸</span>
            <span>Nursery Room</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODE 1: INTERACTIVE DREAMLAND MAP (EXACT MATCH TO REFERENCE SCREENSHOT)  */}
      {/* ========================================================================= */}
      {heroMode === 'map' && (
        <div
          className="relative min-h-[580px] sm:min-h-[640px] p-4 sm:p-8 flex flex-col justify-between overflow-hidden bg-cover bg-center"
          style={{ backgroundImage: `url('/assets/images/dreamland_landscape.jpg')` }}
        >
          {/* Subtle atmosphere shading overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#1C122C]/40 via-transparent to-[#160B24]/85 pointer-events-none" />

          {/* Floating Pop-able Bubbles across the landscape */}
          {bubbles.map((b) => (
            <button
              key={b.id}
              onClick={() => handlePopBubble(b.id)}
              style={{ left: `${b.x}%`, top: `${b.y}%`, width: `${b.size}px`, height: `${b.size}px` }}
              className="absolute z-20 rounded-full bg-gradient-to-tr from-pink-300/40 via-purple-200/30 to-white/70 border-2 border-white/80 shadow-[0_0_15px_rgba(255,255,255,0.7)] backdrop-blur-xs hover:scale-125 active:scale-150 transition-all cursor-pointer animate-pulse duration-2000 flex items-center justify-center group"
              title="Click to POP the Dream Bubble! ✨"
            >
              <span className="w-2 h-2 rounded-full bg-white/90 absolute top-1 left-1.5 pointer-events-none" />
              <span className="opacity-0 group-hover:opacity-100 text-xs font-bold transition-opacity">💥</span>
            </button>
          ))}

          {/* Top Info Banner & Legend */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 relative z-20">
            {/* Left Info HUD (Matches hello-world-pip reference) */}
            <div className="bg-[#2D1B4E]/85 backdrop-blur-md p-4 rounded-2xl border-2 border-white/30 max-w-xs sm:max-w-sm shadow-2xl">
              <span className="text-[10px] text-[#FFEAA7] uppercase tracking-widest font-bold block mb-1">
                ✦ a map of my dreamland ✦
              </span>
              <h2 className="font-display text-2xl sm:text-3xl text-pink-300 font-extrabold tracking-tight">
                Pip
              </h2>
              <p className="text-xs text-purple-200 leading-tight mt-0.5">
                Junior Dream Engineer at the Midnight Nursery
              </p>
              <p className="text-xs text-[#FFEAA7] italic mt-1.5 font-medium">
                “I build the dreams you fall asleep inside.”
              </p>
            </div>

            {/* Right: Torch & Compass Buttons */}
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <button
                onClick={() => {
                  playLanternResonance(80);
                  onToggleFlashlight?.();
                }}
                className={`w-12 h-12 rounded-full border-2 flex flex-col items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all cursor-pointer ${
                  flashlightActive
                    ? 'bg-[#F7B731] border-amber-200 text-[#422C38] shadow-[0_0_16px_rgba(247,183,49,0.8)] scale-105'
                    : 'bg-[#2D1B4E]/80 border-white/30 text-[#FFEAA7]'
                }`}
                title="Toggle Pip's Nightlight Torch (Press F)"
              >
                <span className="text-base">🔦</span>
                <span className="text-[7px] font-bold uppercase tracking-tighter">
                  {flashlightActive ? 'ON' : 'Torch'}
                </span>
              </button>

              <button
                onClick={() => {
                  playChimeNote('C5', 0.5);
                  triggerStarConfetti();
                }}
                className="w-12 h-12 rounded-full bg-[#2D1B4E]/80 border-2 border-white/30 flex flex-col items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-transform cursor-pointer"
                title="Back to Pip"
              >
                <span className="text-base">🧭</span>
                <span className="text-[8px] font-bold text-[#FFEAA7] uppercase tracking-tighter">Pip</span>
              </button>
            </div>
          </div>

          {/* Central Pip and Interactive Destination Portals */}
          <div className="relative my-6 sm:my-10 w-full min-h-[360px] flex items-center justify-center">
            {/* Pip in the center on fluffy cloud */}
            <div className="relative z-20 flex flex-col items-center">
              <div
                onClick={handleBowTap}
                className="w-44 h-44 sm:w-52 sm:h-52 cursor-pointer hover:scale-105 active:scale-95 transition-transform"
                title="Tap Pip's Bow!"
              >
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCd5MJ7oP6VykoZLhwGPh-OjfPDOadl0cLfcumC_RAn4_u9pu7edGRULyOJZ-8njSzYBt5pzneURCd262RBX6psJzfSH2q2ctV1VcacdLz9Wy1WIU4rSWSYJDqMmFwSPO64e7mHoUXz8uy0KvfWfMyiSqCi-f3RzVKeOtXDhtX5kis-ajlBxzsWOAtaal1Ub724PAktGzOxvoKit11R40Ibsu_pqpMYy5MXrM9-sFhT0isErJuJDpkbC698NuSGh6cZhA"
                  alt="Pip floating on cloud"
                  className="w-full h-full object-contain filter drop-shadow-[0_12px_30px_rgba(247,183,49,0.45)]"
                />
              </div>

              {/* Exact Speech Bubble from Screenshot! */}
              <div className="bg-[#2D1B4E]/95 border-2 border-white/40 text-white px-4 py-2 rounded-2xl text-xs sm:text-sm font-headline font-bold shadow-2xl text-center max-w-[280px] -mt-2 speech-bubble-tail-bottom">
                <span className="text-[#FFEAA7]">psst...</span> pick a place on my map and i'll fly you there!
              </div>
            </div>

            {/* Destination 1: The Mushroom Workshop (Left) */}
            <button
              onClick={() => {
                playBubblePopSound(true);
                onSelectTab('dream-inventions');
              }}
              className="absolute left-1 sm:left-8 top-10 sm:top-14 z-20 group flex flex-col items-center cursor-pointer hover:scale-105 active:scale-95 transition-all"
            >
              <div className="w-13 h-13 sm:w-16 sm:h-16 rounded-full bg-gradient-to-tr from-[#FFE3E8] to-white text-[#80244a] flex items-center justify-center shadow-[0_0_24px_rgba(255,227,232,0.6)] group-hover:scale-115 border-2 border-white transition-transform">
                <span className="text-2xl sm:text-3xl">🛠️</span>
              </div>
              <div className="mt-2 bg-[#2D1B4E]/95 text-white px-3.5 py-1.5 rounded-2xl text-center border-2 border-pink-300 shadow-xl group-hover:bg-[#80244a] transition-colors">
                <div className="font-headline font-bold text-xs sm:text-sm flex items-center justify-center gap-1">
                  <span>✦ The Mushroom Workshop ✦</span>
                </div>
                <div className="text-[10px] text-pink-200">dreams &amp; things i make</div>
              </div>
            </button>

            {/* Destination 2: The Moon (Top Right) */}
            <button
              onClick={() => {
                playBubblePopSound(true);
                onSelectTab('bedtime-storybook');
              }}
              className="absolute right-2 sm:right-16 top-6 sm:top-10 z-20 group flex flex-col items-center cursor-pointer hover:scale-105 active:scale-95 transition-all"
            >
              <div className="w-13 h-13 sm:w-16 sm:h-16 rounded-full bg-gradient-to-tr from-[#FFFAEB] to-white text-[#5f4200] flex items-center justify-center shadow-[0_0_24px_rgba(255,234,167,0.7)] group-hover:scale-115 border-2 border-white transition-transform">
                <span className="text-2xl sm:text-3xl">📖</span>
              </div>
              <div className="mt-2 bg-[#2D1B4E]/95 text-white px-3.5 py-1.5 rounded-2xl text-center border-2 border-amber-300 shadow-xl group-hover:bg-[#5f4200] transition-colors">
                <div className="font-headline font-bold text-xs sm:text-sm flex items-center justify-center gap-1">
                  <span>✦ The Moon ✦</span>
                </div>
                <div className="text-[10px] text-amber-200">my story &amp; lore</div>
              </div>
            </button>

            {/* Destination 3: Mushroom Hollow (Bottom Right) */}
            <button
              onClick={() => {
                playBubblePopSound(true);
                onSelectTab('dreamcatcher-arcade');
              }}
              className="absolute right-2 sm:right-12 bottom-6 sm:bottom-10 z-20 group flex flex-col items-center cursor-pointer hover:scale-105 active:scale-95 transition-all"
            >
              <div className="w-13 h-13 sm:w-16 sm:h-16 rounded-full bg-gradient-to-tr from-[#EDE7F6] to-white text-[#69519a] flex items-center justify-center shadow-[0_0_24px_rgba(201,174,255,0.6)] group-hover:scale-115 border-2 border-white transition-transform">
                <span className="text-2xl sm:text-3xl">🎮</span>
              </div>
              <div className="mt-2 bg-[#2D1B4E]/95 text-white px-3.5 py-1.5 rounded-2xl text-center border-2 border-purple-300 shadow-xl group-hover:bg-[#69519a] transition-colors">
                <div className="font-headline font-bold text-xs sm:text-sm flex items-center justify-center gap-1">
                  <span>✦ Mushroom Hollow ✦</span>
                </div>
                <div className="text-[10px] text-purple-200">games &amp; star arcade</div>
              </div>
            </button>
          </div>

          {/* Bottom Desktop Shortcuts & Exploration Pills (Matches reference) */}
          <div className="relative z-20 flex flex-wrap items-end justify-between gap-3 pt-2">
            {/* Desktop Icons Container */}
            <div className="bg-[#2D1B4E]/85 backdrop-blur-md p-2 rounded-2xl border-2 border-white/30 flex items-center gap-2 shadow-xl">
              <button
                onClick={() => onSelectTab('about-pip')}
                className="flex flex-col items-center p-2 rounded-xl hover:bg-white/15 transition-all cursor-pointer group"
                title="Read about Pip"
              >
                <span className="text-2xl group-hover:scale-110 transition-transform">📄</span>
                <span className="text-[10px] font-mono font-bold text-white mt-0.5">about_me.txt</span>
              </button>
              <button
                onClick={() => onSelectTab('bedtime-storybook')}
                className="flex flex-col items-center p-2 rounded-xl hover:bg-white/15 transition-all cursor-pointer group"
                title="Read Pip's bedtime memories"
              >
                <span className="text-2xl group-hover:scale-110 transition-transform">💾</span>
                <span className="text-[10px] font-mono font-bold text-white mt-0.5">memories.exe</span>
              </button>
            </div>

            {/* Center Hint Pills */}
            <div className="flex flex-col items-center gap-1.5 mx-auto">
              <div className="px-4 py-1 rounded-full bg-[#2D1B4E]/85 border border-white/30 text-[11px] font-headline font-bold text-[#FFEAA7] shadow-md">
                ✦ drag to explore the dreamland ✦
              </div>
              <button
                onClick={() => window.scrollBy({ top: 450, behavior: 'smooth' })}
                className="px-4 py-0.5 rounded-full bg-[#2D1B4E]/75 border border-white/20 text-[10px] font-headline font-bold text-purple-200 hover:text-white cursor-pointer"
              >
                ✦ scroll for credits! ▼
              </button>
            </div>
          </div>

          {/* Sleeping Houses Silhouette with Glowing Windows (Matches reference screenshot!) */}
          <div className="w-full flex items-end justify-center gap-1.5 pt-3 opacity-90 overflow-hidden relative z-10">
            {[...Array(14)].map((_, i) => (
              <div key={i} className="flex flex-col items-center shrink-0">
                <div className="w-0 h-0 border-l-[16px] border-l-transparent border-r-[16px] border-r-transparent border-b-[14px] border-b-[#1C122C]" />
                <div className="w-8 h-10 bg-[#1C122C] flex items-center justify-center p-1">
                  <div className="w-3 h-3.5 bg-[#FFEAA7] rounded-xs shadow-[0_0_10px_#FFEAA7] animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 2: CLOUDSCAPE HERO                                                   */}
      {/* ========================================================================= */}
      {heroMode === 'cloudscape' && (
        <div className="relative min-h-[500px] sm:min-h-[540px] p-6 sm:p-10 flex flex-col items-center justify-between overflow-hidden">
          {/* Celestial background artwork: starry sky, moon, classical arch ruins */}
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#d8b4e2]/30 via-[#3a2245]/60 to-[#1d1224] -z-10" />

          {/* Floating Interactive Soap Bubbles (Children can tap to POP!) */}
          {bubbles.map((b) => (
            <button
              key={b.id}
              onClick={() => handlePopBubble(b.id)}
              style={{ left: `${b.x}%`, top: `${b.y}%`, width: `${b.size}px`, height: `${b.size}px` }}
              className="absolute z-20 rounded-full bg-gradient-to-tr from-pink-300/40 via-purple-200/30 to-white/70 border-2 border-white/80 shadow-[0_0_15px_rgba(255,255,255,0.7)] backdrop-blur-xs hover:scale-125 active:scale-150 transition-all cursor-pointer animate-pulse duration-2000 flex items-center justify-center group"
              title="Click to POP the Dream Bubble! ✨"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-white/90 absolute top-1.5 left-2 pointer-events-none" />
              <span className="opacity-0 group-hover:opacity-100 text-xs font-bold transition-opacity">💥</span>
            </button>
          ))}

          {/* Crescent Moon in top right corner */}
          <div className="absolute top-6 right-8 sm:right-16 w-20 h-20 pointer-events-none opacity-80 animate-pulse duration-3000">
            <span className="text-5xl sm:text-6xl drop-shadow-[0_0_25px_rgba(255,234,167,0.7)]">
              🌙
            </span>
          </div>

          {/* Golden ladder with plush teddy bear on right edge */}
          <div className="hidden lg:flex absolute right-6 top-10 bottom-6 w-12 flex-col items-center justify-between border-x-2 border-amber-300/40 bg-amber-200/5">
            <div className="text-2xl -mt-2 animate-bounce">🧸</div>
            {[1, 2, 3, 4, 5, 6, 7].map((r) => (
              <div key={r} className="w-full h-0.5 bg-amber-300/40 my-2" />
            ))}
            <div className="text-xs text-amber-200/60 font-mono">Room 07</div>
          </div>

          {/* Central 3D "PIP" Typography with Speech Bubble */}
          <div className="relative flex flex-col items-center mt-2 sm:mt-4 text-center z-10">
            <div className="relative inline-block">
              {/* Massive 3D Glossy "PIP" Text */}
              <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-3d-pip tracking-tight select-none py-1">
                PIP
              </h1>

              {/* Comic Speech Bubble: "Hi! I'm Pip!" */}
              <div className="absolute -top-3 -right-6 sm:-right-12 bg-white text-[#3F2837] px-3 py-1 rounded-2xl shadow-lg border-2 border-[#FFE3E8] font-headline font-bold text-xs sm:text-sm animate-bounce duration-1000 rotate-3 speech-bubble-tail-left">
                Hi! I'm Pip!
              </div>
            </div>

            {/* Subtitle in retro pixel / typewriter style */}
            <p className="font-pixel text-lg sm:text-2xl text-[#FFEAA7] tracking-widest mt-1 sm:mt-2 drop-shadow-md">
              Pip · Junior Dream Engineer · Midnight Nursery
            </p>
          </div>

          {/* Pip Character with Speech Bubble */}
          <div className="relative w-full max-w-[340px] sm:max-w-[400px] my-4 flex flex-col items-center justify-center">
            {/* Pip's Quote Speech Bubble */}
            <div className="relative sm:absolute sm:-top-2 sm:-left-36 bg-white text-[#3F2837] p-3 sm:p-4 rounded-2xl shadow-xl border-2 border-[#FFE3E8] max-w-[240px] sm:max-w-[260px] text-center z-20 speech-bubble-tail-bottom sm:speech-bubble-tail-left mb-4 sm:mb-0">
              <p className="font-headline font-bold text-xs sm:text-sm text-[#80244a] leading-snug">
                “I build the dreams you fall asleep inside.”
              </p>
            </div>

            {/* Interactive Pip Portrait on Puffy Cloud */}
            <div className="w-56 h-56 sm:w-64 sm:h-64 relative flex items-center justify-center">
              <PipInteractivePortrait
                mood={mood}
                bowTapped={bowTapped}
                onBowTap={handleBowTap}
              />
            </div>
          </div>

          {/* Bottom Quick Controls Deck */}
          <div className="relative z-10 flex flex-wrap items-center justify-center gap-2 sm:gap-3 w-full">
            <button
              onClick={handleBowTap}
              className="px-4 py-2 rounded-full bg-[#80244a] hover:bg-[#9e3c62] text-white font-headline font-bold text-xs shadow-md border border-white/20 hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span>🎀</span>
              <span>Tickle Nightcap Bow</span>
            </button>

            <button
              onClick={() => {
                playChimeNote('C5', 0.5);
                triggerStarConfetti();
                onIncrementDreams?.();
              }}
              className="px-4 py-2 rounded-full bg-white/90 hover:bg-white text-[#80244a] font-headline font-bold text-xs shadow-md border border-[#FFE3E8] hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span>✨</span>
              <span>Weave Starlight (+1 Dream)</span>
            </button>

            <button
              onClick={() => setHeroMode('map')}
              className="px-4 py-2 rounded-full bg-[#FFEAA7] text-[#5f4200] font-headline font-bold text-xs shadow-md hover:bg-[#ffdea8] hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span>🗺️</span>
              <span>Explore Dreamland Map</span>
            </button>

            <button
              onClick={() => setHeroMode('nursery')}
              className="px-4 py-2 rounded-full bg-[#EDE7F6] text-[#69519a] font-headline font-bold text-xs shadow-md hover:bg-[#F5F0FB] hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span>🧸</span>
              <span>Visit Nursery Room</span>
            </button>
          </div>

          {/* Floating Kitten with "scroll to dream" (Interactive tap!) */}
          <div
            onClick={() => {
              playBubblePopSound(true);
              triggerStarConfetti();
              onIncrementDreams?.();
            }}
            className="mt-4 flex items-center gap-2 text-xs text-white/90 font-pixel text-base cursor-pointer hover:scale-110 active:scale-95 transition-all select-none bg-white/10 px-3 py-1 rounded-full border border-white/20"
            title="Click kitty to pet! 🐱"
          >
            <span className="text-xl animate-bounce">🐱</span>
            <span>scroll to dream (or click kitty!)</span>
            <span className="material-symbols-outlined text-sm animate-bounce">arrow_downward</span>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 2: INTERACTIVE DREAMLAND MAP (Inspired by Image 3: hello-world-pip) */}
      {/* ========================================================================= */}
      {heroMode === 'map' && (
        <div className="relative min-h-[520px] sm:min-h-[580px] p-4 sm:p-8 flex flex-col justify-between overflow-hidden">
          {/* Starry enchanted valley background */}
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#4A3258] via-[#24172c] to-[#140b19] -z-10" />

          {/* Top Info Banner & Legend */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10">
            {/* Left Info HUD */}
            <div className="bg-[#3F2837]/80 backdrop-blur-md p-4 rounded-2xl border border-white/20 max-w-sm shadow-xl">
              <span className="text-[10px] text-[#FFEAA7] uppercase tracking-widest font-bold block mb-1">
                ✦ a map of my dreamland ✦
              </span>
              <h2 className="font-display text-2xl text-white font-bold tracking-tight">Pip</h2>
              <p className="text-xs text-purple-200">
                Junior Dream Engineer at the Midnight Nursery
              </p>
              <p className="text-xs text-[#FFEAA7] italic mt-1 font-medium">
                “I build the dreams you fall asleep inside.”
              </p>
            </div>

            {/* Right Quick Return */}
            <button
              onClick={() => setHeroMode('cloudscape')}
              className="self-start sm:self-auto px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold text-white flex items-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">home</span>
              <span>Back to Cloudscape</span>
            </button>
          </div>

          {/* Interactive Floating Constellation Nodes Map */}
          <div className="relative my-8 sm:my-10 w-full min-h-[340px] flex items-center justify-center">
            {/* Pip in the center */}
            <div className="relative z-10 flex flex-col items-center">
              <div
                onClick={handleBowTap}
                className="w-40 h-40 sm:w-48 sm:h-48 cursor-pointer hover:scale-105 transition-transform"
                title="Tap Pip's Bow!"
              >
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCd5MJ7oP6VykoZLhwGPh-OjfPDOadl0cLfcumC_RAn4_u9pu7edGRULyOJZ-8njSzYBt5pzneURCd262RBX6psJzfSH2q2ctV1VcacdLz9Wy1WIU4rSWSYJDqMmFwSPO64e7mHoUXz8uy0KvfWfMyiSqCi-f3RzVKeOtXDhtX5kis-ajlBxzsWOAtaal1Ub724PAktGzOxvoKit11R40Ibsu_pqpMYy5MXrM9-sFhT0isErJuJDpkbC698NuSGh6cZhA"
                  alt="Pip floating on cloud"
                  className="w-full h-full object-contain filter drop-shadow-[0_10px_25px_rgba(247,183,49,0.35)]"
                />
              </div>
              <div className="bg-[#2B1B36]/90 border border-white/20 text-[#FFEAA7] px-3 py-1 rounded-full text-xs font-mono shadow-md mt-1">
                the moon watched over the night i was dreamed...
              </div>
            </div>

            {/* Destination Node 1: The Mushroom Workshop (Left) */}
            <button
              onClick={() => {
                playBubblePopSound(true);
                onSelectTab('dream-inventions');
              }}
              className="absolute left-1 sm:left-6 top-8 sm:top-12 z-20 group flex flex-col items-center cursor-pointer"
            >
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#FFE3E8] text-[#80244a] flex items-center justify-center shadow-[0_0_20px_rgba(255,227,232,0.4)] group-hover:scale-110 border-2 border-white transition-transform">
                <span className="material-symbols-outlined text-xl sm:text-2xl">toys</span>
              </div>
              <div className="mt-2 bg-[#80244a] text-white px-3 py-1 rounded-xl text-center border border-white/20 shadow-lg group-hover:bg-[#9e3c62] transition-colors">
                <div className="font-headline font-bold text-xs sm:text-sm">The Mushroom Workshop</div>
                <div className="text-[10px] text-pink-200">dreams &amp; things i make</div>
              </div>
            </button>

            {/* Destination Node 2: The Moon & Storybook (Top Right) */}
            <button
              onClick={() => {
                playBubblePopSound(true);
                onSelectTab('bedtime-storybook');
              }}
              className="absolute right-2 sm:right-12 top-4 sm:top-8 z-20 group flex flex-col items-center cursor-pointer"
            >
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#FFFAEB] text-[#5f4200] flex items-center justify-center shadow-[0_0_20px_rgba(255,234,167,0.5)] group-hover:scale-110 border-2 border-white transition-transform">
                <span className="material-symbols-outlined text-xl sm:text-2xl text-[#F7B731]">auto_stories</span>
              </div>
              <div className="mt-2 bg-[#5f4200] text-white px-3 py-1 rounded-xl text-center border border-white/20 shadow-lg group-hover:bg-[#7d5800] transition-colors">
                <div className="font-headline font-bold text-xs sm:text-sm">The Moon</div>
                <div className="text-[10px] text-amber-200">my storybook &amp; origins</div>
              </div>
            </button>

            {/* Destination Node 3: Mushroom Hollow Arcade (Bottom Right) */}
            <button
              onClick={() => {
                playBubblePopSound(true);
                onSelectTab('dreamcatcher-arcade');
              }}
              className="absolute right-2 sm:right-10 bottom-4 sm:bottom-6 z-20 group flex flex-col items-center cursor-pointer"
            >
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#EDE7F6] text-[#69519a] flex items-center justify-center shadow-[0_0_20px_rgba(201,174,255,0.4)] group-hover:scale-110 border-2 border-white transition-transform">
                <span className="material-symbols-outlined text-xl sm:text-2xl">sports_esports</span>
              </div>
              <div className="mt-2 bg-[#69519a] text-white px-3 py-1 rounded-xl text-center border border-white/20 shadow-lg group-hover:bg-[#553d85] transition-colors">
                <div className="font-headline font-bold text-xs sm:text-sm">Mushroom Hollow</div>
                <div className="text-[10px] text-purple-200">games &amp; star arcade</div>
              </div>
            </button>

            {/* Destination Node 4: Bedtime Wall & Guestbook (Bottom Left) */}
            <button
              onClick={() => {
                playBubblePopSound(true);
                onSelectTab('bedtime-wall');
              }}
              className="absolute left-2 sm:left-12 bottom-4 sm:bottom-6 z-20 group flex flex-col items-center cursor-pointer"
            >
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white text-[#80244a] flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.4)] group-hover:scale-110 border-2 border-[#FFE3E8] transition-transform">
                <span className="material-symbols-outlined text-xl sm:text-2xl">edit_note</span>
              </div>
              <div className="mt-2 bg-[#21191f] text-white px-3 py-1 rounded-xl text-center border border-white/20 shadow-lg hover:bg-black transition-colors">
                <div className="font-headline font-bold text-xs sm:text-sm">Bedtime Wall</div>
                <div className="text-[10px] text-pink-200">sleepy guestbook notes</div>
              </div>
            </button>
          </div>

          {/* Bottom Desktop Shortcuts */}
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/10 text-xs">
            <div className="flex items-center gap-3">
              <button
                onClick={() => onSelectTab('about-pip')}
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 cursor-pointer font-mono text-[11px]"
              >
                <span>📄</span>
                <span>about_me.txt</span>
              </button>
              <button
                onClick={() => onOpenProfile?.()}
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 cursor-pointer font-mono text-[11px]"
              >
                <span>💾</span>
                <span>dream_credentials.exe</span>
              </button>
            </div>

            <div className="text-center font-mono text-xs text-[#FFEAA7]">
              ✦ tap any dreamland landmark to explore ✦
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 3: PIP'S NURSERY BEDROOM (Inspired by Image 2: pipnursery.vercel.app) */}
      {/* ========================================================================= */}
      {heroMode === 'nursery' && (
        <div className="relative min-h-[500px] sm:min-h-[560px] p-4 sm:p-8 flex flex-col justify-between overflow-hidden">
          {/* Cozy bedroom background wallpaper with stars and warm wooden nursery colors */}
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-[#2E1A34] via-[#4A2D46] to-[#6E4253] -z-10" />

          {/* Arched Window in Background with crescent moon */}
          <div className="absolute top-6 left-1/2 -translate-x-1/2 w-48 h-48 sm:w-56 sm:h-56 rounded-full border-4 border-[#FFEAA7]/40 bg-gradient-to-b from-[#140b22] to-[#251939] shadow-inner flex items-center justify-center pointer-events-none -z-5 opacity-90">
            <span className="text-6xl sm:text-7xl drop-shadow-[0_0_20px_#FFEAA7]">🌙</span>
          </div>

          {/* Top Bar with Hanging Star Mobile */}
          <div className="relative z-10 flex items-center justify-between">
            {/* Top Left Shortcut */}
            <button
              onClick={() => onOpenProfile?.()}
              className="px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-mono text-white flex items-center gap-1 cursor-pointer"
            >
              <span>go straight to my computer →</span>
            </button>

            {/* Hanging Stars Mobile (Click stars to play chimes!) */}
            <div className="flex items-center gap-2 sm:gap-3 bg-white/10 backdrop-blur-md px-3 sm:px-4 py-1.5 rounded-2xl border border-white/20">
              <span className="text-[10px] uppercase font-bold text-[#FFEAA7] hidden sm:inline">
                Baby Mobile:
              </span>
              {[
                { n: 'C4', label: '⭐' },
                { n: 'E4', label: '🌟' },
                { n: 'G4', label: '🌙' },
                { n: 'A4', label: '⭐' },
                { n: 'C5', label: '✨' },
              ].map(({ n, label }, idx) => (
                <button
                  key={idx}
                  onClick={() => handleMobileStarClick(n, idx)}
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-sm transition-transform cursor-pointer hover:scale-125 ${
                    activeChime === idx
                      ? 'bg-amber-300 text-stone-900 scale-125 shadow-lg'
                      : 'bg-white/20 text-white'
                  }`}
                  title={`Tap chime ${n}`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Bedroom Interior Items (Music box, Pip in center, DreamOS Computer) */}
          <div className="relative z-10 my-6 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            {/* Left: Unicorn Music Box on Shelf */}
            <div className="flex flex-col items-center text-center">
              <div
                onClick={handleWindMusicBox}
                className={`w-28 h-28 rounded-2xl bg-white/90 text-[#80244a] p-3 shadow-xl border-2 border-[#FFE3E8] flex flex-col items-center justify-center cursor-pointer hover:scale-105 transition-transform ${
                  isWindingMusicBox ? 'animate-spin duration-3000' : ''
                }`}
                title="Wind up the Nursery Music Box"
              >
                <span className="text-4xl mb-1">🦄</span>
                <span className="font-headline font-bold text-xs">Music Box</span>
                <span className="text-[9px] text-[#544247]">
                  {isWindingMusicBox ? 'Playing...' : 'Click to wind'}
                </span>
              </div>
            </div>

            {/* Center: Pip waving on his cloud */}
            <div className="flex flex-col items-center text-center">
              <div
                onClick={handleBowTap}
                className="w-44 h-44 sm:w-52 sm:h-52 cursor-pointer hover:scale-105 transition-transform"
                title="Click Pip to tickle his bow!"
              >
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCd5MJ7oP6VykoZLhwGPh-OjfPDOadl0cLfcumC_RAn4_u9pu7edGRULyOJZ-8njSzYBt5pzneURCd262RBX6psJzfSH2q2ctV1VcacdLz9Wy1WIU4rSWSYJDqMmFwSPO64e7mHoUXz8uy0KvfWfMyiSqCi-f3RzVKeOtXDhtX5kis-ajlBxzsWOAtaal1Ub724PAktGzOxvoKit11R40Ibsu_pqpMYy5MXrM9-sFhT0isErJuJDpkbC698NuSGh6cZhA"
                  alt="Pip"
                  className="w-full h-full object-contain filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.3)]"
                />
              </div>

              {/* Wooden Toy Blocks spelling P I P */}
              <div className="flex items-center gap-1.5 mt-2">
                {[0, 1, 2, 3].map((idx) => {
                  const notes = ['C4', 'E4', 'G4', 'C5'];
                  return (
                    <button
                      key={idx}
                      onClick={() => toggleBlockWobble(idx, notes[idx])}
                      style={{ transform: `translateY(${blockOffsets[idx]}px)` }}
                      className="w-8 h-8 rounded-lg bg-[#FFEAA7] text-[#5f4200] font-headline font-bold text-xs border border-amber-300 shadow-md transition-transform duration-200 cursor-pointer flex items-center justify-center hover:scale-110"
                    >
                      {['P', 'I', 'P', '★'][idx]}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right: Retro Pink CRT Monitor (DreamOS) */}
            <div className="flex flex-col items-center text-center">
              <div
                onClick={() => {
                  playBubblePopSound(true);
                  onOpenProfile?.();
                }}
                className="w-36 h-36 rounded-2xl bg-[#FFE3E8] p-3 shadow-2xl border-4 border-[#ffb0c8] flex flex-col items-center justify-between cursor-pointer hover:scale-105 active:scale-95 transition-all group"
                title="Open DreamOS on Pip's Pink Computer"
              >
                {/* CRT Screen */}
                <div className="w-full h-20 rounded-lg bg-[#21191F] border-2 border-stone-800 flex flex-col items-center justify-center text-center p-1.5 text-emerald-400 font-mono shadow-inner">
                  <span className="text-[11px] font-bold tracking-wider">DreamOS</span>
                  <span className="text-[9px] text-[#FFEAA7] animate-pulse">click me</span>
                </div>
                {/* Keyboard & Base */}
                <div className="text-[10px] font-bold text-[#80244a] flex items-center gap-1">
                  <span>⌨️</span>
                  <span>Pip's Computer</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Nursery Floor Accessories */}
          <div className="relative z-10 pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs text-[#FFEAA7]">
            <div className="flex items-center gap-2">
              <span className="text-xl">🧸</span>
              <span className="font-headline font-bold">Midnight Nursery Room 07</span>
            </div>
            <button
              onClick={() => onSelectTab('about-pip')}
              className="px-3 py-1 rounded-full bg-white/20 hover:bg-white/30 text-white font-bold cursor-pointer transition-colors"
            >
              Inspect Nursery Dossier
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
