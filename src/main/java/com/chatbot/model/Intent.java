package com.chatbot.model;

import java.util.List;

public class Intent {
    private String name;
    private List<String> patterns;
    private List<String> responses;
    private double confidence;

    public Intent() {}

    public Intent(String name, List<String> patterns, List<String> responses) {
        this.name = name;
        this.patterns = patterns;
        this.responses = responses;
    }

    // Getters and Setters
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public List<String> getPatterns() { return patterns; }
    public void setPatterns(List<String> patterns) { this.patterns = patterns; }

    public List<String> getResponses() { return responses; }
    public void setResponses(List<String> responses) { this.responses = responses; }

    public double getConfidence() { return confidence; }
    public void setConfidence(double confidence) { this.confidence = confidence; }
}
