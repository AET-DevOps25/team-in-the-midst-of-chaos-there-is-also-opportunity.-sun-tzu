package de.sunTzu.playlistApp;

import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

import de.sunTzu.db.model.MetaData; // Keep your internal DB model
import de.sunTzu.db.service.AudioFileService;
import de.sunTzu.db.service.PlaylistQueueService;
import de.sunTzu.db.service.PlaylistService;
import de.sunTzu.db.service.MetaDataService;
import de.sunTzu.playlistApp.model.PlaylistHandler;
import de.sunTzu.file.service.FileService;

// --- REMOVE ALL SWAGGER/SPRINGDOC IMPORTS ---
// import io.swagger.v3.oas.annotations.Operation;
// import io.swagger.v3.oas.annotations.Parameter;
// import io.swagger.v3.oas.annotations.enums.ParameterStyle;
// import io.swagger.v3.oas.annotations.media.Content;
// import io.swagger.v3.oas.annotations.media.ExampleObject;
// import io.swagger.v3.oas.annotations.media.Schema;
// import io.swagger.v3.oas.annotations.responses.ApiResponse;
// import io.swagger.v3.oas.annotations.responses.ApiResponses;
// --- END REMOVE ---

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;

// --- START Generated Imports ---
import de.sunTzu.generated.api.PlaylistsApi; // Import the generated API interface
import de.sunTzu.generated.model.Metadata; // Import the generated Metadata model
// --- END Generated Imports ---

@RestController
public class playlistController implements PlaylistsApi { // Implement the generated interface

    private final MetaDataService MDservice;
    private final AudioFileService AFservice;
    private final FileService fileService;
    private final RestTemplate restTemplate;
    PlaylistHandler playlistAcc;

    private Long getRandomSong() {
        Random rand = new Random();
        List<MetaData> availableSongs = MDservice.getAllSongs();
        return availableSongs.get(rand.nextInt(availableSongs.size())).getId();
    }

    public playlistController(MetaDataService MDservice, AudioFileService AFservice, PlaylistService Pservice, PlaylistQueueService PQservice, FileService Fservice, RestTemplate restTemplate) {
        this.playlistAcc = new PlaylistHandler(Pservice, PQservice);
        this.MDservice = MDservice;
        this.AFservice = AFservice;
        this.fileService = Fservice;
        this.restTemplate = restTemplate;
    }

    @Override // Added @Override
    @GetMapping(value = "/greet", produces = "application/json")
    public ResponseEntity<Map<String, String>> playlistGreet() {
        return ResponseEntity.ok(Collections.singletonMap("message", "Hello World!"));
    }

    @Override // Added @Override
    @PostMapping(value = "/newPlaylist", produces = "application/json")
    public ResponseEntity<Map<String, Long>> createNewSession() {
        Long newSession = playlistAcc.createPlaylist();
        playlistAcc.addMultiToPlaylist(newSession, List.of(getRandomSong(), getRandomSong(), getRandomSong()));
        return new ResponseEntity<>(Collections.singletonMap("session", newSession), HttpStatus.OK);
    }

    @Override // Added @Override
    @GetMapping(value = "/currentAudio", produces = "application/json")
    public ResponseEntity<Map<String, Long>> provideCurrentAudio(
            @RequestParam("session") Long session) {
        Optional<Long> head = playlistAcc.getPlaylistHead(session);

        if (head.isEmpty()) {
            return new ResponseEntity<>(Map.of(), HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(Collections.singletonMap("audio", head.get()), HttpStatus.OK);
    }

    @Override // Added @Override
    @GetMapping(value = "/nextAudios", produces = "application/json")
    public ResponseEntity<Map<String, List<Long>>> provideNextAudios(
            @RequestParam("session") Long session) {
        return new ResponseEntity<>(Collections.singletonMap("audio", playlistAcc.getPlaylist(session)), HttpStatus.OK);
    }

    @Override // Added @Override
    @PostMapping(value = "/addSong")
    public ResponseEntity<Void> addSongToPlaylist(
            @RequestParam("song") Long song,
            @RequestParam("session") Long session) {
        Optional<MetaData> metaD = MDservice.getById(song);
        if (metaD.isPresent()) {
            if (playlistAcc.addToPlaylist(session, song)) {
                return new ResponseEntity<>(HttpStatus.OK);
            }
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @Override // Added @Override
    @DeleteMapping(value = "/removeHead")
    public ResponseEntity<Void> removeHeadFromPlaylist(
            @RequestParam("session") Long session) {
        Optional<Long> head_audioOpt = playlistAcc.getPlaylistHead(session);

        if (head_audioOpt.isPresent()) {
            Long head_audio = head_audioOpt.get();
            Optional<MetaData> metaAnnOpt = MDservice.getById(head_audio);
            if (metaAnnOpt.isPresent()) {
                if (Objects.equals(metaAnnOpt.get().getData().get("type"), "announcement")) {
                    MDservice.delete(metaAnnOpt.get());
                    // TODO: Uncomment once announcements have their own audiofiles
                    // fileService.deleteFile(AFservice.getById(head_audio).get().getFilename());
                    // AFservice.deleteById(head_audio);
                }
            }
            playlistAcc.removeHeadFromPlaylist(session);
        }
        if (playlistAcc.getPlaylist(session).size() < 3) {
            playlistAcc.addToPlaylist(session, getRandomSong());
        }
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @Override // Added @Override
    @GetMapping(value = "/metadata", produces = "application/json")
    public ResponseEntity<Metadata> provideMetaData(
            @RequestParam("id") Long id) {
        MetaData metaD = MDservice.getById(id).orElse(null);

        if (metaD == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        // --- START Conversion from internal MetaData to generated Metadata DTO ---
        Metadata generatedMetadata = toGeneratedMetadata(metaD);
        // --- END Conversion ---
        return new ResponseEntity<>(generatedMetadata, HttpStatus.OK);
    }

    @Override // Added @Override
    @GetMapping(value = "/metadataMulti", produces = "application/json")
    public ResponseEntity<List<Metadata>> provideMetaDataMulti(
            @RequestParam("ids") List<Long> ids) {
        List<Metadata> returnMeta = new ArrayList<>();

        for (Long id : ids) {
            MetaData metaD = MDservice.getById(id).orElse(null);
            if (metaD == null) {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND); // Or handle partial success based on API contract
            }
            // --- START Conversion from internal MetaData to generated Metadata DTO ---
            returnMeta.add(toGeneratedMetadata(metaD));
            // --- END Conversion ---
        }
        return new ResponseEntity<>(returnMeta, HttpStatus.OK);
    }

    @Override // Added @Override
    @GetMapping(value = "/find", produces = "application/json")
    public ResponseEntity<Map<String, List<Long>>> matchingSongsByPrefix(
            @RequestParam("prefix") String prefix) {
        List<MetaData> startingPre = MDservice.getAllStartWith(prefix);
        return new ResponseEntity<>(Collections.singletonMap("IDs", startingPre.stream().map(MetaData::getId).collect(Collectors.toList())), HttpStatus.OK);
    }

    /**
     * Helper method to convert internal MetaData entity to generated Metadata API model.
     * You might want to move this to a dedicated mapper class (e.g., using MapStruct)
     * or a utility class if this conversion is needed elsewhere.
     */
    private Metadata toGeneratedMetadata(MetaData dbMetaData) {
        if (dbMetaData == null) {
            return null;
        }
        Metadata generated = new Metadata();
        generated.setId(dbMetaData.getId());
        // Access data from dbMetaData.getData() based on your internal implementation
        generated.setType(dbMetaData.getData().get("type"));
        generated.setTitle(dbMetaData.getData().get("title"));
        generated.setArtist(dbMetaData.getData().get("artist"));
        generated.setReleaseDate(dbMetaData.getData().get("release_date"));
        generated.setGenre(dbMetaData.getData().get("genre"));
        return generated;
    }
}