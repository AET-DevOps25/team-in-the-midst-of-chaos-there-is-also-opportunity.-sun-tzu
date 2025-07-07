package de.sunTzu.playlistApp.model;

import de.sunTzu.db.service.MetaDataService;
import de.sunTzu.playlistApp.service.AsyncPostService;

import java.util.List;
import java.util.Random;

public class AnnouncementHandler {
    private final MetaDataService MDservice;
    private final AsyncPostService APservice;
    private final int shortAnnouncementType = 1;
    private final int longAnnouncementType = 2;
    private final int userAnnouncementType = 3;

    public AnnouncementHandler(MetaDataService MDservice, AsyncPostService APservice) {
        this.MDservice = MDservice;
        this.APservice = APservice;
    }

    private Integer getRandomAnnouncementType() {
        Random rand = new Random();
        return List.of(shortAnnouncementType, longAnnouncementType).get(rand.nextInt(2));
    }

    public Long registerNewAnnouncement() {
        // create new meta_data entry
        Long newAnnouncementId = MDservice.addAnnouncement();
        return newAnnouncementId;
    }

    public void requestNewAnnouncement(Long id, Long prevId, List<Long> songIds) {
        // Select from short or long type randomly
        APservice.sendAsynAnnouncementPost(id, prevId, songIds, getRandomAnnouncementType());
    }

    public void requestNewUserAnnouncement(Long id, Long prevId, List<Long> songIds) {
        APservice.sendAsynAnnouncementPost(id, prevId, songIds, userAnnouncementType);
    }

}
