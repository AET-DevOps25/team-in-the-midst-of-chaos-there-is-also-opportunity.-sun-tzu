package de.sunTzu.playlistApp;

import java.util.*;
import java.util.stream.Collectors;

import de.sunTzu.db.model.MetaData;
import de.sunTzu.db.service.PlaylistQueueService;
import de.sunTzu.db.service.PlaylistService;
import de.sunTzu.playlistApp.model.PlaylistHandler;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.enums.ParameterStyle;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.bind.annotation.*;

import de.sunTzu.db.service.MetaDataService;

@RestController
public class playlistController {

    private final MetaDataService service;
    PlaylistHandler playlistAcc;

    private Long getRandomSong() {
        Random rand = new Random();
        List<MetaData> availableSongs = service.getAllSongs();
        return availableSongs.get(rand.nextInt(availableSongs.size())).getId();
    }

    playlistController(MetaDataService MDservice, PlaylistService Pservice, PlaylistQueueService PQservice) {
        this.playlistAcc = new PlaylistHandler(Pservice, PQservice);
        this.service = MDservice;
    }

    @GetMapping(value = "/greet", produces = "application/json")
    public Map<String, String> sayHello() {
        return Collections.singletonMap("message", "Hello World!");
    }

    // Playlist
    @Operation(summary = "Register new session")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "session registered",
                    content = @Content(mediaType = "application/json",
                            examples = @ExampleObject(name = "NewSessionExample", value = "{ \"session\": 3 }")
                    ))
    })
    @PostMapping(value = "/newPlaylist", produces = "application/json")
    public Map<String, Long> createNewSession(HttpServletResponse response) {
        // register new session along with playlist
        Long newSession = playlistAcc.createPlaylist();
        // insert 3 random songs
        playlistAcc.addMultiToPlaylist(newSession, List.of(getRandomSong(), getRandomSong(), getRandomSong()));

        response.setStatus(HttpServletResponse.SC_OK);
        return Collections.singletonMap("session", newSession);
    }

    @Operation(summary = "Get the current audio ID from the playlist head")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Current audio found",
                    content = @Content(mediaType = "application/json",
                            examples = @ExampleObject(name = "CurrentAudioExample", value = "{ \"audio\": 42 }")
                    )),
            @ApiResponse(responseCode = "404", description = "No audio at playlist head", content = @Content())
    })
    @GetMapping(value = "/currentAudio", produces = "application/json")
    public Map<String, Long> provideCurrAudio(
            @Parameter(description = "session ID", required = true) @RequestParam("session") Long session,
            HttpServletResponse response) {
        Optional<Long> head = playlistAcc.getPlaylistHead(session);

        if (!head.isPresent()) {
            response.setStatus(HttpServletResponse.SC_NOT_FOUND);
            return Map.of();
        }

        response.setStatus(HttpServletResponse.SC_OK);
        return Collections.singletonMap("audio", head.get());
    }

    @Operation(summary = "Get list of audio IDs in playlist")
    @ApiResponse(responseCode = "200", description = "List of audio IDs",
            content = @Content(mediaType = "application/json",
                    examples = @ExampleObject(name = "NextSongsExample", value = "{ \"audio\": [101, 102, 103] }")
            ))
    @GetMapping(value = "/nextAudios", produces = "application/json")
    public Map<String, List<Long>> providePlaylist(
            @Parameter(description = "session ID", required = true) @RequestParam("session") Long session,
            HttpServletResponse response) {
        // throw error when playlist is empty?
        response.setStatus(HttpServletResponse.SC_OK);
        return Collections.singletonMap("audio", playlistAcc.getPlaylist(session));
    }

    @Operation(summary = "Add a song to the playlist by ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Song added"),
            @ApiResponse(responseCode = "404", description = "Song or session not found")
    })
    @PostMapping(value = "/addSong")
    public void addSongPlaylist(
            @Parameter(description = "ID of the song to add", required = true) @RequestParam("song") Long song,
            @Parameter(description = "session ID", required = true) @RequestParam("session") Long session,
            HttpServletResponse response) {
        // check if ID exists
        Optional<MetaData> metaD = service.getById(song);

        if (metaD.isPresent()) {
            // check if session exists
            if (playlistAcc.addToPlaylist(session, song)) {
                response.setStatus(HttpServletResponse.SC_OK);
                return;
            }
        }

        response.setStatus(HttpServletResponse.SC_NOT_FOUND);
    }

    @Operation(summary = "Remove head of playlist")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Head removed (or already empty)"),
    })
    @DeleteMapping(value = "/removeHead")
    public void removeSongPlaylist(
            @Parameter(description = "session ID", required = true) @RequestParam("session") Long session,
            HttpServletResponse response) {

        playlistAcc.removeHeadFromPlaylist(session);

        // add next song randomly
        if (playlistAcc.getPlaylist(session).size() < 3) {
            playlistAcc.addToPlaylist(session, getRandomSong());
        }
        // TODO: if head was announcement additionally delete from database and volume

        response.setStatus(HttpServletResponse.SC_OK);
    }

    // Metadata
    @Operation(summary = "Get metadata for a specific song by ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Metadata retrieved",
                    content = @Content(mediaType = "application/json",
                            examples = @ExampleObject(name = "MetadataExample", value = "{ \"title\": \"test title\", \"type\": \"song/announcement\", \"artist\": \"test artist\", \"release_date\": \"DD-MM-YYYY\", \"genre\": \"test genre\" }")
                    )),
            @ApiResponse(responseCode = "404", description = "Metadata not found", content = @Content())
    })
    @GetMapping(value = "/metadata", produces = "application/json")
    public Map<String, String> provideMetaData(
            @Parameter(description = "ID of the song", required = true) @RequestParam("id") Long id,
            HttpServletRequest request,
            HttpServletResponse response) {
        MetaData metaD = service.getById(id).orElse(null);

        if (metaD == null) {
            response.setStatus(HttpServletResponse.SC_NOT_FOUND);
            return Map.of();
        }

        response.setStatus(HttpServletResponse.SC_OK);
        return metaD.getData();
    }

    @Operation(summary = "Get metadata for multiple songs by IDs")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Metadata list retrieved",
                    content = @Content(mediaType = "application/json",
                            examples = @ExampleObject(name = "MetadataMultiExample", value = "[{ \"title\": \"test title\", \"type\": \"song/announcement\", \"artist\": \"test artist\", \"release_date\": \"DD-MM-YYYY\", \"genre\": \"test genre\" }, { \"title\": \"test title 2\", \"type\": \"song/announcement\", \"artist\": \"test artist 2\", \"release_date\": \"DD-MM-YYYY\", \"genre\": \"test genre 2\" }]")
                    )),
            @ApiResponse(responseCode = "404", description = "One or more metadata entries not found")
    })
    @GetMapping(value = "/metadataMulti", produces = "application/json")
    public List<Map<String, String>> provideMetaDataMulti(
            @Parameter(description = "IDs of the songs", required = true, style = ParameterStyle.SIMPLE, example = "1,2,3", schema = @Schema(type = "array")) @RequestParam("ids") List<Long> ids,
            HttpServletRequest request,
            HttpServletResponse response) {
        List<Map<String, String>> returnMeta = new ArrayList<>();

        for (Long id : ids) {
            MetaData metaD = service.getById((Long) id).orElse(null);

            if (metaD == null) {
                response.setStatus(HttpServletResponse.SC_NOT_FOUND);
                return List.of(Map.of());
            }

            returnMeta.add(metaD.getData());
        }

        response.setStatus(HttpServletResponse.SC_OK);
        return returnMeta;
    }

    // Search functionality (return all ids of songs whose titles begin with prefix)
    @Operation(summary = "Find songs by title prefix (case insensitive)")
    @ApiResponse(responseCode = "200", description = "Matching song IDs returned",
            content = @Content(mediaType = "application/json",
                    examples = @ExampleObject(name = "TitlePrefixExample", value = "{\"IDs\": [101, 102, 103]}")))
    @GetMapping(value = "/find", produces = "application/json")
    public Map<String,List<Long>> matchingSongs(
            @Parameter(description = "Title prefix", required = true) @RequestParam("prefix") String prefix,
            HttpServletResponse response) {
        List<MetaData> startingPre = service.getAllStartWith(prefix);

        return Collections.singletonMap("IDs", startingPre.stream().map(MetaData::getId).collect(Collectors.toList()));
    }
}
