
import React from 'react';
import { ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Newsletter = () => {
  const navigate = useNavigate();

  const handleShopClick = () => {
    navigate('/shop');
  };

  return (
    <section className="py-16 bg-revive-blush/30">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <ShoppingBag size={36} className="text-revive-red mx-auto mb-4" />
          <h2 className="text-3xl md:text-4xl font-serif mb-4">Get Shopping Today</h2>
          <p className="text-gray-600 mb-8">
            Discover our latest collections and find the perfect pieces to elevate your wardrobe.
          </p>
          <button 
            onClick={handleShopClick}
            className="bg-revive-red hover:bg-opacity-90 text-white px-8 py-3 rounded transition-all font-medium text-lg"
          >
            Start Shopping
          </button>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
