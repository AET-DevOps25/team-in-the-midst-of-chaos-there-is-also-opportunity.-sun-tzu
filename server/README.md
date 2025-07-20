# Server documentation

## Structure

The server consists of three microservices:
- **stream service:** provides streaming functionality
- **playlist service:** designs playlist/usable by client to add song wish
- **announcement service:** coordinates generation of radio host interludes (internal only) ([announcement service documentation](./AnnouncementService/readme.md ))

An additional API gateway serves as a single endpoint over which to address the separate microservices from outside. It reroutes the requests accordingly.

**Swagger UI** for all public microservices is available at http://localhost:8090/swagger-ui.html. This requires the [Development Setup](../README.md#development-setup).

## Database

The database holds all information regarding both metadata of songs and announcements (for the latter there is only the title set to "announcement"; distinguished internally by type) 
as well as file names of the respective audio files for songs and announcements.

The tables used for managing different playlists of potentially multiple users implement a queue-like data structure where _playlists_ holds the basic information per playlist (session, head position and next free tail) and _playlist_q_ contains all playlist elements at certain queue positions per session.

### Schema

_audio_files_; key: (id)

| id | filename (not null) |
|----|---------------------|
| 1  | file.mp3            |

_meta_data_; key: (id)

| id  | type | title | artist | release_date | genre |
|-----|------|-------|--------|--------------|-------|
| 1   |      |       |        |              |       |

_playlists_; key: (session)

| session | head | tail | created_at |
|---------|------|------|------------|
| 1       | 0    | 3    | timestamp  |

_playlist_q_; key: (session, queue_pos)

| session | queue_pos | audio_id |
|---------|-----------|----------|
| 1       | 0         | 13       |
