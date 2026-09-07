'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
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
    { label: 'Process', href: isHome ? '#process' : '/#process' },
    { label: 'Sectors', href: isHome ? '#industries' : '/#industries' },
    { label: 'Calculator', href: '/tools/weight-calculator' },
    { label: 'Legacy', href: isHome ? '#milestones' : '/#milestones' },
    { label: 'FAQ', href: isHome ? '#faq' : '/#faq' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 w-full h-[72px] z-50 transition-all duration-500 ease-out ${
        isScrolled || !isHome
          ? "bg-paper/95 backdrop-blur-xl border-b border-steel/10 shadow-[0_1px_20px_rgba(22,35,43,0.06)]"
          : "bg-transparent border-b border-white/[0.06]"
      }`}
    >
      <nav className="max-w-[1300px] mx-auto h-full flex justify-between items-center px-5 sm:px-8 md:px-12">
        <Link href="/" className="relative z-50 flex min-w-0 flex-col gap-0.5 group">
          <span className={`font-display font-bold text-[1.15rem] sm:text-[1.25rem] tracking-[0.08em] transition-colors duration-500 ${isScrolled || !isHome ? 'text-slate' : 'text-white'}`}>
            SHAH INDUSTRIAL ENTERPRISE
          </span>
          <span className={`font-mono text-[0.58rem] sm:text-[0.6rem] tracking-[0.25em] uppercase transition-colors duration-500 ${isScrolled || !isHome ? 'text-slate/60' : 'text-white/40'}`}>
            Est. 1989 · Mazgaon, Mumbai
          </span>
        </Link>

        {/* Desktop Nav */}
        <ul className="hidden md:flex items-center gap-7 lg:gap-8">
          {navLinks.map((item) => {
            const isActive = isHome && activeSection === item.href.slice(1);
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
          className="relative z-50 flex w-9 flex-col items-end gap-1.5 p-1 md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
          aria-expanded={isMenuOpen}
          aria-controls="mobile-menu"
        >
          <span className={`block h-[1.5px] transition-all duration-300 ${isScrolled || !isHome ? 'bg-slate' : 'bg-white'} ${isMenuOpen ? 'w-7 rotate-45 translate-y-[5px]' : 'w-7'}`} />
          <span className={`block h-[1.5px] transition-all duration-300 ${isScrolled || !isHome ? 'bg-slate' : 'bg-white'} ${isMenuOpen ? 'w-7 -rotate-45 -translate-y-[2px]' : 'w-5'}`} />
        </button>

        {/* Mobile Overlay */}
        <div
          id="mobile-menu"
          className={`fixed inset-0 z-40 flex flex-col items-center justify-center gap-7 bg-slate/98 px-8 backdrop-blur-2xl transition-all duration-500 md:hidden ${
            isMenuOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
          }`}
        >
          {navLinks.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={() => setIsMenuOpen(false)}
              className="font-display text-white text-2xl tracking-wider hover:text-cyan-glow transition-colors"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/contact"
            onClick={() => setIsMenuOpen(false)}
            className="mt-4 w-full max-w-[280px] text-center rounded bg-dawn-coral py-3.5 font-mono text-xs font-bold uppercase tracking-wider text-slate-900"
          >
            Get Quote
          </Link>
        </div>
      </nav>
    </header>
  );
}
