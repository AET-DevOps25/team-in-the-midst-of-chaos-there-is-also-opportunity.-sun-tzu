package de.sunTzu.db.service;

import de.sunTzu.db.model.AudioFile;
import de.sunTzu.db.repository.AudioFileRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

    @Transactional
    public void deleteById(Long id) {
        repository.deleteById(id);
    }

    @Transactional
    public void addFile(Long id, String filename) {
        AudioFile newAudioFile = new AudioFile(id, filename);
        repository.save(newAudioFile);
    }
}
