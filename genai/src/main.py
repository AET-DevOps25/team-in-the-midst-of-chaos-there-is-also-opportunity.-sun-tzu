# genai/src/main.py

import os
import logging
from typing import Optional

from fastapi import FastAPI, HTTPException, Body
from fastapi.responses import Response
from pydantic import BaseModel, Field
from dotenv import load_dotenv
from prometheus_fastapi_instrumentator import Instrumentator

from core.config import load_app_config, ConfigError
from core.tts_handler import text_to_audio, load_fallback_audio
from chains.transition_chain import generate_script

# --- Application Setup ---
dotenv_path = os.path.join(os.path.dirname(__file__), '..', '.env')
load_dotenv(dotenv_path=dotenv_path)

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

try:
    APP_CONFIG = load_app_config()
    logger.info("Successfully loaded application configuration.")
except ConfigError as e:
    logger.error(f"FATAL: Could not load application configuration. {e}")
    APP_CONFIG = {}

# --- API Definition ---
app = FastAPI(
    title="GenAI Radio Transition Service",
    description="This service generates dynamic radio moderation scripts and converts them into spoken audio transitions using a Text-to-Speech (TTS) model. It is designed as a modular microservice that communicates via a REST-API with the main backend of the AI radio.",
    version="1.1.0"
)

# --- Prometheus metrics ---
Instrumentator().instrument(app).expose(app)

# --- Pydantic Models for API ---
class Song(BaseModel):
    title: str = Field(..., example="Stairway to Heaven")
    artist: Optional[str] = Field(None, example="Led Zeppelin")


class SongTransitionInfo(BaseModel):
    message_type: int = Field(..., description="An integer representing the type of message to be generated (e.g., 1 for quick transition, 2 for a longer transition, 3 for a user-requested song).")
    previous_song: Optional[Song] = None
    next_song: Optional[Song] = None
    after_next_song: Optional[Song] = None

# --- API Endpoints ---
@app.post("/generate_audio_transition",
          summary="Generate Audio Transition",
          description="Receives song information and a message type, then generates and returns a spoken audio transition as an MP3 file.",
          responses={
              200: {
                  "description": "The generated audio transition in MP3 format.",
                  "content": {
                      "audio/mpeg": {}
                  }
              },
              500: {
                  "description": "An internal server error occurred, either due to a configuration issue, script generation failure, or TTS conversion failure where a fallback was also unavailable."
              }
          })
async def generate_audio_transition_endpoint(song_info: SongTransitionInfo = Body(
    ...,
    examples={
        "quick_transition": {
            "summary": "Quick Transition",
            "description": "A brief transition between two songs.",
            "value": {
                "message_type": 1,
                "previous_song": {"title": "Yesterday", "artist": "The Beatles"},
                "next_song": {"title": "Bohemian Rhapsody", "artist": "Queen"}
            }
        },
        "user_request": {
            "summary": "User Requested Song",
            "description": "An announcement for a song requested by a user.",
            "value": {
                "message_type": 3,
                "next_song": {"title": "Here Comes The Sun", "artist": "The Beatles"}
            }
        }
    }
)):
    openai_api_key = os.getenv("OPENAI_API_KEY")
    if not openai_api_key:
        logger.error("OPENAI_API_KEY environment variable not set.")
        raise HTTPException(status_code=500, detail="Server configuration error: Missing API key.")

    logger.info(f"Generating script for request: {song_info.model_dump_json(indent=2)}")
    script_text = generate_script(
        song_info=song_info,
        app_config=APP_CONFIG,
        openai_api_key=openai_api_key
    )

    if not script_text:
        logger.warning("Script generation failed. Attempting to use fallback audio.")
        audio_bytes = load_fallback_audio()
        if not audio_bytes:
            logger.error("Fallback audio is unavailable.")
            raise HTTPException(status_code=500, detail="Script generation failed and fallback audio is unavailable.")

        logger.info("Returning fallback audio due to script generation failure.")
        headers = {"X-Audio-Source": "backup_script_failure"}
        return Response(content=audio_bytes, media_type="audio/mpeg", headers=headers)

    logger.info(f"Generated script: '{script_text}'. Converting to audio.")
    audio_bytes = text_to_audio(
        script_text=script_text,
        openai_api_key=openai_api_key
    )

    if not audio_bytes:
        logger.warning("TTS conversion failed. Attempting to use fallback audio.")
        audio_bytes = load_fallback_audio()
        if not audio_bytes:
            logger.error("Fallback audio is unavailable after TTS failure.")
            raise HTTPException(status_code=500, detail="TTS conversion failed and fallback audio is unavailable.")

        logger.info("Returning fallback audio after TTS failure.")
        headers = {"X-Audio-Source": "backup_tts_failure"}
        return Response(content=audio_bytes, media_type="audio/mpeg", headers=headers)

    logger.info("Successfully generated audio. Returning response.")
    headers = {"X-Audio-Source": "real"}
    return Response(content=audio_bytes, media_type="audio/mpeg", headers=headers)


@app.get("/health", summary="Health Check")
def health_check():
    """
    A simple health check endpoint that returns the status of the service and confirms if the application configuration has been loaded.
    """
    return {"status": "ok", "config_loaded": bool(APP_CONFIG)}