'use client';

import { useEffect, useRef } from 'react';
import { motion, useInView, useSpring, useTransform } from 'framer-motion';

function Counter({ value, unit, label, delay }: { value: number; unit: string; label: string; delay: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  
  const spring = useSpring(0, { duration: 2500, bounce: 0 });
  const display = useTransform(spring, (current) => Math.round(current));

  useEffect(() => {
    if (isInView) {
      const timeout = setTimeout(() => spring.set(value), delay);
      return () => clearTimeout(timeout);
    }
  }, [isInView, spring, value, delay]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: delay / 1000 }}
      className="flex flex-col items-center text-center py-8 relative group"
    >
      {/* Decorative top line */}
      <div className="w-8 h-[2px] bg-gradient-to-r from-transparent via-dawn-coral to-transparent mb-6 opacity-40 group-hover:opacity-100 group-hover:w-12 transition-all duration-500" />
      
      <div className="flex items-baseline font-mono font-semibold leading-none mb-4">
        <motion.span className="text-[clamp(2.5rem,4vw,3.8rem)] text-slate">{display}</motion.span>
        {unit && <span className="text-[clamp(1.2rem,2vw,1.6rem)] text-dawn-coral ml-1.5">{unit}</span>}
      </div>
      
      <span className="text-[0.7rem] text-steel uppercase tracking-[0.25em] font-mono">
        {label}
      </span>
    </motion.div>
  );
}

export default function ProofStrip() {
  return (
    <section id="proof" className="relative z-30 bg-paper">
      {/* Top glow line */}
      <div className="glow-line" />
      
      <div className="max-w-[1100px] mx-auto px-8 py-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-0 divide-x divide-steel/10">
          <Counter value={35} unit="+" label="Years of Presence" delay={0} />
          <Counter value={500} unit="T/yr" label="Steel Handled" delay={150} />
          <Counter value={18} unit="" label="States Supplied" delay={300} />
          <Counter value={4} unit="" label="Core Sectors" delay={450} />
        </div>
      </div>

      {/* Bottom glow line */}
      <div className="glow-line" />
    </section>
  );
}
