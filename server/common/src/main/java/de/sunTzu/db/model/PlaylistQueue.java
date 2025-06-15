package de.sunTzu.db.model;

import jakarta.persistence.*;

@Entity
@Table(name = "playlist_q")
public class PlaylistQueue {
    @EmbeddedId
    @AttributeOverrides({
            @AttributeOverride(name = "session", column = @Column(name = "session", nullable = false)),
            @AttributeOverride(name = "queuePos", column = @Column(name = "queue_pos", nullable = false))
    })
    private PlaylistQueueKey id;

    @Column(name = "audio_id")
    private Long audio_id;

    public PlaylistQueue() { }

    public PlaylistQueueKey getId() { return id; }
    public Long getAudio_id() { return audio_id; }

    public Long getQueuePos() { return id.getQueuePos(); }

    public void setId(PlaylistQueueKey id) { this.id = id; }

    public void setAudio_id(Long audio_id) { this.audio_id = audio_id; }
}
