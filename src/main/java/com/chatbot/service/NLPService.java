package com.chatbot.service;

import org.springframework.stereotype.Service;
import java.util.*;
import java.util.regex.Pattern;

@Service
public class NLPService {
    
    private final Set<String> stopWords = new HashSet<>(Arrays.asList(
        "a", "an", "and", "are", "as", "at", "be", "by", "for", "from",
        "has", "he", "in", "is", "it", "its", "of", "on", "that", "the",
        "to", "was", "will", "with", "the", "this", "but", "they", "have",
        "had", "what", "said", "each", "which", "she", "do", "how", "their",
        "if", "up", "out", "many", "then", "them", "these", "so", "some", "her",
        "would", "make", "like", "into", "him", "time", "two", "more", "go", "no",
        "way", "could", "my", "than", "first", "been", "call", "who", "oil", "sit",
        "now", "find", "down", "day", "did", "get", "come", "made", "may", "part"
    ));

    public String preprocessText(String text) {
        if (text == null) return "";
        
        // Convert to lowercase
        text = text.toLowerCase();
        
        // Remove punctuation except for sentence endings
        text = text.replaceAll("[^a-zA-Z0-9\\s.!?]", "");
        
        // Remove extra whitespace
        text = text.replaceAll("\\s+", " ").trim();
        
        return text;
    }

    public List<String> tokenize(String text) {
        String processed = preprocessText(text);
        return Arrays.asList(processed.split("\\s+"));
    }

    public List<String> removeStopWords(List<String> tokens) {
        List<String> filtered = new ArrayList<>();
        for (String token : tokens) {
            if (!stopWords.contains(token.toLowerCase()) && !token.trim().isEmpty()) {
                filtered.add(token);
            }
        }
        return filtered;
    }

    public Map<String, Integer> extractKeywords(String text) {
        List<String> tokens = tokenize(text);
        List<String> filtered = removeStopWords(tokens);
        
        Map<String, Integer> keywords = new HashMap<>();
        for (String word : filtered) {
            keywords.put(word, keywords.getOrDefault(word, 0) + 1);
        }
        
        return keywords;
    }

    public double calculateSimilarity(String text1, String text2) {
        Map<String, Integer> keywords1 = extractKeywords(text1);
        Map<String, Integer> keywords2 = extractKeywords(text2);
        
        Set<String> allWords = new HashSet<>();
        allWords.addAll(keywords1.keySet());
        allWords.addAll(keywords2.keySet());
        
        if (allWords.isEmpty()) return 0.0;
        
        double dotProduct = 0.0;
        double norm1 = 0.0;
        double norm2 = 0.0;
        
        for (String word : allWords) {
            int freq1 = keywords1.getOrDefault(word, 0);
            int freq2 = keywords2.getOrDefault(word, 0);
            
            dotProduct += freq1 * freq2;
            norm1 += freq1 * freq1;
            norm2 += freq2 * freq2;
        }
        
        if (norm1 == 0.0 || norm2 == 0.0) return 0.0;
        
        return dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2));
    }

    public String extractIntent(String text) {
        String processed = preprocessText(text);
        
        // Simple intent classification based on keywords and patterns
        if (containsPattern(processed, Arrays.asList("hello", "hi", "hey", "good morning", "good afternoon"))) {
            return "greeting";
        } else if (containsPattern(processed, Arrays.asList("bye", "goodbye", "see you", "farewell"))) {
            return "goodbye";
        } else if (containsPattern(processed, Arrays.asList("help", "assist", "support"))) {
            return "help";
        } else if (containsPattern(processed, Arrays.asList("what", "how", "when", "where", "why", "?"))) {
            return "question";
        } else if (containsPattern(processed, Arrays.asList("thank", "thanks", "appreciate"))) {
            return "gratitude";
        } else if (containsPattern(processed, Arrays.asList("price", "cost", "fee", "payment"))) {
            return "pricing";
        } else if (containsPattern(processed, Arrays.asList("product", "service", "feature"))) {
            return "product_inquiry";
        } else {
            return "general";
        }
    }

    private boolean containsPattern(String text, List<String> patterns) {
        for (String pattern : patterns) {
            if (text.contains(pattern)) {
                return true;
            }
        }
        return false;
    }

    public List<String> extractEntities(String text) {
        List<String> entities = new ArrayList<>();
        String processed = preprocessText(text);
        
        // Simple entity extraction (can be enhanced with more sophisticated NER)
        Pattern emailPattern = Pattern.compile("\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Z|a-z]{2,}\\b");
        Pattern phonePattern = Pattern.compile("\\b\\d{3}-\\d{3}-\\d{4}\\b|\\b\$$\\d{3}\$$\\s*\\d{3}-\\d{4}\\b");
        Pattern numberPattern = Pattern.compile("\\b\\d+\\b");
        
        if (emailPattern.matcher(text).find()) {
            entities.add("EMAIL");
        }
        if (phonePattern.matcher(text).find()) {
            entities.add("PHONE");
        }
        if (numberPattern.matcher(text).find()) {
            entities.add("NUMBER");
        }
        
        return entities;
    }
}
