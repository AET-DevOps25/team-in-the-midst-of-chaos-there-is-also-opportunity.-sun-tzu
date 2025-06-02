package de.sunTzu.streamApp;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HelloWorld {
    @GetMapping(value = "/api/stream", produces = "text/plain")
    public String sayHello() {
        return "Hello World!";
    }
}
