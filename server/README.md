# Server documentation

## Structure

The server consists of three microservices:
- stream service: provides streaming functionality
- playlist service: designs playlist/usable by client to add song wish
- announcement service: coordinates generation of radio host interludes (internal only)

An additional API gateway (http://localhost:8080) serves as a single endpoint over which to address the separate microservices from outside.
It reroutes the requests accordingly.

**Swagger UI** for all microservices is available at: http://localhost:8080/swagger-ui/index.html

## Database

The database holds all information regarding both metadata of songs and file names of the respective audio files for songs and annoucnements.

### Schema

_audio_files_

| id | filename (not null) |
|----|---------------------|
| 1  | file.mp3            |

_meta_data_

| id  | genre | length | artist | release_date | ... |
|-----|-------|--------|--------|--------------|-----|
| 1   |       |        |        |              |     |
