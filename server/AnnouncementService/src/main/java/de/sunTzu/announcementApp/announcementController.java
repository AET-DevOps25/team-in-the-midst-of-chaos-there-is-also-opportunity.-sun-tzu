package de.sunTzu.announcementApp;

import de.sunTzu.db.service.AudioFileService;
import de.sunTzu.db.service.MetaDataService;
import de.sunTzu.file.service.FileService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collections;
import java.util.List;
import java.util.Map;

@RestController
public class announcementController {

    private final MetaDataService MDservice;
    private final AudioFileService AFservice;
    private final FileService fileService;

    public announcementController(MetaDataService MDservice, AudioFileService AFservice, FileService Fservice) {
        this.MDservice = MDservice;
        this.AFservice = AFservice;
        fileService = Fservice;
    }

    @GetMapping(value = "/greet", produces = "application/json")
    public Map<String, String> sayHello() {
        return Collections.singletonMap("message", "Hello World!");
    }

    @PostMapping("/createAnnouncement")
    public void createAnnouncement(
            @RequestParam("newID") Long newID, // audio id for announcement to insert in audio_files table
            @RequestParam("audios") List<Long> audios, // list of audio ids that the announcement is about
            @RequestParam("type") Integer type // type of announcement (start = 1, middle/std = 2, user wish = 3 ?)
    ) {
        // for fetching meta data
        // MDservice.getById(meta_data_id).get().getData() to get meta data for a song

        // for inserting new audio in streamservice workflow (only fileName, no path)
        // AFservice.addFile(audio_id, filename) adds new audio file to audio_files table
        // fileService.createFile(fileName, data) to save a mp3 (bytes) in volume;
    }
}
