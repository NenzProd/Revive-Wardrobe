import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Newsletter from '../components/Newsletter';
import { useCartStore } from '../stores/useCartStore';
import { Minus, Plus, X, Heart, Trash2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { priceSymbol } from '../config/constants';
import SEO from '../components/SEO';

const Cart = () => {
  const { 
    cart, 
    removeFromCart, 
    updateQuantity, 
    moveToWishlist,
    subtotal,
    shippingCost,
    total
  } = useCartStore();
  
  const [couponCode, setCouponCode] = useState('');
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const navigate = useNavigate();
  
  // Fetch latest product data for stock validation
  const [productsData, setProductsData] = useState([]);
  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch('/api/product/list');
        const data = await res.json();
        if (data.success) setProductsData(data.products);
      } catch {}
    }
    fetchProducts();
  }, []);

  // Helper to get variant stock for a cart item
  function getVariantStock(item) {
    const product = productsData.find(p => p._id === item._id);
    if (!product || !item.selectedSize) return 9999;
    const variant = product.variants?.find(v => v.filter_value === item.selectedSize);
    return variant ? variant.stock : 9999;
  }

  const handleCouponApply = () => {
    if (!couponCode.trim()) {
      toast({
        title: "Error",
        description: "Please enter a coupon code.",
        variant: "destructive"
      });
      return;
    }
    
    setIsApplyingCoupon(true);
    
    // Simulate API call for coupon validation
    setTimeout(() => {
      setIsApplyingCoupon(false);
      toast({
        title: "Invalid coupon",
        description: "The coupon code you entered is invalid or expired.",
        variant: "destructive"
      });
      setCouponCode('');
    }, 1000);
  };
  
  const handleCheckout = () => {
    // Validate stock for all items
    for (const item of cart) {
      const stock = getVariantStock(item);
      if (item.quantity > stock) {
        toast({
          title: 'Stock error',
          description: `Only ${stock} in stock for ${item.name} (${item.selectedSize})`,
          variant: 'destructive'
        });
        return;
      }
      if (stock === 0) {
        toast({
          title: 'Out of stock',
          description: `${item.name} (${item.selectedSize}) is out of stock`,
          variant: 'destructive'
        });
        return;
      }
    }
    navigate('/checkout');
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <SEO 
        title="Shopping Cart - Review Your Items"
        description="Review your shopping cart at Revive Wardrobe. Check your selected items, update quantities, and proceed to secure checkout."
        keywords="shopping cart, checkout, online shopping, fashion cart, buy clothes online dubai, online fashion store uae, dubai clothing store, modest fashion dubai, shein dubai uae online, online clothes shopping uae, abaya online uae, zara uae online, shein online shopping dubai, matalan uae online, order clothes online dubai, best abaya shops in Dubai, Dubai abaya online worldwide shipping, abaya shop Dubai online, luxury abaya Dubai online"
        canonical="/cart"
      />
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 flex-grow">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-serif mb-4">Your Cart</h1>
          <div className="w-24 h-1 bg-revive-red mx-auto mb-6"></div>
        </div>
        
        {cart.length === 0 ? (
          <div className="text-center py-16">
            <h2 className="text-2xl font-serif mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-8">Looks like you haven't added any items to your cart yet.</p>
            <Link to="/shop">
              <Button className="bg-revive-gold hover:bg-revive-gold/90">
                Continue Shopping
              </Button>
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Cart Items */}
            <div className="lg:w-2/3">
              <div className="rounded-lg border border-gray-200 overflow-hidden">
                {/* Header */}
                <div className="hidden md:grid md:grid-cols-12 gap-4 bg-gray-50 p-4">
                  <div className="md:col-span-6">
                    <span className="font-medium">Product</span>
                  </div>
                  <div className="md:col-span-2 text-center">
                    <span className="font-medium">Price</span>
                  </div>
                  <div className="md:col-span-2 text-center">
                    <span className="font-medium">Quantity</span>
                  </div>
                  <div className="md:col-span-2 text-center">
                    <span className="font-medium">Total</span>
                  </div>
                </div>
                
                {/* Cart Items */}
                <div className="divide-y divide-gray-200">
                  {cart.map((item) => {
                    const itemPrice = (item as any).salePrice || item.price;
                    const itemTotal = itemPrice * item.quantity;
                    const stock = getVariantStock(item);
                    
                    return (
                      <div key={`${item._id}-${item.selectedSize}-${item.selectedColor}`} className="p-4">
                        <div className="grid md:grid-cols-12 gap-4 items-center">
                          {/* Product */}
                          <div className="md:col-span-6 flex items-center space-x-4">
                            <div className="relative">
                              <img 
                                src={item.image[0]} 
                                alt={item.name} 
                                className="w-20 h-20 object-cover rounded-md"
                              />
                              <button
                                onClick={() => removeFromCart(item._id)}
                                className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow hover:bg-gray-100"
                                aria-label="Remove item"
                              >
                                <X size={16} className="text-gray-600" />
                              </button>
                            </div>
                            <div>
                              <h3 className="font-medium text-sm md:text-base">
                                <Link to={`/product/${item.slug}`} className="hover:text-revive-red">
                                  {item.name}
                                </Link>
                              </h3>
                              {item.selectedSize && (
                                <p className="text-gray-600 text-xs md:text-sm">Size: {item.selectedSize}</p>
                              )}
                              {item.selectedColor && (
                                <p className="text-gray-600 text-xs md:text-sm">Color: {item.selectedColor}</p>
                              )}
                              <div className="flex space-x-2 mt-2">
                                <button
                                  onClick={() => moveToWishlist(item._id)}
                                  className="text-xs flex items-center text-gray-600 hover:text-revive-red"
                                >
                                  <Heart size={14} className="mr-1" />
                                  <span className="hidden sm:inline">Move to Wishlist</span>
                                  <span className="sm:hidden">Wishlist</span>
                                </button>
                                <button
                                  onClick={() => removeFromCart(item._id)}
                                  className="text-xs flex items-center text-gray-600 hover:text-revive-red"
                                >
                                  <Trash2 size={14} className="mr-1" />
                                  <span className="hidden sm:inline">Remove</span>
                                </button>
                              </div>
                            </div>
                          </div>
                          
                          {/* Price */}
                          <div className="md:col-span-2 text-center">
                            <p className="font-medium">
                              {item.salePrice ? (
                                <>
                                  <span className="text-revive-red">{priceSymbol} {item.salePrice.toLocaleString()}</span>
                                  <span className="line-through text-gray-500 text-xs ml-2">
                                    {priceSymbol} {item.price.toLocaleString()}
                                  </span>
                                </>
                              ) : (
                                <span>{priceSymbol} {item.price.toLocaleString()}</span>
                              )}
                            </p>
                          </div>
                          
                          {/* Quantity */}
                          <div className="md:col-span-2">
                            <div className="flex items-center justify-center border rounded-md max-w-[120px] mx-auto">
                              <button
                                onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                                disabled={item.quantity <= 1}
                              >
                                <Minus size={16} />
                              </button>
                              <span className="px-3 py-1 text-center min-w-[40px]">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                                disabled={item.quantity >= stock}
                              >
                                <Plus size={16} />
                              </button>
                            </div>
                          </div>
                          
                          {/* Total */}
                          <div className="md:col-span-2 text-center">
                            <p className="font-medium">
                              {priceSymbol} {itemTotal.toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              {/* Continue Shopping Button */}
              <div className="mt-4">
                <Link to="/shop">
                  <Button variant="outline" className="text-revive-red border-revive-red hover:bg-revive-red hover:text-white">
                    Continue Shopping
                  </Button>
                </Link>
              </div>
            </div>
            
            {/* Cart Summary */}
            <div className="lg:w-1/3">
              <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                <h2 className="text-xl font-serif mb-4">Order Summary</h2>
                
                {/* Coupon Code */}
                {/* <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">Apply Coupon Code</label>
                  <div className="flex space-x-2">
                    <Input
                      type="text"
                      placeholder="Enter coupon code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="flex-1"
                    />
                    <Button 
                      onClick={handleCouponApply}
                      disabled={isApplyingCoupon || !couponCode.trim()}
                    >
                      {isApplyingCoupon ? "Applying..." : "Apply"}
                    </Button>
                  </div>
                </div>
                 */}
                {/* Price Details */}
                <div className="border-t border-b border-gray-200 py-4 mb-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Subtotal</span>
                    <span>{priceSymbol} {subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    {shippingCost > 0 ? (
                      <span>{priceSymbol} {shippingCost.toLocaleString()}</span>
                    ) : (
                      <span className="text-green-600">Free</span>
                    )}
                  </div>
                </div>
                
                {/* Total */}
                <div className="flex justify-between items-center mb-6">
                  <span className="text-lg font-medium">Total</span>
                  <span className="text-xl font-bold">{priceSymbol} {total.toLocaleString()}</span>
                </div>
                
                {/* Checkout Button */}
                <Button 
                  className="w-full bg-revive-gold hover:bg-revive-gold/90" 
                  onClick={handleCheckout}
                >
                  Proceed to Checkout
                </Button>
                
                {/* Additional Information */}
                {/* <div className="mt-4 text-xs text-gray-500">
                  <p>Free shipping on orders over {priceSymbol} 5,000</p>
                  <p className="mt-1">Estimated delivery: 3-5 business days</p>
                </div> */}
              </div>
            </div>
          </div>
        )}
      </div>
      
      <Newsletter />
      <Footer />
    </div>
  );
};

export default Cart;
