import os
import logging
from typing import Optional
import asyncio  # 1. Import asyncio

from fastapi import FastAPI, HTTPException, Body
from fastapi.responses import Response
from pydantic import BaseModel, Field
from dotenv import load_dotenv
from prometheus_fastapi_instrumentator import Instrumentator

from core.config import load_app_config, ConfigError
from core.tts_handler import text_to_audio, load_fallback_audio
from chains.transition_chain import generate_script

from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request

class PrefixMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        prefix = request.headers.get("x-forwarded-prefix")
        if prefix:
            request.scope["root_path"] = prefix
        response = await call_next(request)
        return response


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
    version="1.2.0"  # Version updated to reflect changes
)
app.add_middleware(PrefixMiddleware)

# --- Prometheus metrics ---
Instrumentator().instrument(app).expose(app)


# --- Pydantic Models for API ---
class Song(BaseModel):
    title: str = Field(..., example="Stairway to Heaven")
    artist: Optional[str] = Field(None, example="Led Zeppelin")


class SongTransitionInfo(BaseModel):
    message_type: int = Field(...,
                              description="An integer representing the type of message to be generated (e.g., 1 for quick transition, 2 for a longer transition, 3 for a user-requested song).")
    previous_song: Optional[Song] = None
    next_song: Optional[Song] = None
    after_next_song: Optional[Song] = None


# --- Custom Exceptions for clarity ---
class ScriptGenerationError(Exception):
    pass


class TTSConversionError(Exception):
    pass


# 2. Asynchronous helper task for generation
async def generate_transition_task(song_info: SongTransitionInfo, app_config: dict, openai_api_key: str) -> bytes:
    """
    Runs the blocking script generation and TTS conversion in a separate thread.
    This prevents blocking the main server loop and allows for timeout handling.
    """
    logger.info(f"Generating script for request: {song_info.model_dump_json(indent=2)}")

    # Run blocking I/O (API calls) in a thread to not block the event loop
    script_text = await asyncio.to_thread(
        generate_script, song_info, app_config, openai_api_key
    )
    if not script_text:
        raise ScriptGenerationError("Script generation returned no text.")

    logger.info(f"Generated script: '{script_text}'. Converting to audio.")
    audio_bytes = await asyncio.to_thread(
        text_to_audio, script_text, openai_api_key
    )
    if not audio_bytes:
        raise TTSConversionError("TTS conversion returned no audio data.")

    return audio_bytes


# --- API Endpoints ---
@app.post("/generate_audio_transition",
          summary="Generate Audio Transition",
          description="Receives song information and a message type, then generates and returns a spoken audio transition as an MP3 file. The process has a 20-second timeout.",
          responses={
              200: {
                  "description": "The generated or fallback audio transition in MP3 format.",
                  "content": {
                      "audio/mpeg": {}
                  }
              },
              500: {
                  "description": "An internal server error occurred, and the fallback audio was also unavailable."
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
    # 3. Main endpoint logic with timeout handling
    openai_api_key = os.getenv("OPENAI_API_KEY")
    if not openai_api_key:
        logger.error("OPENAI_API_KEY environment variable not set.")
        raise HTTPException(status_code=500, detail="Server configuration error: Missing API key.")

    try:
        # Wrap the generation task with a 20-second timeout
        audio_bytes = await asyncio.wait_for(
            generate_transition_task(song_info, APP_CONFIG, openai_api_key),
            timeout=20.0
        )
        logger.info("Successfully generated audio")
        headers = {"X-Audio-Source": "real"}
        return Response(content=audio_bytes, media_type="audio/mpeg", headers=headers)

    except (asyncio.TimeoutError, ScriptGenerationError, TTSConversionError) as e:
        # Catch timeout, script failure, or TTS failure
        if isinstance(e, asyncio.TimeoutError):
            logger.warning("Generation task timed out after 20 seconds. Returning fallback audio.")
            source = "backup_timeout"
            detail = "Generation timed out"
        elif isinstance(e, ScriptGenerationError):
            logger.warning(f"Script generation failed: {e}. Returning fallback audio.")
            source = "backup_script_failure"
            detail = "Script generation failed"
        else:  # TTSConversionError
            logger.warning(f"TTS conversion failed: {e}. Returning fallback audio.")
            source = "backup_tts_failure"
            detail = "TTS conversion failed"

        # Common fallback logic
        fallback_audio = load_fallback_audio()
        if not fallback_audio:
            logger.error(f"Fallback audio is unavailable after: {detail}.")
            raise HTTPException(status_code=500, detail=f"{detail} and fallback audio is unavailable.")

        logger.info(f"Returning fallback audio due to: {detail}.")
        headers = {"X-Audio-Source": source}
        return Response(content=fallback_audio, media_type="audio/mpeg", headers=headers)


@app.get("/health", summary="Health Check")
def health_check():
    """
    A simple health check endpoint that returns the status of the service and confirms if the application configuration has been loaded.
    """
    return {"status": "ok", "config_loaded": bool(APP_CONFIG)}