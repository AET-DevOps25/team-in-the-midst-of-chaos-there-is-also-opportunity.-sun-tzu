package de.sunTzu.db.service;

import de.sunTzu.db.model.Playlist;
import de.sunTzu.db.repository.PlaylistRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class PlaylistService {
    private final PlaylistRepository repository;

    public PlaylistService(PlaylistRepository repository) { this.repository = repository; }

    public Optional<Playlist> getBySession(Long session_id) {
        return repository.findById(session_id);
    }

    public Long getPlaylistCount() {
        return repository.count();
    }

    @Transactional
    public void createPlaylist(Long session_id) {
        Playlist newEntry = new Playlist();
        newEntry.setSession(session_id);
        newEntry.setHead(0L);
        newEntry.setTail(0L);
        repository.save(newEntry);
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
