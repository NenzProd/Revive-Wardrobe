import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useLoaderStore } from '@/stores/useLoaderStore';

/**
 * Demo component to test the global loader
 * You can temporarily add this to a page to test the loader
 */
const LoaderDemo = () => {
  const { showLoader, hideLoader, isLoading } = useLoaderStore();
  const [countdown, setCountdown] = useState(0);

  const testLoader = (duration: number) => {
    showLoader();
    setCountdown(duration);
    
    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          hideLoader();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  return (
    <div className="fixed bottom-4 left-4 z-50 bg-white p-4 rounded-lg shadow-lg border border-gray-200">
      <h3 className="font-semibold mb-3">Global Loader Demo</h3>
      <div className="flex flex-col gap-2">
        <Button 
          onClick={() => testLoader(3)} 
          variant="outline"
          size="sm"
        >
          Test Loader (3s)
        </Button>
        <Button 
          onClick={() => testLoader(5)} 
          variant="outline"
          size="sm"
        >
          Test Loader (5s)
        </Button>
        <Button 
          onClick={showLoader} 
          variant="outline"
          size="sm"
        >
          Show Loader
        </Button>
        <Button 
          onClick={hideLoader} 
          variant="outline"
          size="sm"
        >
          Hide Loader
        </Button>
        <div className="text-xs text-gray-500 mt-2">
          Status: {isLoading ? `Loading... ${countdown}s` : 'Idle'}
        </div>
      </div>
    </div>
  );
};

export default LoaderDemo;
