'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface Milestone {
  year: string;
  title: string;
  description: string;
}

const STATIC_MILESTONES: Milestone[] = [
  { year: '1989', title: 'The Foundation', description: 'Shah Industrial Enterprise opens its doors in Darukhana, Mazgaon — supplying raw mild steel to local fabrication units across Mumbai.' },
  { year: '2002', title: 'Heavy Machinery Expansion', description: 'Expanded inventory to include specialized carbon steel and alloy rods for the booming sugar mill and marine sectors, reaching 8 states.' },
  { year: '2015', title: 'Precision Processing', description: 'Introduced automated, high-tolerance hacksaw cutting — allowing clients to receive exact-dimension stock ready for CNC machining.' },
  { year: 'TODAY', title: 'Trusted Backbone', description: 'A second-generation legacy, recognized across 18 states for uncompromising material quality and delivery reliability.' },
];

function TimelineNode({ year, title, desc, side, index }: { year: string; title: string; desc: string; side: 'left' | 'right'; index: number }) {
  const isLeft = side === 'left';

  return (
    <div className={`relative flex w-full mb-12 md:mb-0 ${isLeft ? 'md:justify-start' : 'md:justify-end'}`}>
      {/* Node dot */}
      <div className="absolute left-[7px] md:left-1/2 md:-translate-x-1/2 top-2 z-20">
        <motion.div
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 300 }}
          className="w-4 h-4 rounded-full bg-slate border-[3px] border-cyan-glow relative group-hover:bg-cyan-glow transition-colors duration-300"
        >
          <div className="absolute inset-[-4px] rounded-full border border-cyan-glow/20" />
        </motion.div>
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, x: isLeft ? -40 : 40 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: index * 0.1 }}
        className={`w-full pl-10 md:pl-0 md:w-[calc(50%-40px)] ${isLeft ? '' : 'md:ml-auto'}`}
      >
        <div className={`p-6 md:p-8 rounded-lg bg-white/[0.03] border border-white/[0.06] backdrop-blur-sm hover:border-cyan-glow/20 transition-colors duration-500 ${isLeft ? 'md:text-right' : ''}`}>
          <span className="inline-block font-mono text-cyan-glow font-bold text-lg tracking-[0.2em] mb-3">
            {year}
          </span>
          <h3 className="font-display text-white text-xl md:text-2xl mb-3">{title}</h3>
          <p className="text-white/50 text-[0.9rem] leading-relaxed">{desc}</p>
        </div>
      </motion.div>
    </div>
  );
}

export default function TimelineSection() {
  const [milestones, setMilestones] = useState<Milestone[]>(STATIC_MILESTONES);

  useEffect(() => {
    const fetchTimeline = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        const res = await fetch(`${apiUrl}/api/timeline`);
        const result = await res.json();
        if (result.success && Array.isArray(result.data) && result.data.length > 0) {
          setMilestones(result.data);
        }
      } catch (err) {
        console.warn('Could not load timeline from API, using static fallbacks', err);
      }
    };
    fetchTimeline();
  }, []);

  return (
    <section id="milestones" className="relative z-20 overflow-hidden bg-slate py-20 noise-overlay sm:py-28 lg:py-36">
      {/* Decorative gradient blobs */}
      <div className="absolute top-20 left-[-200px] w-[500px] h-[500px] rounded-full bg-cyan-glow/[0.03] blur-[120px] pointer-events-none" />
      <div className="absolute bottom-20 right-[-200px] w-[400px] h-[400px] rounded-full bg-dawn-coral/[0.03] blur-[120px] pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-[1000px] px-5 sm:px-8 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-12 text-center sm:mb-16 md:mb-24"
        >
          <span className="section-tag justify-center !text-cyan-glow/60">
            LEGACY
          </span>
          <h2 className="section-title !text-white">Three Decades of Iron</h2>
          <p className="section-desc !text-white/40 mx-auto">A journey measured not in profit margins, but in the tonnage of trust.</p>
        </motion.div>

        <div className="relative">
          {/* Center line */}
          <div className="absolute left-[14px] md:left-1/2 md:-translate-x-[0.5px] top-0 bottom-0 w-[1px]">
            <div className="w-full h-full bg-gradient-to-b from-transparent via-white/15 to-transparent" />
          </div>

          {milestones.map((m, i) => (
            <TimelineNode
              key={m.year}
              year={m.year}
              title={m.title}
              desc={m.description}
              side={i % 2 === 0 ? 'left' : 'right'}
              index={i}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
