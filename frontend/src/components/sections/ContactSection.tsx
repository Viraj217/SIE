'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    contactInfo: '',
    requirements: '',
  });
  const [status, setStatus] = useState<FormStatus>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [receiptId, setReceiptId] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMessage('');

    try {
      let apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      // Clean trailing slash if present
      if (apiUrl.endsWith('/')) {
        apiUrl = apiUrl.slice(0, -1);
      }
      
      const res = await fetch(`${apiUrl}/api/inquiries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        const msg = data.errors
          ? data.errors.map((e: { message: string }) => e.message).join('. ')
          : data.message || 'Submission failed';
        throw new Error(msg);
      }

      setReceiptId(data.inquiry?.id?.slice(0, 8).toUpperCase() || 'N/A');
      setStatus('success');
      setFormData({ name: '', company: '', contactInfo: '', requirements: '' });
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Something went wrong');
      setStatus('error');
    }
  };

  return (
    <section id="contact" className="relative z-20 bg-paper py-20 noise-overlay sm:py-28 lg:py-36">
      <div className="relative z-10 mx-auto max-w-[1200px] px-5 sm:px-8 md:px-12">
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-12 text-center sm:mb-16 md:mb-24"
        >
          <span className="section-tag justify-center">GET IN TOUCH</span>
          <h2 className="section-title">Let&apos;s Build Something</h2>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-12 lg:gap-20">
          
          {/* Form Card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative overflow-hidden rounded-xl bg-slate p-6 text-white ring-1 ring-white/5 sm:p-8 md:p-12"
          >
            {/* Corner accent */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-cyan-glow/5 to-transparent pointer-events-none" />
            
            <AnimatePresence mode="wait">
              {status === 'success' ? (
                /* ── Success receipt ── */
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="relative z-10 text-center py-8"
                >
                  <div className="w-16 h-16 rounded-full bg-cyan-glow/10 border border-cyan-glow/30 flex items-center justify-center mx-auto mb-6">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#8FD8D4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <h3 className="font-display text-2xl mb-3">Inquiry Received</h3>
                  <p className="text-white/40 text-[0.9rem] mb-8 max-w-sm mx-auto">
                    The Shah family will review your requirements and be in touch shortly.
                  </p>
                  <div className="inline-flex items-center gap-3 bg-white/[0.04] border border-white/[0.08] rounded-md px-5 py-3">
                    <span className="font-mono text-[0.7rem] text-white/40 uppercase tracking-[0.2em]">Ref</span>
                    <span className="font-mono text-cyan-glow tracking-wider">{receiptId}</span>
                  </div>
                  <button
                    onClick={() => setStatus('idle')}
                    className="block mx-auto mt-8 font-mono text-[0.75rem] text-white/30 hover:text-white/60 transition-colors underline underline-offset-4"
                  >
                    Submit another inquiry
                  </button>
                </motion.div>
              ) : (
                /* ── Form ── */
                <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <h3 className="font-display text-2xl md:text-3xl mb-2 relative z-10">Request a Quote</h3>
                  <p className="text-white/40 mb-10 text-[0.9rem] relative z-10">
                    Tell us about your material requirements, grades, and cutting specifications.
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <label className="text-[0.7rem] font-mono uppercase tracking-[0.2em] text-cyan-glow/70">Name</label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="w-full bg-white/[0.04] border border-white/[0.08] rounded-md px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-cyan-glow/40 focus:bg-white/[0.06] transition-all duration-300"
                          placeholder="Your name"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[0.7rem] font-mono uppercase tracking-[0.2em] text-cyan-glow/70">Company</label>
                        <input
                          type="text"
                          name="company"
                          value={formData.company}
                          onChange={handleChange}
                          required
                          className="w-full bg-white/[0.04] border border-white/[0.08] rounded-md px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-cyan-glow/40 focus:bg-white/[0.06] transition-all duration-300"
                          placeholder="Company name"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[0.7rem] font-mono uppercase tracking-[0.2em] text-cyan-glow/70">Email or Phone</label>
                      <input
                        type="text"
                        name="contactInfo"
                        value={formData.contactInfo}
                        onChange={handleChange}
                        required
                        className="w-full bg-white/[0.04] border border-white/[0.08] rounded-md px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-cyan-glow/40 focus:bg-white/[0.06] transition-all duration-300"
                        placeholder="How can we reach you?"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[0.7rem] font-mono uppercase tracking-[0.2em] text-cyan-glow/70">Requirements</label>
                      <textarea
                        rows={4}
                        name="requirements"
                        value={formData.requirements}
                        onChange={handleChange}
                        required
                        minLength={10}
                        className="w-full bg-white/[0.04] border border-white/[0.08] rounded-md px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-cyan-glow/40 focus:bg-white/[0.06] transition-all duration-300 resize-none"
                        placeholder="E.g., 50 pieces of EN8 shafting, Ø 100mm × 500mm long"
                      />
                    </div>

                    {/* Error message */}
                    {status === 'error' && (
                      <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-dawn-coral text-[0.8rem] font-mono"
                      >
                        ⚠ {errorMessage}
                      </motion.p>
                    )}

                    <button
                      type="submit"
                      disabled={status === 'submitting'}
                      className="group w-full py-4 bg-dawn-coral text-white font-mono uppercase tracking-[0.15em] text-[0.8rem] rounded-md relative overflow-hidden transition-shadow duration-300 hover:shadow-[0_0_30px_rgba(232,132,92,0.25)] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="relative z-10">
                        {status === 'submitting' ? (
                          <span className="flex items-center justify-center gap-2">
                            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25" />
                              <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="opacity-75" />
                            </svg>
                            Processing...
                          </span>
                        ) : (
                          'Send Inquiry'
                        )}
                      </span>
                      <span className="absolute inset-0 bg-ember translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                    </button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Contact Details */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col justify-center"
          >
            <h3 className="font-display text-2xl mb-3">The Shah Family</h3>
            <p className="text-steel/60 mb-12 text-[0.95rem] leading-relaxed">
              Prefer speaking directly to the owners? We&apos;re available during business hours — no switchboard, no waiting.
            </p>

            <div className="space-y-6">
              {[
                { icon: (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                ), name: 'Owner Name', detail: '+91 98XXX XXXXX' },
                { icon: (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                ), name: 'Second Contact', detail: '+91 98XXX XXXXX' },
                { icon: (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                ), name: 'Yard Location', detail: 'Darukhana, Mazgaon\nMumbai 400010' },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="flex gap-5 items-start group cursor-default"
                >
                  <div className="w-11 h-11 rounded-lg bg-steel/[0.06] flex items-center justify-center shrink-0 text-steel group-hover:bg-dawn-coral/10 group-hover:text-dawn-coral transition-all duration-300">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="font-display text-lg mb-0.5">{item.name}</h4>
                    <p className="font-mono text-[0.85rem] text-steel/60 whitespace-pre-line">{item.detail}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Business hours */}
            <div className="mt-12 pt-8 border-t border-steel/10">
              <p className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-steel/40 mb-2">Business Hours</p>
              <p className="font-mono text-[0.85rem] text-steel/70">Mon – Sat: 9:00 AM — 7:00 PM IST</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
