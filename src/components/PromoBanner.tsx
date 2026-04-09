'use client'

import React from "react"
import { Sparkles } from "lucide-react"

const PromoBanner = () => {
  return (
    <section className="bg-gradient-to-r from-red-600 to-red-700 py-8 md:py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 text-center">
          <div className="flex items-center gap-2 text-white">
            <Sparkles size={24} className="fill-white" />
            <span className="text-2xl md:text-3xl font-bold">20% OFF</span>
          </div>
          
          <div className="text-white">
            <p className="text-lg md:text-xl font-medium">
              Use code <span className="font-bold">ABAYA20</span> at checkout
            </p>
            <p className="text-sm text-white/80 mt-1">
              Valid on all abayas • Limited time only
            </p>
          </div>
          
          <a
            href="/shop"
            className="bg-white text-red-600 px-6 py-3 rounded-lg text-sm tracking-[0.14em] uppercase font-semibold hover:bg-gray-100 transition-colors"
          >
            Shop Now
          </a>
        </div>
      </div>
    </section>
  )
}

export default PromoBanner