import { NextRequest, NextResponse } from 'next/server';

export interface AnalysisResult {
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

// ─── Lightweight in-process AI analysis ──────────────────────────────────────

function estimateReadTime(text: string): number {
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

function detectTopics(text: string): string[] {
  const textLower = text.toLowerCase();
  const topicMap: Record<string, string[]> = {
    'AI & Machine Learning': ['artificial intelligence', 'machine learning', 'deep learning', 'neural', 'gpt', 'llm', 'chatgpt', 'openai', 'model'],
    'Finance & Markets': ['stock', 'market', 'economy', 'inflation', 'invest', 'crypto', 'bitcoin', 'finance', 'dollar', 'bank', 'fund'],
    'Technology': ['software', 'app', 'startup', 'tech', 'digital', 'algorithm', 'data', 'cloud', 'cybersecurity', 'programming'],
    'Health & Wellness': ['health', 'medical', 'disease', 'vaccine', 'mental health', 'fitness', 'diet', 'doctor', 'hospital', 'wellness'],
    'Politics': ['government', 'election', 'president', 'congress', 'policy', 'democrat', 'republican', 'vote', 'senate', 'parliament'],
    'Climate & Environment': ['climate', 'carbon', 'emission', 'renewable', 'solar', 'environment', 'fossil fuel', 'global warming'],
    'Career & Education': ['job', 'career', 'hiring', 'resume', 'interview', 'programming', 'course', 'degree', 'salary', 'skill'],
    'Science': ['research', 'study', 'scientist', 'discovery', 'experiment', 'nasa', 'space', 'quantum', 'biology', 'physics'],
    'Business': ['company', 'startup', 'revenue', 'ceo', 'acquisition', 'ipo', 'billion', 'corporation', 'entrepreneur'],
    'Entertainment': ['movie', 'music', 'celebrity', 'netflix', 'gaming', 'sport', 'actor', 'award', 'viral'],
  };

  const detected: string[] = [];
  for (const [topic, keywords] of Object.entries(topicMap)) {
    if (keywords.some(kw => textLower.includes(kw))) {
      detected.push(topic);
    }
    if (detected.length >= 3) break;
  }
  return detected.length > 0 ? detected : ['General News'];
}

function analyzeBias(text: string): { score: number; label: string; explanation: string; tone: string } {
  const textLower = text.toLowerCase();
  
  const emotionalTriggers = [
    'outrage', 'shocking', 'explosive', 'devastating', 'crisis', 'dangerous', 'urgent',
    'alarming', 'catastrophic', 'terrifying', 'nightmare', 'disaster', 'chaos', 'collapse',
    'must', 'never forget', 'wake up', 'they are', 'everyone knows', 'proven fact'
  ];

  const sensationalWords = [
    'breaking', 'exclusive', 'bombshell', 'leaked', 'secret', 'exposed', 'revealed',
    'finally', 'always', 'never', 'everybody', 'nobody', 'everyone', 'nobody'
  ];

  const calmWords = [
    'according to', 'research shows', 'study found', 'data indicates', 'experts say',
    'reported', 'analysis', 'however', 'on the other hand', 'in contrast', 'meanwhile'
  ];

  let biasScore = 50; // neutral start

  const emotionalCount = emotionalTriggers.filter(w => textLower.includes(w)).length;
  const sensationalCount = sensationalWords.filter(w => textLower.includes(w)).length;
  const calmCount = calmWords.filter(w => textLower.includes(w)).length;

  biasScore += (emotionalCount * 8) + (sensationalCount * 5) - (calmCount * 6);
  biasScore = Math.min(100, Math.max(5, biasScore));

  // Detect tone
  const positiveWords = ['success', 'growth', 'improve', 'achieve', 'win', 'benefit', 'opportunity'];
  const negativeWords = ['fail', 'loss', 'decline', 'problem', 'risk', 'threat', 'danger', 'crash'];
  const posCount = positiveWords.filter(w => textLower.includes(w)).length;
  const negCount = negativeWords.filter(w => textLower.includes(w)).length;
  
  let tone = 'Neutral';
  if (posCount > negCount + 1) tone = 'Positive';
  if (negCount > posCount + 1) tone = 'Negative';
  if (biasScore > 65) tone = 'Emotionally Charged';

  const label = biasScore < 35 ? 'Low Bias' : biasScore < 65 ? 'Moderate Bias' : 'High Bias';
  const explanation = biasScore < 35
    ? 'Content appears balanced and uses neutral language with cited sources.'
    : biasScore < 65
    ? 'Some emotional language detected. Read with mild critical thinking.'
    : 'Highly emotional or sensational language detected. Verify with other sources before acting on this.';

  return { score: biasScore, label, explanation, tone };
}

function scoreImportance(
  text: string,
  topics: string[],
  userGoals: string[],
  userInterests: string[]
): { score: number; reason: string; goalMatch: string[] } {
  let score = 5;
  const matchedGoals: string[] = [];
  const textLower = text.toLowerCase();

  const goalKeywords: Record<string, string[]> = {
    'ai engineer': ['ai', 'machine learning', 'neural', 'gpt', 'model', 'deep learning', 'python', 'pytorch', 'tensorflow'],
    'software engineer': ['programming', 'software', 'algorithm', 'backend', 'frontend', 'api', 'developer', 'code'],
    'finance': ['stock', 'market', 'invest', 'economy', 'portfolio', 'dividend', 'trading', 'fund'],
    'data science': ['data', 'analysis', 'statistics', 'pandas', 'visualization', 'sql', 'machine learning'],
    'entrepreneur': ['startup', 'venture', 'founder', 'business model', 'funding', 'product', 'market fit'],
    'health': ['health', 'fitness', 'mental health', 'nutrition', 'wellness', 'exercise'],
    'cybersecurity': ['security', 'hack', 'vulnerability', 'encryption', 'cyber', 'malware', 'breach'],
    'student': ['education', 'learning', 'course', 'university', 'research', 'scholarship', 'study'],
  };

  for (const goal of userGoals) {
    const goalLower = goal.toLowerCase();
    for (const [key, keywords] of Object.entries(goalKeywords)) {
      if (goalLower.includes(key.split(' ')[0]) || key.includes(goalLower)) {
        const matched = keywords.filter(kw => textLower.includes(kw));
        if (matched.length > 0) {
          score += matched.length * 0.8;
          matchedGoals.push(goal);
        }
      }
    }
  }

  for (const interest of userInterests) {
    if (topics.some(t => t.toLowerCase().includes(interest.toLowerCase())) ||
        textLower.includes(interest.toLowerCase())) {
      score += 1.5;
    }
  }

  // Freshness / breaking news boost
  const freshnessWords = ['today', 'just announced', 'breaking', 'new study', 'latest'];
  if (freshnessWords.some(w => textLower.includes(w))) score += 0.5;

  score = Math.min(10, Math.max(1, parseFloat(score.toFixed(1))));

  const reason = matchedGoals.length > 0
    ? `Directly relevant to your goal: ${matchedGoals[0]}. Contains ${topics.join(', ')} insights.`
    : score >= 7
    ? `Matches your interests in ${userInterests[0] || topics[0]}. High informational density.`
    : score >= 5
    ? `Moderately relevant. Worth a quick scan.`
    : `Low relevance to your current goals. Safe to skip unless curious.`;

  return { score, reason, goalMatch: matchedGoals };
}

function generateSummary(text: string): string {
  const sentences = text
    .replace(/\n+/g, ' ')
    .split(/(?<=[.!?])\s+/)
    .filter(s => s.length > 50)
    .slice(0, 12);

  if (sentences.length === 0) {
    return 'Unable to extract meaningful content. Please try with a longer article.';
  }

  // Score sentences by keyword density (simple extractive)
  const allWords = text.toLowerCase().split(/\s+/);
  const wordFreq: Record<string, number> = {};
  const stopWords = new Set(['the', 'a', 'an', 'is', 'are', 'was', 'were', 'to', 'of', 'in', 'for', 'on', 'and', 'or', 'but', 'it', 'this', 'that', 'with', 'from', 'by', 'at', 'be', 'as', 'has', 'have', 'had', 'will', 'would', 'could', 'should']);
  
  allWords.forEach(word => {
    if (!stopWords.has(word) && word.length > 3) {
      wordFreq[word] = (wordFreq[word] || 0) + 1;
    }
  });

  const scoredSentences = sentences.map(sentence => {
    const words = sentence.toLowerCase().split(/\s+/);
    const score = words.reduce((acc, word) => acc + (wordFreq[word] || 0), 0) / words.length;
    return { sentence, score };
  });

  const topSentences = scoredSentences
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(s => s.sentence.trim());

  return topSentences.join(' ');
}

function generateKeyInsights(text: string, topics: string[]): string[] {
  const insights: string[] = [];
  const textLower = text.toLowerCase();

  if (textLower.includes('billion') || textLower.includes('million')) {
    insights.push('Contains significant financial figures mentioned');
  }
  if (textLower.includes('study') || textLower.includes('research') || textLower.includes('found')) {
    insights.push('Based on research or scientific study');
  }
  if (textLower.includes('first time') || textLower.includes('new') || textLower.includes('breakthrough')) {
    insights.push('Reports on a novel development or breakthrough');
  }
  if (textLower.includes('warning') || textLower.includes('risk') || textLower.includes('danger')) {
    insights.push('Contains risk warnings — verify claims independently');
  }
  if (textLower.includes('expert') || textLower.includes('professor') || textLower.includes('ceo') || textLower.includes('official')) {
    insights.push('Includes expert or official commentary');
  }
  if (topics.includes('AI & Machine Learning')) {
    insights.push('AI/ML related — track for career-relevant updates');
  }

  return insights.slice(0, 4);
}

function determineVerdict(
  importanceScore: number,
  biasScore: number,
  isDoomscroll: boolean
): { verdict: 'worth_reading' | 'skip' | 'read_with_caution'; message: string } {
  if (isDoomscroll) {
    return {
      verdict: 'skip',
      message: '🚫 Doomscroll alert — this content is emotionally draining and adds minimal value. Skip it.',
    };
  }
  if (importanceScore >= 7 && biasScore < 60) {
    return {
      verdict: 'worth_reading',
      message: '✅ Worth Reading — high relevance to your goals with balanced reporting.',
    };
  }
  if (importanceScore >= 5 && biasScore < 75) {
    return {
      verdict: 'read_with_caution',
      message: '⚠️ Read with Caution — moderately relevant but contains some bias. Cross-check key claims.',
    };
  }
  if (biasScore >= 75) {
    return {
      verdict: 'read_with_caution',
      message: '⚠️ High Bias Detected — emotionally charged content. Verify before forming opinions.',
    };
  }
  return {
    verdict: 'skip',
    message: '🧠 Safe to Skip — low relevance to your current goals. Your time is better spent elsewhere.',
  };
}

function extractTitle(text: string, url?: string): string {
  // Try to find a title-like sentence (short, at beginning)
  const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  if (lines[0] && lines[0].length < 150) return lines[0];
  if (url) {
    try {
      const path = new URL(url).pathname;
      return path.split('/').filter(Boolean).pop()?.replace(/-/g, ' ') || 'Article Analysis';
    } catch {
      return 'Article Analysis';
    }
  }
  return 'Article Analysis';
}

// ─── API Route Handler ────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      text = '',
      url = '',
      userGoals = [],
      userInterests = [],
    } = body;

    const content = text.trim();

    if (content.length < 100) {
      return NextResponse.json(
        { error: 'Please provide at least 100 characters of content to analyze.' },
        { status: 400 }
      );
    }

    // Run all analysis in parallel (all local/deterministic)
    const topics = detectTopics(content);
    const bias = analyzeBias(content);
    const importance = scoreImportance(content, topics, userGoals, userInterests);
    const summary = generateSummary(content);
    const readTime = estimateReadTime(content);
    const keyInsights = generateKeyInsights(content, topics);
    const isDoomscroll = bias.score >= 75 && topics.some(t => 
      ['Politics', 'Entertainment'].includes(t)
    ) && importance.score < 5;
    const { verdict, message: verdictMessage } = determineVerdict(
      importance.score,
      bias.score,
      isDoomscroll
    );

    const result: AnalysisResult = {
      id: crypto.randomUUID(),
      title: extractTitle(content, url),
      url: url || undefined,
      content: content.slice(0, 500) + (content.length > 500 ? '...' : ''),
      summary,
      readTime,
      biasScore: bias.score,
      biasLabel: bias.label,
      biasExplanation: bias.explanation,
      tone: bias.tone,
      importanceScore: importance.score,
      importanceReason: importance.reason,
      topics,
      verdict,
      verdictMessage,
      isDoomscroll,
      keyInsights,
      timestamp: new Date().toISOString(),
      goalMatch: importance.goalMatch,
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error('Analysis error:', error);
    return NextResponse.json(
      { error: 'Analysis failed. Please try again.' },
      { status: 500 }
    );
  }
}
