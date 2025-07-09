package de.sunTzu.announcementApp.service;

import de.sunTzu.announcementApp.model.Song;
import de.sunTzu.announcementApp.model.SongTransitionInfo;
import de.sunTzu.db.model.AudioFile;
import de.sunTzu.db.model.MetaData;
import de.sunTzu.db.repository.AudioFileRepository;
import de.sunTzu.db.repository.MetaDataRepository;
import de.sunTzu.file.service.FileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class AnnouncementService {

    @Autowired
    private AudioFileRepository audioFileRepository;

    @Autowired
    private MetaDataRepository metaDataRepository; // Inject MetaData repository

    @Autowired
    private FileService fileService;

    @Autowired
    private RestTemplate restTemplate;

    @Value("${genai.service.url}")
    private String genaiServiceUrl;

    public AudioFile createAnnouncement(Long id, Long prevId, List<Long> songIds, int type) throws IOException {
        // Step 1: Build the request object for the GenAI service
        SongTransitionInfo transitionInfo = new SongTransitionInfo();
        transitionInfo.setMessageType(type);

        // Fetch metadata for previous song, if it exists
        if (prevId != null) {
            metaDataRepository.findById(prevId).ifPresent(meta -> {
                transitionInfo.setPreviousSong(createSongFromMetaData(meta));
            });
        }

        // Fetch metadata for the next songs
        if (!songIds.isEmpty()) {
            metaDataRepository.findById(songIds.get(0)).ifPresent(meta -> {
                transitionInfo.setNextSong(createSongFromMetaData(meta));
            });
        }
        if (songIds.size() > 1) {
            metaDataRepository.findById(songIds.get(1)).ifPresent(meta -> {
                transitionInfo.setAfterNextSong(createSongFromMetaData(meta));
            });
        }

        // Step 2: Call the GenAI service with the constructed object
        byte[] audioData = restTemplate.postForObject(genaiServiceUrl, transitionInfo, byte[].class);

        if (audioData == null || audioData.length == 0) {
            throw new IOException("Failed to retrieve audio data from GenAI service.");
        }

        // Step 3: Save the file and create the database entry
        String filename = "announcement_" + id + ".mp3";
        fileService.createFile(filename, audioData);

        AudioFile audioFileEntry = new AudioFile(id, filename);
        return audioFileRepository.save(audioFileEntry);
    }

    private Song createSongFromMetaData(MetaData metaData) {
        Map<String, Object> data = metaData.getData();
        return new Song((String) data.get("title"), (String) data.get("artist"));
    }
}