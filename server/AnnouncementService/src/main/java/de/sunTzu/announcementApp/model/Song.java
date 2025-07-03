package de.sunTzu.announcementApp.model;

// This class matches the Pydantic 'Song' model in your Python service.
public class Song {
private String title;
private String artist;

public Song(String title, String artist) {
this.title = title;
this.artist = artist;
}

// Getters and Setters
public String getTitle() { return title; }
public void setTitle(String title) { this.title = title; }
public String getArtist() { return artist; }
public void setArtist(String artist) { this.artist = artist; }
}