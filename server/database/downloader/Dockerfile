# downloader/Dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY download.py .
RUN pip install requests mutagen

CMD ["python", "-u", "download.py"]
