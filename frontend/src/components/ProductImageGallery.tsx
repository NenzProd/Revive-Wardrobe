
import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ProductImageGalleryProps {
  images: string[];
  onImageClick?: (index: number) => void;
}

const ProductImageGallery = ({ images, onImageClick }: ProductImageGalleryProps) => {
  const [mainImage, setMainImage] = useState(0);
  
  const handleThumbClick = (index: number) => {
    setMainImage(index);
  };
  
  const handlePrevious = () => {
    setMainImage(prev => (prev === 0 ? images.length - 1 : prev - 1));
  };
  
  const handleNext = () => {
    setMainImage(prev => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleImageClick = () => {
    if (onImageClick) {
      onImageClick(mainImage);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
      {/* Main Image (on small screens shown first, on lg screens shown to the right) */}
      <div className="order-1 lg:order-2 w-full lg:flex-1">
        <div className="relative mb-4 overflow-hidden rounded-lg border border-gray-200">
          <div
            className="relative h-[520px] lg:h-[760px] overflow-hidden cursor-pointer"
            onClick={handleImageClick}
          >
            <img
              src={images[mainImage]}
              alt="Product"
              className="w-full h-full object-contain transition-transform duration-300 hover:scale-105 bg-white"
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
      </div>

      {/* Thumbnails (stacked vertically on lg screens, horizontal scroll on small screens) */}
      <div className="order-2 lg:order-1 flex lg:flex-col gap-2 lg:h-[760px] lg:overflow-y-auto w-full lg:w-auto lg:items-center lg:justify-center">
        {images.map((image, index) => (
          <button
            key={index}
            className={`flex-shrink-0 w-20 h-20 border rounded-md overflow-hidden ${
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
