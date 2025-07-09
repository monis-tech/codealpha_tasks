package com.fastchatbot.service;

import com.fastchatbot.model.FastMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.scheduling.annotation.Async;
import org.springframework.cache.annotation.Cacheable;
import java.util.*;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class FastChatService {
    
    @Autowired
    private FastNLPService nlpService;
    
    // Ultra-fast response cache
    private static final Map<String, String[]> FAST_RESPONSES = new ConcurrentHashMap<>();
    private static final Random RANDOM = new Random();
    
    static {
        // Pre-loaded responses for instant access
        FAST_RESPONSES.put("greeting", new String[]{
            "Hi! How can I help?", "Hello! What do you need?", "Hey there! How can I assist?"
        });
        FAST_RESPONSES.put("help", new String[]{
            "I'm here to help! What do you need?", "What can I assist with?", "How can I help you?"
        });
        FAST_RESPONSES.put("pricing", new String[]{
            "Our pricing is flexible. What are you looking for?", "Costs vary by needs. Tell me more?", "Let's discuss your requirements!"
        });
        FAST_RESPONSES.put("product", new String[]{
            "We offer AI chatbots and web solutions. Interested?", "Our products include AI assistants. Want details?", "We build smart chatbots. Need one?"
        });
        FAST_RESPONSES.put("gratitude", new String[]{
            "You're welcome!", "Happy to help!", "Anytime!", "Glad I could assist!"
        });
        FAST_RESPONSES.put("goodbye", new String[]{
            "Goodbye! Come back anytime!", "See you later!", "Bye! Have a great day!", "Take care!"
        });
        FAST_RESPONSES.put("question", new String[]{
            "Great question! Let me help.", "I'd be happy to answer that.", "Here's what I know.", "Good question! Let me explain."
        });
        FAST_RESPONSES.put("general", new String[]{
            "I understand. How can I help?", "Tell me more about that.", "Interesting! What would you like to know?", "I'm here to assist!"
        });
    }

    @Async
    public CompletableFuture<FastMessage> processMessageAsync(String userMessage) {
        return CompletableFuture.completedFuture(processMessage(userMessage));
    }

    public FastMessage processMessage(String userMessage) {
        long startTime = System.nanoTime();
        
        // Lightning-fast processing
        String intent = nlpService.fastIntentDetection(userMessage);
        String response = getInstantResponse(intent);
        float confidence = calculateFastConfidence(userMessage, intent);
        
        FastMessage result = new FastMessage(response, "bot");
        result.setIntent(intent);
        result.setConfidence(confidence);
        
        // Log processing time (typically < 1ms)
        long processingTime = (System.nanoTime() - startTime) / 1_000_000;
        System.out.println("Processed in: " + processingTime + "ms");
        
        return result;
    }

    @Cacheable("responses")
    private String getInstantResponse(String intent) {
        String[] responses = FAST_RESPONSES.get(intent);
        if (responses == null) {
            responses = FAST_RESPONSES.get("general");
        }
        return responses[RANDOM.nextInt(responses.length)];
    }

    private float calculateFastConfidence(String message, String intent) {
        // Ultra-fast confidence calculation
        int messageLength = message.length();
        float baseConfidence = switch (intent) {
            case "greeting", "goodbye", "gratitude" -> 0.95f;
            case "help", "question" -> 0.85f;
            case "pricing", "product" -> 0.80f;
            default -> 0.70f;
        };
        
        // Adjust for message length (longer = more confident)
        float lengthBonus = Math.min(0.1f, messageLength / 200.0f);
        return Math.min(0.99f, baseConfidence + lengthBonus);
    }

    public String[] getFastSuggestions(String partial) {
        if (partial == null || partial.length() < 2) {
            return new String[]{
                "Hello!", "What services do you offer?", "How much does it cost?", "Can you help me?"
            };
        }
        
        String intent = nlpService.fastIntentDetection(partial);
        return switch (intent) {
            case "greeting" -> new String[]{"Hello! How can you help?", "Hi there! What do you do?"};
            case "help" -> new String[]{"I need help with...", "Can you assist me with..."};
            case "pricing" -> new String[]{"What are your prices?", "How much do you charge?"};
            default -> new String[]{"Tell me more", "What can you do?", "How does this work?"};
        };
    }
}
