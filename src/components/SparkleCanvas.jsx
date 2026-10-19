import React, { useEffect, useRef } from 'react';

export const SparkleCanvas = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const particles = [];
    const colors = ['#F7B731', '#FFEAA7', '#E88D9D', '#69519A', '#9E3C62'];

    const handleMouseMove = (e) => {
      if (Math.random() > 0.45) {
        particles.push({
          x: e.clientX,
          y: e.clientY,
          size: Math.random() * 3 + 1,
          color: colors[Math.floor(Math.random() * colors.length)],
          vx: (Math.random() - 0.5) * 1.5,
          vy: Math.random() * 1.5 + 0.3,
          alpha: 1,
        });
      }
    };
    window.addEventListener('mousemove', handleMouseMove);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 0.025;

        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="pointer-events-none fixed inset-0 z-40 w-full h-full"
        id="sparkle-canvas"
      />
      <div
        id="confetti-container"
        className="pointer-events-none fixed inset-0 z-50 overflow-hidden"
      />
    </>
  );
};

export function triggerStarConfetti() {
  const container = document.getElementById('confetti-container');
  if (!container) return;

  const colors = ['#FFE3E8', '#FFEAA7', '#EDE7F6', '#F7B731', '#9E3C62', '#c9aeff'];
  const symbols = ['★', '✦', '✧', '⋆', '•'];

  for (let i = 0; i < 28; i++) {
    const star = document.createElement('div');
    star.className = 'absolute select-none pointer-events-none transition-all duration-1000 ease-out font-bold';
    star.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    star.style.color = colors[Math.floor(Math.random() * colors.length)];
    star.style.fontSize = `${Math.floor(Math.random() * 14) + 12}px`;
    star.style.left = `${Math.random() * 80 + 10}vw`;
    star.style.top = `${Math.random() * 40 + 10}vh`;
    star.style.opacity = '1';
    star.style.transform = `scale(${Math.random() * 0.8 + 0.6}) rotate(${Math.random() * 360}deg)`;

    container.appendChild(star);

    window.setTimeout(() => {
      star.style.top = `${parseFloat(star.style.top) + 140}px`;
      star.style.opacity = '0';
      star.style.transform += ` scale(0.4) rotate(${Math.random() * 180}deg)`;
    }, 40);

    window.setTimeout(() => star.remove(), 1100);
  }
}
