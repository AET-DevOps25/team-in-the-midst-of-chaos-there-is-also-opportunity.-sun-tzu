# genai/src/chains/transition_chain.py

from typing import Dict, Any, Optional
import logging
from langchain_openai import ChatOpenAI
from langchain_community.chat_models import ChatOllama
from pydantic import BaseModel
from langchain_core.prompts import ChatPromptTemplate

from prompts.transition_prompts import get_long_transition_prompt, get_quick_transition_prompt, get_wish_announcement_prompt

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


# --- Pydantic Models ---
class Song(BaseModel):
    title: str
    artist: Optional[str] = None


class SongTransitionInfo(BaseModel):
    message_type: int
    previous_song: Optional[Song] = None
    next_song: Optional[Song] = None
    after_next_song: Optional[Song] = None

# --- Main Function ---
def generate_script(
        song_info: SongTransitionInfo,
        app_config: Dict[str, Any],
        openai_api_key: str
) -> Optional[str]:
    """
    Generates a transition script based on the message type and song info.
    """
    try:
        llm = ChatOpenAI(
            model_name=app_config.get("llm_model_name", "gpt-4o-mini"),
            openai_api_key=openai_api_key,
            temperature=0.7,
            request_timeout=15
        )

        prompt_template: Optional[ChatPromptTemplate] = None

        # Logic to select the correct prompt template
        if song_info.message_type == 1 and song_info.next_song:
            logger.info("Generating script for type 1: Quick Transition")
            prompt_template = get_quick_transition_prompt(
                previous_song_data=song_info.previous_song.model_dump() if song_info.previous_song else None,
                next_song_data=song_info.next_song.model_dump(),
                after_next_song_data=song_info.after_next_song.model_dump() if song_info.after_next_song else None
            )
        elif song_info.message_type == 2 and song_info.next_song:
            logger.info("Generating script for type 2: Long Transition")
            prompt_template = get_long_transition_prompt(
                previous_song_data=song_info.previous_song.model_dump() if song_info.previous_song else None,
                next_song_data=song_info.next_song.model_dump(),
                after_next_song_data=song_info.after_next_song.model_dump() if song_info.after_next_song else None,
                dj_name=app_config.get("dj_name", "DJ")
            )
        elif song_info.message_type == 3 and song_info.next_song:
            logger.info("Generating script for type 3: Wish Announcement")
            prompt_template = get_wish_announcement_prompt(
                next_song_data=song_info.next_song.model_dump(),
                dj_name=app_config.get("dj_name", "DJ")
            )
        else:
            logger.error(f"Invalid message_type or missing song data for type: {song_info.message_type}")
            return None

        if not prompt_template:
            logger.error("Could not determine a prompt template for the given request.")
            return None

        logger.info("About to call the Language Model (LLM)...")

        # Chain the prompt template directly to the LLM.
        chain = prompt_template | llm
        response = chain.invoke({})  # Invoke the chain with an empty dict as variables are already in the prompt

        logger.info("LLM call completed successfully.")

        return response.content

    except Exception as e:
        logger.error(f"Failed to generate script with OpenAI: {e}")
        return None