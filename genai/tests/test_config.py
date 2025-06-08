# genai/tests/test_config.py
import pytest
import json
import os

# Import the module itself, not its members, to make patching reliable
import core.config

# --- Test Data and Mocks ---
MOCK_ASSETS_DIR = os.path.join(os.path.dirname(__file__), 'mock_assets')
MOCK_CONFIG_FILE = os.path.join(MOCK_ASSETS_DIR, 'config.json')
MOCK_FALLBACK_FILE = os.path.join(MOCK_ASSETS_DIR, 'fallback_audio.mp3')


@pytest.fixture(autouse=True)
def patch_config_paths(monkeypatch):
    """Fixture to monkeypatch the path constants in the config module."""
    if not os.path.exists(MOCK_ASSETS_DIR):
        os.makedirs(MOCK_ASSETS_DIR)

    monkeypatch.setattr(core.config, 'CONFIG_FILE_PATH', MOCK_CONFIG_FILE)
    monkeypatch.setattr(core.config, 'FALLBACK_AUDIO_PATH', MOCK_FALLBACK_FILE)

    yield

    # Cleanup after test
    if os.path.exists(MOCK_CONFIG_FILE):
        os.remove(MOCK_CONFIG_FILE)
    if os.path.exists(MOCK_ASSETS_DIR):
        try:
            os.rmdir(MOCK_ASSETS_DIR)
        except OSError:
            pass  # Directory not empty, ignore for cleanup


# --- Tests ---

def test_load_app_config_success():
    """Tests successful loading of a valid config file."""
    sample_config_data = {
        "llm_model_name": "test-gpt-model",
        "dj_name": "Test DJ"
    }
    with open(MOCK_CONFIG_FILE, 'w') as f:
        json.dump(sample_config_data, f)

    config = core.config.load_app_config()
    assert config["llm_model_name"] == "test-gpt-model"
    assert config["dj_name"] == "Test DJ"


def test_load_app_config_file_not_found():
    """Tests that a ConfigError is raised when the file doesn't exist."""
    with pytest.raises(core.config.ConfigError, match=f"Configuration file not found"):
        core.config.load_app_config()


def test_load_app_config_invalid_json():
    """Tests that a ConfigError is raised for malformed JSON."""
    with open(MOCK_CONFIG_FILE, 'w') as f:
        f.write("{ not json }")

    with pytest.raises(core.config.ConfigError, match="Error decoding JSON"):
        core.config.load_app_config()


def test_load_app_config_missing_key():
    """Tests that a ConfigError is raised if a required key is missing."""
    sample_config_data = {"dj_name": "Test DJ"}
    with open(MOCK_CONFIG_FILE, 'w') as f:
        json.dump(sample_config_data, f)

    with pytest.raises(core.config.ConfigError, match="Missing 'llm_model_name'"):
        core.config.load_app_config()


def test_get_fallback_audio_path():
    """Tests that the fallback audio path function returns the correct mock path."""
    expected_path = MOCK_FALLBACK_FILE
    actual_path = core.config.get_fallback_audio_path()
    assert actual_path == expected_path