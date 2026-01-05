import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useProductList } from '../hooks/useProduct';
import { priceSymbol } from '../config/constants';
import { Skeleton } from '@/components/ui/skeleton';
import { useCartStore } from '../stores/useCartStore';

const SignatureAbayas = () => {
  const { toast } = useToast();
  const { products, loading, error } = useProductList();
  // Filter logic remains same, or updated if specific category needed. 
  // Assuming 'bestseller' covers valid items for this section.
  const gracefulAbayas = products.filter((p: any) => p.bestseller === true).slice(0, 4); // Limit to 4 if needed, or keeping existing logic

  if (loading) {
    return (
        <div className="container mx-auto px-4 py-16">
            <div className="flex flex-wrap justify-center -mx-4 gap-y-8">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="w-full md:w-1/2 lg:w-1/4 px-4">
                        <Skeleton className="h-[500px] w-full rounded-3xl" />
                    </div>
                ))}
            </div>
        </div>
    )
  }

  if (error) return null;

  return (
    <section className="py-24 bg-[#F8F8F8]"> {/* Light grey/off-white background */}
      <div className="container mx-auto px-4">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif text-gray-900 mb-4 tracking-tight">
            Our Signature Abayas
          </h2>
          <p className="text-gray-600 text-lg">
            Thoughtfully crafted abayas<br className="md:hidden" /> for modern modest wear.
          </p>
        </div>

        {/* Product Grid */}
        <div className="flex flex-wrap justify-center -mx-3 md:-mx-4 mb-16">
          {gracefulAbayas.map((product: any) => (
            <div key={product._id} className="w-full sm:w-1/2 lg:w-1/4 px-3 md:px-4 mb-8">
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {/* Explore Button */}
        <div className="text-center">
            <Link to="/shop/category/abayas">
                <Button className="bg-[#8B0000] hover:bg-[#660000] text-white px-8 py-6 text-base rounded-md">
                    Explore Abayas
                </Button>
            </Link>
        </div>

      </div>
    </section>
  );
};

interface ProductCardProps {
  product: any;
}

const ProductCard = ({ product }: ProductCardProps) => {
  
  const getProductImage = (product: any) => {
    if (Array.isArray(product.image) && product.image.length > 0) return product.image[0]
    if (typeof product.image === 'string') return product.image
    return '/placeholder.png'
  }

  return (
    <div className="group flex flex-col">
      {/* Image Container with rounded top corners */}
      <div className="relative aspect-[3/4] overflow-hidden rounded-t-[2.5rem] bg-gray-100">
        <Link to={`/product/${product.slug}`}>
            <img 
              src={getProductImage(product)} 
              alt={product.name}
              className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
            />
        </Link>
      </div>
      
      {/* Content Container with rounded bottom corners */}
      <div className="bg-white p-6 rounded-b-[2.5rem] shadow-sm flex flex-col justify-between flex-1 relative -mt-4 z-10">
         <div>
            <Link to={`/product/${product.slug}`}>
                <h3 className="text-xl font-serif text-gray-900 mb-2 group-hover:text-[#8B0000] transition-colors leading-tight">
                    {product.name}
                </h3>
            </Link>
         </div>
         
         <div className="flex items-center justify-between mt-2">
            <div>
                 {product.isSale && product.salePrice ? (
                    <div className="flex items-center gap-2">
                      <span className="text-[#8B0000] font-bold text-lg">{priceSymbol} {product.salePrice}</span>
                      <span className="text-gray-400 text-sm line-through">{priceSymbol} {product.price}</span>
                    </div>
                  ) : (
                    <span className="text-[#8B0000] font-bold text-lg">{priceSymbol} {product.price}</span>
                  )}
            </div>
            
            <div className="text-gray-500 text-sm">
                Size : L
            </div>
         </div>
      </div>
    </div>
  );
};

export default SignatureAbayas;
