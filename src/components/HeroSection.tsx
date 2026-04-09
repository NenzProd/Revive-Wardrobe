'use client'

import React, { useEffect, useMemo, useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0)

  const slides = useMemo(
    () => [
      {
        id: 1,
        title: "20% Off on All Abayas",
        subtitle: "Limited Time Offer",
        description:
          "Celebrate style with exclusive savings on our premium abaya collection. Use code ABAYA20 at checkout.",
        ctaPrimary: "Shop Now",
        ctaSecondary: "View Collection",
        linkPrimary: "/shop",
        linkSecondary: "/collections",
        image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&h=800&fit=crop",
      },
      {
        id: 2,
        title: "Traditional Meets Modern",
        subtitle: "Contemporary Designs",
        description:
          "Perfect blend of traditional elegance with modern styling for the sophisticated woman.",
        ctaPrimary: "Explore Designs",
        ctaSecondary: "Learn More",
        linkPrimary: "/shop/modern",
        linkSecondary: "/about",
        image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=1200&h=800&fit=crop",
      },
      {
        id: 3,
        title: "Handcrafted Excellence",
        subtitle: "Artisan Quality",
        description:
          "Each abaya is meticulously crafted by skilled artisans using premium materials.",
        ctaPrimary: "Shop Artisan",
        ctaSecondary: "Our Craftsmanship",
        linkPrimary: "/shop/artisan",
        linkSecondary: "/craftsmanship",
        image: "https://images.unsplash.com/photo-1612832879763-d2fd29f7368b?w=1200&h=800&fit=crop",
      },
    ],
    []
  )

  const goToNext = () =>
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1))

  const goToPrevious = () =>
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1))

  useEffect(() => {
    const interval = setInterval(goToNext, 7000)
    return () => clearInterval(interval)
  }, [slides.length])

  const activeSlide = slides[currentSlide]

  return (
    <section className="relative w-full min-h-[86vh] overflow-hidden bg-black">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-700 ${
            index === currentSlide ? "opacity-100 z-10" : "opacity-0 -z-10"
          }`}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.1),transparent_45%)]" />
          <img
            src={slide.image}
            alt={slide.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/70" />
        </div>
      ))}

      <div className="relative z-20 container mx-auto px-4 py-14 md:py-20 min-h-[86vh] flex items-center">
        <div className="max-w-2xl text-white">
          <p className="inline-flex rounded-full border border-white/30 bg-white/10 px-4 py-1 text-xs tracking-[0.18em] uppercase text-white/90">
            {activeSlide.subtitle}
          </p>
          <h2 className="mt-5 text-4xl md:text-6xl leading-tight font-serif">{activeSlide.title}</h2>
          <p className="mt-5 text-sm md:text-lg text-white/85 max-w-xl leading-relaxed">{activeSlide.description}</p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a href={activeSlide.linkPrimary}>
              <button className="bg-red-600 text-white px-7 py-6 rounded-md text-sm tracking-[0.14em] uppercase transition-all hover:scale-[1.02] hover:bg-red-700">
                {activeSlide.ctaPrimary}
              </button>
            </a>
            <a href={activeSlide.linkSecondary}>
              <button className="border border-white/30 text-white px-7 py-6 rounded-md text-sm tracking-[0.14em] uppercase hover:bg-white/10 transition-colors">
                {activeSlide.ctaSecondary}
              </button>
            </a>
          </div>
        </div>

        <div className="absolute right-4 md:right-10 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-2">
          <button
            onClick={goToPrevious}
            className="h-10 w-10 rounded-full border border-white/45 bg-black/35 text-white flex items-center justify-center hover:bg-black/60 transition-colors"
            aria-label="Previous slide"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={goToNext}
            className="h-10 w-10 rounded-full border border-white/45 bg-black/35 text-white flex items-center justify-center hover:bg-black/60 transition-colors"
            aria-label="Next slide"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        <div className="absolute bottom-7 left-1/2 -translate-x-1/2 z-30 flex gap-2">
          {slides.map((slide, index) => (
            <button
              key={`hero-dot-${slide.id}`}
              onClick={() => setCurrentSlide(index)}
              className={`h-2.5 rounded-full transition-all ${
                index === currentSlide ? "w-8 bg-white" : "w-2.5 bg-white/45 hover:bg-white/80"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 z-20 h-24 bg-gradient-to-t from-black/65 to-transparent" />
    </section>
  )
}

export default HeroSection