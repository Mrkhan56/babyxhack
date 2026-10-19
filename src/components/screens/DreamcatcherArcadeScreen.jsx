import React, { useEffect, useRef, useState } from 'react';
import {
  getAudioContext,
  playStarCatchSound,
  playMoonCatchSound,
  playHurtSound,
  playPowerUpSound,
  playGameOverSound,
  playVictoryFanfare,
} from '../../utils/audio.js';

export const DreamcatcherArcadeScreen = ({ onSelectTab, onIncrementDreams }) => {
  const canvasRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem('pip_star_arcade_hiscore');
    return saved ? parseInt(saved, 10) : 3420;
  });
  const [lives, setLives] = useState(3);
  const [difficulty, setDifficulty] = useState('gentle');
  const [activePowerUp, setActivePowerUp] = useState(null);
  const [overlayState, setOverlayState] = useState('start');

  const isPlayingRef = useRef(false);
  const scoreRef = useRef(0);
  const livesRef = useRef(3);
  const baseSpeedRef = useRef(1.8);
  const spawnRateRef = useRef(55);
  const slowMoTimerRef = useRef(0);
  const magnetTimerRef = useRef(0);
  const frameCountRef = useRef(0);

  const basketRef = useRef({
    x: 380,
    y: 435,
    width: 96,
    height: 38,
    targetX: 380,
    speed: 14,
  });

  const dropsRef = useRef([]);
  const particlesRef = useRef([]);

  useEffect(() => {
    if (difficulty === 'gentle') {
      baseSpeedRef.current = 1.7;
      spawnRateRef.current = 55;
    } else if (difficulty === 'drift') {
      baseSpeedRef.current = 2.4;
      spawnRateRef.current = 40;
    } else {
      baseSpeedRef.current = 3.2;
      spawnRateRef.current = 28;
    }
  }, [difficulty]);

  const addParticles = (x, y, color, count = 10) => {
    for (let i = 0; i < count; i++) {
      particlesRef.current.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 4,
        vy: (Math.random() - 0.7) * 3,
        alpha: 1,
        size: Math.random() * 3 + 1.5,
        color,
      });
    }
  };

  const spawnDrop = (canvasWidth) => {
    const rand = Math.random();
    let type = 'star';
    let value = 10;
    let color = '#F7B731';

    if (rand > 0.88) {
      type = 'magnet';
      color = '#c9aeff';
      value = 25;
    } else if (rand > 0.76) {
      type = 'cloud';
      color = '#EDE7F6';
      value = 20;
    } else if (rand > 0.6) {
      type = 'moon';
      color = '#FFEAA7';
      value = 50;
    } else if (rand > 0.48) {
      type = 'clock';
      color = '#E88D9D';
      value = 0;
    }

    dropsRef.current.push({
      x: Math.random() * (canvasWidth - 80) + 40,
      y: -25,
      size: type === 'moon' ? 22 : type === 'clock' ? 18 : 16,
      speed: baseSpeedRef.current * (0.85 + Math.random() * 0.35),
      type,
      value,
      color,
      rotation: Math.random() * Math.PI,
      rotSpeed: (Math.random() - 0.5) * 0.05,
    });
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId;

    const bgClouds = [
      { x: 70, y: 80, r: 42, speed: 0.15 },
      { x: 390, y: 130, r: 58, speed: 0.22 },
      { x: 670, y: 70, r: 38, speed: 0.18 },
    ];

    const gameLoop = () => {
      frameCountRef.current++;

      if (isPlayingRef.current) {
        if (slowMoTimerRef.current > 0) {
          slowMoTimerRef.current--;
          if (slowMoTimerRef.current <= 0) {
            setActivePowerUp(null);
          } else {
            setActivePowerUp(`SLOW-MO CLOUD (${Math.ceil(slowMoTimerRef.current / 60)}s)`);
          }
        } else if (magnetTimerRef.current > 0) {
          magnetTimerRef.current--;
          if (magnetTimerRef.current <= 0) {
            setActivePowerUp(null);
          } else {
            setActivePowerUp(`MOON MAGNET (${Math.ceil(magnetTimerRef.current / 60)}s)`);
          }
        } else {
          setActivePowerUp(null);
        }

        const isSlowMo = slowMoTimerRef.current > 0;
        const isMagnet = magnetTimerRef.current > 0;
        const currentSpeedMod = isSlowMo ? 0.5 : 1.0;

        const b = basketRef.current;
        b.x += (b.targetX - b.x) * 0.22;
        b.x = Math.max(b.width / 2, Math.min(canvas.width - b.width / 2, b.x));

        if (frameCountRef.current % spawnRateRef.current === 0) {
          spawnDrop(canvas.width);
        }

        for (let i = dropsRef.current.length - 1; i >= 0; i--) {
          const item = dropsRef.current[i];
          item.y += item.speed * currentSpeedMod;
          item.rotation += item.rotSpeed;

          if (isMagnet && item.type !== 'clock') {
            const dx = b.x - item.x;
            item.x += dx * 0.055;
          }

          const bTop = b.y - b.height / 2;
          const bBottom = b.y + b.height / 2;
          const bLeft = b.x - b.width / 2;
          const bRight = b.x + b.width / 2;

          if (
            item.y + item.size >= bTop &&
            item.y - item.size <= bBottom &&
            item.x >= bLeft &&
            item.x <= bRight
          ) {
            if (item.type === 'clock') {
              livesRef.current -= 1;
              setLives(livesRef.current);
              playHurtSound();
              addParticles(item.x, item.y, '#E88D9D', 14);

              if (livesRef.current <= 0) {
                isPlayingRef.current = false;
                setIsPlaying(false);
                setOverlayState('gameover');
                playGameOverSound();
                onIncrementDreams();
              }
            } else if (item.type === 'cloud') {
              slowMoTimerRef.current = 300;
              playPowerUpSound('slowmo');
              addParticles(item.x, item.y, '#EDE7F6', 14);
            } else if (item.type === 'magnet') {
              magnetTimerRef.current = 360;
              playPowerUpSound('magnet');
              addParticles(item.x, item.y, '#c9aeff', 14);
            } else if (item.type === 'moon') {
              scoreRef.current += item.value;
              setScore(scoreRef.current);
              playMoonCatchSound();
              addParticles(item.x, item.y, '#FFEAA7', 16);
            } else {
              scoreRef.current += item.value;
              setScore(scoreRef.current);
              playStarCatchSound();
              addParticles(item.x, item.y, '#F7B731', 10);
            }

            dropsRef.current.splice(i, 1);
            continue;
          }

          if (item.y > canvas.height + 30) {
            dropsRef.current.splice(i, 1);
          }
        }

        if (scoreRef.current > highScore) {
          setHighScore(scoreRef.current);
          localStorage.setItem('pip_star_arcade_hiscore', scoreRef.current.toString());
        }
      }

      bgClouds.forEach((c) => {
        c.x += c.speed;
        if (c.x - c.r > canvas.width) c.x = -c.r;
      });

      for (let p = particlesRef.current.length - 1; p >= 0; p--) {
        const pt = particlesRef.current[p];
        pt.x += pt.vx;
        pt.y += pt.vy;
        pt.alpha -= 0.025;
        if (pt.alpha <= 0) {
          particlesRef.current.splice(p, 1);
        }
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const skyGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
      skyGrad.addColorStop(0, '#1a1024');
      skyGrad.addColorStop(0.65, '#2b1836');
      skyGrad.addColorStop(1, '#3b2046');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = 'rgba(255, 250, 235, 0.3)';
      for (let s = 0; s < 36; s++) {
        const sx = (s * 97) % canvas.width;
        const sy = (s * 53) % (canvas.height - 80);
        ctx.fillRect(sx, sy, 1.5, 1.5);
      }

      bgClouds.forEach((c) => {
        ctx.fillStyle = 'rgba(237, 231, 246, 0.08)';
        ctx.beginPath();
        ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
        ctx.arc(c.x + c.r * 0.6, c.y - 10, c.r * 0.7, 0, Math.PI * 2);
        ctx.arc(c.x - c.r * 0.6, c.y + 5, c.r * 0.6, 0, Math.PI * 2);
        ctx.fill();
      });

      dropsRef.current.forEach((item) => {
        ctx.save();
        ctx.translate(item.x, item.y);
        ctx.rotate(item.rotation);

        if (item.type === 'star') {
          ctx.fillStyle = item.color;
          ctx.shadowColor = item.color;
          ctx.shadowBlur = 8;
          ctx.beginPath();
          const spikes = 5;
          const outerR = item.size;
          const innerR = item.size / 2.2;
          let rot = (Math.PI / 2) * 3;
          const step = Math.PI / spikes;

          ctx.moveTo(0, -outerR);
          for (let i = 0; i < spikes; i++) {
            let x = Math.cos(rot) * outerR;
            let y = Math.sin(rot) * outerR;
            ctx.lineTo(x, y);
            rot += step;
            x = Math.cos(rot) * innerR;
            y = Math.sin(rot) * innerR;
            ctx.lineTo(x, y);
            rot += step;
          }
          ctx.closePath();
          ctx.fill();
        } else if (item.type === 'moon') {
          ctx.fillStyle = item.color;
          ctx.shadowColor = item.color;
          ctx.shadowBlur = 12;
          ctx.beginPath();
          ctx.arc(0, 0, item.size, 0.4, 2.2 * Math.PI, false);
          ctx.bezierCurveTo(-item.size * 0.5, item.size * 0.6, -item.size * 0.5, -item.size * 0.6, 0, -item.size);
          ctx.fill();
        } else if (item.type === 'cloud') {
          ctx.fillStyle = item.color;
          ctx.shadowColor = '#EDE7F6';
          ctx.shadowBlur = 10;
          ctx.beginPath();
          ctx.arc(0, 0, 10, 0, Math.PI * 2);
          ctx.arc(8, -4, 8, 0, Math.PI * 2);
          ctx.arc(-8, -2, 7, 0, Math.PI * 2);
          ctx.fill();
        } else if (item.type === 'magnet') {
          ctx.strokeStyle = item.color;
          ctx.lineWidth = 3.5;
          ctx.shadowColor = item.color;
          ctx.shadowBlur = 10;
          ctx.beginPath();
          ctx.arc(0, 0, item.size * 0.8, 0, Math.PI * 2);
          ctx.stroke();
        } else if (item.type === 'clock') {
          ctx.fillStyle = item.color;
          ctx.beginPath();
          ctx.arc(0, 0, item.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#FFFFFF';
          ctx.beginPath();
          ctx.arc(0, 0, item.size * 0.7, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#80244a';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(0, -6);
          ctx.moveTo(0, 0);
          ctx.lineTo(4, 0);
          ctx.stroke();
        }

        ctx.restore();
      });

      particlesRef.current.forEach((p) => {
        ctx.save();
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      const b = basketRef.current;
      ctx.save();
      ctx.translate(b.x, b.y);

      ctx.fillStyle = '#FFF8F1';
      ctx.beginPath();
      ctx.arc(0, -14, 18, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#ffd9e2';
      ctx.beginPath();
      ctx.moveTo(-12, -18);
      ctx.quadraticCurveTo(0, -38, 20, -26);
      ctx.lineTo(6, -14);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#FFEAA7';
      ctx.beginPath();
      ctx.arc(20, -26, 4, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#F7B731';
      ctx.shadowColor = '#F7B731';
      ctx.shadowBlur = 5;
      ctx.beginPath();
      ctx.arc(-5, -14, 2.5, 0, Math.PI * 2);
      ctx.arc(5, -14, 2.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      ctx.fillStyle = '#9e3c62';
      ctx.shadowColor = 'rgba(0,0,0,0.45)';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.roundRect(-b.width / 2, -6, b.width, b.height, [8, 8, 16, 16]);
      ctx.fill();

      ctx.strokeStyle = '#F7B731';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(-b.width / 2 + 6, 8);
      ctx.lineTo(b.width / 2 - 6, 8);
      ctx.stroke();

      ctx.restore();

      animId = requestAnimationFrame(gameLoop);
    };

    animId = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animId);
  }, [highScore]);

  const handlePointerMove = (clientX) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    basketRef.current.targetX = (clientX - rect.left) * scaleX;
  };

  const handleStartGame = () => {
    getAudioContext();
    scoreRef.current = 0;
    setScore(0);
    livesRef.current = 3;
    setLives(3);
    dropsRef.current = [];
    particlesRef.current = [];
    slowMoTimerRef.current = 0;
    magnetTimerRef.current = 0;
    setActivePowerUp(null);

    isPlayingRef.current = true;
    setIsPlaying(true);
    playVictoryFanfare();
  };

  const handleResetCabinet = () => {
    isPlayingRef.current = false;
    setIsPlaying(false);
    dropsRef.current = [];
    particlesRef.current = [];
    setScore(0);
    setLives(3);
    setOverlayState('start');
  };

  return (
    <div className="w-full flex flex-col gap-8">
      {/* Top Arcade Marquee */}
      <section className="relative w-full rounded-3xl bg-white shadow-xl overflow-hidden border border-[#F3E8DC]">
        <div className="w-full bg-gradient-to-r from-[#69519a] via-[#80244a] to-[#9e3c62] p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#FFE3E8] flex items-center justify-center text-[#80244a] shadow-md">
              <span className="material-symbols-outlined text-2xl">sports_esports</span>
            </div>
            <div>
              <span className="text-[10px] tracking-widest text-[#ffccda] block font-bold">
                NURSERY ARCADE CAB NO. 07
              </span>
              <h1 className="font-headline font-bold text-xl sm:text-2xl text-white tracking-tight">
                Catch Falling Star Dreams
              </h1>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 sm:gap-2 bg-black/25 px-2.5 sm:px-4 py-1 sm:py-1.5 rounded-full shadow-inner backdrop-blur-md">
              <span className="text-[9px] sm:text-[10px] text-[#ffd9e2] font-bold">VITALITY</span>
              <div className="flex items-center gap-0.5 sm:gap-1">
                {[1, 2, 3].map((i) => (
                  <span
                    key={i}
                    className={`material-symbols-outlined text-base sm:text-lg ${
                      i <= lives ? 'text-[#FFEAA7]' : 'text-white/20'
                    }`}
                  >
                    baby_changing_station
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2 bg-black/35 px-2.5 sm:px-4 py-1 sm:py-1.5 rounded-full shadow-inner">
              <span className="text-[9px] sm:text-[10px] text-[#ffd385] font-bold">SCORE</span>
              <span className="font-headline font-bold text-xs sm:text-base text-[#F7B731] tracking-wider sm:tracking-widest font-mono">
                {score.toString().padStart(6, '0')}
              </span>
            </div>

            <div className="hidden sm:flex items-center gap-2 bg-black/25 px-4 py-1.5 rounded-full shadow-inner">
              <span className="text-[10px] text-[#ffb0c8] font-bold">HI-RECORD</span>
              <span className="font-headline font-bold text-xs sm:text-sm text-[#ffd9e2] tracking-wider font-mono">
                {highScore.toString().padStart(6, '0')} ★
              </span>
            </div>
          </div>
        </div>

        <div className="bg-[#FFF9F2] px-3 sm:px-5 py-2 sm:py-2.5 flex flex-wrap items-center justify-between gap-2.5 text-[#3F2837] border-t border-[#F3E8DC]">
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-[#62535F] mr-1 font-bold">DREAM SPEED:</span>
            <div className="inline-flex rounded-full bg-[#faeaf2] p-0.5 shadow-inner border border-[#eedee6]">
              {['gentle', 'drift', 'rush'].map((mode) => (
                <button
                  key={mode}
                  onClick={() => setDifficulty(mode)}
                  className={`px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-semibold transition-all cursor-pointer ${
                    difficulty === mode
                      ? 'bg-[#9e3c62] text-white shadow-xs'
                      : 'text-[#62535F] hover:text-[#3F2837]'
                  }`}
                >
                  {mode.charAt(0).toUpperCase() + mode.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs text-[#62535F]">
            <span className="hidden md:inline-flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#F7B731] animate-ping"></span>
              Move: Touch, mouse cursor, or drag
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-[#FFE3E8] text-[#80244a] text-[9px] sm:text-[10px] font-bold">
              STATION #07 ONLINE
            </span>
          </div>
        </div>
      </section>

      {/* Main Game Arena */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        <div className="lg:col-span-8 flex flex-col gap-4">
          <div
            className="relative w-full rounded-3xl bg-[#1d1226] overflow-hidden shadow-2xl select-none border border-[#FFEAA7]/20"
            onMouseMove={(e) => handlePointerMove(e.clientX)}
            onTouchMove={(e) => {
              if (e.touches[0]) handlePointerMove(e.touches[0].clientX);
            }}
          >
            <div className="absolute top-2 sm:top-4 left-2 sm:left-4 z-20 pointer-events-none flex items-center gap-1.5 sm:gap-2 bg-black/40 backdrop-blur-md px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full shadow-lg border border-white/10">
              <span className="text-xs font-semibold text-[#FFE3E8]">Pip: "Catch the lullabies!"</span>
            </div>

            {activePowerUp && (
              <div className="absolute top-2 sm:top-4 right-2 sm:right-4 z-20 pointer-events-none flex items-center gap-1 sm:gap-1.5 bg-[#80244a]/85 backdrop-blur-md px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-white shadow-lg animate-pulse border border-[#ffd9e2]/30">
                <span className="material-symbols-outlined text-xs sm:text-sm">auto_awesome</span>
                <span className="text-[9px] sm:text-[10px] tracking-wider font-bold">{activePowerUp}</span>
              </div>
            )}

            <canvas
              ref={canvasRef}
              width={760}
              height={480}
              className="w-full h-[400px] sm:h-[480px] block cursor-grab active:cursor-grabbing"
            />

            {!isPlaying && (
              <div className="absolute inset-0 z-30 flex flex-col items-center justify-center p-6 bg-[#130b1bf0] backdrop-blur-md text-center">
                <div className="w-16 h-16 rounded-full bg-[#FFE3E8] flex items-center justify-center text-[#80244a] shadow-xl mb-3 animate-bounce">
                  <span className="material-symbols-outlined text-3xl">hotel</span>
                </div>

                <h2 className="font-headline font-bold text-2xl sm:text-3xl text-[#FFE3E8] tracking-tight mb-1">
                  {overlayState === 'start' ? 'Ready for Bedtime?' : 'Nighty-Night!'}
                </h2>

                <p className="text-xs sm:text-sm text-[#EDE7F6]/90 max-w-sm mb-5 leading-relaxed">
                  {overlayState === 'start'
                    ? "Guide Pip's cozy woven dream basket to harvest floating stars, luminous crescent moons, and lullaby power-ups. Avoid falling clocks!"
                    : `Pip safely collected ${score} luminous dreams before drifting off to sleep. Press below to dream again!`}
                </p>

                <button
                  onClick={handleStartGame}
                  className="px-6 py-2.5 rounded-full font-headline font-bold text-sm bg-[#9e3c62] hover:bg-[#80244a] text-white shadow-lg hover:shadow-[#F7B731]/20 transform hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-lg">play_circle</span>
                  <span>{overlayState === 'start' ? 'Drop Dreams (Play)' : 'Dream Again (Replay)'}</span>
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white rounded-xl p-3 shadow-sm border border-[#F3E8DC] flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#FFFAEB] text-[#F7B731] flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-lg">star</span>
              </div>
              <div className="min-w-0">
                <span className="text-[10px] text-[#3F2837] block font-bold">Star Dream</span>
                <span className="text-xs text-[#62535F]">+10 Pts</span>
              </div>
            </div>

            <div className="bg-white rounded-xl p-3 shadow-sm border border-[#F3E8DC] flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#FFE3E8] text-[#80244a] flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-lg">bedtime</span>
              </div>
              <div className="min-w-0">
                <span className="text-[10px] text-[#3F2837] block font-bold">Crescent Moon</span>
                <span className="text-xs text-[#62535F]">+50 Pts</span>
              </div>
            </div>

            <div className="bg-white rounded-xl p-3 shadow-sm border border-[#F3E8DC] flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#EDE7F6] text-[#69519a] flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-lg">filter_drama</span>
              </div>
              <div className="min-w-0">
                <span className="text-[10px] text-[#3F2837] block font-bold">Slow-Mo Cloud</span>
                <span className="text-xs text-[#62535F]">Time Dilates</span>
              </div>
            </div>

            <div className="bg-white rounded-xl p-3 shadow-sm border border-[#F3E8DC] flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#faeaf2] text-[#80244a] flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-lg">all_inclusive</span>
              </div>
              <div className="min-w-0">
                <span className="text-[10px] text-[#3F2837] block font-bold">Moon Magnet</span>
                <span className="text-xs text-[#62535F]">Star Attractor</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-md flex flex-col border border-[#F3E8DC]">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#eedee6]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#F7B731] text-xl">emoji_events</span>
                <h2 className="font-headline font-bold text-lg text-[#3F2837]">Hall of Sleepers</h2>
              </div>
              <span className="rounded-full bg-[#FFFAEB] text-[#5f4200] text-[9px] px-2 py-0.5 border border-[#FFEAA7] font-bold">
                Top 5 Records
              </span>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#fff0f7] shadow-xs border border-[#F3E8DC]">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="w-5 h-5 rounded-full bg-[#F7B731] text-[#5f4200] font-headline text-[11px] flex items-center justify-center font-bold">
                    1
                  </span>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-bold text-[#3F2837] truncate">Pip the Skull Baby</span>
                    <span className="text-[10px] text-[#80244a]">Junior Dream Engineer</span>
                  </div>
                </div>
                <span className="font-headline font-bold text-xs text-[#80244a]">3,420 ★</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-[#F3E8DC]">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="w-5 h-5 rounded-full bg-[#eedee6] text-[#62535F] font-headline text-[11px] flex items-center justify-center font-bold">
                    2
                  </span>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-bold text-[#3F2837] truncate">Luna the Ghost</span>
                    <span className="text-[10px] text-[#62535F]">Attic Lullaby Archivist</span>
                  </div>
                </div>
                <span className="font-headline font-bold text-xs text-[#3F2837]">2,890 ★</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-[#F3E8DC]">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="w-5 h-5 rounded-full bg-[#eedee6] text-[#62535F] font-headline text-[11px] flex items-center justify-center font-bold">
                    3
                  </span>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-bold text-[#3F2837] truncate">Barnaby Hedgehog</span>
                    <span className="text-[10px] text-[#62535F]">Quill Pillow Tester</span>
                  </div>
                </div>
                <span className="font-headline font-bold text-xs text-[#3F2837]">2,150 ★</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-5 shadow-md flex flex-col gap-2.5 border border-[#F3E8DC]">
            <h3 className="font-headline font-bold text-base text-[#3F2837] flex items-center gap-2">
              <span className="material-symbols-outlined text-[#69519a] text-lg">equalizer</span>
              Chime Sound Engine
            </h3>
            <p className="text-xs text-[#62535F] leading-relaxed">
              Each caught star synthesizes a gentle pentatonic harmonic bell (C5, D5, E5, G5, A5, C6) designed to lower heart rates before bedtime.
            </p>
            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => playStarCatchSound()}
                className="px-3.5 py-1.5 rounded-full bg-[#EDE7F6] hover:bg-[#F5F0FB] text-[#69519a] text-xs font-semibold transition-all shadow-xs flex items-center gap-1.5 border border-[#c9aeff]/30 cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">music_note</span>
                Test Chime Tone
              </button>
              <button
                onClick={handleResetCabinet}
                className="px-3.5 py-1.5 rounded-full bg-[#faeaf2] hover:bg-[#FFE3E8] text-[#80244a] text-xs font-semibold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">restart_alt</span>
                Reset Cabinet
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
