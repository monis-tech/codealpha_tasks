"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { RefreshCw, Quote } from "lucide-react"

interface QuoteData {
  text: string
  author: string
}

const quotes: QuoteData[] = [
  {
    text: "The only way to do great work is to love what you do.",
    author: "Steve Jobs",
  },
  {
    text: "Innovation distinguishes between a leader and a follower.",
    author: "Steve Jobs",
  },
  {
    text: "Life is what happens to you while you're busy making other plans.",
    author: "John Lennon",
  },
  {
    text: "The future belongs to those who believe in the beauty of their dreams.",
    author: "Eleanor Roosevelt",
  },
  {
    text: "It is during our darkest moments that we must focus to see the light.",
    author: "Aristotle",
  },
  {
    text: "The only impossible journey is the one you never begin.",
    author: "Tony Robbins",
  },
  {
    text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    author: "Winston Churchill",
  },
  {
    text: "The way to get started is to quit talking and begin doing.",
    author: "Walt Disney",
  },
  {
    text: "Don't let yesterday take up too much of today.",
    author: "Will Rogers",
  },
  {
    text: "You learn more from failure than from success. Don't let it stop you. Failure builds character.",
    author: "Unknown",
  },
  {
    text: "If you are working on something that you really care about, you don't have to be pushed. The vision pulls you.",
    author: "Steve Jobs",
  },
  {
    text: "Experience is a hard teacher because she gives the test first, the lesson afterwards.",
    author: "Vernon Law",
  },
  {
    text: "To live is the rarest thing in the world. Most people just exist.",
    author: "Oscar Wilde",
  },
  {
    text: "Believe you can and you're halfway there.",
    author: "Theodore Roosevelt",
  },
  {
    text: "The only person you are destined to become is the person you decide to be.",
    author: "Ralph Waldo Emerson",
  },
]

export default function QuoteGenerator() {
  const [currentQuote, setCurrentQuote] = useState<QuoteData>(quotes[0])
  const [isLoading, setIsLoading] = useState(false)

  const getRandomQuote = () => {
    setIsLoading(true)

    // Simulate a brief loading state for better UX
    setTimeout(() => {
      let newQuote: QuoteData
      do {
        const randomIndex = Math.floor(Math.random() * quotes.length)
        newQuote = quotes[randomIndex]
      } while (newQuote.text === currentQuote.text && quotes.length > 1)

      setCurrentQuote(newQuote)
      setIsLoading(false)
    }, 300)
  }

  // Load a random quote on initial render
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * quotes.length)
    setCurrentQuote(quotes[randomIndex])
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Random Quote Generator</h1>
          <p className="text-gray-600">Get inspired with wisdom from great minds</p>
        </div>

        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-8">
            <div className="text-center space-y-6">
              <Quote className="h-12 w-12 text-indigo-500 mx-auto opacity-50" />

              <blockquote className="text-xl md:text-2xl font-medium text-gray-800 leading-relaxed italic min-h-[4rem] flex items-center justify-center">
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <RefreshCw className="h-5 w-5 animate-spin" />
                    <span className="text-lg">Loading new quote...</span>
                  </div>
                ) : (
                  `"${currentQuote.text}"`
                )}
              </blockquote>

              {!isLoading && (
                <div className="text-right">
                  <cite className="text-lg text-indigo-600 font-semibold not-italic">— {currentQuote.author}</cite>
                </div>
              )}

              <div className="pt-4">
                <Button
                  onClick={getRandomQuote}
                  disabled={isLoading}
                  size="lg"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 text-lg font-medium transition-all duration-200 transform hover:scale-105"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="mr-2 h-5 w-5 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="mr-2 h-5 w-5" />
                      New Quote
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">Click the button above to discover more inspiring quotes</p>
        </div>
      </div>
    </div>
  )
}
