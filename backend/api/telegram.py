from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import requests
import os

router = APIRouter()

class UserDetails(BaseModel):
    lichessId: str
    email: str

TELEGRAM_BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")
TELEGRAM_CHAT_ID = os.getenv("TELEGRAM_CHAT_ID")

@router.post("/send-details")
async def send_details(user_details: UserDetails):
    if not TELEGRAM_BOT_TOKEN or not TELEGRAM_CHAT_ID:
        raise HTTPException(status_code=500, detail="Telegram bot token or chat ID not set")

    message = f"Lichess ID: {user_details.lichessId}\nEmail: {user_details.email}"
    url = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage"
    payload = {
        "chat_id": TELEGRAM_CHAT_ID,
        "text": message
    }
    response = requests.post(url, json=payload)
    if not response.ok:
        raise HTTPException(status_code=500, detail="Failed to send message to Telegram")
    return {"message": "Details sent to Telegram"}