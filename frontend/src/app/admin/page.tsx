'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './AdminClientLayout';

import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  
  const { token } = useAuth();
  const router = useRouter();

  // If already logged in, redirect to inquiries page
  useEffect(() => {
    if (token) {
      router.push('/admin/inquiries');
    }
  }, [token, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMessage('');

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const res = await fetch(`${apiUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Authentication failed');
      }

      localStorage.setItem('admin_token', data.token);
      localStorage.setItem('admin_user', JSON.stringify(data.user));

      // Force page reload to re-evaluate AuthContext state
      window.location.href = '/admin/inquiries';
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Invalid credentials');
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-slate flex items-center justify-center p-4 sm:p-6 relative overflow-hidden noise-overlay">
      {/* Decorative gradients */}
      <div className="absolute top-[-200px] left-[-200px] w-[500px] h-[500px] rounded-full bg-cyan-glow/[0.03] blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-200px] right-[-200px] w-[500px] h-[500px] rounded-full bg-dawn-coral/[0.02] blur-[100px] pointer-events-none" />

      <div className="w-full max-w-[420px] bg-white/[0.02] ring-1 ring-white/[0.08] backdrop-blur-md p-6 sm:p-8 rounded-2xl relative z-10 shadow-2xl">
        <div className="text-center mb-6 sm:mb-8">
          <span className="font-mono text-[0.65rem] text-cyan-glow/70 tracking-[0.25em] uppercase block mb-2 sm:mb-3">
            Legacy Dashboard
          </span>
          <h2 className="font-display text-white text-xl sm:text-2xl font-bold">Admin Portal</h2>
          <p className="text-white/60 text-xs mt-2 leading-relaxed">
            Enter your credentials to manage incoming inquiries and inventory catalog.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
          <div className="space-y-1.5 sm:space-y-2">
            <label className="text-[0.7rem] font-mono uppercase tracking-[0.2em] text-white/50 block">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-4 py-3 text-white text-base sm:text-sm placeholder:text-white/20 focus:outline-none focus:border-cyan-glow/40 focus:bg-white/[0.06] transition-all duration-300 min-h-[44px]"
              placeholder="admin@shahindustrial.com"
            />
          </div>

          <div className="space-y-1.5 sm:space-y-2">
            <label className="text-[0.7rem] font-mono uppercase tracking-[0.2em] text-white/50 block">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-4 py-3 text-white text-base sm:text-sm placeholder:text-white/20 focus:outline-none focus:border-cyan-glow/40 focus:bg-white/[0.06] transition-all duration-300 min-h-[44px]"
              placeholder="••••••••"
            />
          </div>

          {status === 'error' && (
            <p className="text-dawn-coral text-[0.75rem] font-mono bg-dawn-coral/5 border border-dawn-coral/10 rounded-lg p-3">
              ⚠ {errorMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={status === 'submitting'}
            className="group w-full py-3.5 sm:py-4 bg-cyan-glow text-slate font-mono uppercase tracking-[0.15em] text-[0.8rem] font-semibold rounded-lg relative overflow-hidden transition-all duration-300 hover:shadow-[0_0_30px_rgba(143,216,212,0.2)] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed min-h-[48px]"
          >
            {status === 'submitting' ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4 text-slate" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25" />
                  <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="opacity-75" />
                </svg>
                Authenticating...
              </span>
            ) : (
              'Enter Dashboard'
            )}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-white/[0.06] text-center">
          <Link
            href="/"
            className="text-white/40 hover:text-cyan-glow font-mono text-[0.7rem] transition-colors inline-flex items-center gap-1.5"
          >
            ← Back to Shah Industrial Website
          </Link>
        </div>
      </div>
    </div>
  );
}
