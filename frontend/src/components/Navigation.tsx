'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const pathname = usePathname();
  const isHome = pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);

      if (isHome) {
        const sections = ['process', 'products', 'industries', 'milestones', 'faq'];
        let current = '';
        for (const section of sections) {
          const element = document.getElementById(section);
          if (element && window.scrollY >= element.offsetTop - 200) {
            current = section;
          }
        }
        setActiveSection(current);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHome]);

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
    { label: 'Products', href: '/products' },
    { label: 'Grades', href: '/steel-grades' },
    { label: 'Process', href: '/#process' },
    { label: 'Sectors', href: '/#industries' },
    { label: 'Calculator', href: '/tools/weight-calculator' },
    { label: 'Legacy', href: '/#milestones' },
    { label: 'FAQ', href: '/#faq' },
  ];

  return (
    <>
    <header
      className={`fixed top-0 left-0 w-full h-[72px] z-50 transition-all duration-500 ease-out ${
        isScrolled || !isHome
          ? "bg-paper/95 backdrop-blur-xl border-b border-steel/10 shadow-[0_1px_20px_rgba(22,35,43,0.06)]"
          : "bg-transparent border-b border-white/[0.06]"
      }`}
    >
      <nav className="max-w-[1300px] mx-auto h-full flex justify-between items-center px-5 sm:px-8 md:px-12">
        <Link href="/" className="relative z-50 flex items-center gap-2.5 sm:gap-3.5 min-w-0 max-w-[calc(100%-3.5rem)] group">
          <div className={`relative flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-full overflow-hidden flex items-center justify-center transition-all duration-500 ${
            isScrolled || !isHome
              ? "bg-transparent"
              : "bg-white/95 shadow-[0_2px_12px_rgba(0,0,0,0.18)] ring-1 ring-white/30"
          }`}>
            <Image
              src="/og-logo-transparent.png"
              alt="Shah Industrial Enterprise Logo"
              width={44}
              height={44}
              className="w-full h-full object-contain p-0.5 transition-transform duration-300 group-hover:scale-105"
              priority
            />
          </div>
          <div className="flex flex-col gap-0.5 min-w-0">
            <span className={`font-display font-bold text-[0.95rem] sm:text-[1.25rem] tracking-[0.05em] sm:tracking-[0.08em] transition-colors duration-500 ${isScrolled || !isHome ? 'text-slate' : 'text-white'}`}>
              SHAH INDUSTRIAL ENTERPRISE{" "}
            </span>
            <span className={`truncate font-mono text-[0.52rem] sm:text-[0.6rem] tracking-[0.16em] sm:tracking-[0.25em] uppercase transition-colors duration-500 ${isScrolled || !isHome ? 'text-slate/60' : 'text-white/60'}`}>
              Est. 1961 · Mazgaon, Mumbai
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <ul className="hidden md:flex items-center gap-7 lg:gap-8">
          {navLinks.map((item) => {
            const isActive = isHome && activeSection === item.href.replace(/^\/?#/, '');
            return (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className={`font-mono text-[0.72rem] lg:text-[0.75rem] tracking-[0.1em] uppercase transition-all duration-300 ${
                    isActive
                      ? 'text-dawn-coral'
                      : isScrolled || !isHome
                      ? 'text-slate/70 hover:text-slate'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
          <li>
            <Link
              href="/contact"
              className={`font-mono text-[0.75rem] tracking-[0.1em] uppercase px-5 py-2.5 rounded-sm transition-all duration-300 ${
                isScrolled || !isHome
                  ? "bg-slate text-white hover:bg-steel"
                  : "bg-dawn-coral text-slate-900 font-bold hover:bg-[#f09770]"
              }`}
            >
              Get Quote
            </Link>
          </li>
        </ul>

        {/* Mobile Toggle */}
        <button
          className="relative z-50 flex h-12 w-12 flex-col items-end justify-center gap-1.5 md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
          aria-expanded={isMenuOpen}
          aria-controls="mobile-menu"
        >
          <span className={`block h-[1.5px] transition-all duration-300 ${isScrolled || !isHome ? 'bg-slate' : 'bg-white'} ${isMenuOpen ? 'w-7 rotate-45 translate-y-[5px]' : 'w-7'}`} />
          <span className={`block h-[1.5px] transition-all duration-300 ${isScrolled || !isHome ? 'bg-slate' : 'bg-white'} ${isMenuOpen ? 'w-7 -rotate-45 -translate-y-[2px]' : 'w-5'}`} />
        </button>

      </nav>
    </header>
    <div
      id="mobile-menu"
      inert={!isMenuOpen ? true : undefined}
      aria-hidden={!isMenuOpen}
      className={`fixed inset-0 z-[45] flex min-h-[100dvh] flex-col items-center overflow-y-auto bg-slate/98 px-8 pb-[calc(2rem+env(safe-area-inset-bottom))] pt-[calc(6rem+env(safe-area-inset-top))] backdrop-blur-2xl transition-opacity duration-300 md:hidden ${
        isMenuOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
      }`}
    >
      <nav aria-label="Mobile Navigation" className="flex w-full max-w-[280px] flex-col items-center">
        <ul className="flex w-full flex-col items-center gap-2">
          {navLinks.map((item) => (
            <li key={item.label} className="w-full text-center">
              <Link
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className="block w-full rounded-md px-4 py-2.5 text-center font-display text-xl tracking-wider text-white transition-colors hover:bg-white/5 hover:text-cyan-glow"
              >
                {item.label}
              </Link>
            </li>
          ))}
          <li className="w-full text-center pt-2">
            <Link
              href="/contact"
              onClick={() => setIsMenuOpen(false)}
              className="block w-full rounded bg-dawn-coral py-3.5 text-center font-mono text-xs font-bold uppercase tracking-wider text-slate-900"
            >
              Get Quote
            </Link>
          </li>
        </ul>
      </nav>
    </div>
    </>
  );
}
