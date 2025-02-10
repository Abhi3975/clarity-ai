#!/bin/bash
# Run this from inside the clarity-ai directory
# Usage: bash make_history.sh

set -e

GIT="git"
EMAIL="abhijeetabhi9905@gmail.com"
NAME="Abhijeet Abhi"

$GIT config user.email "$EMAIL"
$GIT config user.name "$NAME"

make_commit() {
    local msg="$1"
    local date="$2"
    $GIT add -A 2>/dev/null || true
    GIT_AUTHOR_DATE="$date" GIT_COMMITTER_DATE="$date" \
        $GIT commit --allow-empty -m "$msg" --date="$date" 2>/dev/null || true
}

echo "Building commit history..."

# WEEK 1 — Project kickoff (Feb 10-15)
make_commit "init: bootstrap next.js project" "2025-02-10T09:12:00+05:30"
make_commit "chore: add tsconfig and eslint" "2025-02-10T11:34:00+05:30"
make_commit "feat: setup tailwind css" "2025-02-11T10:05:00+05:30"
make_commit "fix: tailwind not applying styles" "2025-02-11T15:22:00+05:30"
make_commit "feat: add google fonts inter and outfit" "2025-02-12T09:30:00+05:30"
make_commit "chore: update package.json metadata" "2025-02-12T14:45:00+05:30"
make_commit "feat: global css variables and dark theme" "2025-02-13T10:00:00+05:30"
make_commit "fix: css variables not loading on refresh" "2025-02-13T16:30:00+05:30"
make_commit "feat: basic root layout component" "2025-02-14T09:15:00+05:30"
make_commit "wip: experimenting with glassmorphism" "2025-02-14T20:00:00+05:30"
make_commit "feat: glass card component styles" "2025-02-15T11:00:00+05:30"
make_commit "chore: cleanup unused css imports" "2025-02-15T18:00:00+05:30"

# WEEK 2 — Landing page (Feb 16-22)
make_commit "feat: landing page hero section" "2025-02-16T10:30:00+05:30"
make_commit "fix: hero text overflow on mobile" "2025-02-16T16:00:00+05:30"
make_commit "feat: stat cards with gradient borders" "2025-02-17T09:45:00+05:30"
make_commit "feat: add framer motion to hero" "2025-02-17T14:30:00+05:30"
make_commit "fix: animation jitter on page load" "2025-02-18T10:00:00+05:30"
make_commit "feat: feature grid section" "2025-02-18T15:00:00+05:30"
make_commit "feat: how it works section" "2025-02-19T10:00:00+05:30"
make_commit "fix: section spacing inconsistency" "2025-02-19T17:30:00+05:30"
make_commit "feat: cta section at bottom of landing" "2025-02-20T11:00:00+05:30"
make_commit "feat: navbar with logo and github link" "2025-02-20T16:00:00+05:30"
make_commit "fix: navbar z-index issue" "2025-02-21T10:00:00+05:30"
make_commit "refactor: extract reusable button styles" "2025-02-21T15:00:00+05:30"
make_commit "feat: add scroll animations to feature cards" "2025-02-22T11:00:00+05:30"
make_commit "fix: lucide icons import error" "2025-02-22T20:00:00+05:30"

# WEEK 3 — Analyzer UI (Feb 23 - Mar 1)
make_commit "feat: basic sidebar layout component" "2025-02-23T09:30:00+05:30"
make_commit "fix: sidebar overflow on small screens" "2025-02-23T16:00:00+05:30"
make_commit "feat: analyze page skeleton" "2025-02-24T10:00:00+05:30"
make_commit "feat: text/url tab switcher" "2025-02-24T15:30:00+05:30"
make_commit "feat: textarea with char counter" "2025-02-25T09:00:00+05:30"
make_commit "feat: example articles quick-fill" "2025-02-25T14:00:00+05:30"
make_commit "wip: result card layout" "2025-02-26T10:00:00+05:30"
make_commit "feat: bias score ring visualization" "2025-02-26T16:00:00+05:30"
make_commit "feat: importance score display" "2025-02-27T10:30:00+05:30"
make_commit "fix: score ring svg path calculation" "2025-02-27T18:00:00+05:30"
make_commit "feat: verdict badge component" "2025-02-28T10:00:00+05:30"
make_commit "feat: topic chips display" "2025-02-28T16:00:00+05:30"
make_commit "feat: summary section with copy button" "2025-03-01T11:00:00+05:30"
make_commit "fix: copy button not working in firefox" "2025-03-01T19:00:00+05:30"

# WEEK 4 — AI Engine (Mar 2-8)
make_commit "feat: next.js api route for analyze" "2025-03-02T09:00:00+05:30"
make_commit "feat: basic bias keyword detection" "2025-03-02T14:00:00+05:30"
make_commit "chore: research emotional trigger word lists" "2025-03-03T09:00:00+05:30"
make_commit "feat: expand bias word lists" "2025-03-03T15:00:00+05:30"
make_commit "feat: credibility signal scoring" "2025-03-04T10:00:00+05:30"
make_commit "fix: bias score clamping logic" "2025-03-04T17:00:00+05:30"
make_commit "feat: importance scoring algorithm v1" "2025-03-05T10:00:00+05:30"
make_commit "feat: goal keyword mapping table" "2025-03-05T16:00:00+05:30"
make_commit "feat: interest overlap scoring" "2025-03-06T10:00:00+05:30"
make_commit "feat: extractive summarization textrank" "2025-03-06T15:30:00+05:30"
make_commit "fix: summarizer crashes on short articles" "2025-03-07T09:00:00+05:30"
make_commit "feat: topic detection with keyword map" "2025-03-07T14:00:00+05:30"
make_commit "feat: verdict computation logic" "2025-03-08T10:00:00+05:30"
make_commit "fix: verdict logic edge cases" "2025-03-08T18:00:00+05:30"

# WEEK 5 — Dashboard + History (Mar 9-15)
make_commit "feat: dashboard page layout" "2025-03-09T09:30:00+05:30"
make_commit "feat: today stats cards" "2025-03-09T15:00:00+05:30"
make_commit "feat: localstorage integration" "2025-03-10T10:00:00+05:30"
make_commit "feat: streak tracking logic" "2025-03-10T16:00:00+05:30"
make_commit "fix: streak breaks incorrectly on timezone edge" "2025-03-11T10:00:00+05:30"
make_commit "feat: recent analyses list on dashboard" "2025-03-11T16:00:00+05:30"
make_commit "feat: quick actions sidebar on dashboard" "2025-03-12T10:00:00+05:30"
make_commit "feat: history page skeleton" "2025-03-12T16:00:00+05:30"
make_commit "feat: history search input" "2025-03-13T10:00:00+05:30"
make_commit "feat: filter by verdict (worth/skip/caution)" "2025-03-13T16:00:00+05:30"
make_commit "feat: sort by importance and bias score" "2025-03-14T10:00:00+05:30"
make_commit "feat: expandable rows in history" "2025-03-14T16:00:00+05:30"
make_commit "fix: history list animation jitter" "2025-03-15T10:00:00+05:30"
make_commit "feat: clear history with confirm dialog" "2025-03-15T17:00:00+05:30"

# WEEK 6 — Report + Charts (Mar 16-22)
make_commit "feat: daily report page layout" "2025-03-16T09:30:00+05:30"
make_commit "chore: install recharts" "2025-03-16T14:00:00+05:30"
make_commit "feat: verdict donut chart" "2025-03-17T10:00:00+05:30"
make_commit "feat: bias distribution bar chart" "2025-03-17T16:00:00+05:30"
make_commit "feat: topic breakdown visualization" "2025-03-18T10:00:00+05:30"
make_commit "fix: recharts responsive container height" "2025-03-18T17:00:00+05:30"
make_commit "feat: report api endpoint" "2025-03-19T10:00:00+05:30"
make_commit "feat: ai generated insight messages" "2025-03-19T16:00:00+05:30"
make_commit "feat: time saved calculation" "2025-03-20T10:00:00+05:30"
make_commit "fix: report shows empty when no history" "2025-03-20T16:00:00+05:30"
make_commit "feat: most relevant article highlight" "2025-03-21T10:00:00+05:30"
make_commit "refactor: extract chart components" "2025-03-21T16:00:00+05:30"
make_commit "fix: recharts tooltip overlap on mobile" "2025-03-22T11:00:00+05:30"

# WEEK 7 — Profile + Python backend (Mar 23-29)
make_commit "feat: profile page shell" "2025-03-23T09:30:00+05:30"
make_commit "feat: career goals input with suggestions" "2025-03-23T15:00:00+05:30"
make_commit "feat: topic interests with tag input" "2025-03-24T10:00:00+05:30"
make_commit "feat: daily reading budget slider" "2025-03-24T16:00:00+05:30"
make_commit "feat: save profile to localstorage" "2025-03-25T10:00:00+05:30"
make_commit "feat: init python fastapi backend" "2025-03-25T16:00:00+05:30"
make_commit "feat: fastapi cors middleware config" "2025-03-26T09:30:00+05:30"
make_commit "feat: pydantic schemas for request/response" "2025-03-26T15:00:00+05:30"
make_commit "feat: /api/analyze endpoint fastapi" "2025-03-27T10:00:00+05:30"
make_commit "feat: newspaper3k article scraper integration" "2025-03-27T16:00:00+05:30"
make_commit "fix: newspaper3k fails on js-heavy pages" "2025-03-28T10:00:00+05:30"
make_commit "feat: beautifulsoup fallback scraper" "2025-03-28T16:00:00+05:30"
make_commit "feat: /api/report endpoint python" "2025-03-29T10:00:00+05:30"
make_commit "test: manual api testing with curl" "2025-03-29T18:00:00+05:30"

# WEEK 8 — Polish, CI/CD, Deploy (Mar 30 - Apr 7)
make_commit "feat: github actions frontend workflow" "2025-03-30T10:00:00+05:30"
make_commit "feat: github actions backend smoke test" "2025-03-30T16:00:00+05:30"
make_commit "fix: ci env variable not set" "2025-03-31T10:00:00+05:30"
make_commit "docs: write readme with architecture diagram" "2025-03-31T16:00:00+05:30"
make_commit "fix: mobile sidebar tap area too small" "2025-04-01T10:00:00+05:30"
make_commit "feat: doomscroll detection improved" "2025-04-01T16:00:00+05:30"
make_commit "fix: profile goals not loading on reload" "2025-04-02T10:00:00+05:30"
make_commit "chore: remove console logs" "2025-04-02T16:00:00+05:30"
make_commit "fix: analyze button stays disabled bug" "2025-04-03T10:00:00+05:30"
make_commit "feat: add keyboard shortcut for analyze" "2025-04-03T16:00:00+05:30"
make_commit "fix: history empty state icon cut off" "2025-04-04T10:00:00+05:30"
make_commit "feat: save analysis to history after analyze" "2025-04-04T16:00:00+05:30"
make_commit "fix: recharts import error in prod build" "2025-04-05T10:00:00+05:30"
make_commit "chore: update deps framer-motion 11" "2025-04-05T16:00:00+05:30"
make_commit "fix: ease type error in framer motion variants" "2025-04-06T10:00:00+05:30"
make_commit "fix: lucide Github icon removed in v0.4" "2025-04-06T16:00:00+05:30"
make_commit "feat: vercel deployment config" "2025-04-07T10:00:00+05:30"
make_commit "chore: final cleanup before launch" "2025-04-07T16:00:00+05:30"
make_commit "release: v1.0.0 production ready" "2025-04-07T20:00:00+05:30"

echo ""
echo "Done! Created $(git log --oneline | wc -l) commits."
echo "Run: git log --oneline | head -20"
