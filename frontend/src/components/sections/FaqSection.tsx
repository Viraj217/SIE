'use client';

import { motion } from 'framer-motion';
import { seoFaqs } from '@/lib/seo';

export default function FaqSection() {
  return (
    <section id="faq" className="relative z-20 bg-paper px-5 py-12 sm:px-8 sm:py-16 md:px-12 lg:py-20">
      <div className="mx-auto max-w-[1000px]">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7 }}
          className="mb-10 max-w-[680px]"
        >
          <span className="section-tag">BUYER QUESTIONS</span>
          <h2 className="section-title">Clear answers before you enquire</h2>
          <p className="section-desc">
            The fastest quote starts with the right details: grade, size, quantity, location, and urgency.
          </p>
        </motion.div>

        <div className="grid gap-4">
          {seoFaqs.map((faq, index) => (
            <motion.details
              key={faq.question}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.55, delay: index * 0.05 }}
              className="group rounded-lg border border-steel/10 bg-white/70 p-5 shadow-[0_4px_28px_rgba(22,35,43,0.04)] open:bg-white"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-5 font-display text-xl text-slate">
                {faq.question}
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate/5 font-mono text-sm text-steel transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-4 max-w-[760px] text-[0.95rem] leading-relaxed text-slate/68">{faq.answer}</p>
            </motion.details>
          ))}
        </div>
      </div>
    </section>
  );
}
