# Global Loader Implementation Guide

## Overview
The global loader displays a centered, animated logo (logo.png) with a fade in/out effect whenever pages or data are loading.

## Files Created
1. `src/components/GlobalLoader.tsx` - Main loader component
2. `src/stores/useLoaderStore.ts` - Zustand store for loader state management
3. `src/hooks/usePageLoader.ts` - Hook to easily integrate loader in pages

## Features
- ✅ Centered logo with fade in/out animation
- ✅ Smooth pulse effect on logo
- ✅ Bouncing dots indicator
- ✅ Backdrop blur effect
- ✅ Automatic show/hide based on loading state
- ✅ Multiple loading states support (counter-based)
- ✅ Non-artificial - responds to real loading states

## Usage

### Method 1: Using the Hook (Recommended)
This is the easiest way to show the loader while data is loading.

```tsx
import { usePageLoader } from '@/hooks/usePageLoader';

const MyPage = () => {
  const { data, loading, error } = useSomeDataFetch();
  
  // This will automatically show/hide the loader
  usePageLoader(loading);
  
  return (
    <div>
      {/* Your page content */}
    </div>
  );
};
```

### Method 2: Manual Control
For more complex scenarios where you need manual control.

```tsx
import { useLoaderStore } from '@/stores/useLoaderStore';

const MyComponent = () => {
  const { showLoader, hideLoader } = useLoaderStore();
  
  const handleAction = async () => {
    showLoader(); // Show loader
    
    try {
      await fetchData();
    } finally {
      hideLoader(); // Hide loader
    }
  };
  
  return <button onClick={handleAction}>Load Data</button>;
};
```

## Examples Already Implemented

### Shop Page
```tsx
// src/pages/Shop.tsx
import { usePageLoader } from '@/hooks/usePageLoader';

const Shop = () => {
  const { products, loading, error } = useProductList();
  
  // Shows loader while products are loading
  usePageLoader(loading);
  
  // ... rest of component
};
```

### Product Detail Page
```tsx
// src/pages/ProductDetail.tsx
import { usePageLoader } from '@/hooks/usePageLoader';

const ProductDetail = () => {
  const { product, loading, error } = useProductBySlug(slug || "");
  
  // Shows loader while product is loading
  usePageLoader(loading);
  
  // ... rest of component
};
```

## How to Add to Other Pages

### 1. Import the hook
```tsx
import { usePageLoader } from '@/hooks/usePageLoader';
```

### 2. Use with your loading state
```tsx
const { data, loading } = useYourDataHook();
usePageLoader(loading);
```

### 3. That's it! The loader will show/hide automatically

## Customization

### Change Logo
Replace `/public/logo.png` with your desired logo image.

### Change Animation Duration
Edit `src/components/GlobalLoader.tsx`:
```tsx
// Change from 2s to your preferred duration
className="h-24 w-auto animate-pulse-slow"
```

Or modify the CSS in `src/index.css`:
```css
.animate-pulse-slow {
  animation: pulse-slow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  /* Change 2s to your preferred duration */
}
```

### Change Position
Edit `src/components/GlobalLoader.tsx`:
```tsx
// Currently centered with flex items-center justify-center
// Modify the flex alignment as needed
<div className="fixed inset-0 z-[9999] flex items-center justify-center ...">
```

### Change Backdrop
Edit `src/components/GlobalLoader.tsx`:
```tsx
// Current: white/80 with backdrop blur
className="... bg-white/80 backdrop-blur-sm ..."

// Options:
// More transparent: bg-white/60
// Darker: bg-gray-900/50
// No blur: remove backdrop-blur-sm
```

### Change Logo Size
```tsx
// Current size: h-24 (96px)
<img src="/logo.png" className="h-24 w-auto ..." />

// Smaller: h-16 (64px)
// Larger: h-32 (128px)
```

## Advanced Usage

### Multiple Loading States
The loader uses a counter system, so multiple components can show/hide without conflicts:

```tsx
const PageWithMultipleLoaders = () => {
  const { data1, loading1 } = useFetch1();
  const { data2, loading2 } = useFetch2();
  
  usePageLoader(loading1);
  usePageLoader(loading2);
  
  // Loader shows if ANY loading state is true
  // Hides only when ALL loading states are false
};
```

### Conditional Loading
```tsx
const MyPage = () => {
  const [shouldShowLoader, setShouldShowLoader] = useState(false);
  const { data, loading } = useFetch();
  
  // Only show loader if data is actually loading AND we want to show it
  usePageLoader(loading && shouldShowLoader);
};
```

## Troubleshooting

### Loader doesn't appear
1. Check if `<GlobalLoader />` is in `App.tsx`
2. Verify the loading state is `true`
3. Check browser console for errors

### Loader shows too long
1. Ensure `hideLoader()` is called or loading state becomes `false`
2. Check for cleanup in `useEffect` hooks

### Logo doesn't show
1. Verify `/public/logo.png` exists
2. Check image path is correct
3. Try hard refresh (Ctrl+F5)

### Multiple loaders conflict
The store handles this automatically with a counter. Each `showLoader()` increments, each `hideLoader()` decrements.

## Performance
- Minimal re-renders (uses Zustand for state)
- Lazy mounting (only renders when needed)
- Smooth transitions with CSS animations
- No impact when hidden

## Browser Support
Works on all modern browsers with CSS animation support:
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
