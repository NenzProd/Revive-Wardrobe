'use client'

import React from "react"
import { Scissors, Award, Truck } from "lucide-react"

const AboutSection = () => {
  const features = [
    {
      icon: Scissors,
      title: "Handcrafted Quality",
      description: "Each abaya is meticulously crafted by skilled artisans with attention to every detail.",
    },
    {
      icon: Award,
      title: "Premium Fabrics",
      description: "We source only the finest fabrics from trusted suppliers to ensure comfort and elegance.",
    },
    {
      icon: Truck,
      title: "Worldwide Shipping",
      description: "Fast and reliable shipping to UAE, GCC, and worldwide destinations.",
    },
  ]

  return (
    <section className="py-12 md:py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center max-w-6xl mx-auto">
          <div>
            <img
              src="https://images.unsplash.com/photo-1612832879763-d2fd29f7368b?w=600&h=700&fit=crop"
              alt="Abaya craftsmanship"
              className="rounded-3xl w-full h-auto object-cover"
            />
          </div>
          
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl md:text-4xl font-serif text-gray-900 mb-4 tracking-tight">
                Crafted with Love & Tradition
              </h2>
              <p className="text-gray-600 leading-relaxed">
                At our core, we believe every woman deserves to feel elegant and confident. 
                Our abayas combine centuries of craftsmanship tradition with modern sophistication, 
                creating pieces that are both timeless and contemporary.
              </p>
            </div>

            <div className="grid gap-6">
              {features.map((feature) => (
                <div key={feature.title} className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center">
                    <feature.icon size={24} className="text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">{feature.title}</h3>
                    <p className="text-sm text-gray-600">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <a
              href="/about"
              className="inline-block border-2 border-gray-900 text-gray-900 px-6 py-3 rounded-lg text-sm tracking-[0.14em] uppercase font-medium hover:bg-gray-900 hover:text-white transition-all"
            >
              Learn More About Us
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AboutSection