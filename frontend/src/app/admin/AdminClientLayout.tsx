'use client';

import { useState, useEffect, createContext, useContext } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

interface AuthContextType {
  token: string | null;
  user: { name: string; email: string; role: string } | null;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({ token: null, user: null, logout: () => {} });
export const useAuth = () => useContext(AuthContext);

const NAV_ITEMS = [
  { href: '/admin/inquiries', label: 'Inquiries', icon: '📥' },
  { href: '/admin/products', label: 'Products', icon: '⚙️' },
  { href: '/admin/timeline', label: 'Timeline', icon: '📅' },
  { href: '/admin/industries', label: 'Industries', icon: '🏭' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('admin_token');
    }
    return null;
  });
  const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(() => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('admin_user');
      if (storedUser) {
        try {
          return JSON.parse(storedUser);
        } catch {
          return null;
        }
      }
    }
    return null;
  });
  const [loading, setLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Sync loading state once mounted
    setLoading(false);
  }, []);

  // Close mobile drawer when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Lock background scroll when mobile drawer is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const logout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    setToken(null);
    setUser(null);
    setIsMobileMenuOpen(false);
    router.push('/admin');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-cyan-glow/30 border-t-cyan-glow rounded-full animate-spin" />
      </div>
    );
  }

  // Show login page if not authenticated and on /admin
  if (!token && pathname === '/admin') {
    return (
      <AuthContext.Provider value={{ token, user, logout }}>
        <div className="min-h-screen bg-slate">{children}</div>
      </AuthContext.Provider>
    );
  }

  // Redirect to login if not authenticated and not on login page
  useEffect(() => {
    if (!loading && !token && pathname !== '/admin') {
      router.push('/admin');
    }
  }, [loading, token, pathname, router]);

  if (!token) {
    return null;
  }

  const currentNavItem = NAV_ITEMS.find((item) => pathname === item.href) || NAV_ITEMS[0];

  return (
    <AuthContext.Provider value={{ token, user, logout }}>
      <div className="min-h-screen bg-slate flex flex-col md:flex-row">
        {/* Mobile Top Header */}
        <header className="md:hidden sticky top-0 z-40 bg-slate/95 backdrop-blur-md border-b border-white/[0.08] px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 -ml-1 text-white/70 hover:text-white hover:bg-white/[0.06] rounded-lg transition-colors focus:outline-none"
              aria-label="Open navigation menu"
              aria-expanded={isMobileMenuOpen}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display text-white text-sm font-semibold tracking-wide">Shah Industrial</h1>
                <span className="font-mono text-[0.6rem] bg-cyan-glow/10 text-cyan-glow border border-cyan-glow/30 px-1.5 py-0.2 rounded font-bold uppercase">
                  Admin
                </span>
              </div>
              <p className="font-mono text-[0.65rem] text-white/50">{currentNavItem.label}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-cyan-glow/10 border border-cyan-glow/30 flex items-center justify-center">
              <span className="font-mono text-cyan-glow text-xs font-bold">{user?.name?.charAt(0) || 'A'}</span>
            </div>
            <button
              onClick={logout}
              className="p-1.5 text-white/40 hover:text-dawn-coral hover:bg-dawn-coral/10 rounded transition-colors text-xs font-mono"
              title="Log out"
              aria-label="Log out"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </header>

        {/* Mobile Slide-over Drawer Backdrop */}
        {isMobileMenuOpen && (
          <div
            className="md:hidden fixed inset-0 z-50 bg-black/70 backdrop-blur-xs transition-opacity duration-300"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* Mobile Slide-over Drawer Panel */}
        <div
          className={`md:hidden fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] bg-slate border-r border-white/[0.08] flex flex-col shadow-2xl transition-transform duration-300 ease-in-out ${
            isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
          role="dialog"
          aria-modal="true"
          aria-label="Navigation drawer"
        >
          <div className="p-5 border-b border-white/[0.06] flex items-center justify-between">
            <div>
              <h2 className="font-display text-white text-base">Shah Industrial</h2>
              <p className="font-mono text-[0.65rem] text-cyan-glow/70 tracking-[0.2em] uppercase mt-0.5">Admin Portal</p>
            </div>
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 text-white/50 hover:text-white hover:bg-white/[0.06] rounded-lg transition-colors"
              aria-label="Close menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all duration-200 ${
                    isActive
                      ? 'bg-cyan-glow/[0.12] text-cyan-glow font-medium shadow-[inset_0_0_12px_rgba(143,216,212,0.1)]'
                      : 'text-white/70 hover:text-white hover:bg-white/[0.04]'
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="font-mono tracking-wide">{item.label}</span>
                  {isActive && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-cyan-glow" />}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-white/[0.06] bg-white/[0.01]">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-full bg-cyan-glow/10 border border-cyan-glow/30 flex items-center justify-center shrink-0">
                <span className="font-mono text-cyan-glow text-xs font-bold">{user?.name?.charAt(0) || 'A'}</span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-white text-xs font-medium truncate">{user?.name || 'Administrator'}</p>
                <p className="font-mono text-[0.65rem] text-white/40 truncate">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="w-full py-2.5 font-mono text-[0.7rem] text-white/50 hover:text-dawn-coral hover:bg-dawn-coral/10 border border-white/[0.08] hover:border-dawn-coral/30 rounded-lg transition-all duration-200 uppercase tracking-[0.15em] flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Log Out
            </button>
          </div>
        </div>

        {/* Desktop Sidebar (hidden on mobile) */}
        <aside className="hidden md:flex w-64 bg-white/[0.02] border-r border-white/[0.06] flex-col shrink-0 min-h-screen sticky top-0 h-screen">
          <div className="p-6 border-b border-white/[0.06]">
            <h1 className="font-display text-white text-lg">Shah Industrial</h1>
            <p className="font-mono text-[0.65rem] text-cyan-glow/60 tracking-[0.2em] uppercase mt-1">Admin Panel</p>
          </div>

          <nav className="flex-1 py-4">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-6 py-3 text-[0.85rem] transition-all duration-200 ${
                    isActive
                      ? 'bg-cyan-glow/[0.08] text-cyan-glow border-r-2 border-cyan-glow font-medium'
                      : 'text-white/60 hover:text-white/70 hover:bg-white/[0.03]'
                  }`}
                >
                  <span className="text-base">{item.icon}</span>
                  <span className="font-mono tracking-wide">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-white/[0.06]">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-cyan-glow/10 border border-cyan-glow/30 flex items-center justify-center">
                <span className="font-mono text-cyan-glow text-xs">{user?.name?.charAt(0) || 'A'}</span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-white text-[0.8rem] truncate">{user?.name}</p>
                <p className="font-mono text-[0.6rem] text-white/30 truncate">{user?.role}</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="w-full py-2 font-mono text-[0.7rem] text-white/30 hover:text-dawn-coral border border-white/[0.06] hover:border-dawn-coral/30 rounded transition-all duration-200 uppercase tracking-[0.15em]"
            >
              Log Out
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 min-w-0 overflow-x-hidden">
          <div className="p-4 sm:p-6 lg:p-10 max-w-[1400px] pb-24 md:pb-12 mx-auto w-full">
            {children}
          </div>
        </main>

        {/* Mobile Bottom Tab Bar (Quick access for thumbs) */}
        <nav
          className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-slate/95 backdrop-blur-xl border-t border-white/[0.08] px-2 pt-2 pb-[calc(0.5rem+env(safe-area-inset-bottom,0px))] flex justify-around items-center"
          aria-label="Mobile bottom navigation"
        >
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center py-1 px-3 rounded-lg transition-colors flex-1 text-center min-w-[60px] ${
                  isActive ? 'text-cyan-glow font-medium' : 'text-white/45 hover:text-white/70'
                }`}
              >
                <span className="text-base leading-none mb-1">{item.icon}</span>
                <span className="font-mono text-[0.62rem] tracking-tight leading-tight block">
                  {item.label}
                </span>
                {isActive && (
                  <span className="w-1 h-1 rounded-full bg-cyan-glow mt-1 animate-pulse" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </AuthContext.Provider>
  );
}
