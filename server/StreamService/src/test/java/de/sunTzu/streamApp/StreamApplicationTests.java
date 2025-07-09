package de.sunTzu.streamApp;

import de.sunTzu.streamApp.model.RangeResponse;
import de.sunTzu.streamApp.service.AudioStreamRangeService;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@TestInstance(TestInstance.Lifecycle.PER_CLASS)
class StreamApplicationTests {

	private streamController controller;
	@BeforeAll
	void setup() {
		controller = new streamController(null);
	}
	@Test
	void testSayHello() {
		assertEquals("Hello World!", controller.sayHello());
	}

	@Test
	void parseValidRange() {
		Optional<RangeResponse> result = AudioStreamRangeService.parseRangeHeader("bytes=100-499", 1000);
		assertTrue(result.isPresent());
		assertEquals(100, result.get().getStart());
		assertEquals(499, result.get().getEnd());
		assertEquals(400, result.get().getContentLength());
	}

	@Test
	void parseOpenEndedRange() {
		Optional<RangeResponse> result = AudioStreamRangeService.parseRangeHeader("bytes=100-", 1000);
		assertTrue(result.isPresent());
	}

	@Test
	void parseInvalidRange() {
		Optional<RangeResponse> result = AudioStreamRangeService.parseRangeHeader("foobar", 1000);
		assertTrue(result.isPresent());
		assertEquals(0, result.get().getStart());
		assertEquals(999, result.get().getEnd());
		assertEquals(1000, result.get().getContentLength());
	}

	@Test
	void parseInvalidNumbers() {
		Optional<RangeResponse> result = AudioStreamRangeService.parseRangeHeader("bytes=foo-bar", 1000);
		assertFalse(result.isPresent());
	}

	@Test
	void parseStartGreaterThanEnd() {
		Optional<RangeResponse> result = AudioStreamRangeService.parseRangeHeader("bytes=400-200", 1000);
		assertFalse(result.isPresent());
	}

	@Test
	void parseEndOutOfBounds() {
		Optional<RangeResponse> result = AudioStreamRangeService.parseRangeHeader("bytes=0-2000", 1000);
		assertFalse(result.isPresent());
	}
}
