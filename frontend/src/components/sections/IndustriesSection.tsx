'use client';

import { motion } from 'framer-motion';

function IndustryRow({ number, title, desc, isLast }: { number: string, title: string, desc: string, isLast?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -40 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className={`grid grid-cols-1 md:grid-cols-[80px_1fr] gap-6 md:gap-10 items-start py-10 md:py-14 group cursor-default ${!isLast ? 'border-b border-steel/10' : ''}`}
    >
      <span className="font-display text-[3.5rem] leading-none text-steel/15 group-hover:text-dawn-coral/40 transition-colors duration-500 select-none">
        {number}
      </span>
      <div>
        <h3 className="font-display text-[1.5rem] mb-3 group-hover:text-dawn-coral transition-colors duration-300">{title}</h3>
        <p className="text-steel/70 max-w-[550px] leading-[1.8] text-[0.95rem]">{desc}</p>
      </div>
    </motion.div>
  );
}

export default function IndustriesSection() {
  return (
    <section id="industries" className="py-28 lg:py-36 relative bg-paper z-20">
      {/* Subtle top separator */}
      <div className="glow-line mb-0" />

      <div className="max-w-[1000px] mx-auto px-8 md:px-12 pt-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <span className="section-tag">SECTORS WE SERVE</span>
          <h2 className="section-title">Powering Heavy Industry</h2>
          <p className="section-desc">From crushing mills to coastal infrastructure, our materials endure where others fail.</p>
        </motion.div>

        <div>
          <IndustryRow
            number="01"
            title="Sugar Mills & Processing"
            desc="High-load bearing shafts and crushing rollers that withstand immense rotational torque through continuous seasonal operation cycles."
          />
          <IndustryRow
            number="02"
            title="Marine & Offshore"
            desc="Propeller shafts, winch components, and heavy-duty structural steel resistant to saline corrosion and extreme fatigue from ocean conditions."
          />
          <IndustryRow
            number="03"
            title="Earthmoving & Construction"
            desc="Hydraulic cylinder rods, bucket pins, and heavy-wear components engineered to survive the most abrasive and high-impact environments."
          />
          <IndustryRow
            number="04"
            title="General Engineering"
            desc="Precision-cut raw stock for lathes, CNC machining centers, and bespoke fabrication workshops across the subcontinent."
            isLast={true}
          />
        </div>
      </div>
    </section>
  );
}
