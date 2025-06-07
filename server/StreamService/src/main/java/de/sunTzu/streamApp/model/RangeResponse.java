package de.sunTzu.streamApp.model;

public class RangeResponse {
    private final long start;
    private final long end;

    public RangeResponse(long start, long end) {
        this.start = start;
        this.end = end;
    }

    public long getEnd() {
        return end;
    }

    public long getStart() {
        return start;
    }

    public long getContentLength() {
        return end - start + 1;
    }

    public String getContentRangeHeader(long totalLength) {
        return String.format("bytes %d-%d/%d", start, end, totalLength);
    }
}
