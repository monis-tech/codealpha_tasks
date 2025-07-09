package com.fastchatbot.controller;

import com.fastchatbot.model.FastMessage;
import com.fastchatbot.service.FastChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.concurrent.CompletableFuture;

@RestController
@RequestMapping("/api/fast")
@CrossOrigin(origins = "*")
public class FastChatController {
    
    @Autowired
    private FastChatService chatService;
    
    @PostMapping("/chat")
    public ResponseEntity<FastMessage> fastChat(@RequestBody Map<String, String> request) {
        String message = request.get("message");
        if (message == null || message.trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        
        // Ultra-fast synchronous response
        FastMessage response = chatService.processMessage(message);
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/chat-async")
    public CompletableFuture<ResponseEntity<FastMessage>> fastChatAsync(@RequestBody Map<String, String> request) {
        String message = request.get("message");
        if (message == null || message.trim().isEmpty()) {
            return CompletableFuture.completedFuture(ResponseEntity.badRequest().build());
        }
        
        return chatService.processMessageAsync(message)
                         .thenApply(ResponseEntity::ok);
    }
    
    @GetMapping("/suggestions")
    public ResponseEntity<String[]> fastSuggestions(@RequestParam(required = false) String q) {
        String[] suggestions = chatService.getFastSuggestions(q);
        return ResponseEntity.ok(suggestions);
    }
    
    @GetMapping("/ping")
    public ResponseEntity<Map<String, Object>> ping() {
        long timestamp = System.currentTimeMillis();
        return ResponseEntity.ok(Map.of(
            "status", "fast",
            "timestamp", timestamp,
            "response_time", "< 1ms"
        ));
    }
}
