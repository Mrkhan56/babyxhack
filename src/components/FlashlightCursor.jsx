import React, { useState, useEffect } from 'react';
import { playChimeNote, playLanternResonance } from '../utils/audio.js';

export const FlashlightCursor = ({ isEnabled, onToggle }) => {
  const [pos, setPos] = useState({ x: -500, y: -500 });
  const [foundSecrets, setFoundSecrets] = useState(0);

  useEffect(() => {
    if (!isEnabled) return;

    const handlePointerMove = (e) => {
      const clientX = e.clientX || (e.touches && e.touches[0]?.clientX) || 0;
      const clientY = e.clientY || (e.touches && e.touches[0]?.clientY) || 0;
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

  if (!isEnabled) return null;

  const radius = 175; // Flashlight beam radius in pixels

  return (
    <div
      className="fixed inset-0 z-40 pointer-events-none overflow-hidden select-none"
      style={{
        background: `radial-gradient(circle ${radius}px at ${pos.x}px ${pos.y}px, transparent 0%, rgba(13, 9, 23, 0.45) 50%, rgba(10, 6, 18, 0.94) 100%)`,
        transition: 'background 0.05s ease-out',
      }}
    >
      {/* Flashlight Beam Outer Rim Glow */}
      <div
        className="absolute rounded-full border border-amber-300/30 shadow-[0_0_80px_rgba(255,234,167,0.35)] transition-transform duration-75 ease-out"
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
          onClick={() => {
            playChimeNote('C6', 0.8);
            setFoundSecrets((prev) => prev + 1);
          }}
          className="absolute top-[22%] left-[12%] text-amber-200/90 hover:text-amber-100 hover:scale-125 transition-all cursor-pointer p-3 group"
          title="Secret Constellation: Ursa Minor of Sleep!"
        >
          <span className="material-symbols-outlined text-2xl animate-spin" style={{ animationDuration: '8s' }}>
            star_rate
          </span>
          <span className="block text-[10px] font-bold text-amber-200/80 tracking-wider">★ Ursa Snooze</span>
        </div>

        {/* Secret 2: Sleeping Cloud Kitten */}
        <div
          onClick={() => {
            playChimeNote('G5', 0.8);
            setFoundSecrets((prev) => prev + 1);
          }}
          className="absolute top-[68%] left-[78%] text-pink-200/90 hover:text-pink-100 hover:scale-125 transition-all cursor-pointer p-3 group"
          title="Secret: Drowsy Chimney Kitten Purring!"
        >
          <span className="material-symbols-outlined text-2xl animate-pulse">pets</span>
          <span className="block text-[10px] font-bold text-pink-200/80 tracking-wider">Purring Kitten</span>
        </div>

        {/* Secret 3: Barnaby's Hedge Lantern */}
        <div
          onClick={() => {
            playChimeNote('E5', 0.8);
            setFoundSecrets((prev) => prev + 1);
          }}
          className="absolute top-[82%] left-[24%] text-amber-300 hover:scale-125 transition-all cursor-pointer p-3 group"
          title="Secret: Barnaby Hedgehog's secret nighttime acorn lantern"
        >
          <span className="material-symbols-outlined text-2xl animate-bounce">emoji_nature</span>
          <span className="block text-[10px] font-bold text-amber-200/80 tracking-wider">Hedgehog Haven</span>
        </div>
      </div>

      {/* Flashlight HUD Badge */}
      <div className="absolute top-20 right-4 pointer-events-auto bg-[#1b1220]/90 text-amber-100 px-3.5 py-1.5 rounded-full border border-amber-300/40 shadow-xl flex items-center gap-2 text-xs backdrop-blur-md">
        <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
        <span className="font-bold">🔦 Nightlight Beam Active</span>
        <span className="text-[10px] bg-amber-400/20 text-amber-200 px-2 py-0.5 rounded-full">
          Secrets Found: {foundSecrets}/3
        </span>
        <button
          onClick={() => onToggle?.(false)}
          className="ml-1 text-white/60 hover:text-white cursor-pointer"
          title="Turn off flashlight (or press F)"
        >
          ✕
        </button>
      </div>
    </div>
  );
};
