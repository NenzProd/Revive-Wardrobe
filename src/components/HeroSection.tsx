import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CarouselSlide {
  id: number;
  backgroundImage: string;
  heading: string;
  description: string;
  modelsImage: string;
  productImage: string;
  buttonText: string;
}

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides: CarouselSlide[] = [
    {
      id: 1,
      backgroundImage: "/beach-background.gif",
      heading: "Love, Matched Perfectly",
      description:
        "Indulge in a set designed for two — where heart details, soft mesh, and satin bows meet confidence and comfort. Whether gifting or getting close, this matching lingerie duo turns moments into memories.",
      modelsImage: "/models-image.png",
      productImage: "/product-image.png",
      buttonText: "Unwrap Intimacy",
    },
    {
      id: 2,
      backgroundImage: "/beach-background.gif",
      heading: "Elegance Redefined",
      description:
        "Discover our collection of premium intimate wear designed to make you feel confident and beautiful. Our luxurious fabrics and thoughtful designs celebrate the art of self-expression.",
      modelsImage: "/models-image.png",
      productImage: "/product-image.png",
      buttonText: "Explore Collection",
    },
    {
      id: 3,
      backgroundImage: "/beach-background.gif",
      heading: "Perfect Pairs",
      description:
        "Our matching sets are crafted for those special moments when connection matters most. Designed with love and attention to every detail, these pieces create memories that last.",
      modelsImage: "/models-image.png",
      productImage: "/product-image.png",
      buttonText: "Shop Matching Sets",
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
    <div className="relative w-full h-[600px] overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-500 ${
            index === currentSlide
              ? "opacity-100"
              : "opacity-0 pointer-events-none"
          }`}
        >
          <div className="relative w-full h-full">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
              <img
                src={slide.backgroundImage}
                alt="Beach background"
                className="object-cover w-full h-full"
              />
            </div>

            {/* Content Container */}
            <div className="relative z-10 flex flex-col md:flex-row items-center h-full px-6 md:px-16 lg:px-24">
              {/* Left side - Models */}
              <div className="hidden md:block md:w-1/2 h-full relative">
                <div className="absolute bottom-0 left-0">
                  <img
                    src={slide.modelsImage}
                    alt="Models wearing matching underwear"
                    className="object-contain max-h-[500px]"
                  />
                </div>
              </div>

              {/* Right side - Text content */}
              <div className="w-full md:w-1/2 flex flex-col items-start md:items-start text-white space-y-6 bg-black/30 backdrop-blur-sm p-6 rounded-lg">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif tracking-tight">
                  {slide.heading}
                </h1>
                <p className="text-lg md:text-xl max-w-md">
                  {slide.description}
                </p>

                {/* Product image */}
                <div className="hidden md:block mt-8 mb-8">
                  <img
                    src={slide.productImage}
                    alt="Product image showing matching underwear"
                    className="object-contain max-h-[150px]"
                  />
                </div>

                {/* CTA Button */}
                <a
                  href="/shop"
                  className="bg-revive-red hover:bg-red-700 text-white font-bold py-3 px-8 rounded-full transition-colors duration-300 inline-block mt-6"
                >
                  {slide.buttonText}
                </a>
              </div>
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
