'use client';

import { motion } from 'framer-motion';

const TRUST_ITEMS = [
  {
    title: 'Owner-led quoting',
    body: 'Requirements go directly to the Shah family, so buyers get practical stock guidance instead of a generic sales reply.',
  },
  {
    title: 'Cut-to-size clarity',
    body: 'Each enquiry captures grade, dimensions, quantity, and delivery location before quoting to reduce back-and-forth.',
  },
  {
    title: 'Industrial buyer focus',
    body: 'Materials are positioned for machinists, fabricators, mills, marine work, and heavy engineering teams.',
  },
];

const CHECKPOINTS = [
  'Material grade and finish confirmed before dispatch',
  'Custom cutting requests reviewed against machine capacity',
  'Mumbai yard pickup and outstation dispatch coordination',
  'Phone or WhatsApp follow-up for urgent requirements',
];

export default function TrustSection() {
  return (
    <section id="trust" className="relative z-20 overflow-hidden bg-slate py-12 text-white sm:py-16 lg:py-20">
      <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(143,216,212,0.35)_1px,transparent_1px),linear-gradient(90deg,rgba(143,216,212,0.35)_1px,transparent_1px)] [background-size:56px_56px]" />

      <div className="relative z-10 mx-auto grid max-w-[1200px] gap-12 px-5 sm:px-8 md:px-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.75 }}
        >
          <span className="section-tag text-cyan-glow/75">BUYER CONFIDENCE</span>
          <h2 className="font-display text-[clamp(2rem,4vw,3.1rem)] font-bold leading-[1.12]">
            Built for serious material enquiries
          </h2>
          <p className="mt-6 max-w-[520px] text-[1rem] leading-relaxed text-white/58">
            The site now asks for the same details procurement teams usually share over a call: grade, size, quantity, urgency, and delivery destination.
          </p>

          <div className="mt-10 grid grid-cols-2 gap-3">
            {[
              ['35+', 'Years in trade'],
              ['2 hr', 'Expected response'],
              ['4', 'Core sectors'],
              ['2', 'Owner contacts'],
            ].map(([value, label]) => (
              <div key={label} className="rounded-lg border border-white/8 bg-white/[0.035] p-4">
                <p className="font-display text-3xl text-cyan-glow">{value}</p>
                <p className="mt-1 font-mono text-[0.65rem] uppercase tracking-[0.16em] text-white/38">{label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <div className="space-y-5">
          {TRUST_ITEMS.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.65, delay: index * 0.08 }}
              className="rounded-lg border border-white/8 bg-white/[0.04] p-6"
            >
              <p className="font-mono text-[0.68rem] uppercase tracking-[0.2em] text-dawn-coral">0{index + 1}</p>
              <h3 className="mt-3 font-display text-2xl">{item.title}</h3>
              <p className="mt-2 text-[0.95rem] leading-relaxed text-white/55">{item.body}</p>
            </motion.div>
          ))}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.65, delay: 0.25 }}
            className="rounded-lg border border-cyan-glow/18 bg-cyan-glow/[0.06] p-6"
          >
            <h3 className="font-display text-2xl">Quote readiness checklist</h3>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {CHECKPOINTS.map((item) => (
                <div key={item} className="flex gap-3 text-sm leading-relaxed text-white/62">
                  <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-cyan-glow" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
