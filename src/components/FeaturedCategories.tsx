import React from 'react';
import { ArrowRight } from 'lucide-react';
import { EthnicElegance, GracefulAbayas, IntimateCollection, StitchingServices } from '../assets/assets';

interface CategoryCardProps {
  title: string;
  description: string;
  imageUrl: string;
  link: string;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ title, description, imageUrl, link }) => {
  return (
    <div className="relative group overflow-hidden rounded-lg bg-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl border border-gray-100">
      <div className="h-64 overflow-hidden">
        <div 
          className="h-full w-full bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
          style={{ backgroundImage: `url(${imageUrl})` }}
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-80"></div>
      <div className="absolute bottom-0 left-0 p-6 text-white">
        <h3 className="text-xl font-serif mb-2">{title}</h3>
        <p className="text-sm text-gray-200 mb-4">{description}</p>
        <a 
          href={link} 
          className="inline-flex items-center text-revive-gold hover:text-white transition-colors"
        >
          Discover <ArrowRight size={16} className="ml-1" />
        </a>
      </div>
    </div>
  );
};

const FeaturedCategories = () => {
  const categories = [
    {
      title: "Ethnic Elegance",
      description: "Traditional styles with a modern soul. Stitched or unstitched — your statement starts here.",
      imageUrl: EthnicElegance,
      link: "/category/ethnic"
    },
    {
      title: "Graceful Abayas",
      description: "Modest yet mesmerizing. Discover designs that flow with grace and confidence.",
      imageUrl: GracefulAbayas,
      link: "/category/abayas"
    },
    {
      title: "Intimate Collection",
      description: "Crafted for comfort, styled for you. Explore lingerie that redefines innerwear elegance.",
      imageUrl: IntimateCollection,
      link: "/category/intimate"
    },
    {
      title: "Stitching Services",
      description: "Your outfit, your way. Custom tailoring that brings your vision to life.",
      imageUrl: StitchingServices,
      link: "/services/stitching"
    },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif mb-4">Featured Categories</h2>
          <div className="w-24 h-1 bg-revive-red mx-auto"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <CategoryCard key={index} {...category} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCategories;
