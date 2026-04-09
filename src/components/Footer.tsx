'use client'

import React from "react"
import { Globe, Share2 } from "lucide-react"

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1">
            <h3 className="text-2xl font-serif mb-4">Abaya Elegance</h3>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Premium abayas crafted with tradition and modern sophistication. 
              Celebrating modest fashion since 2020.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors">
                <Globe size={18} />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors">
                <Share2 size={18} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider">Shop</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><a href="/shop" className="hover:text-white transition-colors">All Abayas</a></li>
              <li><a href="/shop/classic" className="hover:text-white transition-colors">Classic Abayas</a></li>
              <li><a href="/shop/embroidered" className="hover:text-white transition-colors">Embroidered</a></li>
              <li><a href="/shop/jalabiyas" className="hover:text-white transition-colors">Jalabiyas</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider">Help</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><a href="/contact" className="hover:text-white transition-colors">Contact Us</a></li>
              <li><a href="/shipping" className="hover:text-white transition-colors">Shipping Info</a></li>
              <li><a href="/returns" className="hover:text-white transition-colors">Returns</a></li>
              <li><a href="/faq" className="hover:text-white transition-colors">FAQ</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider">Company</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><a href="/about" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="/terms" className="hover:text-white transition-colors">Terms</a></li>
              <li><a href="/privacy" className="hover:text-white transition-colors">Privacy</a></li>
              <li><a href="/blog" className="hover:text-white transition-colors">Blog</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-400">
            © {currentYear} Abaya Elegance. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <img src="https://via.placeholder.com/40x25/333/fff?text=VISA" alt="Visa" className="h-6" />
            <img src="https://via.placeholder.com/40x25/333/fff?text=MC" alt="Mastercard" className="h-6" />
            <img src="https://via.placeholder.com/40x25/333/fff?text=AMEX" alt="Amex" className="h-6" />
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer