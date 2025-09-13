import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import React from 'react'

function Terms () {
  return (
    <div className="min-h-screen bg-white flex flex-col pb-[70px] md:pb-0">
      <Navbar />
      <div className="container mx-auto px-4 py-8 flex-grow">
        <h1 className="text-3xl md:text-4xl font-serif mb-4 text-center">Terms & Conditions</h1>
        <div className="prose max-w-none text-gray-700 mx-auto">
          <h2 id="section1" className="text-xl font-bold mt-8 mb-2">1. Company Ownership</h2>
          <p>"Revive Wardrobe FZ-LLC" maintains the www.revivewardrobe.com website ("Site").</p>
          <h2 id="section2" className="text-xl font-bold mt-8 mb-2">2. Governing Law</h2>
          <p>The United Arab Emirates is our country of domicile.</p>
          <p>Any purchase, dispute, or claim will be governed by UAE local laws.</p>
          <h2 id="section3" className="text-xl font-bold mt-8 mb-2">3. Age Restriction</h2>
          <p>Users under 18 years of age shall not register or transact on the site.</p>
          <h2 id="section4" className="text-xl font-bold mt-8 mb-2">4. Sanctioned Countries</h2>
          <p>We will not trade with or provide any services to OFAC and sanctioned countries.</p>
          <h2 id="section5" className="text-xl font-bold mt-8 mb-2">5. Payments & Cardholder Agreement</h2>
          <ul className="list-disc ml-6">
            <li>Visa and MasterCard (debit/credit in AED) are accepted.</li>
            <li>The displayed price and currency at checkout will be the same as on the receipt.</li>
            <li>Cardholder must retain a copy of transaction records and site policies.</li>
            <li>The user is responsible for maintaining their account confidentiality.</li>
          </ul>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default Terms