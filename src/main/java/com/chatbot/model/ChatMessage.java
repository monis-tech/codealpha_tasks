package com.chatbot.model;

import java.time.LocalDateTime;

public class ChatMessage {
    private String id;
    private String message;
    private String sender; // "user" or "bot"
    private LocalDateTime timestamp;
    private double confidence;
    private String intent;

    public ChatMessage() {
        this.timestamp = LocalDateTime.now();
    }

    public ChatMessage(String message, String sender) {
        this.message = message;
        this.sender = sender;
        this.timestamp = LocalDateTime.now();
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getSender() { return sender; }
    public void setSender(String sender) { this.sender = sender; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }

    public double getConfidence() { return confidence; }
    public void setConfidence(double confidence) { this.confidence = confidence; }

    public String getIntent() { return intent; }
    public void setIntent(String intent) { this.intent = intent; }
}
