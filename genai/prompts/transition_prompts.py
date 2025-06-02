# genai_service/prompts/transition_prompts.py

from langchain_core.prompts import ChatPromptTemplate, SystemMessagePromptTemplate, HumanMessagePromptTemplate

COMMON_DJ_SYSTEM_MESSAGE = SystemMessagePromptTemplate.from_template(
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
    Und gleich nach einer kurzen Pause hören wir "{next_song_title}" von "{next_artist_name}".
    Was sagst du dazu als Übergang? Bitte nur der reine Übergangstext, ohne zusätzliche Begrüßungen oder Verabschiedungen von dir als DJ. Der Song kommt direkt im Anschluss.
    """
    human_prompt = HumanMessagePromptTemplate.from_template(human_message_content)
    return ChatPromptTemplate.from_messages([COMMON_DJ_SYSTEM_MESSAGE, human_prompt])


