
import React from 'react';
import {bg} from '../assets/assets.js';

const HeroSection = () => {
  return (
    <div className="relative bg-gradient-to-r from-revive-black to-gray-800 text-white">
      <div className="absolute inset-0 opacity-20  bg-cover bg-center" style={{ backgroundImage: `url(${bg})` }}></div>
      <div className="container mx-auto px-4 py-24 md:py-32 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-serif mb-6">
            Revive Wardrobe
          </h1>
          <h2 className="text-2xl md:text-3xl font-serif mb-6 text-revive-blush">
            Your Style, Reimagined
          </h2>
          <p className="text-lg mb-8 max-w-xl mx-auto text-gray-200">
            Step into a world where elegance meets empowerment. Discover timeless ethnic wear, luxurious abayas, intimate collections, and custom stitching designed just for you.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="/shop" className="btn-primary">
              Shop Now
            </a>
            <a href="/services" className="btn-outline border-white text-white hover:bg-white hover:text-revive-black">
              Explore Stitching Services
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
