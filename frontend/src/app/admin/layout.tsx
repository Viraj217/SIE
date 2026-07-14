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
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const stored = localStorage.getItem('admin_token');
    const storedUser = localStorage.getItem('admin_user');

    if (stored && storedUser) {
      setToken(stored);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const logout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    setToken(null);
    setUser(null);
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

  // Redirect to login if not authenticated
  if (!token) {
    if (typeof window !== 'undefined') router.push('/admin');
    return null;
  }

  return (
    <AuthContext.Provider value={{ token, user, logout }}>
      <div className="min-h-screen bg-slate flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white/[0.02] border-r border-white/[0.06] flex flex-col shrink-0">
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
                      ? 'bg-cyan-glow/[0.08] text-cyan-glow border-r-2 border-cyan-glow'
                      : 'text-white/40 hover:text-white/70 hover:bg-white/[0.03]'
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
              <div>
                <p className="text-white text-[0.8rem]">{user?.name}</p>
                <p className="font-mono text-[0.6rem] text-white/30">{user?.role}</p>
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

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="p-8 lg:p-12 max-w-[1400px]">
            {children}
          </div>
        </main>
      </div>
    </AuthContext.Provider>
  );
}
