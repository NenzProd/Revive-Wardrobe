import React from 'react';
import { useNavigate } from 'react-router-dom';
import { EthnicElegance, GracefulAbayas, DesignerJalabiya } from '../assets/assets';

interface CategoryCardProps {
  title: string;
  imageUrl: string;
  link: string;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ title, imageUrl, link }) => {
  const navigate = useNavigate();

  return (
    <div 
      onClick={() => navigate(link)}
      className="flex flex-col items-center cursor-pointer group"
    >
      <div className="w-48 h-48 mb-6 relative transition-transform duration-300 group-hover:-translate-y-2">
          <img 
            src={imageUrl} 
            alt={title}
            className="w-full h-full object-contain filter drop-shadow-xl"
          />
      </div>
      <h3 className="text-xl text-gray-800 text-center font-serif tracking-wide group-hover:text-revive-brown transition-colors">
        {title}
      </h3>
    </div>
  );
};

const FeaturedCategories = () => {
  const categories = [
    {
      title: "Ethnic Elegance",
      imageUrl: EthnicElegance,
      link: "/shop/category/ethnic-elegance"
    },
    {
      title: "Abayas",
      imageUrl: GracefulAbayas,
      link: "/shop/category/graceful-abayas"
    },
    // {
    //     title: "Designer Jalabiya",
    //     imageUrl: DesignerJalabiya,
    //     link: "/shop/category/designer-jalabiya"
    // }
  ];

  return (
    <section className="py-24 bg-[#EAE5D9]"> {/* Beige background matching the visual */}
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif text-gray-900 tracking-tight">
            Explore Our Signature Styles
          </h2>
        </div>
        
        <div className="flex flex-wrap justify-center gap-12 md:gap-24">
            {categories.map((category, index) => (
              <CategoryCard key={index} {...category} />
            ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCategories;
