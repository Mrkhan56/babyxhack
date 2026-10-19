import React, { useEffect, useState, useRef } from 'react';
import {
  playChimeNote,
  playPageTurnSound,
  playLanternResonance,
  playVictoryFanfare,
  playBubblePopSound,
} from '../../utils/audio.js';
import { triggerStarConfetti } from '../SparkleCanvas.jsx';

export const BedtimeStorybookScreen = ({ onSelectTab, onIncrementDreams }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [lanternModeIndex, setLanternModeIndex] = useState(0);
  const [fireflyCount, setFireflyCount] = useState(12);
  const [fireflyJarPulse, setFireflyJarPulse] = useState(false);
  const [sleepProgress, setSleepProgress] = useState(88);
  const [wishSent, setWishSent] = useState(false);
  const [isFlipping, setIsFlipping] = useState(false);
  const touchStartXRef = useRef(0);

  const lanternModes = [
    { name: 'WARM SUN', scrim: 'bg-transparent' },
    { name: 'AMBER GLOW', scrim: 'bg-amber-500/10' },
    { name: 'MIDNIGHT COZY', scrim: 'bg-indigo-950/25' },
  ];

  // 1. Keyboard Navigation Support (ArrowLeft / ArrowRight)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault();
        switchPage(currentPage + 1);
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        switchPage(currentPage - 1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPage]);

  // 2. Touch Swipe Support
  const handleTouchStart = (e) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    const deltaX = e.changedTouches[0].clientX - touchStartXRef.current;
    if (deltaX < -50) {
      switchPage(currentPage + 1); // Swipe left -> next page
    } else if (deltaX > 50) {
      switchPage(currentPage - 1); // Swipe right -> prev page
    }
  };

  const switchPage = (page) => {
    if (page < 1 || page > 3 || page === currentPage) return;
    setIsFlipping(true);
    playPageTurnSound();
    setCurrentPage(page);
    setTimeout(() => setIsFlipping(false), 450);
  };

  const chapters = [
    {
      number: 1,
      title: 'The Brass Thimble & The First Nightcap',
      subtitle: 'Where Pip was born and how he began his workshop',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCd5MJ7oP6VykoZLhwGPh-OjfPDOadl0cLfcumC_RAn4_u9pu7edGRULyOJZ-8njSzYBt5pzneURCd262RBX6psJzfSH2q2ctV1VcacdLz9Wy1WIU4rSWSYJDqMmFwSPO64e7mHoUXz8uy0KvfWfMyiSqCi-f3RzVKeOtXDhtX5kis-ajlBxzsWOAtaal1Ub724PAktGzOxvoKit11R40Ibsu_pqpMYy5MXrM9-sFhT0isErJuJDpkbC698NuSGh6cZhA',
      body: `Before Pip was Junior Dream Engineer, he was just a sleepy skull baby dreaming inside a velvet hatbox on Cloud Rim 07. The midnight sky was completely quiet, but quiet sometimes felt too big for little dreamers. So Pip picked up a brass thimble, tied three strands of lilac wool, and wound his first bedtime lullaby clock. When he wound it up, warm amber starlight drifted over the chimney tops, and every restless kit nestled into deep sweet sleep.`,
      moral: '✨ “Even the smallest hands can craft the warmest dreams.”',
    },
    {
      number: 2,
      title: 'Barnaby Hedgehog & The Lavender Cloud Loom',
      subtitle: 'Designing sleep contraptions for restless prickly friends',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDA3B9aQz-m8T3-a44QGk-x_j_R6xW6vYfE6g6R5j4U9e2L9l4J6x6c8e3v9_a1v8_q4_j5_a6_c2_d8_e9_f1_g3_h5_j7_k9_l0',
      body: `One windy autumn evening, Barnaby the Hedgehog tapped on Nursery Room 07. “Pip,” he whispered, “my spines are all prickly and I can't snooze!” Pip immediately set to work. He gathered fleece cloud rim shavings, spun lavender dream vapor into a soft loom, and calibrated a warm 0.5 Hertz pendulum rocking cradle. Within three gentle swings, Barnaby’s spines softened like dandelion tufts and he was snoring softly beneath the stars.`,
      moral: '🌙 “Every restless night has a cozy solution.”',
    },
    {
      number: 3,
      title: 'The Starlight Council & The Golden Lantern',
      subtitle: 'Pip receives the Official Dream Engineer Seal',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDaDQR41KBT5zoavfKSFBGwlp0fySzOYb-MBqRjz57rCw8Jk_coZIHiscgpp04m3-rq7ujbo3ya4-wwVkQAJ3kHkWcA0Dn7dTzxb3RBrRc6SEHrj-altRfxyrWlxvZNvp64eOGUuoopsu5j9s8D8hMsdD7655E4zp1GEVifaNlKPtjovPm_tMcMrT2IsVkHqiCXrMMOWUmpdYyfg1o4GDaLusjysVX7HsANrYuTa0YzodrAiKD9fAY7kM6si2Rh6uoSlw',
      body: `When the Grand Starlight Council inspected Room 07, they found over forty thousand peaceful dreams delivered without a single fright. They conferred upon Pip the Official Dream Engineer Medallion—carved from celestial brass with amber starry eyes. Pip smiled his tiny crooked baby smile, touched his pink nightcap bow, and whispered: “Thank you. Now let's tuck all the dreamers into bed.”`,
      moral: '🌟 “Sleep well, dream gentle, and wake to morning joy.”',
    },
  ];

  const currentChapter = chapters[currentPage - 1];

  const handleFeedFireflies = () => {
    setFireflyCount((prev) => prev + 3);
    setFireflyJarPulse(true);
    playBubblePopSound(true);
    playChimeNote('G4', 0.4);
    setTimeout(() => playChimeNote('C5', 0.5), 100);
    setTimeout(() => setFireflyJarPulse(false), 350);
  };

  const handleDispatchDreamWish = () => {
    setWishSent(true);
    setSleepProgress(100);
    playVictoryFanfare();
    triggerStarConfetti();
    onIncrementDreams?.();
  };

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="w-full flex flex-col gap-8 relative select-none"
    >
      {/* Dimmer Scrim */}
      <div
        className={`pointer-events-none fixed inset-0 z-30 transition-colors duration-1000 ease-out ${lanternModes[lanternModeIndex].scrim}`}
      />

      {/* Top Header Card (The Moon: my story) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#231538]/90 backdrop-blur-md rounded-3xl p-5 sm:p-6 border-2 border-[#69519A]/40 shadow-xl text-white">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm">📖</span>
            <span className="text-xs text-[#FFEAA7] uppercase font-bold tracking-widest">
              The Moon · My Story · Chapter {currentPage} of 3
            </span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl text-pink-300 font-extrabold tracking-tight">
            Pip’s Bedtime Storybook
          </h2>
          <p className="text-xs text-purple-200 mt-1">
            Flip with touch swipe, arrow keys (← / →), or tap the chapter buttons below.
          </p>
        </div>

        {/* Ambient Lantern Warmth Controller */}
        <div className="flex items-center gap-3 bg-[#1A1028]/80 px-4 py-2.5 rounded-2xl border border-white/10 shadow-inner">
          <span className="material-symbols-outlined text-[#F7B731] text-xl">wb_incandescent</span>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-[#FFEAA7] uppercase tracking-wider">
              Bedroom Glow: {lanternModes[lanternModeIndex].name}
            </span>
            <input
              type="range"
              min="0"
              max="2"
              step="1"
              value={lanternModeIndex}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                setLanternModeIndex(val);
                playLanternResonance(val * 40 + 20);
              }}
              className="w-28 h-2 bg-[#69519A] rounded-full accent-[#F7B731] cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Interactive 3D Storybook Folio Container */}
      <div
        style={{ perspective: '1200px' }}
        className="relative w-full min-h-[480px] bg-[#231538]/90 backdrop-blur-md rounded-3xl p-6 sm:p-10 border-2 border-[#69519A]/50 shadow-2xl overflow-hidden flex flex-col justify-between text-white"
      >
        {/* Animated Page Flip Container */}
        <div
          className={`grid grid-cols-1 lg:grid-cols-12 gap-8 items-center transition-all duration-400 ease-out ${
            isFlipping ? 'opacity-40 scale-[0.98]' : 'opacity-100 scale-100'
          }`}
        >
          {/* Left: Illustration Card */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
            <div className="relative w-full max-w-[300px] aspect-square rounded-3xl overflow-hidden p-4 bg-gradient-to-tr from-[#1A1028] via-[#2D1B4E] to-[#1A1028] shadow-2xl border-2 border-white/20">
              <img
                src={currentChapter.image}
                alt={currentChapter.title}
                className="w-full h-full object-contain filter drop-shadow-[0_10px_20px_rgba(247,183,49,0.35)]"
              />
            </div>
            <span className="mt-4 text-xs font-headline font-bold text-[#FFEAA7] bg-[#1A1028]/90 px-4 py-1.5 rounded-full border border-white/15 shadow-md">
              {currentChapter.subtitle}
            </span>
          </div>

          {/* Right: Narrative Story Text */}
          <div className="lg:col-span-7 flex flex-col gap-4 text-left">
            <div>
              <span className="text-xs font-bold text-pink-300 uppercase tracking-widest block mb-1">
                ✦ Chapter 0{currentChapter.number} ✦
              </span>
              <h3 className="font-display font-bold text-2xl sm:text-3xl text-[#FFEAA7] tracking-tight">
                {currentChapter.title}
              </h3>
            </div>

            <p className="text-sm sm:text-base text-purple-100 leading-relaxed font-serif bg-[#160B24]/85 p-6 rounded-2xl border border-white/10 shadow-inner">
              {currentChapter.body}
            </p>

            <div className="text-xs text-pink-200 font-semibold italic bg-[#80244A]/30 p-3.5 rounded-xl border border-pink-400/30">
              {currentChapter.moral}
            </div>
          </div>
        </div>

        {/* Page Turner Controls & Chapter Progress */}
        <div className="mt-8 pt-5 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {[1, 2, 3].map((page) => (
              <button
                key={page}
                onClick={() => switchPage(page)}
                className={`w-10 h-10 rounded-full font-headline font-bold text-xs transition-all cursor-pointer border ${
                  currentPage === page
                    ? 'bg-[#80244A] text-white border-pink-300 shadow-[0_0_12px_rgba(128,36,74,0.7)] scale-105'
                    : 'bg-[#1A1028] hover:bg-white/10 text-purple-200 border-white/15'
                }`}
              >
                {page}
              </button>
            ))}
            <span className="text-xs text-purple-300/80 ml-2">
              • Swipe or use ← / → keys
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => switchPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-5 py-2 bg-[#1A1028] hover:bg-[#2D1B4E] disabled:opacity-40 text-purple-200 font-bold text-xs rounded-full border border-white/20 transition-all cursor-pointer disabled:cursor-not-allowed flex items-center gap-1.5 shadow-sm active:scale-95"
            >
              <span className="material-symbols-outlined text-sm">arrow_back</span>
              <span>Previous</span>
            </button>

            <button
              onClick={() => switchPage(currentPage + 1)}
              disabled={currentPage === 3}
              className="px-5 py-2 bg-[#80244A] hover:bg-[#9e3c62] disabled:opacity-40 text-white font-bold text-xs rounded-full shadow-md transition-all cursor-pointer disabled:cursor-not-allowed flex items-center gap-1.5 active:scale-95"
            >
              <span>Next Chapter</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bedtime Fireflies Interactive Widget */}
      <div className="bg-[#231538]/90 backdrop-blur-md rounded-3xl p-6 text-white flex flex-col sm:flex-row items-center justify-between gap-4 border-2 border-[#69519A]/40 shadow-xl">
        <div className="flex items-center gap-3">
          <div
            className={`w-12 h-12 rounded-full bg-amber-400/20 border-2 border-amber-300 flex items-center justify-center text-amber-300 transition-transform ${
              fireflyJarPulse ? 'scale-125' : ''
            }`}
          >
            <span className="material-symbols-outlined text-2xl">emoji_nature</span>
          </div>
          <div>
            <h4 className="font-display font-bold text-base text-[#FFEAA7]">
              Barnaby’s Firefly Jar ({fireflyCount} Glowing Fireflies)
            </h4>
            <p className="text-xs text-purple-200">
              Feed golden honey crumbs to brighten the bedtime lantern glow!
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleFeedFireflies}
            className="px-4 py-2 bg-[#F7B731] hover:bg-[#FFEAA7] text-[#5F4200] font-headline font-bold text-xs rounded-full shadow-md transition-all cursor-pointer active:scale-95 flex items-center gap-1.5"
          >
            <span>+ Feed Fireflies</span>
          </button>
          <button
            onClick={handleDispatchDreamWish}
            className="px-4 py-2 bg-gradient-to-r from-[#80244A] to-[#69519A] hover:from-[#9e3c62] hover:to-[#553D85] text-white font-headline font-bold text-xs rounded-full shadow-md transition-all cursor-pointer active:scale-95 flex items-center gap-1.5"
          >
            <span>{wishSent ? '✨ Wish Delivered!' : 'Dispatch Sleep Wish'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
