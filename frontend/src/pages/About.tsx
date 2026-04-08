import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Newsletter from '../components/Newsletter'
import SEO from '../components/SEO'
import { PRIMARY_BUTTON_CLASS, SECONDARY_BUTTON_CLASS } from '@/lib/buttonStyles'

function About () {
  return (
    <div className='min-h-screen bg-[#faf6f0] flex flex-col pb-[70px] md:pb-0'>
      <SEO 
        title="About Us - Our Story & Mission"
        description="Learn about Revive Wardrobe - A fashion-forward brand born in the UAE, blending timeless tradition with bold innovation. Discover our commitment to affordable, eco-conscious fashion."
        keywords="about revive wardrobe, fashion brand UAE, eco-conscious fashion, sustainable clothing, our story, buy clothes online dubai, online fashion store uae, dubai clothing store, modest fashion dubai, shein dubai uae online, online clothes shopping uae, abaya online uae, zara uae online, shein online shopping dubai, matalan uae online, order clothes online dubai, best abaya shops in Dubai, Dubai abaya online worldwide shipping, abaya shop Dubai online, luxury abaya Dubai online"
        canonical="/about"
      />
      <Navbar />
      <div className='container mx-auto px-4 py-10 flex-grow'>
        <div className='max-w-5xl mx-auto rounded-3xl border border-[#7b4d2e]/15 bg-white shadow-[0_24px_55px_rgba(48,33,24,0.1)] overflow-hidden'>
          <div className='grid md:grid-cols-[1.2fr_1fr] gap-0'>
            <div className='p-8 md:p-12'>
              <p className='text-xs uppercase tracking-[0.2em] text-[#7b4d2e] font-semibold'>Our Story</p>
              <h1 className='mt-3 text-4xl md:text-5xl font-serif text-[#2d1c15] leading-tight'>Tradition, Revived for Modern Elegance</h1>
              <div className='w-24 h-1 bg-revive-red mt-6'></div>

              <div className='mt-7 space-y-4 text-[#5b463a] leading-relaxed'>
                <p>
                  Revive Wardrobe is a fashion-forward house born in the UAE, where timeless modest dressing meets refined contemporary design.
                </p>
                <p>
                  We create with intention: premium drape, elegant detailing, and silhouettes that let you feel powerful without compromising comfort.
                </p>
                <p>
                  From daily sophistication to celebration looks, each piece is chosen to help you feel confident, graceful, and deeply yourself.
                </p>
              </div>

              <div className='mt-8 flex flex-wrap gap-3'>
                <a href='/shop/category/graceful-abayas' className={`${PRIMARY_BUTTON_CLASS} inline-flex items-center rounded-md px-5 py-3 text-sm font-medium`}>
                  Shop Abayas
                </a>
                <a href='/blog' className={`${SECONDARY_BUTTON_CLASS} inline-flex items-center rounded-md px-5 py-3 text-sm font-medium`}>
                  Read Our Journal
                </a>
              </div>
            </div>

            <div className='relative min-h-[320px] md:min-h-full'>
              <img
                src='https://res.cloudinary.com/dia8x6y6u/image/upload/v1766769973/duag2mafgf57xjzxl28k.jpg'
                alt='Revive Wardrobe story'
                className='absolute inset-0 w-full h-full object-cover'
              />
              <div className='absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent' />
              <div className='absolute bottom-6 left-6 right-6 rounded-xl border border-white/25 bg-white/10 backdrop-blur-sm p-4 text-white'>
                <p className='font-serif text-lg'>Revive tradition. Celebrate identity. Redefine fashion.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Newsletter />
      <Footer />
    </div>
  )
}

export default About
