# genai/src/main.py

import os
import logging
from typing import Optional

from fastapi import FastAPI, HTTPException
from fastapi.responses import Response
from pydantic import BaseModel
from dotenv import load_dotenv

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
    description="Generates audio transitions between songs.",
    version="1.1.0"
)


# --- Pydantic Models for API ---
class Song(BaseModel):
    title: str
    artist: Optional[str] = None


class SongTransitionInfo(BaseModel):
    message_type: int
    previous_song: Optional[Song] = None
    next_song: Optional[Song] = None
    after_next_song: Optional[Song] = None


# --- API Endpoints ---
@app.post("/generate_audio_transition")
async def generate_audio_transition_endpoint(song_info: SongTransitionInfo):
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

        logger.info("Returning fallback audio.")
        return Response(content=audio_bytes, media_type="audio/mpeg")

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
        return Response(content=audio_bytes, media_type="audio/mpeg")

    logger.info("Successfully generated audio. Returning response.")
    return Response(content=audio_bytes, media_type="audio/mpeg")


@app.get("/health")
def health_check():
    return {"status": "ok", "config_loaded": bool(APP_CONFIG)}