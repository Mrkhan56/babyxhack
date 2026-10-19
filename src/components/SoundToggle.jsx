import React, { useEffect, useState, useRef } from 'react';
import {
  isSoundEnabled,
  setSoundEnabled,
  onSoundChange,
  playChimeNote,
  playWoodBlockSound,
  playPageTurnSound,
  playStarCatchSound,
  playMoonCatchSound,
  playHeartPopSound,
  playBubblePopSound,
  playLanternResonance,
  playHurtSound,
  playVictoryFanfare,
  playGameOverSound,
  playEasterEggChime,
} from '../utils/audio.js';

export const SoundToggle = ({ className = '', showLabel = true }) => {
  const [enabled, setEnabled] = useState(isSoundEnabled());
  const [showTooltip, setShowTooltip] = useState(false);
  const [showSoundboard, setShowSoundboard] = useState(false);
  const [activePreview, setActivePreview] = useState(null);
  const menuRef = useRef(null);

  useEffect(() => {
    return onSoundChange((newVal) => {
      setEnabled(newVal);
    });
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowSoundboard(false);
      }
    };
    if (showSoundboard) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showSoundboard]);

  const handleToggle = () => {
    const nextState = !enabled;
    setSoundEnabled(nextState);
    if (nextState) {
      playHeartPopSound();
    }
  };

  const previewSound = (name, playFn) => {
    if (!enabled) {
      setSoundEnabled(true);
    }
    setActivePreview(name);
    playFn();
    setTimeout(() => setActivePreview(null), 400);
  };

  const SOUND_FX_PREVIEWS = [
    { id: 'celesta', name: 'Celesta Chime', icon: 'music_note', fn: () => playChimeNote('C5', 0.9) },
    { id: 'sparkle', name: 'Star Sparkle', icon: 'auto_awesome', fn: () => playStarCatchSound() },
    { id: 'moon', name: 'Moon Harmony', icon: 'nightlight', fn: () => playMoonCatchSound() },
    { id: 'heart', name: 'Heart Pop', icon: 'favorite', fn: () => playHeartPopSound() },
    { id: 'bubble', name: 'Bubbly Seal', icon: 'bubble_chart', fn: () => playBubblePopSound(true) },
    { id: 'woodblock', name: 'Wood Block', icon: 'extension', fn: () => playWoodBlockSound(260) },
    { id: 'page', name: 'Parchment Turn', icon: 'menu_book', fn: () => playPageTurnSound() },
    { id: 'lantern', name: 'Singing Bowl', icon: 'wb_incandescent', fn: () => playLanternResonance(70) },
    { id: 'pillow', name: 'Pillow Bump', icon: 'cloud', fn: () => playHurtSound() },
    { id: 'fanfare', name: 'Starlight Fanfare', icon: 'celebration', fn: () => playVictoryFanfare() },
    { id: 'slumber', name: 'Slumber Lullaby', icon: 'bedtime', fn: () => playGameOverSound() },
    { id: 'easteregg', name: 'Golden Chime', icon: 'stars', fn: () => playEasterEggChime() },
  ];

  return (
    <div ref={menuRef} className={`relative inline-flex items-center gap-1.5 ${className}`}>
      <div
        className="relative"
        onMouseEnter={() => !showSoundboard && setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <button
          onClick={handleToggle}
          type="button"
          role="switch"
          aria-checked={enabled}
          aria-label={
            enabled
              ? 'Disable ambient lullaby background music and sounds'
              : 'Enable ambient lullaby background music and sounds'
          }
          className={`group flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full transition-all duration-300 cursor-pointer shadow-xs select-none border active:scale-95 shrink-0 ${
            enabled
              ? 'bg-[#FFE3E8] border-[#ffb0c8] text-[#80244a] shadow-[0_2px_8px_rgba(128,36,74,0.15)] ring-1 ring-[#ffb0c8]'
              : 'bg-white border-[#F3E8DC] text-[#62535F] hover:bg-[#FFF5F8] hover:border-[#ffd9e2]'
          }`}
        >
          <div className="relative flex items-center justify-center w-4 h-4 sm:w-5 sm:h-5 shrink-0">
            {enabled ? (
              <div className="flex items-end justify-center gap-0.5 h-3 sm:h-3.5">
                <span className="w-0.5 sm:w-1 bg-[#80244a] rounded-full animate-[pulse_0.8s_ease-in-out_infinite] h-2"></span>
                <span className="w-0.5 sm:w-1 bg-[#80244a] rounded-full animate-[pulse_0.6s_ease-in-out_infinite_0.2s] h-3 sm:h-3.5"></span>
                <span className="w-0.5 sm:w-1 bg-[#80244a] rounded-full animate-[pulse_0.9s_ease-in-out_infinite_0.4s] h-2.5"></span>
                <span className="w-0.5 sm:w-1 bg-[#80244a] rounded-full animate-[pulse_0.7s_ease-in-out_infinite_0.1s] h-1.5"></span>
              </div>
            ) : (
              <span className="material-symbols-outlined text-[16px] sm:text-[18px] text-[#8a7a85] group-hover:text-[#80244a] transition-colors">
                volume_off
              </span>
            )}
          </div>

          {showLabel && (
            <div className="flex items-center gap-1 sm:gap-1.5">
              <span className="hidden sm:inline font-headline font-bold text-[11px] sm:text-xs tracking-tight">
                {enabled ? 'Lullaby' : 'Sound'}
              </span>
              <span
                className={`text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded-full font-bold uppercase transition-colors shrink-0 ${
                  enabled ? 'bg-[#80244a] text-white' : 'bg-[#F3E8DC] text-[#62535F]'
                }`}
              >
                {enabled ? 'ON' : 'OFF'}
              </span>
            </div>
          )}
        </button>

        {showTooltip && !showSoundboard && (
          <div className="absolute top-full right-0 mt-2 z-50 pointer-events-none w-56 p-2.5 bg-[#21191F] text-white rounded-xl shadow-xl text-left text-xs animate-in fade-in duration-200 border border-white/10">
            <div className="flex items-center gap-1.5 text-[10px] text-[#FFEAA7] font-bold uppercase mb-1">
              <span className="material-symbols-outlined text-xs text-[#F7B731]">
                music_note
              </span>
              Ambient Lullaby Engine
            </div>
            <p className="text-[11px] text-[#F3E8DC] leading-snug">
              {enabled
                ? 'Playing continuous dreamy pentatonic music box melody & cozy starlight drone. Saved to your settings.'
                : 'Ambient music and chimes are currently quiet. Click to start the bedtime melody!'}
            </p>
          </div>
        )}
      </div>

      <button
        onClick={() => {
          setShowTooltip(false);
          setShowSoundboard((prev) => !prev);
          if (!showSoundboard) {
            playBubblePopSound(true);
          }
        }}
        type="button"
        title="Open Nursery Sound Effects Audition Board"
        aria-label="Audition Nursery Sound Effects"
        className={`hidden md:flex px-2 py-1.5 rounded-full border transition-all items-center justify-center cursor-pointer shadow-xs active:scale-95 ${
          showSoundboard
            ? 'bg-[#80244a] text-white border-[#80244a] shadow-[0_2px_8px_rgba(128,36,74,0.25)]'
            : 'bg-white hover:bg-[#FFF5F8] text-[#80244a] border-[#F3E8DC] hover:border-[#ffd9e2]'
        }`}
      >
        <span className="material-symbols-outlined text-[17px]">graphic_eq</span>
      </button>

      {showSoundboard && (
        <div className="absolute top-full right-0 mt-3 z-50 w-72 sm:w-80 p-4 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border-2 border-[#ffd9e2] text-left animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-[#F3E8DC] pb-2.5 mb-3">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#FFE3E8] text-[#80244a] flex items-center justify-center">
                <span className="material-symbols-outlined text-xs">auto_awesome</span>
              </span>
              <div>
                <h4 className="font-headline font-bold text-xs text-[#3F2837]">
                  Nursery Sound Effects
                </h4>
                <p className="text-[10px] text-[#62535F]">
                  Tap to audition custom acoustic sound design
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowSoundboard(false)}
              className="text-[#8a7a85] hover:text-[#80244a] p-1 rounded-md"
            >
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-1.5">
            {SOUND_FX_PREVIEWS.map((item) => {
              const isPlaying = activePreview === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => previewSound(item.id, item.fn)}
                  className={`flex items-center gap-2 p-2 rounded-xl text-left transition-all cursor-pointer border ${
                    isPlaying
                      ? 'bg-[#FFE3E8] text-[#80244a] border-[#80244a] scale-[1.03] shadow-xs'
                      : 'bg-[#FFF9F2] hover:bg-[#faeaf2] text-[#3F2837] border-[#F3E8DC] hover:border-[#ffd9e2]'
                  }`}
                >
                  <span
                    className={`material-symbols-outlined text-sm ${
                      isPlaying ? 'text-[#80244a] animate-bounce' : 'text-[#8a7a85]'
                    }`}
                  >
                    {item.icon}
                  </span>
                  <span className="text-[11px] font-semibold truncate">{item.name}</span>
                </button>
              );
            })}
          </div>

          <div className="mt-3 pt-2.5 border-t border-[#F3E8DC] flex items-center justify-between text-[10px] text-[#62535F]">
            <span>Harmonically tuned in C Pentatonic</span>
            <span className="text-[#80244a] font-bold">100% Zero Dissonance</span>
          </div>
        </div>
      )}
    </div>
  );
};
