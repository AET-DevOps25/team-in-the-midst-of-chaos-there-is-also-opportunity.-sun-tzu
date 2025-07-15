package de.sunTzu.announcementApp;

import de.sunTzu.announcementApp.service.AnnouncementService;
import de.sunTzu.db.model.AudioFile;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
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

    @Operation(
            summary = "Create a New Audio Announcement",
            description = "This endpoint is responsible for generating and storing an audio file for a transition or announcement. " +
                    "It orchestrates the process of fetching metadata for surrounding songs, " +
                    "calling the `genai-service` to produce the audio, and then saving the resulting file.",
            responses = {
                    @ApiResponse(responseCode = "201", description = "Announcement Created Successfully",
                            content = @Content(mediaType = "application/json",
                                    schema = @Schema(implementation = AudioFile.class),
                                    examples = @ExampleObject(
                                            name = "Successful Announcement Creation",
                                            value = "{\n" +
                                                    "  \"id\": 123,\n" +
                                                    "  \"filename\": \"announcement_123.mp3\"\n" +
                                                    "}"
                                    )
                            )
                    ),
                    @ApiResponse(responseCode = "500", description = "Internal Server Error",
                            content = @Content(mediaType = "application/json",
                                    examples = @ExampleObject(
                                            name = "Error Response",
                                            value = "{ \"error\": \"Failed to create announcement\" }"
                                    )
                            )
                    )
            }
    )
    @PostMapping
    public ResponseEntity<AudioFile> createAnnouncement(
            @Parameter(description = "The primary ID for the new announcement. This ID must correspond to an entry already created by another service.", required = true, example = "123")
            @RequestParam Long id,

            @Parameter(description = "The ID of the song that played before the announcement.", required = false, example = "45")
            @RequestParam(required = false) Long prevId,

            @Parameter(description = "A comma-separated list of IDs for the upcoming one or two songs.", required = true, example = "56,78")
            @RequestParam List<Long> songIds,

            @Parameter(description = "An integer representing the type of message to be generated (e.g., 1 for a quick transition, 2 for a longer one, 3 for a user-requested song).", required = true, example = "1")
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