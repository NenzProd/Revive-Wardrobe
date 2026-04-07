import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Newsletter from '../components/Newsletter';
import { useCartStore } from '../stores/useCartStore';
import { Minus, Plus, X, Heart, Trash2, Sparkles } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { priceSymbol } from '../config/constants';
import SEO from '../components/SEO';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  getCartItemDisplayPrice,
  getCartItemFinalPrice,
  getCartItemLineTotal,
  getCartItemVariant,
  isVariantSoldOut,
} from '../lib/product';

type CartDialogAction =
  | {
      type: 'remove-last-piece';
      productId: string;
      size?: string;
      color?: string;
      title: string;
      description: string;
      confirmLabel: string;
      cancelLabel: string;
    }
  | {
      type: 'remove-item';
      productId: string;
      size?: string;
      color?: string;
      title: string;
      description: string;
      confirmLabel: string;
      cancelLabel: string;
    }
  | null;

const Cart = () => {
  const { 
    cart, 
    removeFromCart, 
    updateQuantity, 
    moveToWishlist,
    subtotal,
    shippingCost,
    total,
    backendUrl,
  } = useCartStore();
  
  const [couponCode, setCouponCode] = useState('');
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [pendingDialogAction, setPendingDialogAction] = useState<CartDialogAction>(null);
  const navigate = useNavigate();
  
  // Fetch latest product data for stock validation
  const [productsData, setProductsData] = useState([]);
  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch(`${backendUrl}/api/product/list`);
        const data = await res.json();
        if (data.success) setProductsData(data.products);
      } catch {}
    }
    fetchProducts();
  }, [backendUrl]);

  // Helper to get variant stock for a cart item
  function getVariantStock(item) {
    const product = productsData.find(p => p._id === item._id);
    if (!product) return 9999;
    const variant = item.selectedSize
      ? product.variants?.find(v => v.filter_value === item.selectedSize)
      : product.variants?.[0];
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

  const requestRemoveLastPiece = (item: typeof cart[number]) => {
    setPendingDialogAction({
      type: 'remove-last-piece',
      productId: item._id,
      size: item.selectedSize,
      color: item.selectedColor,
      title: 'Only one piece is waiting for you',
      description:
        'This is the final piece from our premium collection. If you remove it now, someone else may place the order before you do.',
      confirmLabel: 'Remove It Anyway',
      cancelLabel: 'Keep It In My Cart',
    });
  };

  const requestRemoveItem = (item: typeof cart[number]) => {
    setPendingDialogAction({
      type: 'remove-item',
      productId: item._id,
      size: item.selectedSize,
      color: item.selectedColor,
      title: 'Remove this item from your cart?',
      description:
        'The sale is live and this piece is already yours for now. Are you sure you want to let it go before checkout?',
      confirmLabel: 'Yes, Remove It',
      cancelLabel: 'Keep Shopping Bag Ready',
    });
  };

  const handleMinusClick = (item: typeof cart[number], stock: number) => {
    if (item.quantity > 1) {
      updateQuantity(item._id, item.quantity - 1, item.selectedSize, item.selectedColor);
      return;
    }

    if (stock === 1) {
      requestRemoveLastPiece(item);
      return;
    }

    removeFromCart(item._id, item.selectedSize, item.selectedColor);
  };

  const handleDialogConfirm = () => {
    if (!pendingDialogAction) {
      return;
    }

    removeFromCart(
      pendingDialogAction.productId,
      pendingDialogAction.size,
      pendingDialogAction.color
    );
    setPendingDialogAction(null);
  };

  return (
    <TooltipProvider delayDuration={120}>
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
                    const itemDisplayPrice = getCartItemDisplayPrice(item);
                    const itemPrice = getCartItemFinalPrice(item);
                    const itemTotal = getCartItemLineTotal(item);
                    const stock = getVariantStock(item);
                    const isSoldOut = isVariantSoldOut(getCartItemVariant(item));
                    
                    return (
                      <div key={`${item._id}-${item.selectedSize}-${item.selectedColor}`} className="p-4">
                        <div className="grid md:grid-cols-12 gap-4 items-center">
                          {/* Product */}
                          <div className="md:col-span-6 flex items-center space-x-4">
                            <div className="relative">
                              <img 
                                src={item.image[0]} 
                                alt={item.name} 
                                className={`w-20 h-20 object-cover rounded-md ${isSoldOut ? 'grayscale opacity-70' : ''}`}
                              />
                              {isSoldOut && (
                                <span className="absolute left-2 bottom-2 rounded bg-revive-black/85 px-2 py-1 text-[10px] font-medium text-white">
                                  SOLD OUT
                                </span>
                              )}
                              <button
                                onClick={() => requestRemoveItem(item)}
                                className="absolute -top-2 -right-2 bg-white rounded-full p-1.5 shadow-md hover:bg-rose-50 hover:text-revive-red transition-colors"
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
                                  onClick={() => moveToWishlist(item._id, item.selectedSize, item.selectedColor)}
                                  className="text-xs flex items-center text-gray-600 hover:text-revive-red"
                                >
                                  <Heart size={14} className="mr-1" />
                                  <span className="hidden sm:inline">Move to Wishlist</span>
                                  <span className="sm:hidden">Wishlist</span>
                                </button>
                                <button
                                  onClick={() => requestRemoveItem(item)}
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
                              {itemPrice < itemDisplayPrice ? (
                                <>
                                  <span className="text-revive-red">{priceSymbol} {itemPrice.toLocaleString()}</span>
                                  <span className="line-through text-gray-500 text-xs ml-2">
                                    {priceSymbol} {itemDisplayPrice.toLocaleString()}
                                  </span>
                                </>
                              ) : (
                                <span>{priceSymbol} {itemDisplayPrice.toLocaleString()}</span>
                              )}
                            </p>
                          </div>
                          
                          {/* Quantity */}
                          <div className="md:col-span-2">
                            <div className="flex items-center justify-center rounded-xl border border-gray-200 bg-white shadow-sm max-w-[132px] mx-auto overflow-hidden">
                              <button
                                onClick={() => handleMinusClick(item, stock)}
                                className="px-3 py-2 text-gray-600 hover:bg-rose-50 hover:text-revive-red transition-colors"
                              >
                                <Minus size={16} />
                              </button>
                              <span className="px-3 py-2 text-center min-w-[40px] font-medium">
                                {item.quantity}
                              </span>
                              {stock === 1 ? (
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <span tabIndex={0} className="inline-flex">
                                      <button
                                        onClick={() => undefined}
                                        className="px-3 py-2 text-amber-700 bg-amber-50 cursor-not-allowed"
                                        disabled
                                        aria-label="Only one piece available"
                                      >
                                        <Plus size={16} />
                                      </button>
                                    </span>
                                  </TooltipTrigger>
                                  <TooltipContent side="top" className="max-w-[240px] bg-revive-black text-white">
                                    Only one piece is available. Place your order soon to make it yours.
                                  </TooltipContent>
                                </Tooltip>
                              ) : (
                                <button
                                  onClick={() => updateQuantity(item._id, item.quantity + 1, item.selectedSize, item.selectedColor)}
                                  className="px-3 py-2 text-gray-600 hover:bg-emerald-50 hover:text-emerald-700 transition-colors disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-300"
                                  disabled={item.quantity >= stock}
                                >
                                  <Plus size={16} />
                                </button>
                              )}
                            </div>
                            {stock === 1 && (
                              <p className="mt-2 text-center text-[11px] font-medium text-amber-700">
                                Last piece available
                              </p>
                            )}
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
              <div className="rounded-2xl border border-revive-red/15 bg-gradient-to-br from-white via-rose-50/60 to-red-50 p-6 shadow-[0_18px_45px_rgba(165,28,48,0.08)]">
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
                  className="group relative w-full overflow-hidden rounded-xl bg-revive-red py-6 text-base font-semibold text-white shadow-[0_16px_35px_rgba(165,28,48,0.28)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-revive-red/95 hover:shadow-[0_20px_45px_rgba(165,28,48,0.34)] animate-pulse" 
                  onClick={handleCheckout}
                >
                  <span className="absolute inset-0 bg-[linear-gradient(120deg,transparent_20%,rgba(255,255,255,0.28)_45%,transparent_70%)] translate-x-[-140%] group-hover:translate-x-[140%] transition-transform duration-1000" />
                  <span className="relative flex items-center justify-center gap-2">
                    <Sparkles size={16} />
                    Secure Your Order Now
                  </span>
                </Button>
                <p className="mt-3 text-center text-sm text-revive-red/90">
                  Your favorites are reserved in cart for the moment. Checkout now before they are gone.
                </p>
                
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
      <AlertDialog open={Boolean(pendingDialogAction)} onOpenChange={(open) => !open && setPendingDialogAction(null)}>
        <AlertDialogContent className="border border-revive-red/10 bg-white shadow-[0_22px_60px_rgba(0,0,0,0.16)]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-serif text-revive-black">
              {pendingDialogAction?.title}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-base leading-7 text-gray-600">
              {pendingDialogAction?.description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            Sale prices are active right now. Once removed, this style may be claimed by another customer.
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-gray-200">
              {pendingDialogAction?.cancelLabel || 'Keep This Item'}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDialogConfirm}
              className="bg-revive-red text-white hover:bg-revive-red/90"
            >
              {pendingDialogAction?.confirmLabel || 'Remove Item'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
    </TooltipProvider>
  );
};

export default Cart;
