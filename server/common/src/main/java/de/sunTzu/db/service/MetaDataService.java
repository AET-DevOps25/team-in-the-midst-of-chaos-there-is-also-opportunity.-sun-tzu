package de.sunTzu.db.service;

import de.sunTzu.db.repository.MetaDataRepository;

public class MetaDataService {
    private final MetaDataRepository repository;

    public MetaDataService(MetaDataRepository repository) { this.repository = repository;}
}
