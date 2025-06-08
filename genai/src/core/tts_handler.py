# genai/src/core/tts_handler.py

import os
from typing import Optional
from openai import OpenAI, APIError
import logging

# --- Corrected Local Imports ---
from core.config import get_fallback_audio_path
from prompts.tts_prompts import STATESMAN_TTS_INSTRUCTIONS

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def text_to_audio(
    script_text: str,
    openai_api_key: str,
    voice: str = "echo",
    instructions: str = STATESMAN_TTS_INSTRUCTIONS
) -> Optional[bytes]:
    """
    Converts a text script into audio using OpenAI's TTS API.

    Args:
        script_text: The text to convert to speech.
        openai_api_key: The OpenAI API key.
        voice: The voice to use for the TTS conversion (e.g., 'alloy', 'echo', 'onyx').
        instructions: Detailed instructions for the TTS model's performance.

    Returns:
        The audio content in bytes if successful, otherwise None.
    """
    if not script_text:
        logger.warning("text_to_audio called with empty script_text.")
        return None

    try:
        client = OpenAI(api_key=openai_api_key)
        response = client.audio.speech.create(
            model="gpt-4o-mini-tts",
            voice=voice,
            input=script_text,
            instructions=instructions,
            response_format="mp3"
        )
        return response.content
    except APIError as e:
        logger.error(f"OpenAI TTS API error: {e}")
        return None
    except Exception as e:
        logger.error(f"An unexpected error occurred in text_to_audio: {e}")
        return None

def load_fallback_audio() -> Optional[bytes]:
    """
    Loads the fallback audio file from the assets directory.

    Returns:
        The fallback audio content in bytes if successful, otherwise None.
    """
    fallback_path = get_fallback_audio_path()
    if not os.path.exists(fallback_path):
        logger.error(f"Fallback audio file not found at: {fallback_path}")
        return None

    try:
        with open(fallback_path, 'rb') as f:
            return f.read()
    except Exception as e:
        logger.error(f"Failed to read fallback audio file: {e}")
        return None