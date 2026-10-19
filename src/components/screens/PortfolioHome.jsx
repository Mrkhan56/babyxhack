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
      />

      {/* SECTION 1: PIP'S INTERACTIVE TOY CHEST & MUSICAL PLAYROOM */}
      <section className="w-full bg-white rounded-3xl p-6 sm:p-8 border-2 border-[#FFE3E8] shadow-md flex flex-col gap-6 relative overflow-hidden">
        {/* Playful Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-[#F3E8DC] pb-4">
          <div className="flex items-center gap-3">
            <span className="w-12 h-12 rounded-2xl bg-[#FFE3E8] text-[#80244a] flex items-center justify-center text-2xl shadow-xs">
              🧸
            </span>
            <div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#3F2837] tracking-tight">
                Pip's Interactive Toybox &amp; Music Lab
              </h2>
              <p className="text-xs sm:text-sm text-[#62535F]">
                Tap the musical bells, wooden blocks, and toys to make sounds and play with Pip!
              </p>
            </div>
          </div>

          {/* Real-time toy feedback banner */}
          <div className="bg-[#FFFAEB] border border-[#FFEAA7] px-3.5 py-1.5 rounded-full text-xs font-headline font-bold text-[#5f4200] self-start sm:self-auto shadow-xs">
            {toyActionText}
          </div>
        </div>

        {/* 1. Rainbow Celesta Bell Keys */}
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <span className="font-headline font-bold text-xs uppercase tracking-wider text-[#80244a] flex items-center gap-1.5">
              <span>🎵</span>
              <span>Harmonious Pentatonic Chime Bells (Tap to Play!)</span>
            </span>
            <button
              onClick={handlePlayFullMelody}
              disabled={isPlayingLullaby}
              className="px-3.5 py-1.5 rounded-full bg-[#80244a] hover:bg-[#9e3c62] disabled:bg-stone-300 text-white font-headline font-bold text-xs shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>{isPlayingLullaby ? '⏳' : '▶'}</span>
              <span>{isPlayingLullaby ? 'Playing...' : 'Play Full Lullaby'}</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 sm:gap-3">
            {[
              { note: 'C4', name: 'Kitty Purr Bell', icon: '🐱', color: 'from-pink-100 to-rose-50 border-pink-300' },
              { note: 'E4', name: 'Puppy Chime', icon: '🐶', color: 'from-amber-100 to-yellow-50 border-amber-300' },
              { note: 'G4', name: 'Bunny Star', icon: '🐰', color: 'from-purple-100 to-indigo-50 border-purple-300' },
              { note: 'A4', name: 'Teddy Chime', icon: '🐻', color: 'from-blue-100 to-cyan-50 border-blue-300' },
              { note: 'C5', name: 'Unicorn Bell', icon: '🦄', color: 'from-emerald-100 to-teal-50 border-emerald-300' },
            ].map(({ note, name, icon, color }) => (
              <button
                key={note}
                onClick={() => handleChimeTap(note, name)}
                className={`p-3.5 sm:p-4 rounded-2xl border-2 transition-all flex flex-col items-center justify-center gap-1 cursor-pointer active:scale-95 shadow-xs bg-gradient-to-b ${color} ${
                  activeNote === note
                    ? 'scale-105 shadow-md ring-4 ring-[#80244a]/20'
                    : 'hover:scale-102 hover:shadow-sm'
                }`}
              >
                <span className="text-3xl sm:text-4xl">{icon}</span>
                <span className="font-display font-bold text-base sm:text-lg text-[#3F2837]">{note}</span>
                <span className="text-[10px] text-[#62535F] font-bold">{name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 2. Interactive Toy Carousel Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          {/* Toy 1: Marshmallow Cloud */}
          <div
            onClick={() => handleToyClick('cloud')}
            className="p-4 rounded-2xl bg-[#FFF9F2] border-2 border-[#F3E8DC] hover:border-[#80244a] flex flex-col items-center text-center cursor-pointer hover:scale-105 active:scale-95 transition-all shadow-xs group"
          >
            <span className="text-4xl mb-1 group-hover:animate-bounce">☁️</span>
            <span className="font-headline font-bold text-xs text-[#3F2837]">Cloud Machine</span>
            <span className="text-[10px] text-[#80244a] font-bold mt-0.5">Click to Puff!</span>
          </div>

          {/* Toy 2: Snuggle Bear */}
          <div
            onClick={() => handleToyClick('teddy')}
            className="p-4 rounded-2xl bg-[#FFF9F2] border-2 border-[#F3E8DC] hover:border-[#80244a] flex flex-col items-center text-center cursor-pointer hover:scale-105 active:scale-95 transition-all shadow-xs group"
          >
            <span className="text-4xl mb-1 group-hover:rotate-12 transition-transform">🧸</span>
            <span className="font-headline font-bold text-xs text-[#3F2837]">Snuggle Bear</span>
            <span className="text-[10px] text-[#80244a] font-bold mt-0.5">
              {snuggleCount > 0 ? `${snuggleCount} Hugs!` : 'Click to Hug!'}
            </span>
          </div>

          {/* Toy 3: Starlight Lantern */}
          <div
            onClick={() => handleToyClick('lantern')}
            className="p-4 rounded-2xl bg-[#FFF9F2] border-2 border-[#F3E8DC] hover:border-[#80244a] flex flex-col items-center text-center cursor-pointer hover:scale-105 active:scale-95 transition-all shadow-xs group"
          >
            <span className="text-4xl mb-1 group-hover:scale-110 transition-transform">🏮</span>
            <span className="font-headline font-bold text-xs text-[#3F2837]">Cozy Lantern</span>
            <span className="text-[10px] text-[#80244a] font-bold mt-0.5">Click to Glow!</span>
          </div>

          {/* Toy 4: Unicorn Music Box */}
          <div
            onClick={() => handleToyClick('unicorn')}
            className="p-4 rounded-2xl bg-[#FFF9F2] border-2 border-[#F3E8DC] hover:border-[#80244a] flex flex-col items-center text-center cursor-pointer hover:scale-105 active:scale-95 transition-all shadow-xs group"
          >
            <span className="text-4xl mb-1 group-hover:animate-spin">🦄</span>
            <span className="font-headline font-bold text-xs text-[#3F2837]">Unicorn Box</span>
            <span className="text-[10px] text-[#80244a] font-bold mt-0.5">Wind &amp; Play!</span>
          </div>
        </div>

        {/* 3. Wobbling Wooden Letter Blocks */}
        <div className="bg-[#FFFDF7] p-4 rounded-2xl border-2 border-[#FFEAA7] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">🧱</span>
            <div>
              <span className="font-headline font-bold text-xs text-[#3F2837] block">
                Pip's Dancing Alphabet Blocks
              </span>
              <span className="text-[10px] text-[#62535F]">
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
        <div className="bg-gradient-to-b from-[#EDE7F6] to-white rounded-3xl p-6 border-2 border-[#d2bbff] shadow-sm flex flex-col justify-between group hover:shadow-md transition-all">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-[#69519a] text-white flex items-center justify-center text-2xl shadow-xs mb-3 group-hover:scale-110 transition-transform">
              📖
            </div>
            <span className="text-[10px] uppercase font-bold text-[#69519a] tracking-wider block mb-1">
              Illustrated Picture Book
            </span>
            <h3 className="font-display font-bold text-xl text-[#3F2837]">
              Pip's Bedtime Storybook
            </h3>
            <p className="text-xs text-[#62535F] mt-2 leading-relaxed">
              Read how Pip the Skull Baby was born from a sleepy star, crafted his nightcap, and began weaving peaceful dreams for children all over the world.
            </p>
          </div>
          <button
            onClick={() => onSelectTab('bedtime-storybook')}
            className="mt-4 w-full py-2.5 rounded-full bg-[#69519a] hover:bg-[#553d85] text-white font-headline font-bold text-xs shadow-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 active:scale-95"
          >
            <span>Open Storybook</span>
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </button>
        </div>

        {/* Card 2: Dreamcatcher Arcade Mini-Game */}
        <div className="bg-gradient-to-b from-[#FFFAEB] to-white rounded-3xl p-6 border-2 border-[#FFEAA7] shadow-sm flex flex-col justify-between group hover:shadow-md transition-all">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-[#F7B731] text-[#3e2400] flex items-center justify-center text-2xl shadow-xs mb-3 group-hover:scale-110 transition-transform">
              🎮
            </div>
            <span className="text-[10px] uppercase font-bold text-[#7d5800] tracking-wider block mb-1">
              Playable Star Game
            </span>
            <h3 className="font-display font-bold text-xl text-[#3F2837]">
              Dreamcatcher Arcade
            </h3>
            <p className="text-xs text-[#62535F] mt-2 leading-relaxed">
              Fly with Pip across the starry night! Catch glowing golden dream stars, avoid sleepy nightmare moths, and unlock high scores!
            </p>
          </div>
          <button
            onClick={() => onSelectTab('dreamcatcher-arcade')}
            className="mt-4 w-full py-2.5 rounded-full bg-[#f7b731] hover:bg-[#e6a51d] text-[#2b1800] font-headline font-bold text-xs shadow-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 active:scale-95"
          >
            <span>Play Star Arcade</span>
            <span className="material-symbols-outlined text-sm">sports_esports</span>
          </button>
        </div>

        {/* Card 3: The Mushroom Workshop (AI Inventions) */}
        <div className="bg-gradient-to-b from-[#FFE3E8] to-white rounded-3xl p-6 border-2 border-[#ffb0c8] shadow-sm flex flex-col justify-between group hover:shadow-md transition-all">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-[#80244a] text-white flex items-center justify-center text-2xl shadow-xs mb-3 group-hover:scale-110 transition-transform">
              🛠️
            </div>
            <span className="text-[10px] uppercase font-bold text-[#80244a] tracking-wider block mb-1">
              Dream Lab &amp; Workshop
            </span>
            <h3 className="font-display font-bold text-xl text-[#3F2837]">
              Dream Inventions Lab
            </h3>
            <p className="text-xs text-[#62535F] mt-2 leading-relaxed">
              Explore Pip's whimsical inventions: the Starlight Slipper, Cotton Candy Cloud Machine, and use the AI Dream Forge to invent your own toys!
            </p>
          </div>
          <button
            onClick={() => onSelectTab('dream-inventions')}
            className="mt-4 w-full py-2.5 rounded-full bg-[#80244a] hover:bg-[#6c1b3d] text-white font-headline font-bold text-xs shadow-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 active:scale-95"
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
