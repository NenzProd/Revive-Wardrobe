import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useProductList } from "@/hooks/useProduct";

// Import local carousel images
import auroraBlossomImg from "@/assets/img/carasoul images/aurora blossom.png";
import eternalNoirImg from "@/assets/img/carasoul images/eternal noir.png";
import lunarGlowImg from "@/assets/img/carasoul images/lunar glow.png";
import midnightEleganceImg from "@/assets/img/carasoul images/midnight elegance.png";
import regalImg from "@/assets/img/carasoul images/regal.png";
import twilightGraceImg from "@/assets/img/carasoul images/twilight grace.png";

// Map product names (lowercase) to local images
const localImageMap: Record<string, string> = {
  "aurora blossom": auroraBlossomImg,
  "eternal noir": eternalNoirImg,
  "lunar glow": lunarGlowImg,
  "midnight elegance": midnightEleganceImg,
  regal: regalImg,
  "twilight grace": twilightGraceImg,
};

// Helper function to get local image by product name
const getLocalImage = (productName: string): string | null => {
  const normalizedName = productName.toLowerCase().trim();

  // Try exact match first
  if (localImageMap[normalizedName]) {
    return localImageMap[normalizedName];
  }

  // Try partial match (if product name contains the key)
  for (const [key, image] of Object.entries(localImageMap)) {
    if (normalizedName.includes(key) || key.includes(normalizedName)) {
      return image;
    }
  }

  return null;
};

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

    return abayaProducts.map((product, index) => {
      // Use local image if available, otherwise fallback to product image
      const localImage = getLocalImage(product.name);

      return {
        id: index + 1,
        title: product.name,
        description: "Handcrafted with elegance for you.",
        ctaPrimary: "Shop Now",
        image: localImage || product.image?.[0] || "",
        linkPrimary: `/product/${product.slug}`,
      };
    });
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
      <section className="relative w-full h-[38vh] md:h-[60vh] bg-gray-100">
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
    <section className="relative w-full h-[38vh] md:h-[60vh] bg-white shadow-sm">
      <div className="container mx-auto px-3 md:px-4 h-full">
        <div className="flex flex-row h-full">
          {/* Left: Image Carousel */}
          <div className="w-[60%] md:w-[65%] h-full relative overflow-hidden group">
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
                  className="w-full h-full object-cover"
                  style={{ objectPosition: "center 13%" }}
                />
                <div className="absolute inset-0 bg-black/5 md:bg-transparent" />
              </div>
            ))}
          </div>

          {/* Right: Content Side */}
          <div className="w-[40%] md:w-[35%] h-full flex flex-col items-center justify-center bg-white p-2 md:p-12 text-center border-l border-gray-50">
            <div
              key={currentSlide}
              className="animate-in fade-in slide-in-from-bottom-4 duration-700 flex flex-col items-center"
            >
              <h2 className="text-base md:text-5xl font-serif text-amber-900 mb-2 md:mb-6 font-medium leading-tight line-clamp-3">
                {slides[currentSlide]?.title}
              </h2>
              <p className="text-gray-600 text-[10px] md:text-lg font-light mb-3 md:mb-10 max-w-xs font-playfair tracking-wide hidden md:block">
                {slides[currentSlide]?.description}
              </p>
              <Link to={slides[currentSlide]?.linkPrimary || "/shop"}>
                <Button className="w-full md:w-auto bg-revive-red text-white hover:bg-opacity-90 px-3 py-1.5 md:px-6 md:py-3 rounded text-[10px] md:text-sm tracking-widest uppercase transition-all hover:scale-105 font-medium">
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
