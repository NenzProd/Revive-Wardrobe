import React from "react";
import { useNavigate } from "react-router-dom";
import {
  EthnicElegance,
  GracefulAbayas,
  DesignerJalabiya,
} from "../assets/assets";
import { cn } from "@/lib/utils";

const BentoCategories = () => {
  const navigate = useNavigate();

  return (
    <section className="pt-6 pb-8 md:py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-12 text-center">
          <h2 className="text-4xl md:text-5xl font-serif text-gray-900 mb-4 tracking-tight">
            Our Gracefull Abayas
          </h2>
        </div>

        {/* Bento Grid */}
        <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-2 md:pb-0 md:grid md:grid-cols-4 md:gap-6 max-w-6xl mx-auto h-auto md:h-[70vh] md:auto-rows-auto scrollbar-hide">
          {/* Main Large Item (Left) - Abayas */}
          <div
            onClick={() => navigate("/shop?category=Graceful+Abayas")}
            className="min-w-[60vw] md:min-w-0 snap-start h-[26vh] md:h-auto col-span-1 row-span-2 md:col-span-2 md:row-span-2 relative group overflow-hidden rounded-3xl cursor-pointer"
          >
            <img
              src="https://res.cloudinary.com/dia8x6y6u/image/upload/v1766769973/duag2mafgf57xjzxl28k.jpg"
              alt="Lunar Glow Abaya"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
            <div className="absolute bottom-0 left-0 p-4 md:p-8 text-white">
              <h3 className="text-xl md:text-3xl font-serif mb-2">
                Lunar Glow Abaya
              </h3>
              <p className="text-white/80 text-sm mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 translate-y-4 group-hover:translate-y-0 hidden md:block">
                Discover everyday elegance.
              </p>
              <button className="hidden md:block bg-revive-red text-white px-4 py-2 md:px-6 md:py-3 rounded text-xs md:text-sm hover:bg-opacity-90 transition-all font-medium">
                Shop Collection
              </button>
            </div>
          </div>

          {/* Right Top - Jalabiyas */}
          <div
            onClick={() => navigate("/shop?category=Graceful+Abayas")}
            className="min-w-[60vw] md:min-w-0 snap-start h-[26vh] md:h-full col-span-1 row-span-1 md:col-span-2 md:row-span-1 relative group overflow-hidden rounded-3xl cursor-pointer"
          >
            <img
              src="https://res.cloudinary.com/dia8x6y6u/image/upload/v1766768695/vrrqev7bmfwl3zrmgw8k.jpg"
              alt="Regal Rhythm Abaya"
              className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
            <div className="absolute bottom-0 left-0 p-3 md:p-6 text-white">
              <h3 className="text-lg md:text-2xl font-serif mb-1">
                Regal Rhythm Abaya
              </h3>
              <p className="text-white/80 text-xs mb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500 hidden md:block">
                Luxury reimagined for comfort.
              </p>
            </div>
          </div>

          {/* Right Bottom Left - Ethnic Elegance */}
          <div
            onClick={() => navigate("/shop?category=Graceful+Abayas")}
            className="min-w-[60vw] md:min-w-0 snap-start h-[26vh] md:h-full col-span-1 row-span-1 md:col-span-1 md:row-span-1 relative group overflow-hidden rounded-3xl cursor-pointer"
          >
            <img
              src="https://res.cloudinary.com/dia8x6y6u/image/upload/v1766769384/ytitpqsuvwkzb9qiaqyn.jpg"
              alt="Aurora Blossom Abaya"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
            <div className="absolute inset-0 flex items-center justify-center">
              <h3 className="text-lg md:text-xl font-serif text-white text-center px-2">
                Aurora Blossom Abaya
              </h3>
            </div>
          </div>

          {/* Right Bottom Right - New Arrivals / Sale (Placeholder or link to Shop) */}
          <div
            onClick={() => navigate("/shop?category=Graceful+Abayas")}
            className="hidden md:flex md:min-w-0 snap-center h-[calc(30vh-4%)] md:h-full col-span-2 row-span-1 md:col-span-1 md:row-span-1 bg-transparent md:bg-gray-100 relative group overflow-hidden rounded-3xl cursor-pointer items-center justify-center text-center p-4 border-0 md:border md:border-gray-200 hover:border-black/10 transition-colors"
          >
            <div className="w-full flex items-center justify-center">
              <div className="md:mt-0 w-full md:w-auto px-6 py-3 rounded bg-revive-red text-white flex items-center justify-center mx-auto group-hover:scale-105 transition-all font-medium hover:bg-opacity-90">
                <span className="text-sm">View All</span>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile View All Button (Below Cards) */}
        <div
          onClick={() => navigate("/shop?category=Graceful+Abayas")}
          className="block md:hidden w-full mt-2 relative group overflow-hidden cursor-pointer flex items-center justify-center text-center p-4 transition-colors"
        >
          <div className="w-full">
            <div className="w-full px-6 py-3 rounded bg-revive-red text-white flex items-center justify-center mx-auto group-hover:scale-105 transition-all font-medium hover:bg-opacity-90">
              <span className="text-sm">View All</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BentoCategories;
