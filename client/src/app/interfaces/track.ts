export enum TrackType {
    Song,
    Announcement
}

export interface Song {
    id: number
    type: TrackType.Song
    title: string
    artist: string
    year: string
}

export interface Announcement {
    id: number
    type: TrackType.Announcement
    songs: Song[]
}


export type Track = Song | Announcement
