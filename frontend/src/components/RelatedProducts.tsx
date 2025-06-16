import { useProductList } from '../hooks/useProduct'
import ProductCard from './ProductCard';
import { Skeleton } from '@/components/ui/skeleton'


interface RelatedProductsProps {
  currentProductId: string;
  category: string;
}

const RelatedProducts = ({ currentProductId, category }: RelatedProductsProps) => {
  const { products, loading, error } = useProductList();

  if (loading) return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {[...Array(4)].map((_, idx) => (
        <div key={idx} className="group bg-white rounded-lg overflow-hidden shadow-sm transition-all duration-300">
          <div className="relative overflow-hidden">
            <div className="h-80 overflow-hidden">
              <Skeleton className="w-full h-full" />
            </div>
          </div>
          <div className="p-4 border-t border-gray-100">
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-5 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
  if (error) return <div>Error loading related products</div>;

  // Filter by category and exclude current product
  const relatedProducts = products.filter(
    p => p.category === category && p._id !== currentProductId
  );

  if (relatedProducts.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {relatedProducts.map(product => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
};

export default RelatedProducts;
