package de.sunTzu.db.service;

import de.sunTzu.db.model.AudioFile;
import de.sunTzu.db.repository.AudioFileRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AudioFileService {
    private final AudioFileRepository repository;

    public AudioFileService(AudioFileRepository repository) {
        this.repository = repository;
    }

    public Optional<AudioFile> getById(Long id) {
        return repository.findById(id);
    }
}
