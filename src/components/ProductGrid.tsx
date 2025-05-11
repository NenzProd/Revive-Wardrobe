
import { useEffect, useState } from 'react';
import ProductCard from './ProductCard';
import { getAllProducts } from '../data/products';
import { Product } from '../types/product';

interface ProductGridProps {
  viewMode: 'grid' | 'list';
  category?: string;
  sortOption?: string;
  minPrice?: number;
  maxPrice?: number;
  colors?: string[];
  types?: string[];
}

const ProductGrid = ({ 
  viewMode, 
  category = 'all', 
  sortOption = 'newest',
  minPrice = 0,
  maxPrice = 100000,
  colors = [],
  types = []
}: ProductGridProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  
  useEffect(() => {
    let filteredProducts = getAllProducts();
    
    // Apply category filter if not 'all'
    if (category !== 'all') {
      filteredProducts = filteredProducts.filter(product => 
        product.categories.includes(category)
      );
    }
    
    // Apply price range filter
    filteredProducts = filteredProducts.filter(product => {
      const price = product.salePrice || product.price;
      return price >= minPrice && price <= maxPrice;
    });
    
    // Apply colors filter
    if (colors.length > 0) {
      filteredProducts = filteredProducts.filter(product => 
        product.colors?.some(color => colors.includes(`color-${color.toLowerCase()}`))
      );
    }
    
    // Apply type filter (stitched/unstitched)
    if (types.length > 0) {
      filteredProducts = filteredProducts.filter(product => {
        if (types.includes('type-stitched') && product.isStitched) return true;
        if (types.includes('type-unstitched') && !product.isStitched) return true;
        return false;
      });
    }
    
    // Apply sorting
    switch (sortOption) {
      case 'price_low':
        filteredProducts.sort((a, b) => {
          const priceA = a.salePrice || a.price;
          const priceB = b.salePrice || b.price;
          return priceA - priceB;
        });
        break;
      case 'price_high':
        filteredProducts.sort((a, b) => {
          const priceA = a.salePrice || a.price;
          const priceB = b.salePrice || b.price;
          return priceB - priceA;
        });
        break;
      case 'popular':
        filteredProducts.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
        break;
      default: // newest
        filteredProducts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    
    setProducts(filteredProducts);
  }, [category, sortOption, minPrice, maxPrice, colors, types]);

  return (
    <div>
      {products.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-lg text-gray-500">No products found.</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {products.map(product => (
            <ProductCard key={product.id} product={product} layout="list" />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductGrid;
