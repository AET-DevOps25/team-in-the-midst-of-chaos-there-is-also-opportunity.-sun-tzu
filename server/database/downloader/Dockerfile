# downloader/Dockerfile
FROM python:3.11-slim

WORKDIR /app

# Copy SQL schema
COPY 01-schema.sql .

COPY greeting_announcement.mp3 .

COPY download.py .
RUN pip install requests beautifulsoup4

CMD ["python", "-u", "download.py"]
