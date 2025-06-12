import { useProductList } from '../hooks/useProduct'
import ProductCard from './ProductCard';


interface RelatedProductsProps {
  currentProductId: string;
  category: string;
}

const RelatedProducts = ({ currentProductId, category }: RelatedProductsProps) => {
  const { products, loading, error } = useProductList();

  if (loading) return <div>Loading...</div>;
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
