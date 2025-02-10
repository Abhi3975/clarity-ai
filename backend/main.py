from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

from routes.analyze import router as analyze_router
from routes.report import router as report_router
from routes.profile import router as profile_router

app = FastAPI(
    title="ClarityAI API",
    version="1.0.0",
    docs_url="/docs",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(analyze_router, prefix="/api", tags=["Analysis"])
app.include_router(report_router, prefix="/api", tags=["Reports"])
app.include_router(profile_router, prefix="/api", tags=["Profile"])


@app.get("/")
async def root():
    return {"service": "ClarityAI API", "version": "1.0.0", "status": "operational"}


@app.get("/health")
async def health():
    return {"status": "healthy"}


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
