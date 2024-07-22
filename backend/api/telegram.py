import httpx
import os
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import logging

router = APIRouter()

class UserDetails(BaseModel):
    lichessId: str
    email: str

TELEGRAM_BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")
TELEGRAM_CHAT_ID = os.getenv("TELEGRAM_CHAT_ID")

@router.post("/api/send-details")
async def send_details(user_details: UserDetails):
    if not TELEGRAM_BOT_TOKEN or not TELEGRAM_CHAT_ID:
        logging.error("Telegram bot token or chat ID not set")
        raise HTTPException(status_code=500, detail="Telegram bot token or chat ID not set")

    message = f"Lichess ID: {user_details.lichessId}\nEmail: {user_details.email}"
    url = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage"
    payload = {
        "chat_id": TELEGRAM_CHAT_ID,
        "text": message
    }

    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(url, json=payload)
            response.raise_for_status()
        except httpx.RequestError as exc:
            logging.error(f"An error occurred while requesting {exc.request.url!r}. Exception: {exc}")
            raise HTTPException(status_code=500, detail=f"Failed to send message to Telegram: {exc}")
        except httpx.HTTPStatusError as exc:
            logging.error(f"Error response {exc.response.status_code} while requesting {exc.request.url!r}. Response content: {exc.response.text}")
            raise HTTPException(status_code=500, detail=f"Failed to send message to Telegram: {exc.response.text}")

    return {"message": "Details sent to Telegram"}
