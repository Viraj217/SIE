'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { businessConfig } from '@/lib/config';
import { buildGeneralWhatsAppUrl } from '@/lib/whatsapp';
import { trackEvent } from '@/lib/analytics';

export default function FloatingActions() {
  const [activeMenu, setActiveMenu] = useState<'whatsapp' | 'call' | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenu(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleScrollToContact = () => {
    trackEvent('rfq_start', { source_page: 'floating_actions' });
    const contactElem = document.getElementById('contact');
    if (contactElem) {
      contactElem.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.location.href = '/contact';
    }
  };

  return (
    <aside
      aria-label="Contact actions"
      // Hidden below md: MobileStickyBar already owns the bottom of small screens.
      className="fixed bottom-6 right-6 z-50 hidden flex-col items-end gap-3 md:flex"
      ref={menuRef}
    >
      <AnimatePresence>
        {activeMenu && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="mb-2 w-56 rounded-xl bg-slate p-2 shadow-2xl ring-1 ring-white/10"
          >
            <p className="px-3 pt-2 pb-1.5 text-[0.65rem] font-mono tracking-wider text-cyan-glow/80 uppercase">
              {activeMenu === 'whatsapp' ? 'Direct WhatsApp Desk' : 'Direct Call Desk'}
            </p>
            {businessConfig.contacts.map((contact) => {
              const href =
                activeMenu === 'whatsapp'
                  ? buildGeneralWhatsAppUrl(
                      `Hello ${contact.name},\n\nI would like to inquire about steel materials and price quotations from Shah Industrial Enterprise.`,
                      contact.whatsapp
                    )
                  : `tel:${contact.phone}`;

              return (
                <a
                  key={contact.name}
                  href={href}
                  target={activeMenu === 'whatsapp' ? '_blank' : undefined}
                  rel={activeMenu === 'whatsapp' ? 'noopener noreferrer' : undefined}
                  className="block w-full rounded-lg px-3 py-2.5 text-left text-xs sm:text-sm text-white/80 hover:bg-white/10 hover:text-white transition-colors"
                  onClick={() => {
                    setActiveMenu(null);
                  }}
                >
                  <p className="font-medium text-white">{contact.name}</p>
                  <p className="font-mono text-[0.7rem] text-white/50">{contact.formattedPhone}</p>
                </a>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex w-auto items-center gap-3 rounded-full bg-slate/90 p-2 shadow-2xl ring-1 ring-white/10 backdrop-blur-md">
        <button
          onClick={() => setActiveMenu(activeMenu === 'whatsapp' ? null : 'whatsapp')}
          className={`flex h-11 w-11 items-center justify-center rounded-full transition-colors ${
            activeMenu === 'whatsapp' ? 'bg-[#25D366] text-slate-900 font-bold' : 'bg-white/5 text-white/70 hover:bg-[#25D366] hover:text-slate-900'
          }`}
          aria-label="WhatsApp Contacts"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
          </svg>
        </button>
        <button
          onClick={() => setActiveMenu(activeMenu === 'call' ? null : 'call')}
          className={`flex h-11 w-11 items-center justify-center rounded-full transition-colors ${
            activeMenu === 'call' ? 'bg-cyan-glow text-slate' : 'bg-white/5 text-white/70 hover:bg-cyan-glow hover:text-slate'
          }`}
          aria-label="Call Contacts"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
        </button>
        <button
          onClick={handleScrollToContact}
          className="flex h-11 items-center justify-center rounded-full bg-dawn-coral px-5 font-mono text-xs uppercase tracking-wider text-slate-900 font-bold transition-colors hover:bg-[#f09770]"
        >
          Get a Quote
        </button>
      </div>
    </aside>
  );
}
