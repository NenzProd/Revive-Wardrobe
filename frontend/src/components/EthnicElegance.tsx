import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { priceSymbol } from '../config/constants'
import { useProductList } from '../hooks/useProduct'
import { Skeleton } from '@/components/ui/skeleton'
import { Product } from '../types/product'

const EthnicElegance = () => {
  const { products, loading, error } = useProductList();
  const ethnicProducts = products.filter((product) => product.category === 'Ethnic Elegance').slice(0, 2);

  if (loading) return (
      <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Skeleton className="h-[600px] w-full rounded-xl" />
              <Skeleton className="h-[600px] w-full rounded-xl" />
          </div>
      </div>
  );
  if (error) return null;

  return (
    <section className="py-24 bg-[#EAE5D9]">
      <div className="container mx-auto px-4">
        
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif text-gray-900 tracking-tight leading-tight">
            Ethnic Elegance<br />
            designed for you
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 max-w-4xl mx-auto">
          {ethnicProducts.map((product: any) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>

        <div className="text-center">
            <Link to="/shop">
                <Button className="bg-[#8B0000] hover:bg-[#660000] text-white px-8 py-6 text-base rounded-md font-medium">
                    Explore the Elegance
                </Button>
            </Link>
        </div>

      </div>
    </section>
  )
}

const ProductCard = ({ product }: { product: Product }) => {
  const { name, slug, image, variants } = product;
  const price = variants?.[0]?.retail_price || product.price || 0;
  
  const getProductImage = (product: Product) => {
    if (Array.isArray(product.image) && product.image.length > 0) return product.image[0]
    if (typeof product.image === 'string') return product.image
    return '/placeholder.png'
  }

  return (
    <div className="group flex flex-col">
       <div className="relative aspect-[3/4] overflow-hidden rounded-t-[2.5rem] bg-gray-200">
         <Link to={`/product/${slug}`}>
             <img 
               src={getProductImage(product)} 
               alt={name}
               className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
             />
         </Link>
       </div>
       
       <div className="bg-white p-6 rounded-b-[2.5rem] shadow-sm flex flex-col justify-between relative -mt-4 z-10">
          <div>
            <Link to={`/product/${slug}`}>
                <h3 className="text-2xl font-serif text-gray-900 mb-2 leading-tight group-hover:text-[#8B0000] transition-colors">
                    {name}
                </h3>
            </Link>
          </div>
          
          <div className="flex items-center justify-between mt-2">
             <span className="text-[#8B0000] font-bold text-lg">
                {priceSymbol} {price}
             </span>
             <span className="text-gray-500 text-sm">
                Size : L
             </span>
          </div>
       </div>
    </div>
  )
}

export default EthnicElegance
