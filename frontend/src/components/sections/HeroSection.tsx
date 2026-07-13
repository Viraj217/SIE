'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/* ─── Particle System Types ───────────────────────────── */
interface Vec2 { x: number; y: number }

class Particle {
  pos: Vec2; vel: Vec2; size: number; color: string;
  alpha: number; decay: number; gravity: number;
  trail: Vec2[]; maxTrail: number; life: number; maxLife: number;
  type: 'spark' | 'ember' | 'smoke' | 'steam';

  constructor(x: number, y: number, type: 'spark' | 'ember' | 'smoke' | 'steam') {
    this.type = type;
    this.life = 0;

    if (type === 'spark') {
      const angle = -Math.PI * 0.3 + (Math.random() - 0.5) * Math.PI * 1.2;
      const speed = Math.random() * 10 + 5;
      this.pos = { x: x + (Math.random() - 0.5) * 8, y: y + (Math.random() - 0.5) * 4 };
      this.vel = { x: Math.cos(angle) * speed, y: Math.sin(angle) * speed - 3 };
      this.size = Math.random() * 3 + 1;
      this.color = ['#FFD700', '#FF8C00', '#FF6347', '#FFA500', '#FFCC66', '#E8845C'][Math.floor(Math.random() * 6)];
      this.alpha = 1;
      this.decay = Math.random() * 0.02 + 0.015;
      this.gravity = 0.22;
      this.maxTrail = 8;
      this.maxLife = 80;
    } else if (type === 'ember') {
      this.pos = { x: x + (Math.random() - 0.5) * 30, y };
      this.vel = { x: (Math.random() - 0.5) * 1.5, y: -(Math.random() * 2 + 0.5) };
      this.size = Math.random() * 2.5 + 1;
      this.color = Math.random() > 0.5 ? '#FF6347' : '#FF8C00';
      this.alpha = Math.random() * 0.6 + 0.4;
      this.decay = Math.random() * 0.008 + 0.004;
      this.gravity = -0.02;
      this.maxTrail = 3;
      this.maxLife = 150;
    } else if (type === 'smoke') {
      this.pos = { x: x + (Math.random() - 0.5) * 20, y };
      this.vel = { x: (Math.random() - 0.5) * 0.8, y: -(Math.random() * 1.2 + 0.3) };
      this.size = Math.random() * 15 + 8;
      this.color = 'rgba(200,210,220,0.12)';
      this.alpha = Math.random() * 0.15 + 0.05;
      this.decay = Math.random() * 0.002 + 0.001;
      this.gravity = -0.005;
      this.maxTrail = 0;
      this.maxLife = 200;
    } else { // steam
      this.pos = { x: x + (Math.random() - 0.5) * 12, y };
      this.vel = { x: (Math.random() - 0.5) * 1, y: -(Math.random() * 1.5 + 0.8) };
      this.size = Math.random() * 10 + 5;
      this.color = 'rgba(143,216,212,0.08)';
      this.alpha = Math.random() * 0.12 + 0.03;
      this.decay = Math.random() * 0.003 + 0.001;
      this.gravity = -0.01;
      this.maxTrail = 0;
      this.maxLife = 120;
    }
    this.trail = [];
  }

  update() {
    this.life++;
    if (this.type === 'spark' || this.type === 'ember') {
      this.trail.push({ ...this.pos });
      if (this.trail.length > this.maxTrail) this.trail.shift();
    }
    this.pos.x += this.vel.x;
    this.pos.y += this.vel.y;
    this.vel.y += this.gravity;
    this.vel.x *= (this.type === 'smoke' || this.type === 'steam') ? 0.995 : 0.985;
    this.alpha -= this.decay;
    if (this.type === 'smoke' || this.type === 'steam') {
      this.size += 0.15;
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (this.alpha <= 0) return;

    if (this.type === 'spark') {
      // Draw bright trail
      ctx.save();
      for (let i = 0; i < this.trail.length; i++) {
        const t = i / this.trail.length;
        ctx.beginPath();
        ctx.globalAlpha = Math.max(0, t * this.alpha * 0.4);
        ctx.fillStyle = this.color;
        ctx.arc(this.trail[i].x, this.trail[i].y, this.size * t * 0.6, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
      
      // Draw core with glow
      ctx.save();
      ctx.globalAlpha = Math.max(0, this.alpha);
      ctx.shadowBlur = 18;
      ctx.shadowColor = this.color;
      ctx.fillStyle = '#FFF';
      ctx.beginPath();
      ctx.arc(this.pos.x, this.pos.y, this.size * 0.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 8;
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.pos.x, this.pos.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    } else if (this.type === 'ember') {
      ctx.save();
      ctx.globalAlpha = Math.max(0, this.alpha);
      ctx.shadowBlur = 12;
      ctx.shadowColor = this.color;
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.pos.x, this.pos.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    } else {
      // Smoke & steam — soft radial gradient blobs
      ctx.save();
      ctx.globalAlpha = Math.max(0, this.alpha);
      const grad = ctx.createRadialGradient(this.pos.x, this.pos.y, 0, this.pos.x, this.pos.y, this.size);
      if (this.type === 'smoke') {
        grad.addColorStop(0, 'rgba(180,195,210,0.15)');
        grad.addColorStop(1, 'rgba(180,195,210,0)');
      } else {
        grad.addColorStop(0, 'rgba(143,216,212,0.1)');
        grad.addColorStop(1, 'rgba(143,216,212,0)');
      }
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(this.pos.x, this.pos.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }
}

/* ─── HeroSection Component ───────────────────────────── */
export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  const [isClient, setIsClient] = useState(false);
  const particlesRef = useRef<Particle[]>([]);
  const animFrameRef = useRef<number>(0);
  const phaseRef = useRef<string>('idle');

  useEffect(() => { setIsClient(true); }, []);

  /* ─── Emit helpers ─── */
  const emitSparks = useCallback((cx: number, cy: number, count = 60) => {
    for (let i = 0; i < count; i++) {
      particlesRef.current.push(new Particle(cx, cy, 'spark'));
    }
  }, []);

  const emitEmbers = useCallback((cx: number, cy: number, count = 8) => {
    for (let i = 0; i < count; i++) {
      particlesRef.current.push(new Particle(cx, cy, 'ember'));
    }
  }, []);

  const emitSmoke = useCallback((cx: number, cy: number, count = 3) => {
    for (let i = 0; i < count; i++) {
      particlesRef.current.push(new Particle(cx, cy, 'smoke'));
    }
  }, []);

  const emitSteam = useCallback((cx: number, cy: number, count = 2) => {
    for (let i = 0; i < count; i++) {
      particlesRef.current.push(new Particle(cx, cy, 'steam'));
    }
  }, []);

  /* ─── Cursor parallax ─── */
  useEffect(() => {
    if (!isClient) return;
    const layers = containerRef.current?.querySelectorAll('.parallax-bg');
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      layers?.forEach(layer => {
        const speed = parseFloat((layer as HTMLElement).dataset.depth || '0.1');
        gsap.to(layer, { x: x * 25 * speed, y: y * 15 * speed, duration: 1.8, ease: 'power2.out' });
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isClient]);

  /* ─── Text entrance ─── */
  useEffect(() => {
    if (!isClient) return;
    const tl = gsap.timeline({ delay: 0.3 });
    tl.fromTo(titleRef.current, { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2, ease: 'power3.out' })
      .fromTo(subtitleRef.current, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out' }, '-=0.6')
      .fromTo(ctaRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' }, '-=0.4');
    return () => { tl.kill(); };
  }, [isClient]);

  /* ─── Canvas Animation Engine + GSAP Orchestration ─── */
  useEffect(() => {
    if (!isClient || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let cW = 0, cH = 0;
    const dpr = window.devicePixelRatio || 1;

    const resize = () => {
      cW = canvas.offsetWidth;
      cH = canvas.offsetHeight;
      canvas.width = cW * dpr;
      canvas.height = cH * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    /* ─── Scene state driven by GSAP ─── */
    const scene = {
      // Furnace
      furnaceGlow: 0.7,
      furnaceFlicker: 0,
      // Billet
      billetX: 0.82,  // normalized 0..1
      billetY: 0.72,
      billetHeat: 0.3,
      billetWidth: 0.18,
      billetHeight: 0.06,
      // Press
      pressY: 0.18,    // top of press ram
      pressGlow: 0,
      pressShake: 0,
      // Conveyor
      conveyorPhase: 0,
      // Anvil impact
      impactFlash: 0,
      // Ambient
      ambientHeat: 0,
      // Roller chains
      chainPhase: 0,
      // Finished pieces
      finishedPieces: 0,
      // Hydraulic pistons
      pistonExtend: 0,
    };

    /* ─── Drawing Functions ─── */

    const drawFurnace = () => {
      const fx = cW * 0.73, fy = cH * 0.3;
      const fw = cW * 0.22, fh = cH * 0.42;

      ctx.save();

      // Outer shell with much brighter metallic gradient
      const shellGrad = ctx.createLinearGradient(fx, fy, fx, fy + fh);
      shellGrad.addColorStop(0, '#6B8293');
      shellGrad.addColorStop(0.5, '#4A6070');
      shellGrad.addColorStop(1, '#2D3E4A');
      ctx.fillStyle = shellGrad;
      ctx.strokeStyle = 'rgba(255,255,255,0.3)';
      ctx.lineWidth = 2.5;
      roundRect(ctx, fx, fy, fw, fh, 6);
      ctx.fill();
      ctx.stroke();

      // Industrial paneling lines
      ctx.strokeStyle = 'rgba(0,0,0,0.3)';
      ctx.lineWidth = 1.5;
      for (let i = 1; i < 4; i++) {
        ctx.beginPath();
        ctx.moveTo(fx, fy + i * (fh / 4));
        ctx.lineTo(fx + fw, fy + i * (fh / 4));
        ctx.stroke();
      }

      // Rivets
      ctx.fillStyle = '#1A252E';
      for (let i = 0; i < 6; i++) {
        ctx.beginPath();
        ctx.arc(fx + 10, fy + 20 + i * (fh - 40) / 5, 2.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(fx + fw - 10, fy + 20 + i * (fh - 40) / 5, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // Inner furnace opening
      const mouthX = fx + fw * 0.12;
      const mouthY = fy + fh * 0.35;
      const mouthW = fw * 0.76;
      const mouthH = fh * 0.45;

      const glowIntensity = scene.furnaceGlow + scene.furnaceFlicker * 0.15;
      
      // Intense inner glow
      const innerGlow = ctx.createRadialGradient(
        mouthX + mouthW / 2, mouthY + mouthH / 2, 0,
        mouthX + mouthW / 2, mouthY + mouthH / 2, mouthW * 0.7
      );
      innerGlow.addColorStop(0, `rgba(255,255,220,${0.9 * glowIntensity})`);
      innerGlow.addColorStop(0.3, `rgba(255,180,80,${0.8 * glowIntensity})`);
      innerGlow.addColorStop(0.7, `rgba(220,70,30,${0.5 * glowIntensity})`);
      innerGlow.addColorStop(1, 'rgba(30,40,50,0.9)');

      ctx.fillStyle = '#05080A';
      roundRect(ctx, mouthX, mouthY, mouthW, mouthH, 4);
      ctx.fill();
      ctx.fillStyle = innerGlow;
      roundRect(ctx, mouthX, mouthY, mouthW, mouthH, 4);
      ctx.fill();

      // Massive bloom spill onto surroundings
      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      ctx.globalAlpha = 0.5 * glowIntensity;
      const spillGlow = ctx.createRadialGradient(
        mouthX + mouthW / 2, mouthY + mouthH / 2, mouthW * 0.2,
        mouthX + mouthW / 2, mouthY + mouthH / 2, mouthW * 2.5
      );
      spillGlow.addColorStop(0, 'rgba(255,160,80,0.8)');
      spillGlow.addColorStop(0.5, 'rgba(255,100,20,0.3)');
      spillGlow.addColorStop(1, 'rgba(255,100,20,0)');
      ctx.fillStyle = spillGlow;
      ctx.fillRect(mouthX - mouthW * 1.5, mouthY - mouthH * 1.5, mouthW * 4, mouthH * 4);
      ctx.restore();

      // Temperature gauge
      const gaugeX = fx + fw - 24;
      const gaugeY = fy + 24;
      ctx.fillStyle = '#11181D';
      ctx.strokeStyle = 'rgba(255,255,255,0.4)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(gaugeX, gaugeY, 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      const needleAngle = -Math.PI * 0.8 + glowIntensity * Math.PI;
      ctx.strokeStyle = '#FF5533';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(gaugeX, gaugeY);
      ctx.lineTo(gaugeX + Math.cos(needleAngle) * 9, gaugeY + Math.sin(needleAngle) * 9);
      ctx.stroke();

      // Chimney
      ctx.fillStyle = '#3A4C5A';
      ctx.strokeStyle = 'rgba(255,255,255,0.3)';
      ctx.lineWidth = 2;
      ctx.fillRect(fx + fw * 0.35, fy - cH * 0.15, fw * 0.3, cH * 0.15 + 4);
      ctx.strokeRect(fx + fw * 0.35, fy - cH * 0.15, fw * 0.3, cH * 0.15 + 4);

      // Pipe bands
      ctx.fillStyle = '#222';
      ctx.fillRect(fx + fw * 0.33, fy - cH * 0.05, fw * 0.34, 6);
      ctx.fillRect(fx + fw * 0.33, fy - cH * 0.12, fw * 0.34, 6);

      ctx.restore();
    };

    const drawPress = () => {
      const px = cW * 0.28, baseY = cH * 0.82;
      const pw = cW * 0.22, ph = cH * 0.65;

      ctx.save();

      // Heavy C-frame (lighter metallic)
      const frameGrad = ctx.createLinearGradient(px, baseY - ph, px + pw, baseY);
      frameGrad.addColorStop(0, '#5C7484');
      frameGrad.addColorStop(1, '#334654');

      ctx.fillStyle = frameGrad;
      ctx.strokeStyle = 'rgba(255,255,255,0.35)';
      ctx.lineWidth = 2;
      
      // Left pillar
      ctx.fillRect(px, baseY - ph, pw * 0.18, ph);
      ctx.strokeRect(px, baseY - ph, pw * 0.18, ph);
      // Right pillar
      ctx.fillRect(px + pw * 0.82, baseY - ph, pw * 0.18, ph);
      ctx.strokeRect(px + pw * 0.82, baseY - ph, pw * 0.18, ph);
      // Top crossbeam
      ctx.fillRect(px, baseY - ph, pw, pw * 0.15);
      ctx.strokeRect(px, baseY - ph, pw, pw * 0.15);

      // Edge highlights for 3D bevel
      ctx.fillStyle = 'rgba(255,255,255,0.15)';
      ctx.fillRect(px + 2, baseY - ph + 2, 4, ph - 4);
      ctx.fillRect(px + pw * 0.82 + 2, baseY - ph + 2, 4, ph - 4);
      ctx.fillRect(px + 2, baseY - ph + 2, pw - 4, 4);

      // Hydraulic cylinder housing
      const cylW = pw * 0.3, cylH = pw * 0.2;
      const cylX = px + pw / 2 - cylW / 2;
      const cylY = baseY - ph - cylH * 0.4;
      ctx.fillStyle = '#4A6070';
      ctx.strokeStyle = 'rgba(255,255,255,0.4)';
      roundRect(ctx, cylX, cylY, cylW, cylH, 6);
      ctx.fill();
      ctx.stroke();

      // Hydraulic lines - vibrant orange/red
      ctx.strokeStyle = '#E85C3C';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(cylX + cylW * 0.25, cylY);
      ctx.lineTo(cylX + cylW * 0.25, cylY - 20);
      ctx.lineTo(px + pw * 0.15, cylY - 20);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(cylX + cylW * 0.75, cylY);
      ctx.lineTo(cylX + cylW * 0.75, cylY - 15);
      ctx.lineTo(px + pw * 0.85, cylY - 15);
      ctx.stroke();

      // Piston rod - bright chrome
      const ramTop = baseY - ph + pw * 0.15;
      const pistonTravel = ph * 0.35;
      const ramY = ramTop + scene.pressY * pistonTravel;

      const rodGrad = ctx.createLinearGradient(px + pw / 2 - pw * 0.06, 0, px + pw / 2 + pw * 0.06, 0);
      rodGrad.addColorStop(0, '#9BAEBC');
      rodGrad.addColorStop(0.5, '#E5EDF2');
      rodGrad.addColorStop(1, '#6F8798');
      ctx.fillStyle = rodGrad;
      ctx.strokeStyle = 'rgba(0,0,0,0.5)';
      ctx.lineWidth = 1.5;
      ctx.fillRect(px + pw / 2 - pw * 0.06, ramTop, pw * 0.12, ramY - ramTop);
      ctx.strokeRect(px + pw / 2 - pw * 0.06, ramTop, pw * 0.12, ramY - ramTop);

      // Ram head (the die) - heavy steel
      const dieW = pw * 0.55, dieH = pw * 0.16;
      const dieX = px + pw / 2 - dieW / 2;

      const dieGrad = ctx.createLinearGradient(dieX, ramY, dieX, ramY + dieH);
      dieGrad.addColorStop(0, '#687E8E');
      dieGrad.addColorStop(1, '#394E5D');
      ctx.fillStyle = dieGrad;
      ctx.strokeStyle = 'rgba(255,255,255,0.4)';
      ctx.lineWidth = 2;
      roundRect(ctx, dieX, ramY, dieW, dieH, 4);
      ctx.fill();
      ctx.stroke();

      // Cutting teeth profile
      ctx.strokeStyle = `rgba(255,180,100,${0.3 + scene.pressGlow * 0.7})`;
      ctx.lineWidth = 3;
      ctx.lineJoin = 'bevel';
      ctx.beginPath();
      const teethY = ramY + dieH;
      for (let i = 0; i < 5; i++) {
        const tx = dieX + dieW * 0.08 + i * (dieW * 0.84 / 4);
        ctx.moveTo(tx, teethY);
        ctx.lineTo(tx + dieW * 0.1, teethY + 8);
        ctx.lineTo(tx + dieW * 0.21, teethY);
      }
      ctx.stroke();

      // Huge Press glow on impact
      if (scene.pressGlow > 0.01) {
        ctx.save();
        ctx.globalCompositeOperation = 'screen';
        ctx.globalAlpha = scene.pressGlow * 0.8;
        const impactGlow = ctx.createRadialGradient(
          px + pw / 2, ramY + dieH, 0,
          px + pw / 2, ramY + dieH, pw
        );
        impactGlow.addColorStop(0, 'rgba(255,220,120,0.8)');
        impactGlow.addColorStop(0.3, 'rgba(255,150,50,0.5)');
        impactGlow.addColorStop(1, 'rgba(255,100,20,0)');
        ctx.fillStyle = impactGlow;
        ctx.fillRect(px - pw * 0.8, ramY - pw * 0.5, pw * 2.6, dieH + pw * 2);
        ctx.restore();
      }

      // Anvil / die base
      ctx.fillStyle = '#394E5D';
      ctx.strokeStyle = 'rgba(255,255,255,0.3)';
      ctx.lineWidth = 2;
      const anvilY = baseY - dieH * 1.4;
      roundRect(ctx, px + pw * 0.15, anvilY, pw * 0.7, dieH * 1.4, 3);
      ctx.fill();
      ctx.stroke();

      // Status indicator light
      const lightColor = scene.pressY > 0.5
        ? `rgba(255,70,50,${0.8 + Math.sin(Date.now() * 0.01) * 0.2})`
        : `rgba(100,255,200,${0.7 + Math.sin(Date.now() * 0.005) * 0.3})`;
      ctx.fillStyle = '#111';
      ctx.beginPath(); ctx.arc(px + pw * 0.88, baseY - ph + pw * 0.08, 8, 0, Math.PI * 2); ctx.fill();
      
      ctx.fillStyle = lightColor;
      ctx.shadowBlur = 15;
      ctx.shadowColor = lightColor;
      ctx.beginPath();
      ctx.arc(px + pw * 0.88, baseY - ph + pw * 0.08, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      ctx.restore();
    };

    const drawBillet = () => {
      const bx = cW * scene.billetX;
      const by = cH * scene.billetY;
      const bw = cW * scene.billetWidth;
      const bh = cH * scene.billetHeight;

      ctx.save();

      // Massive Heat glow around billet
      if (scene.billetHeat > 0.1) {
        ctx.globalCompositeOperation = 'screen';
        ctx.globalAlpha = scene.billetHeat * 0.7;
        const heatGlow = ctx.createRadialGradient(bx + bw / 2, by + bh / 2, bw * 0.1, bx + bw / 2, by + bh / 2, bw * 1.2);
        heatGlow.addColorStop(0, 'rgba(255,180,100,0.8)');
        heatGlow.addColorStop(0.5, 'rgba(255,80,20,0.3)');
        heatGlow.addColorStop(1, 'rgba(255,50,0,0)');
        ctx.fillStyle = heatGlow;
        ctx.fillRect(bx - bw * 1.2, by - bh * 4, bw * 3.4, bh * 9);
        ctx.globalCompositeOperation = 'source-over';
        ctx.globalAlpha = 1;
      }

      // Billet body with extremely bright heat-dependent color
      const r = Math.floor(120 + scene.billetHeat * 135);
      const g = Math.floor(140 + scene.billetHeat * 100);
      const b = Math.floor(160 - scene.billetHeat * 140);
      const billetGrad = ctx.createLinearGradient(bx, by, bx, by + bh);
      billetGrad.addColorStop(0, `rgb(${r},${g},${b})`);
      billetGrad.addColorStop(0.3, `rgb(${Math.floor(r * 1.2)},${Math.floor(g * 1.1)},${Math.floor(b * 0.8)})`);
      billetGrad.addColorStop(1, `rgb(${Math.floor(r * 0.7)},${Math.floor(g * 0.6)},${Math.floor(b * 0.7)})`);
      ctx.fillStyle = billetGrad;
      
      // Intense white core when hot
      if (scene.billetHeat > 0.7) {
        ctx.shadowBlur = 20;
        ctx.shadowColor = 'rgba(255, 200, 100, 1)';
      }
      
      ctx.strokeStyle = `rgba(255,255,255,${0.3 + scene.billetHeat * 0.7})`;
      ctx.lineWidth = 1.5;
      roundRect(ctx, bx, by, bw, bh, 4);
      ctx.fill();
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Surface texture lines
      ctx.strokeStyle = `rgba(0,0,0,${0.1 + scene.billetHeat * 0.2})`;
      ctx.lineWidth = 1;
      for (let i = 1; i < 6; i++) {
        ctx.beginPath();
        ctx.moveTo(bx + bw * (i / 6), by + 2);
        ctx.lineTo(bx + bw * (i / 6), by + bh - 2);
        ctx.stroke();
      }

      // Hot spot core shimmer
      if (scene.billetHeat > 0.4) {
        ctx.globalCompositeOperation = 'screen';
        ctx.globalAlpha = (scene.billetHeat - 0.4) * 0.8;
        ctx.fillStyle = 'rgba(255,240,200,0.6)';
        const shimmerX = bx + Math.sin(Date.now() * 0.005) * bw * 0.15 + bw * 0.4;
        ctx.beginPath();
        ctx.ellipse(shimmerX, by + bh / 2, bw * 0.2, bh * 0.25, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalCompositeOperation = 'source-over';
      }

      ctx.restore();
    };

    const drawConveyor = () => {
      const cy = cH * 0.82;
      const cx = cW * 0.05;
      const cwidth = cW * 0.9;
      const cheight = cH * 0.04;

      ctx.save();

      // Main conveyor body - brighter metallic
      ctx.fillStyle = '#465A69';
      ctx.strokeStyle = 'rgba(255,255,255,0.2)';
      ctx.lineWidth = 2;
      roundRect(ctx, cx, cy, cwidth, cheight, 4);
      ctx.fill();
      ctx.stroke();

      // Conveyor belt surface with rolling marks
      ctx.strokeStyle = 'rgba(0,0,0,0.3)';
      ctx.lineWidth = 1.5;
      const segWidth = 24;
      const offset = (scene.conveyorPhase * segWidth) % segWidth;
      for (let x = cx + offset; x < cx + cwidth; x += segWidth) {
        ctx.beginPath();
        ctx.moveTo(x, cy);
        ctx.lineTo(x, cy + cheight);
        ctx.stroke();
      }

      // Belt highlight
      ctx.fillStyle = 'rgba(255,255,255,0.05)';
      ctx.fillRect(cx, cy + 2, cwidth, cheight * 0.3);

      // Rollers at ends
      const rollerR = cheight * 1.3;
      const drawRoller = (rx: number, ry: number) => {
        ctx.fillStyle = '#5A7184';
        ctx.strokeStyle = 'rgba(255,255,255,0.3)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(rx, ry, rollerR, 0, Math.PI * 2);
        ctx.fill(); ctx.stroke();
        // Inner hub
        ctx.beginPath();
        ctx.arc(rx, ry, rollerR * 0.3, 0, Math.PI * 2);
        ctx.stroke();
        // Spokes
        ctx.strokeStyle = 'rgba(0,0,0,0.2)';
        ctx.lineWidth = 3;
        for (let a = 0; a < 6; a++) {
          const angle = scene.chainPhase + a * Math.PI / 3;
          ctx.beginPath();
          ctx.moveTo(rx + Math.cos(angle) * rollerR * 0.3, ry + Math.sin(angle) * rollerR * 0.3);
          ctx.lineTo(rx + Math.cos(angle) * rollerR * 0.9, ry + Math.sin(angle) * rollerR * 0.9);
          ctx.stroke();
        }
      };

      drawRoller(cx + rollerR, cy + cheight / 2);
      drawRoller(cx + cwidth - rollerR, cy + cheight / 2);

      // Support legs - solid steel
      ctx.fillStyle = '#3A4C5A';
      ctx.strokeStyle = 'rgba(255,255,255,0.2)';
      ctx.lineWidth = 1.5;
      const legW = 10;
      for (let i = 0; i < 5; i++) {
        const lx = cx + cwidth * (0.1 + i * 0.2);
        ctx.fillRect(lx, cy + cheight, legW, cH * 0.1);
        ctx.strokeRect(lx, cy + cheight, legW, cH * 0.1);
        // Foot pad
        ctx.fillRect(lx - 5, cy + cheight + cH * 0.1, legW + 10, 6);
        ctx.strokeRect(lx - 5, cy + cheight + cH * 0.1, legW + 10, 6);
      }

      ctx.restore();
    };

    const drawFinishedPieces = () => {
      if (scene.finishedPieces < 1) return;
      const n = Math.floor(scene.finishedPieces);
      ctx.save();
      for (let i = 0; i < n && i < 5; i++) {
        const px = cW * 0.08 + i * cW * 0.04;
        const py = cH * 0.75 - i * cH * 0.015;
        ctx.fillStyle = '#5A8A9A';
        ctx.strokeStyle = 'rgba(143,216,212,0.2)';
        ctx.lineWidth = 1;
        roundRect(ctx, px, py, cW * 0.06, cH * 0.04, 2);
        ctx.fill();
        ctx.stroke();
      }
      ctx.restore();
    };

    const drawAmbientDetails = () => {
      ctx.save();

      // Dimension annotation
      ctx.font = '10px monospace';
      ctx.fillStyle = 'rgba(143,216,212,0.15)';
      ctx.fillText('Ø 300mm', cW * 0.84, cH * 0.65);
      ctx.fillText('FEED DIRECTION →', cW * 0.06, cH * 0.95);
      ctx.fillText('PRESS: 500T', cW * 0.28, cH * 0.12);

      // Control panel box
      const cpX = cW * 0.04, cpY = cH * 0.2;
      const cpW = cW * 0.08, cpH = cH * 0.25;
      ctx.fillStyle = 'rgba(26,40,48,0.6)';
      ctx.strokeStyle = 'rgba(143,216,212,0.08)';
      ctx.lineWidth = 1;
      roundRect(ctx, cpX, cpY, cpW, cpH, 3);
      ctx.fill();
      ctx.stroke();

      // Buttons on panel
      const btnColors = ['#E8845C', '#8FD8D4', '#C85A63'];
      for (let i = 0; i < 3; i++) {
        ctx.fillStyle = btnColors[i];
        ctx.globalAlpha = 0.5 + Math.sin(Date.now() * 0.002 + i) * 0.2;
        ctx.beginPath();
        ctx.arc(cpX + cpW / 2, cpY + cpH * 0.25 + i * cpH * 0.22, 4, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      // Small screen on panel
      ctx.fillStyle = '#0A0E12';
      roundRect(ctx, cpX + 6, cpY + cpH * 0.75, cpW - 12, cpH * 0.18, 2);
      ctx.fill();
      ctx.fillStyle = 'rgba(143,216,212,0.3)';
      ctx.font = '7px monospace';
      ctx.fillText('1250°C', cpX + 10, cpY + cpH * 0.88);

      // Chain / belt between furnace and press (overhead crane rail)
      ctx.strokeStyle = 'rgba(143,216,212,0.04)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([8, 4]);
      ctx.beginPath();
      ctx.moveTo(cW * 0.12, cH * 0.08);
      ctx.lineTo(cW * 0.88, cH * 0.08);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.restore();
    };

    const drawHeatShimmer = () => {
      if (scene.ambientHeat < 0.1) return;
      ctx.save();
      ctx.globalAlpha = scene.ambientHeat * 0.15;
      const t = Date.now() * 0.001;

      // Wavy heat distortion lines above furnace
      ctx.strokeStyle = 'rgba(255,160,80,0.2)';
      ctx.lineWidth = 1;
      for (let i = 0; i < 4; i++) {
        ctx.beginPath();
        const baseY = cH * 0.15 - i * 15;
        for (let x = cW * 0.7; x < cW * 0.95; x += 3) {
          const yOffset = Math.sin(x * 0.05 + t * (2 + i * 0.5)) * (3 + i * 2);
          if (x === cW * 0.7) ctx.moveTo(x, baseY + yOffset);
          else ctx.lineTo(x, baseY + yOffset);
        }
        ctx.stroke();
      }
      ctx.restore();
    };

    /* ─── Animation Loop ─── */
    let frameCount = 0;

    const loop = () => {
      // Defensive state reset
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = 'source-over';
      ctx.shadowBlur = 0;
      
      ctx.clearRect(0, 0, cW, cH);
      frameCount++;

      // Continuous ambient effects
      scene.furnaceFlicker = Math.sin(frameCount * 0.1) * 0.5 + Math.sin(frameCount * 0.23) * 0.3;
      scene.chainPhase += 0.02;
      scene.conveyorPhase += 0.015;

      // Draw scene layers
      drawAmbientDetails();
      drawConveyor();
      drawFinishedPieces();
      drawFurnace();
      drawPress();
      drawBillet();
      drawHeatShimmer();

      // Ambient embers from furnace
      if (frameCount % 8 === 0 && scene.furnaceGlow > 0.5) {
        emitEmbers(cW * 0.84, cH * 0.3, 1);
      }
      // Ambient smoke from chimney
      if (frameCount % 12 === 0) {
        emitSmoke(cW * 0.84, cH * 0.15, 1);
      }
      // Steam from press area during forging
      if (scene.pressGlow > 0.1 && frameCount % 6 === 0) {
        emitSteam(cW * 0.39, cH * 0.6, 1);
      }

      // Draw all particles on top
      particlesRef.current = particlesRef.current.filter(p => p.alpha > 0 && p.life < p.maxLife);
      particlesRef.current.forEach(p => { p.update(); p.draw(ctx); });

      // Impact flash
      if (scene.impactFlash > 0.01) {
        ctx.save();
        ctx.globalAlpha = scene.impactFlash;
        ctx.fillStyle = 'rgba(255,220,180,0.3)';
        ctx.fillRect(0, 0, cW, cH);
        ctx.restore();
      }

      animFrameRef.current = requestAnimationFrame(loop);
    };
    loop();

    /* ─── GSAP Forging Cycle ─── */
    const forgingCycle = gsap.timeline({ repeat: -1, repeatDelay: 1.5 });

    // Phase 1: Billet enters furnace from right
    forgingCycle
      .set(scene, { billetX: 0.92, billetHeat: 0.1, pressY: 0.18, pressGlow: 0, impactFlash: 0, ambientHeat: 0.2, finishedPieces: 0 })
      .call(() => { phaseRef.current = 'loading'; })
      .to(scene, {
        billetX: 0.73, duration: 2, ease: 'power2.inOut',
        onUpdate: () => { scene.conveyorPhase += 0.03; }
      })

      // Phase 2: Heating in furnace
      .call(() => { phaseRef.current = 'heating'; })
      .to(scene, { billetHeat: 0.95, furnaceGlow: 1, ambientHeat: 0.8, duration: 2.5, ease: 'power1.in' })
      .to(scene, { furnaceGlow: 0.85, duration: 0.3, yoyo: true, repeat: 3 }, '-=1')

      // Phase 3: Extract billet from furnace, move to press
      .call(() => { phaseRef.current = 'transfer'; })
      .to(scene, {
        billetX: 0.32, duration: 2, ease: 'power2.inOut',
        onUpdate: () => {
          scene.billetHeat = Math.max(0.6, scene.billetHeat - 0.002);
          if (Math.random() > 0.7) emitEmbers(cW * scene.billetX + cW * 0.05, cH * scene.billetY, 1);
        }
      })

      // Phase 4: Press comes down — STRIKE!
      .call(() => { phaseRef.current = 'forging'; })
      .to(scene, { pressY: 0.85, duration: 0.2, ease: 'power4.in',
        onComplete: () => {
          // Impact!
          scene.impactFlash = 0.8;
          scene.pressGlow = 1;
          emitSparks(cW * 0.39, cH * 0.72, 80);
          emitSteam(cW * 0.35, cH * 0.65, 5);

          // Screen shake
          if (canvasRef.current) {
            gsap.fromTo(canvasRef.current, { y: 3, x: -2 }, { y: 0, x: 0, duration: 0.25, ease: 'elastic.out(1,0.3)' });
          }

          // Resolve headline on first strike
          if (titleRef.current && titleRef.current.style.webkitTextStroke !== '0px') {
            gsap.to(titleRef.current, {
              color: 'white', duration: 0.5,
              textShadow: '0 0 40px rgba(143,216,212,0.5)',
              onComplete: () => {
                gsap.to(titleRef.current, { textShadow: '0 0 0px rgba(143,216,212,0)', duration: 1.5 });
              }
            });
            titleRef.current.style.webkitTextStroke = '0px';
          }
        }
      })
      .to(scene, { impactFlash: 0, duration: 0.3, ease: 'power2.out' }, '-=0.1')

      // Flatten billet
      .to(scene, { billetHeight: 0.04, billetWidth: 0.22, duration: 0.1 }, '-=0.2')

      // Hold under pressure
      .to(scene, { pressY: 0.85, duration: 0.3 })

      // Second strike
      .to(scene, { pressY: 0.4, duration: 0.3, ease: 'power2.out' })
      .to(scene, { pressY: 0.85, duration: 0.15, ease: 'power4.in',
        onComplete: () => {
          emitSparks(cW * 0.39, cH * 0.72, 50);
          scene.impactFlash = 0.5;
          scene.pressGlow = 0.8;
          if (canvasRef.current) {
            gsap.fromTo(canvasRef.current, { y: 2 }, { y: 0, duration: 0.15, ease: 'elastic.out(1,0.4)' });
          }
        }
      })
      .to(scene, { impactFlash: 0, billetHeight: 0.03, duration: 0.2 })

      // Third strike — lighter
      .to(scene, { pressY: 0.5, duration: 0.25, ease: 'power2.out' })
      .to(scene, { pressY: 0.82, duration: 0.12, ease: 'power4.in',
        onComplete: () => {
          emitSparks(cW * 0.39, cH * 0.72, 35);
          scene.impactFlash = 0.3;
        }
      })
      .to(scene, { impactFlash: 0, duration: 0.15 })

      // Phase 5: Press retracts
      .to(scene, { pressY: 0.18, pressGlow: 0, duration: 0.8, ease: 'back.out(1.2)' })

      // Phase 6: Move finished piece to exit
      .call(() => { phaseRef.current = 'ejecting'; })
      .to(scene, { billetX: 0.05, billetHeat: 0.2, duration: 1.8, ease: 'power2.inOut',
        onComplete: () => { scene.finishedPieces++; }
      })

      // Phase 7: Reset billet for next cycle
      .to(scene, { billetWidth: 0.18, billetHeight: 0.06, ambientHeat: 0.2, duration: 0.1 });


    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animFrameRef.current);
      forgingCycle.kill();
    };
  }, [isClient, emitSparks, emitEmbers, emitSmoke, emitSteam]);

  /* ─── Utility: rounded rect ─── */

  return (
    <section id="hero" className="relative h-screen min-h-[700px] w-full flex items-center overflow-hidden bg-slate" ref={containerRef}>
      {/* Sky Background */}
      <div
        className="absolute inset-0 -m-[5%] w-[110%] h-[110%] bg-cover bg-center parallax-bg z-0 pointer-events-none"
        data-depth="0.04"
        style={{ backgroundImage: "url('/c89e3f732e4f082ebefef89a16b495367555f154.png')" }}
      />

      {/* Dark gradient overlay */}
      <div className="absolute inset-0 z-[1] pointer-events-none" style={{
        background: 'linear-gradient(135deg, rgba(22,35,43,0.85) 0%, rgba(22,35,43,0.5) 40%, rgba(22,35,43,0.3) 70%, rgba(22,35,43,0.6) 100%)'
      }} />

      {/* Noise overlay */}
      <div className="absolute inset-0 z-[2] pointer-events-none noise-overlay" />

      {/* Foreground */}
      <div className="max-w-[1300px] mx-auto w-full px-8 md:px-12 grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-12 lg:gap-20 relative z-10 items-center pt-[80px]">

        {/* Left — Typography */}
        <div className="max-w-[600px]">
          <div className="flex items-center gap-3 mb-8">
            <span className="w-10 h-[1px] bg-cyan-glow/50"></span>
            <p className="font-mono text-[0.75rem] tracking-[0.35em] text-cyan-glow uppercase">
              Darukhana, Mazgaon — Mumbai
            </p>
          </div>

          <h1
            ref={titleRef}
            className="text-[clamp(2.8rem,6vw,4.5rem)] font-display font-bold mb-8 leading-[1.05] transition-all duration-500"
            style={{ color: 'transparent', WebkitTextStroke: '1.5px rgba(143, 216, 212, 0.5)' }}
          >
            FORGING<br/>PRECISION<br/>SINCE 1989
          </h1>

          <p ref={subtitleRef} className="text-[1.1rem] text-white/70 mb-12 max-w-[480px] leading-[1.8] opacity-0">
            The silent, sturdy backbone of your heavy machinery, sugar mills, and manufacturing operations. Treating raw steel with the absolute language of engineering precision.
          </p>

          <div ref={ctaRef} className="flex flex-wrap gap-5 opacity-0">
            <a href="#contact" className="group relative px-8 py-3.5 bg-dawn-coral text-white font-mono text-[0.8rem] tracking-wider uppercase overflow-hidden transition-all duration-300 hover:shadow-[0_0_30px_rgba(232,132,92,0.3)]">
              <span className="relative z-10">Request Spec Sheet</span>
              <span className="absolute inset-0 bg-ember translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
            </a>
            <a href="#products" className="px-8 py-3.5 text-cyan-glow font-mono text-[0.8rem] tracking-wider uppercase border border-cyan-glow/30 hover:border-cyan-glow hover:bg-cyan-glow/5 transition-all duration-300">
              Explore Catalog
            </a>
          </div>
        </div>

        {/* Right — Cinematic Canvas Animation */}
        <div className="relative w-full h-[420px] lg:h-[480px] rounded-lg overflow-hidden parallax-bg" data-depth="0.12">
          {/* Panel background — transparent smoky glass, blends with hero */}
          <div className="absolute inset-0 rounded-lg" style={{
            background: 'linear-gradient(160deg, rgba(22,35,43,0.55) 0%, rgba(22,35,43,0.35) 40%, rgba(30,47,58,0.4) 100%)',
            border: '1px solid rgba(143,216,212,0.06)',
            backdropFilter: 'blur(8px)',
          }} />

          {/* Scanline effect */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-lg opacity-[0.03]">
            <div className="w-full h-[200%] bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(143,216,212,0.1)_2px,rgba(143,216,212,0.1)_4px)]" style={{ animation: 'scanline 8s linear infinite' }} />
          </div>

          {/* Full-size canvas for the entire scene */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full z-10"
            style={{ imageRendering: 'auto' }}
          />

          {/* Vignette */}
          <div className="absolute inset-0 z-20 pointer-events-none rounded-lg" style={{
            background: 'radial-gradient(ellipse at center, transparent 50%, rgba(22,35,43,0.6) 100%)'
          }} />

          {/* Panel corner accents */}
          <div className="absolute top-3 left-3 w-4 h-4 border-t border-l border-cyan-glow/20 z-30" />
          <div className="absolute top-3 right-3 w-4 h-4 border-t border-r border-cyan-glow/20 z-30" />
          <div className="absolute bottom-3 left-3 w-4 h-4 border-b border-l border-cyan-glow/20 z-30" />
          <div className="absolute bottom-3 right-3 w-4 h-4 border-b border-r border-cyan-glow/20 z-30" />
        </div>
      </div>

      {/* Bottom fade into next section */}
      <div className="absolute bottom-0 left-0 right-0 h-32 z-10 pointer-events-none" style={{ background: 'linear-gradient(to top, var(--color-paper), transparent)' }} />
    </section>
  );
}

/* ─── Canvas helper ─── */
function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}
