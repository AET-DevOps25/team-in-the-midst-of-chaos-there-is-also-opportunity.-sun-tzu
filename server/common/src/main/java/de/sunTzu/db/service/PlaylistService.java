package de.sunTzu.db.service;

import de.sunTzu.db.model.Playlist;
import de.sunTzu.db.repository.PlaylistRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Optional;

@Service
public class PlaylistService {
    private final PlaylistRepository repository;

    public PlaylistService(PlaylistRepository repository) { this.repository = repository; }

    public Optional<Playlist> getBySession(Long session_id) {
        return repository.findById(session_id);
    }

    @Transactional
    public Long createPlaylist() {
        Playlist newEntry = new Playlist(0L, 0L, Instant.now());
        return repository.save(newEntry).getSession();
    }

    @Transactional
    public void updatePlaylistHead(Long session, Long head) {
        Optional<Playlist> optEntry = getBySession(session);

        if (optEntry.isPresent()) {
            Playlist entry = optEntry.get();
            entry.setHead(head);

            repository.save(entry);
        }
    }

    @Transactional
    public void updatePlaylistTail(Long session, Long tail) {
        Optional<Playlist> optEntry = getBySession(session);

        if (optEntry.isPresent()) {
            Playlist entry = optEntry.get();
            entry.setTail(tail);

            repository.save(entry);
        }
    }
}
