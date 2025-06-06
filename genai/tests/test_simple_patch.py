# genai/tests/test_simple_patch.py

from unittest.mock import patch
import core.config  # Use a module that we know exists


def test_simple_patching_mechanism():
    """
    A very simple test to confirm that patching works at all.
    """
    # We will try to patch the 'load_app_config' function itself
    # to see if the patching mechanism is fundamentally working.
    with patch('core.config.load_app_config') as mock_load_config:
        # Arrange: Make the mocked function return a specific dictionary
        mock_load_config.return_value = {"status": "mocked successfully"}

        # Act: Call the function we just patched
        result = core.config.load_app_config()

        # Assert: Check if we got our mocked return value
        assert result == {"status": "mocked successfully"}

        # Assert: Check that the mock was actually called
        mock_load_config.assert_called_once()

    print("\nSimple patch test executed successfully.")