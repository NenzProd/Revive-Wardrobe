import React from "react";
import { Link } from "react-router-dom";

const AboutSection = () => {
  return (
    <section className="h-auto md:h-[40vh] bg-white overflow-hidden">
      <div className="container mx-auto px-4 h-full">
        <div className="grid grid-cols-1 md:grid-cols-2 h-full gap-6">
          {/* Left Side - Story */}
          <div className="relative flex flex-col justify-start px-4 md:px-0 py-8 bg-white">
            {/* Vertical RW Icon - Simplified */}
            <div className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 h-full opacity-5 select-none pointer-events-none items-center justify-center -ml-16">
              <span className="text-[12rem] font-serif font-bold text-[#C10000] -rotate-90 whitespace-nowrap">
                RW
              </span>
            </div>

            <div className="relative z-10 max-w-md">
              <h1 className="text-4xl md:text-5xl font-serif text-[#C10000] mb-6">
                The Revive Story
              </h1>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Born from a passion for modest fashion, Revive Wardrobe blends
                tradition with contemporary elegance. We craft pieces that
                empower confident expression while honoring cultural heritage.
              </p>
              <Link to="/about">
                <button className="w-full md:w-auto bg-revive-red text-white px-6 py-3 rounded hover:bg-opacity-90 transition-all font-medium">
                  Full Story
                </button>
              </Link>
            </div>
          </div>

          {/* Right Side - Static Bento Images */}
          <div className="grid grid-cols-3 gap-4 p-4 md:p-0 h-[40vh] md:h-full">
            <div className="col-span-1 border-none relative overflow-hidden h-full rounded-2xl">
              <img
                src="https://res.cloudinary.com/dia8x6y6u/image/upload/v1766769973/duag2mafgf57xjzxl28k.jpg"
                alt="Lunar Glow"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="col-span-1 relative overflow-hidden h-full rounded-2xl">
              <img
                src="https://res.cloudinary.com/dia8x6y6u/image/upload/v1766768695/vrrqev7bmfwl3zrmgw8k.jpg"
                alt="Regal Rhythm"
                className="w-full h-full object-cover object-top"
              />
            </div>
            <div className="col-span-1 relative overflow-hidden h-full rounded-2xl">
              <img
                src="https://res.cloudinary.com/dia8x6y6u/image/upload/v1766769384/ytitpqsuvwkzb9qiaqyn.jpg"
                alt="Aurora Blossom"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
