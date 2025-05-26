# GenAI Service für KI-Radio

Dieser Service ist verantwortlich für die Generierung von dynamischen Radio-Moderationsskripten, einschließlich der Integration von "Fun Facts" mittels Retrieval Augmented Generation (RAG), und der anschließenden Umwandlung dieser Skripte in gesprochene Audio-Übergänge mittels eines Text-to-Speech (TTS) Modells.

Er ist als modularer Microservice konzipiert, der über eine REST-API mit dem Haupt-Backend (Spring Boot Server) des KI-Radios kommuniziert.

## Hauptfunktionen

*   Generierung von Übergangsskripten basierend auf aktuellen und nächsten Songs.
*   (Optional, aktuell geplant) Integration von thematisch passenden "Fun Facts" in die Skripte mittels RAG.
*   Umwandlung der generierten Skripte in Audio-Dateien (z.B. MP3, Opus) über ein TTS-Modell (z.B. OpenAI TTS).
*   Bereitstellung der Audio-Daten über eine REST-API.

## Verzeichnisstruktur und Komponenten

Hier ist eine Erläuterung der wichtigsten Dateien und Verzeichnisse innerhalb dieses `genai_service`:
Use code with caution.
Markdown
genai_service/
├── .env.example # Beispiel für Umgebungsvariablen (NICHT für Secrets im Repo!)
├── Dockerfile # Anweisungen zum Bauen des Docker-Images für diesen Service
├── main.py # Haupteinstiegspunkt des Services (API-Definition mit FastAPI/Flask)
├── requirements.txt # Liste der Python-Abhängigkeiten
├── chains/ # Modul für LangChain "Chains"
│ └── transition_chain.py # Beispiel: Kette zur Generierung von Übergängen
├── prompts/ # Modul für LangChain PromptTemplates
│ └── transition_prompt.py# Beispiel: Prompt-Vorlage für Radio-Übergänge
├── rag_utils/ # Modul für RAG-Funktionalitäten (Vektordatenbank, Retrieval)
│ └── retriever.py # Beispiel: Logik zum Abrufen von Fun Facts
└── core/ # (Optional) Kernlogik, TTS-Integration, etc.
└── tts_handler.py # Beispiel: Wrapper für TTS-Modell-Aufrufe

### `main.py` (oder `app.py`)

*   **Zweck:** Dies ist der Haupteinstiegspunkt des GenAI-Services.
*   **Funktionalität:**
    *   Initialisiert das Web-Framework (z.B. FastAPI oder Flask).
    *   Definiert die REST-API-Endpunkte, über die der Spring Boot Server Anfragen stellen kann (z.B. `/generate_audio_transition`).
    *   Empfängt Anfragen, validiert ggf. Eingabedaten.
    *   Orchestriert die Aufrufe an die verschiedenen internen Module (z.B. `chains` zur Skriptgenerierung, `core` für TTS).
    *   Sendet die generierten Audiodaten oder einen Link dazu als Antwort zurück.
    *   Startet den Webserver (z.B. Uvicorn für FastAPI).

### `chains/` (Verzeichnis)

*   **Zweck:** Beinhaltet Python-Module, die LangChain "Chains" definieren.
*   **Funktionalität:**
    *   Eine Chain in LangChain ist eine Sequenz von Aufrufen, die typischerweise ein Sprachmodell (LLM), aber auch andere Tools oder Datenquellen umfassen kann.
    *   Hier werden die Logikabläufe für komplexere LLM-Interaktionen gekapselt. Beispiel:
        *   Eine Kette könnte einen `PromptTemplate` aus `prompts/` nehmen, ihn mit spezifischen Song-Daten füllen, diesen an ein LLM senden und die Antwort verarbeiten.
        *   Eine RAG-Chain könnte erst relevante Fakten abrufen und diese dann in den Prompt für die Übergangsgenerierung einbauen.

### `prompts/` (Verzeichnis)

*   **Zweck:** Speichert wiederverwendbare `PromptTemplate`s für LangChain.
*   **Funktionalität:**
    *   Prompt-Vorlagen definieren die Struktur der Anweisungen (Prompts), die an die Sprachmodelle gesendet werden. Sie enthalten Platzhalter für variable Eingaben (z.B. Songtitel, Künstlername, abgerufene Fun Facts).
    *   Die Verwendung von Templates macht Prompts wartbarer, konsistenter und einfacher anzupassen.

### `rag_utils/` (Verzeichnis)

*   **Zweck:** Enthält die gesamte Logik, die für die Retrieval Augmented Generation (RAG) benötigt wird.
*   **Funktionalität:**
    *   Vorbereitung und Verwaltung der Wissensdatenbank für Fun Facts (z.B. Laden von Dokumenten, Aufteilen in Chunks, Erstellen von Vektor-Embeddings).
    *   Interaktion mit einer Vektordatenbank (z.B. Weaviate, FAISS), um relevante Informationen basierend auf einer Anfrage (z.B. dem nächsten Song) abzurufen.
    *   Bereitstellung der abgerufenen Informationen für die Verwendung in den `chains` oder `prompts`.

### `core/` (Verzeichnis)

*   **Zweck:** Kann für allgemeine Kernlogik, Hilfsfunktionen oder spezifische Integrationen wie die TTS-Verarbeitung verwendet werden.
*   **Funktionalität (Beispiel `tts_handler.py`):**
    *   Kapselt die Logik zur Interaktion mit dem gewählten Text-to-Speech (TTS) Modell (z.B. OpenAI TTS API, Coqui TTS, etc.).
    *   Nimmt Text entgegen und gibt die Audiodaten (z.B. als Bytes-Objekt oder Pfad zu einer temporären Datei) zurück.

### `Dockerfile`

*   **Zweck:** Definiert, wie das Docker-Image für diesen GenAI-Service gebaut wird.
*   **Funktionalität:**
    *   Spezifiziert das Basis-Image (z.B. ein offizielles Python-Image).
    *   Kopiert den Quellcode des Services in das Image.
    *   Installiert alle Python-Abhängigkeiten, die in `requirements.txt` aufgeführt sind.
    *   Setzt ggf. notwendige Umgebungsvariablen (obwohl Secrets zur Laufzeit injiziert werden sollten).
    *   Definiert den Befehl, der beim Starten eines Containers aus diesem Image ausgeführt wird (z.B. `uvicorn main:app --host 0.0.0.0 --port 8000`).

### `requirements.txt`

*   **Zweck:** Listet alle Python-Bibliotheken und deren Versionen auf, die dieser Service benötigt.
*   **Funktionalität:**
    *   Wird von `pip install -r requirements.txt` verwendet, um eine konsistente und reproduzierbare Umgebung sowohl für die lokale Entwicklung als auch für den Docker-Build-Prozess sicherzustellen.
    *   Sollte aktuell gehalten werden (z.B. mit `pip freeze > requirements.txt`).

### `.env.example`

*   **Zweck:** Dient als Vorlage für eine `.env`-Datei, die für die lokale Entwicklung benötigt wird.
*   **Funktionalität:**
    *   Zeigt, welche Umgebungsvariablen erwartet werden (z.B. `OPENAI_API_KEY`).
    *   **WICHTIG:** Die eigentliche `.env`-Datei mit echten Secrets sollte **niemals** in das Git-Repository eingecheckt werden und muss in `.gitignore` aufgeführt sein!

## Lokales Starten und Deployment

*   **Lokal:** Dieser Service ist Teil eines Multi-Container-Setups, das über eine `docker-compose.yml` im Hauptverzeichnis des Projekts gestartet wird.
*   **Deployment:** Der Service wird als Docker-Container in einer Kubernetes-Umgebung deployed. Konfigurationen (wie der `OPENAI_API_KEY`) werden über Kubernetes Secrets bereitgestellt.

## API-Endpunkte

Die genauen API-Endpunkte werden über OpenAPI/Swagger dokumentiert und sind über die vom Server-Team bereitgestellte Swagger-UI einsehbar. Ein typischer Endpunkt könnte sein:

*   `POST /generate_audio_transition`
    *   **Request Body (JSON):** Informationen über den vorherigen und nächsten Song.
    *   **Response Body:** Audiodaten (z.B. als `audio/mpeg` Stream) oder ein JSON-Objekt mit einem Link zur Audiodatei.

## Abhängigkeiten

Siehe `requirements.txt` für eine vollständige Liste der Python-Abhängigkeiten. Die Hauptabhängigkeiten sind:

*   `fastapi` (oder `flask`) für das Web-Framework.
*   `uvicorn` (oder `gunicorn`) als ASGI/WSGI-Server.
*   `langchain`, `langchain-openai` für die LLM- und RAG-Funktionalität.
*   `python-dotenv` zum Laden von Umgebungsvariablen in der lokalen Entwicklung.
*   (Spezifische Bibliotheken für das TTS-Modell, z.B. `openai` für deren TTS)
*   (Spezifische Bibliotheken für die Vektordatenbank, z.B. `weaviate-client`)

