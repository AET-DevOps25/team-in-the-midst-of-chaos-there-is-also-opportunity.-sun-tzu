# Stage 1: Build the application
FROM gradle:8.14-jdk17 AS build

# Set working directory
WORKDIR /app

# Copy gradle configuration files
COPY settings.gradle build.gradle gradlew gradle/ ./

# Copy source code
COPY AnnouncementService ./AnnouncementService

# Build the application
RUN gradle :AnnouncementService:bootJar --no-daemon

# Stage 2: Run the application
FROM eclipse-temurin:17-jre

WORKDIR /app

# Copy the built JAR file from the build stage
COPY --from=build /app/AnnouncementService/build/libs/*.jar announcementService.jar

# Expose the port the app runs on
EXPOSE 8080

# Command to run the application
ENTRYPOINT ["java", "-jar", "announcementService.jar"]
