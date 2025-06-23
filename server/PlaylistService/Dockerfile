# Stage 1: Build the application
FROM gradle:8.14-jdk17 AS build

# Set working directory
WORKDIR /app

# Copy gradle configuration files
COPY settings.gradle build.gradle gradlew gradle/ ./

# Copy source code
COPY PlaylistService ./PlaylistService
COPY common ./common

# Copy source code
RUN gradle :PlaylistService:bootJar --no-daemon

# Stage 2: Run the application
FROM eclipse-temurin:17-jre

WORKDIR /app

# Copy the built JAR file from the build stage
COPY --from=build /app/PlaylistService/build/libs/*.jar playlistService.jar
COPY --from=build /app/common/build/libs/*.jar common.jar

# Command to run the application
ENTRYPOINT ["java", "-jar", "playlistService.jar"]
