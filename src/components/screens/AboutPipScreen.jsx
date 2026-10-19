import React, { useState } from 'react';
import {
  playChimeNote,
  playEasterEggChime,
  playTone,
  playLanternResonance,
} from '../../utils/audio.js';
import { triggerStarConfetti } from '../SparkleCanvas.jsx';
import { DreamerProfileSection } from '../DreamerProfileSection.jsx';
import { BADGE_IMAGE_PATH, getMilestoneInfo } from '../../utils/badge.js';

export const AboutPipScreen = ({
  onSelectTab,
  onIncrementDreams,
  dreamCount = 1204,
}) => {
  const milestone = getMilestoneInfo(dreamCount);
  const [bowTapped, setBowTapped] = useState(false);
  const [speechBubbleText, setSpeechBubbleText] = useState(
    '*Teehee!* Pip blinks his amber lights warmly and adjusts his little pink bow.'
  );

  const [glowValue, setGlowValue] = useState(75);
  const [selectedItemKey, setSelectedItemKey] = useState('lantern');

  const tickleGiggles = [
    '*Hehehe!* Pip giggles and wiggles his tiny skull ears!',
    "*Aww!* Pip's bow fluttered and released tiny lavender sparkles!",
    '*Snort-giggle!* Pip nearly dropped his brass lantern from smiling!',
    '*Chime!* Pip softly claps his mitten hands and rolls in his moon cloud!',
    '*Yawn-giggle!* Pip snuggles deeper into his fleece flannel nightcap!',
  ];

  const handleTickleBow = () => {
    setBowTapped(true);
    playEasterEggChime();
    triggerStarConfetti();
    onIncrementDreams?.();
    const nextQuote = tickleGiggles[Math.floor(Math.random() * tickleGiggles.length)];
    setSpeechBubbleText(nextQuote);
    setTimeout(() => setBowTapped(false), 600);
  };

  const inventoryItems = {
    lantern: {
      title: 'Brass Star-Stamped Lantern',
      badge: 'Safety Rated 10/10',
      category: 'STARDUST',
      icon: 'light',
      action: 'Test Starlight Chime',
      desc: 'Crafted with perforated star patterns that cast tiny constellation silhouettes on bedroom ceilings. The stardust inside is gently captured from the tail of sleepy comets and never gets hot to the touch.',
      note: 'C5',
    },
    musicbox: {
      title: 'Chime Music Box',
      badge: 'Plays Pentatonic Key',
      category: 'LULLABY',
      icon: 'music_note',
      action: 'Play 5-Note Chime',
      desc: 'Equipped with a tiny pastel unicorn winding handle. Plays soothing, repeating lullaby cycles scientifically tuned to match the breathing cadence of sleeping kits and ghostlings.',
      note: 'G4',
    },
    pillow: {
      title: 'Moon Fluff Pillow',
      badge: '100% Drool-Proof',
      category: 'COMFORT',
      icon: 'cloud',
      action: 'Fluff the Pillow',
      desc: 'Downy emergency pillow for sudden nursery nap attacks. Harvested gently from cloud rims drifting past midnight chimneys. Never clumps and always cool on both sides.',
      note: 'E4',
    },
    bows: {
      title: 'Spare Velvet Bows',
      badge: 'Cotton-Candy Grade',
      category: 'ACCESSORY',
      icon: 'redeem',
      action: 'Swap Ribbon Color',
      desc: "A neat velvet bundle of interchangeable nightcap bows. Colors include Cotton-Candy Pink, Lavender Mist, and Buttercup Amber to suit Pip's hourly bedtime mood.",
      note: 'D4',
    },
    quill: {
      title: 'Blueberry Ink Quill',
      badge: 'Edible & Safe',
      category: 'SCHEMATICS',
      icon: 'edit',
      action: 'Draft New Blueprint',
      desc: "Non-toxic bedtime quill for doodling dream blueprints. Whittled from a friendly barn owl's shed feather with deep violet organic blueberry ink.",
      note: 'A4',
    },
  };

  const currentItem = inventoryItems[selectedItemKey] || inventoryItems.lantern;

  const handleInspect = (key) => {
    setSelectedItemKey(key);
    playChimeNote(inventoryItems[key]?.note || 'C5', 0.5);
  };

  const handleActionClick = () => {
    playChimeNote(currentItem.note, 0.8);
    playTone(783.99, 'triangle', 0.4);
  };

  return (
    <div className="w-full flex flex-col gap-10 lg:gap-14 text-white">
      {/* Top Dossier Breadcrumb Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-[#231538]/90 backdrop-blur-md p-6 sm:p-8 shadow-2xl border-2 border-[#69519A]/40">
        <div className="absolute -top-12 -right-12 w-56 h-56 rounded-full bg-pink-500/10 blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-16 -left-12 w-48 h-48 rounded-full bg-purple-500/10 blur-2xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex flex-col gap-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#80244A] text-white text-[11px] font-bold border border-pink-400/40">
                <span className="material-symbols-outlined text-[13px] sm:text-[14px]">description</span>
                📄 about_me.txt · OFFICIAL CANON DOSSIER
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#1A1028] text-[#FFEAA7] text-[11px] border border-white/10 font-bold">
                <span className="material-symbols-outlined text-[12px] text-[#F7B731]">stars</span>
                VERIFIED BABY ARCHITECT
              </span>
            </div>

            <h1 className="font-display font-bold text-2xl sm:text-4xl text-pink-300 tracking-tight mt-1">
              Meet Pip: Junior Dream Engineer
            </h1>
            <p className="text-xs sm:text-base text-purple-200 leading-relaxed font-sans">
              The tiny porcelain skull baby in fleece pajamas who weaves lullabies and keeps the midnight nursery safe.
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <div className="px-3 py-1 rounded-full bg-[#1A1028] text-purple-200 text-[11px] sm:text-xs font-semibold flex items-center gap-1.5 border border-white/10">
                <span className="material-symbols-outlined text-sm text-pink-300">child_care</span>
                <span className="text-purple-300 font-normal">Age:</span> Baby
              </div>
              <div className="px-3 py-1 rounded-full bg-[#1A1028] text-purple-200 text-[11px] sm:text-xs font-semibold flex items-center gap-1.5 border border-white/10">
                <span className="material-symbols-outlined text-sm text-purple-300">sentiment_satisfied</span>
                <span className="text-purple-300 font-normal">Species:</span> Skull Baby
              </div>
              <div className="px-3 py-1 rounded-full bg-[#1A1028] text-purple-200 text-[11px] sm:text-xs font-semibold flex items-center gap-1.5 border border-white/10">
                <span className="material-symbols-outlined text-sm text-[#F7B731]">favorite</span>
                <span className="text-purple-300 font-normal">Mood:</span> Snuggly
              </div>
              <div className="px-3 py-1 rounded-full bg-[#80244A]/50 text-[#FFEAA7] text-[11px] sm:text-xs font-semibold flex items-center gap-1 border border-pink-400/30">
                <span className="italic">“I build the dreams you fall asleep inside.”</span>
              </div>
            </div>
          </div>

          <div className="bg-[#1A1028]/95 p-4 sm:p-5 rounded-2xl shadow-xl flex flex-col items-center text-center w-full md:w-auto min-w-[230px] border border-white/10">
            <div className="relative mb-2">
              <img
                src={BADGE_IMAGE_PATH}
                alt="Dream Engineer Badge Medallion"
                referrerPolicy="no-referrer"
                className={`w-16 h-16 rounded-full object-cover shadow-sm p-0.5 bg-[#2D1B4E] ${
                  milestone.isUnlocked ? 'ring-2 ring-[#F7B731]' : 'ring-1 ring-pink-400/40 opacity-80'
                }`}
              />
              <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#80244A] text-[#FFEAA7] flex items-center justify-center text-[10px] shadow-xs">
                ★
              </span>
            </div>
            <span className="text-[10px] text-purple-300 mb-0.5 flex items-center gap-1 font-bold">
              <span className="material-symbols-outlined text-xs text-[#F7B731]">verified</span>
              OFFICIAL NURSERY BADGE
            </span>
            <div className="font-display font-bold text-base text-pink-300">Dream Engineer</div>
            <span className="text-[11px] text-purple-200 mt-0.5">
              {milestone.isUnlocked ? '✨ Conferred to Your Profile!' : `${milestone.needed} dreams to earn`}
            </span>
            <div className="mt-2.5 pt-2 flex items-center gap-2 border-t border-white/10 w-full justify-center">
              <span className="w-2 h-2 rounded-full bg-[#F7B731] animate-ping"></span>
              <span className="text-xs font-bold text-[#FFEAA7]">
                {dreamCount.toLocaleString()} Dreams Logged
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 5-Point Character Sheet & Portrait Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Portrait Showcase */}
        <div className="lg:col-span-5 flex flex-col gap-5">
          <div className="relative bg-[#231538]/90 backdrop-blur-md rounded-3xl p-5 shadow-2xl flex flex-col items-center text-center border-2 border-[#69519A]/40">
            <div className="w-full flex items-center justify-between mb-2">
              <span className="px-3 py-1 rounded-full bg-[#80244A] text-white text-[10px] flex items-center gap-1 shadow-xs font-bold border border-pink-400/30">
                <span className="material-symbols-outlined text-xs">photo_camera</span>
                PORTRAIT A-01
              </span>

              <button
                onClick={handleTickleBow}
                className="group flex items-center gap-1 px-3 py-1 rounded-full bg-[#1A1028] text-[#FFEAA7] shadow-xs hover:bg-[#2D1B4E] transition-all active:scale-95 border border-white/10 cursor-pointer"
                title="Tickle Pip's Bow for a giggly chime!"
              >
                <span className="material-symbols-outlined text-[#F7B731] text-xs group-hover:rotate-12 transition-transform">
                  redeem
                </span>
                <span className="text-[10px] font-bold">Tickle Bow!</span>
              </button>
            </div>

            <div className="relative w-full max-w-[340px] aspect-[4/5] rounded-3xl overflow-hidden my-2 bg-[#160B24] flex items-center justify-center shadow-inner border border-white/10">
              <img
                alt="Pip the Skull Baby sitting comfortably on a soft cloud"
                className={`w-full h-full object-cover transition-transform duration-500 ${
                  bowTapped ? 'scale-110 rotate-1' : 'hover:scale-105'
                }`}
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAr9olVW1sud8ZDtxAmXBU1LnP8YztfzOcBddBzq--HPfFeMQhBXYy5alZJa7rCZ1AkWM3ev345qE8oqCLkFCh9B_A5iNrNKGI53uWnzJEivIpLrdBz-hjtO8fUIJFytXoV4KsFuYOWXT_Lnflijyc_2SzpnaF6kdTj0NdiAFsz3cFKLgcMdIF-6K8ahPc1B1LprxerAIvSAr_WlKRQoTffhb7vkNgIsedLeVjifXNQAIkzzp30DmFyib2rVK3sPgZouQ"
              />

              <div
                className="pointer-events-none absolute inset-0 bg-radial from-[#FFEAA7]/40 via-transparent to-transparent transition-opacity duration-300"
                style={{ opacity: (glowValue / 100) * 0.9 }}
              ></div>

              <div className="absolute bottom-3 inset-x-3 bg-[#1A1028]/90 backdrop-blur-md py-1.5 px-3 rounded-full flex items-center justify-between text-left shadow-sm border border-white/10">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[#F7B731] text-sm">bedtime</span>
                  <span className="text-[10px] text-purple-200 font-bold">CLOUD POD 07 · FLUFFY TIER</span>
                </div>
                <span className="text-xs text-[#FFEAA7] font-bold">100% Cozy</span>
              </div>
            </div>

            <div className="w-full mt-3 p-3 bg-[#1A1028]/90 rounded-2xl text-center min-h-[46px] flex items-center justify-center border border-white/10 shadow-inner">
              <p className="font-display font-semibold text-xs sm:text-sm text-pink-300">
                {speechBubbleText}
              </p>
            </div>

            <div className="w-full mt-3 bg-[#1A1028]/90 p-3.5 rounded-2xl flex flex-col gap-2 border border-white/10">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-purple-300 flex items-center gap-1 font-bold">
                  <span className="material-symbols-outlined text-xs text-[#F7B731]">light_mode</span>
                  Pip's Eye-Socket Glow
                </span>
                <span className="text-[10px] text-[#FFEAA7] font-bold">
                  {glowValue}% Warmth
                </span>
              </div>
              <input
                type="range"
                min="20"
                max="100"
                value={glowValue}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setGlowValue(val);
                  playLanternResonance(val);
                }}
                className="w-full accent-[#F7B731] h-2 bg-[#2D1B4E] rounded-lg cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Right: 5-Point Canon Dossier & Tool Inventory */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="bg-[#231538]/90 backdrop-blur-md rounded-3xl p-6 sm:p-7 shadow-2xl border-2 border-[#69519A]/40 flex flex-col gap-4">
            <h3 className="font-display font-bold text-xl text-pink-300 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#FFEAA7]">verified</span>
              The 5-Point Character Sheet
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-4 rounded-2xl bg-[#1A1028]/90 border border-white/10 shadow-inner">
                <span className="text-[10px] text-pink-300 font-bold uppercase block mb-1">
                  1. Visual Anatomy
                </span>
                <p className="text-purple-200 leading-relaxed font-sans">
                  Smooth round porcelain skull, glowing amber eye pinpricks, nightcap with star tassels and a pink bow.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#1A1028]/90 border border-white/10 shadow-inner">
                <span className="text-[10px] text-pink-300 font-bold uppercase block mb-1">
                  2. Personality Quirk
                </span>
                <p className="text-purple-200 leading-relaxed font-sans">
                  Snort-giggles when happy, yawns when thinking deeply, easily delighted by gentle music boxes.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#1A1028]/90 border border-white/10 shadow-inner">
                <span className="text-[10px] text-pink-300 font-bold uppercase block mb-1">
                  3. Key Equipment
                </span>
                <p className="text-purple-200 leading-relaxed font-sans">
                  Brass star-stamped lantern, pentatonic chime box, moon fluff emergency pillow, spare ribbons.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#1A1028]/90 border border-white/10 shadow-inner">
                <span className="text-[10px] text-pink-300 font-bold uppercase block mb-1">
                  4. The Rule of Cozy
                </span>
                <p className="text-purple-200 leading-relaxed font-sans">
                  100% gentle and friendly. Pip’s workshop strictly disallows scary, spooky, or noisy contraptions.
                </p>
              </div>

              <div className="sm:col-span-2 p-4 rounded-2xl bg-[#80244A]/30 border border-pink-400/30">
                <span className="text-[10px] text-[#FFEAA7] font-bold uppercase block mb-1">
                  5. Nursery Mission
                </span>
                <p className="text-purple-100 leading-relaxed font-sans">
                  Ensuring all frightened kits, restless hedgehogs, and midnight wanderers snooze soundly until the sun rises.
                </p>
              </div>
            </div>
          </div>

          {/* Interactive Tool Bag Inspector */}
          <div className="bg-[#231538]/90 backdrop-blur-md rounded-3xl p-6 sm:p-7 shadow-2xl border-2 border-[#69519A]/40 flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-display font-bold text-base text-pink-300 flex items-center gap-2">
                <span className="material-symbols-outlined text-[#F7B731]">backpack</span>
                Pip’s Tool Bag &amp; Sleep Inventory
              </h3>
              <span className="text-[10px] font-bold text-white bg-[#80244A] px-3 py-0.5 rounded-full border border-pink-400/40">
                Interactive Chimes
              </span>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
              {Object.keys(inventoryItems).map((key) => {
                const itm = inventoryItems[key];
                return (
                  <button
                    key={key}
                    onClick={() => handleInspect(key)}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer border ${
                      selectedItemKey === key
                        ? 'bg-[#80244A] text-white border-pink-300 shadow-md scale-105'
                        : 'bg-[#1A1028] hover:bg-[#2D1B4E] text-purple-200 border-white/10'
                    }`}
                  >
                    <span className="material-symbols-outlined text-sm">{itm.icon}</span>
                    <span>{itm.title.split(' ')[0]}</span>
                  </button>
                );
              })}
            </div>

            <div className="bg-[#1A1028]/90 p-5 rounded-2xl border border-white/10 shadow-inner flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <h4 className="font-display font-bold text-sm text-[#FFEAA7]">
                  {currentItem.title}
                </h4>
                <span className="text-[10px] font-bold text-purple-200 bg-[#2D1B4E] px-2.5 py-0.5 rounded-full border border-white/10">
                  {currentItem.badge}
                </span>
              </div>
              <p className="text-xs text-purple-200 leading-relaxed font-sans">{currentItem.desc}</p>
              <button
                onClick={handleActionClick}
                className="self-start mt-1 px-4 py-1.5 bg-[#80244A] hover:bg-[#9e3c62] text-white text-xs font-bold rounded-full shadow-md transition-all cursor-pointer active:scale-95 border border-pink-400/30"
              >
                {currentItem.action}
              </button>
            </div>
          </div>
        </div>
      </div>

      <DreamerProfileSection
        dreamCount={dreamCount}
        onIncrementDreams={onIncrementDreams}
        onSelectTab={onSelectTab}
      />
    </div>
  );
};
