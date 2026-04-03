import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import sitemap from "vite-plugin-sitemap";
import axios from "axios";

// Fetch dynamic product routes for sitemap
async function getDynamicRoutes() {
  // During build, skip fetching to avoid backend dependency
  if (process.env.NODE_ENV === 'production' || !process.env.VITE_BACKEND_URL) {
    console.log('Skipping dynamic route fetching during build');
    return [];
  }

  try {
    const backendUrl = process.env.VITE_BACKEND_URL || 'http://localhost:4000';
    const response = await axios.get(`${backendUrl}/api/product/list`, {
      timeout: 5000,
    });

    if (response.data.success && response.data.products) {
      const productRoutes = response.data.products.map((product: any) => `/product/${product.slug}`);
      return productRoutes;
    }
  } catch (error) {
    console.warn('Failed to fetch products for sitemap (continuing with empty routes):', error.message || error);
  }
  return [];
}
export default defineConfig(async ({ mode }) => {
  const productRoutes = mode === 'production' ? await getDynamicRoutes() : [];
  
  return {
    server: {
      host: "::",
      port: 3000,
    },
    plugins: [
      react(),
      mode === 'development' &&
      componentTagger(),
      sitemap({
        hostname: 'https://revivewardrobe.com',
        dynamicRoutes: [
          '/',
          '/shop',
          '/about',
          '/contact',
          '/cart',
          '/wishlist',
          '/checkout',
          '/login',
          '/signup',
          '/account',
          '/forgot-password',
          '/terms',
          '/privacy',
          '/returns',
          '/shipping',
          ...productRoutes,
        ],
        exclude: ['/404'],
        readable: true,
      }),
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
