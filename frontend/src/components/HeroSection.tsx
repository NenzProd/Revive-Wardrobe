import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useProductList } from "@/hooks/useProduct";

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { products, loading } = useProductList();

  const slides = useMemo(() => {
    const abayaProducts = products
      .filter(
        (p) =>
          p.category?.toLowerCase().includes("abaya") ||
          p.category?.toLowerCase().includes("graceful")
      )
      .slice(0, 6);

    return abayaProducts.map((product, index) => ({
      id: index + 1,
      title: product.name,
      description: "Handcrafted with elegance for you.",
      ctaPrimary: "Shop Now",
      image: product.image?.[0] || "",
      linkPrimary: `/product/${product.slug}`,
    }));
  }, [products]);

  const nextSlide = () => {
    if (slides.length === 0) return;
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  useEffect(() => {
    if (slides.length === 0) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 6000);
    return () => clearInterval(interval);
  }, [slides.length]);

  // Reset currentSlide if slides change
  useEffect(() => {
    if (currentSlide >= slides.length && slides.length > 0) {
      setCurrentSlide(0);
    }
  }, [slides.length, currentSlide]);

  if (loading) {
    return (
      <section className="relative w-full h-[60vh] md:h-[70vh] bg-gray-100">
        <div className="container mx-auto px-4 h-full flex items-center justify-center">
          <div className="animate-pulse text-gray-400">Loading...</div>
        </div>
      </section>
    );
  }

  if (slides.length === 0) {
    return null; // Or a fallback UI
  }

  return (
    <section className="relative w-full h-[30vh] md:h-[70vh] bg-white shadow-sm">
      <div className="container mx-auto px-4 h-full">
        <div className="flex flex-row h-full">
          {/* Left: Image Carousel 60-65% */}
          <div className="w-[65%] h-full relative overflow-hidden group">
            {slides.map((slide, index) => (
              <div
                key={slide.id}
                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                  index === currentSlide
                    ? "opacity-100 z-10"
                    : "opacity-0 -z-10"
                }`}
              >
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-contain object-center"
                />
                <div className="absolute inset-0 bg-black/10 md:bg-transparent" />
              </div>
            ))}
          </div>

          {/* Right: Content Side 35-40% */}
          <div className="w-[35%] h-full flex flex-col items-center justify-center bg-white p-4 md:p-12 text-center border-l border-gray-50">
            <div
              key={currentSlide}
              className="animate-in fade-in slide-in-from-bottom-4 duration-700 flex flex-col items-center"
            >
              <h2 className="text-3xl md:text-5xl font-serif text-amber-900 mb-3 md:mb-6 font-medium leading-tight">
                {slides[currentSlide]?.title}
              </h2>
              <p className="text-gray-600 text-sm md:text-lg font-light mb-6 md:mb-10 max-w-xs font-playfair tracking-wide">
                {slides[currentSlide]?.description}
              </p>
              <Link to={slides[currentSlide]?.linkPrimary || "/shop"}>
                <Button className="w-full md:w-auto bg-revive-red text-white hover:bg-opacity-90 px-4 py-2 md:px-6 md:py-3 rounded text-xs md:text-sm tracking-widest uppercase transition-all hover:scale-105 font-medium">
                  {slides[currentSlide]?.ctaPrimary}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
