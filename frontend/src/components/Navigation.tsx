'use client';

import { useEffect, useState } from 'react';

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > window.innerHeight * 0.75);

      const sections = ['process', 'products', 'industries', 'trust', 'milestones', 'faq'];
      let current = '';
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element && window.scrollY >= element.offsetTop - 200) {
          current = section;
        }
      }
      setActiveSection(current);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsMenuOpen(false);
    };

    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMenuOpen]);

  const navLinks = [
    { label: 'Process', href: '#process' },
    { label: 'Products', href: '#products' },
    { label: 'Sectors', href: '#industries' },
    { label: 'Trust', href: '#trust' },
    { label: 'Legacy', href: '#milestones' },
    { label: 'FAQ', href: '#faq' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 w-full h-[72px] z-50 transition-all duration-500 ease-out ${
        isScrolled
          ? "bg-paper/90 backdrop-blur-xl border-b border-steel/10 shadow-[0_1px_20px_rgba(22,35,43,0.05)]"
          : "bg-transparent border-b border-white/[0.04]"
      }`}
    >
      <nav className="max-w-[1300px] mx-auto h-full flex justify-between items-center px-8 md:px-12">
        <a href="#" className="relative z-50 flex min-w-0 flex-col gap-0.5 group">
          <span className={`font-display font-bold text-[1.25rem] tracking-[0.08em] transition-colors duration-500 ${isScrolled ? 'text-slate' : 'text-white'}`}>
            SHAH INDUSTRIAL ENTERPRISE
          </span>
          <span className={`font-mono text-[0.6rem] tracking-[0.3em] uppercase transition-colors duration-500 ${isScrolled ? 'text-slate/60' : 'text-white/40'}`}>
            Est. 1989 · Mazgaon, Mumbai
          </span>
        </a>

        {/* Desktop Nav */}
        <ul className="hidden md:flex items-center gap-8">
          {navLinks.map((item) => (
            <li key={item.label}>
              <a
                href={item.href}
                className={`font-mono text-[0.75rem] tracking-[0.1em] uppercase transition-all duration-300 hover:opacity-100 ${
                  activeSection === item.href.slice(1)
                    ? 'text-dawn-coral'
                    : isScrolled
                    ? 'text-slate/70 hover:text-slate'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                {item.label}
              </a>
            </li>
          ))}
          <li>
            <a
              href="#contact"
              className={`font-mono text-[0.75rem] tracking-[0.1em] uppercase px-5 py-2 rounded-sm transition-all duration-300 ${
                isScrolled
                  ? "bg-slate text-white hover:bg-steel"
                  : "bg-dawn-coral/90 text-slate-900 font-bold hover:bg-dawn-coral"
              }`}
            >
              Get Quote
            </a>
          </li>
        </ul>

        {/* Mobile Toggle */}
        <button
          className="relative z-50 flex w-9 flex-col items-end gap-1.5 p-1 md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
          aria-expanded={isMenuOpen}
          aria-controls="mobile-menu"
        >
          <span className={`block h-[1.5px] transition-all duration-300 ${isScrolled ? 'bg-slate' : 'bg-white'} ${isMenuOpen ? 'w-7 rotate-45 translate-y-[5px]' : 'w-7'}`} />
          <span className={`block h-[1.5px] transition-all duration-300 ${isScrolled ? 'bg-slate' : 'bg-white'} ${isMenuOpen ? 'w-7 -rotate-45 -translate-y-[2px]' : 'w-5'}`} />
        </button>

        {/* Mobile Overlay */}
        <div id="mobile-menu" className={`fixed inset-0 z-40 flex flex-col items-center justify-center gap-8 bg-slate/95 px-8 backdrop-blur-xl transition-all duration-500 md:hidden ${isMenuOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'}`}>
          {navLinks.map((item) => (
            <a key={item.label} href={item.href} onClick={() => setIsMenuOpen(false)} className="font-display text-white text-2xl tracking-wider">
              {item.label}
            </a>
          ))}
          <a href="#contact" onClick={() => setIsMenuOpen(false)} className="mt-4 px-8 py-3 text-center bg-dawn-coral text-slate-900 font-bold font-mono text-sm tracking-wider uppercase">
            Get Quote
          </a>
        </div>
      </nav>
    </header>
  );
}
