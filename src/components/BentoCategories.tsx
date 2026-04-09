'use client'

import React from "react"
import { ArrowRight } from "lucide-react"

const BentoCategories = () => {
  const categories = [
    {
      id: 1,
      title: "Classic Abayas",
      description: "Timeless elegance for everyday wear",
      image: "https://images.unsplash.com/photo-1590075865003-e48277faa558?w=600&h=800&fit=crop",
      link: "/shop/classic-abayas",
      large: true,
    },
    {
      id: 2,
      title: "Embroidered Abayas",
      description: "Intricate details for special occasions",
      image: "https://images.unsplash.com/photo-1583001931096-959e9a1a6223?w=600&h=400&fit=crop",
      link: "/shop/embroidered",
    },
    {
      id: 3,
      title: "Open Abayas",
      description: "Modern style with versatile layering",
      image: "https://images.unsplash.com/photo-1583744946564-b52ac1c389c8?w=600&h=400&fit=crop",
      link: "/shop/open-abayas",
    },
    {
      id: 4,
      title: "Jalabiyas",
      description: "Traditional elegance reimagined",
      image: "https://images.unsplash.com/photo-1590075865003-e48277faa558?w=600&h=400&fit=crop",
      link: "/shop/jalabiyas",
    },
    {
      id: 5,
      title: "View All",
      description: "Explore our complete collection",
      image: "",
      link: "/shop",
      isButton: true,
    },
  ]

  return (
    <section className="py-12 md:py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="mb-8 md:mb-12 text-center">
          <h2 className="text-2xl md:text-5xl font-serif text-gray-900 mb-4 tracking-tight">
            Our Collection
          </h2>
          <p className="text-gray-600 text-sm md:text-base max-w-2xl mx-auto">
            Explore our carefully curated selection of premium abayas
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 max-w-6xl mx-auto">
          {categories.map((category) => (
            <div
              key={category.id}
              className={`relative group overflow-hidden rounded-3xl cursor-pointer ${
                category.large 
                  ? "md:col-span-2 md:row-span-2 h-[300px] md:h-auto" 
                  : "h-[250px] md:h-[200px]"
              }`}
            >
              {category.isButton ? (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
                  <button className="bg-red-600 text-white px-6 py-4 rounded-lg text-sm tracking-[0.14em] uppercase font-medium hover:bg-red-700 transition-all hover:scale-105 flex items-center gap-2">
                    View All <ArrowRight size={16} />
                  </button>
                </div>
              ) : (
                <>
                  <img
                    src={category.image}
                    alt={category.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
                  <div className="absolute bottom-0 left-0 p-4 md:p-6 text-white">
                    <h3 className="text-xl md:text-2xl font-serif mb-2">{category.title}</h3>
                    <p className="text-white/80 text-sm hidden md:block">{category.description}</p>
                    <button className="mt-3 bg-white/20 backdrop-blur-sm px-4 py-2 rounded text-xs tracking-[0.14em] uppercase hover:bg-white/30 transition-colors hidden md:block">
                      Shop Now
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default BentoCategories