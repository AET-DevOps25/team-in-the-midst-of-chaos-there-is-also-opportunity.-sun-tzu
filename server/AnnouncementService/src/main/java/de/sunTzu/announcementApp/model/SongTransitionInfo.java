package de.sunTzu.announcementApp.model;

import com.fasterxml.jackson.annotation.JsonProperty;

// This class matches the Pydantic 'SongTransitionInfo' model.
public class SongTransitionInfo {

    @JsonProperty("message_type")
    private int messageType;

    @JsonProperty("previous_song")
    private Song previousSong;

    @JsonProperty("next_song")
    private Song nextSong;

    @JsonProperty("after_next_song")
    private Song afterNextSong;

    // Getters and Setters
    public int getMessageType() { return messageType; }
    public void setMessageType(int messageType) { this.messageType = messageType; }
    public Song getPreviousSong() { return previousSong; }
    public void setPreviousSong(Song previousSong) { this.previousSong = previousSong; }
    public Song getNextSong() { return nextSong; }
    public void setNextSong(Song nextSong) { this.nextSong = nextSong; }
    public Song getAfterNextSong() { return afterNextSong; }
    public void setAfterNextSong(Song afterNextSong) { this.afterNextSong = afterNextSong; }
}