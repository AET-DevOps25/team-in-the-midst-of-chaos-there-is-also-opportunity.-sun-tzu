# Project Description

The **ai.FM** project intends to integrate generative AI into the antiquated ways of radio shows. Songs are chosen at random or submitted as wishes by the user and announced by an AI generated audio skit acting as one or multiple hosts. 

## Structure

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

Assuming Docker is installed, the project can be deployed with Docker Compose as follows:

1. Create a directory `aifm` and navigate into it:

    ```bash
    mkdir aifm
    cd aifm
    ```

2. Download the `compose.yml` file from the GitHub repository into the folder:

    ```bash
    curl -o compose.yml https://raw.githubusercontent.com/AET-DevOps25/team-in-the-midst-of-chaos-there-is-also-opportunity.-sun-tzu/main/compose.yml
    ```

3. Create a `.env` file with the required environment variables:

    ```bash
    URL=<the domain where the web app will be reachable, e.g. http://localhost:8080>
    DOWNLOAD_PASS=<the password for the initial music download>
    OPENAI_API_KEY=<your OpenAI API key used to generate announcements>
    ```

4. Pull the latest images and start the containers:

    ```bash
    docker compose up -d --pull always
    ```

5. Wait about a minute for the containers to fully initialize and connect.
6. Open `http://localhost:8080` in your browser and enjoy some great music! 🎉

# Software Engineering Process

The design process was thought out from the beginning with UML diagrams that set the relationships between objects, components and entities.

## Analysis object model

![object model](./documentation/UML%20diagrams/analysis_object.svg)

## Use case diagram

![use cases](./documentation/UML%20diagrams/use_case.svg)

## Component diagram of architecture

![component architecture](./documentation/UML%20diagrams/components.svg)
