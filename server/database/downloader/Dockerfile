# downloader/Dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY greeting_announcement.mp3 /audio/

COPY download.py .
RUN pip install requests beautifulsoup4

CMD ["python", "-u", "download.py"]
