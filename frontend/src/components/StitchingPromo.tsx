
import React from 'react';
import { Scissors } from 'lucide-react';
import { StitchingServices} from '../assets/assets.js';
const StitchingPromo = () => {
  return (
    <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center z-0" 
        style={{ backgroundImage: `url(${StitchingServices})` }}
      />
      <div className="absolute inset-0 bg-black/75 z-0" /> {/* Dark overlay */}

      <div className="container mx-auto px-4 relative z-10 text-center text-white">
        
        {/* Title Section with Icon */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-8">
            <div className="text-revive-gold opacity-90">
                {/* SVG Icon matching the gold thread style approximated with Lucide or Custom SVG if available. 
                    Using Scissors for now as placeholder or existing icon, styled elegantly. 
                    If the user wants the exact needle/thread icon, I'd need an asset. 
                    I'll use a custom SVG representation for the needle/thread look if possible, 
                    or stick to Scissors with a rotation to look cooler.
                */}
                <Scissors size={64} strokeWidth={1} className="transform -rotate-45 text-[#d4af37]" />
            </div>
            <div className="text-left font-serif leading-tight">
                <h2 className="text-4xl md:text-6xl text-white">
                    Custom Stitching
                </h2>
                <h2 className="text-4xl md:text-6xl text-white">
                    Made to Measure
                </h2>
            </div>
        </div>

        {/* Description */}
        <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
          Get your outfit stitched exactly to your body measurements.
          <br className="hidden md:block" />
          Our expert tailoring ensures a perfect fit with refined finishing.
        </p>

        {/* Button */}
        <a href="/stitching-service">
            <button className="bg-[#8B0000] hover:bg-[#660000] text-white px-10 py-4 rounded text-lg font-medium transition-colors duration-300">
              Book Measurement
            </button>
        </a>

      </div>
    </section>
  );
};

export default StitchingPromo;
