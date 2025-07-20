# GenAI Service for AI Radio

This service is responsible for generating dynamic radio moderation scripts and converting them into spoken audio transitions using a Text-to-Speech (TTS) model.

It is designed as a modular microservice that communicates via a REST-API with the main backend of the AI radio.

## Main Features

* Generation of transition and introduction scripts based on song data.
* Conversion of the generated scripts into audio files (MP3) via a Text-to-Speech (TTS) model (OpenAI TTS).
* A REST-API to receive song information and return the generated audio data.

## Directory Structure and Components

The service now uses a standard `src` layout for better organization and more reliable imports. 

<pre>
genai/
|-- .env.example
|-- Dockerfile
|-- requirements.txt
|-- pytest.ini
|-- src/
|   |-- assets/
|   |   |-- config.json
|   |   +-- fallback_audio.mp3
|   |-- chains/
|   |   +-- transition_chain.py
|   |-- core/
|   |   |-- __init__.py
|   |   |-- config.py
|   |   +-- tts_handler.py
|   |-- prompts/
|   |   |-- __init__.py
|   |   |-- transition_prompts.py
|   |   +-- tts_prompts.py
|   |-- __init__.py
|   +-- main.py
+-- tests/
    |-- __init__.py
    |-- test_config.py
    |-- test_main.py
    |-- test_prompts.py
    +-- test_tts_handler.py
</pre>

### `src/main.py`

* **Purpose:** The main entry point of the GenAI service.
* **Functionality:**
    * Initializes the FastAPI web framework.
    * Defines the REST-API endpoints (e.g., `/generate_audio_transition`).
    * Receives requests, validates input data using Pydantic models.
    * Orchestrates calls to internal modules (`chains` for script generation, `core` for TTS).
    * Returns the generated audio data directly in the response.

### `src/core/` (Directory)

* **Purpose:** Contains core logic and handlers.
* **`config.py`**: Loads and provides access to settings from `assets/config.json`.
* **`tts_handler.py`**: Wraps the logic for interacting with the OpenAI TTS API and for loading the fallback audio file in case of an error.

### `src/chains/` (Directory)

* **Purpose:** Contains Python modules that define LangChain "Chains".
* **`transition_chain.py`**: Holds the core logic for selecting the correct prompt based on the request, invoking the language model to generate a script, and handling errors.

### `src/prompts/` (Directory)

* **Purpose:** Stores reusable prompt templates and definitions.
* **`transition_prompts.py`**: Defines the prompts sent to the LLM to generate introductions and transitions.
* **`tts_prompts.py`**: Defines the detailed instructions for the TTS model's voice persona (affect, tone, pacing, etc.).

## Local Start and Deployment

* **Local:** To run the service locally, navigate to the `src` directory and use `uvicorn`.
    ```bash
    # From the 'genai' directory
    cd src
    
    # Run the server
    uvicorn main:app --reload
    ```
    The server will be available at `http://127.0.0.1:8000`.

* **Deployment:** The service is designed to be built into a Docker container using the `Dockerfile`. Configurations (like the `OPENAI_API_KEY`) should be provided via environment variables or secrets management in a production environment (e.g., Kubernetes Secrets).

## API Endpoints

The API is documented via **OpenAPI/Swagger** and can be viewed at `/genai-docs` (e.g. for the Kubernetes deployment: https://aifm.student.k8s.aet.cit.tum.de/genai-docs). To also _test_ the routes interactively, the [Development Setup](../README.md#development-setup) is required, and the documentation should be accessed at http://localhost:8000/docs.

* `POST /generate_audio_transition`
  
    * **Request Body (JSON):** Information about the songs and the desired message type. The structure is now nested for clarity.
      
        ```json
        {
          "message_type": 1,
          "previous_song": null,
          "next_song": {
            "title": "Here Comes The Sun",
            "artist": "The Beatles"
          },
          "after_next_song": null
        }
        ```
    * **Response Body:** Returns the raw audio data with a `content-type` of `audio/mpeg`.

## Dependencies

See `requirements.txt` for a full list. Install them using:
`pip install -r requirements.txt`

## Testing the GenAI Service

Unit tests for this service are written using `pytest`. The tests are located in the `genai/tests/` directory.

The `pytest.ini` file in the root `genai` directory configures the Python path, ensuring that tests can run correctly from the command line.

To run the tests:

1.  Ensure you have a Python virtual environment activated with all dependencies from `requirements.txt` installed.
2.  Navigate to the `genai` directory in your console.
3.  Run `pytest`:
    ```bash
    pytest
    ```
