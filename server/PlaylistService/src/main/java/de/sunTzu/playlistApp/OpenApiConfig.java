package de.sunTzu.playlistApp;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.servers.Server;
import org.springdoc.core.customizers.OpenApiCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("playlist")
                        .version("1.0")
                        .description("API docs for Playlist service"));
    }

    @Bean
    public OpenApiCustomizer pathPrefixCustomizer() {
        return openApi -> openApi.setServers(List.of(new Server().url("/api/playlist")));
    }
}
