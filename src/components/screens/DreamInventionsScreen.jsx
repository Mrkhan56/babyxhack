import React, { useState } from 'react';
import {
  playChimeNote,
  playMelody,
  playTone,
  playLanternResonance,
  playPageTurnSound,
  playWoodBlockSound,
} from '../../utils/audio.js';
import { AIForgeInvention } from '../AIForgeInvention.jsx';

export const DreamInventionsScreen = ({ onSelectTab }) => {
  const [activeNote, setActiveNote] = useState(null);
  const [playingMelodyName, setPlayingMelodyName] = useState(null);
  const [waveformHeights, setWaveformHeights] = useState([8, 14, 22, 10, 18, 6]);
  const [warmthRadius, setWarmthRadius] = useState(75);
  const [roomMood, setRoomMood] = useState('day');
  const [waypointText, setWaypointText] = useState(
    'Click any nursery station node above to view live dream route stats'
  );
  const [blockJiggle, setBlockJiggle] = useState({});
  const [flippedCards, setFlippedCards] = useState({});

  const kickWaveform = () => {
    setWaveformHeights([
      Math.floor(Math.random() * 20) + 6,
      Math.floor(Math.random() * 26) + 8,
      Math.floor(Math.random() * 28) + 10,
      Math.floor(Math.random() * 22) + 8,
      Math.floor(Math.random() * 24) + 6,
      Math.floor(Math.random() * 16) + 4,
    ]);
    setTimeout(() => {
      setWaveformHeights([8, 14, 22, 10, 18, 6]);
    }, 450);
  };

  const handleChimePress = (note) => {
    setActiveNote(note);
    playChimeNote(note, 0.9);
    kickWaveform();
    setTimeout(() => setActiveNote(null), 300);
  };

  const handlePlayPreset = (type) => {
    if (playingMelodyName) return;
    setPlayingMelodyName(type === 'crib' ? 'Crib Lullaby' : 'Nebula Box');

    const presets = {
      crib: [
        { note: 'C4', d: 340 },
        { note: 'E4', d: 340 },
        { note: 'G4', d: 340 },
        { note: 'E4', d: 340 },
        { note: 'A4', d: 340 },
        { note: 'G4', d: 340 },
        { note: 'C5', d: 450 },
        { note: 'G4', d: 500 },
      ],
      nebula: [
        { note: 'E4', d: 340 },
        { note: 'G4', d: 340 },
        { note: 'A4', d: 340 },
        { note: 'C5', d: 340 },
        { note: 'A4', d: 340 },
        { note: 'G4', d: 340 },
        { note: 'D4', d: 340 },
        { note: 'E4', d: 500 },
      ],
    };

    const seq = presets[type];
    playMelody(seq, () => {
      setPlayingMelodyName(null);
    });
  };

  const handleBlockClick = (id, note) => {
    playWoodBlockSound(280);
    setTimeout(() => playChimeNote(note, 0.5), 30);
    setBlockJiggle((prev) => ({ ...prev, [id]: true }));
    setTimeout(() => {
      setBlockJiggle((prev) => ({ ...prev, [id]: false }));
    }, 400);
  };

  const toggleFlipCard = (index) => {
    playPageTurnSound();
    setFlippedCards((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <div className="w-full flex flex-col gap-10 lg:gap-14">
      {/* Sub-Header / Workshop Banner */}
      <section className="w-full">
        <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-6 bg-white rounded-3xl p-6 sm:p-8 shadow-md border border-[#F3E8DC]">
          <div className="flex flex-col gap-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-[#FFE3E8] px-3 py-0.5 text-xs text-[#80244a] font-bold">
                Nursery Workshop Catalog · Rev 4.2
              </span>
              <span className="rounded-full bg-[#FFFAEB] px-3 py-0.5 text-xs text-[#5f4200] border border-[#FFEAA7] font-bold">
                Field Tested in Cribs &amp; Tree Dens
              </span>
            </div>
            <h1 className="font-headline font-bold text-3xl sm:text-4xl text-[#3F2837] tracking-tight">
              Junior Dream Inventions
            </h1>
            <p className="text-sm sm:text-base text-[#62535F] leading-relaxed">
              Pip’s handcrafted prototypes engineered for quiet midnight hours. Each patent combines pillow-soft aerodynamics, pentatonic wind-up gears, and gentle star-luminescence.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-[#FFF9F2] p-3.5 rounded-2xl border border-[#F3E8DC] shrink-0">
            <div className="flex flex-col text-right">
              <span className="text-[10px] text-[#62535F] uppercase font-bold">
                Total Active Patents
              </span>
              <span className="font-headline font-bold text-xl text-[#3F2837]">06 Inventions</span>
            </div>
            <div className="w-11 h-11 rounded-full bg-[#9e3c62] text-white flex items-center justify-center shadow-xs">
              <span className="material-symbols-outlined text-2xl">precision_manufacturing</span>
            </div>
          </div>
        </div>
      </section>

      {/* GEMINI AI DREAM INVENTION FORGE */}
      <AIForgeInvention />

      {/* INVENTION 01: The Lullaby Lab Synthesizer */}
      <article className="bg-white rounded-3xl shadow-md p-6 sm:p-8 border border-[#F3E8DC] overflow-hidden relative">
        <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-[#FFE3E8]/30 blur-3xl pointer-events-none"></div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5 flex flex-col items-center justify-center bg-[#FFF9F2] rounded-2xl p-6 relative group border border-[#F3E8DC]">
            <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full shadow-xs border border-[#F3E8DC]">
              <span className="material-symbols-outlined text-[#F7B731] text-sm">verified</span>
              <span className="text-[10px] text-[#3F2837] font-bold">PROTOTYPE #01</span>
            </div>

            <div className="relative w-full max-w-[320px] aspect-square flex items-center justify-center">
              <img
                alt="Pip's hand-crafted pastel unicorn music box"
                className="w-full h-full object-contain rounded-xl transition-transform duration-500 group-hover:scale-105"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAsfohBoqxFr8gL4muYO_kccLxtGeWUkkPM5yldKy82uzszJtJ-KDSPClSK6ZmtDaxqnuHTouDpqqaSYNs-Ur5dbUie4_4lTPW7b6PKhe_TzATmCeRDIQBJVsYRuO351wT_Pk0ZUZkyAzS9lPedCigBJddwx9ruQ4DBJrnDQxLQgZDZOcUHL9XncTDCUh29vqoiViSvfpfGEf79OKmE6TMilRcgEuzARX_qXFE8Zc8Xo56pM627L2zyaxvUi6zV-naNbQ"
              />
              <span className="absolute top-6 right-6 text-[#F7B731] animate-bounce material-symbols-outlined text-lg">auto_awesome</span>
              <span className="absolute bottom-8 left-6 text-[#E88D9D] material-symbols-outlined text-sm">star</span>
            </div>

            <div className="w-full flex items-center justify-between pt-2 text-[11px] font-bold text-[#62535F]">
              <span>Material: Glazed Starlight Clay</span>
              <span>Chime Span: C4 – C5</span>
            </div>
          </div>

          <div className="lg:col-span-7 flex flex-col gap-5">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#80244a] font-bold">Chamber of Harmonics</span>
                <span className="text-xs text-[#62535F]">· Audio Engine V2.0</span>
              </div>
              <h2 className="font-headline font-bold text-2xl text-[#3F2837]">
                The Lullaby Lab Synthesizer
              </h2>
              <p className="text-xs sm:text-sm text-[#62535F] leading-relaxed">
                Engineered with five pentatonic brass tines. This specific tuning interval guarantees that no matter what combination of chime notes sleepy fingers strike, the harmony remains utterly soothing and incapable of creating discord.
              </p>
            </div>

            <div className="flex flex-col gap-2 bg-[#FFF9F2] p-4 sm:p-5 rounded-2xl border border-[#F3E8DC]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#3F2837]">
                  Interactive Sound Tines (Click to Chime):
                </span>

                <div className="flex items-center gap-1 h-7">
                  {waveformHeights.map((h, idx) => (
                    <div
                      key={idx}
                      className="w-1 rounded-full bg-[#80244a] transition-all duration-300"
                      style={{
                        height: `${h}px`,
                        backgroundColor: idx % 2 === 0 ? '#80244a' : '#F7B731',
                      }}
                    />
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-5 gap-2 pt-1">
                {[
                  { note: 'C4', freq: '261 Hz', label: 'C' },
                  { note: 'D4', freq: '293 Hz', label: 'D' },
                  { note: 'E4', freq: '329 Hz', label: 'E' },
                  { note: 'G4', freq: '392 Hz', label: 'G' },
                  { note: 'A4', freq: '440 Hz', label: 'A' },
                ].map((item) => (
                  <button
                    key={item.note}
                    onClick={() => handleChimePress(item.note)}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl shadow-xs transition-all text-center group active:scale-90 cursor-pointer ${
                      activeNote === item.note
                        ? 'bg-[#80244a] text-white scale-95'
                        : 'bg-white text-[#80244a] hover:bg-[#FFE3E8] border border-[#F3E8DC]'
                    }`}
                  >
                    <span className="font-headline font-bold text-lg group-hover:scale-110 transition-transform">
                      {item.label}
                    </span>
                    <span className="text-[10px] text-[#62535F]">{item.freq}</span>
                    <span className="material-symbols-outlined text-xs text-[#F7B731] mt-1">music_note</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs text-[#62535F] italic">
                {playingMelodyName ? `Chiming: ${playingMelodyName}...` : 'Wind the key or tap chimes'}
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePlayPreset('crib')}
                  className="bg-[#9e3c62] text-white text-xs font-semibold px-4 py-2 rounded-full hover:bg-[#80244a] transition-all flex items-center gap-1.5 shadow-xs active:scale-95 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">play_circle</span>
                  Play “Crib Lullaby”
                </button>
                <button
                  onClick={() => handlePlayPreset('nebula')}
                  className="bg-[#EDE7F6] text-[#69519a] text-xs font-semibold px-4 py-2 rounded-full hover:bg-[#eaddff] transition-all flex items-center gap-1.5 active:scale-95 border border-[#c9aeff]/30 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">hourglass_top</span>
                  “Nebula Box”
                </button>
              </div>
            </div>
          </div>
        </div>
      </article>

      {/* INVENTION 02: Nightlight Luminescence Studio */}
      <article className="bg-white rounded-3xl shadow-md p-6 sm:p-8 border border-[#F3E8DC] overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6 flex flex-col gap-5 order-2 lg:order-1">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#69519a] font-bold">Patent #411-N</span>
                <span className="text-xs text-[#62535F]">· Soft Glow Technology</span>
              </div>
              <h2 className="font-headline font-bold text-2xl text-[#3F2837]">
                The Moon-Bell Bedside Lantern
              </h2>
              <p className="text-xs sm:text-sm text-[#62535F] leading-relaxed">
                Pip crafted this dome light from porous porcelain with carved moon-star silhouettes. The interior uses cold-light phosphor stars that never emit heat, keeping nursery cribs safe during nocturnal flight hours.
              </p>
            </div>

            <div className="bg-[#FFF9F2] rounded-2xl p-4 sm:p-5 flex flex-col gap-2 border border-[#F3E8DC]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#3F2837] flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[#F7B731] text-base">light_mode</span>
                  Luminescence Warmth Radius
                </span>
                <span className="font-headline font-bold text-sm text-[#80244a]">{warmthRadius}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                value={warmthRadius}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setWarmthRadius(val);
                  playLanternResonance(val);
                }}
                className="w-full h-2 bg-[#faeaf2] rounded-lg appearance-none cursor-pointer accent-[#80244a]"
              />
              <div className="flex justify-between text-[10px] text-[#62535F]">
                <span>Dim Crescent (10%)</span>
                <span>Slumber Warm (50%)</span>
                <span>Full Starlight (100%)</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#62535F]">Room Ambience:</span>
                <div className="inline-flex bg-[#FFF9F2] p-1 rounded-full border border-[#F3E8DC]">
                  <button
                    onClick={() => setRoomMood('day')}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer ${
                      roomMood === 'day'
                        ? 'bg-white text-[#80244a] shadow-xs'
                        : 'text-[#62535F] hover:text-[#3F2837]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-xs">sunny</span> Day
                  </button>
                  <button
                    onClick={() => setRoomMood('night')}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer ${
                      roomMood === 'night'
                        ? 'bg-[#80244a] text-white shadow-xs'
                        : 'text-[#62535F] hover:text-[#3F2837]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-xs">dark_mode</span> Midnight
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-[#62535F]">
                <span className="material-symbols-outlined text-[#69519a] text-sm">battery_charging_full</span>
                <span>Infinite Solar-Starlight Core</span>
              </div>
            </div>
          </div>

          <div
            className={`lg:col-span-6 order-1 lg:order-2 flex flex-col items-center justify-center rounded-2xl p-6 sm:p-8 relative transition-colors duration-500 overflow-hidden min-h-[340px] border border-[#F3E8DC] ${
              roomMood === 'night' ? 'bg-[#21191F]' : 'bg-[#FFF9F2]'
            }`}
          >
            <div
              className="absolute w-72 h-72 rounded-full bg-[#F7B731]/30 blur-3xl pointer-events-none transition-all duration-300"
              style={{
                opacity: (warmthRadius / 100) * 0.95,
                transform: `scale(${0.75 + (warmthRadius / 100) * 0.5})`,
              }}
            ></div>

            <div className="relative z-10 w-full max-w-[280px] aspect-square flex items-center justify-center">
              <img
                alt="Pip's hand-crafted ceramic moon-bell lantern"
                className="w-full h-full object-contain filter drop-shadow-[0_12px_24px_rgba(247,183,49,0.3)] transition-transform duration-300 hover:scale-105"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDqawTN33_49wRE78YNtVutkYG1wqvCa_hgeG4oNMHa_2M1QW9Cia6t8_s2ZXGEIxHS1ZqdL_stlMKrRQI1yuxXdTU5oJk0fKMWN9RhReYNxN8wmB2pd4z5YDPPze-Vt3l6RnrHs1SdcEOo50OFRUlwx1LqAWHFNU8k6DEFjyiB_LF-Mb92Hzw76qtNp4cW-dxDDytleLHkJgmhkp0IZsc9zJYYjYDE_J8HcyN02s5GNZqBoHW3GghlBIQmIFZR_zbHLA"
              />
            </div>
          </div>
        </div>
      </article>

      {/* INVENTION 03 & 04 ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <article className="lg:col-span-7 bg-white rounded-3xl shadow-md p-6 sm:p-7 flex flex-col justify-between border border-[#F3E8DC]">
          <div className="flex flex-col gap-1 mb-3">
            <h2 className="font-headline font-bold text-xl text-[#3F2837]">
              Dream Delivery Routes
            </h2>
            <p className="text-xs text-[#62535F]">
              Pip navigates by starlight through cozy rooftop corridors. Click any waystation along the delivery vector to verify nursery arrival times and cloud density.
            </p>
          </div>

          <div className="relative w-full bg-[#FFF9F2] rounded-2xl p-4 overflow-hidden flex flex-col items-center justify-center border border-[#F3E8DC]">
            <svg className="w-full h-auto max-h-[250px] text-[#3F2837]" viewBox="0 0 540 260">
              <circle cx="270" cy="130" r="110" stroke="currentColor" strokeDasharray="4 4" strokeOpacity="0.08" fill="none" />
              <path
                d="M 60,190 C 130,70 190,220 270,130 C 350,40 430,170 480,90"
                stroke="#80244a"
                strokeDasharray="6 4"
                strokeWidth="3"
                fill="none"
              />
              {[
                { name: 'Crib Alpha', cx: 60, cy: 190, note: 'C4', text: 'Waypoint 1: Crib Alpha — 3 Soft Lullabies Dispatched (ETA: Midnight)' },
                { name: 'Puppy Den', cx: 170, cy: 170, note: 'E4', text: 'Waypoint 2: Puppy Den — Warm Vanilla Blanket Wrapped (ETA: 01:15 AM)' },
                { name: 'HQ: Room 07', cx: 270, cy: 130, note: 'G4', text: 'HQ: Midnight Nursery Room 07 — Pip reloading dream pouch with golden star seeds' },
                { name: 'Kitten Chimney', cx: 370, cy: 80, note: 'A4', text: 'Waypoint 4: Kitten Chimney — Soft Purr Resonance 100% Calibrated' },
                { name: 'Barnaby’s Hedge', cx: 480, cy: 90, note: 'C5', text: 'Waypoint 5: Barnaby’s Hedge — Tiny Hedgehog dream guard lanterns alight' },
              ].map((wp, i) => (
                <g
                  key={i}
                  className="cursor-pointer"
                  onClick={() => {
                    setWaypointText(wp.text);
                    playChimeNote(wp.note, 0.5);
                  }}
                >
                  <circle cx={wp.cx} cy={wp.cy} fill="#ffd9e2" r="10" />
                  <circle cx={wp.cx} cy={wp.cy} fill="#80244a" r="4.5" />
                  <text fill="#62535F" fontSize="10" fontWeight="700" textAnchor="middle" x={wp.cx} y={wp.cy > 140 ? wp.cy + 22 : wp.cy - 12}>
                    {wp.name}
                  </text>
                </g>
              ))}
            </svg>

            <div className="w-full mt-3 bg-white px-4 py-2.5 rounded-xl flex items-center justify-between shadow-xs border border-[#F3E8DC]">
              <span className="text-xs font-medium text-[#3F2837]">{waypointText}</span>
              <span className="text-xs text-[#69519a] font-bold hidden sm:inline">PULSE: OK</span>
            </div>
          </div>
        </article>

        <article className="lg:col-span-5 bg-white rounded-3xl shadow-md p-6 sm:p-7 flex flex-col justify-between border border-[#F3E8DC]">
          <div className="flex flex-col gap-1 mb-3">
            <h2 className="font-headline font-bold text-xl text-[#3F2837]">
              Tactile Nursery Blocks
            </h2>
            <p className="text-xs text-[#62535F]">
              Pip hand-carves each block from lightweight balsa wood, infused with tiny bell chime seeds. Tap them to trigger gentle acoustic rattles and balance tests.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 bg-[#FFF9F2] p-4 rounded-2xl border border-[#F3E8DC]">
            {[
              { id: 'star', label: 'STAR', weight: '14g · Maple', note: 'C4', bg: 'bg-[#FFFAEB]', icon: 'star', color: 'text-[#F7B731]' },
              { id: 'cloud', label: 'CLOUD', weight: '8g · Fluff Core', note: 'E4', bg: 'bg-[#EDE7F6]', icon: 'cloud', color: 'text-[#69519a]' },
              { id: 'moon', label: 'MOON', weight: '16g · Ceramic', note: 'G4', bg: 'bg-[#FFE3E8]', icon: 'bedtime', color: 'text-[#80244a]' },
              { id: 'dream', label: 'DREAM', weight: '5g · Velvet', note: 'C5', bg: 'bg-[#ffd9e2]', icon: 'favorite', color: 'text-[#80244a]' },
            ].map((b) => (
              <button
                key={b.id}
                onClick={() => handleBlockClick(b.id, b.note)}
                className={`bg-white rounded-xl p-4 flex flex-col items-center justify-center gap-1.5 shadow-xs border border-[#F3E8DC] transition-transform select-none cursor-pointer ${
                  blockJiggle[b.id] ? 'scale-90 rotate-6' : 'hover:scale-105 active:scale-95'
                }`}
              >
                <div className={`w-11 h-11 rounded-full ${b.bg} flex items-center justify-center ${b.color}`}>
                  <span className="material-symbols-outlined text-2xl">{b.icon}</span>
                </div>
                <span className="font-headline font-bold text-sm text-[#3F2837]">{b.label}</span>
                <span className="text-[10px] text-[#62535F]">{b.weight}</span>
              </button>
            ))}
          </div>

          <div className="pt-3 flex items-center justify-between text-xs text-[#62535F]">
            <span>Smooth Edges: 100% Drool-Proof</span>
            <span className="font-bold text-[#5f4200]">Safety Class: AAA</span>
          </div>
        </article>
      </div>
    </div>
  );
};
