import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

// Import images
import img1 from "@/assets/img/carasoul images/jalaibas (1).jpeg";
import img2 from "@/assets/img/carasoul images/jalaibas (2).jpeg";
import img3 from "@/assets/img/carasoul images/jalaibas (3).jpeg";
import img4 from "@/assets/img/carasoul images/jalaibas.jpg";

const SignatureAbayas = () => {
  const images = [img1, img2, img3, img4];

  return (
    <section className="py-8 md:py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Header - Minimalist */}
        <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-8 md:mb-12 border-b border-gray-100 pb-2 md:pb-4 text-center md:text-left">
          <div>
            <h2 className="text-xl md:text-4xl font-serif text-gray-900 mb-1 md:mb-2 tracking-tight">
              Our Graceful Abayas
            </h2>
            <p className="text-gray-500 text-xs md:text-sm">
              Timeless elegance for the modern woman.
            </p>
          </div>
          <Link to="/shop/category/graceful-abayas" className="hidden md:block">
            <Button className="bg-revive-red text-white hover:bg-revive-red/90 px-8 rounded-full">
              View All Abayas &rarr;
            </Button>
          </Link>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
          {images.map((image, index) => (
            <Link
              key={index}
              to="/shop/category/graceful-abayas"
              className="block group cursor-pointer"
            >
              <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-gray-50 mb-3">
                <img
                  src={image}
                  alt={`Graceful Abaya ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
              </div>
              <h3 className="text-sm md:text-base font-medium text-gray-900 group-hover:text-revive-red transition-colors">
                Graceful Abaya {index + 1}
              </h3>
              <p className="text-xs md:text-sm text-gray-500">AED 299.00</p>
            </Link>
          ))}
        </div>

        {/* Mobile View All Button */}
        <div className="mt-8 text-center md:hidden">
          <Link to="/shop/category/graceful-abayas">
            <Button className="w-full bg-revive-red text-white hover:bg-revive-red/90 rounded-full">
              View All Abayas
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default SignatureAbayas;
