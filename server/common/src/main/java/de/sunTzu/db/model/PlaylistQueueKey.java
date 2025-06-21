package de.sunTzu.db.model;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class PlaylistQueueKey implements Serializable {

    @Column(name = "session")
    private Long session;
    @Column(name = "queue_pos")
    private Long queuePos;

    public PlaylistQueueKey() { }

    public PlaylistQueueKey(Long session, Long queuePos) {
        this.session = session;
        this.queuePos = queuePos;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof PlaylistQueueKey)) return false;
        PlaylistQueueKey that = (PlaylistQueueKey) o;
        return Objects.equals(session, that.session) &&
                Objects.equals(queuePos, that.queuePos);
    }

    @Override
    public int hashCode() {
        return Objects.hash(session, queuePos);
    }
}
