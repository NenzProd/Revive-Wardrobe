import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, Heart } from 'lucide-react';
import { Product } from '../types/product';
import { useCartStore } from '../stores/useCartStore';
import { priceSymbol } from '../config/constants';
import ProductCategoryBadges from './ProductCategoryBadges';
import {
  getPreferredVariant,
  getProductDisplayPrice,
  getProductFinalPrice,
  getVariantDiscount,
  isProductSoldOut,
} from '../lib/product';

interface ProductCardProps {
  product: Product;
  layout?: 'grid' | 'list';
}

const ProductCard: React.FC<ProductCardProps> = ({ product, layout = 'grid' }) => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
  
  const {
    _id,
    name,
    slug,
    type,
    variants
  } = product;
  
  // Derive price information from variants
  const primaryVariant = getPreferredVariant(product);
  const price = getProductDisplayPrice(product);
  const salePrice = getProductFinalPrice(product);
  const discount = getVariantDiscount(primaryVariant);
  const isSale = discount > 0;
  const isNew = false; // This would need to be determined by date or a separate field
  
  const wishlist = useCartStore(state => state.wishlist);
  const addToWishlist = useCartStore(state => state.addToWishlist);
  const removeFromWishlist = useCartStore(state => state.removeFromWishlist);
  const isInWishlist = wishlist.some(item => item._id === _id);
  const isSoldOut = isProductSoldOut(product);
  const isLimitedStock =
    !isSoldOut &&
    typeof primaryVariant?.stock === 'number' &&
    primaryVariant.stock > 0 &&
    primaryVariant.stock <= 3;

  const toggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!_id) {
      return;
    }

    if (isInWishlist) {
      await removeFromWishlist(_id);
    } else {
      await addToWishlist(product);
    }
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
        className="group bg-white rounded-lg overflow-hidden transition-all duration-300 flex border-2 border-transparent hover:border-revive-red/20 shadow-[8px_8px_20px_rgba(0,0,0,0.1),-8px_-8px_20px_rgba(255,255,255,0.7)] hover:shadow-[12px_12px_24px_rgba(0,0,0,0.15),-12px_-12px_24px_rgba(255,255,255,0.8)]"
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
          
          {isSoldOut && (
            <span className="absolute bottom-2 left-2 bg-revive-black/85 text-white text-xs px-2 py-1 rounded z-10">
              SOLD OUT
            </span>
          )}
          {isLimitedStock && (
            <span className="absolute top-10 left-2 bg-amber-600 text-white text-[10px] px-2 py-1 rounded z-10 animate-pulse">
              ONLY {primaryVariant.stock} LEFT
            </span>
          )}

          <Link to={`/product/${slug}`}>
            <img 
              src={getProductImage(product)} 
              alt={name}
              className={`w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-110 ${isSoldOut ? 'blur-[1px] grayscale' : ''}`}
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

          <ProductCategoryBadges product={product} align="center" className="mb-3" />
          
          <p className="text-gray-600 mb-4 line-clamp-2">{product.description}</p>
          
          <div className="mt-auto flex items-center justify-between">
            <div>
              {isSale && salePrice < price ? (
                <div className="flex items-center gap-2">
                  <p className="text-lg font-semibold text-revive-red">{priceSymbol} {salePrice.toLocaleString()}</p>
                  <p className="text-sm text-gray-500 line-through">{priceSymbol} {price.toLocaleString()}</p>
                </div>
              ) : (
                <p className="text-lg font-semibold text-revive-red">{priceSymbol} {price.toLocaleString()}</p>
              )}
            </div>
            
            <button
              className="absolute top-2 right-2 p-2 bg-white rounded-full shadow hover:bg-gray-100 transition-colors z-10"
              aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
              onClick={toggleWishlist}
            >
              <Heart size={18} fill={isInWishlist ? '#ef4444' : 'none'} className={isInWishlist ? 'text-red-500' : ''} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="group bg-white rounded-lg overflow-hidden transition-all duration-300 border-2 border-transparent hover:border-revive-red/20 shadow-[8px_8px_20px_rgba(0,0,0,0.1),-8px_-8px_20px_rgba(255,255,255,0.7)] hover:shadow-[12px_12px_24px_rgba(0,0,0,0.15),-12px_-12px_24px_rgba(255,255,255,0.8)]"
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
        {isSoldOut && (
          <span className="absolute bottom-2 left-2 bg-revive-black/85 text-white text-xs px-2 py-1 rounded z-10">
            SOLD OUT
          </span>
        )}
        {isLimitedStock && (
          <span className="absolute top-10 left-2 bg-amber-600 text-white text-[10px] px-2 py-1 rounded z-10 animate-pulse">
            ONLY {primaryVariant.stock} LEFT
          </span>
        )}
        <button
          className="absolute top-2 right-2 z-20 rounded-full bg-white p-2 text-revive-black shadow hover:bg-gray-100 transition-colors"
          aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          onClick={toggleWishlist}
        >
          <Heart size={18} fill={isInWishlist ? '#ef4444' : 'none'} className={isInWishlist ? 'text-red-500' : ''} />
        </button>
        
        {/* Product image */}
        <div className="h-80 overflow-hidden">
          <Link to={`/product/${slug}`}>
            <img 
              src={getProductImage(product)} 
              alt={name}
              className={`w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-110 ${isSoldOut ? 'blur-[1px] grayscale' : ''}`}
            />
          </Link>
        </div>
        
        {/* Quick actions - Only keep the wishlist heart */}
        <div className={`absolute inset-0 bg-black bg-opacity-20 transition-opacity duration-300 flex items-center justify-center ${isHovered ? 'opacity-100' : 'opacity-0'} pointer-events-none`}>
          <div className="flex space-x-2 pointer-events-auto">
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

        <ProductCategoryBadges product={product} align="center" className="mb-3" />
        
        <div className="flex justify-center items-center">
          {isSale && salePrice < price ? (
            <div className="flex items-center gap-2">
              <p className="text-lg font-semibold text-revive-red">{priceSymbol} {salePrice.toLocaleString()}</p>
              <p className="text-sm text-gray-500 line-through">{priceSymbol} {price.toLocaleString()}</p>
            </div>
          ) : (
            <p className="text-lg font-semibold text-revive-red">{priceSymbol} {price.toLocaleString()}</p>
          )}
        </div>
        {isLimitedStock && (
          <p className="mt-2 text-[11px] text-amber-700 font-medium">
            Loved fast. Secure this piece before it sells out.
          </p>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
