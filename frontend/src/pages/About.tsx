import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Newsletter from '../components/Newsletter'

function About () {
  return (
    <div className='min-h-screen bg-white flex flex-col pt-[64px] md:pt-[88px] pb-[70px] md:pb-0'>
      <Navbar />
      <div className='container mx-auto px-4 py-8 flex-grow'>
        <div className='max-w-3xl mx-auto bg-white rounded-lg shadow-sm border p-8'>
          <h1 className='text-3xl md:text-4xl font-serif mb-6 text-center'>About Us</h1>
          <div className='w-24 h-1 bg-revive-red mx-auto mb-8'></div>
          <div className='prose max-w-none text-gray-700 text-lg'>
            <p className='mb-4'>
              Revive Wardrobe is a fashion-forward brand born in the UAE, where timeless tradition meets bold innovation. Our collections reflect a deep appreciation for elegance, cultural identity, and contemporary lifestyles.
            </p>
            <p className='mb-4'>
              Founded with a passion for inclusivity and conscious living, Revive Wardrobe is more than just a brand – it's a movement toward affordable, eco-conscious fashion that feels as good as it looks. Every piece is handpicked with care to ensure style, quality, and lasting value.
            </p>
            <p className='mb-4'>
              At Revive Wardrobe, we believe fashion is not just about clothing — it's a reflection of identity, intimacy, and expression. We believe style is personal, expressive, and ever-evolving. Whether you're dressing for celebration or connection, our diverse collections ensure you feel beautiful, confident, and truly seen.
            </p>
            <p>
              We invite you to explore a wardrobe that blends elegance, ease, and a touch of conscious luxury.
            </p>
            <p className='mt-8 font-semibold text-center'>
              Revive tradition. Celebrate intimacy. Redefine fashion.
            </p>
          </div>
        </div>
      </div>
      <Newsletter />
      <Footer />
    </div>
  )
}

export default About
