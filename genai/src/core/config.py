# genai/src/core/config.py
import json
import os
from typing import Dict, Any

# Build paths relative to this file's location inside src/core/
_CURRENT_DIR = os.path.dirname(__file__)
# Go up one level (from core to src) and then into assets
ASSETS_DIR = os.path.abspath(os.path.join(_CURRENT_DIR, '..', 'assets'))

CONFIG_FILE_PATH = os.path.join(ASSETS_DIR, 'config.json')
FALLBACK_AUDIO_PATH = os.path.join(ASSETS_DIR, 'fallback_audio.mp3')


class ConfigError(Exception):
    """Custom exception for configuration errors."""
    pass


def load_app_config() -> Dict[str, Any]:
    """
    Loads the application configuration from assets/config.json.

    Returns:
        A dictionary containing the configuration.

    Raises:
        ConfigError: If the config file cannot be found or parsed.
    """
    if not os.path.exists(CONFIG_FILE_PATH):
        raise ConfigError(f"Configuration file not found at {CONFIG_FILE_PATH}")
    try:
        with open(CONFIG_FILE_PATH, 'r') as f:
            config_data = json.load(f)

        # Validate essential keys
        if "llm_model_name" not in config_data:
            raise ConfigError("Missing 'llm_model_name' in config.json")
        if "dj_name" not in config_data:
            raise ConfigError("Missing 'dj_name' in config.json")

        return config_data
    except json.JSONDecodeError as e:
        raise ConfigError(f"Error decoding JSON from {CONFIG_FILE_PATH}: {e}")
    except Exception as e:
        raise ConfigError(f"An unexpected error occurred while loading config: {e}")


def get_fallback_audio_path() -> str:
    """
    Returns the absolute path to the fallback audio file.
    """
    return FALLBACK_AUDIO_PATH