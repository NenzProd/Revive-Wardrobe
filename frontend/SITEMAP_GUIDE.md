# Dynamic Sitemap Generation Guide

## Overview
The sitemap now automatically includes all product URLs dynamically fetched from the backend during the build process.

## How It Works

### Build Time Generation
When you run `npm run build`, the Vite config:
1. Fetches all products from the backend API (`/api/product/list`)
2. Extracts product slugs
3. Generates URLs in the format: `/product/{slug}`
4. Adds them to the sitemap along with static routes

### Example Product URLs
```
https://revivewardrobe.com/product/emerald-bloom-ensemble
https://revivewardrobe.com/product/royal-velvet-kurta
https://revivewardrobe.com/product/sunset-silk-saree
```

## Configuration

The dynamic route generation is configured in `frontend/vite.config.ts`:

```typescript
async function getDynamicRoutes() {
  try {
    const backendUrl = process.env.VITE_BACKEND_URL || 'http://localhost:4000';
    const response = await axios.get(`${backendUrl}/api/product/list`);
    
    if (response.data.success && response.data.products) {
      const productRoutes = response.data.products.map((product: any) => `/product/${product.slug}`);
      return productRoutes;
    }
  } catch (error) {
    console.warn('Failed to fetch products for sitemap:', error);
  }
  return [];
}
```

## Building the Sitemap

### Development
During development (`npm run dev`), dynamic routes are NOT fetched to speed up the dev server startup.

### Production
```bash
cd frontend
npm run build
```

The sitemap will be generated at `dist/sitemap.xml` with all product URLs included.

## Environment Variables

Make sure your `.env` file has the correct backend URL:

```env
VITE_BACKEND_URL=http://localhost:4000
```

For production builds, set the production backend URL.

## Verifying the Sitemap

After building:

1. **Check the generated file:**
   ```bash
   cat dist/sitemap.xml
   ```

2. **Preview the build:**
   ```bash
   npm run preview
   ```
   Then visit: http://localhost:4173/sitemap.xml

3. **In production:**
   Visit: https://revivewardrobe.com/sitemap.xml

## Sitemap Structure

The generated sitemap includes:

### Static Routes
- Home (/)
- Shop (/shop)
- About (/about)
- Contact (/contact)
- Cart (/cart)
- Wishlist (/wishlist)
- Checkout (/checkout)
- Login (/login)
- Signup (/signup)
- Account (/account)
- Forgot Password (/forgot-password)
- Terms (/terms)
- Privacy (/privacy)
- Returns (/returns)
- Shipping (/shipping)

### Dynamic Routes
- All product pages (/product/{slug})

### Excluded Routes
- 404 page (/404)
- Admin routes (/admin/*)
- API routes (/api/*)

## Troubleshooting

### Products not appearing in sitemap

1. **Check backend is running:**
   ```bash
   curl http://localhost:4000/api/product/list
   ```

2. **Verify environment variable:**
   ```bash
   echo $VITE_BACKEND_URL
   ```

3. **Check build logs:**
   Look for warnings about failed product fetching during build

4. **Ensure products have slugs:**
   All products in the database must have a `slug` field

### Build fails

If the backend is not accessible during build, the sitemap will still be generated but without product URLs. Check the console for warnings.

## Submitting to Search Engines

After deploying with the updated sitemap:

1. **Google Search Console:**
   - Go to: https://search.google.com/search-console
   - Submit: https://revivewardrobe.com/sitemap.xml

2. **Bing Webmaster Tools:**
   - Go to: https://www.bing.com/webmasters
   - Submit: https://revivewardrobe.com/sitemap.xml

## Adding More Dynamic Routes

To add other dynamic routes (e.g., blog posts, categories):

```typescript
async function getDynamicRoutes() {
  const productRoutes = await fetchProductRoutes();
  const blogRoutes = await fetchBlogRoutes();
  const categoryRoutes = await fetchCategoryRoutes();
  
  return [...productRoutes, ...blogRoutes, ...categoryRoutes];
}
```

## Notes

- The sitemap is only generated during production builds
- Products are fetched at build time, not runtime
- If you add new products, rebuild and redeploy to update the sitemap
- Consider setting up automatic rebuilds when products are added/updated
