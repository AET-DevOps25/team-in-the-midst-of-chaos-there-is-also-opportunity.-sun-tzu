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


def get_introduction_prompt(next_song_data: Dict, dj_name: str = "Mike") -> ChatPromptTemplate:
    # TODO: change Name of DJ/delete
    """
    Generates a ChatPromptTemplate for a song introduction.
    The human message is dynamically constructed by Python.
    """
    system_prompt = SystemMessagePromptTemplate.from_template(
        COMMON_DJ_SYSTEM_MESSAGE_DEFAULT
    )

    next_song_title = next_song_data.get("title")
    next_song_artist = next_song_data.get("artist")

    if not next_song_title:
        human_message_string = f"Please write a generic welcome message for the show, {dj_name}."
    else:
        song_details_str = build_song_details_string(next_song_title, next_song_artist)
        human_message_string = (
            f"The next song is {song_details_str}. "
            f"As {dj_name}, please write a suitable and engaging introduction for this song. Welcome the listeners."
        )

    human_prompt = HumanMessagePromptTemplate.from_template(human_message_string)
    return ChatPromptTemplate.from_messages([system_prompt, human_prompt])


def get_quick_transition_prompt(
        previous_song_data: Dict,
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


# --- Old German prompts from your original file ---
OLD_COMMON_DJ_SYSTEM_MESSAGE = SystemMessagePromptTemplate.from_template(
    """Du bist ein kreativer und freundlicher Radio-DJ.
    Deine Aufgabe ist es, einen kurzen und ansprechenden Übergang zwischen zwei Songs zu moderieren.
    Sprich direkt zum Zuhörer. Sei enthusiastisch, aber nicht übertrieben."""
)


def get_basic_song_transition_prompt() -> ChatPromptTemplate:
    """
    Gibt ein ChatPromptTemplate für einen einfachen Song-Übergang zurück.
    Benötigt: previous_song_title, previous_artist_name, next_song_title, next_artist_name
    """
    human_message_content = """
    Das war "{previous_song_title}" von "{previous_artist_name}".
    Und als nächstes kommt "{next_song_title}" von "{next_artist_name}".
    Was sagst du dazu als Übergang? Bitte nur der reine Übergangstext, ohne zusätzliche Begrüßungen oder Verabschiedungen von dir als DJ. Der Song kommt direkt im Anschluss.
    """
    human_prompt = HumanMessagePromptTemplate.from_template(human_message_content)
    return ChatPromptTemplate.from_messages([OLD_COMMON_DJ_SYSTEM_MESSAGE, human_prompt])