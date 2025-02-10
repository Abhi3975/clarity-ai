'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Target, BookOpen, Save, Plus, X, CheckCircle, Sparkles } from 'lucide-react';
import AppLayout from '@/components/ui/AppLayout';

const GOAL_SUGGESTIONS = [
  'AI Engineer', 'Software Engineer', 'Data Scientist', 'Product Manager',
  'Finance Analyst', 'Entrepreneur', 'Cybersecurity Expert', 'ML Researcher',
  'Full Stack Developer', 'DevOps Engineer', 'Student',
];

const INTEREST_SUGGESTIONS = [
  'Artificial Intelligence', 'Machine Learning', 'Web Development', 'Startups',
  'Cryptocurrency', 'Climate Tech', 'Health Tech', 'Space', 'Physics',
  'Psychology', 'Economics', 'Geopolitics', 'Open Source',
];

export default function ProfilePage() {
  const [name, setName] = useState('');
  const [goals, setGoals] = useState<string[]>([]);
  const [interests, setInterests] = useState<string[]>([]);
  const [timeBudget, setTimeBudget] = useState(30);
  const [newGoal, setNewGoal] = useState('');
  const [newInterest, setNewInterest] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const p = JSON.parse(localStorage.getItem('clarity_profile') || '{}');
    if (p.name) setName(p.name);
    if (p.goals) setGoals(p.goals);
    if (p.interests) setInterests(p.interests);
    if (p.timeBudget) setTimeBudget(p.timeBudget);
  }, []);

  const saveProfile = () => {
    localStorage.setItem('clarity_profile', JSON.stringify({ name, goals, interests, timeBudget }));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const addGoal = (g: string) => {
    if (g.trim() && !goals.includes(g.trim()) && goals.length < 5) {
      setGoals(prev => [...prev, g.trim()]);
      setNewGoal('');
    }
  };

  const addInterest = (i: string) => {
    if (i.trim() && !interests.includes(i.trim()) && interests.length < 8) {
      setInterests(prev => [...prev, i.trim()]);
      setNewInterest('');
    }
  };

  return (
    <AppLayout>
      <div style={{ padding: '40px', maxWidth: 720, margin: '0 auto' }}>
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 36 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <div style={{ padding: 10, borderRadius: 12, background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)' }}>
              <User size={22} color="#34d399" />
            </div>
            <h1 style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: 28, letterSpacing: '-0.03em' }}>My Profile</h1>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: 15 }}>
            Tell ClarityAI about your goals so it can personalize relevance scores for you.
          </p>
        </motion.div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Name */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="glass-card" style={{ padding: 24 }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <User size={18} color="#7c3aed" />
              <h2 style={{ fontWeight: 700, fontSize: 16 }}>Your Name</h2>
            </div>
            <input
              className="ai-input"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g., Abhijeet"
              style={{ width: '100%', padding: '12px 16px' }}
            />
          </motion.div>

          {/* Goals */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="glass-card" style={{ padding: 24 }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <Target size={18} color="#7c3aed" />
              <h2 style={{ fontWeight: 700, fontSize: 16 }}>Career Goals</h2>
              <span style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--text-muted)' }}>{goals.length}/5</span>
            </div>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 16 }}>
              ClarityAI will score articles higher when they match these goals.
            </p>

            {/* Current goals */}
            {goals.length > 0 && (
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
                {goals.map(g => (
                  <div key={g} style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    padding: '6px 12px', borderRadius: 100,
                    background: 'rgba(124,58,237,0.2)', border: '1px solid rgba(124,58,237,0.4)',
                    fontSize: 13, fontWeight: 600, color: '#a78bfa',
                  }}>
                    {g}
                    <button onClick={() => setGoals(prev => prev.filter(x => x !== g))}
                      style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#a78bfa', padding: 0, lineHeight: 1 }}>
                      <X size={13} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Add custom */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
              <input
                className="ai-input"
                value={newGoal}
                onChange={e => setNewGoal(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addGoal(newGoal)}
                placeholder="Add custom goal..."
                style={{ flex: 1, padding: '10px 14px' }}
              />
              <button onClick={() => addGoal(newGoal)} className="btn-primary" style={{ padding: '10px 16px' }}>
                <Plus size={16} />
              </button>
            </div>

            {/* Suggestions */}
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 10, fontWeight: 600 }}>Suggestions:</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {GOAL_SUGGESTIONS.filter(s => !goals.includes(s)).map(s => (
                <button key={s} onClick={() => addGoal(s)}
                  style={{
                    fontSize: 12, padding: '5px 12px', borderRadius: 100, cursor: 'pointer',
                    border: '1px solid var(--border)', background: 'transparent',
                    color: 'var(--text-secondary)', transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#7c3aed'; e.currentTarget.style.color = '#a78bfa'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
                >
                  + {s}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Interests */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="glass-card" style={{ padding: 24 }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <BookOpen size={18} color="#06b6d4" />
              <h2 style={{ fontWeight: 700, fontSize: 16 }}>Topics of Interest</h2>
              <span style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--text-muted)' }}>{interests.length}/8</span>
            </div>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 16 }}>
              Content matching these topics gets a relevance boost.
            </p>

            {interests.length > 0 && (
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
                {interests.map(i => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    padding: '6px 12px', borderRadius: 100,
                    background: 'rgba(6,182,212,0.15)', border: '1px solid rgba(6,182,212,0.3)',
                    fontSize: 13, fontWeight: 600, color: '#67e8f9',
                  }}>
                    {i}
                    <button onClick={() => setInterests(prev => prev.filter(x => x !== i))}
                      style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#67e8f9', padding: 0 }}>
                      <X size={13} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
              <input
                className="ai-input"
                value={newInterest}
                onChange={e => setNewInterest(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addInterest(newInterest)}
                placeholder="Add topic..."
                style={{ flex: 1, padding: '10px 14px' }}
              />
              <button onClick={() => addInterest(newInterest)} className="btn-primary" style={{ padding: '10px 16px' }}>
                <Plus size={16} />
              </button>
            </div>

            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {INTEREST_SUGGESTIONS.filter(s => !interests.includes(s)).map(s => (
                <button key={s} onClick={() => addInterest(s)}
                  style={{
                    fontSize: 12, padding: '5px 12px', borderRadius: 100, cursor: 'pointer',
                    border: '1px solid var(--border)', background: 'transparent',
                    color: 'var(--text-secondary)', transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#06b6d4'; e.currentTarget.style.color = '#67e8f9'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
                >
                  + {s}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Time Budget */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="glass-card" style={{ padding: 24 }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <Sparkles size={18} color="#f59e0b" />
              <h2 style={{ fontWeight: 700, fontSize: 16 }}>Daily Reading Budget</h2>
            </div>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 16 }}>
              How many minutes per day do you want to spend on news/information?
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
              <input
                type="range" min={5} max={120} step={5}
                value={timeBudget}
                onChange={e => setTimeBudget(parseInt(e.target.value))}
                style={{ flex: 1, accentColor: '#7c3aed' }}
              />
              <div style={{ minWidth: 80, textAlign: 'center' }}>
                <span className="stat-number" style={{ fontSize: 28, color: '#a78bfa' }}>{timeBudget}</span>
                <span style={{ fontSize: 13, color: 'var(--text-muted)' }}> min/day</span>
              </div>
            </div>
          </motion.div>

          {/* Save */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <button onClick={saveProfile} id="save-profile-btn" className="btn-primary"
              style={{ width: '100%', padding: 16, fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
            >
              {saved ? <><CheckCircle size={18} /> Profile Saved!</> : <><Save size={18} /> Save Profile</>}
            </button>
            {saved && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                style={{ textAlign: 'center', fontSize: 13, color: '#34d399', marginTop: 10 }}>
                ✅ ClarityAI will now personalize results for you!
              </motion.p>
            )}
          </motion.div>
        </div>
      </div>
    </AppLayout>
  );
}
