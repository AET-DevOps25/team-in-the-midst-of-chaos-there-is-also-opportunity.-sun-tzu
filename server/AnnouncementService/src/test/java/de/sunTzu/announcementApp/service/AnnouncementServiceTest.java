package de.sunTzu.announcementApp.service;

import de.sunTzu.announcementApp.model.SongTransitionInfo;
import de.sunTzu.db.model.AudioFile;
import de.sunTzu.db.model.MetaData;
import de.sunTzu.db.repository.AudioFileRepository;
import de.sunTzu.db.repository.MetaDataRepository;
import de.sunTzu.file.service.FileService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.lang.reflect.Field;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class AnnouncementServiceTest {

    @Mock
    private AudioFileRepository audioFileRepository;

    @Mock
    private MetaDataRepository metaDataRepository;

    @Mock
    private FileService fileService;

    @Mock
    private RestTemplate restTemplate;

    @InjectMocks
    private AnnouncementService announcementService;

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(announcementService, "genaiServiceUrl", "http://fake-genai-url.com/generate");
    }

    @Test
    void createAnnouncement_shouldWorkCorrectly() throws IOException, NoSuchFieldException, IllegalAccessException {
        // --- ARRANGE ---
        long announcementId = 99L;
        long prevSongId = 1L;
        List<Long> nextSongIds = List.of(2L, 3L);
        int messageType = 2;

        // Create mock metadata objects using reflection since there are no setters
        MetaData prevSongMeta = new MetaData();
        setField(prevSongMeta, "id", prevSongId);
        setField(prevSongMeta, "title", "Yesterday");
        setField(prevSongMeta, "artist", "The Beatles");

        MetaData nextSongMeta = new MetaData();
        setField(nextSongMeta, "id", nextSongIds.get(0));
        setField(nextSongMeta, "title", "Bohemian Rhapsody");
        setField(nextSongMeta, "artist", "Queen");

        MetaData afterNextSongMeta = new MetaData();
        setField(afterNextSongMeta, "id", nextSongIds.get(1));
        setField(afterNextSongMeta, "title", "Stairway to Heaven");
        setField(afterNextSongMeta, "artist", "Led Zeppelin");

        when(metaDataRepository.findById(prevSongId)).thenReturn(Optional.of(prevSongMeta));
        when(metaDataRepository.findById(nextSongIds.get(0))).thenReturn(Optional.of(nextSongMeta));
        when(metaDataRepository.findById(nextSongIds.get(1))).thenReturn(Optional.of(afterNextSongMeta));

        byte[] fakeAudioData = "fake audio data".getBytes();
        when(restTemplate.postForObject(anyString(), any(SongTransitionInfo.class), eq(byte[].class))).thenReturn(fakeAudioData);

        String expectedFilename = "announcement_" + announcementId + ".mp3";
        AudioFile expectedSavedAudioFile = new AudioFile(announcementId, expectedFilename);
        when(audioFileRepository.save(any(AudioFile.class))).thenReturn(expectedSavedAudioFile);

        // --- ACT ---
        AudioFile result = announcementService.createAnnouncement(announcementId, prevSongId, nextSongIds, messageType);

        // --- ASSERT ---
        assertNotNull(result);
        assertEquals(expectedSavedAudioFile, result);
        verify(fileService, times(1)).createFile(expectedFilename, fakeAudioData);
    }

    // Helper function to set private fields using reflection
    private void setField(Object targetObject, String fieldName, Object value) throws NoSuchFieldException, IllegalAccessException {
        Field field = targetObject.getClass().getDeclaredField(fieldName);
        field.setAccessible(true);
        field.set(targetObject, value);
    }
}