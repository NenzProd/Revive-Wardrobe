import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";
import { toast } from "@/hooks/use-toast";
import { Product, CartItem } from "../types/product";
import { priceSymbol } from "../config/constants";

const currency = "₹";
const deliveryFee = 10;
const backendUrl = import.meta.env.VITE_BACKEND_URL;

interface CartState {
  cart: CartItem[];
  cartItems: Record<string, number>;
  wishlist: Product[];
  itemCount: number;
  subtotal: number;
  shippingCost: number;
  total: number;
  products: Product[];
  search: string;
  showSearch: boolean;
  token: string;
  currency: string;
  deliveryFee: number;
  backendUrl: string;
  user: any;
  
  // Actions
  setSearch: (search: string) => void;
  setShowSearch: (show: boolean) => void;
  setToken: (token: string) => void;
  setUser: (user: any) => void;
  
  getProductsData: () => Promise<void>;
  getUserCart: (token: string) => Promise<void>;
  getCartCount: () => number;
  getCartAmount: () => number;
  getCartItems: () => Array<any>;
  
  recalculateTotals: () => void;
  addToCart: (product: Product, quantity: number, size?: string, color?: string) => void;
  addToCartById: (itemId: string, quantity?: number) => Promise<void>;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  updateQuantityById: (itemId: string, quantity: number) => Promise<void>;
  clearCart: () => void;
  moveToWishlist: (productId: string) => void;
  fetchUser: (token: string) => Promise<void>;
  logout: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: [],
      cartItems: {},
      wishlist: [],
      itemCount: 0,
      subtotal: 0,
      shippingCost: 0,
      total: 0,
      products: [],
      search: '',
      showSearch: false,
      token: '',
      currency,
      deliveryFee,
      backendUrl,
      user: null,
      
      setSearch: search => set({ search }),
      setShowSearch: showSearch => set({ showSearch }),
      setToken: token => set({ token }),
      setUser: user => set({ user }),
      
      // Fetch products
      getProductsData: async () => {
        try {
          const res = await axios.get(get().backendUrl + '/api/product/list');
          if (res.data.success) {
            set({ products: res.data.products });
          } else {
            toast({ title: 'Error', description: res.data.message });
          }
        } catch (err) {
          toast({ title: 'Error', description: err.message });
        }
      },
      
      // Fetch user cart from backend
      getUserCart: async token => {
        try {
          const res = await axios.post(
            get().backendUrl + '/api/cart/get',
            {},
            { headers: { token } }
          );
          if (res.data.success) {
            const normalizedCart = {};
            Object.entries(res.data.cartData).forEach(([key, value]) => {
              normalizedCart[key] =
                typeof value === 'number'
                  ? value
                  : typeof value === 'object'
                  ? Object.values(value)[0] || 0
                  : 0;
            });
            set({ cartItems: normalizedCart });
          }
        } catch (err) {
          toast({ title: 'Error', description: err.message });
        }
      },
      
      // Get cart count (ID-based)
      getCartCount: () => {
        return Object.values(get().cartItems).reduce(
          (acc, qty) => (qty > 0 ? acc + qty : acc),
          0
        );
      },
      
      // Get cart amount (ID-based)
      getCartAmount: () => {
        let total = 0;
        const { cartItems, products } = get();
        for (const itemId in cartItems) {
          const product = products.find(p => p._id === itemId);
          if (product && cartItems[itemId] > 0) {
            total += (product.price || 0) * cartItems[itemId];
          }
        }
        return total;
      },
      
      // Get cart items (ID-based, detailed)
      getCartItems: () => {
        const { cartItems, products } = get();
        return Object.entries(cartItems)
          .filter(([, qty]) => qty > 0)
          .map(([itemId, qty]) => {
            const product = products.find(p => p._id === itemId);
            return product
              ? {
                  _id: itemId,
                  name: product.name,
                  price: product.price || 0,
                  image: product.image?.[0],
                  quantity: qty
                }
              : null;
          })
          .filter(Boolean);
      },
      
      // Calculate derived values based on cart
      recalculateTotals: () => {
        const cart = get().cart;
        const subtotal = cart.reduce((sum, item) => {
          const itemPrice = item.price || 0;
          return sum + itemPrice * item.quantity;
        }, 0);
        // shipping cost is now always 0
        const shippingCost = 0;
        const total = subtotal + shippingCost;
        const itemCount = cart.reduce((count, item) => count + item.quantity, 0);
        
        set({ subtotal, shippingCost, total, itemCount });
      },
      
      // Add item to cart
      addToCart: (product, quantity, size, color) => {
        set((state) => {
          // Find the correct variant for stock check
          let variant = null
          if (product.variants && size) {
            variant = product.variants.find(v => v.filter_value === size)
          }
          const maxStock = variant ? variant.stock : 9999
          if (quantity > maxStock) {
            toast({
              title: 'Stock limit reached',
              description: `Only ${maxStock} in stock for selected size`,
              variant: 'destructive'
            })
            return state
          }
          // Check if the product is already in the cart
          const existingItemIndex = state.cart.findIndex(
            item => item._id === product._id && 
                  item.selectedSize === size && 
                  item.selectedColor === color
          );
          let updatedCart;
          if (existingItemIndex >= 0) {
            // Update quantity if the product is already in the cart
            const newQty = Math.min(state.cart[existingItemIndex].quantity + quantity, maxStock)
            if (newQty > maxStock) {
              toast({
                title: 'Stock limit reached',
                description: `Only ${maxStock} in stock for selected size`,
                variant: 'destructive'
              })
              return state
            }
            updatedCart = [...state.cart];
            updatedCart[existingItemIndex] = {
              ...updatedCart[existingItemIndex],
              quantity: newQty
            };
            toast({
              title: "Cart updated",
              description: `${product.name} quantity increased to ${updatedCart[existingItemIndex].quantity}.`,
            });
          } else {
            // Add the product to the cart if it's not already there
            const newItem = {
              ...product,
              quantity,
              selectedSize: size,
              selectedColor: color
            };
            updatedCart = [...state.cart, newItem];
            toast({
              title: "Added to cart",
              description: `${product.name} added to your cart.`,
            });
          }
          const newState = { ...state, cart: updatedCart };
          // Recalculate totals
          const subtotal = updatedCart.reduce((sum, item) => {
            const itemPrice = item.price || 0;
            return sum + itemPrice * item.quantity;
          }, 0);
          // shipping cost is now always 0
          const shippingCost = 0;
          const total = subtotal + shippingCost;
          const itemCount = updatedCart.reduce((count, item) => count + item.quantity, 0);
          return { ...newState, subtotal, shippingCost, total, itemCount };
        });
      },
      
      // Add to cart by ID (object-based)
      addToCartById: async (itemId, quantity = 1) => {
        const cartData = { ...get().cartItems };
        cartData[itemId] = (cartData[itemId] || 0) + quantity;
        set({ cartItems: cartData });
        toast({ title: 'Success', description: 'Item Added to Cart' });
        if (get().token) {
          try {
            await axios.post(
              get().backendUrl + '/api/cart/add',
              { itemId, quantity },
              { headers: { token: get().token } }
            );
          } catch (err) {
            toast({ title: 'Error', description: err.message });
          }
        }
      },
      
      // Remove item from cart
      removeFromCart: (productId) => {
        set((state) => {
          const removedItem = state.cart.find(item => item._id === productId);
          const updatedCart = state.cart.filter(item => item._id !== productId);
          
          if (removedItem) {
            toast({
              title: "Item removed",
              description: `${removedItem.name} has been removed from your cart.`,
            });
          }
          
          const newState = { ...state, cart: updatedCart };
          // Recalculate totals
          const subtotal = updatedCart.reduce((sum, item) => {
            const itemPrice = item.price || 0;
            return sum + itemPrice * item.quantity;
          }, 0);
          // shipping cost is now always 0
          const shippingCost = 0;
          const total = subtotal + shippingCost;
          const itemCount = updatedCart.reduce((count, item) => count + item.quantity, 0);
          
          return { ...newState, subtotal, shippingCost, total, itemCount };
        });
      },
      
      // Update quantity
      updateQuantity: (productId, quantity) => {
        set((state) => {
          const item = state.cart.find(i => i._id === productId)
          if (!item) return state
          let variant = null
          if (item.variants && item.selectedSize) {
            variant = item.variants.find(v => v.filter_value === item.selectedSize)
          }
          const maxStock = variant ? variant.stock : 9999
          if (quantity > maxStock) {
            toast({
              title: 'Stock limit reached',
              description: `Only ${maxStock} in stock for selected size`,
              variant: 'destructive'
            })
            return state
          }
          const updatedCart = state.cart.map(i =>
            i._id === productId ? { ...i, quantity: Math.max(1, Math.min(quantity, maxStock)) } : i
          )
          
          // Recalculate totals
          const subtotal = updatedCart.reduce((sum, item) => {
            const itemPrice = item.price || 0;
            return sum + itemPrice * item.quantity;
          }, 0);
          // shipping cost is now always 0
          const shippingCost = 0;
          const total = subtotal + shippingCost;
          const itemCount = updatedCart.reduce((count, item) => count + item.quantity, 0);
          
          return { ...state, cart: updatedCart, subtotal, shippingCost, total, itemCount }
        })
      },
      
      // Update quantity by ID (object-based)
      updateQuantityById: async (itemId, quantity) => {
        const cartData = { ...get().cartItems, [itemId]: quantity };
        set({ cartItems: cartData });
        if (get().token) {
          try {
            await axios.post(
              get().backendUrl + '/api/cart/update',
              { itemId, quantity },
              { headers: { token: get().token } }
            );
          } catch (err) {
            toast({ title: 'Error', description: err.message });
          }
        }
      },
      
      // Clear the cart
      clearCart: () => {
        set((state) => ({ 
          ...state, 
          cart: [],
          cartItems: {},
          subtotal: 0,
          shippingCost: 0,
          total: 0,
          itemCount: 0
        }));
        
        toast({
          title: "Cart cleared",
          description: "All items have been removed from your cart.",
        });
      },
      
      // Move item to wishlist
      moveToWishlist: (productId) => {
        set((state) => {
          const itemToMove = state.cart.find(item => item._id === productId);
          
          if (!itemToMove) {
            return state;
          }
          
          // Add to wishlist if not already there
          const isInWishlist = state.wishlist.some(item => item._id === productId);
          let updatedWishlist = state.wishlist;
          
          if (!isInWishlist) {
            const { quantity, selectedSize, selectedColor, ...productWithoutCartProps } = itemToMove;
            updatedWishlist = [...state.wishlist, productWithoutCartProps];
            
            toast({
              title: "Moved to wishlist",
              description: `${itemToMove.name} has been moved to your wishlist.`,
            });
          }
          
          // Remove from cart
          const updatedCart = state.cart.filter(item => item._id !== productId);
          
          const newState = { 
            ...state, 
            cart: updatedCart,
            wishlist: updatedWishlist
          };
          
          // Recalculate totals
          const subtotal = updatedCart.reduce((sum, item) => {
            const itemPrice = item.price || 0;
            return sum + itemPrice * item.quantity;
          }, 0);
          // shipping cost is now always 0
          const shippingCost = 0;
          const total = subtotal + shippingCost;
          const itemCount = updatedCart.reduce((count, item) => count + item.quantity, 0);
          
          return { ...newState, subtotal, shippingCost, total, itemCount };
        });
      },
      
      fetchUser: async (token) => {
        try {
          const res = await axios.get(get().backendUrl + '/api/user/profile', { headers: { token } })
          if (res.data.success) set({ user: res.data.user })
        } catch (err) {}
      },
      
      logout: () => {
        set({ token: '', user: null })
        localStorage.removeItem('token')
      }
    }),
    {
      name: "rw-cart-storage",
    }
  )
);
