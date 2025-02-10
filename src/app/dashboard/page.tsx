'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Brain, Zap, TrendingUp, Shield, Clock, Target,
  ArrowRight, BarChart3, CheckCircle, XCircle, AlertCircle,
  Flame, BookOpen, AlertTriangle,
} from 'lucide-react';
import AppLayout from '@/components/ui/AppLayout';

interface AnalysisResult {
  id: string;
  title: string;
  verdict: 'worth_reading' | 'skip' | 'read_with_caution';
  importanceScore: number;
  biasScore: number;
  biasLabel: string;
  readTime: number;
  topics: string[];
  timestamp: string;
  isDoomscroll: boolean;
}

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: 'easeOut' as const },
  }),
};

export default function DashboardPage() {
  const [history, setHistory] = useState<AnalysisResult[]>([]);
  const [streak, setStreak] = useState(0);
  const [profile, setProfile] = useState<{ goals: string[]; name: string }>({ goals: [], name: 'there' });

  useEffect(() => {
    const h = JSON.parse(localStorage.getItem('clarity_history') || '[]');
    setHistory(h);
    const s = parseInt(localStorage.getItem('clarity_streak') || '0');
    setStreak(s);
    const p = JSON.parse(localStorage.getItem('clarity_profile') || '{}');
    setProfile({ goals: p.goals || [], name: p.name || 'there' });
  }, []);

  const today = new Date().toISOString().split('T')[0];
  const todayHistory = history.filter(h => h.timestamp.startsWith(today));
  const totalToday = todayHistory.length;
  const worthCount = todayHistory.filter(h => h.verdict === 'worth_reading').length;
  const skipCount = todayHistory.filter(h => h.verdict === 'skip').length;
  const timeSaved = todayHistory.filter(h => h.verdict === 'skip').reduce((a, h) => a + h.readTime, 0);
  const avgBias = totalToday ? Math.round(todayHistory.reduce((s, h) => s + h.biasScore, 0) / totalToday) : 0;
  const doomCount = todayHistory.filter(h => h.isDoomscroll).length;

  const recentAll = history.slice(0, 5);

  const getVerdictIcon = (v: string) => {
    if (v === 'worth_reading') return <CheckCircle size={16} color="#10b981" />;
    if (v === 'skip') return <XCircle size={16} color="#ef4444" />;
    return <AlertCircle size={16} color="#f59e0b" />;
  };

  const quickActions = [
    { href: '/analyze', icon: Zap, label: 'Analyze Article', color: '#7c3aed', glow: 'rgba(124,58,237,0.3)' },
    { href: '/report', icon: BarChart3, label: 'Daily Report', color: '#06b6d4', glow: 'rgba(6,182,212,0.3)' },
    { href: '/profile', icon: Target, label: 'My Goals', color: '#10b981', glow: 'rgba(16,185,129,0.3)' },
    { href: '/history', icon: BookOpen, label: 'History', color: '#f59e0b', glow: 'rgba(245,158,11,0.3)' },
  ];

  return (
    <AppLayout>
      <div style={{ padding: '40px' }}>
        {/* Greeting */}
        <motion.div initial="hidden" animate="visible" custom={0} variants={fadeInUp} style={{ marginBottom: 36 }}>
          <h1 style={{ fontFamily: 'Outfit', fontWeight: 900, fontSize: 32, letterSpacing: '-0.03em', marginBottom: 6 }}>
            Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'}, {profile.name} 👋
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 16 }}>
            {totalToday === 0
              ? "You haven't analyzed any content today. Start building your clarity streak."
              : `You've analyzed ${totalToday} piece${totalToday !== 1 ? 's' : ''} of content today. Keep protecting your attention.`}
          </p>
        </motion.div>

        {/* Streak Banner */}
        {streak > 0 && (
          <motion.div initial="hidden" animate="visible" custom={0.5} variants={fadeInUp}
            style={{
              padding: '16px 24px', borderRadius: 14, marginBottom: 28,
              background: 'linear-gradient(135deg, rgba(245,158,11,0.15), rgba(249,115,22,0.1))',
              border: '1px solid rgba(245,158,11,0.3)',
              display: 'flex', alignItems: 'center', gap: 14,
            }}
          >
            <Flame size={28} color="#fbbf24" />
            <div>
              <div style={{ fontWeight: 800, fontSize: 18, color: '#fbbf24' }}>🔥 {streak}-Day Clarity Streak!</div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Keep filtering the noise — stay on your path.</div>
            </div>
            <div style={{ marginLeft: 'auto' }}>
              {Array.from({ length: Math.min(streak, 7) }).map((_, i) => (
                <span key={i} style={{ fontSize: 18, margin: '0 2px' }}>🔥</span>
              ))}
            </div>
          </motion.div>
        )}

        {/* Stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 32 }}>
          {[
            { icon: Brain, color: '#7c3aed', label: 'Analyzed Today', value: totalToday, sub: history.length + ' total' },
            { icon: CheckCircle, color: '#10b981', label: 'Worth Reading', value: worthCount, sub: totalToday ? `${Math.round(worthCount/totalToday*100)}% signal rate` : 'Start analyzing' },
            { icon: Clock, color: '#06b6d4', label: 'Minutes Saved', value: timeSaved, sub: 'by skipping noise' },
            { icon: Shield, color: avgBias > 60 ? '#ef4444' : '#f59e0b', label: 'Avg Bias Score', value: totalToday ? avgBias : '—', sub: totalToday ? (avgBias > 60 ? 'High! Diversify sources' : 'Moderate levels') : 'No data yet' },
          ].map((s, i) => (
            <motion.div key={s.label} initial="hidden" animate="visible" custom={i + 1} variants={fadeInUp}
              className="glass-card" style={{ padding: '20px 22px' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <div style={{
                  width: 34, height: 34, borderRadius: 9,
                  background: `${s.color}22`, border: `1px solid ${s.color}44`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <s.icon size={16} color={s.color} />
                </div>
                <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.label}</span>
              </div>
              <div className="stat-number" style={{ fontSize: 34, letterSpacing: '-0.03em', marginBottom: 4 }}>{s.value}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{s.sub}</div>
            </motion.div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 24 }}>
          {/* Recent analyses */}
          <motion.div initial="hidden" animate="visible" custom={5} variants={fadeInUp}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <h2 style={{ fontWeight: 700, fontSize: 18 }}>Recent Analyses</h2>
              <Link href="/history" style={{ fontSize: 13, color: '#a78bfa', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
                View all <ArrowRight size={14} />
              </Link>
            </div>
            {recentAll.length === 0 ? (
              <div className="glass-card" style={{ padding: 40, textAlign: 'center' }}>
                <Brain size={40} color="var(--text-muted)" style={{ margin: '0 auto 16px' }} />
                <div style={{ fontWeight: 600, marginBottom: 8 }}>No analyses yet</div>
                <div style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 20 }}>Start by analyzing any article or news piece</div>
                <Link href="/analyze">
                  <button className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                    <Zap size={15} /> Analyze Now
                  </button>
                </Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {recentAll.map((item, i) => (
                  <motion.div key={item.id} initial="hidden" animate="visible" custom={i} variants={fadeInUp}
                    className="glass-card" style={{ padding: '16px 20px', cursor: 'default' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                      <div style={{ marginTop: 2 }}>{getVerdictIcon(item.verdict)}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 6, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {item.title}
                        </div>
                        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                            Importance: <span style={{ color: item.importanceScore >= 7 ? '#10b981' : item.importanceScore >= 5 ? '#f59e0b' : '#ef4444', fontWeight: 600 }}>{item.importanceScore}/10</span>
                          </span>
                          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                            Bias: <span style={{ fontWeight: 600, color: item.biasScore < 35 ? '#10b981' : item.biasScore < 65 ? '#f59e0b' : '#ef4444' }}>{item.biasScore}%</span>
                          </span>
                          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>⏱️ {item.readTime}m</span>
                          {item.isDoomscroll && <span style={{ fontSize: 12, color: '#f87171' }}>⚠️ Doomscroll</span>}
                        </div>
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', whiteSpace: 'nowrap', marginTop: 2 }}>
                        {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Right panel */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Quick actions */}
            <motion.div initial="hidden" animate="visible" custom={6} variants={fadeInUp}>
              <h2 style={{ fontWeight: 700, fontSize: 16, marginBottom: 12 }}>Quick Actions</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {quickActions.map(a => (
                  <Link key={a.href} href={a.href} style={{ textDecoration: 'none' }}>
                    <div className="glass-card" style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
                      <div style={{
                        width: 36, height: 36, borderRadius: 10,
                        background: `${a.color}22`, border: `1px solid ${a.color}44`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: `0 0 12px ${a.glow}`,
                      }}>
                        <a.icon size={16} color={a.color} />
                      </div>
                      <span style={{ fontWeight: 600, fontSize: 14 }}>{a.label}</span>
                      <ArrowRight size={14} color="var(--text-muted)" style={{ marginLeft: 'auto' }} />
                    </div>
                  </Link>
                ))}
              </div>
            </motion.div>

            {/* Today's health */}
            {totalToday > 0 && (
              <motion.div initial="hidden" animate="visible" custom={7} variants={fadeInUp}
                className="glass-card" style={{ padding: 20 }}
              >
                <h2 style={{ fontWeight: 700, fontSize: 15, marginBottom: 14 }}>Today&apos;s Info Diet</h2>
                {doomCount > 0 && (
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', padding: '10px 12px', borderRadius: 10, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', marginBottom: 12 }}>
                    <AlertTriangle size={15} color="#f87171" />
                    <span style={{ fontSize: 13, color: '#fca5a5' }}>{doomCount} doomscroll trigger{doomCount > 1 ? 's' : ''}</span>
                  </div>
                )}
                {[
                  { label: `✅ Worth reading`, count: worthCount, color: '#10b981' },
                  { label: `⚠️ Caution`, count: todayHistory.filter(h => h.verdict === 'read_with_caution').length, color: '#f59e0b' },
                  { label: `🚫 Skipped`, count: skipCount, color: '#ef4444' },
                ].map(item => (
                  <div key={item.label} style={{ marginBottom: 10 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}>
                      <span style={{ color: 'var(--text-secondary)' }}>{item.label}</span>
                      <span style={{ fontWeight: 700, color: item.color }}>{item.count}</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: totalToday ? `${(item.count / totalToday) * 100}%` : '0%', background: item.color }} />
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {/* Goals hint */}
            {profile.goals.length === 0 && (
              <motion.div initial="hidden" animate="visible" custom={8} variants={fadeInUp}
                className="glass-card" style={{ padding: 20, background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.2)' }}
              >
                <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 8, color: '#a78bfa' }}>🎯 Set Your Goals</div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 12, lineHeight: 1.5 }}>
                  Tell ClarityAI your career goals so it can score content relevance for YOU.
                </div>
                <Link href="/profile">
                  <button className="btn-primary" style={{ padding: '8px 16px', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
                    Set Goals <ArrowRight size={13} />
                  </button>
                </Link>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
