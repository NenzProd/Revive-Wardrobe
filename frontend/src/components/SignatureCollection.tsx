import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useProductList } from '../hooks/useProduct';
import { priceSymbol } from '../config/constants';
import { Skeleton } from '@/components/ui/skeleton';
import { useCartStore } from '../stores/useCartStore';

const SignatureCollection = () => {
  const { toast } = useToast();
  const { products, loading, error } = useProductList();
  const gracefulAbayas = products.filter((p: any) => p.bestseller === true);
  const wishlist = useCartStore(state => state.wishlist)
  const setWishlist = useCartStore.setState

  const handleAddToWishlist = (product: any) => {
    if (wishlist.some(item => item._id === product._id)) {
      toast({ title: 'Already in wishlist', description: `${product.name} is already in your wishlist.` })
      return
    }
    setWishlist(state => ({ ...state, wishlist: [...state.wishlist, product] }))
    toast({ title: 'Added to wishlist', description: `${product.name} has been added to your wishlist` })
  }

  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-br from-pink-50 to-rose-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif mb-4 text-revive-black">
              Revive Wardrobe's Signature: Graceful Abayas Collection
            </h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Discover our exclusive collection of elegant abayas designed for modern women. 
              Graceful, sophisticated, and timeless pieces to enhance your wardrobe.
            </p>
            <div className="w-24 h-1 bg-revive-red mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, idx) => (
              <div key={idx} className="group bg-white rounded-xl overflow-hidden shadow-lg transition-all duration-500">
                <div className="relative overflow-hidden">
                  <div className="h-96 overflow-hidden bg-gradient-to-br from-pink-100 to-rose-100 flex items-center justify-center">
                    <Skeleton className="w-full h-full" />
                  </div>
                </div>
                <div className="p-6 bg-white">
                  <Skeleton className="h-6 w-3/4 mb-3" />
                  <Skeleton className="h-5 w-1/2 mb-4" />
                  <Skeleton className="h-6 w-1/3" />
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Skeleton className="h-10 w-60 mx-auto" />
          </div>
        </div>
      </section>
    );
  }
  if (error) {
    return <div className="min-h-screen flex items-center justify-center">{error}</div>;
  }

  return (
    <section className="py-16 bg-gradient-to-br from-pink-50 to-rose-50">
      <div className="container mx-auto px-4">
        {/* Section Title */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif mb-4 text-revive-black">
            Revive Wardrobe's Signature: Graceful Abayas Collection
          </h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Discover our exclusive collection of elegant abayas designed for modern women. 
            Graceful, sophisticated, and timeless pieces to enhance your wardrobe.
          </p>
          <div className="w-24 h-1 bg-revive-red mx-auto"></div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {gracefulAbayas.map((product: any) => (
            <ProductCard 
              key={product._id || product.id} 
              product={product} 
              onAddToWishlist={() => handleAddToWishlist(product)}
            />
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Link 
            to="/shop?category=Graceful+Abayas" 
            className="inline-flex items-center px-8 py-3 bg-revive-red text-white font-medium rounded-lg hover:bg-revive-red/90 transition-colors duration-300 shadow-lg hover:shadow-xl"
          >
            Explore Full Collection
          </Link>
        </div>
      </div>
    </section>
  );
};

interface ProductCardProps {
  product: any;
  onAddToWishlist: () => void;
}

const ProductCard = ({ product, onAddToWishlist }: ProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleAddToWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onAddToWishlist();
  };

  const getProductImage = (product: any) => {
    if (Array.isArray(product.image) && product.image.length > 0) return product.image[0]
    if (typeof product.image === 'string') return product.image
    return '/placeholder.png'
  }

  return (
    <div 
      className="group bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative overflow-hidden">
        {/* Product badges */}
        <div className="absolute top-3 left-3 z-20 flex flex-col gap-2">
          {product.isNew && (
            <span className="bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs px-3 py-1 rounded-full font-medium shadow-md">
              New
            </span>
          )}
          {product.isSale && (
            <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs px-3 py-1 rounded-full font-medium shadow-md">
              Sale
            </span>
          )}
          <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-3 py-1 rounded-full font-medium shadow-md">
            Limited Sale
          </span>
        </div>
        
        {/* Product image */}
        <div className="h-96 overflow-hidden bg-gradient-to-br from-pink-100 to-rose-100 flex items-center justify-center">
          <Link to={`/product/${product.slug}`}>
            <img 
              src={getProductImage(product)} 
              alt={product.name}
              className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
              onError={(e) => {
                // Fallback to a placeholder image or text
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                target.parentElement!.innerHTML = `
                  <div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-pink-200 to-rose-200 text-gray-600">
                    <div class="text-center">
                      <div class="text-4xl mb-2">👗</div>
                      <div class="text-sm font-medium">${product.name}</div>
                    </div>
                  </div>
                `;
              }}
            />
          </Link>
        </div>
        
        {/* Quick actions overlay */}
        <div className={`absolute inset-0 bg-gradient-to-t from-black/30 to-transparent transition-opacity duration-300 flex items-center justify-center ${isHovered ? 'opacity-100' : 'opacity-0'} pointer-events-none`}>
          <div className="flex space-x-3 pointer-events-auto">
            <button 
              onClick={handleAddToWishlist}
              aria-label="Add to wishlist"
              className="bg-white/90 backdrop-blur-sm text-pink-600 p-3 rounded-full hover:bg-pink-500 hover:text-white transition-all duration-300 shadow-lg transform hover:scale-110"
            >
              <Heart size={20} />
            </button>
            <Link 
              to={`/product/${product.slug}`}
              className="bg-white/90 backdrop-blur-sm text-pink-600 p-3 rounded-full hover:bg-pink-500 hover:text-white transition-all duration-300 shadow-lg transform hover:scale-110 flex items-center justify-center"
              aria-label="Quick view"
            >
              <Eye size={20} />
            </Link>
          </div>
        </div>
      </div>
      
      {/* Product info */}
      <div className="p-6 bg-white">
        <Link to={`/product/${product.slug}`}>
          <h3 className="font-semibold text-gray-800 mb-3 group-hover:text-pink-600 transition-colors line-clamp-2 text-lg">
            {product.name}
          </h3>
        </Link>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
        
        <div className="flex justify-between items-center">
          {product.isSale && product.salePrice ? (
            <div className="flex items-center gap-2">
              <p className="text-xl font-bold text-pink-600">{priceSymbol} {product.salePrice.toLocaleString()}</p>
              <p className="text-sm text-gray-500 line-through">{priceSymbol} {product.price.toLocaleString()}</p>
            </div>
          ) : (
            <p className="text-xl font-bold text-pink-600">{priceSymbol} {product.price.toLocaleString()}</p>
          )}
          
          {product.sizes && (
            <div className="text-xs text-gray-500">
              Sizes: {product.sizes.join(', ')}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignatureCollection;
