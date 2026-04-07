import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy, useEffect } from "react";
import ScrollToTop from "./components/ScrollToTop";
import GlobalLoader from "./components/GlobalLoader";
import { useLoaderStore } from "./stores/useLoaderStore";
import AppErrorBoundary from "./components/AppErrorBoundary";
import { useCartStore } from "./stores/useCartStore";

const Index = lazy(() => import("./pages/Index"));
const Shop = lazy(() => import("./pages/Shop"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const Cart = lazy(() => import("./pages/Cart"));
const Checkout = lazy(() => import("./pages/Checkout"));
const PaymentRedirect = lazy(() => import("./pages/PaymentRedirect"));
const Wishlist = lazy(() => import("./pages/Wishlist"));
const Account = lazy(() => import("./pages/Account"));
const Contact = lazy(() => import("./pages/Contact"));
const About = lazy(() => import("./pages/About"));
const BlogList = lazy(() => import("./pages/BlogList"));
const BlogDetail = lazy(() => import("./pages/BlogDetail"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const Terms = lazy(() => import("./pages/Terms"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Shipping = lazy(() => import("./pages/Shipping"));
const Returns = lazy(() => import("./pages/Returns"));
const StichingService = lazy(() => import("./pages/StichingService"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Maintenance = lazy(() => import("./pages/Maintenance"));

const queryClient = new QueryClient();

const App = () => {
  const { isLoading } = useLoaderStore();
  const token = useCartStore((state) => state.token);
  const fetchUser = useCartStore((state) => state.fetchUser);
  const getProductsData = useCartStore((state) => state.getProductsData);

  useEffect(() => {
    getProductsData();
  }, [getProductsData]);

  useEffect(() => {
    if (token) {
      fetchUser(token);
    }
  }, [fetchUser, token]);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <GlobalLoader isLoading={isLoading} />
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppErrorBoundary>
            <ScrollToTop />
            <Suspense
              fallback={
                <div className="min-h-screen bg-white flex items-center justify-center">
                  <div className="text-center">
                    <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-revive-red border-t-transparent" />
                    <p className="text-gray-600">Loading page...</p>
                  </div>
                </div>
              }
            >
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/shop/category/:categorySlug" element={<Shop />} />
                <Route path="/shop/search/:searchSlug" element={<Shop />} />
                <Route path="/product/:slug" element={<ProductDetail />} />
                <Route path="/stitching-service" element={<StichingService />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout/>} />
                <Route path="/payment-redirect" element={<PaymentRedirect />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/account" element={<Account />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/about" element={<About />} />
                <Route path="/blog" element={<BlogList />} />
                <Route path="/blog/:slug" element={<BlogDetail />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/shipping" element={<Shipping />} />
                <Route path="/returns" element={<Returns />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </AppErrorBoundary>
        </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
  );
};

export default App;
