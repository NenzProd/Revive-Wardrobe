import { useState, useRef, useEffect, useCallback} from 'react';
import { X } from 'lucide-react';
import { Checkbox } from "@/components/ui/checkbox";
import { useSearchParams } from "react-router-dom";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

interface FilterSidebarProps {
  onClose: () => void;
}

const FilterSidebar = ({ onClose }: FilterSidebarProps) => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Get current filters from URL parameters
  const currentCategory = searchParams.get('category') || 'all';
  const currentPriceMin = parseInt(searchParams.get('minPrice') || '100');
  const currentPriceMax = parseInt(searchParams.get('maxPrice') || '2000');
  const currentColors = searchParams.getAll('color');
  const currentType = searchParams.getAll('type');
  
  const [priceRange, setPriceRange] = useState([currentPriceMin, currentPriceMax]);
  // const [selectedFabrics, setSelectedFabrics] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>(currentColors);

  
  const categories = [
    { id: 'Ethnic Elegance', name: 'Ethnic Elegance' },
    { id: 'Graceful Abayas', name: 'Graceful Abayas' },
    // { id: 'Intimate Collection', name: 'Intimate Collection' },
  ];
  
  const colors = [
    { id: 'color-red', name: 'Red', hex: '#FF0000' },
    { id: 'color-blue', name: 'Blue', hex: '#0000FF' },
    { id: 'color-green', name: 'Green', hex: '#008000' },
    { id: 'color-black', name: 'Black', hex: '#000000' },
    { id: 'color-white', name: 'White', hex: '#FFFFFF' },
    { id: 'color-pink', name: 'Pink', hex: '#FFC0CB' },
  ];
  

  
  // const fabricOptions = [
  //   { id: 'Lawn', name: 'lawn' },
  //   { id: 'Chiffon', name: 'chiffon' },
  //   { id: 'Silk', name: 'silk' },
  //   { id: 'Cotton', name: 'cotton' },
  //   { id: 'Organza', name: 'organza' },
  // ];
  
  const minRange = 100;
  const maxRange = 2000;
  const [isDragging, setIsDragging] = useState({ min: false, max: false });
  const sliderRef = useRef<HTMLDivElement>(null);

  const handleSliderChange = useCallback((clientX: number, isMin: boolean) => {
    if (!sliderRef.current) return;
    
    const rect = sliderRef.current.getBoundingClientRect();
    const percentage = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const value = Math.round(minRange + percentage * (maxRange - minRange));
    
    setPriceRange(prev => {
      if (isMin) {
        return [Math.min(value, prev[1] - 50), prev[1]];
      } else {
        return [prev[0], Math.max(value, prev[0] + 50)];
      }
    });
  }, []);

  const handleMouseDown = (isMin: boolean) => (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging({ min: isMin, max: !isMin });
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging.min) {
        handleSliderChange(e.clientX, true);
      } else if (isDragging.max) {
        handleSliderChange(e.clientX, false);
      }
    };

    const handleMouseUp = () => {
      setIsDragging({ min: false, max: false });
    };

    if (isDragging.min || isDragging.max) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = 'none';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = '';
    };
  }, [isDragging, handleSliderChange]);
  
  const formatPriceLabel = (value: number) => {
    return `AED ${value.toLocaleString()}`;
  };

  // const handleFabricChange = (checked: boolean | "indeterminate", fabric: string) => {
  //   if (checked) {
  //     setSelectedFabrics(prev => [...prev, fabric]);
  //   } else {
  //     setSelectedFabrics(prev => prev.filter(item => item !== fabric));
  //   }
  // };
  
  const handleColorChange = (checked: boolean | "indeterminate", color: string) => {
    if (checked) {
      setSelectedColors(prev => [...prev, color]);
    } else {
      setSelectedColors(prev => prev.filter(item => item !== color));
    }
  };
  

  
  const applyFilters = () => {
    const params = new URLSearchParams(searchParams);
    
    // Clear existing price filters
    params.delete('minPrice');
    params.delete('maxPrice');
    params.delete('fabric');
    
    // Keep the current category if it exists
    if (currentCategory && currentCategory !== 'all') {
      params.set('category', currentCategory);
    }
    
    // Set price range only if different from default
    if (priceRange[0] > 100) {
      params.set('minPrice', priceRange[0].toString());
    }
    if (priceRange[1] < 2000) {
      params.set('maxPrice', priceRange[1].toString());
    }
    
    // Set color filters
    params.delete('color');
    selectedColors.forEach(color => {
      params.append('color', color);
    });
    
    setSearchParams(params);
    
    // On mobile, close the filter sidebar after applying
    if (window.innerWidth < 1024) {
      onClose();
    }
    
    toast({
      title: "Filters applied",
      description: "Your product filters have been updated."
    });
  };
  
  const resetFilters = () => {
    setPriceRange([100, 2000]);
    // setSelectedFabrics([]);
    setSelectedColors([]);

    const params = new URLSearchParams();
    // Clear all filter parameters and reset to show all products
    // Don't set category to 'all' - just remove all filters
    
    setSearchParams(params);
    
    toast({
      title: "Filters reset",
      description: "All product filters have been reset."
    });
  };
  
  return (
    <aside className="bg-white p-4 md:p-0">
      <div className="flex items-center justify-between lg:hidden mb-6">
        <h3 className="font-serif text-lg">Filters</h3>
        <button 
          className="text-gray-500 hover:text-revive-red"
          onClick={onClose}
        >
          <X size={24} />
        </button>
      </div>
      
      {/* Price Range */}
      <div className="mb-8">
        <h4 className="font-serif text-lg mb-4 text-gray-800">Price Range</h4>
        <div className="px-3 py-4">
          {/* Custom Dual Range Slider */}
          <div className="relative mb-6">
            <div 
              ref={sliderRef}
              className="relative h-2 bg-gray-200 rounded-full cursor-pointer"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const clickX = e.clientX;
                const midPoint = priceRange[0] + (priceRange[1] - priceRange[0]) / 2;
                const clickValue = minRange + ((clickX - rect.left) / rect.width) * (maxRange - minRange);
                handleSliderChange(clickX, clickValue < midPoint);
              }}
            >
              {/* Active Range */}
              <div 
                className="absolute h-2 bg-gradient-to-r from-amber-500 to-amber-600 rounded-full"
                style={{
                  left: `${((priceRange[0] - minRange) / (maxRange - minRange)) * 100}%`,
                  width: `${((priceRange[1] - priceRange[0]) / (maxRange - minRange)) * 100}%`
                }}
              />
              
              {/* Min Handle */}
              <div
                className={`absolute w-5 h-5 bg-white border-2 border-amber-500 rounded-full shadow-md cursor-grab transform -translate-y-1.5 transition-all duration-150 hover:scale-110 ${
                  isDragging.min ? 'scale-110 border-amber-600 shadow-lg cursor-grabbing' : ''
                }`}
                style={{
                  left: `${((priceRange[0] - minRange) / (maxRange - minRange)) * 100}%`,
                  transform: 'translateX(-50%) translateY(-6px)'
                }}
                onMouseDown={handleMouseDown(true)}
              />
              
              {/* Max Handle */}
              <div
                className={`absolute w-5 h-5 bg-white border-2 border-amber-500 rounded-full shadow-md cursor-grab transform -translate-y-1.5 transition-all duration-150 hover:scale-110 ${
                  isDragging.max ? 'scale-110 border-amber-600 shadow-lg cursor-grabbing' : ''
                }`}
                style={{
                  left: `${((priceRange[1] - minRange) / (maxRange - minRange)) * 100}%`,
                  transform: 'translateX(-50%) translateY(-6px)'
                }}
                onMouseDown={handleMouseDown(false)}
              />
            </div>
          </div>
          
          <div className="flex justify-between text-sm text-gray-600 font-medium">
            <span className="bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-100">{formatPriceLabel(priceRange[0])}</span>
            <span className="bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-100">{formatPriceLabel(priceRange[1])}</span>
          </div>
        </div>
      </div>
      
      {/* Category */}
      <div className="mb-8">
        <h4 className="font-serif text-lg mb-4">Category</h4>
        <div className="space-y-2">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center">
              <Checkbox
                id={category.id}
                checked={currentCategory === category.id}
                onCheckedChange={() => setSearchParams(prev => { const p = new URLSearchParams(prev); p.set('category', category.id); return p; })}
                className="h-4 w-4 rounded border-gray-300 text-revive-red focus:ring-revive-red"
              />
              <Label htmlFor={category.id} className="ml-2 text-gray-600">
                {category.name}
              </Label>
            </div>
          ))}
        </div>
      </div>
      
      {/* Fabric - Commented out for now */}
      {/* <div className="mb-8">
        <h4 className="font-serif text-lg mb-4">Fabric</h4>
        <div className="space-y-2">
          {fabricOptions.map((fabric) => (
            <div key={fabric.id} className="flex items-center">
              <Checkbox
                id={fabric.id}
                checked={selectedFabrics.includes(fabric.id)}
                onCheckedChange={(checked) => handleFabricChange(checked, fabric.id)}
                className="h-4 w-4 rounded border-gray-300 text-revive-red focus:ring-revive-red"
              />
              <Label htmlFor={fabric.id} className="ml-2 text-gray-600">
                {fabric.name}
              </Label>
            </div>
          ))}
        </div>
      </div> */}
      
   
      
      {/* Filter Actions */}
      <div className="flex gap-3 mt-6">
        <button 
          className="flex-1 py-3 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-lg hover:from-amber-700 hover:to-amber-800 transition-all duration-300 font-medium shadow-md hover:shadow-lg"
          onClick={applyFilters}
        >
          Apply Filters
        </button>
        <button 
          className="flex-1 py-3 border-2 border-amber-200 text-amber-800 rounded-lg hover:bg-amber-50 hover:border-amber-300 transition-all duration-300 font-medium"
          onClick={resetFilters}
        >
          Reset All
        </button>
      </div>
    </aside>
  );
};

export default FilterSidebar;
