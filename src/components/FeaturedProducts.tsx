
import React from 'react';
import { Heart, ShoppingCart } from 'lucide-react';
import { ZainabChottani, CrimsonLawn, CrimsonLuxury, CHARIZMAAGHAZE, SilkSleepwear, BridalCollection } from '../assets/assets.js';
import { priceSymbol } from '../config/constants';

interface Product {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  isNew?: boolean;
  isSale?: boolean;
}

const ProductCard: React.FC<Product> = ({ id, name, price, imageUrl, isNew, isSale }) => {
  return (
    <div className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
      <div className="relative overflow-hidden">
        {/* Product badges */}
        {isNew && (
          <span className="absolute top-2 left-2 bg-revive-gold text-white text-xs px-2 py-1 rounded z-10">
            New
          </span>
        )}
        {isSale && (
          <span className="absolute top-2 left-2 bg-revive-red text-white text-xs px-2 py-1 rounded z-10">
            Sale
          </span>
        )}
        
        {/* Product image */}
        <div className="h-80 overflow-hidden">
          <img 
            src={imageUrl} 
            alt={name}
            className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
          />
        </div>
        
        {/* Quick actions */}
        <div className="absolute inset-0 bg-black bg-opacity-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="flex space-x-2">
            <button aria-label="Add to wishlist" className="bg-white text-revive-black p-2 rounded-full hover:bg-revive-gold hover:text-white transition-all">
              <Heart size={18} />
            </button>
            <button aria-label="Quick view" className="bg-white text-revive-black p-2 rounded-full hover:bg-revive-gold hover:text-white transition-all">
              <ShoppingCart size={18} />
            </button>
          </div>
        </div>
      </div>
      
      {/* Product info */}
      <div className="p-4 border-t border-gray-100">
        <h3 className="font-medium text-revive-black mb-2 group-hover:text-revive-red transition-colors">{name}</h3>
        <div className="flex justify-between items-center">
          <p className="text-lg font-semibold text-revive-red">{priceSymbol} {price}</p>
          <button className="bg-revive-red text-white px-4 py-1 rounded text-sm hover:bg-opacity-90 transition-all">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

const FeaturedProducts = () => {
  const products: Product[] = [
    {
      id: 1,
      name: "Zainab Chottani – Lawn Suit",
      price: 3400,
      imageUrl: ZainabChottani,
      isNew: true
    },
    {
      id: 2,
      name: "Crimson – Lawn Cotton Suit",
      price: 7999.00,
      imageUrl: CrimsonLawn,
    },
    {
      id: 3,
      name: "Crimson Luxury – Full Embroidered Lawn",
      price: 12999.00,
      imageUrl: CrimsonLuxury,
    },
    {
      id: 4,
      name: "CHARIZMA AGHAZE NOU",
      price: 10999.00,
      imageUrl: CHARIZMAAGHAZE,
      isSale: true
    },
    {
      id: 5,
      name: "Zainab Chottani - Unstitched",
      price: 3400.00,
      imageUrl: SilkSleepwear,
    },
    {
      id: 6,
      name: "Crimson Luxury - Unstitched",
      price: 12999.00,
      imageUrl: BridalCollection,
      isNew: true
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif mb-4">Featured Products</h2>
          <div className="w-24 h-1 bg-revive-red mx-auto"></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map(product => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
        <div className="text-center mt-10">
          <a href="/shop" className="btn-primary inline-block">
            View All Products
          </a>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
