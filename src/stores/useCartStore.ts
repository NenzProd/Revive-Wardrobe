import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product, CartItem } from "../types/product";
import { toast } from "@/hooks/use-toast";
import { priceSymbol } from "../config/constants";

interface CartState {
  cart: CartItem[];
  wishlist: Product[];
  itemCount: number;
  subtotal: number;
  shippingCost: number;
  total: number;
  
  // Actions
  addToCart: (product: Product, quantity: number, size?: string, color?: string) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  moveToWishlist: (productId: number) => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: [],
      wishlist: [],
      itemCount: 0,
      subtotal: 0,
      shippingCost: 0,
      total: 0,
      
      // Calculate derived values based on cart
      recalculateTotals: () => {
        const cart = get().cart;
        const subtotal = cart.reduce((sum, item) => {
          const itemPrice = item.salePrice || item.price;
          return sum + itemPrice * item.quantity;
        }, 0);
        
        const shippingCost = subtotal > 0 ? (subtotal > 5000 ? 0 : 250) : 0;
        const total = subtotal + shippingCost;
        const itemCount = cart.reduce((count, item) => count + item.quantity, 0);
        
        set({ subtotal, shippingCost, total, itemCount });
      },
      
      // Add item to cart
      addToCart: (product, quantity, size, color) => {
        set((state) => {
          // Check if the product is already in the cart
          const existingItemIndex = state.cart.findIndex(
            item => item.id === product.id && 
                  item.selectedSize === size && 
                  item.selectedColor === color
          );
          
          let updatedCart;
          
          if (existingItemIndex >= 0) {
            // Update quantity if the product is already in the cart
            updatedCart = [...state.cart];
            updatedCart[existingItemIndex] = {
              ...updatedCart[existingItemIndex],
              quantity: updatedCart[existingItemIndex].quantity + quantity
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
            const itemPrice = item.salePrice || item.price;
            return sum + itemPrice * item.quantity;
          }, 0);
          
          const shippingCost = subtotal > 0 ? (subtotal > 5000 ? 0 : 250) : 0;
          const total = subtotal + shippingCost;
          const itemCount = updatedCart.reduce((count, item) => count + item.quantity, 0);
          
          return { ...newState, subtotal, shippingCost, total, itemCount };
        });
      },
      
      // Remove item from cart
      removeFromCart: (productId) => {
        set((state) => {
          const removedItem = state.cart.find(item => item.id === productId);
          const updatedCart = state.cart.filter(item => item.id !== productId);
          
          if (removedItem) {
            toast({
              title: "Item removed",
              description: `${removedItem.name} has been removed from your cart.`,
            });
          }
          
          const newState = { ...state, cart: updatedCart };
          // Recalculate totals
          const subtotal = updatedCart.reduce((sum, item) => {
            const itemPrice = item.salePrice || item.price;
            return sum + itemPrice * item.quantity;
          }, 0);
          
          const shippingCost = subtotal > 0 ? (subtotal > 5000 ? 0 : 250) : 0;
          const total = subtotal + shippingCost;
          const itemCount = updatedCart.reduce((count, item) => count + item.quantity, 0);
          
          return { ...newState, subtotal, shippingCost, total, itemCount };
        });
      },
      
      // Update quantity of an item
      updateQuantity: (productId, quantity) => {
        if (quantity < 1) {
          get().removeFromCart(productId);
          return;
        }
        
        set((state) => {
          const updatedCart = state.cart.map(item => 
            item.id === productId ? { ...item, quantity } : item
          );
          
          const newState = { ...state, cart: updatedCart };
          // Recalculate totals
          const subtotal = updatedCart.reduce((sum, item) => {
            const itemPrice = item.salePrice || item.price;
            return sum + itemPrice * item.quantity;
          }, 0);
          
          const shippingCost = subtotal > 0 ? (subtotal > 5000 ? 0 : 250) : 0;
          const total = subtotal + shippingCost;
          const itemCount = updatedCart.reduce((count, item) => count + item.quantity, 0);
          
          return { ...newState, subtotal, shippingCost, total, itemCount };
        });
      },
      
      // Clear the cart
      clearCart: () => {
        set((state) => ({ 
          ...state, 
          cart: [],
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
          const itemToMove = state.cart.find(item => item.id === productId);
          
          if (!itemToMove) {
            return state;
          }
          
          // Add to wishlist if not already there
          const isInWishlist = state.wishlist.some(item => item.id === productId);
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
          const updatedCart = state.cart.filter(item => item.id !== productId);
          
          const newState = { 
            ...state, 
            cart: updatedCart,
            wishlist: updatedWishlist
          };
          
          // Recalculate totals
          const subtotal = updatedCart.reduce((sum, item) => {
            const itemPrice = item.salePrice || item.price;
            return sum + itemPrice * item.quantity;
          }, 0);
          
          const shippingCost = subtotal > 0 ? (subtotal > 5000 ? 0 : 250) : 0;
          const total = subtotal + shippingCost;
          const itemCount = updatedCart.reduce((count, item) => count + item.quantity, 0);
          
          return { ...newState, subtotal, shippingCost, total, itemCount };
        });
      }
    }),
    {
      name: "cart-storage",
    }
  )
);
