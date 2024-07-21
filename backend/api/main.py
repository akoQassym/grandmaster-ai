from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
from .lichess import router as lichess_router
from .telegram import router as send_details_router

load_dotenv(dotenv_path=".env")

app = FastAPI()

frontend_urls = os.getenv('FASTAPI_APP_FRONTEND_URL').split(',')

app.add_middleware(
    CORSMiddleware,
    allow_origins=frontend_urls,  # Adjust as needed for your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(lichess_router)
app.include_router(send_details_router)

@app.get("/")
async def read_root():
    return {"message": "Hello World"}

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_text()
            await websocket.send_text(f"Message text was: {data}")
    except WebSocketDisconnect:
        print("Client disconnected")