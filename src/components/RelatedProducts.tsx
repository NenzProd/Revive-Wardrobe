
import { useEffect, useState } from 'react';
import ProductCard from './ProductCard';
import { getRelatedProducts } from '../data/products';
import { Product } from '../types/product';

interface RelatedProductsProps {
  currentProductId: number;
}

const RelatedProducts = ({ currentProductId }: RelatedProductsProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  
  useEffect(() => {
    setProducts(getRelatedProducts(currentProductId));
  }, [currentProductId]);

  if (products.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default RelatedProducts;
