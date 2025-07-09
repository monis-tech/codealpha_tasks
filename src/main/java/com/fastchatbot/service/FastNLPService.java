package com.fastchatbot.service;

import org.springframework.stereotype.Service;
import org.springframework.cache.annotation.Cacheable;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class FastNLPService {
    
    // Pre-compiled patterns for ultra-fast matching
    private static final Map<String, String> INTENT_PATTERNS = new ConcurrentHashMap<>();
    private static final Set<String> STOP_WORDS = Set.of(
        "a", "an", "and", "are", "as", "at", "be", "by", "for", "from",
        "has", "he", "in", "is", "it", "of", "on", "that", "the", "to",
        "was", "will", "with", "this", "but", "they", "have", "what",
        "do", "how", "if", "up", "out", "so", "her", "him", "my", "no"
    );
    
    static {
        // Pre-load intent patterns for instant matching
        INTENT_PATTERNS.put("hello", "greeting");
        INTENT_PATTERNS.put("hi", "greeting");
        INTENT_PATTERNS.put("hey", "greeting");
        INTENT_PATTERNS.put("help", "help");
        INTENT_PATTERNS.put("support", "help");
        INTENT_PATTERNS.put("assist", "help");
        INTENT_PATTERNS.put("price", "pricing");
        INTENT_PATTERNS.put("cost", "pricing");
        INTENT_PATTERNS.put("fee", "pricing");
        INTENT_PATTERNS.put("service", "product");
        INTENT_PATTERNS.put("product", "product");
        INTENT_PATTERNS.put("thanks", "gratitude");
        INTENT_PATTERNS.put("thank", "gratitude");
        INTENT_PATTERNS.put("bye", "goodbye");
        INTENT_PATTERNS.put("goodbye", "goodbye");
    }

    @Cacheable("processedText")
    public String fastPreprocess(String text) {
        if (text == null || text.isEmpty()) return "";
        
        // Ultra-fast preprocessing
        return text.toLowerCase()
                  .replaceAll("[^a-z0-9\\s]", "")
                  .replaceAll("\\s+", " ")
                  .trim();
    }

    public String[] fastTokenize(String text) {
        return fastPreprocess(text).split(" ");
    }

    @Cacheable("intents")
    public String fastIntentDetection(String text) {
        String processed = fastPreprocess(text);
        
        // Lightning-fast intent detection using pre-compiled patterns
        for (Map.Entry<String, String> entry : INTENT_PATTERNS.entrySet()) {
            if (processed.contains(entry.getKey())) {
                return entry.getValue();
            }
        }
        
        // Quick question detection
        if (processed.contains("?") || processed.startsWith("what") || 
            processed.startsWith("how") || processed.startsWith("when") ||
            processed.startsWith("where") || processed.startsWith("why")) {
            return "question";
        }
        
        return "general";
    }

    public float fastSimilarity(String text1, String text2) {
        if (text1 == null || text2 == null) return 0.0f;
        
        String[] tokens1 = fastTokenize(text1);
        String[] tokens2 = fastTokenize(text2);
        
        Set<String> set1 = new HashSet<>(Arrays.asList(tokens1));
        Set<String> set2 = new HashSet<>(Arrays.asList(tokens2));
        
        // Fast Jaccard similarity
        Set<String> intersection = new HashSet<>(set1);
        intersection.retainAll(set2);
        
        Set<String> union = new HashSet<>(set1);
        union.addAll(set2);
        
        return union.isEmpty() ? 0.0f : (float) intersection.size() / union.size();
    }

    public String[] fastKeywords(String text) {
        return Arrays.stream(fastTokenize(text))
                    .filter(word -> !STOP_WORDS.contains(word) && word.length() > 2)
                    .toArray(String[]::new);
    }
}
