package de.sunTzu.playlistApp.model;

import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;
import java.util.Queue;

public class Playlist {
    private Queue<Long> playlist;

    public Playlist() {
        this.playlist = new LinkedList<Long>();
    }

    public List<Long> getPlaylist() {
        return new ArrayList<>(playlist);
    }

    public Long getPlaylistHead() {
        return playlist.peek();
    }

    public boolean addToPlaylist(Long id) {
        try {
            return playlist.add(id);
        } catch (IllegalStateException e) {
            return false;
        }
    }

    public boolean addMultiToPlaylist(List<Long> ids) {
        try {
            return playlist.addAll(ids);
        } catch (UnsupportedOperationException e) {
            return false;
        }
    }

    public Long removeHeadFromPlaylist() {
        return playlist.poll();
    }
}
