
import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Slider } from "@/components/ui/slider";
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
  const currentPriceMin = parseInt(searchParams.get('minPrice') || '0');
  const currentPriceMax = parseInt(searchParams.get('maxPrice') || '10000');
  const currentColors = searchParams.getAll('color');
  const currentType = searchParams.getAll('type');
  
  const [priceRange, setPriceRange] = useState([currentPriceMin, currentPriceMax]);
  const [selectedFabrics, setSelectedFabrics] = useState<string[]>(
    currentCategory !== 'all' ? [currentCategory] : []
  );
  const [selectedColors, setSelectedColors] = useState<string[]>(currentColors);
  const [selectedTypes, setSelectedTypes] = useState<string[]>(currentType);
  
  const categories = [
    { id: 'fabric-lawn', name: 'Lawn' },
    { id: 'fabric-chiffon', name: 'Chiffon' },
    { id: 'fabric-silk', name: 'Silk' },
    { id: 'fabric-cotton', name: 'Cotton' },
    { id: 'fabric-organza', name: 'Organza' },
  ];
  
  const colors = [
    { id: 'color-red', name: 'Red', hex: '#FF0000' },
    { id: 'color-blue', name: 'Blue', hex: '#0000FF' },
    { id: 'color-green', name: 'Green', hex: '#008000' },
    { id: 'color-black', name: 'Black', hex: '#000000' },
    { id: 'color-white', name: 'White', hex: '#FFFFFF' },
    { id: 'color-pink', name: 'Pink', hex: '#FFC0CB' },
  ];
  
  const types = [
    { id: 'type-stitched', name: 'Stitched' },
    { id: 'type-unstitched', name: 'Unstitched' },
  ];
  
  const handlePriceChange = (values: number[]) => {
    setPriceRange(values);
  };
  
  const formatPriceLabel = (value: number) => {
    return `PKR ${value.toLocaleString()}`;
  };

  const handleFabricChange = (checked: boolean | "indeterminate", fabric: string) => {
    if (checked) {
      setSelectedFabrics(prev => [...prev, fabric]);
    } else {
      setSelectedFabrics(prev => prev.filter(item => item !== fabric));
    }
  };
  
  const handleColorChange = (checked: boolean | "indeterminate", color: string) => {
    if (checked) {
      setSelectedColors(prev => [...prev, color]);
    } else {
      setSelectedColors(prev => prev.filter(item => item !== color));
    }
  };
  
  const handleTypeChange = (checked: boolean | "indeterminate", type: string) => {
    if (checked) {
      setSelectedTypes(prev => [...prev, type]);
    } else {
      setSelectedTypes(prev => prev.filter(item => item !== type));
    }
  };
  
  const applyFilters = () => {
    const params = new URLSearchParams(searchParams);
    
    // Clear existing filters
    params.delete('category');
    params.delete('minPrice');
    params.delete('maxPrice');
    params.delete('color');
    params.delete('type');
    
    // Set category filter
    if (selectedFabrics.length === 1) {
      params.set('category', selectedFabrics[0]);
    } else if (selectedFabrics.length === 0) {
      params.set('category', 'all');
    }
    
    // Set price range
    params.set('minPrice', priceRange[0].toString());
    params.set('maxPrice', priceRange[1].toString());
    
    // Set color filters
    selectedColors.forEach(color => {
      params.append('color', color);
    });
    
    // Set type filters
    selectedTypes.forEach(type => {
      params.append('type', type);
    });
    
    setSearchParams(params);
    
    // On mobile, close the filter sidebar after applying
    if (window.innerWidth < 768) {
      onClose();
    }
    
    toast({
      title: "Filters applied",
      description: "Your product filters have been updated."
    });
  };
  
  const resetFilters = () => {
    setPriceRange([0, 10000]);
    setSelectedFabrics([]);
    setSelectedColors([]);
    setSelectedTypes([]);
    
    const params = new URLSearchParams(searchParams);
    params.delete('minPrice');
    params.delete('maxPrice');
    params.delete('color');
    params.delete('type');
    params.set('category', 'all');
    setSearchParams(params);
    
    toast({
      title: "Filters reset",
      description: "All product filters have been reset."
    });
  };
  
  return (
    <aside className="bg-white p-4 md:p-0">
      <div className="flex items-center justify-between md:hidden mb-6">
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
        <h4 className="font-serif text-lg mb-4">Price Range</h4>
        <Slider 
          value={priceRange} 
          min={0} 
          max={25000} 
          step={500}
          onValueChange={handlePriceChange}
          className="mb-2"
        />
        <div className="flex justify-between text-sm text-gray-600">
          <span>{formatPriceLabel(priceRange[0])}</span>
          <span>{formatPriceLabel(priceRange[1])}</span>
        </div>
      </div>
      
      {/* Fabric Type */}
      <div className="mb-8">
        <h4 className="font-serif text-lg mb-4">Fabric</h4>
        <div className="space-y-2">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center">
              <Checkbox
                id={category.id}
                checked={selectedFabrics.includes(category.id)}
                onCheckedChange={(checked) => handleFabricChange(checked, category.id)}
                className="h-4 w-4 rounded border-gray-300 text-revive-red focus:ring-revive-red"
              />
              <Label htmlFor={category.id} className="ml-2 text-gray-600">
                {category.name}
              </Label>
            </div>
          ))}
        </div>
      </div>
      
      {/* Colors */}
      <div className="mb-8">
        <h4 className="font-serif text-lg mb-4">Colors</h4>
        <div className="flex flex-wrap gap-2">
          {colors.map((color) => (
            <button
              key={color.id}
              className={`w-8 h-8 rounded-full border ${selectedColors.includes(color.id) ? 'ring-2 ring-revive-red' : 'border-gray-300'} flex items-center justify-center focus:outline-none`}
              style={{ backgroundColor: color.hex }}
              title={color.name}
              onClick={() => {
                const isSelected = selectedColors.includes(color.id);
                handleColorChange(!isSelected, color.id);
              }}
            />
          ))}
        </div>
      </div>
      
      {/* Stitched/Unstitched */}
      <div className="mb-8">
        <h4 className="font-serif text-lg mb-4">Type</h4>
        <div className="space-y-2">
          {types.map((type) => (
            <div key={type.id} className="flex items-center">
              <Checkbox
                id={type.id}
                checked={selectedTypes.includes(type.id)}
                onCheckedChange={(checked) => handleTypeChange(checked, type.id)}
                className="h-4 w-4 rounded border-gray-300 text-revive-red focus:ring-revive-red"
              />
              <Label htmlFor={type.id} className="ml-2 text-gray-600">
                {type.name}
              </Label>
            </div>
          ))}
        </div>
      </div>
      
      {/* Filter Actions */}
      <div className="flex gap-2">
        <button 
          className="w-1/2 py-2 bg-revive-red text-white rounded hover:bg-opacity-90 transition-colors"
          onClick={applyFilters}
        >
          Apply
        </button>
        <button 
          className="w-1/2 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
          onClick={resetFilters}
        >
          Reset
        </button>
      </div>
    </aside>
  );
};

export default FilterSidebar;
