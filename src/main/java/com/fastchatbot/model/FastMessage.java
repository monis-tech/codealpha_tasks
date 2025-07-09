package com.fastchatbot.model;

public class FastMessage {
    private String message;
    private String sender;
    private long timestamp;
    private float confidence;
    private String intent;

    public FastMessage() {
        this.timestamp = System.currentTimeMillis();
    }

    public FastMessage(String message, String sender) {
        this.message = message;
        this.sender = sender;
        this.timestamp = System.currentTimeMillis();
    }

    // Fast getters/setters
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    public String getSender() { return sender; }
    public void setSender(String sender) { this.sender = sender; }
    public long getTimestamp() { return timestamp; }
    public void setTimestamp(long timestamp) { this.timestamp = timestamp; }
    public float getConfidence() { return confidence; }
    public void setConfidence(float confidence) { this.confidence = confidence; }
    public String getIntent() { return intent; }
    public void setIntent(String intent) { this.intent = intent; }
}
