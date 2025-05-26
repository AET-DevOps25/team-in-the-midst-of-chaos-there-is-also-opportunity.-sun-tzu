# genai_service/hello_langchain_with_prompt.py

import os
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI

# Importiere die FUNKTION, die das Prompt-Template zurückgibt
from prompts.transition_prompts import get_basic_song_transition_prompt

def generate_radio_transition(previous_song: str, previous_artist: str, next_song: str, next_artist: str) -> str:
    """
    Generiert einen Radio-Übergang mit gpt-4o-mini basierend auf einem Prompt-Template,
    das über eine Funktion aus dem prompts-Modul geladen wird.
    """
    # Lade Umgebungsvariablen (OPENAI_API_KEY)
    load_dotenv()

    # Initialisiere das Chat-Modell
    llm = ChatOpenAI(model="gpt-4o-mini", temperature=0.7)

    # Hole das Prompt-Template-Objekt durch Aufruf der Funktion
    transition_template = get_basic_song_transition_prompt()

    # Formatiere den Prompt mit den spezifischen Song-Informationen
    formatted_messages = transition_template.format_prompt(
        previous_song_title=previous_song,
        previous_artist_name=previous_artist,
        next_song_title=next_song,
        next_artist_name=next_artist
    ).to_messages()

    print("Sende formatierten Prompt an gpt-4o-mini...")

    # Rufe das Modell auf und Gib den Inhalt der Antwort zurück
    response = llm.invoke(formatted_messages)
    return response.content

# Hauptteil des Skripts, um die Funktion zu testen
if __name__ == "__main__":
    prev_song = "Imagine"
    prev_artist = "John Lennon"
    nxt_song = "What a Wonderful World"
    nxt_artist = "Louis Armstrong"

    print(f"Generiere Übergang von '{prev_song}' ({prev_artist}) zu '{nxt_song}' ({nxt_artist})...\n")

    try:
        transition_script = generate_radio_transition(
            previous_song=prev_song,
            previous_artist=prev_artist,
            next_song=nxt_song,
            next_artist=nxt_artist
        )
        print("Generierter Radio-Übergang:")
        print(transition_script)
    except Exception as e:
        print(f"Ein Fehler ist aufgetreten: {e}")