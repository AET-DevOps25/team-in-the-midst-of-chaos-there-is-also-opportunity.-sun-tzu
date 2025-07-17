# Project Description

The **ai.FM** project intends to integrate generative AI into the antiquated ways of radio shows. Songs are chosen at random or submitted as wishes by the user and announced by an AI generated audio skit acting as one or multiple hosts. 

## Structure

Multiple spring boot microservices provide the base functionality for everything related to streaming songs and the handling of playlists utilizing a database and issuing the generation of audio skits on the fly. 

Find more information here: [server documentation](./server/README.md)

---

The genai service has its own separate REST-API and is invoked every time an announcement needs to be generated.

Find more information here: [genai documentation](./genai/readme.md)

---

The angular frontend provides an easy to use UI for interacting with the backend. Users can insert song wishes to the radio's playlist and see the upcoming songs. 

Find more information here: [client documentation](./client/README.md)

---

Additionally, the entire project can be monitored via a Grafana dashboard that collects information on the spring boot microservices and the genai service using Prometheus.

Find more information here: [monitoring documentation](./monitoring/README.md)

# Local Setup



# Software Engineering Process

The design process was thought out from the beginning with UML diagrams that set the relationships between objects, components and entities.

## Analysis object model

![object model](./documentation/UML%20diagrams/analysis_object.svg)

## Use case diagram

![use cases](./documentation/UML%20diagrams/use_case.svg)

## Component diagram of architecture

![component architecture](./documentation/UML%20diagrams/components.svg)
