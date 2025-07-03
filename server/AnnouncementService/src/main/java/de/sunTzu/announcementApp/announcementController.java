package de.sunTzu.announcementApp;

import de.sunTzu.announcementApp.service.AnnouncementService;
import de.sunTzu.db.model.AudioFile;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/announcement")
public class announcementController {

    @Autowired
    private AnnouncementService announcementService;

    @PostMapping
    public ResponseEntity<AudioFile> createAnnouncement(
            @RequestParam Long id,
            @RequestParam(required = false) Long prevId,
            @RequestParam List<Long> songIds,
            @RequestParam int type) {
        try {
            AudioFile newAudioFile = announcementService.createAnnouncement(id, prevId, songIds, type);
            return new ResponseEntity<>(newAudioFile, HttpStatus.CREATED);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}