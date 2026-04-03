import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useSearchParams } from "react-router-dom";
import { Suspense, lazy } from "react";
import ScrollToTop from "./components/ScrollToTop";
import GlobalLoader from "./components/GlobalLoader";
import { useLoaderStore } from "./stores/useLoaderStore";

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
const Maintenance = lazy(() => import("./pages/Maintenance"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const AppRoutes = () => {
  const [searchParams] = useSearchParams();

  // More robust environment variable checking with explicit string conversion
  const maintenanceEnabledRaw = import.meta.env.VITE_MAINTENANCE;
  const maintenanceEnabled = maintenanceEnabledRaw === "true" || maintenanceEnabledRaw === true;
  const maintenanceKey = import.meta.env.VITE_MAINTENANCE_KEY || "revive-test";
  const previewKey = searchParams.get("preview");

  // Check if user has bypass permission (from URL param or session storage)
  const hasBypassFromUrl = previewKey === maintenanceKey;
  const hasBypassFromStorage = sessionStorage.getItem('maintenance_bypass') === 'true';
  const hasBypass = hasBypassFromUrl || hasBypassFromStorage;

  // Store bypass in session storage if URL param is valid
  if (hasBypassFromUrl && !hasBypassFromStorage) {
    sessionStorage.setItem('maintenance_bypass', 'true');
  }

  // Debug logging - more detailed
  console.log('🔧 Maintenance Debug:', {
    maintenanceEnabled,
    maintenanceEnabledRaw,
    maintenanceKey,
    previewKey,
    hasBypassFromUrl,
    hasBypassFromStorage,
    hasBypass,
    currentPath: window.location.pathname,
    fullUrl: window.location.href,
    allEnvVars: {
      VITE_MAINTENANCE: import.meta.env.VITE_MAINTENANCE,
      VITE_MAINTENANCE_KEY: import.meta.env.VITE_MAINTENANCE_KEY,
      VITE_BACKEND_URL: import.meta.env.VITE_BACKEND_URL
    }
  });

  if (maintenanceEnabled && !hasBypass) {
    console.log('🚧 Maintenance mode ACTIVE - redirecting to maintenance page');
    return (
      <Routes>
        <Route path="/maintenance" element={<Maintenance />} />
        <Route path="*" element={<Navigate to="/maintenance" replace />} />
      </Routes>
    );
  }

  console.log('✅ Maintenance mode INACTIVE or BYPASSED - showing normal site');
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/maintenance" element={<Maintenance />} />
      <Route path="/shop" element={<Shop />} />
      <Route path="/shop/category/:categorySlug" element={<Shop />} />
      <Route path="/shop/search/:searchSlug" element={<Shop />} />
      <Route path="/product/:slug" element={<ProductDetail />} />
      <Route path="/stitching-service" element={<StichingService />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/checkout" element={<Checkout />} />
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
  );
};

const App = () => {
  const { isLoading } = useLoaderStore();

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <GlobalLoader isLoading={isLoading} />
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <Suspense fallback={null}>
            <AppRoutes />
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
