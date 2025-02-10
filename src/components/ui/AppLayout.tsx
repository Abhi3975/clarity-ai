'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain, LayoutDashboard, Zap, FileText, User,
  History, BarChart3, Menu, X, ExternalLink
} from 'lucide-react';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/analyze', label: 'Analyze', icon: Zap },
  { href: '/report', label: 'Daily Report', icon: BarChart3 },
  { href: '/history', label: 'History', icon: History },
  { href: '/profile', label: 'My Profile', icon: User },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    const s = parseInt(localStorage.getItem('clarity_streak') || '0');
    setStreak(s);
  }, []);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* ─── Sidebar ─── */}
      <aside style={{
        width: 240, minHeight: '100vh',
        background: 'rgba(10,10,15,0.95)',
        borderRight: '1px solid var(--border)',
        backdropFilter: 'blur(20px)',
        display: 'flex', flexDirection: 'column',
        position: 'fixed', left: 0, top: 0, bottom: 0,
        zIndex: 50, padding: '24px 16px',
        transition: 'transform 0.3s ease',
      }}>
        {/* Logo */}
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'linear-gradient(135deg, #7c3aed, #2563eb)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 20px rgba(124,58,237,0.4)',
          }}>
            <Brain size={20} color="white" />
          </div>
          <span style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: 18, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
            Clarity<span style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>AI</span>
          </span>
        </Link>

        {/* Streak */}
        {streak > 0 && (
          <div style={{
            padding: '10px 14px', borderRadius: 12, marginBottom: 20,
            background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.25)',
            fontSize: 13, color: '#fbbf24', fontWeight: 600,
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            🔥 {streak}-day clarity streak
          </div>
        )}

        {/* Nav items */}
        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
          {navItems.map(item => {
            const active = pathname === item.href;
            return (
              <Link key={item.href} href={item.href} className={`sidebar-link ${active ? 'active' : ''}`} style={{ textDecoration: 'none' }}>
                <item.icon size={18} />
                {item.label}
                {item.href === '/analyze' && (
                  <span style={{
                    marginLeft: 'auto', fontSize: 10, padding: '2px 8px',
                    borderRadius: 100, background: 'rgba(124,58,237,0.2)',
                    color: '#a78bfa', fontWeight: 700,
                  }}>AI</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer links */}
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <a href="https://github.com/Abhi3975/clarity-ai" target="_blank" rel="noreferrer"
            style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.2s' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-primary)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
          >
            View on GitHub <ExternalLink size={12} />
          </a>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
            ClarityAI v1.0.0
          </div>
        </div>
      </aside>

      {/* ─── Main content ─── */}
      <main style={{ marginLeft: 240, flex: 1, minHeight: '100vh', position: 'relative' }}>
        {/* Ambient bg */}
        <div style={{
          position: 'fixed', top: 0, right: 0, width: '40vw', height: '40vw',
          background: 'radial-gradient(ellipse, rgba(124,58,237,0.06) 0%, transparent 70%)',
          pointerEvents: 'none', zIndex: 0,
        }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          {children}
        </div>
      </main>
    </div>
  );
}
