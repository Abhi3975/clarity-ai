'use client';

import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap, Link as LinkIcon, FileText, Loader2, Brain,
  Shield, Target, Clock, TrendingUp, AlertTriangle,
  CheckCircle, XCircle, AlertCircle, Copy, RotateCcw,
  ChevronDown, ChevronUp, Info,
} from 'lucide-react';
import AppLayout from '@/components/ui/AppLayout';

interface AnalysisResult {
  id: string;
  title: string;
  url?: string;
  content: string;
  summary: string;
  readTime: number;
  biasScore: number;
  biasLabel: string;
  biasExplanation: string;
  tone: string;
  importanceScore: number;
  importanceReason: string;
  topics: string[];
  verdict: 'worth_reading' | 'skip' | 'read_with_caution';
  verdictMessage: string;
  isDoomscroll: boolean;
  keyInsights: string[];
  timestamp: string;
  goalMatch: string[];
}

const EXAMPLE_TEXTS = [
  {
    label: 'AI News Article',
    text: `OpenAI has just unveiled GPT-5, its most powerful language model to date, featuring advanced reasoning capabilities that surpass human performance on numerous benchmarks. The new model demonstrates remarkable improvements in mathematical reasoning, code generation, and multi-step problem solving. According to research published today, GPT-5 achieves a 92% score on the MMLU benchmark, significantly outperforming its predecessor. This breakthrough could accelerate AI adoption across industries including healthcare, finance, and software development. Experts say this represents a new era in artificial intelligence, with implications for jobs, productivity, and the future of human-computer interaction. The model will be available to developers via API, with safety measures including content filtering and usage monitoring built in from the ground up.`,
  },
  {
    label: 'Sensational News',
    text: `SHOCKING: The stock market is on the VERGE of TOTAL COLLAPSE! Emergency warnings are being issued by terrified experts who say we are facing the WORST financial crisis in 100 years. You MUST act now before it's too late! Everyone knows the government has been hiding the truth about inflation. The catastrophic crash that WILL happen could wipe out your entire savings. Devastated families are already losing everything. This is an OUTRAGE that nobody is talking about! Wake up before your money is completely worthless. This nightmare scenario has been confirmed by multiple sources who demand action IMMEDIATELY.`,
  },
  {
    label: 'Research Study',
    text: `A new longitudinal study published in Nature Medicine has found that regular physical exercise — specifically 150 minutes of moderate aerobic activity per week — is associated with a 35% reduction in the risk of developing type 2 diabetes over a 10-year period. The research analyzed data from 45,000 participants across 12 countries. According to the lead researcher, Dr. Sarah Chen, the findings suggest that public health policies should prioritize exercise programs as a primary prevention strategy. The study also found that resistance training two to three times per week provided additional metabolic benefits. However, researchers note that diet and genetics also play significant roles and that further investigation is needed to understand individual variation in response to exercise.`,
  },
];

function getVerdictConfig(verdict: string) {
  switch (verdict) {
    case 'worth_reading':
      return { icon: CheckCircle, color: '#10b981', bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.3)', label: 'Worth Reading' };
    case 'skip':
      return { icon: XCircle, color: '#ef4444', bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.3)', label: 'Safe to Skip' };
    default:
      return { icon: AlertCircle, color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.3)', label: 'Read with Caution' };
  }
}

function ProgressBar({ value, color }: { value: number; color: string }) {
  return (
    <div className="progress-bar" style={{ marginTop: 8 }}>
      <motion.div
        className="progress-fill"
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
        style={{ background: color }}
      />
    </div>
  );
}

function MetricCard({ icon: Icon, color, label, value, sub }: {
  icon: React.ElementType; color: string; label: string; value: string | number; sub?: string;
}) {
  return (
    <div className="glass-card" style={{ padding: '20px 24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10,
          background: `${color}22`, border: `1px solid ${color}44`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon size={18} color={color} />
        </div>
        <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</span>
      </div>
      <div className="stat-number" style={{ fontSize: 32, letterSpacing: '-0.03em', marginBottom: 4 }}>{value}</div>
      {sub && <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{sub}</div>}
    </div>
  );
}

export default function AnalyzePage() {
  const [mode, setMode] = useState<'text' | 'url'>('text');
  const [text, setText] = useState('');
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState('');
  const [expandInsights, setExpandInsights] = useState(false);
  const [copied, setCopied] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  const getUserProfile = () => {
    try {
      const p = localStorage.getItem('clarity_profile');
      return p ? JSON.parse(p) : { goals: [], interests: [] };
    } catch { return { goals: [], interests: [] }; }
  };

  const saveToHistory = (r: AnalysisResult) => {
    try {
      const history = JSON.parse(localStorage.getItem('clarity_history') || '[]');
      history.unshift(r);
      localStorage.setItem('clarity_history', JSON.stringify(history.slice(0, 100)));
      // Update streak
      const today = new Date().toDateString();
      const lastDate = localStorage.getItem('clarity_last_date');
      if (lastDate !== today) {
        const streak = parseInt(localStorage.getItem('clarity_streak') || '0');
        localStorage.setItem('clarity_streak', String(streak + 1));
        localStorage.setItem('clarity_last_date', today);
      }
    } catch {}
  };

  const analyze = useCallback(async () => {
    const content = mode === 'text' ? text : url;
    if (!content.trim()) { setError('Please enter some content to analyze.'); return; }
    if (mode === 'text' && text.length < 100) { setError('Please paste at least a few sentences of text.'); return; }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const profile = getUserProfile();
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: mode === 'text' ? text : `Article from ${url}\n\n${url}`,
          url: mode === 'url' ? url : undefined,
          userGoals: profile.goals || [],
          userInterests: profile.interests || [],
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Analysis failed');
      }

      const data: AnalysisResult = await res.json();
      setResult(data);
      saveToHistory(data);

      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [mode, text, url]);

  const copyResult = () => {
    if (!result) return;
    const text = `ClarityAI Analysis\n\nTitle: ${result.title}\nVerdict: ${result.verdict}\nImportance: ${result.importanceScore}/10\nBias: ${result.biasScore}% (${result.biasLabel})\nRead Time: ${result.readTime} min\n\nSummary:\n${result.summary}\n\nReason:\n${result.importanceReason}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const verdictConfig = result ? getVerdictConfig(result.verdict) : null;

  const loadExample = (t: string) => {
    setMode('text');
    setText(t);
    setResult(null);
    setError('');
  };

  return (
    <AppLayout>
      <div style={{ padding: '40px 40px', maxWidth: 900, margin: '0 auto' }}>
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 40 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <div style={{ padding: 10, borderRadius: 12, background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)' }}>
              <Zap size={22} color="#a78bfa" />
            </div>
            <h1 style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: 28, letterSpacing: '-0.03em' }}>AI Analyzer</h1>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: 15 }}>
            Paste any article or URL — get instant bias detection, importance score, and AI summary.
          </p>
        </motion.div>

        {/* Input Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="glass-card" style={{ padding: 28, marginBottom: 24 }}
        >
          {/* Mode tabs */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
            {[
              { id: 'text', label: 'Paste Text', icon: FileText },
              { id: 'url', label: 'Enter URL', icon: LinkIcon },
            ].map(m => (
              <button
                key={m.id}
                onClick={() => { setMode(m.id as 'text' | 'url'); setError(''); }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '8px 18px', borderRadius: 10,
                  border: '1px solid',
                  borderColor: mode === m.id ? 'rgba(124,58,237,0.5)' : 'var(--border)',
                  background: mode === m.id ? 'rgba(124,58,237,0.15)' : 'transparent',
                  color: mode === m.id ? '#a78bfa' : 'var(--text-muted)',
                  fontSize: 14, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s',
                }}
              >
                <m.icon size={15} /> {m.label}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {mode === 'text' ? (
              <motion.div key="text" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <textarea
                  className="ai-input"
                  value={text}
                  onChange={e => { setText(e.target.value); setError(''); }}
                  placeholder="Paste the article text here... (minimum 100 characters)"
                  style={{ width: '100%', minHeight: 180, padding: '16px', resize: 'vertical', lineHeight: 1.6 }}
                />
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 8 }}>
                  {text.length} chars · ~{Math.max(1, Math.round(text.trim().split(/\s+/).length / 200))} min read
                </div>
              </motion.div>
            ) : (
              <motion.div key="url" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <input
                  className="ai-input"
                  type="url"
                  value={url}
                  onChange={e => { setUrl(e.target.value); setError(''); }}
                  placeholder="https://example.com/article..."
                  style={{ width: '100%', padding: '14px 16px' }}
                />
                <div style={{ marginTop: 12, padding: '12px 16px', borderRadius: 10, background: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.2)' }}>
                  <div style={{ display: 'flex', gap: 8, fontSize: 13, color: '#67e8f9' }}>
                    <Info size={15} style={{ marginTop: 1, flexShrink: 0 }} />
                    <span>For best results, paste full article text. URL mode provides basic analysis based on the link itself.</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Examples */}
          <div style={{ marginTop: 16, display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>Try examples:</span>
            {EXAMPLE_TEXTS.map(ex => (
              <button
                key={ex.label}
                onClick={() => loadExample(ex.text)}
                style={{
                  fontSize: 12, padding: '4px 12px', borderRadius: 100,
                  border: '1px solid var(--border)', background: 'transparent',
                  color: 'var(--text-secondary)', cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#7c3aed'; e.currentTarget.style.color = '#a78bfa'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
              >
                {ex.label}
              </button>
            ))}
          </div>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                style={{ marginTop: 16, padding: '12px 16px', borderRadius: 10, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171', fontSize: 14 }}
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Analyze button */}
          <div style={{ marginTop: 20, display: 'flex', gap: 12 }}>
            <button
              id="analyze-btn"
              onClick={analyze}
              disabled={loading}
              className="btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 15, padding: '13px 28px', opacity: loading ? 0.7 : 1 }}
            >
              {loading ? <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> : <Brain size={18} />}
              {loading ? 'Analyzing...' : 'Analyze Now'}
            </button>
            {result && (
              <button onClick={() => { setResult(null); setText(''); setUrl(''); }} className="btn-secondary"
                style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14 }}>
                <RotateCcw size={14} /> New
              </button>
            )}
          </div>
        </motion.div>

        {/* Loading state */}
        <AnimatePresence>
          {loading && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="glass-card" style={{ padding: 32, textAlign: 'center' }}
            >
              <div style={{ marginBottom: 20 }}>
                {[
                  '🔍 Extracting content...',
                  '🧠 Running AI analysis...',
                  '⚖️ Scoring bias & importance...',
                  '📝 Generating summary...',
                  '🎯 Computing your verdict...',
                ].map((step, i) => (
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.3 }}
                    style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 8 }}
                  >
                    {step}
                  </motion.div>
                ))}
              </div>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Loader2 size={32} color="#7c3aed" style={{ animation: 'spin 1s linear infinite' }} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ─── Results ─── */}
        <AnimatePresence>
          {result && verdictConfig && (
            <motion.div
              ref={resultRef}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Verdict Banner */}
              <div style={{
                padding: '20px 28px', borderRadius: 16, marginBottom: 20,
                background: verdictConfig.bg, border: `1px solid ${verdictConfig.border}`,
                display: 'flex', alignItems: 'flex-start', gap: 16,
              }}>
                <verdictConfig.icon size={28} color={verdictConfig.color} style={{ flexShrink: 0, marginTop: 2 }} />
                <div>
                  <div style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: 20, color: verdictConfig.color, marginBottom: 4 }}>
                    {verdictConfig.label}
                  </div>
                  <div style={{ fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    {result.verdictMessage}
                  </div>
                </div>
                <button
                  onClick={copyResult}
                  style={{ marginLeft: 'auto', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4, fontSize: 12 }}
                >
                  <Copy size={14} /> {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>

              {/* Doomscroll alert */}
              {result.isDoomscroll && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
                  style={{
                    padding: '14px 20px', borderRadius: 12, marginBottom: 20,
                    background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.4)',
                    display: 'flex', gap: 10, alignItems: 'center',
                  }}
                >
                  <AlertTriangle size={18} color="#f87171" />
                  <span style={{ fontSize: 14, color: '#fca5a5', fontWeight: 600 }}>
                    🚨 Doomscroll Alert — This content may negatively impact your mental energy. Consider skipping.
                  </span>
                </motion.div>
              )}

              {/* Title */}
              <div style={{ marginBottom: 20 }}>
                <h2 style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: 20, lineHeight: 1.4, marginBottom: 8 }}>
                  {result.title}
                </h2>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {result.topics.map(t => (
                    <span key={t} style={{
                      fontSize: 12, padding: '3px 10px', borderRadius: 100,
                      background: 'rgba(124,58,237,0.15)', color: '#a78bfa', fontWeight: 600,
                    }}>{t}</span>
                  ))}
                  {result.goalMatch.length > 0 && (
                    <span style={{
                      fontSize: 12, padding: '3px 10px', borderRadius: 100,
                      background: 'rgba(16,185,129,0.15)', color: '#34d399', fontWeight: 600,
                    }}>🎯 Goal Match</span>
                  )}
                </div>
              </div>

              {/* Metrics grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
                {/* Importance */}
                <div className="glass-card" style={{ padding: '20px 24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                    <Target size={16} color="#7c3aed" />
                    <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Importance</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 4 }}>
                    <span className="stat-number" style={{
                      fontSize: 36,
                      color: result.importanceScore >= 7 ? '#10b981' : result.importanceScore >= 5 ? '#f59e0b' : '#ef4444',
                    }}>{result.importanceScore}</span>
                    <span style={{ fontSize: 14, color: 'var(--text-muted)' }}>/10</span>
                  </div>
                  <ProgressBar
                    value={result.importanceScore * 10}
                    color={result.importanceScore >= 7 ? '#10b981' : result.importanceScore >= 5 ? '#f59e0b' : '#ef4444'}
                  />
                </div>

                {/* Bias */}
                <div className="glass-card" style={{ padding: '20px 24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                    <Shield size={16} color="#06b6d4" />
                    <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Bias Score</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 4 }}>
                    <span className="stat-number" style={{
                      fontSize: 36,
                      color: result.biasScore < 35 ? '#10b981' : result.biasScore < 65 ? '#f59e0b' : '#ef4444',
                    }}>{result.biasScore}</span>
                    <span className={`tag ${result.biasScore < 35 ? 'bias-low' : result.biasScore < 65 ? 'bias-medium' : 'bias-high'}`} style={{ fontSize: 10 }}>
                      {result.biasLabel}
                    </span>
                  </div>
                  <ProgressBar
                    value={result.biasScore}
                    color={result.biasScore < 35 ? '#10b981' : result.biasScore < 65 ? '#f59e0b' : '#ef4444'}
                  />
                </div>

                {/* Read time + Tone */}
                <div className="glass-card" style={{ padding: '20px 24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                    <Clock size={16} color="#f59e0b" />
                    <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Read Time</span>
                  </div>
                  <div className="stat-number" style={{ fontSize: 36, marginBottom: 8 }}>{result.readTime}<span style={{ fontSize: 14, color: 'var(--text-muted)' }}> min</span></div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background:
                        result.tone === 'Positive' ? '#10b981' :
                        result.tone === 'Negative' ? '#ef4444' :
                        result.tone === 'Emotionally Charged' ? '#f59e0b' : '#94a3b8',
                      display: 'inline-block',
                    }} />
                    Tone: {result.tone}
                  </div>
                </div>
              </div>

              {/* AI Summary */}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
                className="glass-card" style={{ padding: 24, marginBottom: 16 }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                  <Brain size={18} color="#7c3aed" />
                  <span style={{ fontWeight: 700, fontSize: 15 }}>AI Summary</span>
                  <span style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--text-muted)' }}>⏱️ Saves ~{Math.max(0, result.readTime - 1)} min</span>
                </div>
                <p style={{ fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.7, fontStyle: 'italic' }}>
                  &ldquo;{result.summary}&rdquo;
                </p>
              </motion.div>

              {/* Importance reason */}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
                className="glass-card" style={{ padding: 24, marginBottom: 16 }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                  <TrendingUp size={18} color="#10b981" />
                  <span style={{ fontWeight: 700, fontSize: 15 }}>Why This Matters (or Doesn&apos;t)</span>
                </div>
                <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{result.importanceReason}</p>
                <div style={{ marginTop: 12, padding: '12px 16px', borderRadius: 10, background: 'rgba(6,182,212,0.06)', border: '1px solid rgba(6,182,212,0.2)', fontSize: 13, color: '#67e8f9' }}>
                  🛡️ Bias Check: {result.biasExplanation}
                </div>
              </motion.div>

              {/* Key Insights */}
              {result.keyInsights.length > 0 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
                  className="glass-card" style={{ padding: 24 }}
                >
                  <button
                    onClick={() => setExpandInsights(!expandInsights)}
                    style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-primary)' }}
                  >
                    <Zap size={18} color="#f59e0b" />
                    <span style={{ fontWeight: 700, fontSize: 15 }}>Key Insights</span>
                    <span style={{ marginLeft: 'auto' }}>
                      {expandInsights ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </span>
                  </button>
                  <AnimatePresence>
                    {expandInsights && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                        style={{ overflow: 'hidden', marginTop: 14 }}
                      >
                        {result.keyInsights.map((insight, i) => (
                          <div key={i} style={{
                            display: 'flex', gap: 10, alignItems: 'flex-start',
                            padding: '10px 0', borderBottom: i < result.keyInsights.length - 1 ? '1px solid var(--border)' : 'none',
                          }}>
                            <CheckCircle size={16} color="#10b981" style={{ marginTop: 1, flexShrink: 0 }} />
                            <span style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{insight}</span>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </AppLayout>
  );
}
