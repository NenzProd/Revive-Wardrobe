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

import { getProductBySlug } from '../data/products';
import { useCartStore } from '../stores/useCartStore';

const ProductDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const { toast } = useToast();
  const { addToCart } = useCartStore();
  const navigate = useNavigate();
  
  // Fetch product data based on slug
  const product = getProductBySlug(slug || '');
  
  if (!product) {
    return <div className="min-h-screen flex items-center justify-center">Product not found</div>;
  }

  const { 
    name, 
    price, 
    images, 
    description, 
    material, 
    careInstructions, 
    isStitched,
    deliveryEstimate, 
    sizes 
  } = product;

  const handleAddToCart = () => {
    if (sizes && sizes.length > 0 && !selectedSize) {
      toast({
        title: "Please select a size",
        variant: "destructive",
      });
      return;
    }
    
    addToCart(product, quantity, selectedSize || undefined);

    // redirect to cart page
     navigate('/cart'); 
    
    toast({
      title: "Added to cart",
      description: `${name} (${quantity}) has been added to your cart`,
    });
  };
  
  const handleAddToWishlist = () => {
    toast({
      title: "Added to wishlist",
      description: `${name} has been added to your wishlist`,
    });
  };

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
            <ProductImageGallery images={images} />
          </div>
          
          {/* Product Info */}
          <div className="lg:w-1/2">
            <h1 className="text-3xl font-serif mb-4">{name}</h1>
            
            <div className="text-2xl font-bold text-revive-red mb-6">
              {priceSymbol} {price.toLocaleString()}
            </div>
            
            <div className="mb-6">
              <p className="text-gray-600">{description}</p>
            </div>
            
            {/* Delivery Estimate */}
            <div className="flex items-center mb-6 bg-gray-50 p-4 rounded-md">
              <Truck size={18} className="text-revive-red mr-2" />
              <span className="text-sm">
                {deliveryEstimate ? `Estimated delivery: ${deliveryEstimate}` : 'Delivery estimate available at checkout'}
              </span>
            </div>
            
            {/* Size Selection */}
            {sizes && sizes.length > 0 && (
              <div className="mb-6">
                <h3 className="font-medium mb-2">Size</h3>
                <div className="flex gap-2 flex-wrap">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      className={`px-4 py-2 border ${
                        selectedSize === size 
                          ? 'border-revive-red bg-revive-red text-white' 
                          : 'border-gray-300 hover:border-revive-red'
                      } rounded-md transition-colors`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
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
                  onClick={() => setQuantity(prev => prev + 1)}
                >
                  +
                </button>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 mb-8">
              <Button 
                className="bg-revive-red hover:bg-revive-red/90 flex-1" 
                onClick={handleAddToCart}
              >
                Add to Cart
              </Button>
              
              <Button 
                variant="outline" 
                className="border-gray-300 hover:bg-gray-50"
                onClick={handleAddToWishlist}
              >
                <Heart size={18} className="mr-2" />
                Wishlist
              </Button>
              
              <Button 
                variant="outline" 
                className="border-gray-300 hover:bg-gray-50"
              >
                <Share2 size={18} />
              </Button>
            </div>
            
            {/* Stitching Service CTA */}
            {!isStitched && (
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
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="material">Material & Care</TabsTrigger>
                <TabsTrigger value="shipping">Shipping</TabsTrigger>
              </TabsList>
              
              <TabsContent value="details" className="py-4">
                <div className="text-gray-600 space-y-4">
                  <p>{description}</p>
                </div>
              </TabsContent>
              
              <TabsContent value="material" className="py-4">
                <div className="text-gray-600 space-y-4">
                  <div>
                    <h4 className="font-medium text-revive-black mb-2">Material</h4>
                    <p>{material}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-revive-black mb-2">Care Instructions</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      {careInstructions.map((instruction, index) => (
                        <li key={index}>{instruction}</li>
                      ))}
                    </ul>
                  </div>
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
          <RelatedProducts currentProductId={product.id} />
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
