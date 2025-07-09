package com.chatbot.service;

import com.chatbot.model.ChatMessage;
import com.chatbot.model.Intent;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class ChatbotService {
    
    @Autowired
    private NLPService nlpService;
    
    @Autowired
    private TrainingDataService trainingDataService;
    
    private final Random random = new Random();
    
    public ChatMessage processMessage(String userMessage) {
        // Preprocess the message
        String processedMessage = nlpService.preprocessText(userMessage);
        
        // Extract intent
        String intent = nlpService.extractIntent(processedMessage);
        
        // Find best matching response
        String response = generateResponse(processedMessage, intent);
        
        // Calculate confidence
        double confidence = calculateConfidence(processedMessage, intent);
        
        // Create response message
        ChatMessage botMessage = new ChatMessage(response, "bot");
        botMessage.setIntent(intent);
        botMessage.setConfidence(confidence);
        
        return botMessage;
    }
    
    private String generateResponse(String message, String intent) {
        // Get trained responses for the intent
        List<String> responses = trainingDataService.getResponsesForIntent(intent);
        
        if (!responses.isEmpty()) {
            // Use rule-based selection with some randomness
            return responses.get(random.nextInt(responses.size()));
        }
        
        // Fallback to pattern matching
        return findBestMatchingResponse(message);
    }
    
    private String findBestMatchingResponse(String message) {
        Map<String, List<String>> trainingData = trainingDataService.getTrainingData();
        double bestSimilarity = 0.0;
        String bestResponse = "I'm sorry, I don't understand. Could you please rephrase your question?";
        
        for (Map.Entry<String, List<String>> entry : trainingData.entrySet()) {
            String pattern = entry.getKey();
            double similarity = nlpService.calculateSimilarity(message, pattern);
            
            if (similarity > bestSimilarity && similarity > 0.3) { // Threshold for similarity
                bestSimilarity = similarity;
                List<String> responses = entry.getValue();
                bestResponse = responses.get(random.nextInt(responses.size()));
            }
        }
        
        return bestResponse;
    }
    
    private double calculateConfidence(String message, String intent) {
        // Simple confidence calculation based on intent matching and keyword presence
        Map<String, Integer> keywords = nlpService.extractKeywords(message);
        
        if (keywords.isEmpty()) return 0.3;
        
        // Base confidence on intent recognition
        double baseConfidence = switch (intent) {
            case "greeting", "goodbye", "gratitude" -> 0.9;
            case "help", "question" -> 0.7;
            case "pricing", "product_inquiry" -> 0.8;
            default -> 0.5;
        };
        
        // Adjust based on message length and keyword density
        int messageLength = message.split("\\s+").length;
        double lengthFactor = Math.min(1.0, messageLength / 10.0);
        
        return Math.min(0.95, baseConfidence * (0.7 + 0.3 * lengthFactor));
    }
    
    public List<String> getSuggestions(String partialMessage) {
        List<String> suggestions = new ArrayList<>();
        
        if (partialMessage.length() < 2) {
            return Arrays.asList(
                "Hello, how can I help you?",
                "What are your services?",
                "How much does it cost?",
                "Can you help me with..."
            );
        }
        
        // Generate contextual suggestions based on partial input
        String intent = nlpService.extractIntent(partialMessage);
        
        switch (intent) {
            case "greeting":
                suggestions.addAll(Arrays.asList(
                    "Hello! How can I assist you today?",
                    "Hi there! What can I help you with?"
                ));
                break;
            case "help":
                suggestions.addAll(Arrays.asList(
                    "I need help with my account",
                    "Can you help me understand your services?",
                    "I need technical support"
                ));
                break;
            case "pricing":
                suggestions.addAll(Arrays.asList(
                    "What are your pricing plans?",
                    "How much does the premium service cost?",
                    "Do you offer discounts?"
                ));
                break;
            default:
                suggestions.addAll(Arrays.asList(
                    "Tell me more about your products",
                    "What services do you offer?",
                    "How can I get started?"
                ));
        }
        
        return suggestions;
    }
}
