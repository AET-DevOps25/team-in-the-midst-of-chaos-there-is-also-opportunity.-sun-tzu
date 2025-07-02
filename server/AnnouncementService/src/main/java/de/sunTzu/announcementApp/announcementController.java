package de.sunTzu.announcementApp;

import de.sunTzu.db.service.AudioFileService;
import de.sunTzu.db.service.MetaDataService;
import de.sunTzu.file.service.FileService;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collections;
import java.util.List;
import java.util.Map;

// --- START Generated Imports ---
import de.sunTzu.generated.api.AnnouncementsApi; // Import the generated API interface
// --- END Generated Imports ---

@RestController
public class announcementController implements AnnouncementsApi { // Implement the generated interface

    private final MetaDataService MDservice;
    private final AudioFileService AFservice;
    private final FileService fileService;

    public announcementController(MetaDataService MDservice, AudioFileService AFservice, FileService Fservice) {
        this.MDservice = MDservice;
        this.AFservice = AFservice;
        fileService = Fservice;
    }

    @Override // Added @Override
    @GetMapping(value = "/greet", produces = "application/json")
    public Map<String, String> announcementGreet() { // Renamed to match openapi.yaml operationId
        return Collections.singletonMap("message", "Hello World!");
    }

    @Override // Added @Override
    @PostMapping("/createAnnouncement")
    public void createAnnouncement(
            @RequestParam("newID") Long newID,
            @RequestParam("audios") List<Long> audios,
            @RequestParam("type") Integer type,
            HttpServletResponse response // Keep HttpServletResponse if the generated interface still includes it
    ) {
        // Your existing logic here
        // for fetching meta data
        // MDservice.getById(meta_data_id).get().getData() to get meta data for a song

        // for inserting new audio in streamservice workflow (only fileName, no path)
        // AFservice.addFile(audio_id, filename) adds new audio file to audio_files table
        // fileService.createFile(fileName, data) to save a mp3 (bytes) in volume;

        // Set response status explicitly if the generated interface doesn't enforce a ResponseEntity
        response.setStatus(HttpServletResponse.SC_OK);
    }
}