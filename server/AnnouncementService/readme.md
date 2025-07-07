# Announcement Service

## Overview

The **Announcement Service** is an internal microservice responsible for generating and storing audio files for transitions, jingles, or other announcements. It is designed to be called by other services within the application, such as the `PlaylistService`, and is not exposed to the public internet via the API Gateway.

The core workflow is as follows:
1.  Receives a request containing an ID for the new announcement and the IDs of surrounding songs.
2.  Fetches the metadata (title, artist) for the specified songs from the central database.
3.  Sends this contextual information to the `genai-service`.
4.  The `genai-service` generates an audio file (e.g., an MP3).
5.  The Announcement Service saves this audio file to the shared volume and creates a corresponding record in the `audio_files` table.

---

## API

### Create Announcement

Creates a new audio announcement file and its associated database entry.

-   **Endpoint:** `POST /announcement`
-   **Access:** Internal Only
-   **Request Parameters:**
    -   `id` (Long): The primary ID for the new announcement. This ID must correspond to an entry already created by another service (e.g., `transitions-service`).
    -   `prevId` (Long, optional): The ID of the song that played before the announcement.
    -   `songIds` (List<Long>): A comma-separated list of IDs for the upcoming one or two songs.
    -   `type` (int): An integer representing the type of message to be generated (e.g., 1 for quick transition, 2 for long).

-   **Success Response:**
    -   **Code:** `201 CREATED`
    -   **Body:**
        ```json
        {
          "id": 9,
          "filename": "announcement_9.mp3"
        }
        ```

---

## Environment Variables

This service requires the following environment variables to be set, which are provided by the `docker-compose.yml` file:

-   `SPRING_DATABASE_URL`: The full JDBC URL for the MySQL database.
-   `SPRING_DATABASE_USERNAME`: The username for the database.
-   `SPRING_DATABASE_PASSWORD`: The password for the database.
-   `AUDIO_FILE_PATH`: The internal path within the container where audio files are stored (e.g., `/audio`).
-   `GENAI_SERVICE_URL`: The full internal URL for the GenAI service endpoint.

---

## Local Development & Testing

### Running the Service Standalone

To compile and run the service locally without Docker (requires a running database accessible from `localhost`):

```bash
# From the /server directory
.\gradlew.bat :AnnouncementService:bootRun