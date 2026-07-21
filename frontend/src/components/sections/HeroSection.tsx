'use client';

import { useEffect, useRef } from 'react';

export default function HeroSection() {
  const sceneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let frame = 0;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const handlePointerMove = (event: PointerEvent) => {
      targetX = (event.clientX / window.innerWidth - 0.5) * 2;
      targetY = (event.clientY / window.innerHeight - 0.5) * 2;
    };

    const render = () => {
      currentX += (targetX - currentX) * 0.05;
      currentY += (targetY - currentY) * 0.05;
      scene.style.setProperty('--scene-x', `${currentX * 10}px`);
      scene.style.setProperty('--scene-y', `${currentY * 6}px`);
      frame = requestAnimationFrame(render);
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    frame = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section id="hero" className="hero-shell relative min-h-[680px] overflow-hidden bg-slate text-white sm:min-h-[720px]" ref={sceneRef}>
      <div className="hero-atmosphere absolute inset-0" aria-hidden="true" />
      <div className="hero-grid absolute inset-0" aria-hidden="true" />
      <div className="hero-glow hero-glow-one absolute" aria-hidden="true" />
      <div className="hero-glow hero-glow-two absolute" aria-hidden="true" />

      <div className="relative z-10 mx-auto grid min-h-[680px] w-full max-w-[1380px] grid-cols-1 items-center gap-10 px-5 pb-16 pt-28 sm:min-h-[720px] sm:gap-12 sm:px-8 sm:pb-20 sm:pt-32 md:px-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16 lg:pb-24 lg:pt-28">
        <div className="max-w-[610px]">
          <div className="mb-7 flex items-center gap-3 text-cyan-glow">
            <span className="h-px w-10 bg-cyan-glow/70" />
            <p className="font-mono text-[0.68rem] tracking-[0.28em] uppercase">
              Iron and Steel Merchants · Hacksaw Cutting Specialist
            </p>
          </div>

          <h1 className="hero-heading mb-6 max-w-[650px] font-display text-[clamp(2.9rem,12vw,6.8rem)] font-semibold leading-[0.91] tracking-[-0.045em] sm:mb-7 sm:text-[clamp(3.5rem,7vw,6.8rem)]">
            Heavy steamer shafts, forged rounds, <span className="hero-heading-accent">ready to work.</span>
          </h1>

          <p className="mb-8 max-w-[520px] text-[0.98rem] leading-[1.75] text-white/65 sm:mb-9 sm:text-[1.05rem] md:text-[1.12rem]">
            Heavy steamer shafts, carbon steel, alloy steel round bars, M.S. rounds, EN8, EN9, EN19, EN24, EN31 and C45 materials supplied cut-to-size from Darukhana, Mazgaon since 1989.
          </p>

          <div className="mb-12 flex flex-wrap gap-4">
            <a href="#contact" className="hero-primary-cta group inline-flex w-full items-center justify-center gap-3 bg-dawn-coral px-6 py-4 font-mono text-[0.72rem] tracking-[0.16em] uppercase transition-all duration-300 hover:bg-[#f09770] hover:shadow-[0_12px_40px_rgba(232,132,92,0.22)] sm:w-auto">
              Request a quote
              <span className="text-lg leading-none transition-transform duration-300 group-hover:translate-x-1">→</span>
            </a>
            <a href="#products" className="inline-flex w-full items-center justify-center gap-3 border border-white/20 px-6 py-4 font-mono text-[0.72rem] tracking-[0.16em] text-white/75 uppercase transition-all duration-300 hover:border-cyan-glow/60 hover:bg-white/5 hover:text-white sm:w-auto">
              View materials
              <span className="text-cyan-glow">↘</span>
            </a>
          </div>

          <div className="grid max-w-[520px] grid-cols-3 border-y border-white/10 py-5">
            <div className="border-r border-white/10 pr-4">
              <p className="font-mono text-xl text-white">35<span className="text-dawn-coral">+</span></p>
              <p className="mt-1 font-mono text-[0.58rem] tracking-[0.16em] text-white/40 uppercase">Years trading</p>
            </div>
            <div className="border-r border-white/10 px-4">
              <p className="font-mono text-xl text-white">18</p>
              <p className="mt-1 font-mono text-[0.58rem] tracking-[0.16em] text-white/40 uppercase">States supplied</p>
            </div>
            <div className="pl-4">
              <p className="font-mono text-xl text-white">±1<span className="text-cyan-glow">mm</span></p>
              <p className="mt-1 font-mono text-[0.58rem] tracking-[0.16em] text-white/40 uppercase">Cut tolerance</p>
            </div>
          </div>
        </div>

        <div className="hero-scene-wrap relative min-w-0 lg:translate-x-4" aria-label="Technical illustration showing steel stock being cut to size and prepared for dispatch" role="img">
          <div className="hero-scene-frame absolute -inset-4 rounded-[2rem] border border-cyan-glow/10 bg-slate/20 blur-[1px]" aria-hidden="true" />
          <div className="hero-scene relative overflow-hidden rounded-2xl border border-white/15 bg-[#14242d]/75 shadow-[0_30px_90px_rgba(0,0,0,0.3)] backdrop-blur-sm">
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4 sm:px-7">
              <div className="flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-cyan-glow shadow-[0_0_12px_rgba(143,216,212,0.9)]" />
                <span className="font-mono text-[0.62rem] tracking-[0.2em] text-white/55 uppercase">Material flow / live view</span>
              </div>
              <span className="font-mono text-[0.6rem] tracking-[0.15em] text-white/30">SIE–01</span>
            </div>

            <svg className="hero-svg block h-auto w-full" viewBox="0 0 760 520" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <title>Cut-to-size steel workflow</title>
              <defs>
                <linearGradient id="machineBody" x1="290" y1="140" x2="530" y2="400" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#314B58" />
                  <stop offset="1" stopColor="#1C303A" />
                </linearGradient>
                <linearGradient id="steelRod" x1="0" y1="0" x2="0" y2="1">
                  <stop stopColor="#D8ECEB" />
                  <stop offset="0.42" stopColor="#8FD8D4" />
                  <stop offset="1" stopColor="#43838A" />
                </linearGradient>
                <linearGradient id="warmEdge" x1="0" y1="0" x2="1" y2="0">
                  <stop stopColor="#E8845C" stopOpacity="0" />
                  <stop offset="0.5" stopColor="#E8845C" />
                  <stop offset="1" stopColor="#E8845C" stopOpacity="0" />
                </linearGradient>
                <pattern id="blueprintGrid" width="32" height="32" patternUnits="userSpaceOnUse">
                  <path d="M32 0H0V32" stroke="#8FD8D4" strokeOpacity="0.08" />
                </pattern>
                <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="7" result="blur" />
                  <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
              </defs>

              <rect width="760" height="520" fill="url(#blueprintGrid)" />
              <path d="M40 438H720" stroke="#8FD8D4" strokeOpacity="0.12" />
              <path d="M40 444H720" stroke="#8FD8D4" strokeOpacity="0.05" strokeDasharray="2 8" />

              {/* Measurement rail */}
              <g opacity="0.55">
                <path d="M62 76H698" stroke="#8FD8D4" strokeOpacity="0.35" />
                <path d="M62 70V82M698 70V82M210 72V80M360 72V80M510 72V80" stroke="#8FD8D4" strokeOpacity="0.35" />
                <text x="62" y="58" fill="#8FD8D4" fontSize="10" fontFamily="monospace" letterSpacing="2">RAW STOCK / 6000 MM</text>
                <text x="698" y="58" textAnchor="end" fill="#8FD8D4" fontSize="10" fontFamily="monospace" letterSpacing="2">OUTPUT / AS DRAWN</text>
              </g>

              {/* Stock rack */}
              <g className="svg-stock-rack">
                <path d="M58 404V206M58 404H218M218 404V206" stroke="#D8ECEB" strokeOpacity="0.5" strokeWidth="2" />
                <path d="M47 404H230" stroke="#D8ECEB" strokeOpacity="0.25" strokeWidth="2" />
                <path d="M74 350H202M74 296H202M74 242H202" stroke="#8FD8D4" strokeOpacity="0.2" strokeDasharray="3 5" />
                <rect x="76" y="328" width="126" height="18" rx="9" fill="url(#steelRod)" fillOpacity="0.45" stroke="#8FD8D4" strokeOpacity="0.55" />
                <rect x="76" y="274" width="126" height="18" rx="9" fill="url(#steelRod)" fillOpacity="0.58" stroke="#8FD8D4" strokeOpacity="0.7" />
                <rect x="76" y="220" width="126" height="18" rx="9" fill="url(#steelRod)" fillOpacity="0.75" stroke="#D8ECEB" strokeOpacity="0.85" />
                <path d="M80 229H198" stroke="white" strokeOpacity="0.35" />
                <text x="76" y="423" fill="#8FD8D4" fontSize="10" fontFamily="monospace" letterSpacing="2">01 / STOCK</text>
              </g>

              {/* Feed rollers and live shaft */}
              <g className="svg-feed-line">
                <path d="M188 356H308" stroke="#8FD8D4" strokeOpacity="0.22" strokeWidth="2" />
                <circle cx="226" cy="356" r="16" fill="#203842" stroke="#8FD8D4" strokeOpacity="0.6" />
                <circle cx="278" cy="356" r="16" fill="#203842" stroke="#8FD8D4" strokeOpacity="0.6" />
                <path d="M218 356L234 356M270 356L286 356" stroke="#8FD8D4" strokeOpacity="0.5" />
                <g className="svg-live-rod">
                  <rect x="168" y="345" width="166" height="22" rx="11" fill="url(#steelRod)" stroke="#E7FFFD" strokeOpacity="0.9" />
                  <path d="M180 350H322" stroke="white" strokeOpacity="0.45" />
                </g>
              </g>

              {/* Cut-to-size housing */}
              <g className="svg-cut-housing">
                <rect x="298" y="142" width="232" height="264" rx="12" fill="url(#machineBody)" fillOpacity="0.92" stroke="#D8ECEB" strokeOpacity="0.48" strokeWidth="2" />
                <path d="M298 186H530M298 394H530" stroke="#8FD8D4" strokeOpacity="0.2" />
                <path d="M320 166H508" stroke="#D8ECEB" strokeOpacity="0.2" strokeDasharray="5 6" />
                <rect x="330" y="207" width="168" height="124" rx="5" fill="#0D1D25" stroke="#8FD8D4" strokeOpacity="0.32" />
                <path d="M330 269H498" stroke="#8FD8D4" strokeOpacity="0.18" strokeDasharray="3 5" />
                <path d="M414 207V331" stroke="#8FD8D4" strokeOpacity="0.18" strokeDasharray="3 5" />
                <circle cx="472" cy="168" r="5" fill="#8FD8D4" />
                <circle cx="490" cy="168" r="5" fill="#E8845C" />
                <rect x="320" y="350" width="62" height="22" rx="3" fill="#11252E" stroke="#8FD8D4" strokeOpacity="0.24" />
                <text x="351" y="365" textAnchor="middle" fill="#8FD8D4" fontSize="9" fontFamily="monospace">±1 MM</text>
                <text x="316" y="423" fill="#8FD8D4" fontSize="10" fontFamily="monospace" letterSpacing="2">02 / CUT STATION</text>
              </g>

              {/* Saw blade */}
              <g className="svg-blade" filter="url(#softGlow)">
                <circle cx="414" cy="269" r="49" fill="#1C343E" stroke="#D8ECEB" strokeOpacity="0.76" strokeWidth="2" />
                <circle cx="414" cy="269" r="35" stroke="#8FD8D4" strokeOpacity="0.45" strokeDasharray="3 6" strokeWidth="3" />
                <circle cx="414" cy="269" r="8" fill="#E8845C" />
                <path d="M414 218L423 237L440 226L435 249L459 247L440 263L459 277L435 276L440 299L423 288L414 320L405 288L388 299L393 276L369 277L388 263L369 247L393 249L388 226L405 237L414 218Z" fill="#8FD8D4" fillOpacity="0.35" />
              </g>
              <rect className="svg-cut-flash" x="403" y="203" width="22" height="132" fill="url(#warmEdge)" opacity="0.5" />

              {/* Finished output */}
              <g className="svg-output-stack">
                <path d="M550 404H710" stroke="#D8ECEB" strokeOpacity="0.5" strokeWidth="2" />
                <rect x="558" y="352" width="132" height="18" rx="9" fill="url(#steelRod)" fillOpacity="0.55" stroke="#8FD8D4" strokeOpacity="0.6" />
                <rect x="558" y="326" width="132" height="18" rx="9" fill="url(#steelRod)" fillOpacity="0.68" stroke="#8FD8D4" strokeOpacity="0.72" />
                <rect x="558" y="300" width="132" height="18" rx="9" fill="url(#steelRod)" fillOpacity="0.84" stroke="#D8ECEB" strokeOpacity="0.85" />
                <path d="M566 309H682M566 335H682M566 361H682" stroke="white" strokeOpacity="0.35" />
                <path d="M544 285H704" stroke="#E8845C" strokeOpacity="0.6" strokeDasharray="2 5" />
                <text x="558" y="423" fill="#8FD8D4" fontSize="10" fontFamily="monospace" letterSpacing="2">03 / READY TO SHIP</text>
              </g>

              {/* Flow arrow */}
              <g opacity="0.7">
                <path d="M218 117H542" stroke="url(#warmEdge)" strokeWidth="2" />
                <path d="M542 117L530 110M542 117L530 124" stroke="#E8845C" strokeWidth="2" />
                <text x="380" y="107" textAnchor="middle" fill="#E8845C" fontSize="9" fontFamily="monospace" letterSpacing="2">MEASURE → CUT → DISPATCH</text>
              </g>
            </svg>

            <div className="flex items-center justify-between border-t border-white/10 px-5 py-4 sm:px-7">
              <span className="truncate font-mono text-[0.55rem] tracking-[0.12em] text-white/35 uppercase sm:text-[0.58rem] sm:tracking-[0.15em]">Machined to your drawing</span>
              <span className="shrink-0 font-mono text-[0.55rem] tracking-[0.12em] text-cyan-glow/80 uppercase sm:text-[0.58rem] sm:tracking-[0.15em]">Status: ready</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
