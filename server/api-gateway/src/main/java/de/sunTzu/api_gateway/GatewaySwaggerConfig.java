package de.sunTzu.api_gateway;

//import io.swagger.v3.oas.models.servers.Server;
//import org.springdoc.core.customizers.OpenApiCustomizer;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//
//import java.util.List;
//
//@Configuration
//public class GatewaySwaggerConfig {
//    @Bean
//    public OpenApiCustomizer streamServerCustomizer() {
//        return openApi -> {
//            if ("stream".equals(openApi.getInfo().getTitle())) {
//                openApi.setServers(List.of(new Server().url("/api/stream")));
//
//                System.out.println("Customizing OpenAPI for title: " + openApi.getInfo().getTitle());
//
//                var oldPaths = openApi.getPaths();
//                var newPaths = new io.swagger.v3.oas.models.Paths();
//
//                oldPaths.forEach((path, pathItem) -> {
//                    newPaths.addPathItem("/api/stream" + path, pathItem);
//                });
//
//                openApi.setPaths(newPaths);
//            }
//        };
//    }
//
//    @Bean
//    public OpenApiCustomizer playlistServerCustomizer() {
//        return openApi -> {
//            if ("playlist".equals(openApi.getInfo().getTitle())) {
//                openApi.setServers(List.of(new Server().url("/api/playlist")));
//
//                var oldPaths = openApi.getPaths();
//                var newPaths = new io.swagger.v3.oas.models.Paths();
//
//                oldPaths.forEach((path, pathItem) -> {
//                    newPaths.addPathItem("/api/playlist" + path, pathItem);
//                });
//
//                openApi.setPaths(newPaths);
//            }
//        };
//    }
//
//    @Bean
//    public OpenApiCustomizer apiServerCustomizer() {
//        return openApi -> {
//            openApi.setServers(List.of(new Server().url("http://localhost:8080/api/stream")));
//            System.out.println("My TESTETESTEST");
//        };
//    }
//}
