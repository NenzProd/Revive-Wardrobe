import React from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

function Privacy () {
  return (
    <div className="min-h-screen bg-white flex flex-col pt-[64px] md:pt-[88px] pb-[70px] md:pb-0">
      <Navbar />
      <div className="container mx-auto px-4 py-8 flex-grow">
        <h1 className="text-3xl md:text-4xl font-serif mb-4 text-center">Privacy & Cookie Policy</h1>
        
        <div className="prose max-w-none text-gray-700 mx-auto">
          <h2 id="section1" className="text-xl font-bold mt-8 mb-2">1. Data Protection</h2>
          <p>All credit/debit card and personal data will NOT be stored, sold, shared, rented, or leased to any third parties.</p>
          <h2 id="section2" className="text-xl font-bold mt-8 mb-2">2. Card Information Security</h2>
          <p>www.revivewardrobe.com will not pass any debit/credit card details to third parties.</p>
          <h2 id="section3" className="text-xl font-bold mt-8 mb-2">3. Privacy Assurance</h2>
          <p>We take appropriate steps to ensure data security using hardware and software solutions.</p>
          <p>However, we cannot guarantee 100% security of disclosed information online.</p>
          <h2 id="section4" className="text-xl font-bold mt-8 mb-2">4. Third-Party Links</h2>
          <p>We're not responsible for the privacy policies of third-party websites linked from ours.</p>
          <h2 id="section5" className="text-xl font-bold mt-8 mb-2">5. Policy Updates</h2>
          <p>Policies and Terms may be updated. Customers are advised to check frequently.</p>
          <h2 id="section6" className="text-xl font-bold mt-8 mb-2">6. Cookie Policy</h2>
          <p>We use cookies to enhance browsing experience and personalize content.</p>
          <p>You can control cookie preferences via browser settings.</p>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default Privacy 