# genai/tests/test_tts_handler.py

from unittest.mock import patch, mock_open
from openai import APIError
from httpx import Request

# --- Local Imports ---
from core.tts_handler import text_to_audio, load_fallback_audio
from prompts.tts_prompts import STATESMAN_TTS_INSTRUCTIONS


# --- Tests for load_fallback_audio ---

def test_load_fallback_audio_success():
    """Tests successful file reading using the 'with patch' syntax."""

    # We patch every external dependency the function uses
    with patch('core.tts_handler.get_fallback_audio_path') as mock_get_path, \
            patch('core.tts_handler.os.path.exists') as mock_exists, \
            patch('builtins.open', mock_open(read_data=b'fallback_data')) as mock_file:
        # Arrange
        mock_get_path.return_value = '/fake/path.mp3'
        mock_exists.return_value = True

        # Act
        result = load_fallback_audio()

        # Assert
        assert result == b'fallback_data'
        mock_get_path.assert_called_once()
        mock_exists.assert_called_once_with('/fake/path.mp3')
        mock_file.assert_called_once_with('/fake/path.mp3', 'rb')


def test_load_fallback_audio_not_found():
    """Tests that None is returned when the file does not exist."""

    with patch('core.tts_handler.get_fallback_audio_path') as mock_get_path, \
            patch('core.tts_handler.os.path.exists') as mock_exists:
        # Arrange
        mock_get_path.return_value = '/fake/path.mp3'
        mock_exists.return_value = False

        # Act
        result = load_fallback_audio()

        # Assert
        assert result is None
        mock_get_path.assert_called_once()
        mock_exists.assert_called_once_with('/fake/path.mp3')


# --- Tests for text_to_audio ---

def test_text_to_audio_success():
    """Tests a successful TTS API call using 'with patch'."""

    with patch('core.tts_handler.OpenAI') as mock_openai_class:
        # Arrange
        mock_client = mock_openai_class.return_value
        mock_response = mock_client.audio.speech.create.return_value
        mock_response.content = b'mock_audio_data'

        # Act
        result = text_to_audio('script text', 'api-key')

        # Assert
        assert result == b'mock_audio_data'
        mock_openai_class.assert_called_once_with(api_key='api-key')
        mock_client.audio.speech.create.assert_called_once_with(
            model="gpt-4o-mini-tts",
            voice="echo",
            input="script text",
            instructions=STATESMAN_TTS_INSTRUCTIONS,
            response_format="mp3"
        )


def test_text_to_audio_api_error():
    """Tests the handling of an APIError from OpenAI."""

    with patch('core.tts_handler.OpenAI') as mock_openai_class:
        # Arrange
        mock_client = mock_openai_class.return_value
        mock_request = Request(method="post", url="/audio/speech")
        mock_client.audio.speech.create.side_effect = APIError(
            message="Test API Error", request=mock_request, body=None
        )

        # Act
        result = text_to_audio("test script", "test-key")

        # Assert
        assert result is None