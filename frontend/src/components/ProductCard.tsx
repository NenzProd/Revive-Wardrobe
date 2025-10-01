import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, Heart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Product } from '../types/product';
import { useCartStore } from '../stores/useCartStore';
import { priceSymbol } from '../config/constants';

interface ProductCardProps {
  product: Product;
  layout?: 'grid' | 'list';
  onAddToWishlist?: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, layout = 'grid', onAddToWishlist }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const {
    id,
    name,
    price,
    slug,
    isNew,
    isSale,
    salePrice,
    type
  } = product;
  
  const wishlist = useCartStore(state => state.wishlist);
  const isInWishlist = wishlist.some(item => item._id === id);

  const handleAddToWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    toast({
      title: "Added to wishlist",
      description: `${name} has been added to your wishlist`,
    });
  };

  const handleView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/product/${slug}`);
  };

  const getProductImage = (product: Product) => {
    if (Array.isArray(product.image) && product.image.length > 0) return product.image[0]
    if (typeof product.image === 'string') return product.image
    return '/placeholder.png' // fallback image path
  }

  if (layout === 'list') {
    return (
      <div 
        className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Product Image */}
        <div className="relative w-1/3 overflow-hidden">
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
          
          <Link to={`/product/${slug}`}>
            <img 
              src={getProductImage(product)} 
              alt={name}
              className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
            />
          </Link>
        </div>
        
        {/* Product Info */}
        <div className="p-6 flex-1 flex flex-col justify-between">
          {type === 'Unstitched' && (
            <span className="inline-block bg-revive-black text-white text-xs px-2 py-1 rounded mb-2">
              Unstitched
            </span>
          )}
          
          <Link to={`/product/${slug}`}>
            <h3 className="font-medium text-revive-black text-lg mb-3 group-hover:text-revive-red transition-colors text-center">{name}</h3>
          </Link>
          
          <p className="text-gray-600 mb-4 line-clamp-2">{product.description}</p>
          
          <div className="mt-auto flex items-center justify-between">
            <div>
              {isSale && salePrice ? (
                <div className="flex items-center gap-2">
                  <p className="text-lg font-semibold text-revive-red">{priceSymbol} {salePrice.toLocaleString()}</p>
                  <p className="text-sm text-gray-500 line-through">{priceSymbol} {price.toLocaleString()}</p>
                </div>
              ) : (
                <p className="text-lg font-semibold text-revive-red">{priceSymbol} {price.toLocaleString()}</p>
              )}
            </div>
            
            {onAddToWishlist && (
              <button
                className="absolute top-2 right-2 p-2 bg-white rounded-full shadow hover:bg-gray-100 transition-colors z-10"
                aria-label={isInWishlist ? 'In wishlist' : 'Add to wishlist'}
                onClick={e => {
                  e.preventDefault()
                  e.stopPropagation()
                  if (!isInWishlist) onAddToWishlist(product)
                }}
                disabled={isInWishlist}
              >
                <Heart size={18} fill={isInWishlist ? '#ef4444' : 'none'} className={isInWishlist ? 'text-red-500' : ''} />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
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
          <Link to={`/product/${slug}`}>
            <img 
              src={getProductImage(product)} 
              alt={name}
              className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
            />
          </Link>
        </div>
        
        {/* Quick actions - Only keep the wishlist heart */}
        <div className={`absolute inset-0 bg-black bg-opacity-20 transition-opacity duration-300 flex items-center justify-center ${isHovered ? 'opacity-100' : 'opacity-0'} pointer-events-none`}>
          <div className="flex space-x-2 pointer-events-auto">
            {onAddToWishlist && (
              <button
                className="bg-white text-revive-black p-2 rounded-full hover:bg-revive-gold hover:text-white transition-all"
                aria-label={isInWishlist ? 'In wishlist' : 'Add to wishlist'}
                onClick={e => {
                  e.preventDefault()
                  e.stopPropagation()
                  if (!isInWishlist) onAddToWishlist(product)
                }}
                disabled={isInWishlist}
              >
                <Heart size={18} fill={isInWishlist ? '#ef4444' : 'none'} className={isInWishlist ? 'text-red-500' : ''} />
              </button>
            )}
            <button 
              onClick={handleView}
              aria-label="Quick view"
              className="bg-white text-revive-black p-2 rounded-full hover:bg-revive-gold hover:text-white transition-all"
            >
              <Eye size={18} />
            </button>
          </div>
        </div>
      </div>
      
      {/* Product info */}
      <div className="p-4 border-t border-gray-100 text-center">
        {type === 'Unstitched' && (
          <span className="inline-block bg-revive-black text-white text-xs px-2 py-1 rounded mb-2">
            Unstitched
          </span>
        )}
        
        <Link to={`/product/${slug}`}>
          <h3 className="font-medium text-revive-black mb-2 group-hover:text-revive-red transition-colors line-clamp-2">{name}</h3>
        </Link>
        
        <div className="flex justify-center items-center">
          {isSale && salePrice ? (
            <div className="flex items-center gap-2">
              <p className="text-lg font-semibold text-revive-red">{priceSymbol} {salePrice.toLocaleString()}</p>
              <p className="text-sm text-gray-500 line-through">{priceSymbol} {price.toLocaleString()}</p>
            </div>
          ) : (
            <p className="text-lg font-semibold text-revive-red">{priceSymbol} {price.toLocaleString()}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
