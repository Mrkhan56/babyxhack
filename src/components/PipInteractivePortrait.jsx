import React, { useState, useRef, useEffect } from 'react';
import { playEasterEggChime, playChimeNote } from '../utils/audio.js';
import { triggerStarConfetti } from './SparkleCanvas.jsx';

export const PipInteractivePortrait = ({
  mood = 'day',
  onBowTap,
  bowTapped = false,
  className = '',
}) => {
  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });
  const [eyeOffset, setEyeOffset] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  // Smoothly calculate tilt & eye gaze tracking from pointer position
  const handlePointerMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const clientX = e.clientX || (e.touches && e.touches[0]?.clientX) || 0;
    const clientY = e.clientY || (e.touches && e.touches[0]?.clientY) || 0;

    const deltaX = (clientX - centerX) / (rect.width / 2);
    const deltaY = (clientY - centerY) / (rect.height / 2);

    // Limit tilt range to gentle pleasant angles (-15deg to +15deg)
    const clampedX = Math.max(-1, Math.min(1, deltaX));
    const clampedY = Math.max(-1, Math.min(1, deltaY));

    setTilt({
      rotateX: -clampedY * 12,
      rotateY: clampedX * 14,
    });

    // Eye pupils follow cursor within socket bounds (-7px to +7px)
    setEyeOffset({
      x: clampedX * 8,
      y: clampedY * 7,
    });
  };

  const handlePointerLeave = () => {
    setIsHovered(false);
    // Smoothly settle back to relaxed bedtime float
    setTilt({ rotateX: 0, rotateY: 0 });
    setEyeOffset({ x: 0, y: 0 });
  };

  // Touch fallback: auto sway when no touch is active
  useEffect(() => {
    let frameId;
    let time = 0;
    const animateFloat = () => {
      time += 0.03;
      if (!isHovered) {
        // Gentle rhythmic baby breathing sway (0.5Hz lullaby rhythm)
        setTilt((prev) => ({
          rotateX: Math.sin(time) * 3,
          rotateY: Math.cos(time * 0.8) * 3.5,
        }));
        setEyeOffset((prev) => ({
          x: Math.sin(time * 0.7) * 2,
          y: Math.cos(time * 0.9) * 1.5,
        }));
      }
      frameId = requestAnimationFrame(animateFloat);
    };

    frameId = requestAnimationFrame(animateFloat);
    return () => cancelAnimationFrame(frameId);
  }, [isHovered]);

  const handleInternalBowTap = (e) => {
    e.stopPropagation();
    playEasterEggChime();
    triggerStarConfetti();
    onBowTap?.();
  };

  // Expression styling based on Day / Night / Dream mood
  const moodExpressions = {
    day: {
      eyeSize: 'w-4 h-4',
      eyeGlow: 'bg-[#F7B731] shadow-[0_0_16px_#F7B731]',
      status: 'Wide Awake & Tinkering',
      mouth: '∪',
      balloon: '☀️ Day Mode: Pip is wide awake & sketching blueprints!',
    },
    night: {
      eyeSize: 'w-3.5 h-2.5',
      eyeGlow: 'bg-[#ffb03a] shadow-[0_0_12px_#ffb03a]',
      status: 'Sleepy & Cozy',
      mouth: '〜',
      balloon: '🌙 Night Mode: *Yawn!* Pip is cozy in fleece & star flannel.',
    },
    dream: {
      eyeSize: 'w-4 h-4',
      eyeGlow: 'bg-[#d8b4fe] shadow-[0_0_20px_#d8b4fe]',
      status: 'Dreaming Stardust',
      mouth: '⌒',
      balloon: '✨ Dream Mood: Wandering among lavender cloud meadows!',
    },
  };

  const activeMood = moodExpressions[mood] || moodExpressions.day;

  return (
    <div
      ref={cardRef}
      onMouseMove={(e) => {
        setIsHovered(true);
        handlePointerMove(e);
      }}
      onTouchMove={(e) => {
        setIsHovered(true);
        handlePointerMove(e);
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handlePointerLeave}
      onTouchEnd={handlePointerLeave}
      className={`relative select-none flex flex-col items-center justify-center p-2 cursor-pointer ${className}`}
      style={{
        perspective: '800px',
      }}
    >
      {/* 3D Tilting Character Container */}
      <div
        className="relative w-full max-w-[280px] aspect-[0.85] flex items-center justify-center transition-transform duration-150 ease-out"
        style={{
          transform: `rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg) scale3d(${
            isHovered ? 1.04 : 1
          }, ${isHovered ? 1.04 : 1}, 1)`,
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Soft Background Cloud Aura */}
        <div
          className={`absolute inset-4 rounded-full blur-2xl transition-all duration-700 pointer-events-none ${
            mood === 'night'
              ? 'bg-indigo-900/40'
              : mood === 'dream'
              ? 'bg-purple-300/40'
              : 'bg-rose-200/50'
          }`}
        />

        {/* Base Pip Character Illustration */}
        <img
          alt="Pip the Skull Baby floating on a cloud"
          className={`w-full h-full object-contain filter drop-shadow-lg transition-transform duration-300 ${
            bowTapped ? 'scale-110 rotate-2' : ''
          }`}
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCd5MJ7oP6VykoZLhwGPh-OjfPDOadl0cLfcumC_RAn4_u9pu7edGRULyOJZ-8njSzYBt5pzneURCd262RBX6psJzfSH2q2ctV1VcacdLz9Wy1WIU4rSWSYJDqMmFwSPO64e7mHoUXz8uy0KvfWfMyiSqCi-f3RzVKeOtXDhtX5kis-ajlBxzsWOAtaal1Ub724PAktGzOxvoKit11R40Ibsu_pqpMYy5MXrM9-sFhT0isErJuJDpkbC698NuSGh6cZhA"
        />

        {/* Dynamic Eye Sockets: Smoothly tracking glowing amber pinpricks (Tier 1 Requirement) */}
        {/* Left Eye Socket */}
        <div
          className="absolute top-[43%] left-[41.5%] w-6 h-6 rounded-full flex items-center justify-center pointer-events-none"
          style={{
            transform: `translate3d(${eyeOffset.x}px, ${eyeOffset.y}px, 20px)`,
            transition: isHovered ? 'transform 0.05s linear' : 'transform 0.4s ease-out',
          }}
        >
          <div className={`${activeMood.eyeSize} rounded-full ${activeMood.eyeGlow} animate-pulse`} />
        </div>

        {/* Right Eye Socket */}
        <div
          className="absolute top-[43%] left-[53.5%] w-6 h-6 rounded-full flex items-center justify-center pointer-events-none"
          style={{
            transform: `translate3d(${eyeOffset.x}px, ${eyeOffset.y}px, 20px)`,
            transition: isHovered ? 'transform 0.05s linear' : 'transform 0.4s ease-out',
          }}
        >
          <div className={`${activeMood.eyeSize} rounded-full ${activeMood.eyeGlow} animate-pulse`} />
        </div>

        {/* Secret Clickable Bow Hotspot (Easter Egg) */}
        <button
          onClick={handleInternalBowTap}
          className="absolute top-[16%] left-[32%] w-11 h-11 rounded-full bg-transparent hover:bg-pink-400/30 cursor-pointer flex items-center justify-center transition-all focus:outline-none ring-2 ring-transparent hover:ring-pink-300"
          style={{ transform: 'translateZ(30px)' }}
          aria-label="Click Pip's nightcap bow for a magic chime!"
          title="Tap Pip's bow for a magic chime and starlight confetti!"
        >
          <span className="material-symbols-outlined text-pink-400 opacity-0 hover:opacity-100 text-sm transition-opacity">
            auto_awesome
          </span>
        </button>

        {/* Cursor tracking indicator tooltip */}
        <span
          className="absolute bottom-1 right-1 bg-amber-50/95 text-amber-900 font-bold text-[10px] px-2.5 py-0.5 rounded-full shadow-xs border border-amber-200 pointer-events-none flex items-center gap-1"
          style={{ transform: 'translateZ(25px)' }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping"></span>
          Eyes follow cursor
        </span>
      </div>

      {/* Mood Expression Bubble */}
      <div className="mt-2 text-center">
        <span className="inline-block text-[11px] font-semibold text-stone-600 bg-white/80 px-3 py-1 rounded-full border border-stone-200/60 shadow-2xs">
          {activeMood.balloon}
        </span>
      </div>
    </div>
  );
};
