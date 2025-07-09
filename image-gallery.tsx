"use client"

import { useState, useEffect } from "react"
import { X, ChevronLeft, ChevronRight, Filter } from "lucide-react"

interface ImageData {
  id: number
  src: string
  alt: string
  category: string
  title: string
}

const images: ImageData[] = [
  {
    id: 1,
    src: "/placeholder.svg?height=400&width=600",
    alt: "Mountain landscape",
    category: "nature",
    title: "Mountain Vista",
  },
  { id: 2, src: "/placeholder.svg?height=400&width=600", alt: "City skyline", category: "urban", title: "City Lights" },
  { id: 3, src: "/placeholder.svg?height=400&width=600", alt: "Ocean waves", category: "nature", title: "Ocean Waves" },
  { id: 4, src: "/placeholder.svg?height=400&width=600", alt: "Street art", category: "urban", title: "Street Art" },
  {
    id: 5,
    src: "/placeholder.svg?height=400&width=600",
    alt: "Forest path",
    category: "nature",
    title: "Forest Trail",
  },
  {
    id: 6,
    src: "/placeholder.svg?height=400&width=600",
    alt: "Modern architecture",
    category: "urban",
    title: "Modern Design",
  },
  {
    id: 7,
    src: "/placeholder.svg?height=400&width=600",
    alt: "Sunset beach",
    category: "nature",
    title: "Beach Sunset",
  },
  {
    id: 8,
    src: "/placeholder.svg?height=400&width=600",
    alt: "Night market",
    category: "urban",
    title: "Night Market",
  },
  { id: 9, src: "/placeholder.svg?height=400&width=600", alt: "Waterfall", category: "nature", title: "Hidden Falls" },
  {
    id: 10,
    src: "/placeholder.svg?height=400&width=600",
    alt: "Bridge view",
    category: "urban",
    title: "Bridge Crossing",
  },
  {
    id: 11,
    src: "/placeholder.svg?height=400&width=600",
    alt: "Desert landscape",
    category: "nature",
    title: "Desert Dunes",
  },
  {
    id: 12,
    src: "/placeholder.svg?height=400&width=600",
    alt: "Rooftop view",
    category: "urban",
    title: "Rooftop Perspective",
  },
]

const categories = ["all", "nature", "urban"]

export default function ImageGallery() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [lightboxImage, setLightboxImage] = useState<ImageData | null>(null)
  const [filteredImages, setFilteredImages] = useState<ImageData[]>(images)

  useEffect(() => {
    if (selectedCategory === "all") {
      setFilteredImages(images)
    } else {
      setFilteredImages(images.filter((img) => img.category === selectedCategory))
    }
  }, [selectedCategory])

  const openLightbox = (image: ImageData) => {
    setLightboxImage(image)
    document.body.style.overflow = "hidden"
  }

  const closeLightbox = () => {
    setLightboxImage(null)
    document.body.style.overflow = "unset"
  }

  const navigateLightbox = (direction: "prev" | "next") => {
    if (!lightboxImage) return

    const currentIndex = filteredImages.findIndex((img) => img.id === lightboxImage.id)
    let newIndex

    if (direction === "prev") {
      newIndex = currentIndex > 0 ? currentIndex - 1 : filteredImages.length - 1
    } else {
      newIndex = currentIndex < filteredImages.length - 1 ? currentIndex + 1 : 0
    }

    setLightboxImage(filteredImages[newIndex])
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!lightboxImage) return

      switch (e.key) {
        case "Escape":
          closeLightbox()
          break
        case "ArrowLeft":
          navigateLightbox("prev")
          break
        case "ArrowRight":
          navigateLightbox("next")
          break
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [lightboxImage, filteredImages])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-4xl font-bold text-gray-900 text-center mb-2">Image Gallery</h1>
          <p className="text-gray-600 text-center">Explore our curated collection of stunning photography</p>
        </div>
      </header>

      {/* Filter Controls */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-center gap-2 mb-8">
          <Filter className="h-5 w-5 text-gray-500" />
          <span className="text-gray-700 font-medium mr-4">Filter by:</span>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105 ${
                selectedCategory === category
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredImages.map((image) => (
            <div
              key={image.id}
              className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer bg-white"
              onClick={() => openLightbox(image)}
            >
              <div className="aspect-square overflow-hidden">
                <img
                  src={image.src || "/placeholder.svg"}
                  alt={image.alt}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>

              {/* Overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-end">
                <div className="p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="font-semibold text-lg">{image.title}</h3>
                  <p className="text-sm opacity-90 capitalize">{image.category}</p>
                </div>
              </div>

              {/* Category Badge */}
              <div className="absolute top-3 left-3">
                <span className="px-2 py-1 bg-white bg-opacity-90 text-xs font-medium text-gray-800 rounded-full capitalize">
                  {image.category}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredImages.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No images found in this category.</p>
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {lightboxImage && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4">
          {/* Close Button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 z-10 p-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full transition-all duration-200"
          >
            <X className="h-6 w-6 text-white" />
          </button>

          {/* Navigation Buttons */}
          <button
            onClick={() => navigateLightbox("prev")}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 p-3 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full transition-all duration-200"
          >
            <ChevronLeft className="h-6 w-6 text-white" />
          </button>

          <button
            onClick={() => navigateLightbox("next")}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 p-3 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full transition-all duration-200"
          >
            <ChevronRight className="h-6 w-6 text-white" />
          </button>

          {/* Image Container */}
          <div className="max-w-4xl max-h-full flex flex-col items-center">
            <img
              src={lightboxImage.src || "/placeholder.svg"}
              alt={lightboxImage.alt}
              className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
            />

            {/* Image Info */}
            <div className="mt-4 text-center text-white">
              <h2 className="text-2xl font-bold mb-2">{lightboxImage.title}</h2>
              <p className="text-gray-300 capitalize">{lightboxImage.category}</p>
            </div>
          </div>

          {/* Click outside to close */}
          <div className="absolute inset-0 -z-10" onClick={closeLightbox} />
        </div>
      )}

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 py-8 text-center">
          <p className="text-gray-600">
            Showing {filteredImages.length} of {images.length} images
          </p>
          <p className="text-sm text-gray-500 mt-2">Use arrow keys to navigate in lightbox view • Press ESC to close</p>
        </div>
      </footer>
    </div>
  )
}
