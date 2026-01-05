
import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { slide1, slide2, slide3 } from "@/assets/assets";

interface CarouselSlide {
  id: number;
  title: string;
  description: string;
  subtext: string;
  ctaPrimary: string;
  ctaSecondary: string;
  image: string;
  linkPrimary: string;
  linkSecondary: string;
}

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides: CarouselSlide[] = [
    {
      id: 1,
      title: "Timeless Abayas for\nEffortless Elegance",
      description: "Handcrafted details, designed\nfor modern modest wear.",
      subtext: "",
      ctaPrimary: "Shop This Elegance",
      ctaSecondary: "Explore abayas",
      image: slide1,
      linkPrimary: "/shop",
      linkSecondary: "/shop?category=abayas"
    },
    {
      id: 2,
      title: "Royal Comfort\nDesigner Jalabiya",
      description: "Fusion of tradition and comfort.\nTailored for modern modesty.",
      subtext: "",
      ctaPrimary: "Shop This Elegance",
      ctaSecondary: "Explore Jalabiyas",
      image: slide2,
      linkPrimary: "/shop",
      linkSecondary: "/shop?category=jalabiyas"
    },
    // {
    //   id: 3,
    //   title: "Heritage Chic\nPakistani Dresses",
    //   description: "Intricate embroidery and timeless patterns.\nCrafted for elegance.",
    //   subtext: "",
    //   ctaPrimary: "Shop This Elegance",
    //   ctaSecondary: "Explore Collection",
    //   image: slide3,
    //   linkPrimary: "/shop",
    //   linkSecondary: "/shop?category=pakistani"
    // }
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
    <div className="relative w-full overflow-hidden bg-gray-50 font-sans">
      
      {/* --- Mobile Layout (Image Top, Text Bottom) --- */}
      <div className="md:hidden flex flex-col min-h-screen">
         {/* Image Slider Section */}
         <div className="relative w-full h-[45vh] bg-gray-200">
            {slides.map((slide, index) => (
                <div
                    key={slide.id}
                    className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
                        index === currentSlide ? "opacity-100 z-10" : "opacity-0 -z-10"
                    }`}
                >
                    <img 
                        src={slide.image} 
                        alt={slide.title} 
                        className="w-full h-full object-cover"
                    />
                </div>
            ))}
            
             {/* Mobile Navigation Arrows (Inside Image) */}
             <button
                onClick={prevSlide}
                className="absolute left-2 top-1/2 -translate-y-1/2 p-2 text-white/80 hover:text-white z-20"
                aria-label="Previous slide"
              >
                <ChevronLeft className="h-8 w-8" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-white/80 hover:text-white z-20"
                aria-label="Next slide"
              >
                <ChevronRight className="h-8 w-8" />
              </button>
         </div>

         {/* Content Section */}
         <div className="flex-1 bg-white flex items-center justify-center py-12 px-6 text-center">
            <div className="max-w-sm">
                 <div key={slides[currentSlide].id} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                     <h2 className="text-3xl font-serif text-gray-900 leading-tight mb-3">
                        {slides[currentSlide].title}
                     </h2>
                     <p className="text-gray-600 text-sm mb-8 leading-relaxed">
                        {slides[currentSlide].description}
                     </p>
                     
                     <div className="flex flex-col gap-3">
                        <Link to={slides[currentSlide].linkPrimary}>
                            <Button className="w-full bg-black text-white px-8 py-6 rounded-none text-base">
                                {slides[currentSlide].ctaPrimary}
                            </Button>
                        </Link>
                        <Link to={slides[currentSlide].linkSecondary}>
                            <Button variant="outline" className="w-full border-black text-black px-8 py-6 rounded-none text-base">
                                {slides[currentSlide].ctaSecondary}
                            </Button>
                        </Link>
                     </div>
                 </div>
            </div>
         </div>
      </div>

      {/* --- Desktop Layout (Full Screen Overlay) --- */}
      <div className="hidden md:block relative h-screen">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                index === currentSlide ? "opacity-100 z-10" : "opacity-0 -z-10"
              }`}
            >
                {/* Background Image */}
                <div className="absolute inset-0">
                    <img 
                        src={slide.image} 
                        alt={slide.title} 
                        className="w-full h-full object-cover object-top opacity-90"
                    />
                    <div className="absolute inset-0 bg-white/30 backdrop-blur-[1px]"></div>
                </div>

                {/* Content Container */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 md:px-0 z-20 translate-y-8">
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif text-gray-900 leading-tight mb-4 tracking-tight whitespace-pre-line">
                        {slide.title}
                    </h1>

                    <p className="text-gray-700 text-lg md:text-xl font-light mb-8 max-w-2xl whitespace-pre-line">
                        {slide.description}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <Link to={slide.linkPrimary}>
                            <Button 
                                className="bg-black text-white hover:bg-gray-800 text-sm md:text-base px-8 py-6 rounded-none w-full sm:w-auto min-w-[160px]"
                            >
                                {slide.ctaPrimary}
                            </Button>
                        </Link>
                        <Link to={slide.linkSecondary}>
                            <Button 
                                variant="outline"
                                className="bg-white border-black text-black hover:bg-gray-100 text-sm md:text-base px-8 py-6 rounded-none w-full sm:w-auto min-w-[160px]"
                            >
                                {slide.ctaSecondary}
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
          ))}

          {/* Navigation Arrows (Desktop) */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 text-gray-600 hover:text-black transition-colors z-20"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-10 w-10 font-thin" strokeWidth={1} />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-gray-600 hover:text-black transition-colors z-20"
            aria-label="Next slide"
          >
            <ChevronRight className="h-10 w-10 font-thin" strokeWidth={1} />
          </button>

          {/* Slide Indicators (Desktop) */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-3 z-30">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  index === currentSlide ? "bg-black scale-110" : "bg-gray-400/50 hover:bg-gray-600/50"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
      </div>
    </div>
  );
};

export default HeroSection;
