import { useEffect, useState } from 'react';

interface GlobalLoaderProps {
  isLoading: boolean;
}

const GlobalLoader = ({ isLoading }: GlobalLoaderProps) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isLoading) {
      setShow(true);
    } else {
      // Delay hiding to allow fade out animation
      const timer = setTimeout(() => setShow(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  if (!show) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-white/80 backdrop-blur-sm transition-opacity duration-300 ${
        isLoading ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div className="flex flex-col items-center gap-4">
        <img
          src="/logo.png"
          alt="Loading..."
          className="h-24 w-auto animate-pulse-slow"
        />
        <div className="flex gap-2">
          <div className="h-2 w-2 rounded-full bg-amber-600 animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="h-2 w-2 rounded-full bg-amber-600 animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="h-2 w-2 rounded-full bg-amber-600 animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    </div>
  );
};

export default GlobalLoader;
