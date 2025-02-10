"""
Pydantic schemas for ClarityAI API
"""
from pydantic import BaseModel, Field
from typing import List, Optional
from enum import Enum
from datetime import datetime


class VerdictType(str, Enum):
    WORTH_READING = "worth_reading"
    SKIP = "skip"
    READ_WITH_CAUTION = "read_with_caution"


class AnalyzeRequest(BaseModel):
    text: str = Field(..., min_length=50, description="Article text to analyze")
    url: Optional[str] = Field(None, description="Source URL")
    user_goals: List[str] = Field(default=[], description="User career goals")
    user_interests: List[str] = Field(default=[], description="User topic interests")

    class Config:
        json_schema_extra = {
            "example": {
                "text": "OpenAI has unveiled GPT-5, a revolutionary AI model...",
                "url": "https://example.com/article",
                "user_goals": ["AI Engineer", "Machine Learning"],
                "user_interests": ["Artificial Intelligence", "Technology"]
            }
        }


class AnalysisResult(BaseModel):
    id: str
    title: str
    url: Optional[str] = None
    content_preview: str
    summary: str
    read_time: int = Field(description="Estimated read time in minutes")
    bias_score: float = Field(ge=0, le=100, description="Bias score 0-100")
    bias_label: str
    bias_explanation: str
    tone: str
    importance_score: float = Field(ge=0, le=10, description="Importance/relevance score 0-10")
    importance_reason: str
    topics: List[str]
    verdict: VerdictType
    verdict_message: str
    is_doomscroll: bool
    key_insights: List[str]
    goal_match: List[str]
    timestamp: datetime
    processing_time_ms: int


class ReportRequest(BaseModel):
    analyses: List[dict] = Field(..., description="List of analysis results")


class TopicStat(BaseModel):
    name: str
    count: int
    percentage: float


class BiasDistItem(BaseModel):
    label: str
    value: int
    color: str


class DailyReport(BaseModel):
    date: str
    total_analyzed: int
    time_saved: int
    skipped_count: int
    worth_reading_count: int
    caution_count: int
    doomscroll_alerts: int
    top_topics: List[TopicStat]
    avg_bias_score: float
    avg_importance_score: float
    most_relevant_article: Optional[str]
    insights: List[str]
    bias_distribution: List[BiasDistItem]
