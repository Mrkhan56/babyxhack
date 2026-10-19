import React, { useRef, useState, useEffect } from 'react';
import { playChimeNote } from '../utils/audio.js';

export const DreamDeliveryScrollMap = () => {
  const containerRef = useRef(null);
  const pathRef = useRef(null);
  const [gliderPos, setGliderPos] = useState({ x: 60, y: 190 });
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeWaypoint, setActiveWaypoint] = useState(0);

  const waypoints = [
    { name: 'Crib Alpha', note: 'C4', eta: 'Midnight', status: '3 Soft Lullabies Dispatched', x: 60, y: 190 },
    { name: 'Puppy Den', note: 'E4', eta: '01:15 AM', status: 'Warm Vanilla Blanket Wrapped', x: 170, y: 170 },
    { name: 'HQ: Room 07', note: 'G4', eta: '02:00 AM', status: 'Pip reloading golden star pouch', x: 270, y: 130 },
    { name: 'Kitten Chimney', note: 'A4', eta: '03:10 AM', status: 'Purr resonance 100% Calibrated', x: 370, y: 80 },
    { name: 'Barnaby’s Hedge', note: 'C5', eta: 'Dawn', status: 'Nighttime acorn lanterns alight', x: 480, y: 90 },
  ];

  // Sync motion with viewport scroll while section is visible
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current || !pathRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const windowH = window.innerHeight;

      // Fraction of section visible in viewport
      const totalDist = rect.height + windowH;
      const currentPos = windowH - rect.top;
      const rawFraction = currentPos / totalDist;
      const progress = Math.max(0, Math.min(1, rawFraction));

      setScrollProgress(progress);

      const pathLength = pathRef.current.getTotalLength();
      const point = pathRef.current.getPointAtLength(progress * pathLength);
      setGliderPos({ x: point.x, y: point.y });

      // Determine active waypoint
      const nearestIdx = Math.min(
        waypoints.length - 1,
        Math.floor(progress * waypoints.length)
      );
      setActiveWaypoint(nearestIdx);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleManualScrub = (fraction) => {
    setScrollProgress(fraction);
    if (pathRef.current) {
      const pathLength = pathRef.current.getTotalLength();
      const point = pathRef.current.getPointAtLength(fraction * pathLength);
      setGliderPos({ x: point.x, y: point.y });
      const nearestIdx = Math.min(waypoints.length - 1, Math.floor(fraction * waypoints.length));
      setActiveWaypoint(nearestIdx);
      playChimeNote(waypoints[nearestIdx].note, 0.4);
    }
  };

  const currentWp = waypoints[activeWaypoint] || waypoints[0];

  return (
    <div
      ref={containerRef}
      className="relative w-full bg-gradient-to-b from-[#FFF9F2] via-white to-[#faeaf2] rounded-3xl p-5 sm:p-7 shadow-md border border-[#F3E8DC] overflow-hidden"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="rounded-full bg-[#EDE7F6] px-3 py-0.5 text-xs text-[#69519a] font-bold">
              ROUTE RADAR #88
            </span>
            <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
              Scroll-Synced Path Active
            </span>
          </div>
          <h3 className="font-headline font-bold text-xl text-[#3F2837]">
            Dream Delivery Routes Map
          </h3>
          <p className="text-xs text-[#62535F]">
            Pip’s starlight glider moves along the flight path in real-time as you scroll through the nursery!
          </p>
        </div>

        {/* Live Delivery Progress Pill */}
        <div className="bg-[#FFFAEB] border border-[#FFEAA7] px-3 py-1.5 rounded-2xl flex items-center gap-2 self-start sm:self-center shadow-xs">
          <span className="material-symbols-outlined text-[#F7B731] text-base">flight_takeoff</span>
          <div className="text-left">
            <span className="text-[9px] font-bold text-[#5f4200] block uppercase tracking-wider">Flight Progress</span>
            <span className="text-xs font-bold text-[#80244a]">{Math.round(scrollProgress * 100)}% Traversed</span>
          </div>
        </div>
      </div>

      {/* SVG Canvas Map */}
      <div className="relative w-full bg-[#21191F] rounded-2xl p-4 sm:p-6 overflow-hidden border border-[#eedee6]/30 shadow-inner">
        {/* Starry Night Sky Background in Map */}
        <div className="absolute inset-0 bg-radial from-[#322330] via-[#21191F] to-[#120c11] pointer-events-none"></div>

        <svg className="w-full h-auto max-h-[280px] relative z-10" viewBox="0 0 540 260">
          {/* Radar Distance Rings */}
          <circle cx="270" cy="130" r="110" stroke="#ffd9e2" strokeDasharray="4 4" strokeOpacity="0.12" fill="none" />
          <circle cx="270" cy="130" r="75" stroke="#ffd9e2" strokeOpacity="0.15" fill="none" />
          <circle cx="270" cy="130" r="40" stroke="#ffd9e2" strokeOpacity="0.2" fill="none" />

          {/* Background Flight Path */}
          <path
            d="M 60,190 C 130,70 190,220 270,130 C 350,40 430,170 480,90"
            stroke="rgba(255, 234, 167, 0.25)"
            strokeDasharray="4 4"
            strokeWidth="3"
            fill="none"
          />

          {/* Active Flight Path tracked in real time */}
          <path
            ref={pathRef}
            d="M 60,190 C 130,70 190,220 270,130 C 350,40 430,170 480,90"
            stroke="#F7B731"
            strokeWidth="3.5"
            strokeLinecap="round"
            fill="none"
            filter="drop-shadow(0 0 8px rgba(247, 183, 49, 0.8))"
          />

          {/* Waypoints */}
          {waypoints.map((wp, i) => (
            <g
              key={i}
              className="cursor-pointer group"
              onClick={() => {
                handleManualScrub(i / (waypoints.length - 1));
              }}
            >
              <circle
                cx={wp.x}
                cy={wp.y}
                r={activeWaypoint === i ? 14 : 9}
                fill={activeWaypoint === i ? '#F7B731' : '#ffd9e2'}
                className="transition-all duration-300"
              />
              <circle cx={wp.x} cy={wp.y} r={activeWaypoint === i ? 6 : 4} fill="#80244a" />
              <text
                x={wp.x}
                y={wp.y > 150 ? wp.y + 22 : wp.y - 14}
                textAnchor="middle"
                fill="#ffea9f"
                fontSize="10"
                fontWeight="700"
                fontFamily="Quicksand"
              >
                {wp.name}
              </text>
            </g>
          ))}

          {/* The Scroll-Driven Glider Icon (Pip's Starlight Glider) */}
          <g
            transform={`translate(${gliderPos.x}, ${gliderPos.y})`}
            className="transition-transform duration-75 ease-out"
          >
            {/* Pulsing Glider Halo */}
            <circle r="18" fill="rgba(247, 183, 49, 0.25)" className="animate-ping" />
            <circle r="12" fill="#F7B731" filter="drop-shadow(0 0 10px #F7B731)" />
            {/* Golden Star Icon */}
            <text
              textAnchor="middle"
              dominantBaseline="central"
              fontSize="12"
              fill="#5f4200"
              fontWeight="bold"
            >
              ★
            </text>
          </g>
        </svg>

        {/* Current Waypoint Telemetry Drawer */}
        <div className="relative z-10 mt-3 bg-black/50 backdrop-blur-md rounded-xl p-3 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-white">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#F7B731] animate-pulse"></span>
            <span className="font-bold text-xs text-amber-200">{currentWp.name}</span>
            <span className="text-[11px] text-stone-300">• ETA: {currentWp.eta}</span>
          </div>
          <span className="text-xs text-pink-200 italic">{currentWp.status}</span>
        </div>
      </div>

      {/* Manual Scroll / Scrub Slider */}
      <div className="mt-3 flex items-center gap-3">
        <span className="text-[11px] font-bold text-stone-500 whitespace-nowrap">
          Interactive Scrub:
        </span>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={scrollProgress}
          onChange={(e) => handleManualScrub(parseFloat(e.target.value))}
          className="flex-1 accent-[#80244a] h-2 bg-[#faeaf2] rounded-lg cursor-pointer"
        />
        <span className="text-xs font-mono font-bold text-[#80244a]">
          {Math.round(scrollProgress * 100)}%
        </span>
      </div>
    </div>
  );
};
