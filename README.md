# Project Description
## Main functionality

- radio channel
- static database of songs
- vector database with metadata about the songs
  - Title, Artist, Genre, Release date, Length, Album, ...
- frontend selects random songs from backend/song database
- Spoken announcements/transitions between every couple of songs
  - GenAI + RAG (using metadata of songs)

## Intended Users

People that are annoyed/frustrated with conventional radio channels and
would like something more exciting during their car rides

## Meaningful GenAI

More informative than conventional radio/playlist by using GenAI announcements (e.g.:
"The next few songs have been composed in the same year the first space shuttle took
off")

## Example Scenarios

1. Press play and listen, e.g. while cleaning the house
2. get together with friends to listen to your favorite selection of songs

# UML diagrams

## Analysis object model

![object model](./documentation/UML%20diagrams/analysis_object.svg)

## Use case diagram

![use cases](./documentation/UML%20diagrams/use_case.svg)

## Component diagram of architecture

![component architecture](./documentation/UML%20diagrams/components.svg)