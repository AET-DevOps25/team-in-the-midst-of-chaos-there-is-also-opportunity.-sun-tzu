package de.sunTzu.db.model;

import jakarta.persistence.*;

import java.time.Instant;

@Entity
@Table(name = "playlists")
public class Playlist {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long session;

    @Column(name = "head")
    private Long head;

    @Column(name = "tail")
    private Long tail;

    @Column(name = "created_at")
    private Instant createdAt;

    public Playlist() { }

    public Playlist(Long head, Long tail, Instant createdAt) {
        this.head = head;
        this.tail = tail;
        this.createdAt = createdAt;
    }

    public Long getHead() { return head; }
    public Long getTail() { return tail; }
    public Long getSession() { return session; }
    public void setSession(Long session) { this.session = session; }
    public void setHead(Long head) { this.head = head; }
    public void setTail(Long tail) { this.tail = tail; }
}
