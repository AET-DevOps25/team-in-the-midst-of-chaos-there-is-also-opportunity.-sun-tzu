package de.sunTzu.playlistApp;

import java.util.*;
import java.util.stream.Collectors;

import de.sunTzu.db.model.MetaData;
import de.sunTzu.playlistApp.model.Playlist;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.enums.ParameterStyle;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.annotation.PostConstruct;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.bind.annotation.*;

import de.sunTzu.db.service.MetaDataService;

@RestController
public class playlistController {

    Playlist playlist;
    private final MetaDataService service;

    private Long getRandomSong() {
        Random rand = new Random();
        List<MetaData> availableSongs = service.getAllSongs();
        return availableSongs.get(rand.nextInt(availableSongs.size())).getId();
    }

    playlistController(MetaDataService service) {
        this.service = service;
    }

    @PostConstruct
    public void initPlaylist() {
        if (service != null) {
            this.playlist = new Playlist();
            // initialize playlist with 3 random songs
            playlist.addMultiToPlaylist(List.of(getRandomSong(), getRandomSong(), getRandomSong()));
        }
    }

    @GetMapping(value = "/greet", produces = "application/json")
    public Map<String, String> sayHello() {
        return Collections.singletonMap("message", "Hello World!");
    }


    // Playlist
    @Operation(summary = "Get the current song ID from the playlist head")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Current song found",
                    content = @Content(mediaType = "application/json",
                            examples = @ExampleObject(name = "CurrentSongExample", value = "{ \"ID\": 42 }")
                    )),
            @ApiResponse(responseCode = "404", description = "No song at playlist head", content = @Content())
    })
    @GetMapping(value = "/currentSong", produces = "application/json")
    public Map<String, Long> provideCurrSong(
            HttpServletResponse response) {
        Long head = playlist.getPlaylistHead();

        if (head == null) {
            response.setStatus(HttpServletResponse.SC_NOT_FOUND);
            return Map.of();
        }

        response.setStatus(HttpServletResponse.SC_OK);
        return Collections.singletonMap("ID", head);
    }

    @Operation(summary = "Get list of IDs in playlist")
    @ApiResponse(responseCode = "200", description = "List of song IDs",
            content = @Content(mediaType = "application/json",
                    examples = @ExampleObject(name = "NextSongsExample", value = "{ \"IDs\": [101, 102, 103] }")
            ))
    @GetMapping(value = "/nextSongs", produces = "application/json")
    public Map<String, List<Long>> providePlaylist(
            HttpServletResponse response) {
        // throw error when playlist is empty?
        response.setStatus(HttpServletResponse.SC_OK);
        return Collections.singletonMap("IDs", playlist.getPlaylist());
    }

    @Operation(summary = "Add a song to the playlist by ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Song added"),
            @ApiResponse(responseCode = "404", description = "Song with given ID not found")
    })
    @PostMapping(value = "/addSong")
    public void addSongPlaylist(
            @Parameter(description = "ID of the song to add", required = true) @RequestParam("id") Long id,
            HttpServletResponse response) {
        // check if ID exists
        MetaData metaD = service.getById(id).orElse(null);

        if (metaD == null) {
            response.setStatus(HttpServletResponse.SC_NOT_FOUND);
            return;
        }

        playlist.addToPlaylist(id);
        response.setStatus(HttpServletResponse.SC_OK);
    }

    @Operation(summary = "Remove head of playlist")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Head removed"),
            @ApiResponse(responseCode = "404", description = "No head to remove")
    })
    @DeleteMapping(value = "/removeHead")
    public void removeSongPlaylist(
            HttpServletResponse response) {
        Long head = playlist.getPlaylistHead();

        if (head != null) {
            playlist.removeHeadFromPlaylist();

            // add next song randomly
            if (playlist.getPlaylist().size() < 3) {
                playlist.addToPlaylist(getRandomSong());
            }
            // TODO: if head was announcement additionally delete from database and volume

            response.setStatus(HttpServletResponse.SC_OK);
        } else {
            response.setStatus(HttpServletResponse.SC_NOT_FOUND);
        }
    }

    // Metadata
    @Operation(summary = "Get metadata for a specific song by ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Metadata retrieved",
                    content = @Content(mediaType = "application/json",
                            examples = @ExampleObject(name = "MetadataExample", value = "{ \"title\": \"test title\", \"artist\": \"test artist\", \"release_date\": \"DD-MM-YYYY\", \"genre\": \"test genre\" }")
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
                            examples = @ExampleObject(name = "MetadataMultiExample", value = "[{ \"title\": \"test title\", \"artist\": \"test artist\", \"release_date\": \"DD-MM-YYYY\", \"genre\": \"test genre\" }, { \"title\": \"test title 2\", \"artist\": \"test artist 2\", \"release_date\": \"DD-MM-YYYY\", \"genre\": \"test genre 2\" }]")
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
