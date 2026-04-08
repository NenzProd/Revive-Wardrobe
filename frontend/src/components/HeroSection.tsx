import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { PRIMARY_BUTTON_CLASS, SECONDARY_BUTTON_CLASS } from "@/lib/buttonStyles";

import auroraBlossomImg from "@/assets/img/carasoul images/aurora blossom.png";
import regalImg from "@/assets/img/carasoul images/regal.png";
import twilightGraceImg from "@/assets/img/carasoul images/twilight grace.png";

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = useMemo(
    () => [
      {
        id: 1,
        title: "Dubai Evenings, Timeless Abayas",
        subtitle: "Graceful Abayas",
        description:
          "Flowing silhouettes and couture-level finishing made for elegant nights and statement entrances.",
        ctaPrimary: "Explore Abayas",
        ctaSecondary: "View Collection",
        image: twilightGraceImg,
        linkPrimary: "/shop/category/graceful-abayas",
        linkSecondary: "/shop/category/graceful-abayas",
      },
      {
        id: 2,
        title: "Pakistani Craft, Modern Luxe",
        subtitle: "Ethnic Elegance",
        description:
          "Refined Pakistani wear with premium drape, rich textures, and a contemporary Dubai luxury look.",
        ctaPrimary: "Shop Ethnic Elegance",
        ctaSecondary: "Discover Styles",
        image: regalImg,
        linkPrimary: "/shop/category/ethnic-elegance",
        linkSecondary: "/shop/category/ethnic-elegance",
      },
      {
        id: 3,
        title: "Jalabiya, Reimagined in Luxury",
        subtitle: "Jalabiya",
        description:
          "Soft structure, graceful movement, and polished details for modern celebratory dressing.",
        ctaPrimary: "Shop Jalabiya",
        ctaSecondary: "See New Arrivals",
        image: auroraBlossomImg,
        linkPrimary: "/shop/category/jalabiya",
        linkSecondary: "/shop/category/jalabiya",
      },
    ],
    []
  );

  const goToNext = () =>
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));

  const goToPrevious = () =>
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));

  useEffect(() => {
    const interval = setInterval(goToNext, 7000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const activeSlide = slides[currentSlide];

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
            className="absolute inset-0 w-full h-full object-contain"
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
            <Link to={activeSlide.linkPrimary}>
              <Button className={`${PRIMARY_BUTTON_CLASS} px-7 py-6 rounded-md text-sm tracking-[0.14em] uppercase transition-all hover:scale-[1.02]`}>
                {activeSlide.ctaPrimary}
              </Button>
            </Link>
            <Link to={activeSlide.linkSecondary}>
              <Button variant="outline" className={`${SECONDARY_BUTTON_CLASS} px-7 py-6 rounded-md text-sm tracking-[0.14em] uppercase`}>
                {activeSlide.ctaSecondary}
              </Button>
            </Link>
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
  );
};

export default HeroSection;
