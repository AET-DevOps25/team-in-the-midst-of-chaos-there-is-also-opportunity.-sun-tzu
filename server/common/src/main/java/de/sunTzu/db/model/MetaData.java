package de.sunTzu.db.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.util.HashMap;
import java.util.Map;

@Entity
@Table(name = "meta_data")
public class MetaData {
    @Id
    private Long id;
    @Column
    private String title;
    @Column
    private String type;
    @Column
    private String artist;
    @Column
    private String release_date;
    @Column
    private String genre;

    public MetaData() {}

    public Long getId() {
        return id;
    }

    public Map<String, String> getData() {
        Map<String, String> returnMap = new HashMap<>();

        returnMap.put("type", type);
        returnMap.put("title", title);
        returnMap.put("artist", artist);
        returnMap.put("release_date", release_date);
        returnMap.put("genre", genre);

        return returnMap;
    }
}
