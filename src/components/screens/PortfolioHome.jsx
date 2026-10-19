import React, { useState, useEffect } from 'react';
import {
  playChimeNote,
  playMelody,
  playEasterEggChime,
  playLanternResonance,
  playWoodBlockSound,
} from '../../utils/audio.js';
import { triggerStarConfetti } from '../SparkleCanvas.jsx';
import { SuggestionsHub } from '../SuggestionsHub.jsx';
import { DreamerProfileSection } from '../DreamerProfileSection.jsx';
import { PipInteractivePortrait } from '../PipInteractivePortrait.jsx';
import { DreamDeliveryScrollMap } from '../DreamDeliveryScrollMap.jsx';
import { trackVisitorArrival } from '../../utils/badge.js';

export const PortfolioHome = ({
  onSelectTab,
  onIncrementDreams,
  dreamCount,
  mood = 'day',
  onOpenChat,
}) => {
  const [isPlayingLullaby, setIsPlayingLullaby] = useState(false);
  const [activeNote, setActiveNote] = useState(null);
  const [glowValue, setGlowValue] = useState(50);
  const [blockOffsets, setBlockOffsets] = useState({ 0: 0, 1: 0, 2: 0, 3: 0 });
  const [bowTapped, setBowTapped] = useState(false);
  const [visitorGreeting, setVisitorGreeting] = useState('');

  useEffect(() => {
    const memory = trackVisitorArrival();
    setVisitorGreeting(memory.customGreeting);
  }, []);

  const handleChimeTap = (note) => {
    setActiveNote(note);
    playChimeNote(note, 0.7);
    setTimeout(() => setActiveNote(null), 300);
  };

  const handlePlayFullMelody = () => {
    if (isPlayingLullaby) return;
    setIsPlayingLullaby(true);
    const melody = [
      { note: 'C4', d: 380 },
      { note: 'E4', d: 380 },
      { note: 'G4', d: 480 },
      { note: 'A4', d: 580 },
      { note: 'G4', d: 380 },
      { note: 'E4', d: 800 },
    ];
    playMelody(melody, () => {
      setIsPlayingLullaby(false);
    });
  };

  const handleBowTap = () => {
    setBowTapped(true);
    playEasterEggChime();
    triggerStarConfetti();
    onIncrementDreams();
    setTimeout(() => setBowTapped(false), 800);
  };

  const toggleBlockWobble = (index, note) => {
    playWoodBlockSound(240 + index * 50);
    setTimeout(() => playChimeNote(note, 0.4), 30);
    setBlockOffsets((prev) => ({
      ...prev,
      [index]: prev[index] === 0 ? (index % 2 === 0 ? -8 : 8) : 0,
    }));
  };

  return (
    <div className="w-full flex flex-col gap-12 lg:gap-16">
      {/* Returning Visitor Personalized Greeting Banner (Tier 3) */}
      {visitorGreeting && (
        <div className="bg-gradient-to-r from-[#FFE3E8] via-[#FFF9F2] to-[#FFFAEB] border border-[#ffd9e2] rounded-2xl p-3.5 shadow-xs flex items-center justify-between gap-3 text-xs text-[#80244a] animate-in fade-in duration-300">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-lg text-[#F7B731]">
              mark_chat_unread
            </span>
            <span className="font-medium">{visitorGreeting}</span>
          </div>
          <button
            onClick={() => onOpenChat?.()}
            className="shrink-0 px-3 py-1 bg-[#80244a] hover:bg-[#6c1b3d] text-white rounded-full font-bold text-[11px] shadow-2xs transition-all cursor-pointer"
          >
            Reply to Pip
          </button>
        </div>
      )}

      {/* SECTION 1: HERO SECTION & CANON IDENTITY */}
      <section className="w-full flex flex-col pt-2">
        {/* Top Status Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div className="inline-flex items-center gap-2 bg-[#f4e4ec]/90 px-3 sm:px-4 py-1.5 rounded-full shadow-xs border border-[#F3E8DC] self-start">
            <span className="material-symbols-outlined text-base sm:text-lg text-[#80244a] animate-bounce shrink-0">
              auto_awesome
            </span>
            <span className="font-label-caps text-[#80244a] tracking-wider uppercase text-[10px] sm:text-xs">
              <span className="hidden sm:inline">Midnight Nursery Archive · </span>Junior Dream Division
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1 bg-[#FFFAEB] rounded-full ring-1 ring-[#FFEAA7] shadow-xs">
              <span className="w-2 h-2 rounded-full bg-[#F7B731] animate-ping shrink-0"></span>
              <span className="text-[10px] sm:text-[11px] font-bold text-[#5f4200] tracking-wider uppercase">
                <span className="hidden xs:inline">Status: </span>Tinkering with Starlight
              </span>
            </div>

            <div className="flex items-center gap-1 sm:gap-1.5 bg-[#eedee6] px-2.5 sm:px-3 py-1 rounded-full shadow-inner">
              <span className="text-[9px] sm:text-[10px] font-bold text-[#544247] uppercase tracking-wider">Dreams:</span>
              <span className="font-headline font-bold text-xs sm:text-sm text-[#80244a] tracking-wider font-mono">
                {dreamCount.toString().padStart(6, '0').replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              </span>
              <span className="material-symbols-outlined text-[#F7B731] text-[12px]">star</span>
            </div>
          </div>
        </div>

        {/* Hero Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left: Interactive Character Showcase Card */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 shadow-md flex flex-col items-center justify-between text-center relative overflow-hidden group border border-[#F3E8DC]">
            <div className="w-full flex items-center justify-between mb-2">
              <span className="text-[10px] uppercase font-bold text-[#69519a] bg-[#EDE7F6] px-2.5 py-0.5 rounded-full">
                Interactive Portrait
              </span>
              <span className="text-[11px] font-semibold text-[#80244a] bg-[#FFE3E8] px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <span className="material-symbols-outlined text-xs">auto_awesome</span>
                Hover & Tap Bow
              </span>
            </div>

            {/* Character Viewport (Pure Cute 2D Interactive Portrait) */}
            <PipInteractivePortrait
              mood={mood}
              bowTapped={bowTapped}
              onBowTap={handleBowTap}
            />

            {/* Card Inner Bottom Details */}
            <div className="w-full pt-3 flex flex-col items-center">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFE3E8] text-[#80244a] text-[11px] uppercase tracking-wider mb-2 font-bold">
                <span className="material-symbols-outlined text-xs">favorite</span> Cute · Gentle · Never Scary
              </div>
              <h2 className="font-headline font-bold text-2xl text-[#3F2837]">Pip</h2>
              <p className="text-xs text-[#62535F] max-w-[240px]">
                Junior Dream Engineer at Midnight Nursery
              </p>
            </div>
          </div>

          {/* Right: Canon Identity Spec Sheet */}
          <div className="lg:col-span-7 bg-[#FFF9F2] rounded-3xl p-6 lg:p-8 shadow-md flex flex-col justify-between border border-[#F3E8DC]">
            <div className="flex flex-col gap-4">
              <div>
                <span className="text-xs text-[#69519a] uppercase tracking-widest block mb-1 font-bold">
                  Official Character Dossier · Dream Engineer
                </span>
                <h1 className="font-headline font-bold text-3xl sm:text-4xl text-[#3F2837] tracking-tight">
                  Pip the Skull Baby
                </h1>
                <p className="text-base sm:text-lg text-[#80244a] font-semibold italic mt-1">
                  “I build the dreams you fall asleep inside.”
                </p>
              </div>

              {/* Identity Specs Breakdown */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="bg-white/95 p-4 rounded-xl shadow-xs border border-[#F3E8DC]">
                  <span className="text-[10px] text-[#544247] uppercase block mb-1 font-bold">
                    What Pip Is
                  </span>
                  <p className="text-xs sm:text-sm text-[#62535F] leading-relaxed">
                    A cute baby with a smooth round skull face, huge soft eye sockets with cozy glowing pinpricks of amber light, a tiny crooked smile, and a nightcap with stars and a little pink bow.
                  </p>
                </div>

                <div className="bg-white/95 p-4 rounded-xl shadow-xs border border-[#F3E8DC]">
                  <span className="text-[10px] text-[#544247] uppercase block mb-1 font-bold">
                    Personality
                  </span>
                  <p className="text-xs sm:text-sm text-[#62535F] leading-relaxed">
                    Curious, sleepy, a little clumsy, easily delighted. Giggles at quiet rustles and absolutely hates uncomfortable silence!
                  </p>
                </div>

                <div className="bg-white/95 p-4 rounded-xl shadow-xs border border-[#F3E8DC]">
                  <span className="text-[10px] text-[#544247] uppercase block mb-1 font-bold">
                    Profession
                  </span>
                  <p className="text-xs sm:text-sm text-[#62535F] leading-relaxed">
                    Junior Dream Engineer at the Midnight Nursery. Pip crafts sweet nightlights, lullabies, and star trails for midnight wanderers.
                  </p>
                </div>

                <div className="bg-white/95 p-4 rounded-xl shadow-xs border border-[#F3E8DC]">
                  <span className="text-[10px] text-[#544247] uppercase block mb-1 font-bold">
                    Night Nursery Mission
                  </span>
                  <p className="text-xs sm:text-sm text-[#62535F] leading-relaxed">
                    Ensuring frightened kittens, shy ghosts, and storm-nervous pups snooze safely until morning dawn.
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom Action Deck */}
            <div className="grid grid-cols-1 xs:grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 sm:gap-2.5 pt-4 mt-4 border-t border-[#eedee6]/60">
              <button
                onClick={() => onSelectTab('dream-inventions')}
                className="w-full sm:w-auto px-4 py-2 rounded-full bg-[#9e3c62] text-white font-semibold text-xs shadow-xs hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[17px]">toys</span>
                <span>Explore Dream Lab</span>
              </button>
              <button
                onClick={() => onSelectTab('dreamcatcher-arcade')}
                className="w-full sm:w-auto px-4 py-2 rounded-full bg-[#FFFAEB] text-[#5f4200] font-semibold text-xs shadow-xs hover:bg-[#FFEAA7] ring-1 ring-[#FFEAA7] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[17px] text-[#F7B731]">sports_esports</span>
                <span>Play Star Mini-Game</span>
              </button>
              <button
                onClick={() => onSelectTab('bedtime-storybook')}
                className="w-full sm:w-auto px-4 py-2 rounded-full bg-[#EDE7F6] text-[#69519a] font-semibold text-xs shadow-xs hover:bg-[#F5F0FB] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[17px]">auto_stories</span>
                <span>Read Pip's Story</span>
              </button>
              <button
                onClick={() => onSelectTab('about-pip')}
                className="w-full sm:w-auto px-4 py-2 rounded-full bg-white text-[#544247] font-semibold text-xs shadow-xs hover:text-[#80244a] border border-[#F3E8DC] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[17px]">badge</span>
                <span>5-Point Spec Sheet</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: SCROLL-SYNCED DREAM DELIVERY MAP (Tier 2 Standout) */}
      <section className="w-full">
        <DreamDeliveryScrollMap />
      </section>

      {/* SECTION 3: LULLABY LAB (Real Web Audio API Synth) */}
      <section className="w-full bg-white rounded-3xl p-6 sm:p-8 border border-[#F3E8DC] shadow-sm flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F3E8DC] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#80244a] text-2xl">music_note</span>
              <h3 className="font-headline font-bold text-xl text-[#3F2837]">
                Lullaby Lab &amp; Pentatonic Chime Box
              </h3>
            </div>
            <p className="text-xs text-[#62535F] mt-1">
              Tap notes to play Pip's custom music box tines. Perfectly tuned in C Pentatonic so every note combination sounds harmoniously soothing.
            </p>
          </div>

          <button
            onClick={handlePlayFullMelody}
            disabled={isPlayingLullaby}
            className="px-4 py-2 bg-[#80244a] hover:bg-[#6c1b3d] disabled:bg-stone-300 text-white font-bold text-xs rounded-full shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">
              {isPlayingLullaby ? 'hourglass_top' : 'play_arrow'}
            </span>
            <span>{isPlayingLullaby ? 'Playing Lullaby...' : 'Play Star Melody'}</span>
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {['C4', 'E4', 'G4', 'A4', 'C5'].map((note) => (
            <button
              key={note}
              onClick={() => handleChimeTap(note)}
              className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center justify-center gap-1 cursor-pointer active:scale-95 ${
                activeNote === note
                  ? 'bg-[#FFE3E8] border-[#80244a] text-[#80244a] scale-105 shadow-md'
                  : 'bg-[#FFFDF7] hover:bg-[#FFF9F2] border-[#F3E8DC] text-[#3F2837]'
              }`}
            >
              <span className="font-headline font-bold text-lg">{note}</span>
              <span className="text-[10px] text-stone-500 uppercase font-bold">Celesta Note</span>
            </button>
          ))}
        </div>

        {/* Wobbling Wooden Blocks */}
        <div className="bg-[#FFF9F2] p-4 rounded-2xl border border-[#F3E8DC] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#5f4200]">extension</span>
            <span className="text-xs font-bold text-[#3F2837]">
              Tactile Wooden Building Blocks (Click to Wobble)
            </span>
          </div>

          <div className="flex items-center gap-2">
            {[0, 1, 2, 3].map((idx) => {
              const notes = ['C4', 'E4', 'G4', 'C5'];
              return (
                <button
                  key={idx}
                  onClick={() => toggleBlockWobble(idx, notes[idx])}
                  style={{ transform: `translateY(${blockOffsets[idx]}px)` }}
                  className="w-10 h-10 rounded-xl bg-white hover:bg-[#FFE3E8] text-[#80244a] font-bold text-xs border border-[#F3E8DC] shadow-xs transition-transform duration-200 cursor-pointer flex items-center justify-center"
                >
                  {['P', 'I', 'P', '★'][idx]}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 4: USER DREAMER PROFILE & CREDENTIALS */}
      <DreamerProfileSection
        dreamCount={dreamCount}
        onIncrementDreams={onIncrementDreams}
        onSelectTab={onSelectTab}
      />

      {/* SECTION 5: SUGGESTIONS BOX */}
      <SuggestionsHub onIncrementDreams={onIncrementDreams} />
    </div>
  );
};
