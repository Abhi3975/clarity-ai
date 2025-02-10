import { NextRequest, NextResponse } from 'next/server';
import { AnalysisResult } from '../analyze/route';

interface DailyReport {
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

export async function POST(req: NextRequest) {
  try {
    const { analyses }: { analyses: AnalysisResult[] } = await req.json();

    if (!analyses || analyses.length === 0) {
      return NextResponse.json({ error: 'No analyses provided' }, { status: 400 });
    }

    const totalAnalyzed = analyses.length;
    const skippedCount = analyses.filter(a => a.verdict === 'skip').length;
    const worthReadingCount = analyses.filter(a => a.verdict === 'worth_reading').length;
    const cautionCount = analyses.filter(a => a.verdict === 'read_with_caution').length;
    const doomscrollAlerts = analyses.filter(a => a.isDoomscroll).length;
    const timeSaved = analyses
      .filter(a => a.verdict === 'skip')
      .reduce((acc, a) => acc + a.readTime, 0);

    const avgBiasScore = Math.round(
      analyses.reduce((acc, a) => acc + a.biasScore, 0) / totalAnalyzed
    );
    const avgImportanceScore = parseFloat(
      (analyses.reduce((acc, a) => acc + a.importanceScore, 0) / totalAnalyzed).toFixed(1)
    );

    // Topic frequency
    const topicCount: Record<string, number> = {};
    analyses.forEach(a => {
      a.topics.forEach(t => (topicCount[t] = (topicCount[t] || 0) + 1));
    });
    const topTopics = Object.entries(topicCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([name, count]) => ({
        name,
        count,
        percentage: Math.round((count / totalAnalyzed) * 100),
      }));

    // Most relevant
    const mostRelevant = analyses.reduce((best, curr) =>
      curr.importanceScore > (best?.importanceScore ?? 0) ? curr : best
    , analyses[0]);
    const mostRelevantArticle = mostRelevant?.title || null;

    // Bias distribution
    const biasDistribution = [
      { label: 'Low (0-34)', value: analyses.filter(a => a.biasScore < 35).length, color: '#10b981' },
      { label: 'Moderate (35-64)', value: analyses.filter(a => a.biasScore >= 35 && a.biasScore < 65).length, color: '#f59e0b' },
      { label: 'High (65+)', value: analyses.filter(a => a.biasScore >= 65).length, color: '#ef4444' },
    ];

    // Verdict distribution
    const verdictDistribution = [
      { name: 'Worth Reading', value: worthReadingCount, color: '#10b981' },
      { name: 'Read with Caution', value: cautionCount, color: '#f59e0b' },
      { name: 'Skip', value: skippedCount, color: '#ef4444' },
    ];

    // Topic breakdown with relevance
    const topicBreakdown = Object.entries(topicCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 6)
      .map(([topic, count]) => ({
        topic,
        count,
        relevance: Math.round(
          analyses
            .filter(a => a.topics.includes(topic))
            .reduce((acc, a) => acc + a.importanceScore, 0) /
            analyses.filter(a => a.topics.includes(topic)).length * 10
        ),
      }));

    // Smart insights
    const insights: string[] = [];
    if (timeSaved > 0) {
      insights.push(`⏳ You saved ${timeSaved} minutes by skipping ${skippedCount} low-value articles.`);
    }
    if (avgBiasScore > 60) {
      insights.push(`⚠️ ${Math.round((biasDistribution[2].value / totalAnalyzed) * 100)}% of today's content is highly biased. Consider diversifying your sources.`);
    }
    if (worthReadingCount === 0) {
      insights.push(`🧘 Low relevance day — none of today's articles matched your goals closely. Try refining your profile.`);
    } else {
      insights.push(`✅ ${worthReadingCount} article${worthReadingCount > 1 ? 's' : ''} worth reading today — focused on what matters.`);
    }
    if (doomscrollAlerts > 0) {
      insights.push(`🚨 ${doomscrollAlerts} doomscroll trigger${doomscrollAlerts > 1 ? 's' : ''} detected. Protect your mental energy.`);
    }
    if (topTopics[0]) {
      insights.push(`📚 Your top topic today: ${topTopics[0].name} (${topTopics[0].percentage}% of content consumed).`);
    }

    const report: DailyReport = {
      date: new Date().toISOString().split('T')[0],
      totalAnalyzed,
      timeSaved,
      skippedCount,
      worthReadingCount,
      cautionCount,
      doomscrollAlerts,
      topTopics,
      avgBiasScore,
      avgImportanceScore,
      mostRelevantArticle,
      insights,
      biasDistribution,
      verdictDistribution,
      topicBreakdown,
    };

    return NextResponse.json(report);
  } catch (error) {
    console.error('Report generation error:', error);
    return NextResponse.json({ error: 'Report generation failed.' }, { status: 500 });
  }
}
