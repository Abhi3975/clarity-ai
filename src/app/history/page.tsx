'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { History, Search, CheckCircle, XCircle, AlertCircle, Trash2, Filter, SortDesc } from 'lucide-react';
import AppLayout from '@/components/ui/AppLayout';
import Link from 'next/link';

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
  summary: string;
  isDoomscroll: boolean;
  tone: string;
}

type FilterType = 'all' | 'worth_reading' | 'skip' | 'read_with_caution';
type SortType = 'newest' | 'importance' | 'bias';

export default function HistoryPage() {
  const [history, setHistory] = useState<AnalysisResult[]>([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');
  const [sort, setSort] = useState<SortType>('newest');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    const h = JSON.parse(localStorage.getItem('clarity_history') || '[]');
    setHistory(h);
  }, []);

  const clearHistory = () => {
    if (confirm('Clear all analysis history?')) {
      localStorage.removeItem('clarity_history');
      setHistory([]);
    }
  };

  const getVerdictIcon = (v: string) => {
    if (v === 'worth_reading') return <CheckCircle size={16} color="#10b981" />;
    if (v === 'skip') return <XCircle size={16} color="#ef4444" />;
    return <AlertCircle size={16} color="#f59e0b" />;
  };

  const getVerdictLabel = (v: string) => {
    if (v === 'worth_reading') return 'Worth Reading';
    if (v === 'skip') return 'Skipped';
    return 'Caution';
  };

  const getVerdictColor = (v: string) => {
    if (v === 'worth_reading') return '#10b981';
    if (v === 'skip') return '#ef4444';
    return '#f59e0b';
  };

  const filtered = history
    .filter(h => {
      if (filter !== 'all' && h.verdict !== filter) return false;
      if (search && !h.title.toLowerCase().includes(search.toLowerCase()) &&
          !h.topics.join(' ').toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => {
      if (sort === 'importance') return b.importanceScore - a.importanceScore;
      if (sort === 'bias') return b.biasScore - a.biasScore;
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });

  return (
    <AppLayout>
      <div style={{ padding: '40px', maxWidth: 900, margin: '0 auto' }}>
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28, flexWrap: 'wrap', gap: 16 }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
              <div style={{ padding: 10, borderRadius: 12, background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.3)' }}>
                <History size={22} color="#fbbf24" />
              </div>
              <h1 style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: 28, letterSpacing: '-0.03em' }}>History</h1>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: 15 }}>
              {history.length} article{history.length !== 1 ? 's' : ''} analyzed · Your content intelligence log
            </p>
          </div>
          {history.length > 0 && (
            <button onClick={clearHistory} className="btn-secondary"
              style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#f87171', borderColor: 'rgba(239,68,68,0.3)' }}>
              <Trash2 size={14} /> Clear All
            </button>
          )}
        </motion.div>

        {history.length === 0 ? (
          <div className="glass-card" style={{ padding: 60, textAlign: 'center' }}>
            <History size={56} color="var(--text-muted)" style={{ margin: '0 auto 16px', display: 'block' }} />
            <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 8 }}>No history yet</div>
            <div style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 24 }}>
              Your analyzed articles will appear here
            </div>
            <Link href="/analyze">
              <button className="btn-primary">Start Analyzing</button>
            </Link>
          </div>
        ) : (
          <>
            {/* Filters */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
              style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}
            >
              <div style={{ position: 'relative', flex: '1 1 200px' }}>
                <Search size={15} color="var(--text-muted)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  className="ai-input"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search articles..."
                  style={{ width: '100%', padding: '10px 12px 10px 36px' }}
                />
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                <Filter size={15} color="var(--text-muted)" />
                {(['all', 'worth_reading', 'read_with_caution', 'skip'] as FilterType[]).map(f => (
                  <button key={f} onClick={() => setFilter(f)}
                    style={{
                      fontSize: 12, padding: '6px 12px', borderRadius: 100, cursor: 'pointer',
                      border: '1px solid', transition: 'all 0.2s',
                      borderColor: filter === f ? (f === 'worth_reading' ? '#10b981' : f === 'skip' ? '#ef4444' : f === 'read_with_caution' ? '#f59e0b' : '#7c3aed') : 'var(--border)',
                      background: filter === f ? (f === 'worth_reading' ? 'rgba(16,185,129,0.15)' : f === 'skip' ? 'rgba(239,68,68,0.15)' : f === 'read_with_caution' ? 'rgba(245,158,11,0.15)' : 'rgba(124,58,237,0.15)') : 'transparent',
                      color: filter === f ? (f === 'worth_reading' ? '#34d399' : f === 'skip' ? '#f87171' : f === 'read_with_caution' ? '#fbbf24' : '#a78bfa') : 'var(--text-muted)',
                      fontWeight: 600,
                    }}
                  >
                    {f === 'all' ? 'All' : f === 'worth_reading' ? '✅ Worth Reading' : f === 'skip' ? '🚫 Skipped' : '⚠️ Caution'}
                  </button>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                <SortDesc size={15} color="var(--text-muted)" />
                <select value={sort} onChange={e => setSort(e.target.value as SortType)}
                  className="ai-input" style={{ padding: '6px 10px', fontSize: 12 }}>
                  <option value="newest">Newest</option>
                  <option value="importance">Importance</option>
                  <option value="bias">Bias Score</option>
                </select>
              </div>
            </motion.div>

            <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 16 }}>
              Showing {filtered.length} of {history.length} results
            </div>

            {/* List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <AnimatePresence>
                {filtered.map((item, i) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="glass-card" style={{ overflow: 'hidden' }}
                  >
                    <button
                      onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                      style={{ width: '100%', background: 'transparent', border: 'none', cursor: 'pointer', padding: '18px 22px', textAlign: 'left' }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        {getVerdictIcon(item.verdict)}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4, textAlign: 'left', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {item.title}
                          </div>
                          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
                            <span style={{ fontSize: 12, padding: '2px 8px', borderRadius: 100, background: `${getVerdictColor(item.verdict)}22`, color: getVerdictColor(item.verdict), fontWeight: 600 }}>
                              {getVerdictLabel(item.verdict)}
                            </span>
                            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                              Importance: <strong style={{ color: item.importanceScore >= 7 ? '#10b981' : item.importanceScore >= 5 ? '#f59e0b' : '#ef4444' }}>{item.importanceScore}/10</strong>
                            </span>
                            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Bias: <strong style={{ color: item.biasScore < 35 ? '#10b981' : item.biasScore < 65 ? '#f59e0b' : '#ef4444' }}>{item.biasScore}%</strong></span>
                            {item.topics.slice(0, 2).map(t => (
                              <span key={t} style={{ fontSize: 11, padding: '1px 8px', borderRadius: 100, background: 'rgba(124,58,237,0.12)', color: '#a78bfa' }}>{t}</span>
                            ))}
                            {item.isDoomscroll && <span style={{ fontSize: 11, color: '#f87171' }}>⚠️ Doomscroll</span>}
                          </div>
                        </div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)', flexShrink: 0 }}>
                          {new Date(item.timestamp).toLocaleDateString()}
                          <br />
                          {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </button>

                    <AnimatePresence>
                      {expandedId === item.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                          style={{ overflow: 'hidden', borderTop: '1px solid var(--border)', padding: '16px 22px' }}
                        >
                          <div style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 10, fontStyle: 'italic' }}>
                            &ldquo;{item.summary}&rdquo;
                          </div>
                          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                            Tone: <strong style={{ color: 'var(--text-secondary)' }}>{item.tone}</strong> · Read time: <strong>{item.readTime} min</strong>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </>
        )}
      </div>
    </AppLayout>
  );
}
