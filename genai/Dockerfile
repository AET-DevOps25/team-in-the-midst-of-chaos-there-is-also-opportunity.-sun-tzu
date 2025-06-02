# genai_service/Dockerfile
FROM python:3.12-slim

WORKDIR /app

#laden der Requirements
COPY requirements.txt ./

# 4. Installiere die Python-Abhängigkeiten.
RUN pip install --no-cache-dir --upgrade pip
RUN pip install --no-cache-dir -r requirements.txt

# 5. Kopiere den gesamten restlichen Quellcode deiner Anwendung in das Arbeitsverzeichnis.
COPY . .

# 6. Definiere Umgebungsvariablen
ENV PORT=8000

# 7. Exponiere den Port, auf dem deine Anwendung im Container lauschen wird.
EXPOSE ${PORT}

# 8. Der Befehl, der ausgeführt wird, wenn ein Container aus diesem Image gestartet wird. (Die RestAPI über FastAPI)
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]