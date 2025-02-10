import re
import math
import time
import uuid
from typing import List, Tuple, Dict, Optional
from collections import Counter
from datetime import datetime

_hf_classifier = None


def _get_classifier():
    global _hf_classifier
    if _hf_classifier is None:
        try:
            from transformers import pipeline
            _hf_classifier = pipeline(
                "zero-shot-classification",
                model="facebook/bart-large-mnli",
                device=-1
            )
        except:
            _hf_classifier = None
    return _hf_classifier


STOP = frozenset([
    "the","a","an","and","or","but","in","on","at","to","of","for","is","are",
    "was","were","with","from","by","it","this","that","as","has","have","had",
    "be","not","its","you","we","they","he","she","his","her","their","our",
    "will","would","could","should","may","might","can","do","did","does","been",
    "also","very","more","such","than","then","when","where","which","who","all",
    "any","if","so","up","out","about","there","into","after",
])


def est_read_time(text):
    return max(1, round(len(text.strip().split()) / 200))


def get_title(text, url=None):
    lines = [l.strip() for l in text.split("\n") if l.strip()]
    if lines and len(lines[0]) < 200:
        return lines[0]
    if url:
        try:
            from urllib.parse import urlparse
            path = urlparse(url).path
            parts = [p for p in path.split("/") if p]
            if parts:
                return parts[-1].replace("-"," ").replace("_"," ").title()
        except:
            pass
    return "Article Analysis"


def _sent_score(sent, freq):
    words = [w.lower() for w in re.findall(r"\w+", sent) if w.lower() not in STOP]
    if not words:
        return 0.0
    return sum(freq.get(w,0) for w in words) / len(words)


def summarize(text, n=3):
    clean = re.sub(r"\n+", " ", text).strip()
    sents = re.split(r"(?<=[.!?])\s+", clean)
    sents = [s.strip() for s in sents if len(s.strip()) > 40]
    if not sents:
        return "Could not extract a summary from this content."
    if len(sents) <= n:
        return " ".join(sents)
    words = re.findall(r"\w+", clean.lower())
    freq = Counter(w for w in words if w not in STOP and len(w) > 3)
    scored = [(i, s, _sent_score(s, freq)) for i,s in enumerate(sents)]
    top = sorted(sorted(scored, key=lambda x: x[2], reverse=True)[:n], key=lambda x: x[0])
    return " ".join(s for _,s,_ in top)


EMOTIONAL = [
    "outrage","shocking","explosive","devastating","crisis","dangerous","urgent",
    "alarming","catastrophic","terrifying","nightmare","disaster","chaos","collapse",
    "must","wake up","everyone knows","proven fact","they are hiding","exposed",
    "bombshell","leaked","secret","scandal","unprecedented","undeniable","absolutely",
]

SENSATIONAL = [
    "breaking!","breaking news","exclusive","shocking truth","finally revealed",
    "never before","always","never","everybody","nobody knows",
    "mainstream media won't","wake up",
]

CREDIBLE = [
    "according to","research shows","study found","data indicates","experts say",
    "reported","analysis suggests","on the other hand","meanwhile","however",
    "published in","peer-reviewed","cited","statistically","margin of error",
]

POS_WORDS = ["success","growth","improve","achieve","win","benefit","opportunity","advance"]
NEG_WORDS = ["fail","loss","decline","problem","risk","threat","danger","crash","collapse"]


def check_bias(text):
    t = text.lower()
    emo = sum(1 for w in EMOTIONAL if w in t)
    sen = sum(1 for w in SENSATIONAL if w in t)
    cred = sum(1 for w in CREDIBLE if w in t)

    score = 50.0
    score += emo * 7.0
    score += sen * 5.0
    score -= cred * 5.5
    score = max(5.0, min(100.0, score))

    pos = sum(1 for w in POS_WORDS if w in t)
    neg = sum(1 for w in NEG_WORDS if w in t)

    if score > 65:
        tone = "Emotionally Charged"
    elif pos > neg + 1:
        tone = "Positive"
    elif neg > pos + 1:
        tone = "Negative"
    else:
        tone = "Neutral"

    if score < 35:
        label = "Low Bias"
        expl = "Content uses neutral, fact-based language. Safe to trust at face value."
    elif score < 65:
        label = "Moderate Bias"
        expl = "Some emotional language detected. Verify key claims."
    else:
        label = "High Bias"
        expl = "Highly emotional language found. Cross-check before forming opinions."

    return {"score": round(score,1), "label": label, "explanation": expl, "tone": tone}


TOPIC_KW = {
    "AI & Machine Learning": ["artificial intelligence","machine learning","deep learning",
        "neural network","gpt","llm","chatgpt","openai","transformer","pytorch","bert"],
    "Finance & Markets": ["stock","market","economy","inflation","invest","crypto","bitcoin",
        "finance","dollar","bank","fund","portfolio","dividend","ipo","nasdaq"],
    "Technology": ["software","app","startup","tech","digital","algorithm","data","cloud",
        "cybersecurity","programming","developer","silicon valley"],
    "Health & Wellness": ["health","medical","disease","vaccine","mental health","fitness",
        "diet","doctor","hospital","wellness","medicine","clinical"],
    "Politics": ["government","election","president","congress","policy","democrat",
        "republican","vote","senate","parliament","legislation","geopolitics"],
    "Climate & Environment": ["climate","carbon","emission","renewable","solar","environment",
        "fossil fuel","global warming","sustainability","net zero"],
    "Career & Education": ["job","career","hiring","resume","interview","course","degree",
        "salary","skill","university","scholarship"],
    "Science": ["research","study","scientist","discovery","experiment","nasa","space",
        "quantum","biology","physics","chemistry","genome"],
    "Business & Startups": ["startup","revenue","ceo","acquisition","venture capital",
        "entrepreneur","product","saas","unicorn","funding round"],
    "Entertainment": ["movie","music","celebrity","netflix","gaming","sport","award",
        "viral","actor","singer","album","trailer"],
}


def _detect_topics_local(text):
    t = text.lower()
    scores = {}
    for topic, kws in TOPIC_KW.items():
        sc = sum(1 for k in kws if k in t)
        if sc > 0:
            scores[topic] = sc
    if not scores:
        return ["General News"]
    return [tp for tp,_ in sorted(scores.items(), key=lambda x: x[1], reverse=True)[:3]]


async def detect_topics(text):
    clf = _get_classifier()
    if clf:
        try:
            res = clf(text[:512], list(TOPIC_KW.keys()), multi_label=True)
            hits = [lb for lb,sc in zip(res["labels"], res["scores"]) if sc > 0.3]
            return hits[:3] if hits else ["General News"]
        except:
            pass
    return _detect_topics_local(text)


GOAL_KW = {
    "ai engineer": ["ai","machine learning","neural","gpt","model","deep learning","python",
        "pytorch","tensorflow","nlp","llm"],
    "software engineer": ["programming","software","algorithm","backend","frontend","api",
        "developer","code","system design"],
    "data scientist": ["data","analysis","statistics","pandas","visualization","sql",
        "machine learning","jupyter","sklearn"],
    "finance": ["stock","market","invest","economy","portfolio","dividend","trading","fund","equity"],
    "entrepreneur": ["startup","venture","founder","business model","funding","product",
        "market fit","scale"],
    "health": ["health","fitness","mental health","nutrition","wellness","exercise","medicine"],
    "cybersecurity": ["security","hack","vulnerability","encryption","cyber","malware",
        "breach","firewall","zero-day"],
    "student": ["education","learning","course","university","research","scholarship","study","exam"],
    "product manager": ["product","roadmap","user research","sprint","agile","feature","kpi","stakeholder"],
    "devops": ["kubernetes","docker","ci/cd","devops","infrastructure","terraform","cloud","aws","azure"],
}


def score_importance(text, topics, goals, interests):
    t = text.lower()
    score = 5.0
    matched = []

    for goal in goals:
        gl = goal.lower()
        for key, kws in GOAL_KW.items():
            if key in gl or gl.split()[0] in key:
                hits = sum(1 for k in kws if k in t)
                if hits > 0:
                    score += hits * 0.7
                    if goal not in matched:
                        matched.append(goal)

    for interest in interests:
        if any(interest.lower() in tp.lower() for tp in topics) or interest.lower() in t:
            score += 1.2

    if any(w in t for w in ["today","just announced","breaking","new study","latest","just released"]):
        score += 0.5
    if any(w in t for w in ["how to","you can","steps to","guide","learn","tutorial","tips"]):
        score += 0.4

    score = max(1.0, min(10.0, round(score, 1)))

    if matched:
        reason = f"Directly relevant to your goal: {matched[0]}. Topics: {', '.join(topics)}."
    elif score >= 7:
        base = interests[0] if interests else (topics[0] if topics else "your interests")
        reason = f"Closely matches your interest in {base}."
    elif score >= 5:
        reason = "Moderately relevant. Worth a quick scan."
    else:
        reason = "Low relevance to your goals. Safe to skip."

    return {"score": score, "reason": reason, "goal_match": matched}


def get_insights(text, topics):
    insights = []
    t = text.lower()
    if re.search(r"\$[\d,]+[bm]illion|\d+\s*billion|\d+\s*million", t):
        insights.append("Contains significant financial figures worth noting.")
    if any(w in t for w in ["study","research","found","published"]):
        insights.append("Grounded in research or scientific data.")
    if any(w in t for w in ["first time","breakthrough","revolutionary"]):
        insights.append("Claims a novel development — verify independently.")
    if any(w in t for w in ["warning","risk","danger","caution","threat"]):
        insights.append("Contains risk warnings — keep perspective.")
    if any(w in t for w in ["expert","professor","ceo","official"]):
        insights.append("Includes expert or official commentary.")
    if "AI & Machine Learning" in topics:
        insights.append("AI/ML topic — track for career-relevant developments.")
    return insights[:4]


def doomscroll_check(bias, topics, imp):
    low_val = {"Entertainment","Politics"}
    return bias >= 72 and len(set(topics) & low_val) > 0 and imp < 5


def get_verdict(imp, bias, doom):
    if doom:
        return "skip","🚫 Doomscroll alert — emotionally draining, low-value. Skip it."
    if imp >= 7.0 and bias < 60:
        return "worth_reading","✅ Worth Reading — high relevance with balanced reporting."
    if imp >= 5.0 and bias < 75:
        return "read_with_caution","⚠️ Read with Caution — moderately relevant but contains bias."
    if bias >= 75:
        return "read_with_caution","⚠️ High Bias Detected — verify before forming opinions."
    return "skip","🧠 Safe to Skip — low relevance to your current goals."


async def analyze_content(text, url, goals, interests):
    t0 = time.time() * 1000
    topics = await detect_topics(text)
    bias = check_bias(text)
    imp = score_importance(text, topics, goals, interests)
    summary = summarize(text)
    read_time = est_read_time(text)
    insights = get_insights(text, topics)
    doom = doomscroll_check(bias["score"], topics, imp["score"])
    verdict, vmsg = get_verdict(imp["score"], bias["score"], doom)
    ms = int(time.time() * 1000 - t0)
    return {
        "id": str(uuid.uuid4()),
        "title": get_title(text, url),
        "url": url,
        "content_preview": text[:500] + ("..." if len(text) > 500 else ""),
        "summary": summary,
        "read_time": read_time,
        "bias_score": bias["score"],
        "bias_label": bias["label"],
        "bias_explanation": bias["explanation"],
        "tone": bias["tone"],
        "importance_score": imp["score"],
        "importance_reason": imp["reason"],
        "topics": topics,
        "verdict": verdict,
        "verdict_message": vmsg,
        "is_doomscroll": doom,
        "key_insights": insights,
        "goal_match": imp["goal_match"],
        "timestamp": datetime.utcnow().isoformat(),
        "processing_time_ms": ms,
    }
