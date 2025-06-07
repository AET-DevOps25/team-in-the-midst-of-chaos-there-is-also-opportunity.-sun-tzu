package de.sunTzu.playlistApp;

import java.util.Collections;
import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HelloWorld {
    @GetMapping(value = "/greet", produces = "application/json")
    public Map<String, String> sayHello() {
        return Collections.singletonMap("message", "Hello World!");
    }
}
