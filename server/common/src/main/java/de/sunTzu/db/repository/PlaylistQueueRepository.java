package de.sunTzu.db.repository;

import de.sunTzu.db.model.PlaylistQueue;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PlaylistQueueRepository extends JpaRepository<PlaylistQueue, Long> {
    List<PlaylistQueue> findAllByIdSessionOrderByIdQueuePosAsc(Long session_id);

    Optional<PlaylistQueue> findByIdSessionAndIdQueuePos(Long session_id, Long head);

    void deleteByIdSessionAndIdQueuePos(Long session_id, Long queue_pos);
}
