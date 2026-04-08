import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";
import { toast } from "@/hooks/use-toast";
import { CartItem, Product } from "../types/product";
import { backendUrl } from "../config/constants";
import {
  getCartItemDisplayPrice,
  getCartItemFinalPrice,
  getCartItemLineTotal,
  getCartItemVariant,
  getProductFinalPrice,
  isVariantSoldOut,
  mapProductForUi,
} from "../lib/product";

const currency = "AED";
const deliveryFee = 10;
const STORAGE_VERSION = 2;

const getSafeBackendUrl = (value?: string) =>
  typeof value === "string" && value.trim().length > 0 ? value : backendUrl;

const isAuthError = (message = "") => {
  const value = String(message).toLowerCase();
  return (
    value.includes("not authorized") ||
    value.includes("jwt") ||
    value.includes("token") ||
    value.includes("unauthorized")
  );
};

const normalizeProducts = (products: Product[] = []) =>
  products.map((product) => mapProductForUi(product));

const recalculateCartState = (cart: CartItem[]) => {
  const subtotal = cart.reduce((sum, item) => sum + getCartItemLineTotal(item), 0);
  const shippingCost = 0;
  const total = subtotal + shippingCost;
  const itemCount = cart.reduce((count, item) => count + item.quantity, 0);

  return { subtotal, shippingCost, total, itemCount };
};

const buildWishlistProducts = (products: Product[], productIds: string[], fallback: Product[] = []) => {
  const productMap = new Map<string, Product>();

  normalizeProducts(products).forEach((product) => {
    if (product._id) {
      productMap.set(product._id, product);
    }
  });

  fallback.forEach((product) => {
    if (product?._id && !productMap.has(product._id)) {
      productMap.set(product._id, mapProductForUi(product));
    }
  });

  return productIds
    .map((productId) => productMap.get(productId))
    .filter(Boolean);
};

const getWishlistIds = (wishlist: Product[] = []) =>
  Array.from(new Set(wishlist.map((product) => product?._id).filter(Boolean)));

const arraysEqual = (left: string[], right: string[]) =>
  left.length === right.length && left.every((value, index) => value === right[index]);

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

  setSearch: (search: string) => void;
  setShowSearch: (show: boolean) => void;
  setToken: (token: string) => void;
  setUser: (user: any) => void;

  getProductsData: () => Promise<Product[]>;
  getUserCart: (token: string) => Promise<void>;
  getCartCount: () => number;
  getCartAmount: () => number;
  getCartItems: () => Array<any>;

  recalculateTotals: () => void;
  syncWishlistFromIds: (productIds: string[], fallbackProducts?: Product[]) => Promise<void>;
  syncWishlistToBackend: (productIds: string[]) => Promise<void>;
  addToCart: (product: Product, quantity: number, size?: string, color?: string) => void;
  addToCartById: (itemId: string, quantity?: number) => Promise<void>;
  removeFromCart: (productId: string, size?: string, color?: string) => void;
  updateQuantity: (productId: string, quantity: number, size?: string, color?: string) => void;
  updateQuantityById: (itemId: string, quantity: number) => Promise<void>;
  clearCart: () => void;
  addToWishlist: (product: Product) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  moveToWishlist: (productId: string, size?: string, color?: string) => Promise<void>;
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
      search: "",
      showSearch: false,
      token: "",
      currency,
      deliveryFee,
      backendUrl,
      user: null,

      setSearch: (search) => set({ search }),
      setShowSearch: (showSearch) => set({ showSearch }),
      setToken: (token) => set({ token }),
      setUser: (user) => set({ user }),

      getProductsData: async () => {
        try {
          const [productRes, categoryRes] = await Promise.all([
            axios.get(getSafeBackendUrl(get().backendUrl) + "/api/product/list"),
            axios.get(getSafeBackendUrl(get().backendUrl) + "/api/product/categories"),
          ]);
          if (productRes.data.success) {
            const enabledCategories = Array.isArray(categoryRes.data?.categories)
              ? categoryRes.data.categories
                  .filter((entry: any) => entry.enabled)
                  .map((entry: any) => entry.category)
              : [];
            const rawProducts = productRes.data.products as Product[];
            const visibleProducts =
              enabledCategories.length > 0
                ? rawProducts.filter((product) => enabledCategories.includes(product.category))
                : rawProducts;
            const products = normalizeProducts(visibleProducts);
            set((state) => ({
              products,
              wishlist: buildWishlistProducts(products, getWishlistIds(state.wishlist), state.wishlist),
            }));
            return products;
          }

          toast({ title: "Error", description: productRes.data.message });
        } catch (err) {
          toast({ title: "Error", description: err.message });
        }

        return get().products;
      },

      getUserCart: async (token) => {
        try {
          const res = await axios.post(
            getSafeBackendUrl(get().backendUrl) + "/api/cart/get",
            {},
            { headers: { token } }
          );
          if (res.data.success) {
            const normalizedCart = {};
            Object.entries(res.data.cartData).forEach(([key, value]) => {
              normalizedCart[key] =
                typeof value === "number"
                  ? value
                  : typeof value === "object"
                    ? Object.values(value)[0] || 0
                    : 0;
            });
            set({ cartItems: normalizedCart });
          }
        } catch (err) {
          toast({ title: "Error", description: err.message });
        }
      },

      getCartCount: () =>
        Object.values(get().cartItems).reduce(
          (acc, qty) => (qty > 0 ? acc + qty : acc),
          0
        ),

      getCartAmount: () => {
        let totalAmount = 0;
        const { cartItems, products } = get();
        for (const itemId in cartItems) {
          const product = products.find((entry) => entry._id === itemId);
          if (product && cartItems[itemId] > 0) {
            totalAmount += getProductFinalPrice(product) * cartItems[itemId];
          }
        }
        return totalAmount;
      },

      getCartItems: () => {
        const { cartItems, products } = get();
        return Object.entries(cartItems)
          .filter(([, qty]) => qty > 0)
          .map(([itemId, qty]) => {
            const product = products.find((entry) => entry._id === itemId);
            return product
              ? {
                  _id: itemId,
                  name: product.name,
                  price: product.price || 0,
                  salePrice: product.salePrice,
                  image: product.image?.[0],
                  quantity: qty,
                }
              : null;
          })
          .filter(Boolean);
      },

      recalculateTotals: () => {
        const cart = get().cart;
        set(recalculateCartState(cart));
      },

      syncWishlistFromIds: async (productIds, fallbackProducts = []) => {
        if (productIds.length === 0) {
          set({ wishlist: [] });
          return;
        }

        let products = get().products;
        if (products.length === 0) {
          products = await get().getProductsData();
        }

        set({
          wishlist: buildWishlistProducts(products, productIds, fallbackProducts),
        });
      },

      syncWishlistToBackend: async (productIds) => {
        if (!get().token) {
          return;
        }

        try {
          const response = await axios.post(
            getSafeBackendUrl(get().backendUrl) + "/api/user/wishlist",
            { productIds },
            { headers: { token: get().token } }
          );

          if (!response.data?.success) {
            if (isAuthError(response.data?.message)) {
              get().logout();
              toast({
                title: "Session expired",
                description: "Please login again to sync wishlist.",
                variant: "destructive",
              });
              return;
            }
            throw new Error(response.data?.message || "Wishlist sync failed");
          }
        } catch (err: any) {
          const serverMessage = err?.response?.data?.message || err?.message || "";

          if (isAuthError(serverMessage)) {
            get().logout();
            toast({
              title: "Session expired",
              description: "Please login again to sync wishlist.",
              variant: "destructive",
            });
            return;
          }

          toast({
            title: "Wishlist sync failed",
            description: serverMessage || "Could not sync wishlist right now.",
            variant: "destructive",
          });
        }
      },

      addToCart: (product, quantity, size, color) => {
        set((state) => {
          const normalizedProduct = mapProductForUi(product);
          const variant = size
            ? normalizedProduct.variants?.find((entry) => entry.filter_value === size)
            : getCartItemVariant({ ...normalizedProduct, quantity, selectedSize: size, selectedColor: color } as CartItem);
          const maxStock = variant ? variant.stock : 9999;

          if (quantity > maxStock) {
            toast({
              title: "Stock limit reached",
              description: `Only ${maxStock} in stock for selected size`,
              variant: "destructive",
            });
            return state;
          }

          const existingItemIndex = state.cart.findIndex(
            (item) =>
              item._id === normalizedProduct._id &&
              item.selectedSize === size &&
              item.selectedColor === color
          );

          let updatedCart: CartItem[];
          if (existingItemIndex >= 0) {
            const currentItem = state.cart[existingItemIndex];
            const newQty = Math.min(currentItem.quantity + quantity, maxStock);

            updatedCart = [...state.cart];
            updatedCart[existingItemIndex] = {
              ...currentItem,
              quantity: newQty,
            };

            toast({
              title: "Cart updated",
              description: `${normalizedProduct.name} quantity increased to ${newQty}.`,
            });
          } else {
            updatedCart = [
              ...state.cart,
              {
                ...normalizedProduct,
                quantity,
                selectedSize: size,
                selectedColor: color,
              },
            ];

            toast({
              title: "Added to cart",
              description: `${normalizedProduct.name} added to your cart.`,
            });
          }

          return {
            ...state,
            cart: updatedCart,
            ...recalculateCartState(updatedCart),
          };
        });
      },

      addToCartById: async (itemId, quantity = 1) => {
        const cartData = { ...get().cartItems };
        cartData[itemId] = (cartData[itemId] || 0) + quantity;
        set({ cartItems: cartData });
        toast({ title: "Success", description: "Item Added to Cart" });
        if (get().token) {
          try {
            await axios.post(
              getSafeBackendUrl(get().backendUrl) + "/api/cart/add",
              { itemId, quantity },
              { headers: { token: get().token } }
            );
          } catch (err) {
            toast({ title: "Error", description: err.message });
          }
        }
      },

      removeFromCart: (productId, size, color) => {
        set((state) => {
          const removedItem = state.cart.find(
            (item) =>
              item._id === productId &&
              (size === undefined || item.selectedSize === size) &&
              (color === undefined || item.selectedColor === color)
          );

          const updatedCart = state.cart.filter(
            (item) =>
              !(
                item._id === productId &&
                (size === undefined || item.selectedSize === size) &&
                (color === undefined || item.selectedColor === color)
              )
          );

          if (removedItem) {
            toast({
              title: "Item removed",
              description: `${removedItem.name} has been removed from your cart.`,
            });
          }

          return {
            ...state,
            cart: updatedCart,
            ...recalculateCartState(updatedCart),
          };
        });
      },

      updateQuantity: (productId, quantity, size, color) => {
        set((state) => {
          const item = state.cart.find(
            (entry) =>
              entry._id === productId &&
              (size === undefined || entry.selectedSize === size) &&
              (color === undefined || entry.selectedColor === color)
          );

          if (!item) {
            return state;
          }

          const variant = getCartItemVariant(item);
          const maxStock = variant ? variant.stock : 9999;

          if (quantity > maxStock) {
            toast({
              title: "Stock limit reached",
              description: `Only ${maxStock} in stock for selected size`,
              variant: "destructive",
            });
            return state;
          }

          const updatedCart = state.cart.map((entry) =>
            entry._id === productId &&
            (size === undefined || entry.selectedSize === size) &&
            (color === undefined || entry.selectedColor === color)
              ? {
                  ...entry,
                  quantity: Math.max(1, Math.min(quantity, maxStock)),
                }
              : entry
          );

          return {
            ...state,
            cart: updatedCart,
            ...recalculateCartState(updatedCart),
          };
        });
      },

      updateQuantityById: async (itemId, quantity) => {
        const cartData = { ...get().cartItems, [itemId]: quantity };
        set({ cartItems: cartData });
        if (get().token) {
          try {
            await axios.post(
              getSafeBackendUrl(get().backendUrl) + "/api/cart/update",
              { itemId, quantity },
              { headers: { token: get().token } }
            );
          } catch (err) {
            toast({ title: "Error", description: err.message });
          }
        }
      },

      clearCart: () => {
        set((state) => ({
          ...state,
          cart: [],
          cartItems: {},
          subtotal: 0,
          shippingCost: 0,
          total: 0,
          itemCount: 0,
        }));

        toast({
          title: "Cart cleared",
          description: "All items have been removed from your cart.",
        });
      },

      addToWishlist: async (product) => {
        const normalizedProduct = mapProductForUi(product);
        const currentWishlist = get().wishlist;
        const isInWishlist = currentWishlist.some(
          (item) => item._id === normalizedProduct._id
        );

        if (isInWishlist) {
          toast({
            title: "Already in wishlist",
            description: `${normalizedProduct.name} is already in your wishlist.`,
          });
          return;
        }

        const updatedWishlist = [...currentWishlist, normalizedProduct];
        set({ wishlist: updatedWishlist });
        await get().syncWishlistToBackend(getWishlistIds(updatedWishlist));

        toast({
          title: "Added to wishlist",
          description: `${normalizedProduct.name} has been added to your wishlist.`,
        });
      },

      removeFromWishlist: async (productId) => {
        const currentWishlist = get().wishlist;
        const itemToRemove = currentWishlist.find((item) => item._id === productId);
        const updatedWishlist = currentWishlist.filter((item) => item._id !== productId);

        set({ wishlist: updatedWishlist });
        await get().syncWishlistToBackend(getWishlistIds(updatedWishlist));

        if (itemToRemove) {
          toast({
            title: "Removed from wishlist",
            description: `${itemToRemove.name} has been removed from your wishlist.`,
          });
        }
      },

      moveToWishlist: async (productId, size, color) => {
        const state = get();
        const itemToMove = state.cart.find(
          (item) =>
            item._id === productId &&
            (size === undefined || item.selectedSize === size) &&
            (color === undefined || item.selectedColor === color)
        );

        if (!itemToMove) {
          return;
        }

        const { quantity, selectedSize, selectedColor, ...productWithoutCartProps } = itemToMove;
        await get().addToWishlist(productWithoutCartProps);
        get().removeFromCart(productId, size, color);
      },

      fetchUser: async (token) => {
        try {
          const res = await axios.get(getSafeBackendUrl(get().backendUrl) + "/api/user/profile", {
            headers: { token },
          });

          if (!res.data.success) {
            if (isAuthError(res.data?.message)) {
              get().logout();
            }
            return;
          }

          const user = res.data.user;
          const localWishlist = get().wishlist;
          const localIds = getWishlistIds(localWishlist);
          const remoteIds = Array.isArray(user?.wishlistData)
            ? Array.from(new Set(user.wishlistData.filter(Boolean)))
            : [];
          const mergedIds = Array.from(new Set([...remoteIds, ...localIds])).sort();
          const remoteSorted = [...remoteIds].sort();

          set({ user });
          await get().syncWishlistFromIds(mergedIds, localWishlist);

          if (!arraysEqual(mergedIds, remoteSorted)) {
            await get().syncWishlistToBackend(mergedIds);
          }
        } catch (err: any) {
          if (isAuthError(err?.response?.data?.message || err?.message)) {
            get().logout();
          }
        }
      },

      logout: () => {
        set({ token: "", user: null });
        localStorage.removeItem("token");
      },
    }),
    {
      name: "rw-cart-storage",
      version: STORAGE_VERSION,
      migrate: (persistedState: any, version) => {
        const state = persistedState || {};

        if (version < STORAGE_VERSION) {
          return {
            ...state,
            backendUrl,
          };
        }

        return {
          ...state,
          backendUrl: getSafeBackendUrl(state.backendUrl),
        };
      },
      partialize: (state) => ({
        cart: state.cart,
        cartItems: state.cartItems,
        wishlist: state.wishlist,
        itemCount: state.itemCount,
        subtotal: state.subtotal,
        shippingCost: state.shippingCost,
        total: state.total,
        products: state.products,
        search: state.search,
        showSearch: state.showSearch,
        token: state.token,
        user: state.user,
      }),
      onRehydrateStorage: () => (state) => {
        if (!state) {
          return;
        }

        state.backendUrl = backendUrl;
        state.recalculateTotals();
      },
    }
  )
);
