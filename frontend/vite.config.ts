import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import sitemap from "vite-plugin-sitemap";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
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
}));
