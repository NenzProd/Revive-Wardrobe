import React from "react";
import { useNavigate } from "react-router-dom";
import {
  EthnicElegance,
  GracefulAbayas,
  DesignerJalabiya,
} from "../assets/assets";

interface CategoryCardProps {
  title: string;
  imageUrl: string;
  link: string;
}

const CategoryCard: React.FC<CategoryCardProps> = ({
  title,
  imageUrl,
  link,
}) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(link)}
      className="flex flex-col items-center cursor-pointer group"
    >
      {/* Minimalistic Image Container: Portrait aspect ratio, no shadow, subtle hover opacity */}
      <div className="w-48 h-64 mb-4 relative overflow-hidden">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </div>
      {/* Minimalistic Typography: Serif, slightly smaller, dark gray */}
      <h3 className="text-lg text-gray-900 text-center font-serif tracking-wide group-hover:text-revive-brown transition-colors">
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
      link: "/shop/category/ethnic-elegance",
    },
    {
      title: "Abayas",
      imageUrl: GracefulAbayas,
      link: "/shop/category/graceful-abayas",
    },
    // {
    //     title: "Designer Jalabiya",
    //     imageUrl: DesignerJalabiya,
    //     link: "/shop/category/designer-jalabiya"
    // }
  ];

  return (
    <section className="py-24 bg-[#EAE5D9]">
      {" "}
      {/* Beige background matching the visual */}
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif text-gray-900 tracking-tight">
            Explore Our Signature Styles
          </h2>
        </div>

        <div className="flex flex-wrap justify-center gap-8 md:gap-16">
          {categories.map((category, index) => (
            <CategoryCard key={index} {...category} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCategories;
