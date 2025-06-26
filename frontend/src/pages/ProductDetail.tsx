import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductImageGallery from '../components/ProductImageGallery';
import SizeGuide from '../components/SizeGuide';
import RelatedProducts from '../components/RelatedProducts';
import Newsletter from '../components/Newsletter';
import { Heart, Share2, Truck, Calendar, Scissors } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { priceSymbol } from '../config/constants';

import { useCartStore } from '../stores/useCartStore';
import { useProductBySlug } from '../hooks/useProduct';
import logo from '/logo.png'
import { Skeleton } from '@/components/ui/skeleton'
import React from 'react';

const ProductDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [displayPrice, setDisplayPrice] = useState<number | null>(null);
  const { toast } = useToast();
  const { addToCart } = useCartStore();
  const wishlist = useCartStore(state => state.wishlist)
  const setWishlist = useCartStore.setState
  const navigate = useNavigate();
  
  // Fetch product data based on slug
  const { product, loading, error } = useProductBySlug(slug || '');
  
  // Set default size and price when product loads
  React.useEffect(() => {
    if (product && product.variants && product.variants.length > 0) {
      setSelectedSize(product.variants[0].filter_value || null)
      setDisplayPrice(product.variants[0].retail_price)
    }
  }, [product])

  // Update price when selectedSize changes
  React.useEffect(() => {
    if (product && product.variants && selectedSize) {
      const variant = product.variants.find(v => v.filter_value === selectedSize)
      if (variant) setDisplayPrice(variant.retail_price)
    }
  }, [selectedSize, product])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <img
          src={logo}
          alt="Loading..."
          className="w-32 h-32 animate-pulse opacity-80"
          style={{ filter: 'drop-shadow(0 2px 8px rgba(220,38,38,0.15))' }}
        />
      </div>
    )
  }
  if (error) {
    return <div className="min-h-screen flex items-center justify-center">{error}</div>;
  }
  if (!product) {
    return <div className="min-h-screen flex items-center justify-center">Product not found</div>;
  }

  const {
    id,
    name,
    image,
    description,
    type,
    fabric,
    sizes,
    bestseller,
    stock
  } = product;

  const handleAddToCart = () => {
    if (product.variants && product.variants.length > 0 && !selectedSize) {
      toast({
        title: "Please select a size",
        variant: "destructive",
      });
      return;
    }
    const variant = product.variants.find(v => v.filter_value === selectedSize)
    addToCart({ ...product, price: variant ? variant.retail_price : displayPrice }, quantity, selectedSize || undefined);
    navigate('/cart');
    toast({
      title: "Added to cart",
      description: `${name} (${quantity}) has been added to your cart`,
    });
  };
  
  const handleAddToWishlist = () => {
    if (wishlist.some(item => item._id === product._id)) {
      toast({
        title: "Already in wishlist",
        description: `${name} is already in your wishlist`,
      });
      return;
    }
    setWishlist(state => ({ ...state, wishlist: [...state.wishlist, product] }))
    toast({
      title: "Added to wishlist",
      description: `${name} has been added to your wishlist`,
    });
  };

  // Share button handler
  const handleShare = () => {
    const url = window.location.href
    navigator.clipboard.writeText(url)
    toast({
      title: 'Link copied!',
      description: 'Product link copied to clipboard.'
    })
  }

  return (
    <div className="min-h-screen bg-white flex flex-col pt-[88px]">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 flex-grow">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex text-sm">
            <li className="mr-2">
              <a href="/" className="text-gray-500 hover:text-revive-red">Home</a>
            </li>
            <li className="mx-2 text-gray-500">/</li>
            <li className="mr-2">
              <a href="/shop" className="text-gray-500 hover:text-revive-red">Shop</a>
            </li>
            <li className="mx-2 text-gray-500">/</li>
            <li className="text-revive-red">{name}</li>
          </ol>
        </nav>
        
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Product Images */}
          <div className="lg:w-1/2">
            <ProductImageGallery images={image} />
          </div>
          
          {/* Product Info */}
          <div className="lg:w-1/2">
            <h1 className="text-3xl font-serif mb-4">{name}</h1>
            
            <div className="text-2xl font-bold text-revive-red mb-6">
              {priceSymbol} {displayPrice !== null ? displayPrice.toLocaleString() : ''}
            </div>
            
            <div className="mb-6">
              <p className="text-gray-600">{description}</p>
            </div>
            
            {/* Delivery Estimate */}
            <div className="flex items-center mb-6 bg-gray-50 p-4 rounded-md">
              <Truck size={18} className="text-revive-red mr-2" />
              <span className="text-sm">
                {product.deliveryEstimate ? `Estimated delivery: ${product.deliveryEstimate}` : 'Delivery estimate available at checkout'}
              </span>
            </div>
            
            {/* Size Selection */}
            {product.variants && product.variants.length > 0 && (
              <div className="mb-6">
                <h3 className="font-medium mb-2">Size</h3>
                <div className="flex gap-2 flex-wrap">
                  {product.variants.map((variant) => (
                    <button
                      key={variant.filter_value}
                      className={`px-4 py-2 border ${
                        selectedSize === variant.filter_value 
                          ? 'border-revive-red bg-revive-red text-white' 
                          : 'border-gray-300 hover:border-revive-red'
                      } rounded-md transition-colors`}
                      onClick={() => setSelectedSize(variant.filter_value)}
                    >
                      {variant.filter_value}
                    </button>
                  ))}
                </div>
                <div className="mt-2">
                  <button 
                    className="text-sm text-revive-gold hover:underline flex items-center"
                    onClick={() => document.getElementById('sizeGuideModal')?.classList.remove('hidden')}
                  >
                    <Calendar size={16} className="mr-1" />
                    Size Guide
                  </button>
                </div>
              </div>
            )}
            
            {/* Quantity Selector */}
            <div className="mb-6">
              <h3 className="font-medium mb-2">Quantity</h3>
              <div className="flex border border-gray-300 rounded-md w-32">
                <button 
                  className="px-3 py-2 hover:bg-gray-100 transition-colors"
                  onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                  disabled={stock === 0}
                >
                  -
                </button>
                <input 
                  type="number" 
                  className="w-full text-center border-0 focus:ring-0 focus:outline-none"
                  value={quantity}
                  readOnly
                />
                <button 
                  className="px-3 py-2 hover:bg-gray-100 transition-colors"
                  onClick={() => setQuantity(prev => Math.min(stock, prev + 1))}
                  disabled={stock === 0 || quantity >= stock}
                >
                  +
                </button>
              </div>
              {stock > 0 && (
                <div className="text-xs text-gray-500 mt-1">{stock} in stock</div>
              )}
              {stock === 0 && (
                <div className="text-xs text-red-500 mt-1">Out of stock</div>
              )}
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 mb-8">
              <Button 
                className="bg-revive-red hover:bg-revive-red/90 flex-1" 
                onClick={handleAddToCart}
                disabled={stock === 0}
              >
                {stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </Button>
              
              <Button 
                variant="outline" 
                className="border-gray-300 hover:bg-gray-50"
                onClick={handleAddToWishlist}
                disabled={stock === 0 || wishlist.some(item => item._id === product._id)}
              >
                <Heart size={18} className="mr-2" />
                Wishlist
              </Button>
              
              <Button 
                variant="outline" 
                className="border-gray-300 hover:bg-gray-50"
                onClick={handleShare}
              >
                <Share2 size={18} />
              </Button>
            </div>
            
            {/* Stitching Service CTA */}
            {type === 'Unstitched' && (
              <div className="bg-revive-gold/10 border border-revive-gold rounded-lg p-4 mb-8">
                <div className="flex items-center">
                  <Scissors size={24} className="text-revive-gold mr-3" />
                  <div>
                    <h3 className="font-serif text-lg mb-1">Custom Stitching Available</h3>
                    <p className="text-sm text-gray-600 mb-3">This unstitched fabric can be tailored to your measurements.</p>
                    <a 
                      href="/services/stitching" 
                      className="text-sm font-medium text-revive-gold hover:underline"
                    >
                      Book a Consultation
                    </a>
                  </div>
                </div>
              </div>
            )}
            
            {/* Product Tabs */}
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="shipping">Shipping</TabsTrigger>
              </TabsList>
              
              <TabsContent value="details" className="py-4">
                <div className="text-gray-600 space-y-4">
                  <p>{description}</p>
                </div>
              </TabsContent>
              
              
              <TabsContent value="shipping" className="py-4">
                <div className="text-gray-600 space-y-4">
                  <p>We ship to most countries worldwide. Delivery times may vary depending on your location.</p>
                  <p>Standard delivery: 3-5 business days</p>
                  <p>Express delivery: 1-2 business days</p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
        
        {/* Related Products */}
        <div className="mt-16">
          <h2 className="text-2xl font-serif mb-8 text-center">You May Also Like</h2>
          <RelatedProducts currentProductId={product._id} category={product.category} />
        </div>
      </div>
      
      {/* Size Guide Modal */}
      <SizeGuide />
      
      <Newsletter />
      <Footer />
    </div>
  );
};

export default ProductDetail;
