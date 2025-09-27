
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
    <div>
      {/* Main Image */}
      <div className="relative mb-4 overflow-hidden rounded-lg border border-gray-200">
        <div 
          className="relative h-[500px] overflow-hidden cursor-pointer"
          onClick={handleImageClick}
        >
          <img
            src={images[mainImage]}
            alt="Product"
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
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
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductImageGallery;
