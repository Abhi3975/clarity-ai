from fastapi import APIRouter, HTTPException
from services.analyzer import analyze_content
from services.scraper import scrape_url

router = APIRouter()


@router.post("/analyze")
async def analyze(request: dict):
    content = request.get("text","").strip()
    url = request.get("url")
    goals = request.get("user_goals",[])
    interests = request.get("user_interests",[])

    if url and len(content) < 500:
        try:
            _, scraped = await scrape_url(url)
            if len(scraped) > len(content):
                content = scraped
        except:
            pass

    if len(content) < 50:
        raise HTTPException(status_code=400, detail="Not enough text to analyze.")

    return await analyze_content(content, url, goals, interests)


@router.post("/analyze/url")
async def analyze_from_url(request: dict):
    url = request.get("url","")
    goals = request.get("user_goals",[])
    interests = request.get("user_interests",[])
    try:
        _, text = await scrape_url(url)
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))
    if len(text) < 50:
        raise HTTPException(status_code=422, detail="Could not extract enough content.")
    return await analyze_content(text, url, goals, interests)
