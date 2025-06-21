package de.sunTzu.announcementApp;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

class AnnouncementApplicationTests {

	private announcementController controller;

	@BeforeEach
	void setup() {
		controller = new announcementController(null, null, null);
	}

	@Test
	void testSayHello() {
		assertEquals("Hello World!", controller.sayHello());
	}
}
