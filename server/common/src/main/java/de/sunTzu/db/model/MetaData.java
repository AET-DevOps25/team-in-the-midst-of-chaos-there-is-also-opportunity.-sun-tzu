package de.sunTzu.db.model;

import jakarta.persistence.*;

import java.util.HashMap;
import java.util.Map;

@Entity
@Table(name = "meta_data")
public class MetaData {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
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

    public MetaData(String type) {
        this.type = type;
    }

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
