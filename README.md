# Introduction

**ai.FM** is a web app that integrates generative AI into the antiquated ways of radio shows. Songs are chosen at random or submitted as wishes by the user and announced by an AI generated audio skit acting as one or multiple hosts.

## Quick start

To quickly get the project up and running, run this command on a machine running Ubuntu 20.04+ (or similar) with Docker installed:

```bash
curl -sS https://raw.githubusercontent.com/AET-DevOps25/team-in-the-midst-of-chaos-there-is-also-opportunity.-sun-tzu/ksDocumentation/setup.sh | bash
```

The script will:
- Create a project directory
- Prompt you for environment variables
- Start the application using Docker Compose

For more details, see [Local setup](#local-setup).



# Structure

Multiple Spring Boot microservices provide the base functionality for everything related to streaming songs and the handling of playlists utilizing a database and issuing the generation of audio skits on the fly. 

Find more information here: [server documentation](./server/README.md)

---

The GenAI service has its own separate REST API and is invoked every time an announcement needs to be generated.

Find more information here: [genai documentation](./genai/readme.md)

---

The Angular frontend provides an easy to use UI for interacting with the backend. Users can insert song wishes to the radio's playlist and see the upcoming songs.

Find more information here: [client documentation](./client/README.md)

---

Additionally, the entire project can be monitored via a Grafana dashboard that collects information on the Spring Boot microservices and the GenAI service using Prometheus.

Find more information here: [monitoring documentation](./monitoring/README.md)



# Local Setup

**Prerequisites:**
- Preferably Ubuntu 20.04+ or a similar Linux distribution
- Docker installed

## Production

Assuming Docker is installed, the project can be deployed with Docker Compose as follows:

1. Create a directory `aifm` and navigate into it:

    ```bash
    mkdir aifm
    cd aifm
    ```

2. Download the `compose.yml` file from the GitHub repository into the folder:

    ```bash
    curl -sSo compose.yml https://raw.githubusercontent.com/AET-DevOps25/team-in-the-midst-of-chaos-there-is-also-opportunity.-sun-tzu/main/compose.yml
    ```

3. Create a `.env` file with the required environment variables:

    ```bash
    DOWNLOAD_PASS=your_password_here
    OPENAI_API_KEY=your_openai_key_here
    # URL=http://localhost:8080  # Optional
    # VERSION=latest             # Optional
    ```

4. Pull the latest images and start the containers:

    ```bash
    docker compose up -d --pull always
    ```

5. Wait about a minute for the containers to fully initialize and connect.
6. Open `http://localhost:8080` in your browser and enjoy some great music! 🎉

## Development

1. Clone the repository:
   ```bash
   git clone git@github.com:AET-DevOps25/team-in-the-midst-of-chaos-there-is-also-opportunity.-sun-tzu.git aifm
   ```

2. Navigate into the newly created directory:
   ```bash
   cd aifm
   ```

3. Create a `.env` file as in [Production Setup](#production) step 3.

4. Build the images:
   ```bash
   docker compose build
   ```

5. Start the containers:
   ```bash
   docker compose up -d
   ```

6. Wait about a minute for the containers to fully initialize and connect.
7. Open `http://localhost:8080` in your browser and enjoy some great music! 🎉



# Software Engineering Process

The design process was thought out from the beginning with UML diagrams that set the relationships between objects, components and entities.

## Analysis object model

![object model](./documentation/UML%20diagrams/analysis_object.svg)

## Use case diagram

![use cases](./documentation/UML%20diagrams/use_case.svg)

## Component diagram of architecture

![component architecture](./documentation/UML%20diagrams/components.svg)
