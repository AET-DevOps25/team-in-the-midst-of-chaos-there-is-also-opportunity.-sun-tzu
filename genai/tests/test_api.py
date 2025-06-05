# genai/test_api.py
#this is a component test

import requests
import json

# The URL of your running local server
url = "http://127.0.0.1:8000/generate_audio_transition"

# The JSON data for the request body
payload = {
  "message_type": 1,
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

    if response.status_code == 200 and response.headers.get('content-type') == 'audio/mpeg':
        # Save the audio content to a file
        with open("generated_transition.mp3", "wb") as f:
            f.write(response.content)
        print("\nSUCCESS! Audio file saved as 'generated_transition.mp3'")
        print("You can now play this file from the 'genai' directory.")
    else:
        print(f"\nERROR: API returned status code {response.status_code}")
        print(f"Response: {response.text}")

except requests.exceptions.ConnectionError:
    print(f"\nCONNECTION ERROR: Could not connect to the server at {url}.")
    print("Please make sure your `uvicorn` server is running.")