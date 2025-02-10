from fastapi import APIRouter

router = APIRouter()

@router.get("/profile/{user_id}")
async def get_profile(user_id: str):
    return {"user_id": user_id, "goals": [], "interests": [], "time_budget": 30}

@router.post("/profile/{user_id}")
async def save_profile(user_id: str, body: dict):
    # In a real deployment, persist to MongoDB Atlas
    return {"success": True, "user_id": user_id, **body}
