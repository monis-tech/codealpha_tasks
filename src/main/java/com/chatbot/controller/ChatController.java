package com.chatbot.controller;

import com.chatbot.model.ChatMessage;
import com.chatbot.service.ChatbotService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = "*")
public class ChatController {
    
    @Autowired
    private ChatbotService chatbotService;
    
    @PostMapping("/message")
    public ResponseEntity<ChatMessage> sendMessage(@RequestBody Map<String, String> request) {
        String message = request.get("message");
        
        if (message == null || message.trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        
        ChatMessage response = chatbotService.processMessage(message);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/suggestions")
    public ResponseEntity<List<String>> getSuggestions(@RequestParam(required = false) String partial) {
        List<String> suggestions = chatbotService.getSuggestions(partial != null ? partial : "");
        return ResponseEntity.ok(suggestions);
    }
    
    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> healthCheck() {
        return ResponseEntity.ok(Map.of(
            "status", "healthy",
            "service", "AI Chatbot",
            "version", "1.0.0"
        ));
    }
}
