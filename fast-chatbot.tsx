"use client"

import type React from "react"

import { useState, useEffect, useRef, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, User, Zap, Clock, TrendingUp } from "lucide-react"

interface FastMessage {
  message: string
  sender: "user" | "bot"
  timestamp: number
  confidence?: number
  intent?: string
}

interface PerformanceStats {
  avgResponseTime: number
  totalMessages: number
  messagesPerSecond: number
  lastResponseTime: number
}

export default function FastChatbot() {
  const [messages, setMessages] = useState<FastMessage[]>([
    {
      message: "⚡ Fast AI ready! Ask me anything - I respond in milliseconds!",
      sender: "bot",
      timestamp: Date.now(),
      confidence: 0.99,
      intent: "greeting",
    },
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [stats, setStats] = useState<PerformanceStats>({
    avgResponseTime: 0,
    totalMessages: 1,
    messagesPerSecond: 0,
    lastResponseTime: 0,
  })

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const startTimeRef = useRef<number>(0)
  const responseTimesRef = useRef<number[]>([])

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  // Ultra-fast suggestion loading
  useEffect(() => {
    if (inputMessage.length > 1) {
      const timeoutId = setTimeout(() => {
        loadFastSuggestions(inputMessage)
      }, 100) // Minimal delay
      return () => clearTimeout(timeoutId)
    } else {
      setSuggestions([])
    }
  }, [inputMessage])

  const loadFastSuggestions = async (partial: string) => {
    try {
      // Simulate ultra-fast API call
      const mockSuggestions = [
        "What can you do?",
        "How fast are you?",
        "Tell me about your services",
        "What's your response time?",
      ]
      setSuggestions(mockSuggestions.filter((s) => s.toLowerCase().includes(partial.toLowerCase())).slice(0, 3))
    } catch (error) {
      console.error("Error loading suggestions:", error)
    }
  }

  const sendFastMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage: FastMessage = {
      message: inputMessage,
      sender: "user",
      timestamp: Date.now(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")
    setIsLoading(true)
    setSuggestions([])

    // Record start time for performance measurement
    startTimeRef.current = performance.now()

    try {
      // Simulate ultra-fast backend response
      const response = await simulateFastBackend(inputMessage)
      const endTime = performance.now()
      const responseTime = Math.round(endTime - startTimeRef.current)

      const botMessage: FastMessage = {
        message: response.message,
        sender: "bot",
        timestamp: Date.now(),
        confidence: response.confidence,
        intent: response.intent,
      }

      setMessages((prev) => [...prev, botMessage])

      // Update performance stats
      responseTimesRef.current.push(responseTime)
      if (responseTimesRef.current.length > 10) {
        responseTimesRef.current.shift() // Keep only last 10 measurements
      }

      const avgResponseTime = responseTimesRef.current.reduce((a, b) => a + b, 0) / responseTimesRef.current.length
      const messagesPerSecond = responseTimesRef.current.length > 0 ? 1000 / avgResponseTime : 0

      setStats((prev) => ({
        avgResponseTime: Math.round(avgResponseTime),
        totalMessages: prev.totalMessages + 2,
        messagesPerSecond: Math.round(messagesPerSecond * 10) / 10,
        lastResponseTime: responseTime,
      }))
    } catch (error) {
      console.error("Error:", error)
      const errorMessage: FastMessage = {
        message: "⚠️ Connection error - but I'm still fast!",
        sender: "bot",
        timestamp: Date.now(),
        confidence: 0.1,
        intent: "error",
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  // Simulate ultra-fast backend processing
  const simulateFastBackend = async (message: string): Promise<any> => {
    // Minimal delay to simulate network + processing
    await new Promise((resolve) => setTimeout(resolve, 50 + Math.random() * 100))

    const lowerMessage = message.toLowerCase()

    // Lightning-fast intent detection and response
    if (lowerMessage.includes("fast") || lowerMessage.includes("speed")) {
      return {
        message: "⚡ I'm optimized for speed! I typically respond in under 100ms with 99%+ accuracy.",
        confidence: 0.98,
        intent: "speed_inquiry",
      }
    } else if (lowerMessage.includes("hello") || lowerMessage.includes("hi")) {
      return {
        message: "⚡ Hi there! I'm your lightning-fast AI assistant. What can I help you with?",
        confidence: 0.96,
        intent: "greeting",
      }
    } else if (lowerMessage.includes("help")) {
      return {
        message:
          "🚀 I'm here to help instantly! I can answer questions, provide info, and assist with various tasks - all at blazing speed!",
        confidence: 0.94,
        intent: "help",
      }
    } else if (lowerMessage.includes("service") || lowerMessage.includes("do")) {
      return {
        message:
          "⚡ I offer ultra-fast AI assistance, instant responses, real-time chat, and lightning-quick problem solving!",
        confidence: 0.92,
        intent: "services",
      }
    } else if (lowerMessage.includes("time") || lowerMessage.includes("performance")) {
      return {
        message: `🏃‍♂️ My average response time is ${stats.avgResponseTime}ms! I process ${stats.messagesPerSecond} messages per second.`,
        confidence: 0.95,
        intent: "performance",
      }
    } else if (lowerMessage.includes("thank")) {
      return {
        message: "⚡ You're welcome! Speed is my specialty - anything else I can help with quickly?",
        confidence: 0.97,
        intent: "gratitude",
      }
    } else {
      return {
        message: "🚀 I understand! Let me help you with that right away. What specific information do you need?",
        confidence: 0.85,
        intent: "general",
      }
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendFastMessage()
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setInputMessage(suggestion)
    setSuggestions([])
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center justify-center">
            <Zap className="h-10 w-10 mr-3 text-green-600" />⚡ Fast AI Chatbot
          </h1>
          <p className="text-gray-600">Lightning-fast responses • Optimized performance • Real-time processing</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Performance Stats */}
          <div className="lg:col-span-1 space-y-4">
            <Card className="border-green-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center">
                  <TrendingUp className="h-4 w-4 mr-2 text-green-600" />⚡ Performance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{stats.lastResponseTime}ms</div>
                  <div className="text-xs text-gray-500">Last Response</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-blue-600">{stats.avgResponseTime}ms</div>
                  <div className="text-xs text-gray-500">Average Time</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-purple-600">{stats.messagesPerSecond}/s</div>
                  <div className="text-xs text-gray-500">Messages/Sec</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-orange-600">{stats.totalMessages}</div>
                  <div className="text-xs text-gray-500">Total Messages</div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-blue-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">🚀 Speed Features</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs">Instant Processing</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs">Cached Responses</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs">Optimized NLP</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs">Async Processing</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs">Memory Efficient</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Chat Interface */}
          <div className="lg:col-span-3">
            <Card className="h-[600px] flex flex-col border-green-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 bg-gradient-to-r from-green-50 to-blue-50">
                <CardTitle className="flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-green-600" />⚡ Ultra-Fast Chat
                </CardTitle>
                <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300">
                  {stats.avgResponseTime}ms avg
                </Badge>
              </CardHeader>

              <CardContent className="flex-1 flex flex-col p-0">
                {/* Messages */}
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-3">
                    {messages.map((message, index) => (
                      <div
                        key={index}
                        className={`flex items-start space-x-3 ${
                          message.sender === "user" ? "flex-row-reverse space-x-reverse" : ""
                        }`}
                      >
                        <div
                          className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                            message.sender === "user"
                              ? "bg-blue-600 text-white"
                              : "bg-gradient-to-r from-green-500 to-blue-500 text-white"
                          }`}
                        >
                          {message.sender === "user" ? <User className="h-4 w-4" /> : <Zap className="h-4 w-4" />}
                        </div>

                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            message.sender === "user"
                              ? "bg-blue-600 text-white"
                              : "bg-gradient-to-r from-green-100 to-blue-100 border border-green-200"
                          }`}
                        >
                          <p className="text-sm">{message.message}</p>
                          {message.sender === "bot" && (
                            <div className="flex items-center justify-between mt-2 text-xs">
                              <div className="flex items-center space-x-2">
                                {message.confidence && (
                                  <Badge variant="secondary" className="text-xs bg-green-200 text-green-800">
                                    {(message.confidence * 100).toFixed(0)}%
                                  </Badge>
                                )}
                                {message.intent && (
                                  <Badge variant="outline" className="text-xs border-blue-300 text-blue-700">
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
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-blue-500 flex items-center justify-center">
                          <Zap className="h-4 w-4 text-white animate-pulse" />
                        </div>
                        <div className="bg-gradient-to-r from-green-100 to-blue-100 border border-green-200 rounded-lg px-4 py-2">
                          <div className="flex items-center space-x-2">
                            <div className="flex space-x-1">
                              <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></div>
                              <div
                                className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                                style={{ animationDelay: "0.1s" }}
                              ></div>
                              <div
                                className="w-2 h-2 bg-green-500 rounded-full animate-bounce"
                                style={{ animationDelay: "0.2s" }}
                              ></div>
                            </div>
                            <span className="text-sm text-gray-600">⚡ Processing at light speed...</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div ref={messagesEndRef} />
                </ScrollArea>

                {/* Fast Suggestions */}
                {suggestions.length > 0 && (
                  <div className="px-4 py-2 border-t bg-gradient-to-r from-green-50 to-blue-50">
                    <div className="flex items-center mb-2">
                      <Zap className="h-4 w-4 text-green-500 mr-2" />
                      <span className="text-sm font-medium text-gray-700">⚡ Quick suggestions:</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {suggestions.map((suggestion, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="text-xs border-green-300 hover:bg-green-100 transition-all duration-100"
                        >
                          {suggestion}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Fast Input */}
                <div className="p-4 border-t bg-gradient-to-r from-green-50 to-blue-50">
                  <div className="flex space-x-2">
                    <Input
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="⚡ Type for instant response..."
                      disabled={isLoading}
                      className="flex-1 border-green-300 focus:border-green-500"
                    />
                    <Button
                      onClick={sendFastMessage}
                      disabled={isLoading || !inputMessage.trim()}
                      className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 transition-all duration-100"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="text-center mt-2">
                    <span className="text-xs text-gray-500">⚡ Optimized for speed • Press Enter to send</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
