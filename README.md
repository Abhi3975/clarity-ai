<div align="center">

<img src="https://img.shields.io/badge/ClarityAI-Personal%20Truth%20Engine-7c3aed?style=for-the-badge&logo=brain&logoColor=white" />

# 🧠 ClarityAI — Personal Truth Engine

### *The AI that decides what you should pay attention to*

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110-009688?style=flat-square&logo=fastapi)](https://fastapi.tiangolo.com)
[![Python](https://img.shields.io/badge/Python-3.11-3776AB?style=flat-square&logo=python&logoColor=white)](https://python.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![HuggingFace](https://img.shields.io/badge/🤗%20HuggingFace-BERT%2FBART-yellow?style=flat-square)](https://huggingface.co)
[![License: MIT](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)
[![Deploy: Vercel](https://img.shields.io/badge/Deploy-Vercel-black?style=flat-square&logo=vercel)](https://vercel.com)
[![CI/CD](https://img.shields.io/badge/CI%2FCD-GitHub%20Actions-2088FF?style=flat-square&logo=github-actions)](https://github.com/Abhi3975/clarity-ai/actions)

<br />

> **"I built a personal AI system that reduces information overload by filtering, summarizing, and ranking content based on relevance, bias, and user goals."**

<br />

**[🚀 Live Demo](https://clarity-ai.vercel.app)** · **[🐍 Backend API](https://clarity-ai-backend.railway.app/docs)** · **[📊 Report Bug](https://github.com/Abhi3975/clarity-ai/issues)**

</div>

---

## 🌍 The Problem (Why This Exists)

In 2026, the biggest crisis isn't **lack of information** — it's **information overload with no clarity filter**.

The average person consumes **74GB of information per day**, yet feels:
- ❌ Overwhelmed and unable to focus
- ❌ Unable to separate signal from noise
- ❌ Caught in doomscrolling loops that drain mental energy
- ❌ Making decisions based on biased or irrelevant content

**ClarityAI solves this** — not with another recommendation algorithm, but with a *personal intelligence filter* that answers:

> **"What should I pay attention to — and why?"**

---

## 🎯 What ClarityAI Does

Unlike fake-news detectors or recommendation engines, ClarityAI operates across 6 analytical dimensions:

| Dimension | What It Measures | Output |
|-----------|-----------------|--------|
| 🧠 **AI Summarization** | Key information density | 3-sentence TL;DR |
| ⚖️ **Bias Detection** | Emotional manipulation, sensationalism | Score 0–100 + label |
| 🎯 **Importance Scoring** | Goal-relevance to YOUR profile | Score 1–10 |
| 🏷️ **Topic Classification** | Content category | AI/ML, Finance, Health... |
| 🚨 **Doomscroll Detection** | Mental energy drain risk | Flag + warning |
| ⏱️ **Read Time Estimation** | Time cost before you start | Minutes |

### The Magic Output

Instead of dumping raw information, ClarityAI gives you a **verdict**:

```
┌─────────────────────────────────────────────────────────────────┐
│  ✅ Worth Reading                                Importance: 9.2 │
│                                                                  │
│  📰 "OpenAI releases GPT-5 with advanced reasoning"             │
│  🏷️  AI & Machine Learning · Technology                         │
│                                                                  │
│  🧠 SUMMARY                                                      │
│  "OpenAI unveiled GPT-5 achieving 92% on MMLU benchmark,        │
│   outperforming predecessors in reasoning and code generation.   │
│   Available via API with built-in safety measures."             │
│                                                                  │
│  📊 METRICS                                                      │
│  Bias: 22/100 (Low) · Tone: Neutral · ⏱️ 4 min read            │
│                                                                  │
│  🎯 WHY IT MATTERS                                               │
│  "Directly relevant to your AI Engineer career goal. Contains   │
│   ML and NLP insights critical for interview preparation."       │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🏗️ System Architecture

```
┌──────────────────────────────────────────────────────────────────────┐
│                          ClarityAI System                            │
│                                                                      │
│   ┌─────────────────────┐         ┌──────────────────────────────┐  │
│   │   FRONTEND           │         │   BACKEND (Python FastAPI)   │  │
│   │   Next.js 14 (App   │ ──────► │                              │  │
│   │   Router + TS)       │  REST   │   /api/analyze               │  │
│   │                      │  API    │   /api/report                │  │
│   │   • Landing Page     │ ◄────── │   /api/profile               │  │
│   │   • AI Analyzer      │  JSON   │                              │  │
│   │   • Dashboard        │         │   Services:                  │  │
│   │   • Daily Report     │         │   ├── ArticleScraper         │  │
│   │   • History          │         │   ├── AIAnalyzer             │  │
│   │   • Profile Setup    │         │   ├── BiasDetector           │  │
│   │                      │         │   ├── ImportanceScorer       │  │
│   │   Vercel (CDN)       │         │   └── ReportGenerator        │  │
│   └─────────────────────┘         └──────────────┬───────────────┘  │
│                                                   │                  │
│                                    ┌──────────────▼───────────────┐  │
│                                    │        AI / ML Layer         │  │
│                                    │                              │  │
│                                    │   • HuggingFace BART-MNLI    │  │
│                                    │     (Zero-shot classification│  │
│                                    │      for bias + topics)      │  │
│                                    │   • TextRank Summarization   │  │
│                                    │   • TF-IDF Importance Model  │  │
│                                    │   • Rule-Based Heuristics    │  │
│                                    └──────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────┘
```

---

## ✨ Features

### 🔬 Core AI Pipeline
- **Extractive Summarization** — TextRank-inspired algorithm extracts the 3 most information-dense sentences
- **Bias Detection** — Multi-signal analysis: emotional trigger words, sensationalism score, credibility signal density
- **Zero-Shot Topic Classification** — `facebook/bart-large-mnli` classifies into 10 topic categories without fine-tuning
- **Goal-Relevance Scoring** — Custom TF-IDF weighted scoring against user-defined career objectives
- **Doomscroll Detection** — Correlation of high bias × low-value topics × importance deficiency

### 📊 Analytics & Insights
- **Daily Clarity Report** — Full breakdown with Recharts visualizations (donut, bar, radar charts)
- **Streak Tracking** — Gamified engagement to build healthy information habits
- **Topic Breakdown** — Visual representation of your information diet
- **AI-Generated Insights** — "Today you saved X hours by filtering Y articles"

### 🎯 Personalization
- Career goal configuration (AI Engineer, Data Scientist, Entrepreneur, etc.)
- Topic interest weighting
- Daily reading time budget
- History with search, filter, and sort

### 🛡️ Privacy-First
- No account required to use
- History stored locally in browser (localStorage)
- No tracking, no ads, no data sold

---

## 🖼️ Screenshots

| Landing Page | AI Analyzer |
|:---:|:---:|
| ![Landing](docs/screenshots/landing.png) | ![Analyzer](docs/screenshots/analyzer.png) |

| Daily Report | History |
|:---:|:---:|
| ![Report](docs/screenshots/report.png) | ![History](docs/screenshots/history.png) |

---

## 🚀 Getting Started

### Prerequisites
- Node.js >= 18
- Python >= 3.10
- npm or yarn

### Frontend Setup

```bash
# Clone the repository
git clone https://github.com/Abhi3975/clarity-ai.git
cd clarity-ai

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Backend Setup (Python FastAPI)

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start FastAPI server
uvicorn main:app --reload --port 8000
```

API docs available at [http://localhost:8000/docs](http://localhost:8000/docs)

### Environment Variables

```env
# Frontend (.env.local)
NEXT_PUBLIC_API_URL=http://localhost:8000

# Backend (.env)
HUGGINGFACE_API_KEY=your_key_here  # Optional — falls back to local inference
OPENAI_API_KEY=your_key_here       # Optional — for enhanced summarization
```

---

## 🧬 AI/ML Implementation Details

### Bias Detection Algorithm
```python
bias_score = 50.0  # neutral baseline
bias_score += emotional_trigger_count * 7.0    # e.g., "shocking", "outrage"
bias_score += sensationalism_count * 5.0        # e.g., "BREAKING", "EXPOSED"
bias_score -= credibility_signal_count * 5.5    # e.g., "according to research"
bias_score = clamp(bias_score, 5, 100)
```

### Importance Scoring
The importance scorer uses a multi-factor approach:
1. **Goal keyword matching** — Weighted match against user career keywords
2. **Interest topic overlap** — Topic classification cross-referenced with user interests
3. **Freshness signals** — "today", "just announced", "breaking" add small boosts
4. **Actionability signals** — "how to", "guide", "tutorial" increase relevance

### Topic Classification (Zero-Shot)
Uses `facebook/bart-large-mnli` with natural language hypothesis testing:
```python
result = classifier(
    text, 
    candidate_labels=["AI & Machine Learning", "Finance & Markets", ...],
    multi_label=True
)
# Returns: topics with confidence > 0.3
```

---

## 📁 Project Structure

```
clarity-ai/
├── src/                     # Next.js frontend
│   ├── app/
│   │   ├── page.tsx         # Landing page  
│   │   ├── analyze/         # AI Analyzer
│   │   ├── dashboard/       # Main dashboard
│   │   ├── report/          # Daily clarity report
│   │   ├── history/         # Analysis history
│   │   ├── profile/         # Goals & interests
│   │   └── api/             # Next.js API routes
│   │       ├── analyze/     # Core AI analysis
│   │       └── report/      # Report generation
│   └── components/
│       └── ui/AppLayout.tsx # Sidebar layout
│
├── backend/                 # Python FastAPI
│   ├── main.py              # App entry point
│   ├── routes/
│   │   ├── analyze.py       # /api/analyze
│   │   ├── report.py        # /api/report
│   │   └── profile.py       # /api/profile
│   ├── services/
│   │   ├── analyzer.py      # Core AI engine
│   │   └── scraper.py       # Article scraper
│   └── models/schemas.py    # Pydantic schemas
│
├── .github/
│   └── workflows/           # CI/CD pipelines
│       ├── frontend.yml     # Vercel deploy
│       └── backend.yml      # Railway deploy
│
└── README.md
```

---

## 🛠️ Tech Stack

### Frontend
| Tech | Purpose |
|------|---------|
| Next.js 14 (App Router) | SSR + client-side routing |
| TypeScript | Type safety |
| Tailwind CSS | Styling system |
| Framer Motion | Animations |
| Recharts | Data visualization |
| Lucide React | Icons |

### Backend & AI
| Tech | Purpose |
|------|---------|
| FastAPI | High-performance REST API |
| HuggingFace Transformers | BERT/BART zero-shot classification |
| newspaper3k | Article content extraction |
| BeautifulSoup4 | HTML parsing fallback |
| Pydantic v2 | Request/response validation |
| uvicorn | ASGI server |

### DevOps
| Tech | Purpose |
|------|---------|
| Vercel | Frontend hosting + CDN |
| Railway | Python backend hosting |
| GitHub Actions | CI/CD pipelines |

---

## 🔮 Roadmap

- [ ] **v1.1** — Browser extension for real-time filtering while browsing
- [ ] **v1.2** — RSS feed integration for automatic daily digest
- [ ] **v1.3** — MongoDB Atlas integration for cross-device sync
- [ ] **v1.4** — Mobile app (React Native)
- [ ] **v2.0** — Fine-tuned BERT model on labeled bias dataset
- [ ] **v2.1** — LLM-powered summarization with context awareness

---

## 🤝 Contributing

Contributions are welcome! Please read the [contributing guide](CONTRIBUTING.md) first.

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'feat: add your feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 📄 License

MIT License — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Built with 🧠 and ❤️ by [Abhijeet](https://github.com/Abhi3975)**

*ClarityAI — Because your attention is your most valuable resource.*

⭐ **Star this repo if it helped you!** ⭐

</div>
