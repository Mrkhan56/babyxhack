import React, { useState, useEffect, useRef } from 'react';
import {
  isSoundEnabled,
  setSoundEnabled,
  onSoundChange,
  playHeartPopSound,
  playBubblePopSound,
  playMelody,
  playChimeNote,
} from '../utils/audio.js';

export const RetroDreamTaskbar = ({
  currentTab,
  onSelectTab,
  dreamCount,
  mood = 'day',
  onMoodChange,
  onOpenProfile,
  onOpenChat,
}) => {
  const [startOpen, setStartOpen] = useState(false);
  const [soundOn, setSoundOn] = useState(isSoundEnabled());
  const [isPlayingCassette, setIsPlayingCassette] = useState(false);
  const [currentTimeStr, setCurrentTimeStr] = useState('');
  const [minutesToBedtime, setMinutesToBedtime] = useState(45);
  const menuRef = useRef(null);

  useEffect(() => {
    return onSoundChange((val) => setSoundOn(val));
  }, []);

  // Update real clock and bedtime countdown
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hrs = now.getHours().toString().padStart(2, '0');
      const mins = now.getMinutes().toString().padStart(2, '0');
      setCurrentTimeStr(`${hrs}:${mins}`);

      // Bedtime at 23:00 (11 PM)
      const targetBedtime = new Date(now);
      targetBedtime.setHours(23, 0, 0, 0);
      let diffMins = Math.round((targetBedtime - now) / 60000);
      if (diffMins < 0) diffMins += 24 * 60;
      setMinutesToBedtime(diffMins);
    };

    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  // Close start menu when clicking outside
  useEffect(() => {
    const handleDocClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setStartOpen(false);
      }
    };
    if (startOpen) {
      document.addEventListener('mousedown', handleDocClick);
    }
    return () => document.removeEventListener('mousedown', handleDocClick);
  }, [startOpen]);

  const handleToggleSound = () => {
    const next = !soundOn;
    setSoundEnabled(next);
    if (next) playHeartPopSound();
  };

  const handlePlayCassette = () => {
    playBubblePopSound(true);
    if (!soundOn) {
      setSoundEnabled(true);
    }
    setIsPlayingCassette(true);
    const lullabyNotes = [
      { note: 'C4', d: 350 },
      { note: 'E4', d: 350 },
      { note: 'G4', d: 450 },
      { note: 'A4', d: 500 },
      { note: 'G4', d: 350 },
      { note: 'E4', d: 700 },
    ];
    playMelody(lullabyNotes, () => {
      setIsPlayingCassette(false);
    });
  };

  const handleStartItemClick = (action) => {
    playBubblePopSound(true);
    setStartOpen(false);
    action();
  };

  return (
    <>
      {/* Floating Bottom-Right "Talk to Pip" Bubble (inspired by hello-world-pip.vercel.app) */}
      <div className="fixed bottom-14 right-4 z-40 animate-bounce duration-1000">
        <button
          onClick={() => {
            playBubblePopSound(true);
            onOpenChat?.();
          }}
          className="group relative flex items-center gap-2 px-3.5 py-2 rounded-full bg-gradient-to-r from-[#80244a] via-[#9e3c62] to-[#80244a] text-white shadow-[0_6px_20px_rgba(128,36,74,0.35)] border-2 border-white/60 hover:scale-105 active:scale-95 transition-all cursor-pointer"
          title="Talk with Pip the Skull Baby"
        >
          {/* Pip Avatar with unread badge */}
          <div className="relative w-7 h-7 rounded-full bg-white/20 p-0.5 overflow-hidden flex items-center justify-center">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCd5MJ7oP6VykoZLhwGPh-OjfPDOadl0cLfcumC_RAn4_u9pu7edGRULyOJZ-8njSzYBt5pzneURCd262RBX6psJzfSH2q2ctV1VcacdLz9Wy1WIU4rSWSYJDqMmFwSPO64e7mHoUXz8uy0KvfWfMyiSqCi-f3RzVKeOtXDhtX5kis-ajlBxzsWOAtaal1Ub724PAktGzOxvoKit11R40Ibsu_pqpMYy5MXrM9-sFhT0isErJuJDpkbC698NuSGh6cZhA"
              alt="Pip"
              className="w-full h-full object-contain"
            />
            {/* Unread dot */}
            <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-[#F7B731] text-[#3e001d] text-[9px] font-extrabold flex items-center justify-center ring-1 ring-white shadow-xs">
              1
            </span>
          </div>
          <span className="font-headline font-bold text-xs tracking-tight">
            talk to pip
          </span>
          <span className="material-symbols-outlined text-sm text-[#FFEAA7] group-hover:rotate-12 transition-transform">
            chat
          </span>
        </button>
      </div>

      {/* Retro DreamOS Taskbar (inspired by hax-baby-1.vercel.app and retro aesthetics) */}
      <footer
        ref={menuRef}
        className="fixed bottom-0 inset-x-0 z-40 h-11 bg-[#E8DAEC]/95 backdrop-blur-md border-t-2 border-white shadow-[0_-3px_12px_rgba(105,81,154,0.12)] px-2 sm:px-4 flex items-center justify-between text-xs select-none"
      >
        {/* Left: [💀 Start] Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              playChimeNote('C5', 0.3);
              setStartOpen((prev) => !prev);
            }}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md font-headline font-bold text-xs shadow-xs transition-all cursor-pointer border ${
              startOpen
                ? 'bg-[#80244a] text-white border-[#550c2a] shadow-inner'
                : 'bg-[#FFF7FA] hover:bg-white text-[#3F2837] border-[#d8c3dc] hover:border-[#80244a]'
            }`}
          >
            <span className="text-sm">💀</span>
            <span className="tracking-wide">Start</span>
          </button>

          {/* Quick taskbar link pills on larger screens */}
          <div className="hidden md:flex items-center gap-1 text-[11px]">
            <button
              onClick={() => onSelectTab('portfolio-home')}
              className={`px-2.5 py-0.5 rounded border transition-colors ${
                currentTab === 'portfolio-home'
                  ? 'bg-white text-[#80244a] font-bold border-[#c9aeff]'
                  : 'text-[#62535F] hover:bg-white/60 border-transparent'
              }`}
            >
              ☁️ Cloudscape
            </button>
            <button
              onClick={() => onSelectTab('dream-inventions')}
              className={`px-2.5 py-0.5 rounded border transition-colors ${
                currentTab === 'dream-inventions'
                  ? 'bg-white text-[#80244a] font-bold border-[#c9aeff]'
                  : 'text-[#62535F] hover:bg-white/60 border-transparent'
              }`}
            >
              🛠️ Workshop
            </button>
            <button
              onClick={() => onSelectTab('dreamcatcher-arcade')}
              className={`px-2.5 py-0.5 rounded border transition-colors ${
                currentTab === 'dreamcatcher-arcade'
                  ? 'bg-white text-[#80244a] font-bold border-[#c9aeff]'
                  : 'text-[#62535F] hover:bg-white/60 border-transparent'
              }`}
            >
              🎮 Arcade
            </button>
          </div>
        </div>

        {/* Right: Retro System Tray */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0 text-[#3F2837]">
          {/* Cassette Lullaby Player */}
          <button
            onClick={handlePlayCassette}
            className={`flex items-center gap-1 px-2 py-0.5 rounded border font-mono text-[11px] shadow-2xs transition-all cursor-pointer ${
              isPlayingCassette
                ? 'bg-[#FFE3E8] border-[#80244a] text-[#80244a] animate-pulse'
                : 'bg-white/90 hover:bg-white border-[#d8c3dc] text-[#544247]'
            }`}
            title="Play Pentatonic Bedtime Cassette Lullaby"
          >
            <span className="text-xs">📼</span>
            <span className="hidden xs:inline font-bold">
              {isPlayingCassette ? '♫ Playing...' : 'Lullaby'}
            </span>
            <span className="material-symbols-outlined text-xs">
              {isPlayingCassette ? 'pause' : 'play_arrow'}
            </span>
          </button>

          {/* CRT Monitor DreamOS Shortcut */}
          <button
            onClick={() => {
              playBubblePopSound(true);
              onOpenProfile?.();
            }}
            className="p-1 px-1.5 rounded bg-white/90 hover:bg-white border border-[#d8c3dc] text-[#69519a] hover:text-[#80244a] transition-colors cursor-pointer flex items-center gap-1"
            title="Open DreamOS Certificate & Profile Dossier"
          >
            <span className="material-symbols-outlined text-[15px]">tv</span>
            <span className="hidden sm:inline text-[10px] font-bold font-mono">DreamOS</span>
          </button>

          {/* Hit Counter Odometer */}
          <div className="hidden sm:flex items-center gap-1 px-2 py-0.5 rounded bg-[#21191F] text-[#FFEAA7] font-mono text-[11px] shadow-inner border border-white/20">
            <span className="text-[9px] text-[#F7B731]">★</span>
            <span>{dreamCount.toString().padStart(6, '0').replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</span>
          </div>

          {/* Bedtime Clock */}
          <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-white/80 border border-[#d8c3dc] font-mono text-[10px] sm:text-[11px]">
            <span className="text-[#80244a] font-bold">{currentTimeStr || '22:15'}</span>
            <span className="hidden xs:inline text-[#62535F]">
              · bedtime in {minutesToBedtime > 0 ? `${minutesToBedtime}m` : 'now!'}
            </span>
          </div>
        </div>

        {/* Nostalgic Start Menu Popup */}
        {startOpen && (
          <div className="absolute bottom-12 left-2 z-50 w-72 sm:w-80 bg-[#FFF7FA] rounded-2xl shadow-2xl border-2 border-[#d8c3dc] p-3 text-left animate-in slide-in-from-bottom-2 duration-150">
            {/* Start Menu Header */}
            <div className="flex items-center gap-2.5 pb-2.5 mb-2 border-b border-[#eedee6] bg-gradient-to-r from-[#80244a] to-[#9e3c62] text-white p-2.5 rounded-xl">
              <div className="w-9 h-9 rounded-full bg-white/20 p-0.5 shrink-0">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCd5MJ7oP6VykoZLhwGPh-OjfPDOadl0cLfcumC_RAn4_u9pu7edGRULyOJZ-8njSzYBt5pzneURCd262RBX6psJzfSH2q2ctV1VcacdLz9Wy1WIU4rSWSYJDqMmFwSPO64e7mHoUXz8uy0KvfWfMyiSqCi-f3RzVKeOtXDhtX5kis-ajlBxzsWOAtaal1Ub724PAktGzOxvoKit11R40Ibsu_pqpMYy5MXrM9-sFhT0isErJuJDpkbC698NuSGh6cZhA"
                  alt="Pip"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="min-w-0">
                <h4 className="font-headline font-bold text-sm tracking-tight leading-tight">
                  Pip the Skull Baby
                </h4>
                <p className="text-[10px] text-[#FFEAA7] font-mono">
                  DreamOS 98 · Midnight Nursery
                </p>
              </div>
            </div>

            {/* Menu Items List */}
            <div className="flex flex-col gap-1 text-xs">
              <button
                onClick={() => handleStartItemClick(() => onSelectTab('portfolio-home'))}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-[#FFE3E8] hover:text-[#80244a] transition-all text-left cursor-pointer"
              >
                <span className="text-base">☁️</span>
                <div>
                  <span className="font-bold block">Cloudscape &amp; Dreamland Map</span>
                  <span className="text-[10px] text-[#62535F] block">Explore Pip's interactive world</span>
                </div>
              </button>

              <button
                onClick={() => handleStartItemClick(() => onSelectTab('dream-inventions'))}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-[#FFE3E8] hover:text-[#80244a] transition-all text-left cursor-pointer"
              >
                <span className="text-base">🛠️</span>
                <div>
                  <span className="font-bold block">The Mushroom Workshop</span>
                  <span className="text-[10px] text-[#62535F] block">AI Dream Inventions &amp; Forge</span>
                </div>
              </button>

              <button
                onClick={() => handleStartItemClick(() => onSelectTab('dreamcatcher-arcade'))}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-[#FFE3E8] hover:text-[#80244a] transition-all text-left cursor-pointer"
              >
                <span className="text-base">🎮</span>
                <div>
                  <span className="font-bold block">Dreamcatcher Arcade</span>
                  <span className="text-[10px] text-[#62535F] block">Catch stars and avoid nightmare moths</span>
                </div>
              </button>

              <button
                onClick={() => handleStartItemClick(() => onSelectTab('bedtime-storybook'))}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-[#FFE3E8] hover:text-[#80244a] transition-all text-left cursor-pointer"
              >
                <span className="text-base">📖</span>
                <div>
                  <span className="font-bold block">Bedtime Storybook</span>
                  <span className="text-[10px] text-[#62535F] block">Interactive illustrated canon story</span>
                </div>
              </button>

              <button
                onClick={() => handleStartItemClick(() => onSelectTab('bedtime-wall'))}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-[#FFE3E8] hover:text-[#80244a] transition-all text-left cursor-pointer"
              >
                <span className="text-base">📝</span>
                <div>
                  <span className="font-bold block">Bedtime Wall &amp; Guestbook</span>
                  <span className="text-[10px] text-[#62535F] block">Leave a cozy note for midnight dreamers</span>
                </div>
              </button>

              <button
                onClick={() => handleStartItemClick(() => onOpenProfile?.())}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-[#FFE3E8] hover:text-[#80244a] transition-all text-left cursor-pointer"
              >
                <span className="text-base">🏆</span>
                <div>
                  <span className="font-bold block">Official Dreamer Medallion</span>
                  <span className="text-[10px] text-[#62535F] block">View Imagen-generated certificate</span>
                </div>
              </button>

              <button
                onClick={() => handleStartItemClick(() => onOpenChat?.())}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-[#FFE3E8] hover:text-[#80244a] transition-all text-left cursor-pointer"
              >
                <span className="text-base">📻</span>
                <div>
                  <span className="font-bold block">Radio Chat with Pip</span>
                  <span className="text-[10px] text-[#62535F] block">In-character baby voice dialogue</span>
                </div>
              </button>
            </div>

            {/* Start Menu Footer */}
            <div className="pt-2 mt-2 border-t border-[#eedee6] flex items-center justify-between text-[11px] text-[#62535F]">
              <span className="font-mono">Pip · Junior Dream Engineer</span>
              <button
                onClick={() => {
                  const next = mood === 'night' ? 'day' : 'night';
                  onMoodChange?.(next);
                  setStartOpen(false);
                }}
                className="px-2 py-0.5 rounded bg-white border border-[#d8c3dc] hover:text-[#80244a] font-bold"
              >
                🌙 Toggle Night
              </button>
            </div>
          </div>
        )}
      </footer>
    </>
  );
};
