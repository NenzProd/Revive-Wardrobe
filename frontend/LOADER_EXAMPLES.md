# Global Loader - Quick Start Examples

## Real-World Examples

### Example 1: Blog List Page with API Call
```tsx
import { usePageLoader } from '@/hooks/usePageLoader';
import { useBlogs } from '@/hooks/useBlogs';

const BlogList = () => {
  const { blogs, loading, error } = useBlogs();
  
  // Show loader while blogs are loading
  usePageLoader(loading);
  
  if (error) return <div>Error loading blogs</div>;
  
  return (
    <div>
      <h1>Blog Posts</h1>
      {blogs.map(blog => (
        <BlogCard key={blog.id} blog={blog} />
      ))}
    </div>
  );
};
```

### Example 2: Form Submission
```tsx
import { useState } from 'react';
import { useLoaderStore } from '@/stores/useLoaderStore';

const ContactForm = () => {
  const { showLoader, hideLoader } = useLoaderStore();
  const [formData, setFormData] = useState({ name: '', email: '' });
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    showLoader();
    
    try {
      await fetch('/api/contact', {
        method: 'POST',
        body: JSON.stringify(formData)
      });
      alert('Message sent!');
    } catch (error) {
      console.error(error);
    } finally {
      hideLoader();
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
      <button type="submit">Submit</button>
    </form>
  );
};
```

### Example 3: Checkout Page
```tsx
import { usePageLoader } from '@/hooks/usePageLoader';

const Checkout = () => {
  const [processing, setProcessing] = useState(false);
  const { cart, loading: cartLoading } = useCart();
  
  // Show loader while cart is loading OR payment is processing
  usePageLoader(cartLoading || processing);
  
  const handlePayment = async () => {
    setProcessing(true);
    try {
      await processPayment();
    } finally {
      setProcessing(false);
    }
  };
  
  return (
    <div>
      <CartSummary items={cart} />
      <button onClick={handlePayment}>Pay Now</button>
    </div>
  );
};
```

### Example 4: Account Page with Multiple Data Sources
```tsx
import { usePageLoader } from '@/hooks/usePageLoader';

const Account = () => {
  const { user, loading: userLoading } = useUser();
  const { orders, loading: ordersLoading } = useOrders();
  const { addresses, loading: addressesLoading } = useAddresses();
  
  // Loader shows if ANY of these are loading
  usePageLoader(userLoading);
  usePageLoader(ordersLoading);
  usePageLoader(addressesLoading);
  
  return (
    <div>
      <UserProfile user={user} />
      <OrderHistory orders={orders} />
      <AddressList addresses={addresses} />
    </div>
  );
};
```

### Example 5: Image Upload with Progress
```tsx
import { useLoaderStore } from '@/stores/useLoaderStore';

const ImageUpload = () => {
  const { showLoader, hideLoader } = useLoaderStore();
  
  const handleUpload = async (file) => {
    showLoader();
    
    const formData = new FormData();
    formData.append('image', file);
    
    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      const data = await response.json();
      console.log('Uploaded:', data.url);
    } finally {
      hideLoader();
    }
  };
  
  return (
    <input 
      type="file" 
      onChange={(e) => handleUpload(e.target.files[0])} 
    />
  );
};
```

### Example 6: Navigation with Loader
```tsx
import { useNavigate } from 'react-router-dom';
import { useLoaderStore } from '@/stores/useLoaderStore';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { showLoader } = useLoaderStore();
  
  const handleClick = () => {
    // Show loader immediately when navigating
    showLoader();
    navigate(`/product/${product.slug}`);
    // Loader will hide when ProductDetail page's data finishes loading
  };
  
  return (
    <div onClick={handleClick}>
      <img src={product.image} alt={product.name} />
      <h3>{product.name}</h3>
    </div>
  );
};
```

## Testing the Loader

### Method 1: Use the Demo Component
```tsx
// In any page, temporarily add:
import LoaderDemo from '@/components/LoaderDemo';

const YourPage = () => {
  return (
    <div>
      <LoaderDemo /> {/* Remove this after testing */}
      {/* Your page content */}
    </div>
  );
};
```

### Method 2: Test with Browser DevTools
1. Open DevTools (F12)
2. Go to Network tab
3. Change network speed to "Slow 3G"
4. Navigate to Shop or Product Detail page
5. You should see the loader while data loads

### Method 3: Artificial Delay for Testing
```tsx
const TestPage = () => {
  const [loading, setLoading] = useState(true);
  
  usePageLoader(loading);
  
  useEffect(() => {
    // Simulate a 3-second load
    setTimeout(() => setLoading(false), 3000);
  }, []);
  
  return <div>Page Content</div>;
};
```

## Common Patterns

### Pattern 1: Error Handling with Loader
```tsx
const PageWithErrorHandling = () => {
  const { data, loading, error } = useFetch();
  
  usePageLoader(loading);
  
  if (loading) return null; // Loader is showing
  if (error) return <ErrorMessage error={error} />;
  
  return <DataDisplay data={data} />;
};
```

### Pattern 2: Conditional Loading
```tsx
const ConditionalPage = () => {
  const [needsData, setNeedsData] = useState(false);
  const { data, loading } = useFetch(needsData);
  
  // Only show loader when we actually need data
  usePageLoader(needsData && loading);
  
  return (
    <button onClick={() => setNeedsData(true)}>
      Load Data
    </button>
  );
};
```

### Pattern 3: Sequential Loading
```tsx
const SequentialPage = () => {
  const [step, setStep] = useState(1);
  
  const { user, loading: userLoading } = useUser();
  usePageLoader(step === 1 && userLoading);
  
  const { cart, loading: cartLoading } = useCart(user?.id);
  usePageLoader(step === 2 && cartLoading);
  
  return (
    <div>
      {step === 1 && <UserForm onNext={() => setStep(2)} />}
      {step === 2 && <CartReview />}
    </div>
  );
};
```

## Tips & Best Practices

1. **Use the hook for pages**: `usePageLoader(loading)` is perfect for page-level loading
2. **Manual control for actions**: Use `showLoader/hideLoader` for button clicks, form submissions
3. **Always hide in finally block**: Ensures loader hides even if errors occur
4. **Don't over-use**: Only use for operations that take >500ms
5. **Test on slow network**: Use Chrome DevTools to simulate slow connections
6. **Cleanup on unmount**: The hook handles this automatically

## Customization Ideas

### Add Loading Text
```tsx
// In GlobalLoader.tsx, add:
<p className="text-amber-800 text-sm font-medium mt-2">
  Loading...
</p>
```

### Add Percentage Progress
```tsx
// Create a progress variant:
const GlobalLoader = ({ isLoading, progress = 0 }) => {
  // ... existing code
  {progress > 0 && (
    <div className="text-sm text-amber-700 mt-2">
      {progress}%
    </div>
  )}
}
```

### Multiple Logo Animations
```css
/* In index.css, add more animation options: */
@keyframes rotate-fade {
  0%, 100% { opacity: 1; transform: rotate(0deg); }
  50% { opacity: 0.4; transform: rotate(180deg); }
}

.animate-rotate-fade {
  animation: rotate-fade 2s ease-in-out infinite;
}
```

## Summary

The global loader is now:
- ✅ Implemented in Shop page
- ✅ Implemented in Product Detail page
- ✅ Ready to use in any page with one line of code
- ✅ Fully customizable
- ✅ Performance optimized
- ✅ Non-artificial (responds to real loading states)

Just import and use `usePageLoader(loading)` in any page! 🚀
