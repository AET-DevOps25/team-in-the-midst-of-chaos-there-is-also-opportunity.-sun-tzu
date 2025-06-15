package de.sunTzu.db.model;

import jakarta.persistence.*;

@Entity
@Table(name = "playlists")
public class Playlist {
    @Id
    private Long session;

    @Column(name = "head")
    private Long head;

    @Column(name = "tail")
    private Long tail;

    public Playlist() { }

    public Long getHead() { return head; }
    public Long getTail() { return tail; }
    public void setSession(Long session) { this.session = session; }
    public void setHead(Long head) { this.head = head; }
    public void setTail(Long tail) { this.tail = tail; }
}
