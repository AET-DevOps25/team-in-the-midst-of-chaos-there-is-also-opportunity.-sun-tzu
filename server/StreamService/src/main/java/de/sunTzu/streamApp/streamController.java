package de.sunTzu.streamApp;

import de.sunTzu.db.model.AudioFile; // Keep your internal DB model
import de.sunTzu.streamApp.model.RangeResponse; // Keep your internal model
import de.sunTzu.streamApp.service.AudioStreamRangeService; // Keep your internal service

// --- REMOVE ALL SWAGGER/SPRINGDOC IMPORTS ---
// import io.swagger.v3.oas.annotations.Operation;
// import io.swagger.v3.oas.annotations.Parameter;
// import io.swagger.v3.oas.annotations.enums.ParameterIn;
// import io.swagger.v3.oas.annotations.headers.Header;
// import io.swagger.v3.oas.annotations.media.Content;
// import io.swagger.v3.oas.annotations.responses.ApiResponse;
// import io.swagger.v3.oas.annotations.responses.ApiResponses;
// import io.swagger.v3.oas.annotations.tags.Tag;
// --- END REMOVE ---

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.HttpHeaders;

import java.io.File;
import java.io.IOException;
import java.io.OutputStream;
import java.io.RandomAccessFile;
import java.util.Optional;

import de.sunTzu.db.service.AudioFileService;
// --- START Generated Imports ---
import de.sunTzu.generated.api.StreamsApi; // Import the generated API interface
// --- END Generated Imports ---

@RestController
// @Tag(name = "Audio Streaming") // This tag is now defined in openapi.yaml
public class streamController implements StreamsApi { // Implement the generated interface
    @Value("${AUDIO_FILE_PATH:/audio}")
    private String AUDIO_PATH;
    private final AudioFileService service;

    public streamController(AudioFileService service) {
        this.service = service;
    }

    @Override // Added @Override
    @GetMapping(value = "/greet", produces = "text/plain")
    public ResponseEntity<String> streamGreet() { // Renamed to match openapi.yaml operationId
        return ResponseEntity.ok("Hello World!");
    }

    @Override // Added @Override
    @GetMapping("/audio")
    public void streamAudio( // Keep void return type for direct HttpServletResponse manipulation
                             @RequestParam("id") Long id,
                             @RequestHeader(value = "Range", required = false) String range,
                             HttpServletRequest request, // Keep if generated interface includes it
                             HttpServletResponse response // Keep if generated interface includes it
    ) throws IOException {

        // get audiofile for ID from database
        AudioFile file = service.getById(id).orElse(null);
        if (file == null) {
            response.setStatus(HttpServletResponse.SC_NOT_FOUND);
            return;
        }

        // get audio file
        File audioFile = new File(AUDIO_PATH, file.getFilename());
        long length = audioFile.length();

        // parse and get Range header
        Optional<RangeResponse> rangeOpt = AudioStreamRangeService.parseRangeHeader(range, length);
        if (rangeOpt.isEmpty()) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            return;
        }
        RangeResponse rangeResp = rangeOpt.get();

        // set response headers
        response.setStatus(range == null ? HttpServletResponse.SC_OK : HttpServletResponse.SC_PARTIAL_CONTENT);
        response.setContentType("audio/mpeg");
        response.setHeader("Accept-Ranges", "bytes");
        response.setHeader("Content-Range", rangeResp.getContentRangeHeader(length));
        response.setHeader("Content-Length", String.valueOf(rangeResp.getContentLength()));

        // read and stream parts of file
        try (RandomAccessFile raf = new RandomAccessFile(audioFile, "r");
             OutputStream os = response.getOutputStream()) {

            raf.seek(rangeResp.getStart());
            byte[] buffer = new byte[4096];
            long remaining = length;
            int bytesRead;

            while (remaining > 0 && (bytesRead = raf.read(buffer, 0, (int) Math.min(buffer.length, remaining))) != -1) {
                os.write(buffer, 0, bytesRead);
                remaining -= bytesRead;
            }
        }
    }
}