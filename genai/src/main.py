# genai/src/main.py
import os
import logging
from typing import Optional

from fastapi import FastAPI, HTTPException
from fastapi.responses import Response
from pydantic import BaseModel
from dotenv import load_dotenv

# --- Corrected Local Imports ---
from core.config import load_app_config, ConfigError
from core.tts_handler import text_to_audio, load_fallback_audio
from chains.transition_chain import generate_script

# --- Application Setup ---
# Load environment variables from a .env file located in the project's root `genai` directory
# We construct the path to go up from src/ to the parent genai/ directory
dotenv_path = os.path.join(os.path.dirname(__file__), '..', '.env')
load_dotenv(dotenv_path=dotenv_path)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load application config
try:
    APP_CONFIG = load_app_config()
except ConfigError as e:
    logger.error(f"FATAL: Could not load application configuration. {e}")
    # Exit or handle gracefully if config is essential
    APP_CONFIG = {}

# --- API Definition ---

app = FastAPI(
    title="GenAI Radio Transition Service",
    description="Generates audio transitions between songs.",
    version="1.0.0"
)

# --- Pydantic Models for API ---
class SongTransitionInfo(BaseModel):
    message_type: int
    previous_song_title: Optional[str] = None
    previous_artist_name: Optional[str] = None
    next_song_title: Optional[str] = None
    next_artist_name: Optional[str] = None
    after_next_song_title: Optional[str] = None
    after_next_artist_name: Optional[str] = None

# --- API Endpoints ---

@app.post("/generate_audio_transition")
async def generate_audio_transition_endpoint(song_info: SongTransitionInfo):
    """
    Receives song information, generates a script, converts it to audio,
    and returns the audio data directly.
    """
    openai_api_key = os.getenv("OPENAI_API_KEY")
    if not openai_api_key:
        logger.error("OPENAI_API_KEY environment variable not set.")
        raise HTTPException(status_code=500, detail="Server configuration error: Missing API key.")

    # 1. Generate the script using the LangChain chain
    logger.info(f"Generating script for request: {song_info.model_dump_json(indent=2)}")
    script_text = generate_script(
        song_info=song_info,
        app_config=APP_CONFIG,
        openai_api_key=openai_api_key
    )

    if not script_text:
        logger.warning("Script generation failed. Using fallback audio.")
        audio_bytes = load_fallback_audio()
        if audio_bytes:
            return Response(content=audio_bytes, media_type="audio/mpeg")
        else:
            raise HTTPException(status_code=500, detail="Script generation failed and fallback audio is unavailable.")

    # 2. Convert the script to audio using the TTS handler
    logger.info(f"Generated script: '{script_text}'. Converting to audio.")
    audio_bytes = text_to_audio(
        script_text=script_text,
        openai_api_key=openai_api_key
    )

    if not audio_bytes:
        logger.warning("TTS conversion failed. Using fallback audio.")
        audio_bytes = load_fallback_audio()
        if audio_bytes:
            return Response(content=audio_bytes, media_type="audio/mpeg")
        else:
            raise HTTPException(status_code=500, detail="TTS conversion failed and fallback audio is unavailable.")

    # 3. Return the audio file directly in the response
    logger.info("Successfully generated audio. Returning response.")
    return Response(content=audio_bytes, media_type="audio/mpeg")

@app.get("/health")
def health_check():
    """Simple health check endpoint."""
    return {"status": "ok", "config_loaded": bool(APP_CONFIG)}