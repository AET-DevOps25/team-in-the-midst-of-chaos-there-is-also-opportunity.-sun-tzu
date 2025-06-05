# main.py
from fastapi import FastAPI
from pydantic import BaseModel
import uvicorn

# Define the request model for song information
class SongTransitionInfo(BaseModel):
    previous_song_title: str
    previous_artist_name: str
    next_song_title: str
    next_artist_name: str

# Initialize FastAPI app
app = FastAPI(
    title="GenAI Radio Transition Service",
    description="Generates audio transitions between songs.",
    version="0.1.0"
)

@app.post("/generate_audio_transition")
async def generate_audio_transition(song_info: SongTransitionInfo):
    """
    Receives information about the previous and next songs,
    and will eventually return an audio transition.
    For now, it returns a placeholder JSON response.
    """
    # In later steps, this is where you'll:
    # 1. Call LangChain to generate the script
    # 2. Call the TTS handler to convert the script to audio
    # 3. Return the audio file or a link to it

    print(f"Received song info: {song_info.model_dump_json(indent=2)}")

    # Placeholder response for Step 1
    return {
        "message": "API endpoint is working! Script generation and TTS will be implemented here.",
        "received_info": song_info.model_dump()
    }

# To run this app locally:
# 1. Make sure you have fastapi and uvicorn installed:
#    pip install fastapi uvicorn
# 2. Save this code as main.py in your genai_service directory.
# 3. Run the command: uvicorn main:app --reload --port 8000
#    (The --port 8000 is an example; your readme.md mentions it for the genai_service)

if __name__ == "__main__":
    # This part is for running with "python main.py" if you prefer,
    # but 'uvicorn main:app --reload' is generally better for development.
    uvicorn.run(app, host="0.0.0.0", port=8000)