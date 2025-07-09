"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Bot, User, Lightbulb, RefreshCw, MessageSquare, Brain, Zap, Settings } from "lucide-react"

interface ChatMessage {
  id: string
  message: string
  sender: "user" | "bot"
  timestamp: string
  confidence?: number
  intent?: string
}

interface ChatbotStats {
  totalMessages: number
  averageConfidence: number
  topIntents: string[]
  responseTime: number
}

export default function ChatbotInterface() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      message: "Hello! I'm your AI assistant. How can I help you today?",
      sender: "bot",
      timestamp: new Date().toISOString(),
      confidence: 0.95,
      intent: "greeting",
    },
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [stats, setStats] = useState<ChatbotStats>({
    totalMessages: 1,
    averageConfidence: 0.95,
    topIntents: ["greeting"],
    responseTime: 0,
  })
  const [showStats, setShowStats] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (inputMessage.length > 2) {
      // Simulate getting suggestions from the Java backend
      getSuggestions(inputMessage)
    } else {
      setSuggestions([])
    }
  }, [inputMessage])

  const getSuggestions = async (partial: string) => {
    try {
      // Simulate API call to Java backend
      const mockSuggestions = [
        "What services do you offer?",
        "How much does it cost?",
        "Can you help me with technical support?",
        "Tell me about your AI chatbot features",
      ]
      setSuggestions(mockSuggestions.filter((s) => s.toLowerCase().includes(partial.toLowerCase())).slice(0, 3))
    } catch (error) {
      console.error("Error getting suggestions:", error)
    }
  }

  const sendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      message: inputMessage,
      sender: "user",
      timestamp: new Date().toISOString(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")
    setIsLoading(true)
    setSuggestions([])

    try {
      const startTime = Date.now()

      // Simulate API call to Java Spring Boot backend
      const response = await simulateJavaBackendResponse(inputMessage)

      const endTime = Date.now()
      const responseTime = endTime - startTime

      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        message: response.message,
        sender: "bot",
        timestamp: new Date().toISOString(),
        confidence: response.confidence,
        intent: response.intent,
      }

      setMessages((prev) => [...prev, botMessage])

      // Update stats
      setStats((prev) => ({
        totalMessages: prev.totalMessages + 2,
        averageConfidence: (prev.averageConfidence + response.confidence) / 2,
        topIntents: [...new Set([...prev.topIntents, response.intent])].slice(0, 5),
        responseTime: responseTime,
      }))
    } catch (error) {
      console.error("Error sending message:", error)
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        message: "Sorry, I'm having trouble connecting. Please try again.",
        sender: "bot",
        timestamp: new Date().toISOString(),
        confidence: 0.1,
        intent: "error",
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  // Simulate Java backend response with NLP processing
  const simulateJavaBackendResponse = async (message: string): Promise<any> => {
    await new Promise((resolve) => setTimeout(resolve, 800 + Math.random() * 1200))

    const lowerMessage = message.toLowerCase()

    // Simulate intent recognition and response generation
    if (lowerMessage.includes("hello") || lowerMessage.includes("hi")) {
      return {
        message: "Hello! How can I help you today?",
        confidence: 0.92,
        intent: "greeting",
      }
    } else if (lowerMessage.includes("help") || lowerMessage.includes("support")) {
      return {
        message:
          "I'm here to help! What do you need assistance with? I can provide information about our services, pricing, or technical support.",
        confidence: 0.88,
        intent: "help",
      }
    } else if (lowerMessage.includes("service") || lowerMessage.includes("product")) {
      return {
        message:
          "We offer AI chatbot development, web applications, and business automation solutions. Our chatbots use advanced NLP and machine learning for natural conversations. Would you like to know more about any specific service?",
        confidence: 0.85,
        intent: "product_inquiry",
      }
    } else if (lowerMessage.includes("price") || lowerMessage.includes("cost")) {
      return {
        message:
          "Our pricing varies based on your specific needs and requirements. We offer flexible packages for different business sizes. Would you like to discuss your project so I can provide more accurate pricing information?",
        confidence: 0.83,
        intent: "pricing",
      }
    } else if (lowerMessage.includes("how") && lowerMessage.includes("work")) {
      return {
        message:
          "Our AI chatbot works using Natural Language Processing (NLP) and machine learning algorithms. It analyzes your input, identifies the intent, extracts relevant information, and generates appropriate responses based on trained data and patterns. The system continuously learns and improves from interactions.",
        confidence: 0.9,
        intent: "technical_explanation",
      }
    } else if (lowerMessage.includes("thank") || lowerMessage.includes("thanks")) {
      return {
        message: "You're welcome! I'm happy to help. Is there anything else you'd like to know?",
        confidence: 0.94,
        intent: "gratitude",
      }
    } else if (lowerMessage.includes("bye") || lowerMessage.includes("goodbye")) {
      return {
        message: "Goodbye! Feel free to return if you have more questions. Have a great day!",
        confidence: 0.91,
        intent: "goodbye",
      }
    } else {
      return {
        message:
          "That's an interesting question! Based on what you're asking, I'd be happy to provide more information. Could you be more specific about what you'd like to know? I can help with our services, technical questions, or general inquiries.",
        confidence: 0.65,
        intent: "general",
      }
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setInputMessage(suggestion)
    setSuggestions([])
  }

  const clearChat = () => {
    setMessages([
      {
        id: "1",
        message: "Hello! I'm your AI assistant. How can I help you today?",
        sender: "bot",
        timestamp: new Date().toISOString(),
        confidence: 0.95,
        intent: "greeting",
      },
    ])
    setStats({
      totalMessages: 1,
      averageConfidence: 0.95,
      topIntents: ["greeting"],
      responseTime: 0,
    })
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center justify-center">
            <Brain className="h-10 w-10 mr-3 text-blue-600" />
            AI Chatbot Interface
          </h1>
          <p className="text-gray-600">Java-based AI Assistant with Natural Language Processing</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Chat Interface */}
          <div className="lg:col-span-3">
            <Card className="h-[600px] flex flex-col">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle className="flex items-center">
                  <MessageSquare className="h-5 w-5 mr-2" />
                  Chat Interface
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" onClick={() => setShowStats(!showStats)}>
                    <Settings className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={clearChat}>
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="flex-1 flex flex-col p-0">
                {/* Messages Area */}
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex items-start space-x-3 ${
                          message.sender === "user" ? "flex-row-reverse space-x-reverse" : ""
                        }`}
                      >
                        <div
                          className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                            message.sender === "user" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
                          }`}
                        >
                          {message.sender === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                        </div>

                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            message.sender === "user" ? "bg-blue-600 text-white" : "bg-white border border-gray-200"
                          }`}
                        >
                          <p className="text-sm">{message.message}</p>
                          {message.sender === "bot" && (
                            <div className="flex items-center justify-between mt-2 text-xs opacity-70">
                              <div className="flex items-center space-x-2">
                                {message.confidence && (
                                  <Badge variant="secondary" className="text-xs">
                                    {(message.confidence * 100).toFixed(0)}% confidence
                                  </Badge>
                                )}
                                {message.intent && (
                                  <Badge variant="outline" className="text-xs">
                                    {message.intent}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}

                    {isLoading && (
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                          <Bot className="h-4 w-4 text-gray-600" />
                        </div>
                        <div className="bg-white border border-gray-200 rounded-lg px-4 py-2">
                          <div className="flex items-center space-x-2">
                            <div className="flex space-x-1">
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                              <div
                                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                style={{ animationDelay: "0.1s" }}
                              ></div>
                              <div
                                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                style={{ animationDelay: "0.2s" }}
                              ></div>
                            </div>
                            <span className="text-sm text-gray-500">AI is thinking...</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div ref={messagesEndRef} />
                </ScrollArea>

                {/* Suggestions */}
                {suggestions.length > 0 && (
                  <div className="px-4 py-2 border-t bg-gray-50">
                    <div className="flex items-center mb-2">
                      <Lightbulb className="h-4 w-4 text-yellow-500 mr-2" />
                      <span className="text-sm font-medium text-gray-700">Suggestions:</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {suggestions.map((suggestion, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="text-xs"
                        >
                          {suggestion}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Input Area */}
                <div className="p-4 border-t">
                  <div className="flex space-x-2">
                    <Input
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type your message here..."
                      disabled={isLoading}
                      className="flex-1"
                    />
                    <Button onClick={sendMessage} disabled={isLoading || !inputMessage.trim()}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Stats and Info */}
          <div className="space-y-6">
            {/* Chatbot Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-sm">
                  <Zap className="h-4 w-4 mr-2" />
                  Chatbot Analytics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{stats.totalMessages}</div>
                  <div className="text-xs text-gray-500">Total Messages</div>
                </div>

                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{(stats.averageConfidence * 100).toFixed(0)}%</div>
                  <div className="text-xs text-gray-500">Avg Confidence</div>
                </div>

                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{stats.responseTime}ms</div>
                  <div className="text-xs text-gray-500">Response Time</div>
                </div>

                <div>
                  <div className="text-xs font-medium text-gray-700 mb-2">Top Intents:</div>
                  <div className="flex flex-wrap gap-1">
                    {stats.topIntents.slice(0, 3).map((intent, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {intent}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Features */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">AI Features</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Natural Language Processing</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Intent Recognition</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Entity Extraction</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Machine Learning</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Contextual Responses</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Real-time Learning</span>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start bg-transparent"
                  onClick={() => handleSuggestionClick("What services do you offer?")}
                >
                  Ask about services
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start bg-transparent"
                  onClick={() => handleSuggestionClick("How does the AI chatbot work?")}
                >
                  Learn about AI
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start bg-transparent"
                  onClick={() => handleSuggestionClick("What are your pricing options?")}
                >
                  Get pricing info
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start bg-transparent"
                  onClick={() => handleSuggestionClick("I need technical support")}
                >
                  Get support
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
