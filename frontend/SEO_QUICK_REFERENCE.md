# SEO Quick Reference Guide

## Adding SEO to a New Page

### Step 1: Import the SEO Component
```tsx
import SEO from '../components/SEO';
```

### Step 2: Add SEO Component to Your Page
Place the SEO component at the top of your page component's return statement:

```tsx
const MyNewPage = () => {
  return (
    <div>
      <SEO 
        title="Page Title"
        description="A compelling description of your page (150-160 characters)"
        keywords="keyword1, keyword2, keyword3, buy clothes online dubai, online fashion store uae, dubai clothing store, modest fashion dubai, shein dubai uae online, online clothes shopping uae, abaya online uae, zara uae online, shein online shopping dubai, matalan uae online, order clothes online dubai, best abaya shops in Dubai, Dubai abaya online worldwide shipping, abaya shop Dubai online, luxury abaya Dubai online"
        canonical="/page-url"
      />
      <Navbar />
      {/* Rest of your page content */}
    </div>
  );
};
```

## SEO Component Props

| Prop | Type | Required | Description | Example |
|------|------|----------|-------------|---------|
| `title` | string | ✅ Yes | Page title (will be appended with "| Revive Wardrobe") | "Shop Fashion" |
| `description` | string | ✅ Yes | Meta description for search engines | "Browse our collection..." |
| `keywords` | string | ❌ No | Comma-separated keywords | "fashion, clothing, shop, buy clothes online dubai, online fashion store uae, dubai clothing store, modest fashion dubai, shein dubai uae online, online clothes shopping uae, abaya online uae, zara uae online, shein online shopping dubai, matalan uae online, order clothes online dubai, best abaya shops in Dubai, Dubai abaya online worldwide shipping, abaya shop Dubai online, luxury abaya Dubai online" |
| `canonical` | string | ❌ No | Canonical URL path | "/shop" |
| `ogImage` | string | ❌ No | Open Graph image URL | "/product-image.jpg" |
| `ogType` | string | ❌ No | Open Graph type | "website" or "product" or "article" |

## Best Practices

### Title Tags
- Keep between 50-60 characters
- Include primary keyword
- Make it compelling and descriptive
- Don't stuff keywords

✅ Good: "Premium Fashion Collection - Shop Now"
❌ Bad: "Fashion Clothes Shop Buy Online Store Clothing"

### Meta Descriptions
- Keep between 150-160 characters
- Include a call-to-action
- Summarize page content
- Include primary keyword naturally

✅ Good: "Discover our curated collection of elegant fashion. Shop premium clothing with fast UAE delivery. Free shipping on orders over AED 500."
❌ Bad: "Fashion shop clothing buy online"

### Keywords
- Use 5-10 relevant keywords
- Mix primary and long-tail keywords
- Separate with commas
- Don't repeat keywords

✅ Good: "fashion, women's clothing, UAE fashion, online boutique, premium attire"
❌ Bad: "fashion, fashion shop, fashion store, fashion online, fashion UAE"

### Canonical URLs
- Always use relative paths starting with "/"
- Match the actual page route
- Don't include domain name

✅ Good: "/shop/women"
❌ Bad: "https://revivewardrobe.com/shop/women"

## Dynamic SEO Examples

### Product Page
```tsx
<SEO 
  title={`${product.name} - ${product.category}`}
  description={product.description}
  keywords={`${product.name}, ${product.category}, ${product.type}`}
  canonical={`/product/${product.slug}`}
  ogImage={product.image[0]}
  ogType="product"
/>
```

### Blog Post
```tsx
<SEO 
  title={`${post.title} - Blog`}
  description={post.excerpt}
  keywords={`${post.category}, blog, ${post.title}`}
  canonical={`/blog/${post.slug}`}
  ogImage={post.imageUrl}
  ogType="article"
/>
```

### Category Page
```tsx
<SEO 
  title={`${category} Collection - Shop Now`}
  description={`Browse our ${category} collection. Premium quality with fast delivery.`}
  keywords={`${category}, fashion, clothing, shop ${category}`}
  canonical={`/shop/${category}`}
/>
```

## H1 Tag Guidelines

Every page MUST have exactly ONE H1 tag:

```tsx
<h1 className="text-3xl md:text-4xl font-serif mb-4">
  Page Main Heading
</h1>
```

### H1 Best Practices
- Only one H1 per page
- Should match or be similar to page title
- Include primary keyword
- Make it descriptive and clear

## Image Alt Attributes

All images MUST have alt attributes:

```tsx
<img 
  src="/product.jpg" 
  alt="Elegant red evening dress with embroidery"
  className="w-full h-auto"
/>
```

### Alt Text Best Practices
- Describe the image content
- Include relevant keywords naturally
- Keep it concise (125 characters or less)
- Don't start with "Image of" or "Picture of"

✅ Good: "Red silk evening dress with gold embroidery"
❌ Bad: "image123.jpg" or "product"

## Testing Your SEO

### 1. Check in Browser DevTools
Open DevTools (F12) → Elements → Look for `<head>` section:
- Verify `<title>` tag
- Check `<meta name="description">` 
- Confirm `<link rel="canonical">`
- Look for Open Graph tags (`<meta property="og:...">`)

### 2. Test Social Sharing
- **Facebook**: https://developers.facebook.com/tools/debug/
- **Twitter**: https://cards-dev.twitter.com/validator
- **LinkedIn**: https://www.linkedin.com/post-inspector/

### 3. Validate Structured Data
- Google Rich Results Test: https://search.google.com/test/rich-results

## Common Mistakes to Avoid

❌ **Duplicate Titles**: Each page should have a unique title
❌ **Missing H1**: Every page needs exactly one H1 tag
❌ **Keyword Stuffing**: Use keywords naturally
❌ **Too Short Descriptions**: Aim for 150-160 characters
❌ **Missing Alt Text**: All images need descriptive alt attributes
❌ **Wrong Canonical URL**: Should match the actual page path
❌ **Multiple H1 Tags**: Only one H1 per page

## Sitemap & Robots.txt

### Sitemap
- Automatically generated during build
- Located at: `dist/sitemap.xml`
- Accessible at: `https://revivewardrobe.com/sitemap.xml`
- **Includes all product URLs dynamically** - Fetched from backend during build

### Robots.txt
- Located at: `frontend/public/robots.txt`
- Accessible at: `https://revivewardrobe.com/robots.txt`

### Adding New Static Routes to Sitemap
Edit `frontend/vite.config.ts`:

```typescript
sitemap({
  hostname: 'https://revivewardrobe.com',
  dynamicRoutes: [
    '/',
    '/shop',
    '/your-new-route', // Add here
    ...productRoutes, // Dynamic product routes
  ],
})
```

### Dynamic Product URLs
Product URLs are automatically included in the sitemap:
- Format: `/product/{slug}`
- Example: `/product/emerald-bloom-ensemble`
- Fetched from backend API during production build
- See `SITEMAP_GUIDE.md` for detailed information

## Need Help?

- Check `SEO_IMPLEMENTATION_SUMMARY.md` for detailed documentation
- Review existing pages for examples
- Test your changes in development before deploying
- Use browser DevTools to verify meta tags

## Quick Checklist for New Pages

- [ ] Import SEO component
- [ ] Add SEO component with all required props
- [ ] Add unique, descriptive title
- [ ] Write compelling meta description (150-160 chars)
- [ ] Add relevant keywords
- [ ] Set correct canonical URL
- [ ] Add exactly one H1 tag
- [ ] Ensure all images have alt attributes
- [ ] Test in browser DevTools
- [ ] Add route to sitemap if needed
- [ ] Build and verify no errors
