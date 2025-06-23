package de.sunTzu.db.repository;

import de.sunTzu.db.model.Playlist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

@Repository
public interface PlaylistRepository extends JpaRepository<Playlist, Long> {

    @Transactional
    void deleteByCreatedAtBefore(Instant cutoffTime);

    List<Playlist> findByCreatedAtBefore(Instant cutoffTime);
}
