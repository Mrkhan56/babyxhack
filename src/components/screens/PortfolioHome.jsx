import React, { useState, useEffect } from 'react';
import {
  playChimeNote,
  playMelody,
  playEasterEggChime,
  playWoodBlockSound,
  playHeartPopSound,
  playBubblePopSound,
} from '../../utils/audio.js';
import { triggerStarConfetti } from '../SparkleCanvas.jsx';
import { SuggestionsHub } from '../SuggestionsHub.jsx';
import { DreamerProfileSection } from '../DreamerProfileSection.jsx';
import { DreamlandHero } from '../DreamlandHero.jsx';
import { trackVisitorArrival } from '../../utils/badge.js';

export const PortfolioHome = ({
  onSelectTab,
  onIncrementDreams,
  dreamCount,
  mood = 'day',
  onOpenChat,
  onOpenProfile,
  flashlightActive = false,
  onToggleFlashlight,
}) => {
  const [isPlayingLullaby, setIsPlayingLullaby] = useState(false);
  const [activeNote, setActiveNote] = useState(null);
  const [blockOffsets, setBlockOffsets] = useState({ 0: 0, 1: 0, 2: 0, 3: 0 });
  const [visitorGreeting, setVisitorGreeting] = useState('');
  const [toyActionText, setToyActionText] = useState('Tap any toy to play with Pip!');
  const [snuggleCount, setSnuggleCount] = useState(0);

  useEffect(() => {
    const memory = trackVisitorArrival();
    setVisitorGreeting(memory.customGreeting);
  }, []);

  const handleChimeTap = (note, name) => {
    setActiveNote(note);
    playChimeNote(note, 0.85);
    triggerStarConfetti();
    onIncrementDreams?.();
    setToyActionText(`*Ding!* You played the ${name} (${note})! ✨`);
    setTimeout(() => setActiveNote(null), 350);
  };

  const handlePlayFullMelody = () => {
    if (isPlayingLullaby) return;
    setIsPlayingLullaby(true);
    setToyActionText('♫ Playing the sleepy star melody for all nursery dreamers...');
    const melody = [
      { note: 'C4', d: 350 },
      { note: 'E4', d: 350 },
      { note: 'G4', d: 450 },
      { note: 'A4', d: 520 },
      { note: 'G4', d: 350 },
      { note: 'E4', d: 750 },
    ];
    playMelody(melody, () => {
      setIsPlayingLullaby(false);
      setToyActionText('✨ Pip smiled and tucked all the dreamers into bed!');
    });
  };

  const toggleBlockWobble = (index, note, letter) => {
    playWoodBlockSound(240 + index * 50);
    setTimeout(() => playChimeNote(note, 0.4), 25);
    onIncrementDreams?.();
    setToyActionText(`*Clack!* Block [${letter}] danced! +1 Dream!`);
    setBlockOffsets((prev) => ({
      ...prev,
      [index]: prev[index] === 0 ? (index % 2 === 0 ? -12 : 12) : 0,
    }));
  };

  const handleToyClick = (toy) => {
    playHeartPopSound();
    triggerStarConfetti();
    onIncrementDreams?.();
    if (toy === 'cloud') {
      setToyActionText('☁️ Puffed a giant vanilla cloud! It smells like marshmallow dreams!');
    } else if (toy === 'teddy') {
      setSnuggleCount((c) => c + 1);
      setToyActionText(`🧸 Soft warm bear hug! Snuggles: ${snuggleCount + 1}! Pip snort-giggled!`);
    } else if (toy === 'lantern') {
      setToyActionText('🏮 Starlight lantern glowing brighter! The room is cozy and safe!');
    } else if (toy === 'unicorn') {
      handlePlayFullMelody();
    }
  };

  return (
    <div className="w-full flex flex-col gap-10 lg:gap-14">
      {/* Returning Visitor Personalized Greeting Banner */}
      {visitorGreeting && (
        <div className="bg-gradient-to-r from-[#FFE3E8] via-[#FFF9F2] to-[#FFFAEB] border-2 border-[#ffd9e2] rounded-3xl p-3 sm:p-4 shadow-sm flex items-center justify-between gap-3 text-xs sm:text-sm text-[#80244a] animate-in fade-in duration-300">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl animate-bounce">🎀</span>
            <span className="font-headline font-bold">{visitorGreeting}</span>
          </div>
          <button
            onClick={() => onOpenChat?.()}
            className="shrink-0 px-4 py-1.5 bg-[#80244a] hover:bg-[#6c1b3d] text-white rounded-full font-headline font-bold text-xs shadow-md transition-all cursor-pointer active:scale-95 flex items-center gap-1"
          >
            <span>💬</span>
            <span>Say Hi to Pip</span>
          </button>
        </div>
      )}

      {/* GRAND HERO EXPERIENCE (3 Switchable Modes: Cloudscape, Dreamland Map, Nursery Room) */}
      <DreamlandHero
        mood={mood}
        dreamCount={dreamCount}
        onIncrementDreams={onIncrementDreams}
        onSelectTab={onSelectTab}
        onOpenProfile={onOpenProfile}
        onOpenChat={onOpenChat}
        flashlightActive={flashlightActive}
        onToggleFlashlight={onToggleFlashlight}
      />

      {/* SECTION 1: PIP'S INTERACTIVE TOY CHEST & MUSICAL PLAYROOM */}
      <section className="w-full bg-[#231538]/85 backdrop-blur-md rounded-3xl p-6 sm:p-8 border-2 border-[#69519A]/40 text-white shadow-2xl flex flex-col gap-6 relative overflow-hidden">
        {/* Playful Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <span className="w-12 h-12 rounded-2xl bg-[#80244A] text-white flex items-center justify-center text-2xl shadow-md border border-[#FFB0C8]/40">
              🧸
            </span>
            <div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Pip's Interactive Toybox &amp; Music Lab
              </h2>
              <p className="text-xs sm:text-sm text-purple-200">
                Tap the musical bells, wooden blocks, and toys to make sounds and play with Pip!
              </p>
            </div>
          </div>

          {/* Real-time toy feedback banner */}
          <div className="bg-[#2D1B4E] border border-[#FFEAA7]/40 px-3.5 py-1.5 rounded-full text-xs font-headline font-bold text-[#FFEAA7] self-start sm:self-auto shadow-md">
            {toyActionText}
          </div>
        </div>

        {/* 1. Rainbow Celesta Bell Keys */}
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <span className="font-headline font-bold text-xs uppercase tracking-wider text-[#FFEAA7] flex items-center gap-1.5">
              <span>🎵</span>
              <span>Harmonious Pentatonic Chime Bells (Tap to Play!)</span>
            </span>
            <button
              onClick={handlePlayFullMelody}
              disabled={isPlayingLullaby}
              className="px-3.5 py-1.5 rounded-full bg-[#80244A] hover:bg-[#9E3C62] disabled:bg-stone-600 text-white font-headline font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>{isPlayingLullaby ? '⏳' : '▶'}</span>
              <span>{isPlayingLullaby ? 'Playing...' : 'Play Full Lullaby'}</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 sm:gap-3">
            {[
              { note: 'C4', name: 'Kitty Purr Bell', icon: '🐱', color: 'from-[#4A2035] to-[#2E1428] border-pink-400' },
              { note: 'E4', name: 'Puppy Chime', icon: '🐶', color: 'from-[#4D3818] to-[#2E200C] border-amber-400' },
              { note: 'G4', name: 'Bunny Star', icon: '🐰', color: 'from-[#3A2254] to-[#201133] border-purple-400' },
              { note: 'A4', name: 'Teddy Chime', icon: '🐻', color: 'from-[#1E3354] to-[#101E33] border-blue-400' },
              { note: 'C5', name: 'Unicorn Bell', icon: '🦄', color: 'from-[#194236] to-[#0D261E] border-emerald-400' },
            ].map(({ note, name, icon, color }) => (
              <button
                key={note}
                onClick={() => handleChimeTap(note, name)}
                className={`p-3.5 sm:p-4 rounded-2xl border-2 transition-all flex flex-col items-center justify-center gap-1 cursor-pointer active:scale-95 shadow-md bg-gradient-to-b ${color} ${
                  activeNote === note
                    ? 'scale-105 shadow-xl ring-4 ring-[#FFEAA7]/40'
                    : 'hover:scale-103 hover:shadow-lg'
                }`}
              >
                <span className="text-3xl sm:text-4xl">{icon}</span>
                <span className="font-display font-bold text-base sm:text-lg text-white">{note}</span>
                <span className="text-[10px] text-purple-200 font-bold">{name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 2. Interactive Toy Carousel Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          {/* Toy 1: Marshmallow Cloud */}
          <div
            onClick={() => handleToyClick('cloud')}
            className="p-4 rounded-2xl bg-[#2D1B4E]/85 border-2 border-white/20 hover:border-pink-300 flex flex-col items-center text-center cursor-pointer hover:scale-105 active:scale-95 transition-all shadow-md group"
          >
            <span className="text-4xl mb-1 group-hover:animate-bounce">☁️</span>
            <span className="font-headline font-bold text-xs text-white">Cloud Machine</span>
            <span className="text-[10px] text-[#FFEAA7] font-bold mt-0.5">Click to Puff!</span>
          </div>

          {/* Toy 2: Snuggle Bear */}
          <div
            onClick={() => handleToyClick('teddy')}
            className="p-4 rounded-2xl bg-[#2D1B4E]/85 border-2 border-white/20 hover:border-pink-300 flex flex-col items-center text-center cursor-pointer hover:scale-105 active:scale-95 transition-all shadow-md group"
          >
            <span className="text-4xl mb-1 group-hover:rotate-12 transition-transform">🧸</span>
            <span className="font-headline font-bold text-xs text-white">Snuggle Bear</span>
            <span className="text-[10px] text-[#FFEAA7] font-bold mt-0.5">
              {snuggleCount > 0 ? `${snuggleCount} Hugs!` : 'Click to Hug!'}
            </span>
          </div>

          {/* Toy 3: Starlight Lantern */}
          <div
            onClick={() => handleToyClick('lantern')}
            className="p-4 rounded-2xl bg-[#2D1B4E]/85 border-2 border-white/20 hover:border-pink-300 flex flex-col items-center text-center cursor-pointer hover:scale-105 active:scale-95 transition-all shadow-md group"
          >
            <span className="text-4xl mb-1 group-hover:scale-110 transition-transform">🏮</span>
            <span className="font-headline font-bold text-xs text-white">Cozy Lantern</span>
            <span className="text-[10px] text-[#FFEAA7] font-bold mt-0.5">Click to Glow!</span>
          </div>

          {/* Toy 4: Unicorn Music Box */}
          <div
            onClick={() => handleToyClick('unicorn')}
            className="p-4 rounded-2xl bg-[#2D1B4E]/85 border-2 border-white/20 hover:border-pink-300 flex flex-col items-center text-center cursor-pointer hover:scale-105 active:scale-95 transition-all shadow-md group"
          >
            <span className="text-4xl mb-1 group-hover:animate-spin">🦄</span>
            <span className="font-headline font-bold text-xs text-white">Unicorn Box</span>
            <span className="text-[10px] text-[#FFEAA7] font-bold mt-0.5">Wind &amp; Play!</span>
          </div>
        </div>

        {/* 3. Wobbling Wooden Letter Blocks */}
        <div className="bg-[#2D1B4E]/90 p-4 rounded-2xl border-2 border-[#FFEAA7]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">🧱</span>
            <div>
              <span className="font-headline font-bold text-xs text-white block">
                Pip's Dancing Alphabet Blocks
              </span>
              <span className="text-[10px] text-purple-200">
                Tap any block to watch it dance and play wooden xylophone notes!
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {[
              { l: 'P', n: 'C4' },
              { l: 'I', n: 'E4' },
              { l: 'P', n: 'G4' },
              { l: '★', n: 'C5' },
            ].map(({ l, n }, idx) => (
              <button
                key={idx}
                onClick={() => toggleBlockWobble(idx, n, l)}
                style={{ transform: `translateY(${blockOffsets[idx]}px)` }}
                className="w-11 h-11 rounded-2xl bg-gradient-to-b from-[#FFEAA7] to-[#ffd778] text-[#5f4200] font-display font-extrabold text-base border-2 border-[#f7b731] shadow-md transition-transform duration-200 cursor-pointer flex items-center justify-center hover:scale-115 active:scale-90"
              >
                {l}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 2: MAGICAL DESTINATIONS (Children's Interactive Story & Game Hubs) */}
      <section className="w-full grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Illustrated Bedtime Storybook */}
        <div className="bg-[#231538]/85 backdrop-blur-md rounded-3xl p-6 border-2 border-[#69519A]/50 text-white shadow-xl flex flex-col justify-between group hover:border-pink-300 transition-all">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-[#69519A] text-white flex items-center justify-center text-2xl shadow-md mb-3 group-hover:scale-110 transition-transform">
              📖
            </div>
            <span className="text-[10px] uppercase font-bold text-[#FFEAA7] tracking-wider block mb-1">
              Illustrated Picture Book
            </span>
            <h3 className="font-display font-bold text-xl text-white">
              Pip’s Bedtime Storybook
            </h3>
            <p className="text-xs text-purple-200 mt-2 leading-relaxed">
              Read how Pip the Skull Baby was born from a sleepy star, crafted his nightcap, and began weaving peaceful dreams for children all over the world.
            </p>
          </div>
          <button
            onClick={() => onSelectTab('bedtime-storybook')}
            className="mt-4 w-full py-2.5 rounded-full bg-[#69519A] hover:bg-[#553D85] text-white font-headline font-bold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5 active:scale-95"
          >
            <span>Open Storybook</span>
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </button>
        </div>

        {/* Card 2: Dreamcatcher Arcade Mini-Game */}
        <div className="bg-[#231538]/85 backdrop-blur-md rounded-3xl p-6 border-2 border-[#FFEAA7]/40 text-white shadow-xl flex flex-col justify-between group hover:border-amber-300 transition-all">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-[#F7B731] text-[#2B1800] flex items-center justify-center text-2xl shadow-md mb-3 group-hover:scale-110 transition-transform">
              🎮
            </div>
            <span className="text-[10px] uppercase font-bold text-[#FFEAA7] tracking-wider block mb-1">
              Playable Star Game
            </span>
            <h3 className="font-display font-bold text-xl text-white">
              Dreamcatcher Arcade
            </h3>
            <p className="text-xs text-purple-200 mt-2 leading-relaxed">
              Fly with Pip across the starry night! Catch glowing golden dream stars, avoid sleepy nightmare moths, and unlock high scores!
            </p>
          </div>
          <button
            onClick={() => onSelectTab('dreamcatcher-arcade')}
            className="mt-4 w-full py-2.5 rounded-full bg-[#F7B731] hover:bg-[#E6A51D] text-[#2B1800] font-headline font-bold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5 active:scale-95"
          >
            <span>Play Star Arcade</span>
            <span className="material-symbols-outlined text-sm">sports_esports</span>
          </button>
        </div>

        {/* Card 3: The Mushroom Workshop (AI Inventions) */}
        <div className="bg-[#231538]/85 backdrop-blur-md rounded-3xl p-6 border-2 border-[#FFB0C8]/40 text-white shadow-xl flex flex-col justify-between group hover:border-pink-300 transition-all">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-[#80244A] text-white flex items-center justify-center text-2xl shadow-md mb-3 group-hover:scale-110 transition-transform">
              🛠️
            </div>
            <span className="text-[10px] uppercase font-bold text-[#FFB0C8] tracking-wider block mb-1">
              Dream Lab &amp; Workshop
            </span>
            <h3 className="font-display font-bold text-xl text-white">
              Dream Inventions Lab
            </h3>
            <p className="text-xs text-purple-200 mt-2 leading-relaxed">
              Explore Pip's whimsical inventions: the Starlight Slipper, Cotton Candy Cloud Machine, and use the AI Dream Forge to invent your own toys!
            </p>
          </div>
          <button
            onClick={() => onSelectTab('dream-inventions')}
            className="mt-4 w-full py-2.5 rounded-full bg-[#80244A] hover:bg-[#6C1B3D] text-white font-headline font-bold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5 active:scale-95"
          >
            <span>Explore Workshop</span>
            <span className="material-symbols-outlined text-sm">toys</span>
          </button>
        </div>
      </section>

      {/* SECTION 3: OFFICIAL DREAMER CREDENTIALS & IMAGEN MEDALLION */}
      <DreamerProfileSection
        dreamCount={dreamCount}
        onIncrementDreams={onIncrementDreams}
        onSelectTab={onSelectTab}
      />

      {/* SECTION 4: SLEEPY WISHES & SUGGESTIONS HUB */}
      <SuggestionsHub onIncrementDreams={onIncrementDreams} />
    </div>
  );
};
