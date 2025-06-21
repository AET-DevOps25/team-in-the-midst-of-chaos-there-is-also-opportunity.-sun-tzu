package de.sunTzu.db.service;

import de.sunTzu.db.model.Playlist;
import de.sunTzu.db.repository.PlaylistQueueRepository;
import de.sunTzu.db.repository.PlaylistRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class PlaylistCleanupService {
    private final PlaylistRepository playlistRepository;
    private final PlaylistQueueRepository playlistQueueRepository;

    public PlaylistCleanupService(PlaylistRepository Prepository, PlaylistQueueRepository PQrepository) {
        this.playlistRepository = Prepository;
        this.playlistQueueRepository = PQrepository;
    }

    @Scheduled(cron = "0 0 2 * * ?") // every day at 2 am
    @Transactional
    public void deleteOldSessions() {
        Instant cutoff = Instant.now().minus(1, ChronoUnit.DAYS);
        List<Playlist> oldPlaylists = playlistRepository.findByCreatedAtBefore(cutoff);

        for (Playlist playlist : oldPlaylists) {
            Long sessionId = playlist.getSession();
            playlistQueueRepository.deleteByIdSession(sessionId);
            playlistRepository.delete(playlist);
        }
    }

}
