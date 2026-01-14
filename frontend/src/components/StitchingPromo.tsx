import React from 'react';
import { Scissors } from 'lucide-react';
import { StitchingServices} from '../assets/assets.js';
const StitchingPromo = () => {
  return (
    <section className="py-16 bg-gradient-to-r from-revive-black to-gray-800 text-white relative overflow-hidden">
    <div className="absolute inset-0 bg-cover bg-center opacity-10" style={{ backgroundImage: `url(${StitchingServices})` }}></div>


      
      {/* Gold accents */}
      <div className="absolute top-0 left-0 w-full h-1 bg-revive-gold"></div>
      <div className="absolute bottom-0 left-0 w-full h-1 bg-revive-gold"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="text-center md:text-left">
            <div className="inline-block p-4 rounded-full bg-revive-gold/20 mb-6">
              <Scissors size={36} className="text-revive-gold" />
            </div>
            <h2 className="text-3xl md:text-4xl font-serif mb-4">Custom Stitching Service</h2>
            <p className="text-lg mb-8 text-gray-300 max-w-lg">
              Your dream outfit is just a measurement away. Our expert custom stitching service in Dubai brings precision and artistry to every stitch, 
              ensuring your garment fits perfectly and feels luxurious against your skin.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="/stitching-service" className="btn-primary">
                Get Measured
              </a>
              
            </div>
          </div>
          
          <div className="hidden md:block">
            <div className="rounded-lg overflow-hidden border-4 border-revive-gold/30 shadow-2xl transform rotate-2">
              <img 
                src={StitchingServices} 
                alt="Custom Tailoring" 
                className="w-full h-96 object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StitchingPromo;
