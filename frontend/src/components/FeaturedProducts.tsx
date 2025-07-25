import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, Heart } from 'lucide-react'
import { priceSymbol } from '../config/constants'
import { useToast } from '@/hooks/use-toast'
import { useProductList } from '../hooks/useProduct'
import { Skeleton } from '@/components/ui/skeleton'
import { useCartStore } from '../stores/useCartStore'

const ProductCard = ({ product, onAddToWishlist }: { product: any, onAddToWishlist: (product: any) => void }) => {
  const [isHovered, setIsHovered] = useState(false)
  const { toast } = useToast()
  const navigate = useNavigate()
  const {
    name,
    price,
    salePrice,
    isNew,
    isSale,
    slug,
    image
  } = product

  const handleAddToWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onAddToWishlist(product)
  }

  const handleView = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    navigate(`/product/${slug}`)
  }

  const getProductImage = (product: any) => {
    if (Array.isArray(product.image) && product.image.length > 0) return product.image[0]
    if (typeof product.image === 'string') return product.image
    return '/placeholder.png'
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
        {/* Quick actions */}
        <div className={`absolute inset-0 bg-black bg-opacity-20 transition-opacity duration-300 flex items-center justify-center ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <div className="flex space-x-2">
            <button 
              onClick={handleAddToWishlist}
              aria-label="Add to wishlist"
              className="bg-white text-revive-black p-2 rounded-full hover:bg-revive-gold hover:text-white transition-all"
            >
              <Heart size={18} />
            </button>
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
      <div className="p-4 border-t border-gray-100">
        <Link to={`/product/${slug}`}>
          <h3 className="text-medium text-revive-black mb-2 group-hover:text-revive-red transition-colors line-clamp-2">{name}</h3>
        </Link>
        <div className="flex justify-between items-center">
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
  )
}

const FeaturedProducts = () => {
  const { products, loading, error } = useProductList();
  const wishlist = useCartStore(state => state.wishlist)
  const setWishlist = useCartStore.setState
  const { toast } = useToast()
  // Sort by date descending, take 6 most recent
  const sorted = [...products].sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const featuredProducts = sorted.slice(0, 6);
  const rows = [featuredProducts.slice(0, 3), featuredProducts.slice(3, 6)];

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
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif mb-4">Featured Products</h2>
            <div className="w-24 h-1 bg-revive-red mx-auto"></div>
          </div>
          {[0, 1].map(rowIdx => (
            <div key={rowIdx} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {[0, 1, 2].map(idx => (
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
          ))}
          <div className="text-center mt-10">
            <Skeleton className="h-10 w-40 mx-auto" />
          </div>
        </div>
      </section>
    )
  }
  if (error) {
    return <div className="min-h-screen flex items-center justify-center">{error}</div>;
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif mb-4">Featured Products</h2>
          <div className="w-24 h-1 bg-revive-red mx-auto"></div>
        </div>
        {rows.map((row, i) => (
          <div key={i} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {row.map(product => (
              <ProductCard key={product._id || product.id} product={product} onAddToWishlist={handleAddToWishlist} />
            ))}
          </div>
        ))}
        <div className="text-center mt-10">
          <Link to="/shop" className="btn-primary inline-block">
            View All Products
          </Link>
        </div>
      </div>
    </section>
  )
}

export default FeaturedProducts
