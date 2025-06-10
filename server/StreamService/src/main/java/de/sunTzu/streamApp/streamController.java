package de.sunTzu.streamApp;

import de.sunTzu.db.model.AudioFile;
import de.sunTzu.streamApp.model.RangeResponse;
import de.sunTzu.streamApp.service.AudioStreamRangeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.enums.ParameterIn;
import io.swagger.v3.oas.annotations.headers.Header;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;

import java.io.File;
import java.io.IOException;
import java.io.OutputStream;
import java.io.RandomAccessFile;
import java.util.Optional;

import de.sunTzu.db.service.AudioFileService;

@RestController
@Tag(name = "Audio Streaming")
public class streamController {
    @Value("${AUDIO_FILE_PATH:/audio}")
    private String AUDIO_PATH;
    private final AudioFileService service;

    public streamController(AudioFileService service) {
        this.service = service;
    }

    @GetMapping(value = "/greet", produces = "text/plain")
    public String sayHello() {
        return "Hello World!";
    }


    @Operation(
            summary = "Stream audio by ID",
            description = "Streams an audio file for the given ID, supports HTTP Range requests for partial playback."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Full audio content streamed",
                    content = @Content(mediaType = "audio/mpeg"),
                    headers = {
                            @Header(name = "Accept-Ranges", description = "Indicates byte range support. Always: bytes"),
                            @Header(name = "Content-Length", description = "Length of the audio content. Example: 65536"),
                            @Header(name = "Content-Range", description = "Range of bytes served (total). Example: 0-65535/65536")
                    }),
            @ApiResponse(responseCode = "206", description = "Partial audio content streamed",
                    content = @Content(mediaType = "audio/mpeg"),
                    headers = {
                            @Header(name = "Accept-Ranges", description = "Indicates byte range support. Always: bytes"),
                            @Header(name = "Content-Length", description = "Length of the audio content. Example: 4096"),
                            @Header(name = "Content-Range", description = "Range of bytes served (partial). Example: 0-4095/65536")
                    }),
            @ApiResponse(responseCode = "400", description = "Invalid Range header"),
            @ApiResponse(responseCode = "404", description = "Audio file not found")
    })
    @GetMapping("/audio")
    public void streamAudio(
            @Parameter(name = "id", description = "ID of the audio file", required = true)
            @RequestParam("id") Long id,
            @Parameter(name = "Range", description = "Range header for partial streaming", in = ParameterIn.HEADER, example = "bytes=0-4095")
            @RequestHeader(value = "Range", required = false) String range,
            HttpServletRequest request,
            HttpServletResponse response) throws IOException {

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
