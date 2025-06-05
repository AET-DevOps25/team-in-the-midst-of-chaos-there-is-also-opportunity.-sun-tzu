# genai/src/chains/transition_chain.py

from typing import Dict, Any, Optional
import logging

from langchain_openai import ChatOpenAI
from pydantic import BaseModel

# Import your prompt functions
from prompts.transition_prompts import get_introduction_prompt, get_quick_transition_prompt

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


# Pydantic model for type hinting within this module
class SongTransitionInfo(BaseModel):
    message_type: int
    previous_song_title: Optional[str] = None
    previous_artist_name: Optional[str] = None
    next_song_title: Optional[str] = None
    next_artist_name: Optional[str] = None
    after_next_song_title: Optional[str] = None
    after_next_artist_name: Optional[str] = None


def generate_script(
        song_info: SongTransitionInfo,
        app_config: Dict[str, Any],
        openai_api_key: str
) -> Optional[str]:
    """
    Generates a transition script based on the message type and song info.

    Args:
        song_info: Pydantic model with song and message type details.
        app_config: Dictionary with application configuration (LLM model, DJ name).
        openai_api_key: The OpenAI API key.

    Returns:
        The generated script as a string, or None on failure.
    """
    try:
        llm = ChatOpenAI(
            model_name=app_config.get("llm_model_name", "gpt-4o-mini"),
            openai_api_key=openai_api_key,
            temperature=0.7
        )

        prompt_template = None

        # 1: Introduction
        if song_info.message_type == 1:
            logger.info("Generating script for type 1: Introduction")
            next_song_data = {
                "title": song_info.next_song_title,
                "artist": song_info.next_artist_name
            }
            prompt_template = get_introduction_prompt(
                next_song_data=next_song_data,
                dj_name=app_config.get("dj_name", "DJ")
            )

        # 2: Quick Transition
        elif song_info.message_type == 2:
            logger.info("Generating script for type 2: Quick Transition")
            previous_song_data = {
                "title": song_info.previous_song_title,
                "artist": song_info.previous_artist_name
            }
            next_song_data = {
                "title": song_info.next_song_title,
                "artist": song_info.next_artist_name
            }
            after_next_song_data = {
                "title": song_info.after_next_song_title,
                "artist": song_info.after_next_artist_name
            } if song_info.after_next_song_title else None

            prompt_template = get_quick_transition_prompt(
                previous_song_data=previous_song_data,
                next_song_data=next_song_data,
                after_next_song_data=after_next_song_data
            )

        # 3: Fun Fact (Placeholder)
        elif song_info.message_type == 3:
            logger.info("Type 3 (Fun Fact) is not yet implemented. Returning placeholder.")
            # This is where the RAG chain would be called in the future
            return "And now for something completely different, a true classic!"

        else:
            logger.error(f"Invalid message_type: {song_info.message_type}")
            return None

        if not prompt_template:
            logger.error("Could not determine a prompt template for the given request.")
            return None

        response = llm.invoke(prompt_template)
        return response.content

    except Exception as e:
        logger.error(f"Failed to generate script: {e}")
        return None