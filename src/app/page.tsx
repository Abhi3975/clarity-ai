'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Brain, Zap, Shield, BarChart3, Target, Clock,
  CheckCircle, ArrowRight, ExternalLink, Sparkles, Filter,
  TrendingUp, AlertTriangle, ChevronRight
} from 'lucide-react';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: 'easeOut' as const },
  }),
};

const features = [
  {
    icon: Brain,
    color: '#7c3aed',
    glow: 'rgba(124,58,237,0.3)',
    title: 'AI Summarization',
    desc: 'Extracts the 3 most important sentences from any article in seconds.',
  },
  {
    icon: Shield,
    color: '#06b6d4',
    glow: 'rgba(6,182,212,0.3)',
    title: 'Bias Detection',
    desc: 'Scores emotional manipulation & sensationalism on a 0–100 scale.',
  },
  {
    icon: Target,
    color: '#10b981',
    glow: 'rgba(16,185,129,0.3)',
    title: 'Goal-Based Scoring',
    desc: 'Ranks content relevance against YOUR career goals and interests.',
  },
  {
    icon: AlertTriangle,
    color: '#f59e0b',
    glow: 'rgba(245,158,11,0.3)',
    title: 'Doomscroll Guard',
    desc: 'Flags emotionally draining, low-value content before it wastes your time.',
  },
  {
    icon: BarChart3,
    color: '#ec4899',
    glow: 'rgba(236,72,153,0.3)',
    title: 'Daily Clarity Report',
    desc: 'Visual breakdown of your information diet — topics, bias, time saved.',
  },
  {
    icon: Clock,
    color: '#f97316',
    glow: 'rgba(249,115,22,0.3)',
    title: 'Read Time Estimation',
    desc: 'Know exactly how long before you start — respect your time budget.',
  },
];

const demoCards = [
  {
    emoji: '✅',
    verdict: 'Worth Reading',
    verdictClass: 'verdict-worth',
    title: 'OpenAI releases GPT-5 with advanced reasoning',
    bias: 22,
    biasLabel: 'Low Bias',
    biasClass: 'bias-low',
    score: 9.2,
    scoreClass: 'score-high',
    readTime: 4,
    reason: 'Directly relevant to your AI Engineer career goal',
    tags: ['AI & ML', 'Technology'],
  },
  {
    emoji: '⚠️',
    verdict: 'Read with Caution',
    verdictClass: 'verdict-caution',
    title: 'Stock market on the verge of COLLAPSE — experts warn',
    bias: 71,
    biasLabel: 'High Bias',
    biasClass: 'bias-high',
    score: 5.8,
    scoreClass: 'score-medium',
    readTime: 2,
    reason: 'Sensational language detected. Cross-check claims.',
    tags: ['Finance', 'Politics'],
  },
  {
    emoji: '🚫',
    verdict: 'Safe to Skip',
    verdictClass: 'verdict-skip',
    title: 'Celebrity couple spotted at airport — fans react',
    bias: 85,
    biasLabel: 'High Bias',
    biasClass: 'bias-high',
    score: 1.2,
    scoreClass: 'score-low',
    readTime: 3,
    reason: 'Low relevance. Doomscroll trigger detected.',
    tags: ['Entertainment'],
  },
];

const stats = [
  { value: '87%', label: 'Noise Reduced' },
  { value: '3.2h', label: 'Time Saved / Week' },
  { value: '94%', label: 'Bias Catch Rate' },
  { value: '10x', label: 'Clarity Boost' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen gradient-bg grid-pattern relative overflow-hidden">
      {/* Ambient orbs */}
      <div
        style={{
          position: 'fixed', top: '-15%', left: '-10%', width: '60vw', height: '60vw',
          background: 'radial-gradient(ellipse, rgba(124,58,237,0.12) 0%, transparent 70%)',
          borderRadius: '50%', pointerEvents: 'none', zIndex: 0,
        }}
      />
      <div
        style={{
          position: 'fixed', bottom: '-20%', right: '-10%', width: '50vw', height: '50vw',
          background: 'radial-gradient(ellipse, rgba(6,182,212,0.08) 0%, transparent 70%)',
          borderRadius: '50%', pointerEvents: 'none', zIndex: 0,
        }}
      />

      {/* ─── Navbar ─── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: 'rgba(10,10,15,0.8)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        padding: '0 5%',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        height: '64px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'linear-gradient(135deg, #7c3aed, #2563eb)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Brain size={20} color="white" />
          </div>
          <span style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: 20, letterSpacing: '-0.02em' }}>
            Clarity<span className="gradient-text">AI</span>
          </span>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <Link href="https://github.com/Abhi3975/clarity-ai" target="_blank">
            <button className="btn-secondary" style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: 6 }}>
              <ExternalLink size={16} /> GitHub
            </button>
          </Link>
          <Link href="/analyze">
            <button className="btn-primary" style={{ padding: '9px 20px', display: 'flex', alignItems: 'center', gap: 6 }}>
              Try Free <ArrowRight size={14} />
            </button>
          </Link>
        </div>
      </nav>

      {/* ─── Hero ─── */}
      <section style={{ paddingTop: '140px', paddingBottom: '80px', padding: '140px 5% 80px', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
          <motion.div
            initial="hidden" animate="visible" custom={0} variants={fadeInUp}
          >
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '6px 16px', borderRadius: 100,
              background: 'rgba(124,58,237,0.15)',
              border: '1px solid rgba(124,58,237,0.3)',
              marginBottom: 24, fontSize: 13, fontWeight: 600, color: '#a78bfa',
            }}>
              <Sparkles size={14} /> The AI that decides what you should pay attention to
            </div>
          </motion.div>

          <motion.h1
            initial="hidden" animate="visible" custom={1} variants={fadeInUp}
            style={{
              fontFamily: 'Outfit, sans-serif',
              fontSize: 'clamp(2.8rem, 7vw, 5rem)',
              fontWeight: 900,
              lineHeight: 1.08,
              letterSpacing: '-0.04em',
              marginBottom: 24,
            }}
          >
            Stop drowning in{' '}
            <span className="gradient-text">information noise</span>
          </motion.h1>

          <motion.p
            initial="hidden" animate="visible" custom={2} variants={fadeInUp}
            style={{ fontSize: 18, color: 'var(--text-secondary)', lineHeight: 1.7, maxWidth: 620, margin: '0 auto 40px' }}
          >
            ClarityAI is your personal AI intelligence filter. It reads what you don&apos;t have time to — summarizes,
            detects bias, scores relevance, and tells you exactly what&apos;s worth your attention.
          </motion.p>

          <motion.div
            initial="hidden" animate="visible" custom={3} variants={fadeInUp}
            style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}
          >
            <Link href="/analyze">
              <button className="btn-primary animate-pulse-glow" style={{ fontSize: 16, padding: '14px 32px', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Zap size={18} /> Analyze an Article
              </button>
            </Link>
            <Link href="/dashboard">
              <button className="btn-secondary" style={{ fontSize: 16, padding: '14px 32px', display: 'flex', alignItems: 'center', gap: 8 }}>
                View Dashboard <ChevronRight size={16} />
              </button>
            </Link>
          </motion.div>

          {/* Stats Row */}
          <motion.div
            initial="hidden" animate="visible" custom={4} variants={fadeInUp}
            style={{
              display: 'flex', gap: 12, justifyContent: 'center', marginTop: 56,
              flexWrap: 'wrap',
            }}
          >
            {stats.map(stat => (
              <div key={stat.label} className="glass-card" style={{ padding: '20px 32px', textAlign: 'center', flex: '1 1 140px', maxWidth: 180 }}>
                <div className="stat-number gradient-text" style={{ fontSize: 36, marginBottom: 4 }}>{stat.value}</div>
                <div style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 500 }}>{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── Demo Cards ─── */}
      <section style={{ padding: '60px 5%', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0} variants={fadeInUp}
            style={{ textAlign: 'center', marginBottom: 48 }}
          >
            <div style={{ fontSize: 13, color: '#a78bfa', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>
              See It In Action
            </div>
            <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 800, letterSpacing: '-0.03em' }}>
              This is what ClarityAI tells you
            </h2>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
            {demoCards.map((card, i) => (
              <motion.div
                key={i}
                initial="hidden" whileInView="visible" viewport={{ once: true }}
                custom={i} variants={fadeInUp}
                className="glass-card gradient-border"
                style={{ padding: 24 }}
              >
                {/* Verdict */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                  <span style={{ fontSize: 20 }}>{card.emoji}</span>
                  <span className={`tag ${card.verdictClass}`} style={{ fontSize: 11 }}>{card.verdict}</span>
                </div>

                <h3 style={{ fontSize: 15, fontWeight: 600, lineHeight: 1.4, marginBottom: 16, color: 'var(--text-primary)' }}>
                  {card.title}
                </h3>

                {/* Metrics row */}
                <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, minWidth: 100 }}>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>BIAS SCORE</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontWeight: 700, fontSize: 20 }}>{card.bias}</span>
                      <span className={`tag ${card.biasClass}`} style={{ fontSize: 10 }}>{card.biasLabel}</span>
                    </div>
                    <div className="progress-bar" style={{ marginTop: 6 }}>
                      <div className="progress-fill" style={{
                        width: `${card.bias}%`,
                        background: card.bias < 35 ? '#10b981' : card.bias < 65 ? '#f59e0b' : '#ef4444',
                      }} />
                    </div>
                  </div>
                  <div style={{ flex: 1, minWidth: 100 }}>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>IMPORTANCE</div>
                    <div style={{ fontWeight: 700, fontSize: 20, marginBottom: 4 }}>
                      <span className={card.scoreClass}>{card.score}</span>
                      <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>/10</span>
                    </div>
                    <div className="progress-bar" style={{ marginTop: 6 }}>
                      <div className="progress-fill" style={{
                        width: `${card.score * 10}%`,
                        background: card.score >= 7 ? '#10b981' : card.score >= 5 ? '#f59e0b' : '#ef4444',
                      }} />
                    </div>
                  </div>
                </div>

                {/* Read time + tags */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>⏱️ {card.readTime} min read</span>
                  {card.tags.map(t => (
                    <span key={t} style={{
                      fontSize: 11, padding: '2px 8px', borderRadius: 100,
                      background: 'rgba(124,58,237,0.15)', color: '#a78bfa', fontWeight: 600,
                    }}>{t}</span>
                  ))}
                </div>

                {/* Reason */}
                <div style={{
                  padding: '10px 14px', borderRadius: 10,
                  background: 'rgba(255,255,255,0.04)',
                  fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5,
                }}>
                  🧠 {card.reason}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Features ─── */}
      <section style={{ padding: '80px 5%', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0} variants={fadeInUp}
            style={{ textAlign: 'center', marginBottom: 56 }}
          >
            <div style={{ fontSize: 13, color: '#06b6d4', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>
              Full Feature Suite
            </div>
            <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 16 }}>
              Built for the information age
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: 16, maxWidth: 500, margin: '0 auto' }}>
              Every feature designed to protect your time, mental energy, and decision-making clarity.
            </p>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial="hidden" whileInView="visible" viewport={{ once: true }}
                custom={i * 0.5} variants={fadeInUp}
                className="glass-card"
                style={{ padding: 28, cursor: 'default' }}
              >
                <div style={{
                  width: 48, height: 48, borderRadius: 14,
                  background: `${f.color}22`,
                  border: `1px solid ${f.color}44`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: 20,
                  boxShadow: `0 0 20px ${f.glow}`,
                }}>
                  <f.icon size={24} color={f.color} />
                </div>
                <h3 style={{ fontWeight: 700, fontSize: 17, marginBottom: 8 }}>{f.title}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.6 }}>{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── How It Works ─── */}
      <section style={{ padding: '80px 5%', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0} variants={fadeInUp}
            style={{ textAlign: 'center', marginBottom: 56 }}
          >
            <div style={{ fontSize: 13, color: '#10b981', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>
              How It Works
            </div>
            <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 800, letterSpacing: '-0.03em' }}>
              Three steps to clarity
            </h2>
          </motion.div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {[
              { step: '01', icon: Filter, color: '#7c3aed', title: 'Paste any content', desc: 'Drop in a URL, news article, tweet thread, or raw text. ClarityAI handles extraction automatically.' },
              { step: '02', icon: Brain, color: '#06b6d4', title: 'AI processes 6 dimensions', desc: 'Bias score, importance ranking, topic classification, sentiment, doomscroll detection, and read-time — all in under 2 seconds.' },
              { step: '03', icon: TrendingUp, color: '#10b981', title: 'Get your verdict', desc: 'Clear, personalized output: Worth Reading, Read with Caution, or Safe to Skip. No ambiguity.' },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial="hidden" whileInView="visible" viewport={{ once: true }}
                custom={i} variants={fadeInUp}
                className="glass-card"
                style={{ padding: '28px 32px', display: 'flex', alignItems: 'center', gap: 28 }}
              >
                <div style={{
                  fontSize: 'clamp(2rem, 5vw, 4rem)', fontFamily: 'Outfit', fontWeight: 900,
                  background: `linear-gradient(135deg, ${item.color} 0%, transparent 100%)`,
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                  minWidth: 80, textAlign: 'center',
                }}>
                  {item.step}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: 48, height: 48, borderRadius: 14, background: `${item.color}22`, border: `1px solid ${item.color}44` }}>
                  <item.icon size={22} color={item.color} />
                </div>
                <div>
                  <h3 style={{ fontWeight: 700, fontSize: 18, marginBottom: 6 }}>{item.title}</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.6 }}>{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section style={{ padding: '80px 5% 120px', position: 'relative', zIndex: 1 }}>
        <motion.div
          initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0} variants={fadeInUp}
          className="glass-card"
          style={{
            maxWidth: 800, margin: '0 auto', padding: 'clamp(40px, 8vw, 80px)',
            textAlign: 'center',
            background: 'linear-gradient(135deg, rgba(124,58,237,0.15) 0%, rgba(37,99,235,0.1) 50%, rgba(6,182,212,0.1) 100%)',
            border: '1px solid rgba(124,58,237,0.3)',
            boxShadow: '0 0 80px rgba(124,58,237,0.15)',
          }}
        >
          <div style={{ fontSize: 48, marginBottom: 16 }}>🧠</div>
          <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 'clamp(1.8rem, 5vw, 3rem)', fontWeight: 900, letterSpacing: '-0.04em', marginBottom: 16 }}>
            Ready to take back your attention?
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 17, marginBottom: 36, maxWidth: 500, margin: '0 auto 36px' }}>
            Join thousands filtering the noise and focusing on what actually moves the needle.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/analyze">
              <button className="btn-primary" style={{ fontSize: 16, padding: '14px 36px', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Zap size={18} /> Start Analyzing Free
              </button>
            </Link>
            <Link href="https://github.com/Abhi3975/clarity-ai" target="_blank">
              <button className="btn-secondary" style={{ fontSize: 16, padding: '14px 28px', display: 'flex', alignItems: 'center', gap: 8 }}>
                <ExternalLink size={16} /> View Source
              </button>
            </Link>
          </div>

          <div style={{ marginTop: 32, display: 'flex', gap: 24, justifyContent: 'center', flexWrap: 'wrap' }}>
            {['No account needed', 'Open source', 'Privacy first', '100% free'].map(t => (
              <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--text-muted)' }}>
                <CheckCircle size={14} color="#10b981" /> {t}
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ─── Footer ─── */}
      <footer style={{
        borderTop: '1px solid var(--border)', padding: '28px 5%',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        flexWrap: 'wrap', gap: 12, position: 'relative', zIndex: 1,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Brain size={18} color="#7c3aed" />
          <span style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: 15 }}>ClarityAI</span>
          <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>— Your Personal Truth Engine</span>
        </div>
        <div style={{ color: 'var(--text-muted)', fontSize: 13 }}>
          Built with ❤️ by <Link href="https://github.com/Abhi3975" target="_blank" style={{ color: '#a78bfa', textDecoration: 'none' }}>Abhijeet</Link>
        </div>
      </footer>
    </div>
  );
}
