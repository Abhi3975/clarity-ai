from typing import Optional, Tuple


async def scrape_url(url: str) -> Tuple[str, str]:
    try:
        from newspaper import Article
        art = Article(url)
        art.download()
        art.parse()
        title = art.title or ""
        text = art.text or ""
        if len(text) > 200:
            return title, text
    except:
        pass

    try:
        import requests
        from bs4 import BeautifulSoup
        hdrs = {
            "User-Agent": "Mozilla/5.0 (compatible; ClarityAI/1.0)"
        }
        r = requests.get(url, headers=hdrs, timeout=10)
        r.raise_for_status()
        soup = BeautifulSoup(r.text, "html.parser")
        for tag in soup(["script","style","nav","footer","header","aside"]):
            tag.decompose()
        body = (
            soup.find("article") or
            soup.find("main") or
            soup.find(class_=lambda c: c and any(k in str(c).lower() for k in ["article","content","story","post"]))
        )
        target = body or soup.find("body") or soup
        title_tag = soup.find("title")
        title_text = title_tag.get_text(strip=True) if title_tag else ""
        text = target.get_text(separator=" ", strip=True)
        text = " ".join(text.split())
        return title_text, text[:10000]
    except Exception as e:
        raise ValueError(f"Could not extract content: {str(e)}")
