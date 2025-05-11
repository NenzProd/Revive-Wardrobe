
import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductGrid from '../components/ProductGrid';
import FilterSidebar from '../components/FilterSidebar';
import { useSearchParams } from 'react-router-dom';
import Newsletter from '../components/Newsletter';
import { Sliders } from 'lucide-react';

const Shop = () => {
  const [searchParams] = useSearchParams();
  const [filterOpen, setFilterOpen] = useState(false);
  
  // Extract all filter parameters from URL
  const category = searchParams.get('category') || 'all';
  const sortOption = searchParams.get('sort') || 'newest';
  const minPrice = parseInt(searchParams.get('minPrice') || '0');
  const maxPrice = parseInt(searchParams.get('maxPrice') || '25000');
  const colors = searchParams.getAll('color');
  const types = searchParams.getAll('type');

  const toggleFilter = () => {
    setFilterOpen(!filterOpen);
  };

  // Update sort option in URL when dropdown changes
  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('sort', value);
    window.history.pushState({}, '', `?${params.toString()}`);
    // Force a reload of the current page to apply the new sort
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 flex-grow">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-serif mb-4">Our Collection</h1>
          <div className="w-24 h-1 bg-revive-red mx-auto mb-6"></div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore our curated collection of elegant attire designed to bring out the best in you.
          </p>
        </div>
        
        {/* Filter and Sort Controls */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <button 
            onClick={toggleFilter}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md mb-4 md:mb-0 hover:bg-gray-50 transition-colors"
          >
            <Sliders size={18} />
            <span>Filters</span>
          </button>
          
          <div className="flex items-center gap-4">
            <select
              className="border border-gray-300 rounded-md p-2 bg-white"
              value={sortOption}
              onChange={(e) => handleSortChange(e.target.value)}
            >
              <option value="newest">Newest</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
              <option value="popular">Popularity</option>
            </select>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Filter Sidebar - Mobile version is handled by state */}
          <div className={`${filterOpen ? 'block' : 'hidden'} md:block md:w-1/4`}>
            <FilterSidebar onClose={() => setFilterOpen(false)} />
          </div>
          
          {/* Product Grid - Always use grid view */}
          <div className="md:w-3/4">
            <ProductGrid 
              viewMode="grid" 
              category={category} 
              sortOption={sortOption}
              minPrice={minPrice}
              maxPrice={maxPrice}
              colors={colors}
              types={types}
            />
          </div>
        </div>
      </div>
      
      <Newsletter />
      <Footer />
    </div>
  );
};

export default Shop;
