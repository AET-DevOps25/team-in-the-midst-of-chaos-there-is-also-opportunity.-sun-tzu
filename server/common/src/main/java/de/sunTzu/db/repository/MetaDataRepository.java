package de.sunTzu.db.repository;

import de.sunTzu.db.model.MetaData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MetaDataRepository extends JpaRepository<MetaData, Long> {
    List<MetaData> findByTitleIgnoreCaseStartingWith(String title);

    List<MetaData> findAllByType(String type);
}
