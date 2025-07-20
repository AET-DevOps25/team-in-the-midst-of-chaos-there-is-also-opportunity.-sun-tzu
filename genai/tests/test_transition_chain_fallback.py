# genai/tests/test_transition_chain_fallback.py

import pytest
from unittest.mock import patch, MagicMock
import sys
import os

# --- Path Correction ---
# This boilerplate code ensures that the 'src' directory is always in the Python path,
# resolving the 'ModuleNotFoundError' during test collection. It finds the parent
# directory of the 'tests' folder (which is the 'genai' root) and adds it to the path.
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

# --- Local Imports ---
from src.chains.transition_chain import generate_script, Song, SongTransitionInfo
from langchain_core.messages import AIMessage  # Import the AIMessage class


# --- Fixtures ---

@pytest.fixture
def song_info_fixture():
    """Provides a sample SongTransitionInfo object for testing."""
    return SongTransitionInfo(
        message_type=1,
        next_song=Song(title="Bohemian Rhapsody", artist="Queen")
    )


@pytest.fixture
def app_config_fixture():
    """Provides a sample app_config dictionary."""
    return {
        "llm_model_name": "gpt-4o-mini",
        "dj_name": "Mike"
    }


# --- Tests for generate_script ---

def test_generate_script_success_with_openai(song_info_fixture, app_config_fixture):
    """
    Tests a successful script generation using the primary OpenAI service.
    """
    with patch('src.chains.transition_chain.ChatOpenAI') as mock_chat_openai, \
            patch('src.chains.transition_chain.ChatOllama') as mock_chat_ollama:
        # ARRANGE: Mock the ChatOpenAI *instance* to return an AIMessage when it is CALLED.
        # This is the key change: We configure the mock instance itself, not its .invoke() method.
        mock_openai_instance = mock_chat_openai.return_value
        mock_openai_instance.return_value = AIMessage(content="This is an OpenAI response.")

        # ACT
        result = generate_script(
            song_info=song_info_fixture,
            app_config=app_config_fixture,
            openai_api_key="a-real-key"
        )

        # ASSERT
        assert result == "This is an OpenAI response."
        mock_chat_openai.assert_called_once()
        mock_chat_ollama.assert_not_called()


