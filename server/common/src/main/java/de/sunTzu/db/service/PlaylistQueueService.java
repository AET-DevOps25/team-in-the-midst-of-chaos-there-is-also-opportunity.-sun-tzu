package de.sunTzu.db.service;

import de.sunTzu.db.model.PlaylistQueue;
import de.sunTzu.db.model.PlaylistQueueKey;
import de.sunTzu.db.repository.PlaylistQueueRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class PlaylistQueueService {
    private final PlaylistQueueRepository repository;

    public PlaylistQueueService(PlaylistQueueRepository repository) { this.repository = repository; }

    // returns queue for session ID ordered ASC for queue position
    public List<PlaylistQueue> getPlaylistBySession(Long session_id) {
        return repository.findAllByIdSessionOrderByIdQueuePosAsc(session_id);
    }

    // returns head of queue for session
    public Optional<PlaylistQueue> getPlaylistHeadBySession(Long session_id, Long head) {
        return repository.findByIdSessionAndIdQueuePos(session_id, head);
    }

    // adds new element to playlist
    @Transactional
    public void addToPlaylist(Long session_id, Long queue_pos, Long audio_id) {
        PlaylistQueueKey newKey = new PlaylistQueueKey();
        newKey.setSession(session_id);
        newKey.setQueuePos(queue_pos);

        PlaylistQueue newEntry = new PlaylistQueue();
        newEntry.setId(newKey);
        newEntry.setAudio_id(audio_id);

        repository.save(newEntry);
    }

    // delete head of playlist queue for session
    @Transactional
    public void removeHeadFromPlaylist(Long session_id, Long queue_pos) {
        repository.deleteByIdSessionAndIdQueuePos(session_id, queue_pos);
    }
}
