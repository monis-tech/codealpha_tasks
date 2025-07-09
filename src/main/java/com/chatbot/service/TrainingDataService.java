package com.chatbot.service;

import org.springframework.stereotype.Service;
import javax.annotation.PostConstruct;
import java.util.*;

@Service
public class TrainingDataService {
    
    private Map<String, List<String>> trainingData;
    private Map<String, List<String>> intentResponses;
    
    @PostConstruct
    public void initializeTrainingData() {
        loadTrainingData();
        loadIntentResponses();
    }
    
    private void loadTrainingData() {
        trainingData = new HashMap<>();
        
        // Greeting patterns
        trainingData.put("hello", Arrays.asList(
            "Hello! How can I help you today?",
            "Hi there! What can I do for you?",
            "Greetings! How may I assist you?"
        ));
        
        trainingData.put("hi", Arrays.asList(
            "Hi! How can I help you?",
            "Hello! What can I do for you today?",
            "Hey there! How may I assist you?"
        ));
        
        // Help patterns
        trainingData.put("help", Arrays.asList(
            "I'm here to help! What do you need assistance with?",
            "Sure, I'd be happy to help. What's your question?",
            "How can I assist you today?"
        ));
        
        trainingData.put("support", Arrays.asList(
            "I'm here to provide support. What issue are you facing?",
            "Let me help you with that. What do you need support with?",
            "I'm ready to assist you. What's the problem?"
        ));
        
        // Product inquiry patterns
        trainingData.put("what services do you offer", Arrays.asList(
            "We offer a wide range of services including AI chatbots, web development, and consulting.",
            "Our services include custom software development, AI solutions, and technical consulting.",
            "We provide AI chatbot development, web applications, and business automation solutions."
        ));
        
        trainingData.put("tell me about your products", Arrays.asList(
            "Our main products include AI-powered chatbots, custom web applications, and automation tools.",
            "We specialize in AI chatbots, business process automation, and custom software solutions.",
            "Our product portfolio includes intelligent chatbots, web platforms, and AI-driven tools."
        ));
        
        // Pricing patterns
        trainingData.put("how much does it cost", Arrays.asList(
            "Our pricing varies based on your specific needs. Would you like to discuss your requirements?",
            "Costs depend on the complexity and features you need. Let's talk about your project!",
            "Pricing is customized for each client. Can you tell me more about what you're looking for?"
        ));
        
        trainingData.put("pricing", Arrays.asList(
            "We offer competitive pricing tailored to your needs. What type of solution are you interested in?",
            "Our pricing is flexible and depends on your requirements. Would you like a quote?",
            "Pricing varies by project scope. Let me know what you need and I can provide more details."
        ));
        
        // FAQ patterns
        trainingData.put("how does the chatbot work", Arrays.asList(
            "Our chatbot uses advanced NLP and machine learning to understand and respond to your questions naturally.",
            "The chatbot processes your messages using AI algorithms to provide relevant and helpful responses.",
            "It works by analyzing your input, understanding the intent, and generating appropriate responses using trained models."
        ));
        
        trainingData.put("what can you do", Arrays.asList(
            "I can answer questions, provide information about our services, help with support issues, and guide you through our offerings.",
            "I'm designed to assist with inquiries, provide product information, offer support, and help you find what you need.",
            "I can help with general questions, service information, technical support, and connecting you with the right resources."
        ));
        
        // Goodbye patterns
        trainingData.put("goodbye", Arrays.asList(
            "Goodbye! Feel free to return if you have more questions.",
            "Thanks for chatting! Have a great day!",
            "See you later! Don't hesitate to reach out if you need help."
        ));
        
        trainingData.put("bye", Arrays.asList(
            "Bye! It was great helping you today.",
            "See you soon! Take care!",
            "Goodbye! Come back anytime you need assistance."
        ));
        
        // Gratitude patterns
        trainingData.put("thank you", Arrays.asList(
            "You're welcome! Happy to help!",
            "My pleasure! Is there anything else I can assist you with?",
            "Glad I could help! Feel free to ask if you have more questions."
        ));
        
        trainingData.put("thanks", Arrays.asList(
            "You're welcome!",
            "Happy to help!",
            "Anytime! Let me know if you need anything else."
        ));
    }
    
    private void loadIntentResponses() {
        intentResponses = new HashMap<>();
        
        intentResponses.put("greeting", Arrays.asList(
            "Hello! How can I help you today?",
            "Hi there! What can I do for you?",
            "Greetings! How may I assist you?",
            "Welcome! How can I help you?"
        ));
        
        intentResponses.put("goodbye", Arrays.asList(
            "Goodbye! Have a great day!",
            "See you later! Take care!",
            "Thanks for chatting! Come back anytime.",
            "Bye! Feel free to return if you have questions."
        ));
        
        intentResponses.put("help", Arrays.asList(
            "I'm here to help! What do you need assistance with?",
            "Sure, I'd be happy to help. What's your question?",
            "How can I assist you today?",
            "What can I help you with?"
        ));
        
        intentResponses.put("gratitude", Arrays.asList(
            "You're welcome! Happy to help!",
            "My pleasure! Anything else I can assist with?",
            "Glad I could help!",
            "You're very welcome!"
        ));
        
        intentResponses.put("pricing", Arrays.asList(
            "Our pricing varies based on your needs. Would you like to discuss your requirements?",
            "Costs depend on the features you need. Let's talk about your project!",
            "We offer competitive pricing. What type of solution interests you?",
            "Pricing is customized for each client. Can you tell me more about your needs?"
        ));
        
        intentResponses.put("product_inquiry", Arrays.asList(
            "We offer AI chatbots, web development, and consulting services. What interests you most?",
            "Our products include intelligent chatbots and custom software solutions. Would you like details?",
            "We specialize in AI solutions and web applications. What would you like to know?",
            "Our main offerings are AI chatbots and business automation tools. Any specific questions?"
        ));
        
        intentResponses.put("question", Arrays.asList(
            "That's a great question! Let me help you with that.",
            "I'd be happy to answer that for you.",
            "Let me provide you with information about that.",
            "Good question! Here's what I can tell you..."
        ));
        
        intentResponses.put("general", Arrays.asList(
            "I understand. How can I help you with that?",
            "That's interesting. What would you like to know more about?",
            "I see. Is there something specific I can assist you with?",
            "Thanks for sharing. How can I help you today?"
        ));
    }
    
    public Map<String, List<String>> getTrainingData() {
        return trainingData;
    }
    
    public List<String> getResponsesForIntent(String intent) {
        return intentResponses.getOrDefault(intent, new ArrayList<>());
    }
    
    public void addTrainingData(String pattern, String response) {
        trainingData.computeIfAbsent(pattern.toLowerCase(), k -> new ArrayList<>()).add(response);
    }
    
    public void addIntentResponse(String intent, String response) {
        intentResponses.computeIfAbsent(intent, k -> new ArrayList<>()).add(response);
    }
}
