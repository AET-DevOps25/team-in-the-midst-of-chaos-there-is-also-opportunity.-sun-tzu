package de.sunTzu.db.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "meta_data")
public class MetaData {
    @Id
    private Long id;

    public MetaData() {}
}
