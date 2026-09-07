'use client';

import { motion } from 'framer-motion';
import { businessConfig } from '@/lib/config';
import RfqForm from './RfqForm';

export default function ContactSection() {
  return (
    <section id="contact" className="relative z-20 bg-paper py-16 noise-overlay sm:py-20 lg:py-24">
      <div className="relative z-10 mx-auto max-w-[1200px] px-5 sm:px-8 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-12 text-center sm:mb-16 md:mb-20"
        >
          <span className="section-tag justify-center">GET IN TOUCH & QUOTE</span>
          <h2 className="section-title">Direct Procurement & Inquiry Desk</h2>
          <p className="section-desc mx-auto text-center">
            Specify the steel grade, diameter, cut length, quantity, and delivery location. For urgent requirements, use the direct call or WhatsApp options.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.35fr_0.85fr] gap-12 lg:gap-16 items-start">
          {/* RFQ Form Card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative overflow-hidden rounded-xl bg-slate p-6 text-white ring-1 ring-white/5 sm:p-8 md:p-10 shadow-2xl"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-cyan-glow/5 to-transparent pointer-events-none" />
            <RfqForm />
          </motion.div>

          {/* Right Column: Contact Details & Yard Information */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col justify-between h-full"
          >
            <div>
              <h3 className="font-display text-2xl sm:text-3xl mb-3 text-slate">Direct Enquiry Desk</h3>
              <p className="text-slate/70 mb-8 text-[0.95rem] leading-relaxed">
                Use the listed contacts for material availability, cutting feasibility, quotations, and dispatch questions.
              </p>

              <div className="space-y-4">
                {businessConfig.contacts.map((contact) => (
                  <div
                    key={contact.name}
                    className="flex items-center justify-between rounded-xl border border-steel/10 bg-white p-4 shadow-sm transition-all hover:border-steel/30"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-steel/10 flex items-center justify-center text-steel font-bold font-mono text-sm">
                        {contact.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-display font-bold text-slate text-base">{contact.name}</h4>
                        <p className="font-mono text-[0.7rem] text-steel/70">{contact.role}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <a
                        href={`tel:${contact.phone}`}
                        className="rounded bg-slate/5 px-3 py-1.5 font-mono text-xs text-slate hover:bg-slate hover:text-white transition-colors"
                        title="Call"
                      >
                        Call
                      </a>
                      <a
                        href={`https://wa.me/${contact.whatsapp}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded bg-[#25D366]/10 px-3 py-1.5 font-mono text-xs text-[#128C7E] hover:bg-[#25D366] hover:text-white transition-colors"
                        title="WhatsApp"
                      >
                        WhatsApp
                      </a>
                    </div>
                  </div>
                ))}
              </div>

              {/* Yard Address */}
              <div className="mt-8 rounded-xl border border-steel/10 bg-white p-5 space-y-4 shadow-sm">
                <div>
                  <p className="font-mono text-[0.68rem] uppercase tracking-[0.16em] text-steel mb-1">
                    Operating Stockyard Location
                  </p>
                  <p className="font-mono text-xs text-slate/80 leading-relaxed">
                    Plot No. 156, 4th Lane, Darukhana, Mazgaon, Mumbai — 400010
                  </p>
                  <a
                    href="https://maps.google.com/?q=Plot+No.+156+4th+Lane+Darukhana+Mazgaon+Mumbai+400010"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-mono text-[0.7rem] text-dawn-coral hover:underline mt-1.5"
                  >
                    View on Google Maps ↗
                  </a>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-steel/10 flex items-center justify-between text-xs font-mono text-slate/60">
              <span>Working Hours: Mon–Sat, 9 AM – 7 PM</span>
              <span>IST</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
