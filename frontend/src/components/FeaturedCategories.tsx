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

  const handleClick = () => {
    navigate(link);
  };

  return (
    <div 
      onClick={handleClick}
      className="flex flex-col items-center cursor-pointer group transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95"
    >
      <div className="w-48 h-48 mb-4 relative">
        <div className="w-full h-full bg-pink-50 rounded-t-full rounded-b-3xl flex items-center justify-center overflow-hidden shadow-md border border-pink-100">
          <img 
            src={imageUrl} 
            alt={title}
            className="w-32 h-32 object-cover rounded-full shadow-sm"
          />
        </div>
      </div>
      <h3 className="text-lg font-semibold text-gray-800 text-center tracking-wide">{title}</h3>
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
      title: "Graceful Abayas Dubai",
      imageUrl: GracefulAbayas,
      link: "/shop/category/graceful-abayas"
    },
    {
      title: "Designer Jalabiya UAE",
      imageUrl: DesignerJalabiya,
      link: "/shop/category/designer-jalabiya"
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif mb-6 text-gray-800">Shop Modest Fashion Categories</h2>
          <div className="w-32 h-1 bg-revive-red mx-auto rounded-full"></div>
        </div>
        <div className="overflow-x-auto scrollbar-hide pb-4 md:overflow-x-visible">
          <div className="flex gap-8 px-4 md:px-0 md:justify-center md:gap-12 min-w-max md:min-w-0">
            {categories.map((category, index) => (
              <div key={index} className="flex-shrink-0">
                <CategoryCard {...category} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCategories;
