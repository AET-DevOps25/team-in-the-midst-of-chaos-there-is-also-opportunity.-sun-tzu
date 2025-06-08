# tests/test_main.py
import pytest
from fastapi.testclient import TestClient
import os
from unittest.mock import patch, MagicMock

# Set a dummy API key before any app code is imported
os.environ['OPENAI_API_KEY'] = 'test-key'

# Since src is on the pythonpath (from pytest.ini), we can import main directly.
from main import app


@pytest.fixture
def client():
    """Create a new TestClient for each test."""
    return TestClient(app)


# The patch targets must now match the new import paths *within main.py*
@patch('main.load_fallback_audio')
@patch('main.text_to_audio')
@patch('main.generate_script')
@patch('main.load_app_config')
def test_generate_audio_transition_success(mock_load_config, mock_generate_script, mock_text_to_audio,
                                           mock_load_fallback, client):
    # Arrange Mocks
    mock_load_config.return_value = {"llm_model_name": "mock-model", "dj_name": "Mock DJ"}
    mock_generate_script.return_value = "This is a test script."
    mock_text_to_audio.return_value = b"mock_audio_data"

    # Act
    payload = {"message_type": 1, "next_song_title": "Stairway to Heaven"}
    response = client.post("/generate_audio_transition", json=payload)

    # Assert
    assert response.status_code == 200
    assert response.content == b"mock_audio_data"
    mock_generate_script.assert_called_once()
    mock_text_to_audio.assert_called_once()
    mock_load_fallback.assert_not_called()


@patch('main.load_fallback_audio')
@patch('main.text_to_audio')
@patch('main.generate_script')
@patch('main.load_app_config')
def test_generate_uses_fallback_if_script_fails(mock_load_config, mock_generate_script, mock_text_to_audio,
                                                mock_load_fallback, client):
    # Arrange Mocks
    mock_load_config.return_value = {}
    mock_generate_script.return_value = None  # Simulate script generation failure
    mock_load_fallback.return_value = b"fallback_audio"

    # Act
    payload = {"message_type": 1, "next_song_title": "A Song"}
    response = client.post("/generate_audio_transition", json=payload)

    # Assert
    assert response.status_code == 200
    assert response.content == b"fallback_audio"
    mock_generate_script.assert_called_once()
    mock_text_to_audio.assert_not_called()
    mock_load_fallback.assert_called_once()


# ... you can add more tests for other failure cases here ...

def test_invalid_input_missing_field(client):
    """Tests that FastAPI's validation catches missing required fields."""
    # message_type is required
    payload = {"next_song_title": "A Song"}
    response = client.post("/generate_audio_transition", json=payload)
    assert response.status_code == 422