import { useProductList } from "../hooks/useProduct";
import ProductCard from "./ProductCard";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

const FeaturedProducts = () => {
  const { products, loading } = useProductList();
  const [productCount, setProductCount] = useState(4);

  // Detect screen size and set product count accordingly
  useEffect(() => {
    const updateProductCount = () => {
      if (window.innerWidth < 768) {
        setProductCount(2); // Mobile: 2 products
      } else if (window.innerWidth < 1024) {
        setProductCount(3); // Tablet: 3 products
      } else {
        setProductCount(4); // Desktop: 4 products
      }
    };

    updateProductCount();
    window.addEventListener("resize", updateProductCount);
    return () => window.removeEventListener("resize", updateProductCount);
  }, []);

  // Slice products based on screen size
  const featuredProducts = products.slice(0, productCount);

  if (loading) {
    return (
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {[...Array(productCount)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 aspect-[3/4] rounded-lg mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (featuredProducts.length === 0) {
    return null;
  }

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-serif text-gray-900">
            Featured Collection
          </h2>
          <Link
            to="/shop"
            className="text-sm md:text-base text-revive-red hover:underline font-medium transition-colors"
          >
            View All →
          </Link>
        </div>

        {/* Product Grid - 4 on desktop, 3 on tablet, 2 on mobile */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
