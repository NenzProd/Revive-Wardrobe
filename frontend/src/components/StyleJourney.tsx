import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const StyleJourney = () => {
  return (
    <section className="py-20 bg-[#F2EEE2]">
      <div className="container mx-auto px-4 text-center">
        
        <h2 className="text-4xl md:text-5xl font-serif text-gray-900 mb-6 tracking-tight">
          Begin Your Style Journey
        </h2>
        
        <p className="text-gray-500 text-lg md:text-xl max-w-lg mx-auto mb-10 leading-relaxed">
          Discover thoughtfully crafted abayas and ethnic wear designed for modern elegance.
        </p>

        <Link to="/shop">
          <Button className="bg-[#8B0000] hover:bg-[#660000] text-white px-10 py-6 text-lg rounded-xl font-medium shadow-lg transition-transform hover:scale-105">
            Explore Collections
          </Button>
        </Link>

      </div>
    </section>
  );
};

export default StyleJourney;
