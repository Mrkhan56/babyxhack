import React, { useState } from 'react';
import {
  playChimeNote,
  playEasterEggChime,
  playTone,
  playLanternResonance,
  playBubblePopSound,
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
  const [activeQuestion, setActiveQuestion] = useState('q1');

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
    onIncrementDreams();
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

  const questionAnswers = {
    q1: {
      title: '"Are you scary in the dark, Pip?"',
      answer:
        '“Oh no no no! Never scary! I don\'t even have scary teeth—just smooth bone cheeks that love to be patted. When darkness comes, my eyes light up like tiny warm bedside nightlights so nobody bumps their sleepy toes.”',
    },
    q2: {
      title: '"How do you test floating cradle aerodynamics?"',
      answer:
        '“With downy goose feathers and a gentle hair-dryer set to warm breeze! We test each cradle until it sways at exactly 0.5 cycles per second. If a rubber duck falls out, we adjust the cloud cushions!”',
    },
    q3: {
      title: '"What is Pip\'s favorite midnight snack?"',
      answer:
        '“Warm vanilla oatmeal with two teaspoons of melted honey and crushed starlight sprinkles. It makes your tummy feel like a soft warm bath before bed!”',
    },
  };

  return (
    <div className="w-full flex flex-col gap-10 lg:gap-14">
      {/* Top Dossier Breadcrumb Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#faeaf2] via-white to-[#FFFAEB] p-6 sm:p-8 shadow-md border border-[#F3E8DC]">
        <div className="absolute -top-12 -right-12 w-56 h-56 rounded-full bg-[#FFEAA7]/40 blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-16 -left-12 w-48 h-48 rounded-full bg-[#FFE3E8]/50 blur-2xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex flex-col gap-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ffd9e2] text-[#7f234a] text-[10px] sm:text-xs font-bold">
                <span className="material-symbols-outlined text-[13px] sm:text-[14px]">auto_stories</span>
                OFFICIAL CANON DOSSIER · JUNIOR DREAM LAB
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FFFAEB] text-[#5f4200] text-[10px] sm:text-xs border border-[#FFEAA7] font-bold">
                <span className="material-symbols-outlined text-[12px] text-[#F7B731]">stars</span>
                VERIFIED BABY ARCHITECT
              </span>
            </div>

            <h1 className="font-headline font-bold text-2xl sm:text-4xl text-[#3F2837] tracking-tight mt-1">
              Meet Pip: Junior Dream Engineer
            </h1>
            <p className="text-xs sm:text-base text-[#62535F] leading-relaxed">
              The tiny porcelain skull baby in fleece pajamas who weaves lullabies and keeps the midnight nursery safe.
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <div className="px-3 py-1 rounded-full bg-white shadow-xs text-[#3F2837] text-[11px] sm:text-xs font-semibold flex items-center gap-1.5 border border-[#F3E8DC]">
                <span className="material-symbols-outlined text-sm text-[#80244a]">child_care</span>
                <span className="text-[#62535F] font-normal">Age:</span> Baby
              </div>
              <div className="px-3 py-1 rounded-full bg-white shadow-xs text-[#3F2837] text-[11px] sm:text-xs font-semibold flex items-center gap-1.5 border border-[#F3E8DC]">
                <span className="material-symbols-outlined text-sm text-[#69519a]">sentiment_satisfied</span>
                <span className="text-[#62535F] font-normal">Species:</span> Skull Baby
              </div>
              <div className="px-3 py-1 rounded-full bg-white shadow-xs text-[#3F2837] text-[11px] sm:text-xs font-semibold flex items-center gap-1.5 border border-[#F3E8DC]">
                <span className="material-symbols-outlined text-sm text-[#F7B731]">favorite</span>
                <span className="text-[#62535F] font-normal">Mood:</span> Snuggly
              </div>
              <div className="px-3 py-1 rounded-full bg-[#FFE3E8] text-[#80244a] text-[11px] sm:text-xs font-semibold flex items-center gap-1">
                <span className="italic">“I build the dreams you fall asleep inside.”</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-md flex flex-col items-center text-center w-full md:w-auto min-w-[230px] border border-[#F3E8DC]">
            <div className="relative mb-2">
              <img
                src={BADGE_IMAGE_PATH}
                alt="Dream Engineer Badge Medallion"
                referrerPolicy="no-referrer"
                className={`w-16 h-16 rounded-full object-cover shadow-sm p-0.5 bg-white ${
                  milestone.isUnlocked ? 'ring-2 ring-[#F7B731]' : 'ring-1 ring-[#ffd9e2] opacity-80'
                }`}
              />
              <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#80244a] text-[#FFEAA7] flex items-center justify-center text-[10px] shadow-xs">
                ★
              </span>
            </div>
            <span className="text-[10px] text-[#62535F] mb-0.5 flex items-center gap-1 font-bold">
              <span className="material-symbols-outlined text-xs text-[#F7B731]">verified</span>
              OFFICIAL NURSERY BADGE
            </span>
            <div className="font-headline font-bold text-base text-[#80244a]">Dream Engineer</div>
            <span className="text-[11px] text-[#62535F] mt-0.5">
              {milestone.isUnlocked ? '✨ Conferred to Your Profile!' : `${milestone.needed} dreams to earn`}
            </span>
            <div className="mt-2.5 pt-2 flex items-center gap-2 border-t border-[#eedee6] w-full justify-center">
              <span className="w-2 h-2 rounded-full bg-[#F7B731] animate-ping"></span>
              <span className="text-xs font-bold text-[#5f4200]">
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
          <div className="relative bg-white rounded-3xl p-5 shadow-md flex flex-col items-center text-center border border-[#F3E8DC]">
            <div className="w-full flex items-center justify-between mb-2">
              <span className="px-2.5 py-1 rounded-full bg-[#FFE3E8] text-[#80244a] text-[10px] flex items-center gap-1 shadow-xs font-bold">
                <span className="material-symbols-outlined text-xs">photo_camera</span>
                PORTRAIT A-01
              </span>

              <button
                onClick={handleTickleBow}
                className="group flex items-center gap-1 px-3 py-1 rounded-full bg-[#FFFAEB] text-[#5f4200] shadow-xs hover:bg-[#FFEAA7] transition-all active:scale-95 border border-[#FFEAA7] cursor-pointer"
                title="Tickle Pip's Bow for a giggly chime!"
              >
                <span className="material-symbols-outlined text-[#F7B731] text-xs group-hover:rotate-12 transition-transform">
                  redeem
                </span>
                <span className="text-[10px] font-bold">Tickle Bow!</span>
              </button>
            </div>

            <div className="relative w-full max-w-[340px] aspect-[4/5] rounded-2xl overflow-hidden my-2 bg-[#fff0f7] flex items-center justify-center shadow-inner">
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

              <div className="absolute bottom-3 inset-x-3 bg-white/90 backdrop-blur-md py-1.5 px-3 rounded-full flex items-center justify-between text-left shadow-sm border border-[#F3E8DC]">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[#F7B731] text-sm">bedtime</span>
                  <span className="text-[10px] text-[#3F2837] font-bold">CLOUD POD 07 · FLUFFY TIER</span>
                </div>
                <span className="text-xs text-[#80244a] font-bold">100% Cozy</span>
              </div>
            </div>

            <div className="w-full mt-3 p-3 bg-[#faeaf2] rounded-xl text-center min-h-[46px] flex items-center justify-center border border-[#eedee6]">
              <p className="font-headline font-semibold text-xs sm:text-sm text-[#80244a]">
                {speechBubbleText}
              </p>
            </div>

            <div className="w-full mt-3 bg-[#FFF9F2] p-3 rounded-xl flex flex-col gap-2 border border-[#F3E8DC]">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-[#62535F] flex items-center gap-1 font-bold">
                  <span className="material-symbols-outlined text-xs text-[#F7B731]">light_mode</span>
                  Pip's Eye-Socket Glow
                </span>
                <span className="text-[10px] text-[#80244a] font-bold">
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
                className="w-full accent-[#80244a] h-2 bg-[#faeaf2] rounded-lg cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Right: 5-Point Canon Dossier & Tool Inventory */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-md border border-[#F3E8DC] flex flex-col gap-4">
            <h3 className="font-headline font-bold text-xl text-[#3F2837] flex items-center gap-2">
              <span className="material-symbols-outlined text-[#80244a]">verified</span>
              The 5-Point Character Sheet
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-[#FFF9F2] border border-[#F3E8DC]">
                <span className="text-[10px] text-[#80244a] font-bold uppercase block mb-1">
                  1. Visual Anatomy
                </span>
                <p className="text-[#62535F] leading-relaxed">
                  Smooth round porcelain skull, glowing amber eye pinpricks, nightcap with star tassels and a pink bow.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#FFF9F2] border border-[#F3E8DC]">
                <span className="text-[10px] text-[#80244a] font-bold uppercase block mb-1">
                  2. Personality Quirk
                </span>
                <p className="text-[#62535F] leading-relaxed">
                  Snort-giggles when happy, yawns when thinking deeply, easily delighted by gentle music boxes.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#FFF9F2] border border-[#F3E8DC]">
                <span className="text-[10px] text-[#80244a] font-bold uppercase block mb-1">
                  3. Key Equipment
                </span>
                <p className="text-[#62535F] leading-relaxed">
                  Brass star-stamped lantern, pentatonic chime box, moon fluff emergency pillow, spare ribbons.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#FFF9F2] border border-[#F3E8DC]">
                <span className="text-[10px] text-[#80244a] font-bold uppercase block mb-1">
                  4. The Rule of Cozy
                </span>
                <p className="text-[#62535F] leading-relaxed">
                  100% gentle and friendly. Pip’s workshop strictly disallows scary, spooky, or noisy contraptions.
                </p>
              </div>

              <div className="sm:col-span-2 p-3.5 rounded-xl bg-[#FFF5F8] border border-[#ffd9e2]">
                <span className="text-[10px] text-[#80244a] font-bold uppercase block mb-1">
                  5. Nursery Mission
                </span>
                <p className="text-[#62535F] leading-relaxed">
                  Ensuring all frightened kits, restless hedgehogs, and midnight wanderers snooze soundly until the sun rises.
                </p>
              </div>
            </div>
          </div>

          {/* Interactive Tool Bag Inspector */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-md border border-[#F3E8DC] flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-[#F3E8DC] pb-3">
              <h3 className="font-headline font-bold text-base text-[#3F2837] flex items-center gap-2">
                <span className="material-symbols-outlined text-[#F7B731]">backpack</span>
                Pip’s Tool Bag &amp; Sleep Inventory
              </h3>
              <span className="text-[10px] font-bold text-[#80244a] bg-[#FFE3E8] px-2.5 py-0.5 rounded-full">
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
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer border ${
                      selectedItemKey === key
                        ? 'bg-[#80244a] text-white border-[#80244a] shadow-xs'
                        : 'bg-[#FFF9F2] hover:bg-[#faeaf2] text-[#62535F] border-[#F3E8DC]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-sm">{itm.icon}</span>
                    <span>{itm.title.split(' ')[0]}</span>
                  </button>
                );
              })}
            </div>

            <div className="bg-[#FFFDF7] p-4 rounded-2xl border border-[#F3E8DC] flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <h4 className="font-headline font-bold text-sm text-[#80244a]">
                  {currentItem.title}
                </h4>
                <span className="text-[10px] font-bold text-[#5f4200] bg-[#FFFAEB] px-2 py-0.5 rounded-full border border-[#FFEAA7]">
                  {currentItem.badge}
                </span>
              </div>
              <p className="text-xs text-[#62535F] leading-relaxed">{currentItem.desc}</p>
              <button
                onClick={handleActionClick}
                className="self-start mt-1 px-3.5 py-1.5 bg-[#80244a] hover:bg-[#6c1b3d] text-white text-xs font-bold rounded-full shadow-2xs transition-all cursor-pointer"
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
