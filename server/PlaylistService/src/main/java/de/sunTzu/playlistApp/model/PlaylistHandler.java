package de.sunTzu.playlistApp.model;

import de.sunTzu.db.model.Playlist;
import de.sunTzu.db.model.PlaylistQueue;
import de.sunTzu.db.service.PlaylistQueueService;
import de.sunTzu.db.service.PlaylistService;

import java.util.*;
import java.util.stream.Collectors;

public class PlaylistHandler {
    private final PlaylistService Pservice;
    private final PlaylistQueueService PQservice;

    public PlaylistHandler(PlaylistService Pservice, PlaylistQueueService PQservice) {
        // initialize db access
        this.Pservice = Pservice;
        this.PQservice = PQservice;
    }

    public Long createPlaylist() {
        return Pservice.createPlaylist();
    }

    public boolean existsPlaylist(Long session) {
        Optional<Playlist> playlist = Pservice.getBySession(session);
        if (playlist.isPresent()) {
            return true;
        }
        return false;
    }

    public List<Long> getPlaylist(Long session) {
        List<PlaylistQueue> playlist = PQservice.getPlaylistBySession(session);
        return playlist.stream().map(PlaylistQueue::getAudio_id).collect(Collectors.toList());
    }

    public Optional<Long> getSongAtPlaylistTail(Long session) {
        Optional<Playlist> playlist = Pservice.getBySession(session);
        if (playlist.isPresent()) {
            Long tail = playlist.get().getTail();
            Optional<PlaylistQueue> tailPQ = PQservice.getPlaylistTailBySession(session, tail);
            if (tailPQ.isPresent()) {
                return Optional.of(tailPQ.get().getAudio_id());
            }
        }
        return Optional.empty();
    }

    // returns audio ID at playlist head for session if present
    public Optional<Long> getPlaylistHead(Long session) {
        Optional<Playlist> playlist = Pservice.getBySession(session);
        if (playlist.isPresent()) {
            Long head = playlist.get().getHead();

            Optional<PlaylistQueue> playlistHead = PQservice.getPlaylistHeadBySession(session, head);

            if (playlistHead.isPresent()) {
                return Optional.of(playlistHead.get().getAudio_id());
            } else {
                return Optional.empty();
            }
        }
        return Optional.empty();
    }

    public boolean addToPlaylist(Long session, Long audio_id) {
        Optional<Playlist> playlist = Pservice.getBySession(session);
        if (playlist.isPresent()) {
            // get first free element
            Long tail = playlist.get().getTail();
            // add song to playlist at tail
            PQservice.addToPlaylist(session, tail, audio_id);
            // increase tail for playlist
            Pservice.updatePlaylistTail(session, tail+1);

            return true;
        }
        return false;
    }

    public boolean addMultiToPlaylist(Long session, List<Long> audio_ids) {
        boolean returnValue = true;
        for (Long audio_id : audio_ids) {
            returnValue &= addToPlaylist(session, audio_id);
        }
        return returnValue;
    }

    public void removeHeadFromPlaylist(Long session) {
        Optional<Playlist> playlist = Pservice.getBySession(session);
        if (playlist.isPresent()) {
            // get head element
            Long head = playlist.get().getHead();
            // remove song from playlist at head
            PQservice.removeHeadFromPlaylist(session, head);
            // increase head for playlist
            Pservice.updatePlaylistHead(session, head + 1);
        }
    }
}
