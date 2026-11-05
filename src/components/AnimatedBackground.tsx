import React, { useEffect, useRef } from 'react';
import { BackgroundConfig } from '../types/birthday';

interface AnimatedBackgroundProps {
  config: BackgroundConfig;
}

interface Particle {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
  color: string;
  type: 'heart' | 'balloon' | 'sparkle' | 'petal' | 'bokeh';
  wobble: number;
  wobbleSpeed: number;
  stringLength?: number;
}

const PINK_PALETTE = [
  '#f472b6', // pink-400
  '#fb7185', // rose-400
  '#ec4899', // pink-500
  '#f9a8d4', // pink-300
  '#fda4af', // rose-300
  '#fbcfe8', // pink-200
  '#e879f9', // fuchsia-400
  '#ffb6c1', // light pink
  '#ff69b4', // hot pink
];

export const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({ config }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef<{ x: number; y: number; active: boolean }>({ x: -100, y: -100, active: false });
  const trailRef = useRef<{ x: number; y: number; size: number; opacity: number; color: string }[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initParticles();
    };

    window.addEventListener('resize', handleResize);

    const initParticles = () => {
      const count = Math.floor(config.density * (width < 768 ? 0.6 : 1.0));
      const newParticles: Particle[] = [];

      for (let i = 0; i < count; i++) {
        let type: Particle['type'] = 'heart';
        if (config.style === 'rose-petals') {
          type = Math.random() > 0.3 ? 'petal' : 'sparkle';
        } else if (config.style === 'bubble-balloons') {
          type = Math.random() > 0.4 ? 'balloon' : (Math.random() > 0.5 ? 'heart' : 'sparkle');
        } else if (config.style === 'sparkle-stars') {
          type = Math.random() > 0.4 ? 'sparkle' : 'bokeh';
        } else {
          // dreamy-hearts
          const rand = Math.random();
          if (rand > 0.5) type = 'heart';
          else if (rand > 0.25) type = 'sparkle';
          else type = 'bokeh';
        }

        const size = type === 'balloon' 
          ? 22 + Math.random() * 18 
          : type === 'heart'
          ? 14 + Math.random() * 16
          : type === 'petal'
          ? 10 + Math.random() * 12
          : type === 'bokeh'
          ? 25 + Math.random() * 45
          : 6 + Math.random() * 10;

        newParticles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size,
          speedY: (0.4 + Math.random() * 1.2) * config.speed,
          speedX: (Math.random() - 0.5) * 0.8 * config.speed,
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.03,
          opacity: type === 'bokeh' ? 0.15 + Math.random() * 0.2 : 0.4 + Math.random() * 0.5,
          color: PINK_PALETTE[Math.floor(Math.random() * PINK_PALETTE.length)],
          type,
          wobble: Math.random() * Math.PI * 2,
          wobbleSpeed: 0.02 + Math.random() * 0.03,
          stringLength: type === 'balloon' ? 30 + Math.random() * 20 : undefined,
        });
      }
      particlesRef.current = newParticles;
    };

    initParticles();

    // Mouse movement interactive trail
    const handleMouseMove = (e: MouseEvent) => {
      if (!config.interactive) return;
      mouseRef.current = { x: e.clientX, y: e.clientY, active: true };

      // Spawn sparkle trail
      if (Math.random() > 0.4) {
        trailRef.current.push({
          x: e.clientX + (Math.random() - 0.5) * 20,
          y: e.clientY + (Math.random() - 0.5) * 20,
          size: 4 + Math.random() * 8,
          opacity: 0.9,
          color: PINK_PALETTE[Math.floor(Math.random() * PINK_PALETTE.length)],
        });
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!config.interactive || e.touches.length === 0) return;
      const touch = e.touches[0];
      mouseRef.current = { x: touch.clientX, y: touch.clientY, active: true };
      trailRef.current.push({
        x: touch.clientX + (Math.random() - 0.5) * 16,
        y: touch.clientY + (Math.random() - 0.5) * 16,
        size: 5 + Math.random() * 7,
        opacity: 0.8,
        color: PINK_PALETTE[Math.floor(Math.random() * PINK_PALETTE.length)],
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    // Drawing helper: Heart shape
    const drawHeart = (c: CanvasRenderingContext2D, x: number, y: number, size: number, color: string, alpha: number, rot: number) => {
      c.save();
      c.translate(x, y);
      c.rotate(rot);
      c.globalAlpha = alpha;
      c.fillStyle = color;
      c.beginPath();
      const topCurveHeight = size * 0.3;
      c.moveTo(0, topCurveHeight);
      // top left curve
      c.bezierCurveTo(0, 0, -size / 2, 0, -size / 2, topCurveHeight);
      // bottom left curve
      c.bezierCurveTo(-size / 2, (size + topCurveHeight) / 2, 0, size, 0, size * 1.25);
      // bottom right curve
      c.bezierCurveTo(0, size, size / 2, (size + topCurveHeight) / 2, size / 2, topCurveHeight);
      // top right curve
      c.bezierCurveTo(size / 2, 0, 0, 0, 0, topCurveHeight);
      c.closePath();
      c.fill();

      // Soft white sheen highlight
      c.fillStyle = 'rgba(255, 255, 255, 0.45)';
      c.beginPath();
      c.arc(-size * 0.2, topCurveHeight * 0.8, size * 0.12, 0, Math.PI * 2);
      c.fill();
      c.restore();
    };

    // Drawing helper: Balloon shape
    const drawBalloon = (c: CanvasRenderingContext2D, x: number, y: number, size: number, color: string, alpha: number, stringLen = 35) => {
      c.save();
      c.translate(x, y);
      c.globalAlpha = alpha;
      c.fillStyle = color;

      // Balloon oval body
      c.beginPath();
      c.ellipse(0, 0, size * 0.7, size, 0, 0, Math.PI * 2);
      c.fill();

      // Highlight sheen
      c.fillStyle = 'rgba(255, 255, 255, 0.4)';
      c.beginPath();
      c.ellipse(-size * 0.25, -size * 0.35, size * 0.18, size * 0.35, -Math.PI / 6, 0, Math.PI * 2);
      c.fill();

      // Balloon knot
      c.fillStyle = color;
      c.beginPath();
      c.moveTo(-size * 0.12, size);
      c.lineTo(size * 0.12, size);
      c.lineTo(0, size + size * 0.12);
      c.closePath();
      c.fill();

      // Balloon wavy string
      c.strokeStyle = 'rgba(236, 72, 153, 0.4)';
      c.lineWidth = 1.2;
      c.beginPath();
      c.moveTo(0, size + size * 0.12);
      c.bezierCurveTo(
        -8, size + stringLen * 0.3,
        8, size + stringLen * 0.7,
        -4, size + stringLen
      );
      c.stroke();
      c.restore();
    };

    // Drawing helper: 4-pointed Sparkle Star
    const drawSparkle = (c: CanvasRenderingContext2D, x: number, y: number, size: number, color: string, alpha: number, rot: number) => {
      c.save();
      c.translate(x, y);
      c.rotate(rot);
      c.globalAlpha = alpha;
      c.fillStyle = color;

      c.beginPath();
      for (let i = 0; i < 4; i++) {
        c.lineTo(Math.cos((i * Math.PI) / 2) * size, Math.sin((i * Math.PI) / 2) * size);
        c.lineTo(Math.cos((i * Math.PI) / 2 + Math.PI / 4) * (size * 0.25), Math.sin((i * Math.PI) / 2 + Math.PI / 4) * (size * 0.25));
      }
      c.closePath();
      c.fill();

      // Central glow dot
      c.fillStyle = '#ffffff';
      c.beginPath();
      c.arc(0, 0, size * 0.2, 0, Math.PI * 2);
      c.fill();
      c.restore();
    };

    // Drawing helper: Rose Petal
    const drawPetal = (c: CanvasRenderingContext2D, x: number, y: number, size: number, color: string, alpha: number, rot: number) => {
      c.save();
      c.translate(x, y);
      c.rotate(rot);
      c.globalAlpha = alpha;
      c.fillStyle = color;

      c.beginPath();
      c.moveTo(0, -size);
      c.quadraticCurveTo(size * 0.8, -size * 0.3, size * 0.4, size * 0.8);
      c.quadraticCurveTo(0, size, 0, size);
      c.quadraticCurveTo(-size * 0.4, size * 0.8, -size * 0.8, -size * 0.3);
      c.quadraticCurveTo(0, -size, 0, -size);
      c.fill();
      c.restore();
    };

    // Drawing helper: Soft Bokeh Orb
    const drawBokeh = (c: CanvasRenderingContext2D, x: number, y: number, size: number, color: string, alpha: number) => {
      c.save();
      c.globalAlpha = alpha;
      const gradient = c.createRadialGradient(x, y, 0, x, y, size);
      gradient.addColorStop(0, color);
      gradient.addColorStop(0.7, color);
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
      c.fillStyle = gradient;
      c.beginPath();
      c.arc(x, y, size, 0, Math.PI * 2);
      c.fill();
      c.restore();
    };

    // Render loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Render interactive mouse/touch sparkles
      for (let i = trailRef.current.length - 1; i >= 0; i--) {
        const spark = trailRef.current[i];
        spark.opacity -= 0.025;
        spark.y -= 0.6;
        spark.size *= 0.96;

        if (spark.opacity <= 0 || spark.size <= 0.5) {
          trailRef.current.splice(i, 1);
        } else {
          drawSparkle(ctx, spark.x, spark.y, spark.size, spark.color, spark.opacity, 0);
        }
      }

      // Render background floating particles
      particlesRef.current.forEach((p) => {
        // Floating movement (drifting upward)
        p.wobble += p.wobbleSpeed;
        const driftX = Math.sin(p.wobble) * 0.8;
        p.y -= p.speedY;
        p.x += p.speedX + driftX;
        p.rotation += p.rotationSpeed;

        // Gentle mouse repulsion if cursor is close
        if (mouseRef.current.active && config.interactive) {
          const dx = p.x - mouseRef.current.x;
          const dy = p.y - mouseRef.current.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120 && dist > 0) {
            const force = (120 - dist) / 120;
            p.x += (dx / dist) * force * 2;
            p.y += (dy / dist) * force * 2;
          }
        }

        // Wrap around top/sides
        if (p.y < -p.size * 2) {
          p.y = height + p.size;
          p.x = Math.random() * width;
        }
        if (p.x < -p.size * 2) p.x = width + p.size;
        if (p.x > width + p.size * 2) p.x = -p.size;

        // Draw particle based on type
        switch (p.type) {
          case 'heart':
            drawHeart(ctx, p.x, p.y, p.size, p.color, p.opacity, p.rotation);
            break;
          case 'balloon':
            drawBalloon(ctx, p.x, p.y, p.size, p.color, p.opacity, p.stringLength);
            break;
          case 'sparkle':
            drawSparkle(ctx, p.x, p.y, p.size, p.color, p.opacity, p.rotation);
            break;
          case 'petal':
            drawPetal(ctx, p.x, p.y, p.size, p.color, p.opacity, p.rotation);
            break;
          case 'bokeh':
            drawBokeh(ctx, p.x, p.y, p.size, p.color, p.opacity);
            break;
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [config]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      {/* Dynamic pastel gradient foundation */}
      <div className="absolute inset-0 bg-gradient-to-b from-pink-100 via-rose-50 to-pink-100 opacity-80" />
      
      {/* Decorative radial glows */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-pink-300/30 rounded-full blur-3xl animate-pulse" />
      <div className="absolute top-1/2 -right-32 w-[30rem] h-[30rem] bg-rose-200/40 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '6s' }} />
      <div className="absolute -bottom-24 left-1/3 w-96 h-96 bg-fuchsia-200/30 rounded-full blur-3xl" />

      {/* HTML5 Canvas for silky 60fps moving particles */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
};
