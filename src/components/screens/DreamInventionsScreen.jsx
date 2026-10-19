import React, { useState } from 'react';
import {
  playChimeNote,
  playMelody,
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
  const [roomMood, setRoomMood] = useState('night');
  const [waypointText, setWaypointText] = useState(
    'Click any nursery station node above to view live dream route stats'
  );
  const [blockJiggle, setBlockJiggle] = useState({});

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

  return (
    <div className="w-full flex flex-col gap-10 text-white">
      {/* Sub-Header / The Mushroom Workshop Banner */}
      <section className="w-full">
        <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-6 bg-[#231538]/90 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-2xl border-2 border-[#69519A]/40">
          <div className="flex flex-col gap-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-[#80244A] px-3.5 py-1 text-xs text-white font-bold border border-pink-400/30 flex items-center gap-1.5 shadow-sm">
                <span>🛠️</span>
                <span>The Mushroom Workshop</span>
              </span>
              <span className="rounded-full bg-[#1A1028] px-3.5 py-1 text-xs text-[#FFEAA7] border border-[#69519A]/50 font-bold">
                dreams &amp; things i make
              </span>
            </div>
            <h1 className="font-display font-bold text-3xl sm:text-4xl text-pink-300 tracking-tight">
              Junior Dream Inventions
            </h1>
            <p className="text-sm sm:text-base text-purple-200 leading-relaxed font-sans">
              Pip’s handcrafted prototypes engineered for quiet midnight hours. Each patent combines pillow-soft aerodynamics, pentatonic wind-up gears, and gentle star-luminescence.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-[#1A1028]/90 p-4 rounded-2xl border border-white/10 shrink-0 shadow-inner">
            <div className="flex flex-col text-right">
              <span className="text-[10px] text-purple-300 uppercase font-bold tracking-wider">
                Total Active Patents
              </span>
              <span className="font-display font-bold text-xl text-[#FFEAA7]">06 Inventions</span>
            </div>
            <div className="w-12 h-12 rounded-full bg-[#80244A] text-white flex items-center justify-center shadow-lg border border-pink-300/40">
              <span className="material-symbols-outlined text-2xl text-[#FFEAA7]">precision_manufacturing</span>
            </div>
          </div>
        </div>
      </section>

      {/* GEMINI AI DREAM INVENTION FORGE */}
      <div className="rounded-3xl overflow-hidden border-2 border-[#69519A]/40 shadow-2xl bg-[#231538]/90 backdrop-blur-md">
        <AIForgeInvention />
      </div>

      {/* INVENTION 01: The Lullaby Lab Synthesizer */}
      <article className="bg-[#231538]/90 backdrop-blur-md rounded-3xl shadow-2xl p-6 sm:p-8 border-2 border-[#69519A]/40 overflow-hidden relative">
        <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-pink-500/10 blur-3xl pointer-events-none"></div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5 flex flex-col items-center justify-center bg-[#1A1028]/90 rounded-3xl p-6 relative group border border-white/10 shadow-inner">
            <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 bg-[#2D1B4E]/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-md border border-white/20">
              <span className="material-symbols-outlined text-[#F7B731] text-sm">verified</span>
              <span className="text-[10px] text-[#FFEAA7] font-bold">PROTOTYPE #01</span>
            </div>

            <div className="relative w-full max-w-[320px] aspect-square flex items-center justify-center">
              <img
                alt="Pip's hand-crafted pastel unicorn music box"
                className="w-full h-full object-contain rounded-xl transition-transform duration-500 group-hover:scale-105 filter drop-shadow-[0_10px_20px_rgba(247,183,49,0.3)]"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAsfohBoqxFr8gL4muYO_kccLxtGeWUkkPM5yldKy82uzszJtJ-KDSPClSK6ZmtDaxqnuHTouDpqqaSYNs-Ur5dbUie4_4lTPW7b6PKhe_TzATmCeRDIQBJVsYRuO351wT_Pk0ZUZkyAzS9lPedCigBJddwx9ruQ4DBJrnDQxLQgZDZOcUHL9XncTDCUh29vqoiViSvfpfGEf79OKmE6TMilRcgEuzARX_qXFE8Zc8Xo56pM627L2zyaxvUi6zV-naNbQ"
              />
              <span className="absolute top-6 right-6 text-[#F7B731] animate-bounce material-symbols-outlined text-lg">auto_awesome</span>
              <span className="absolute bottom-8 left-6 text-pink-300 material-symbols-outlined text-sm">star</span>
            </div>

            <div className="w-full flex items-center justify-between pt-3 text-[11px] font-bold text-purple-200 border-t border-white/10">
              <span>Material: Glazed Starlight Clay</span>
              <span>Chime Span: C4 – C5</span>
            </div>
          </div>

          <div className="lg:col-span-7 flex flex-col gap-5">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#FFEAA7] font-bold uppercase tracking-wider">Chamber of Harmonics</span>
                <span className="text-xs text-purple-300">· Audio Engine V2.0</span>
              </div>
              <h2 className="font-display font-bold text-2xl sm:text-3xl text-pink-300">
                The Lullaby Lab Synthesizer
              </h2>
              <p className="text-xs sm:text-sm text-purple-200 leading-relaxed font-sans">
                Engineered with five pentatonic brass tines. This specific tuning interval guarantees that no matter what combination of chime notes sleepy fingers strike, the harmony remains utterly soothing and incapable of creating discord.
              </p>
            </div>

            <div className="flex flex-col gap-2 bg-[#1A1028]/90 p-5 rounded-2xl border border-white/10 shadow-inner">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#FFEAA7]">
                  Interactive Sound Tines (Click to Chime):
                </span>

                <div className="flex items-center gap-1.5 h-7">
                  {waveformHeights.map((h, idx) => (
                    <div
                      key={idx}
                      className="w-1.5 rounded-full transition-all duration-300"
                      style={{
                        height: `${h}px`,
                        backgroundColor: idx % 2 === 0 ? '#E84393' : '#F7B731',
                      }}
                    />
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-5 gap-2 pt-2">
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
                    className={`flex flex-col items-center justify-center p-3 rounded-2xl shadow-md transition-all text-center group active:scale-90 cursor-pointer border ${
                      activeNote === item.note
                        ? 'bg-[#80244A] text-white border-pink-300 scale-95 shadow-[0_0_15px_rgba(232,67,147,0.8)]'
                        : 'bg-[#2D1B4E]/80 text-[#FFEAA7] hover:bg-[#3D255E] border-white/10'
                    }`}
                  >
                    <span className="font-display font-bold text-lg group-hover:scale-110 transition-transform">
                      {item.label}
                    </span>
                    <span className="text-[10px] text-purple-200">{item.freq}</span>
                    <span className="material-symbols-outlined text-xs text-[#F7B731] mt-1">music_note</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <span className="text-xs text-purple-300 italic">
                {playingMelodyName ? `Chiming: ${playingMelodyName}...` : 'Wind the key or tap chimes'}
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePlayPreset('crib')}
                  className="bg-[#80244A] hover:bg-[#9e3c62] text-white text-xs font-bold px-4 py-2 rounded-full transition-all flex items-center gap-1.5 shadow-md active:scale-95 cursor-pointer border border-pink-400/30"
                >
                  <span className="material-symbols-outlined text-sm">play_circle</span>
                  Play “Crib Lullaby”
                </button>
                <button
                  onClick={() => handlePlayPreset('nebula')}
                  className="bg-[#2D1B4E] hover:bg-[#3D255E] text-[#FFEAA7] text-xs font-bold px-4 py-2 rounded-full transition-all flex items-center gap-1.5 active:scale-95 border border-white/20 cursor-pointer shadow-md"
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
      <article className="bg-[#231538]/90 backdrop-blur-md rounded-3xl shadow-2xl p-6 sm:p-8 border-2 border-[#69519A]/40 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6 flex flex-col gap-5 order-2 lg:order-1">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#FFEAA7] font-bold uppercase tracking-wider">Patent #411-N</span>
                <span className="text-xs text-purple-300">· Soft Glow Technology</span>
              </div>
              <h2 className="font-display font-bold text-2xl sm:text-3xl text-pink-300">
                The Moon-Bell Bedside Lantern
              </h2>
              <p className="text-xs sm:text-sm text-purple-200 leading-relaxed font-sans">
                Pip crafted this dome light from porous porcelain with carved moon-star silhouettes. The interior uses cold-light phosphor stars that never emit heat, keeping nursery cribs safe during nocturnal flight hours.
              </p>
            </div>

            <div className="bg-[#1A1028]/90 rounded-2xl p-5 flex flex-col gap-2.5 border border-white/10 shadow-inner">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#FFEAA7] flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[#F7B731] text-base">light_mode</span>
                  Luminescence Warmth Radius
                </span>
                <span className="font-display font-bold text-sm text-pink-300">{warmthRadius}%</span>
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
                className="w-full h-2 bg-[#2D1B4E] rounded-lg appearance-none cursor-pointer accent-[#F7B731]"
              />
              <div className="flex justify-between text-[10px] text-purple-300 font-medium">
                <span>Dim Crescent (10%)</span>
                <span>Slumber Warm (50%)</span>
                <span>Full Starlight (100%)</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs text-purple-200">Room Ambience:</span>
                <div className="inline-flex bg-[#1A1028] p-1 rounded-full border border-white/10">
                  <button
                    onClick={() => setRoomMood('day')}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer ${
                      roomMood === 'day'
                        ? 'bg-[#80244A] text-white shadow-xs'
                        : 'text-purple-300 hover:text-white'
                    }`}
                  >
                    <span className="material-symbols-outlined text-xs">sunny</span> Twilight
                  </button>
                  <button
                    onClick={() => setRoomMood('night')}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer ${
                      roomMood === 'night'
                        ? 'bg-[#80244A] text-white shadow-xs'
                        : 'text-purple-300 hover:text-white'
                    }`}
                  >
                    <span className="material-symbols-outlined text-xs">dark_mode</span> Midnight
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-[#FFEAA7]">
                <span className="material-symbols-outlined text-sm">battery_charging_full</span>
                <span>Infinite Solar-Starlight Core</span>
              </div>
            </div>
          </div>

          <div
            className={`lg:col-span-6 order-1 lg:order-2 flex flex-col items-center justify-center rounded-3xl p-6 sm:p-8 relative transition-colors duration-500 overflow-hidden min-h-[340px] border border-white/10 ${
              roomMood === 'night' ? 'bg-[#10081C]' : 'bg-[#1D112E]'
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
                className="w-full h-full object-contain filter drop-shadow-[0_12px_24px_rgba(247,183,49,0.4)] transition-transform duration-300 hover:scale-105"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDqawTN33_49wRE78YNtVutkYG1wqvCa_hgeG4oNMHa_2M1QW9Cia6t8_s2ZXGEIxHS1ZqdL_stlMKrRQI1yuxXdTU5oJk0fKMWN9RhReYNxN8wmB2pd4z5YDPPze-Vt3l6RnrHs1SdcEOo50OFRUlwx1LqAWHFNU8k6DEFjyiB_LF-Mb92Hzw76qtNp4cW-dxDDytleLHkJgmhkp0IZsc9zJYYjYDE_J8HcyN02s5GNZqBoHW3GghlBIQmIFZR_zbHLA"
              />
            </div>
          </div>
        </div>
      </article>

      {/* INVENTION 03 & 04 ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <article className="lg:col-span-7 bg-[#231538]/90 backdrop-blur-md rounded-3xl shadow-2xl p-6 sm:p-7 flex flex-col justify-between border-2 border-[#69519A]/40">
          <div className="flex flex-col gap-1 mb-3">
            <h2 className="font-display font-bold text-xl text-pink-300">
              Dream Delivery Routes
            </h2>
            <p className="text-xs text-purple-200">
              Pip navigates by starlight through cozy rooftop corridors. Click any waystation along the delivery vector to verify nursery arrival times and cloud density.
            </p>
          </div>

          <div className="relative w-full bg-[#1A1028]/90 rounded-2xl p-4 overflow-hidden flex flex-col items-center justify-center border border-white/10 shadow-inner">
            <svg className="w-full h-auto max-h-[250px] text-purple-200" viewBox="0 0 540 260">
              <circle cx="270" cy="130" r="110" stroke="currentColor" strokeDasharray="4 4" strokeOpacity="0.15" fill="none" />
              <path
                d="M 60,190 C 130,70 190,220 270,130 C 350,40 430,170 480,90"
                stroke="#FF8DA1"
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
                  className="cursor-pointer group"
                  onClick={() => {
                    setWaypointText(wp.text);
                    playChimeNote(wp.note, 0.5);
                  }}
                >
                  <circle cx={wp.cx} cy={wp.cy} fill="#FFB0C8" r="10" />
                  <circle cx={wp.cx} cy={wp.cy} fill="#80244A" r="4.5" />
                  <text fill="#FFEAA7" fontSize="10" fontWeight="700" textAnchor="middle" x={wp.cx} y={wp.cy > 140 ? wp.cy + 22 : wp.cy - 12}>
                    {wp.name}
                  </text>
                </g>
              ))}
            </svg>

            <div className="w-full mt-3 bg-[#2D1B4E] px-4 py-2.5 rounded-xl flex items-center justify-between shadow-xs border border-white/10">
              <span className="text-xs font-medium text-purple-100">{waypointText}</span>
              <span className="text-xs text-[#FFEAA7] font-bold hidden sm:inline">PULSE: OK</span>
            </div>
          </div>
        </article>

        <article className="lg:col-span-5 bg-[#231538]/90 backdrop-blur-md rounded-3xl shadow-2xl p-6 sm:p-7 flex flex-col justify-between border-2 border-[#69519A]/40">
          <div className="flex flex-col gap-1 mb-3">
            <h2 className="font-display font-bold text-xl text-pink-300">
              Tactile Nursery Blocks
            </h2>
            <p className="text-xs text-purple-200">
              Pip hand-carves each block from lightweight balsa wood, infused with tiny bell chime seeds. Tap them to trigger gentle acoustic rattles and balance tests.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 bg-[#1A1028]/90 p-4 rounded-2xl border border-white/10 shadow-inner">
            {[
              { id: 'star', label: 'STAR', weight: '14g · Maple', note: 'C4', bg: 'bg-amber-400/20', icon: 'star', color: 'text-[#F7B731]' },
              { id: 'cloud', label: 'CLOUD', weight: '8g · Fluff Core', note: 'E4', bg: 'bg-purple-400/20', icon: 'cloud', color: 'text-purple-300' },
              { id: 'moon', label: 'MOON', weight: '16g · Ceramic', note: 'G4', bg: 'bg-pink-400/20', icon: 'bedtime', color: 'text-pink-300' },
              { id: 'dream', label: 'DREAM', weight: '5g · Velvet', note: 'C5', bg: 'bg-rose-400/20', icon: 'favorite', color: 'text-rose-300' },
            ].map((b) => (
              <button
                key={b.id}
                onClick={() => handleBlockClick(b.id, b.note)}
                className={`bg-[#2D1B4E]/80 rounded-2xl p-4 flex flex-col items-center justify-center gap-1.5 shadow-md border border-white/10 transition-transform select-none cursor-pointer ${
                  blockJiggle[b.id] ? 'scale-90 rotate-6' : 'hover:scale-105 active:scale-95'
                }`}
              >
                <div className={`w-11 h-11 rounded-full ${b.bg} flex items-center justify-center ${b.color}`}>
                  <span className="material-symbols-outlined text-2xl">{b.icon}</span>
                </div>
                <span className="font-display font-bold text-sm text-[#FFEAA7]">{b.label}</span>
                <span className="text-[10px] text-purple-200">{b.weight}</span>
              </button>
            ))}
          </div>

          <div className="pt-3 flex items-center justify-between text-xs text-purple-300">
            <span>Smooth Edges: 100% Drool-Proof</span>
            <span className="font-bold text-[#FFEAA7]">Safety Class: AAA</span>
          </div>
        </article>
      </div>
    </div>
  );
};
