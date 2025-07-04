package de.sunTzu.db.service;

import de.sunTzu.db.model.MetaData;
import de.sunTzu.db.repository.MetaDataRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class MetaDataService {
    private final MetaDataRepository repository;

    public MetaDataService(MetaDataRepository repository) { this.repository = repository;}

    public Optional<MetaData> getById(Long id) {
        return repository.findById(id);
    }

    public List<MetaData> getAllSongs() { return repository.findAllByType("song"); }

    public List<MetaData> getAllStartWith(String pre) { return repository.findByTitleIgnoreCaseStartingWith(pre); }

    @Transactional
    public void delete(MetaData m) { repository.delete(m); }

    @Transactional
    public Long addAnnouncement() {
        MetaData newEntry = new MetaData("announcement");
        return repository.save(newEntry).getId();
    }
}
