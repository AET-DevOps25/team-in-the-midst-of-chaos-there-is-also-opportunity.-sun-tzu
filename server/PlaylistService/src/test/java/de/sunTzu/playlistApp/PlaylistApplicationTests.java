package de.sunTzu.playlistApp;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

class PlaylistApplicationTests {

	private playlistController controller;

	@BeforeEach
	void setup() {
		controller = new playlistController(null, null, null);
	}

	@Test
	void testSayHello() {
		assertEquals("Hello World!", controller.sayHello().get("message"));
	}
}
