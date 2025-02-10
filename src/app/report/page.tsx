'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingDown, Brain, RefreshCw, AlertTriangle, CheckCircle, Clock, Loader2 } from 'lucide-react';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis,
} from 'recharts';
import AppLayout from '@/components/ui/AppLayout';

const COLORS = ['#10b981', '#f59e0b', '#ef4444'];
const BIAS_COLORS = ['#10b981', '#f59e0b', '#ef4444'];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: 'rgba(10,10,15,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '10px 14px', fontSize: 13 }}>
      <div style={{ color: 'var(--text-muted)', marginBottom: 4 }}>{label}</div>
      {payload.map((p: any, i: number) => (
        <div key={i} style={{ color: p.color || 'white', fontWeight: 600 }}>{p.name}: {p.value}</div>
      ))}
    </div>
  );
};

interface Report {
  date: string;
  totalAnalyzed: number;
  timeSaved: number;
  skippedCount: number;
  worthReadingCount: number;
  cautionCount: number;
  doomscrollAlerts: number;
  topTopics: Array<{ name: string; count: number; percentage: number }>;
  avgBiasScore: number;
  avgImportanceScore: number;
  mostRelevantArticle: string | null;
  insights: string[];
  biasDistribution: Array<{ label: string; value: number; color: string }>;
  verdictDistribution: Array<{ name: string; value: number; color: string }>;
  topicBreakdown: Array<{ topic: string; count: number; relevance: number }>;
}

export default function ReportPage() {
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generateReport = async () => {
    const history = JSON.parse(localStorage.getItem('clarity_history') || '[]');
    if (history.length === 0) return;

    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ analyses: history.slice(0, 50) }),
      });
      if (!res.ok) throw new Error('Report generation failed');
      const data: Report = await res.json();
      setReport(data);
    } catch (e) {
      setError('Failed to generate report. Try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { generateReport(); }, []);

  const RADIAN = Math.PI / 180;
  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }: any) => {
    if (percent < 0.08) return null;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    return <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={12} fontWeight={700}>{`${(percent * 100).toFixed(0)}%`}</text>;
  };

  return (
    <AppLayout>
      <div style={{ padding: '40px', maxWidth: 1000, margin: '0 auto' }}>
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 36, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
              <div style={{ padding: 10, borderRadius: 12, background: 'rgba(6,182,212,0.15)', border: '1px solid rgba(6,182,212,0.3)' }}>
                <BarChart3 size={22} color="#67e8f9" />
              </div>
              <h1 style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: 28, letterSpacing: '-0.03em' }}>Daily Clarity Report</h1>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: 15 }}>
              Your information diet analysis — {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <button onClick={generateReport} disabled={loading} className="btn-secondary"
            style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {loading ? <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} /> : <RefreshCw size={15} />}
            Regenerate
          </button>
        </motion.div>

        {loading && (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <Loader2 size={40} color="#7c3aed" style={{ animation: 'spin 1s linear infinite', margin: '0 auto 16px', display: 'block' }} />
            <div style={{ color: 'var(--text-secondary)' }}>Generating your clarity report...</div>
          </div>
        )}

        {error && (
          <div style={{ padding: 20, borderRadius: 12, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171', textAlign: 'center' }}>
            {error}
          </div>
        )}

        {!report && !loading && (
          <div className="glass-card" style={{ padding: 60, textAlign: 'center' }}>
            <BarChart3 size={56} color="var(--text-muted)" style={{ margin: '0 auto 16px', display: 'block' }} />
            <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 8 }}>No data yet</div>
            <div style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 20 }}>
              Analyze some articles first, then come back for your clarity report.
            </div>
          </div>
        )}

        {report && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {/* Key Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 28 }}>
              {[
                { icon: Brain, color: '#7c3aed', label: 'Total Analyzed', value: report.totalAnalyzed },
                { icon: CheckCircle, color: '#10b981', label: 'Worth Reading', value: report.worthReadingCount },
                { icon: Clock, color: '#06b6d4', label: 'Minutes Saved', value: report.timeSaved },
                { icon: AlertTriangle, color: '#ef4444', label: 'Doomscroll Alerts', value: report.doomscrollAlerts },
              ].map((s, i) => (
                <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                  className="glass-card" style={{ padding: '20px 22px' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 9, background: `${s.color}22`, border: `1px solid ${s.color}44`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <s.icon size={16} color={s.color} />
                    </div>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</span>
                  </div>
                  <div className="stat-number" style={{ fontSize: 36 }}>{s.value}</div>
                </motion.div>
              ))}
            </div>

            {/* Charts Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
              {/* Verdict Donut */}
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
                className="glass-card" style={{ padding: 24 }}
              >
                <h3 style={{ fontWeight: 700, fontSize: 16, marginBottom: 20 }}>Verdict Breakdown</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={report.verdictDistribution} cx="50%" cy="50%" innerRadius={60} outerRadius={90}
                      dataKey="value" labelLine={false} label={renderCustomLabel}
                    >
                      {report.verdictDistribution.map((entry, i) => (
                        <Cell key={i} fill={entry.color || COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                  {report.verdictDistribution.map(d => (
                    <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
                      <div style={{ width: 10, height: 10, borderRadius: 2, background: d.color }} />
                      <span style={{ color: 'var(--text-muted)' }}>{d.name} ({d.value})</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Bias Distribution bars */}
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
                className="glass-card" style={{ padding: 24 }}
              >
                <h3 style={{ fontWeight: 700, fontSize: 16, marginBottom: 6 }}>Bias Distribution</h3>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 20 }}>Avg Score: <strong style={{ color: report.avgBiasScore > 60 ? '#f87171' : '#fbbf24' }}>{report.avgBiasScore}</strong>/100</p>
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={report.biasDistribution} layout="vertical">
                    <XAxis type="number" hide />
                    <YAxis type="category" dataKey="label" width={100} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                      {report.biasDistribution.map((entry, i) => (
                        <Cell key={i} fill={entry.color || BIAS_COLORS[i]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </motion.div>
            </div>

            {/* Topic breakdown */}
            {report.topicBreakdown.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                className="glass-card" style={{ padding: 24, marginBottom: 24 }}
              >
                <h3 style={{ fontWeight: 700, fontSize: 16, marginBottom: 20 }}>Topic Breakdown</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={report.topicBreakdown}>
                    <XAxis dataKey="topic" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                    <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="count" fill="#7c3aed" radius={[4, 4, 0, 0]} name="Articles" />
                  </BarChart>
                </ResponsiveContainer>
              </motion.div>
            )}

            {/* AI Insights */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
              className="glass-card" style={{ padding: 28, background: 'linear-gradient(135deg, rgba(124,58,237,0.1), rgba(6,182,212,0.06))', border: '1px solid rgba(124,58,237,0.25)' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                <Brain size={20} color="#a78bfa" />
                <h3 style={{ fontWeight: 700, fontSize: 18 }}>🧠 AI Insights for Today</h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {report.insights.map((insight, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 + i * 0.1 }}
                    style={{
                      padding: '14px 18px', borderRadius: 12,
                      background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                      fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6,
                    }}
                  >
                    {insight}
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Most relevant */}
            {report.mostRelevantArticle && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
                style={{ marginTop: 20, padding: '16px 20px', borderRadius: 14, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)' }}
              >
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <CheckCircle size={18} color="#10b981" />
                  <div>
                    <div style={{ fontSize: 12, color: '#34d399', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>Most Relevant Today</div>
                    <div style={{ fontSize: 14, color: 'var(--text-secondary)' }}>{report.mostRelevantArticle}</div>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </AppLayout>
  );
}
