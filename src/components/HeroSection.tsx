
import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { slide1, slide2, slide3 } from "@/assets/assets";

interface CarouselSlide {
  id: number;
  title: string;
  description: string;
  offer: string;
  ctaText: string;
  backgroundImage: string;
  link: string;
}

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides: CarouselSlide[] = [
    {
      id: 1,
      title: "Russian Couple – \"I Licked It / So It's Mine\"",
      description: "Playfully claim your partner — one cheeky message at a time. Because love tastes better with laughter.",
      offer: "Get 10% OFF this wild set — Limited stock!",
      ctaText: "Shop the Fun Set",
      backgroundImage: slide1,
      link: "/shop"
    },
    {
      id: 2,
      title: "French Couple – \"PINKPLAY\" Black & Lace Set",
      description: "When sporty meets sexy — crafted for bold lovers. Elevate date nights with signature style.",
      offer: "Flat ₹200 OFF — Only this week!",
      ctaText: "Get the Luxe Look",
      backgroundImage: slide2,
      link: "/shop?category=luxury"
    },
    {
      id: 3,
      title: "Chinese Couple – \"Hands Tearing Fabric\" Lace Set",
      description: "Unleash the tease with our most playful design yet. Perfect for couples who flirt with fire.",
      offer: "Save 15% on this flirty favorite!",
      ctaText: "Flirt & Shop Now",
      backgroundImage: slide3,
      link: "/shop?category=flirty"
    },
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-revive-black">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 flex flex-col md:flex-row transition-opacity duration-500 ${
            index === currentSlide ? "opacity-100 z-10" : "opacity-0 -z-10"
          }`}
        >
          {/* Left side - Image */}
          <div className="w-full md:w-1/2 h-1/2 md:h-full">
            <div 
              className="w-full h-full bg-cover bg-center"
              style={{ backgroundImage: `url(${slide.backgroundImage})` }}
              aria-label={`Slide ${index + 1} background`}
            />
          </div>
          
          {/* Right side - Content */}
          <div className="w-full md:w-1/2 h-1/2 md:h-full flex items-center justify-center bg-revive-black text-white p-8">
            <div className="max-w-md space-y-6">
              <h2 className="text-3xl md:text-4xl font-serif">{slide.title}</h2>
              <p className="text-lg opacity-90">{slide.description}</p>
              <p className="text-revive-gold text-xl font-medium">{slide.offer}</p>
              <Link to={slide.link}>
                <Button 
                  variant="default" 
                  className="mt-4 bg-revive-red hover:bg-revive-red/90"
                >
                  {slide.ctaText}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full z-20 h-12 w-12 flex items-center justify-center"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full z-20 h-12 w-12 flex items-center justify-center"
        aria-label="Next slide"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full ${
              index === currentSlide ? "bg-white" : "bg-white/50"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSection;
