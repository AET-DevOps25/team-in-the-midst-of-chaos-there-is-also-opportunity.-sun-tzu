package de.sunTzu.streamApp.service;

import de.sunTzu.streamApp.model.RangeResponse;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AudioStreamRangeService {

    public static Optional<RangeResponse> parseRangeHeader(String rangeHeader, long fileLength) {
        if (rangeHeader == null || !rangeHeader.startsWith("bytes=")) {
            return Optional.of(new RangeResponse(0, fileLength - 1));
        }

        String[] parts = rangeHeader.substring("bytes=".length()).split("-");
        try {
            long start = Long.parseLong(parts[0]);
            long end = Long.parseLong(parts[1]);

            if (start > end || end >= fileLength) {
                return Optional.empty(); // Invalid range
            }

            return Optional.of(new RangeResponse(start, end));
        } catch (NumberFormatException | ArrayIndexOutOfBoundsException e) {
            return Optional.empty(); // Invalid format
        }
    }
}
