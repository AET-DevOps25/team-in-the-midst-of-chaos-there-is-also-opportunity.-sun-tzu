# Client

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.2.13.

## Main functionality

The frontend provides an intuitive and interactive user interface for the ai.FM radio experience. Key features include:

- Current Song Display: The interface prominently displays the title and artist of the song that is currently playing, along with the song's cover art, providing an engaging visual focus for the listener.

- Upcoming Song Queue: Users can view a real-time list of the next songs and AI-generated announcements in the queue. This gives listeners a preview of what's to come and enhances the feeling of a live radio broadcast.

- Song Wish: The application features a song catalogue where users can browse all available tracks. From the catalogue, users have the option to select a song and add it as a "wish" to the playlist, influencing the radio's selection.

## Intended Users

This project is for people who are annoyed/frustrated with conventional radio channels and would like something more exciting during their car rides.

## Project Description

This project is the frontend for the ai.FM application, a web-based radio player that uses generative AI to create a unique listening experience. The application features a dynamic playlist, a catalog of songs, and AI-generated announcements between tracks.

### Directory Structure

<pre>
client/
|-- .gitignore
|-- angular.json
|-- nginx.conf
|-- package-lock.json
|-- package.json
|-- README.md
|-- tsconfig.app.json
|-- tsconfig.json
|-- tsconfig.spec.json
|-- src/
|   |-- main.ts
|   |-- proxy.conf.json
|   |-- index.html
|   |-- app/
|   |   |-- app.component.html
|   |   |-- app.component.scss
|   |   |-- app.component.spec.ts
|   |   |-- app.component.ts
|   |   |-- app.config.ts
|   |   |-- app.routes.ts
|   |   |-- take-until-destroyed.ts
|   |   |-- components/
|   |   |   |-- audio-controls/
|   |   |   ...
|   |   |-- dtos/
|   |   |   |-- find-song.ts
|   |   |   ...
|   |   |-- enums/
|   |   |   |-- error-types/
|   |   |      ...
|   |   |   |-- index.ts
|   |   |-- guards/
|   |   |   |-- desktop-redirect.guard.ts
|   |   |   |-- mobile-redirect.guard.ts
|   |   |   |-- ...
|   |   |-- interfaces/
|   |   |   |-- api-response.ts
|   |   |   |-- track.ts
|   |   |   |-- index.ts
|   |   |-- services/
|   |   |   |-- api.service.ts
|   |   |   |-- ...
|   |   |   |-- index.ts
|   |-- scss/
|       |-- _general.scss
|       |-- _theme.scss
|       |-- styles.scss
</pre>

### Components

-   **audio-controls**: The main audio controls for the desktop version, including a play/pause button and progress bar.
-   **audio-controls-mobile**: A mobile-friendly version of the audio controls, designed for smaller screens.
-   **background-player**: A hidden audio player that handles the actual playback of music and announcements.
-   **header**: The main application header, which includes the application title and a logout button.
-   **main-page**: The main page for the desktop version of the application, which includes the song catalogue, audio controls, and queue.
-   **main-page-mobile**: The main page for the mobile version of the application, which includes the song catalogue and a mobile-friendly player bar.
-   **page-not-found**: A simple page that is displayed when a user navigates to a non-existent route.
-   **queue**: A component that displays the list of upcoming songs and announcements.
-   **song-catalogue**: A component that displays a list of available songs and allows users to add them to the queue.
-   **welcome-page**: The initial page that users see when they first visit the application.

### Guards

-   **desktop-redirect.guard**: A guard that redirects users from the mobile version of the player to the desktop version if they are on a desktop device.
-   **mobile-redirect.guard**: A guard that redirects users from the desktop version of the player to the mobile version if they are on a mobile device.
-   **player-access.guard**: A guard that ensures a user has a valid session before allowing them to access the player.
-   **session-restore.guard**: A guard that attempts to restore a user's session from local storage when they first visit the application.
-   **welcome-redirect.guard**: A guard that redirects users from the welcome page to the player if they already have a valid session.

### Services

-   **api.service**: A service that handles all communication with the backend API.
-   **play.service**: A service that manages the playback of audio, including the current song, playback state, and progress.
-   **playlist.service**: A service that manages the playlist, including adding songs, fetching the next songs, and retrieving metadata.
-   **queue.service**: A service that manages the queue of upcoming songs and announcements.
-   **session.service**: A service that manages the user's session, including creating, restoring, and destroying sessions.
-   **mobile-detection.service**: A service that detects whether the user is on a mobile device.

## Development server

To start a local development server, run:

<pre>
ng serve
</pre>

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.



## Building

To build the project run:

<pre>
ng build
</pre>

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

<pre>
ng test
</pre>

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
