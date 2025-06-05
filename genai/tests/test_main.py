# test_main.py
from fastapi.testclient import TestClient
from genai.main import app

# Initialize the TestClient with your FastAPI app
client = TestClient(app)

def test_generate_audio_transition_success():
    """
    Tests the /generate_audio_transition endpoint with valid input.
    It checks for a 200 OK status and the expected placeholder response structure.
    """
    payload = {
        "previous_song_title": "Bohemian Rhapsody",
        "previous_artist_name": "Queen",
        "next_song_title": "Stairway to Heaven",
        "next_artist_name": "Led Zeppelin"
    }
    response = client.post("/generate_audio_transition", json=payload)

    # Assert HTTP status code is 200 (OK)
    assert response.status_code == 200

    # Assert the response content
    response_json = response.json()
    assert response_json["message"] == "API endpoint is working! Script generation and TTS will be implemented here."
    assert response_json["received_info"]["previous_song_title"] == "Bohemian Rhapsody"
    assert response_json["received_info"]["next_artist_name"] == "Led Zeppelin"

def test_generate_audio_transition_invalid_input_missing_field():
    """
    Tests the endpoint with a missing field in the payload.
    FastAPI should return a 422 Unprocessable Entity status.
    """
    payload = {
        "previous_song_title": "Bohemian Rhapsody",
        # "previous_artist_name": "Queen", # Missing this field
        "next_song_title": "Stairway to Heaven",
        "next_artist_name": "Led Zeppelin"
    }
    response = client.post("/generate_audio_transition", json=payload)

    # Assert HTTP status code is 422 (Unprocessable Entity)
    assert response.status_code == 422

def test_generate_audio_transition_invalid_input_wrong_type():
    """
    Tests the endpoint with a field of the wrong data type.
    FastAPI should return a 422 Unprocessable Entity status.
    """
    payload = {
        "previous_song_title": "Bohemian Rhapsody",
        "previous_artist_name": "Queen",
        "next_song_title": 12345, # Wrong type, should be string
        "next_artist_name": "Led Zeppelin"
    }
    response = client.post("/generate_audio_transition", json=payload)

    # Assert HTTP status code is 422 (Unprocessable Entity)
    assert response.status_code == 422