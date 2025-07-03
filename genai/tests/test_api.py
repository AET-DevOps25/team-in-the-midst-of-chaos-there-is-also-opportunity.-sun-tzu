# genai/tests/test_api.py
# This is a component test, designed to be run against a LIVE server.
# By wrapping the logic in a main() function and using the __name__ == "__main__"
# block, we prevent pytest from executing this code during test discovery.

import requests
import json
import sys

def main():
    """
    Runs the component test against the running API endpoint.
    """
    # The URL of your running local server
    url = "http://127.0.0.1:8000/generate_audio_transition"

    # The JSON data for the request body
    payload = {
        "message_type": 3,
        "next_song": {
            "title": "Here Comes The Sun",
            "artist": "The Beatles"
        }
    }

    headers = {
        'Content-Type': 'application/json'
    }

    print("Sending request to your API...")

    try:
        response = requests.post(url, headers=headers, data=json.dumps(payload))

        # Check 1: Successful Status Code
        if response.status_code != 200:
            print(f"\nERROR: API returned status code {response.status_code}")
            print(f"Response: {response.text}")
            sys.exit(1)

        # Check 2: Correct Content-Type
        if response.headers.get('content-type') != 'audio/mpeg':
            print(f"\nERROR: Expected content-type 'audio/mpeg' but got '{response.headers.get('content-type')}'")
            sys.exit(1)

        # Check 3: Audio Source Header
        audio_source = response.headers.get('x-audio-source')
        if not audio_source:
            print("\nERROR: 'X-Audio-Source' header is missing from the response.")
            sys.exit(1)

        print(f"\nReceived audio. Source: '{audio_source}'")

        # Check 4: Was the audio real or a backup?
        if audio_source != 'real_llm': # Assuming 'real_llm' is your primary source name
            print("\nWARNING: The returned audio was from a fallback or backup source.")
            # You can optionally fail the test by uncommenting the next line
            # sys.exit(1)

        # Save the audio content to a file
        output_filename = "generated_transition.mp3"
        with open(output_filename, "wb") as f:
            f.write(response.content)

        print(f"\nSUCCESS! Audio file saved as '{output_filename}'")
        print("You can now play this file from the 'genai' directory.")

    except requests.exceptions.ConnectionError:
        print(f"\nCONNECTION ERROR: Could not connect to the server at {url}.")
        print("Please make sure your `uvicorn` server is running.")
        sys.exit(1)

# This block ensures the main() function is only called when you run
# the script directly with "python tests/test_api.py".
# It will NOT run when pytest imports the file.
if __name__ == "__main__":
    main()