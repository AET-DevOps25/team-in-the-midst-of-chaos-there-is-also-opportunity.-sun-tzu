package de.sunTzu.playlistApp;

import de.sunTzu.db.model.Playlist;
import de.sunTzu.db.model.PlaylistQueue;
import de.sunTzu.db.service.PlaylistQueueService;
import de.sunTzu.db.service.PlaylistService;
import de.sunTzu.playlistApp.model.PlaylistHandler;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Instant;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class PlaylistApplicationTests {

	@Mock
	private PlaylistService playlistService;

	@Mock
	private PlaylistQueueService playlistQueueService;

	@InjectMocks
	private PlaylistHandler playlistHandler;

	@Test
	public void testGetPlaylistHead_succes() {
		Playlist mockPlaylist = new Playlist(0L, 3L, Instant.now());
		PlaylistQueue mockPlaylistQ = new PlaylistQueue(1L, 0L, 14L);

		when(playlistService.getBySession(1L)).thenReturn(Optional.of(mockPlaylist));
		when(playlistQueueService.getPlaylistHeadBySession(1L, 0L)).thenReturn(Optional.of(mockPlaylistQ));

		Optional<Long> result = playlistHandler.getPlaylistHead(1L);

		assertEquals(14L, result.get());
	}

	@Test
	public void testGetPlaylistHead_failure_noPlaylistForSession() {
		Playlist mockPlaylist = new Playlist(0L, 3L, Instant.now());
		PlaylistQueue mockPlaylistQ = new PlaylistQueue(1L, 0L, 14L);

		when(playlistService.getBySession(2L)).thenReturn(Optional.empty());

		Optional<Long> result = playlistHandler.getPlaylistHead(2L);

		assertEquals(Optional.empty(), result);
	}

	@Test
	public void testRemoveHeadFromPlaylist_valid() {
		Playlist mockPlaylist = new Playlist(0L, 3L, Instant.now());
		when(playlistService.getBySession(5L)).thenReturn(Optional.of(mockPlaylist));

		playlistHandler.removeHeadFromPlaylist(5L);

		verify(playlistQueueService).removeHeadFromPlaylist(5L, 0L);
		verify(playlistService).updatePlaylistHead(5L, 1L);
	}
}
