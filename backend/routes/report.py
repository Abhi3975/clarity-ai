from fastapi import APIRouter, HTTPException
from collections import Counter

router = APIRouter()


@router.post("/report")
async def generate_report(body: dict):
    analyses = body.get("analyses",[])
    if not analyses:
        raise HTTPException(status_code=400, detail="No data provided.")

    total = len(analyses)
    skip = sum(1 for a in analyses if a.get("verdict") == "skip")
    worth = sum(1 for a in analyses if a.get("verdict") == "worth_reading")
    caution = sum(1 for a in analyses if a.get("verdict") == "read_with_caution")
    doom = sum(1 for a in analyses if a.get("is_doomscroll") or a.get("isDoomscroll"))
    saved = sum(a.get("read_time", a.get("readTime",0)) for a in analyses if a.get("verdict") == "skip")
    avg_bias = round(sum(a.get("bias_score", a.get("biasScore",50)) for a in analyses) / total, 1)
    avg_imp = round(sum(a.get("importance_score", a.get("importanceScore",5)) for a in analyses) / total, 1)

    tc: Counter = Counter()
    for a in analyses:
        for t in (a.get("topics") or []):
            tc[t] += 1

    best = max(analyses, key=lambda a: a.get("importance_score", a.get("importanceScore",0)))

    insights = []
    if saved:
        insights.append(f"⏳ You saved {saved} minutes by skipping {skip} low-value articles.")
    if avg_bias > 60:
        insights.append(f"⚠️ High average bias today ({avg_bias}/100). Diversify your sources.")
    if worth > 0:
        insights.append(f"✅ {worth} article{'s' if worth > 1 else ''} worth reading today.")
    if doom > 0:
        insights.append(f"🚨 {doom} doomscroll trigger{'s' if doom > 1 else ''} caught.")
    if tc:
        top = tc.most_common(1)[0]
        pct = round(top[1] / total * 100)
        insights.append(f"📚 Top topic: {top[0]} ({pct}% of your feed today).")

    return {
        "date": __import__("datetime").date.today().isoformat(),
        "totalAnalyzed": total,
        "timeSaved": saved,
        "skippedCount": skip,
        "worthReadingCount": worth,
        "cautionCount": caution,
        "doomscrollAlerts": doom,
        "topTopics": [{"name": k,"count": v,"percentage": round(v/total*100)} for k,v in tc.most_common(5)],
        "avgBiasScore": avg_bias,
        "avgImportanceScore": avg_imp,
        "mostRelevantArticle": best.get("title","Unknown"),
        "insights": insights,
        "biasDistribution": [
            {"label":"Low (0-34)","value":sum(1 for a in analyses if a.get("bias_score",a.get("biasScore",50)) < 35),"color":"#10b981"},
            {"label":"Moderate (35-64)","value":sum(1 for a in analyses if 35 <= a.get("bias_score",a.get("biasScore",50)) < 65),"color":"#f59e0b"},
            {"label":"High (65+)","value":sum(1 for a in analyses if a.get("bias_score",a.get("biasScore",50)) >= 65),"color":"#ef4444"},
        ],
        "verdictDistribution": [
            {"name":"Worth Reading","value":worth,"color":"#10b981"},
            {"name":"Read with Caution","value":caution,"color":"#f59e0b"},
            {"name":"Skip","value":skip,"color":"#ef4444"},
        ],
        "topicBreakdown": [{"topic": k,"count": v,"relevance": 70} for k,v in tc.most_common(6)],
    }
