import React, { useState, useEffect } from 'react';
import { playChimeNote, playLanternResonance, playVictoryFanfare, playEasterEggChime } from '../utils/audio.js';
import { triggerStarConfetti } from './SparkleCanvas.jsx';

export const FlashlightCursor = ({ isEnabled, onToggle }) => {
  const [pos, setPos] = useState({ x: -500, y: -500 });
  const [foundSecrets, setFoundSecrets] = useState(0);
  const [discoveredMap, setDiscoveredMap] = useState({});

  useEffect(() => {
    if (!isEnabled) return;

    // Set initial position to center of screen so on mobile/first open it illuminates right away
    setPos({
      x: window.innerWidth ? window.innerWidth / 2 : 400,
      y: window.innerHeight ? window.innerHeight / 2 : 400,
    });

    const handlePointerMove = (e) => {
      const clientX = e.clientX ?? (e.touches && e.touches[0]?.clientX) ?? 0;
      const clientY = e.clientY ?? (e.touches && e.touches[0]?.clientY) ?? 0;
      setPos({ x: clientX, y: clientY });
    };

    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('touchmove', handlePointerMove, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('touchmove', handlePointerMove);
    };
  }, [isEnabled]);

  // Keyboard shortcut: Press 'F' to toggle flashlight
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.key === 'f' || e.key === 'F') {
        onToggle?.(!isEnabled);
        if (!isEnabled) {
          playLanternResonance(80);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isEnabled, onToggle]);

  const handleDiscover = (id, note) => {
    if (discoveredMap[id]) return;
    setDiscoveredMap((prev) => ({ ...prev, [id]: true }));
    setFoundSecrets((prev) => {
      const next = prev + 1;
      if (next >= 5) {
        playVictoryFanfare();
        triggerStarConfetti();
      } else {
        playChimeNote(note, 0.85);
        triggerStarConfetti();
      }
      return next;
    });
  };

  if (!isEnabled) return null;

  const radius = 180; // Flashlight beam radius in pixels

  return (
    <div
      className="fixed inset-0 z-40 pointer-events-none overflow-hidden select-none"
      style={{
        background: `radial-gradient(circle ${radius}px at ${pos.x}px ${pos.y}px, transparent 0%, rgba(18, 11, 31, 0.45) 50%, rgba(14, 8, 26, 0.94) 100%)`,
        transition: 'background 0.04s ease-out',
      }}
    >
      {/* Flashlight Beam Outer Rim Glow */}
      <div
        className="absolute rounded-full border-2 border-amber-300/40 shadow-[0_0_90px_rgba(255,234,167,0.45)] transition-transform duration-75 ease-out"
        style={{
          width: radius * 2,
          height: radius * 2,
          left: pos.x - radius,
          top: pos.y - radius,
        }}
      />

      {/* Hidden Nightlight Constellation Secrets revealed in dark dream layers */}
      <div className="absolute inset-0 pointer-events-auto">
        {/* Secret 1: High Starlight Constellation */}
        <div
          onClick={() => handleDiscover('s1', 'C6')}
          className="absolute top-[22%] left-[12%] text-amber-200/90 hover:text-amber-100 hover:scale-125 transition-all cursor-pointer p-3 group"
          title="Secret Constellation: Ursa Minor of Sleep!"
        >
          <span className="material-symbols-outlined text-3xl animate-spin" style={{ animationDuration: '8s' }}>
            star_rate
          </span>
          <span className="block text-[10px] font-bold text-amber-200 tracking-wider">
            {discoveredMap.s1 ? '✨ Ursa Snooze (Found!)' : '★ Ursa Snooze'}
          </span>
        </div>

        {/* Secret 2: Sleeping Cloud Kitten */}
        <div
          onClick={() => handleDiscover('s2', 'G5')}
          className="absolute top-[68%] left-[78%] text-pink-200/90 hover:text-pink-100 hover:scale-125 transition-all cursor-pointer p-3 group"
          title="Secret: Drowsy Chimney Kitten Purring!"
        >
          <span className="material-symbols-outlined text-3xl animate-pulse">pets</span>
          <span className="block text-[10px] font-bold text-pink-200 tracking-wider">
            {discoveredMap.s2 ? '✨ Purring Kitten (Found!)' : 'Purring Kitten'}
          </span>
        </div>

        {/* Secret 3: Barnaby's Hedge Lantern */}
        <div
          onClick={() => handleDiscover('s3', 'E5')}
          className="absolute top-[82%] left-[24%] text-amber-300 hover:scale-125 transition-all cursor-pointer p-3 group"
          title="Secret: Barnaby Hedgehog's secret nighttime acorn lantern"
        >
          <span className="material-symbols-outlined text-3xl animate-bounce">emoji_nature</span>
          <span className="block text-[10px] font-bold text-amber-200 tracking-wider">
            {discoveredMap.s3 ? '✨ Hedgehog Haven (Found!)' : 'Hedgehog Haven'}
          </span>
        </div>

        {/* Secret 4: The Golden Slumber Moon */}
        <div
          onClick={() => handleDiscover('s4', 'A5')}
          className="absolute top-[18%] left-[82%] text-yellow-200/90 hover:scale-125 transition-all cursor-pointer p-3 group"
          title="Secret: The Sleeping Moon's Golden Whisper"
        >
          <span className="material-symbols-outlined text-3xl">bedtime</span>
          <span className="block text-[10px] font-bold text-yellow-200 tracking-wider">
            {discoveredMap.s4 ? '✨ Slumber Moon (Found!)' : 'Slumber Moon'}
          </span>
        </div>

        {/* Secret 5: Fluffy Cloud Sheep */}
        <div
          onClick={() => handleDiscover('s5', 'D5')}
          className="absolute top-[75%] left-[48%] text-purple-200/90 hover:scale-125 transition-all cursor-pointer p-3 group"
          title="Secret: Fluffy Cloud Sheep #07"
        >
          <span className="material-symbols-outlined text-3xl">cloud</span>
          <span className="block text-[10px] font-bold text-purple-200 tracking-wider">
            {discoveredMap.s5 ? '✨ Dream Sheep #07 (Found!)' : 'Counting Sheep'}
          </span>
        </div>
      </div>

      {/* Flashlight HUD Badge */}
      <div className="absolute top-20 right-4 pointer-events-auto bg-[#1A1028]/95 text-amber-100 px-4 py-2 rounded-full border-2 border-amber-300/40 shadow-2xl flex items-center gap-2 text-xs backdrop-blur-md">
        <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping"></span>
        <span className="font-display font-bold text-[#FFEAA7]">🔦 Pip's Nightlight Torch</span>
        <span className="text-[10px] bg-amber-400/20 text-amber-200 px-2.5 py-0.5 rounded-full font-bold border border-amber-300/30">
          Secrets: {foundSecrets}/5
        </span>
        <button
          onClick={() => onToggle?.(false)}
          className="ml-1 text-white/60 hover:text-white cursor-pointer px-1.5 py-0.5 rounded-full bg-white/10 hover:bg-white/20 font-bold"
          title="Turn off torch (or press F)"
        >
          ✕
        </button>
      </div>
    </div>
  );
};
