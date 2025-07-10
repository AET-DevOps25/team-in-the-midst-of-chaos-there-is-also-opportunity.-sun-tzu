package de.sunTzu.playlistApp.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.List;

@Service
public class AsyncPostService {

    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${announcement.service.url}")
    private String announcementServiceUrl;

    @Async
    public void sendAsynAnnouncementPost(Long id, Long prevId, List<Long> songIds, int type) {
        UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(announcementServiceUrl)
            .queryParam("id", id)
            .queryParam("type", type);

        if (prevId != null) {
            builder.queryParam("prevId", prevId);
        }

        if (songIds != null && !songIds.isEmpty()) {
            for (Long songId : songIds) {
                builder.queryParam("songIds", songId);
            }
        }

        String finalUrl = builder.toUriString();

        restTemplate.postForLocation(finalUrl, null);
    }
}
