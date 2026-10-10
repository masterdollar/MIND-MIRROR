import React, { useEffect, useRef } from 'react';

interface CyberBackgroundProps {
  density?: 'high' | 'medium' | 'off';
  reducedMotion?: boolean;
}

export const CyberBackground: React.FC<CyberBackgroundProps> = ({
  density = 'medium',
  reducedMotion = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef<{ x: number; y: number; active: boolean }>({
    x: -1000,
    y: -1000,
    active: false,
  });

  useEffect(() => {
    if (density === 'off' || reducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    const particleCount = density === 'high' ? 55 : 32;
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.45,
      vy: (Math.random() - 0.5) * 0.45,
      radius: Math.random() * 2 + 0.8,
      color: Math.random() > 0.45 ? 'rgba(6, 182, 212, ' : 'rgba(168, 85, 247, ',
      alpha: Math.random() * 0.5 + 0.2,
      pulse: Math.random() * 0.02,
    }));

    // Occasional light streak lines
    let streaks: { x: number; y: number; length: number; speed: number; alpha: number; angle: number }[] = [];
    const maybeSpawnStreak = () => {
      if (streaks.length < 2 && Math.random() < 0.015) {
        streaks.push({
          x: Math.random() * width,
          y: Math.random() * height * 0.5,
          length: 60 + Math.random() * 80,
          speed: 4 + Math.random() * 3,
          alpha: 0.6,
          angle: (Math.PI / 4) + (Math.random() - 0.5) * 0.2,
        });
      }
    };

    let tick = 0;
    const render = () => {
      tick++;
      ctx.clearRect(0, 0, width, height);

      // Render floating particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        // Subtle repulsion/attraction to cursor
        if (mouseRef.current.active) {
          const dx = mouseRef.current.x - p.x;
          const dy = mouseRef.current.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120 && dist > 0) {
            p.x -= (dx / dist) * 0.8;
            p.y -= (dy / dist) * 0.8;
          }
        }

        // Boundary wrap
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        const currentAlpha = p.alpha + Math.sin(tick * p.pulse) * 0.15;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${Math.max(0.1, currentAlpha)})`;
        ctx.shadowBlur = 6;
        ctx.shadowColor = p.color.includes('182') ? '#06b6d4' : '#a855f7';
        ctx.fill();
      });

      // Connect near particles with faint cyber threads
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 90) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(6, 182, 212, ${(1 - dist / 90) * 0.08})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }

      // Handle streaks
      maybeSpawnStreak();
      for (let i = streaks.length - 1; i >= 0; i--) {
        const s = streaks[i];
        s.x += Math.cos(s.angle) * s.speed;
        s.y += Math.sin(s.angle) * s.speed;
        s.alpha -= 0.012;

        if (s.alpha <= 0 || s.x > width || s.y > height) {
          streaks.splice(i, 1);
          continue;
        }

        const gradient = ctx.createLinearGradient(
          s.x - Math.cos(s.angle) * s.length,
          s.y - Math.sin(s.angle) * s.length,
          s.x,
          s.y
        );
        gradient.addColorStop(0, 'rgba(6, 182, 212, 0)');
        gradient.addColorStop(0.8, `rgba(6, 182, 212, ${s.alpha * 0.7})`);
        gradient.addColorStop(1, `rgba(255, 255, 255, ${s.alpha})`);

        ctx.beginPath();
        ctx.moveTo(
          s.x - Math.cos(s.angle) * s.length,
          s.y - Math.sin(s.angle) * s.length
        );
        ctx.lineTo(s.x, s.y);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY, active: true };
    };
    const handleMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000, active: false };
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [density, reducedMotion]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 bg-[#04060e]">
      {/* Slow Moving Purple and Cyan Gradient Aurora Blobs */}
      <div
        className="absolute -top-[20%] -left-[10%] w-[65vw] h-[65vw] rounded-full bg-cyan-600/12 filter blur-[120px] transition-transform duration-1000 ease-out pointer-events-none"
        style={
          reducedMotion
            ? {}
            : {
                animation: 'gentle-pulse 16s ease-in-out infinite alternate',
              }
        }
        aria-hidden="true"
      />
      <div
        className="absolute top-[25%] -right-[15%] w-[60vw] h-[60vw] rounded-full bg-purple-700/14 filter blur-[140px] pointer-events-none"
        style={
          reducedMotion
            ? {}
            : {
                animation: 'gentle-pulse 20s ease-in-out infinite alternate 4s',
              }
        }
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-[20%] left-[20%] w-[55vw] h-[55vw] rounded-full bg-indigo-600/10 filter blur-[130px] pointer-events-none"
        style={
          reducedMotion
            ? {}
            : {
                animation: 'gentle-pulse 24s ease-in-out infinite alternate 8s',
              }
        }
        aria-hidden="true"
      />

      {/* Cybernetic grid overlay */}
      <div
        className="absolute inset-0 bg-cyber-grid opacity-35 pointer-events-none"
        aria-hidden="true"
      />

      {/* Radial vignette mask */}
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,#04060e_85%)] pointer-events-none"
        aria-hidden="true"
      />

      {/* Interactive canvas for subtle floating particles */}
      {density !== 'off' && !reducedMotion && (
        <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />
      )}
    </div>
  );
};
