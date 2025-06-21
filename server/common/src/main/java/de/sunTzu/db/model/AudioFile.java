package de.sunTzu.db.model;

import jakarta.persistence.*;

@Entity
@Table(name = "audio_files")
public class AudioFile {
    @Id
    private Long id;

    @Column(nullable = false)
    private String filename;

    public AudioFile() {}

    public AudioFile(Long id, String filename) {
        this.id = id;
        this.filename = filename;
    }

    public String getFilename() {
        return filename;
    }
}
