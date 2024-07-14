import httpx
import json
from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel
from .stockfish_analyzer import analyze_game
from .gpt_explainer import generate_explanation

router = APIRouter()

class AnalyzeRequest(BaseModel):
    username: str
    pgn: str

@router.get("/api/lichess/{username}")
async def get_lichess_games(username: str):
    url = f"https://lichess.org/api/games/user/{username}"
    headers = {"Accept": "application/x-ndjson"}
    params = {"pgnInJson": "true"}

    async with httpx.AsyncClient() as client:
        response = await client.get(url, headers=headers, params=params)
        
        if response.status_code != 200:
            raise HTTPException(status_code=response.status_code, detail="Error fetching games from Lichess")

        games = []
        async for line in response.aiter_lines():
            if line:
                games.append(json.loads(line))

    return games

@router.post("/api/analyze")
async def analyze_lichess_game(request: AnalyzeRequest):
    try:
        analysis = analyze_game(request.username, request.pgn)
        return analysis
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@router.post("/api/explain")
async def explain_game_endpoint(request: Request):
    body = await request.json()
    analysis = body.get('analysis')

    if not analysis:
        raise HTTPException(status_code=400, detail="Analysis report is required")

    try:
        explanation = await generate_explanation(analysis)
        return {"explanation": explanation}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get explanation from OpenAI: {str(e)}")