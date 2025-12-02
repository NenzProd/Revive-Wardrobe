
import { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ProductImageGalleryProps {
  images: string[];
  onImageClick?: (index: number) => void;
}

const ProductImageGallery = ({ images, onImageClick }: ProductImageGalleryProps) => {
  const [mainImage, setMainImage] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomStyle, setZoomStyle] = useState<React.CSSProperties>({});
  const containerRef = useRef<HTMLDivElement>(null);
  
  const ZOOM_LEVEL = 2;
  
  const handleThumbClick = (index: number) => {
    setMainImage(index);
    setIsZoomed(false);
    setZoomStyle({});
  };
  
  const handlePrevious = () => {
    setMainImage(prev => (prev === 0 ? images.length - 1 : prev - 1));
    setIsZoomed(false);
    setZoomStyle({});
  };
  
  const handleNext = () => {
    setMainImage(prev => (prev === images.length - 1 ? 0 : prev + 1));
    setIsZoomed(false);
    setZoomStyle({});
  };

  const handleImageClick = () => {
    if (onImageClick) {
      onImageClick(mainImage);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    
    // Get mouse position relative to container
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Calculate the percentage position
    const xPercent = (x / rect.width) * 100;
    const yPercent = (y / rect.height) * 100;
    
    // Set transform origin and scale - image stays still, zoom follows cursor
    setZoomStyle({
      transform: `scale(${ZOOM_LEVEL})`,
      transformOrigin: `${xPercent}% ${yPercent}%`,
    });
  };

  const handleMouseEnter = () => {
    setIsZoomed(true);
  };

  const handleMouseLeave = () => {
    setIsZoomed(false);
    setZoomStyle({});
  };

  return (
    <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
      {/* Main Image (on small screens shown first, on lg screens shown to the right) */}
      <div className="order-1 lg:order-2 w-full lg:flex-1">
        <div className="relative mb-4 overflow-hidden rounded-lg border border-gray-200">
          <div
            ref={containerRef}
            className="relative h-[520px] lg:h-[760px] overflow-hidden cursor-zoom-in"
            onClick={handleImageClick}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <img
              src={images[mainImage]}
              alt="Product"
              className="w-full h-full object-contain bg-white transition-transform duration-150 ease-out"
              style={isZoomed ? { ...zoomStyle, willChange: 'transform' } : {}}
              draggable={false}
            />
          </div>

          {/* Navigation Arrows */}
          <button
            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center text-gray-800 hover:bg-white transition-colors"
            onClick={handlePrevious}
          >
            <ChevronLeft size={16} />
          </button>
          <button
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center text-gray-800 hover:bg-white transition-colors"
            onClick={handleNext}
          >
            <ChevronRight size={16} />
          </button>
        </div>
        
        {/* Navigation Arrows */}
        <button
          className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center text-gray-800 hover:bg-white transition-colors"
          onClick={handlePrevious}
        >
          <ChevronLeft size={16} />
        </button>
        <button
          className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center text-gray-800 hover:bg-white transition-colors"
          onClick={handleNext}
        >
          <ChevronRight size={16} />
        </button>
      </div>
      
      {/* Thumbnails */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {images.map((image, index) => (
          <button
            key={index}
            className={`w-20 h-20 border rounded-md overflow-hidden ${
              index === mainImage ? 'border-revive-red' : 'border-gray-200'
            }`}
            onClick={() => handleThumbClick(index)}
          >
            <img
              src={image}
              alt={`Thumbnail ${index + 1}`}
              className="w-full h-full object-contain bg-white"
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductImageGallery;
