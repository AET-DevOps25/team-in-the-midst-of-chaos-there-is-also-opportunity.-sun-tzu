# genai/prompts/transition_prompts.py

from langchain_core.prompts import ChatPromptTemplate, SystemMessagePromptTemplate, HumanMessagePromptTemplate
from typing import Optional, Dict, Any

# Helper type alias for song information for clarity
SongInfo = Optional[Dict[str, Any]]  # Expected keys: "title", "artist"

# Updated System Message in English
COMMON_DJ_SYSTEM_MESSAGE_DEFAULT = """
You are a creative and friendly radio DJ.
Your task is to moderate short and engaging transitions between songs or provide introductions.
Speak directly to the listener. Be enthusiastic but not over-the-top.
Unless specifically asked for a full introduction with greetings, please provide ONLY the pure moderation/transition text.
The song will follow immediately after your transition, unless specified otherwise.
Make the transitions sound natural and fluent based on the information provided.
"""


def build_song_details_string(title: Optional[str], artist: Optional[str]) -> str:
    """
    Constructs a string detailing a song, including artist if available.
    Example: "Song Title by Artist" or "Song Title"
    """
    if not title:
        return ""

    parts = [f'"{title}"']
    if artist:
        parts.append(f'by {artist}')
    return " ".join(parts)


def get_long_transition_prompt(
        previous_song_data: SongInfo,
        next_song_data: Dict,
        after_next_song_data: SongInfo,
        dj_name: str,
) -> ChatPromptTemplate:
    """
    Generates a ChatPromptTemplate for a long, dynamic song transition.
    The human message is dynamically constructed using Python's conditional logic.
    """
    system_prompt = SystemMessagePromptTemplate.from_template(
        COMMON_DJ_SYSTEM_MESSAGE_DEFAULT
    )

    human_message_parts = []
    if previous_song_data:
        prev_title = previous_song_data.get("title")
        if prev_title:
            prev_artist = previous_song_data.get("artist")
            prev_song_details_str = build_song_details_string(prev_title, prev_artist)
            human_message_parts.append(f"That was {prev_song_details_str}.")

    next_title = next_song_data.get("title")
    if next_title:
        next_artist = next_song_data.get("artist")
        next_song_details_str = build_song_details_string(next_title, next_artist)
        human_message_parts.append(f"Next up is {next_song_details_str}.")
    else:
        human_message_parts.append("And now for some more great music!")

    if after_next_song_data:
        after_next_title = after_next_song_data.get("title")
        if after_next_title:
            after_next_artist = after_next_song_data.get("artist")
            after_next_song_details_str = build_song_details_string(after_next_title, after_next_artist)
            human_message_parts.append(f"And after that, we'll hear {after_next_song_details_str}.")

    human_message_parts.append(
        f"\nYour name is {dj_name}, what do you say as a transition? Feel free to add a fun fact about one of the artists, a personal comment about your day, or ask the listeners how their day is going, but don't do all of the mentioned. Make it an engaging and longer transition. Please provide only the pure transition text, without any additional greetings or sign-offs. The song will follow immediately."
    )

    final_human_message_string = " ".join(
        filter(None, human_message_parts))  # filter(None,...) to remove empty strings if any part was empty

    human_prompt = HumanMessagePromptTemplate.from_template(final_human_message_string)
    return ChatPromptTemplate.from_messages([system_prompt, human_prompt])


def get_quick_transition_prompt(
        previous_song_data: SongInfo,
        next_song_data: Dict,
        after_next_song_data: SongInfo = None,  # Optional
) -> ChatPromptTemplate:
    """
    Generates a ChatPromptTemplate for a quick, dynamic song transition.
    The human message is dynamically constructed using Python's conditional logic.
    """
    system_prompt = SystemMessagePromptTemplate.from_template(
        COMMON_DJ_SYSTEM_MESSAGE_DEFAULT
    )

    human_message_parts = []
    if previous_song_data:
        prev_title = previous_song_data.get("title")
        if prev_title:
            prev_artist = previous_song_data.get("artist")
            prev_song_details_str = build_song_details_string(prev_title, prev_artist)
            human_message_parts.append(f"That was {prev_song_details_str}.")

    next_title = next_song_data.get("title")
    if next_title:
        next_artist = next_song_data.get("artist")
        next_song_details_str = build_song_details_string(next_title, next_artist)
        human_message_parts.append(f"Next up is {next_song_details_str}.")
    else:
        human_message_parts.append("And now for some more great music!")

    if after_next_song_data:
        after_next_title = after_next_song_data.get("title")
        if after_next_title:
            after_next_artist = after_next_song_data.get("artist")
            after_next_song_details_str = build_song_details_string(after_next_title, after_next_artist)
            human_message_parts.append(f"And after that, we'll hear {after_next_song_details_str}.")

    human_message_parts.append(
        "\nWhat do you say as a transition? Please provide only the pure transition text, "
        "without any additional greetings or sign-offs from you as the DJ. The song will follow immediately."
    )

    final_human_message_string = " ".join(
        filter(None, human_message_parts))  # filter(None,...) to remove empty strings if any part was empty

    human_prompt = HumanMessagePromptTemplate.from_template(final_human_message_string)
    return ChatPromptTemplate.from_messages([system_prompt, human_prompt])


def get_wish_announcement_prompt(next_song_data: Dict, dj_name: str) -> ChatPromptTemplate:
    """
    Generates a ChatPromptTemplate for a wish announcement.
    The human message is dynamically constructed by Python.
    """
    system_prompt = SystemMessagePromptTemplate.from_template(
        COMMON_DJ_SYSTEM_MESSAGE_DEFAULT
    )

    next_song_title = next_song_data.get("title")
    next_song_artist = next_song_data.get("artist")

    song_details_str = build_song_details_string(next_song_title, next_song_artist)
    human_message_string = (
        f"The next song is a wish from the listener. It's {song_details_str}. "
        f"As {dj_name}, please make a short and friendly announcement."
    )

    human_prompt = HumanMessagePromptTemplate.from_template(human_message_string)
    return ChatPromptTemplate.from_messages([system_prompt, human_prompt])