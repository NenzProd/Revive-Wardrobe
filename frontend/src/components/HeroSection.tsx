
import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { slide1, slide2, slide3, productImage1,productImage2,productImage3 } from "@/assets/assets";

interface CarouselSlide {
  id: number;
  title: string;
  description: string;
  offer: string;
  ctaText: string;
  modelImage: string;
  productImage: string;
  link: string;
}

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides: CarouselSlide[] = [
    {
      id: 1,
      title: "\"I Licked It / So It's Mine\"",
      description: "Playfully claim your partner — one cheeky message at a time. Because love tastes better with laughter.",
      offer: "Get 10% OFF this wild set — Limited stock!",
      ctaText: "Shop the Fun Set",
      modelImage: slide1,
      productImage: productImage1,
      link: "/shop"
    },
    {
      id: 2,
      title: "\"PINKPLAY\" Black & Lace Set",
      description: "When sporty meets sexy — crafted for bold lovers. Elevate date nights with signature style.",
      offer: "Flat ₹200 OFF — Only this week!",
      ctaText: "Get the Luxe Look",
      modelImage: slide2,
      productImage: productImage2,
      link: "/shop?category=luxury"
    },
    {
      id: 3,
      title: "\"Hands Tearing Fabric\" Lace Set",
      description: "Unleash the tease with our most playful design yet. Perfect for couples who flirt with fire.",
      offer: "Save 15% on this flirty favorite!",
      ctaText: "Flirt & Shop Now",
      modelImage: slide3,
      productImage: productImage3,
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
          className={`absolute inset-0 transition-opacity duration-500 ${
            index === currentSlide ? "opacity-100 z-10" : "opacity-0 -z-10"
          }`}
        >
          {/* Mobile Layout */}
          <div className="flex flex-col h-full md:hidden">
            {/* Model Image - First on mobile */}
            <div className="w-full h-[40vh] relative mt-12">
              <img 
                src={slide.modelImage}
                alt={`Model for ${slide.title}`}
                className="w-full h-full object-cover object-top"
              />
            </div>
            
            {/* Text Content - Second on mobile */}
            <div className="w-full h-[20vh] bg-revive-black text-white flex items-center justify-center px-4 py-6">
              <div className="max-w-sm space-y-3 text-center">
                <h2 className="text-lg font-serif leading-tight">{slide.title}</h2>
                <p className="text-sm opacity-90 hidden sm:block">{slide.description}</p>
                <p className="text-revive-gold text-sm font-medium">{slide.offer}</p>
                <Link to={slide.link}>
                  <Button 
                    variant="default" 
                    className="mt-3 bg-revive-red hover:bg-revive-red/90 text-sm px-4 py-2"
                  >
                    {slide.ctaText}
                  </Button>
                </Link>
              </div>
            </div>
            
            {/* Product Image - Third on mobile */}
            <div className="w-full h-[30vh] bg-white flex items-center justify-center p-6">
              <img 
                src={slide.productImage}
                alt={slide.title}
                className="max-w-full max-h-full object-contain"
              />
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden md:flex flex-col h-full">
            {/* Model Image - Left half on desktop */}
            <div className="w-1/2 h-full absolute left-0 top-0 relative mt-12">
              <img 
                src={slide.modelImage}
                alt={`Model for ${slide.title}`}
                className="w-full h-full object-cover object-center"
              />
            </div>
            
            {/* Content Section - Right half on desktop */}
            <div className="w-1/2 h-full absolute right-0 top-0 flex flex-col bg-revive-black">
              {/* Product Image */}
              <div className="w-full h-[50%] bg-white flex items-center justify-center p-4 mt-12">
                <img 
                  src={slide.productImage}
                  alt={slide.title}
                  className="max-w-full max-h-full object-contain"
                />
              </div>
              
              {/* Text Content */}
              <div className="w-full h-[50%] flex items-center justify-center bg-revive-black text-white p-8">
                <div className="max-w-md space-y-4 text-center">
                  <h2 className="text-xl lg:text-2xl xl:text-3xl font-serif leading-tight">{slide.title}</h2>
                  <p className="text-sm lg:text-base opacity-90">{slide.description}</p>
                  <p className="text-revive-gold text-sm lg:text-lg font-medium">{slide.offer}</p>
                  <Link to={slide.link}>
                    <Button 
                      variant="default" 
                      className="mt-4 bg-revive-red hover:bg-revive-red/90 text-sm lg:text-base px-6 py-3"
                    >
                      {slide.ctaText}
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-1.5 sm:p-2 rounded-full z-20 h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 flex items-center justify-center"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-1.5 sm:p-2 rounded-full z-20 h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 flex items-center justify-center"
        aria-label="Next slide"
      >
        <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${
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
