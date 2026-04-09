'use client'

import React from "react"
import { Star } from "lucide-react"

const FeaturedProducts = () => {
  const products = [
    {
      id: 1,
      name: "Midnight Elegance Abaya",
      price: 450,
      originalPrice: 560,
      rating: 4.8,
      reviews: 124,
      image: "https://images.unsplash.com/photo-1590075865003-e48277faa558?w=400&h=500&fit=crop",
      badge: "20% Off",
    },
    {
      id: 2,
      name: "Royal Embroidered Abaya",
      price: 680,
      originalPrice: 850,
      rating: 4.9,
      reviews: 89,
      image: "https://images.unsplash.com/photo-1583001931096-959e9a1a6223?w=400&h=500&fit=crop",
      badge: "Bestseller",
    },
    {
      id: 3,
      name: "Silk Flow Abaya",
      price: 520,
      originalPrice: 650,
      rating: 4.7,
      reviews: 156,
      image: "https://images.unsplash.com/photo-1583744946564-b52ac1c389c8?w=400&h=500&fit=crop",
      badge: "20% Off",
    },
    {
      id: 4,
      name: "Classic Black Abaya",
      price: 320,
      originalPrice: 400,
      rating: 4.6,
      reviews: 203,
      image: "https://images.unsplash.com/photo-1590075865003-e48277faa558?w=400&h=500&fit=crop",
      badge: "20% Off",
    },
  ]

  return (
    <section className="py-12 md:py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="mb-8 md:mb-12 text-center">
          <h2 className="text-2xl md:text-5xl font-serif text-gray-900 mb-4 tracking-tight">
            Featured Abayas
          </h2>
          <p className="text-gray-600 text-sm md:text-base max-w-2xl mx-auto">
            Shop our most loved pieces with special 20% discount
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-6xl mx-auto">
          {products.map((product) => (
            <div
              key={product.id}
              className="group cursor-pointer"
            >
              <div className="relative overflow-hidden rounded-2xl bg-gray-100 aspect-[3/4] mb-4">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-3 left-3">
                  <span className="bg-red-600 text-white text-xs px-3 py-1 rounded-full font-medium">
                    {product.badge}
                  </span>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-1">
                  <Star size={14} className="text-yellow-500 fill-yellow-500" />
                  <span className="text-sm text-gray-600">{product.rating}</span>
                  <span className="text-sm text-gray-400">({product.reviews})</span>
                </div>
                
                <h3 className="text-sm md:text-base font-medium text-gray-900 group-hover:text-red-600 transition-colors">
                  {product.name}
                </h3>
                
                <div className="flex items-center gap-2">
                  <span className="text-lg font-semibold text-gray-900">
                    AED {product.price}
                  </span>
                  <span className="text-sm text-gray-400 line-through">
                    AED {product.originalPrice}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <a
            href="/shop"
            className="inline-block bg-gray-900 text-white px-8 py-4 rounded-lg text-sm tracking-[0.14em] uppercase font-medium hover:bg-gray-800 transition-all"
          >
            View All Products
          </a>
        </div>
      </div>
    </section>
  )
}

export default FeaturedProducts