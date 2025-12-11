import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import SEO from '@/components/SEO'

function Shipping() {
  return (
    <div className="min-h-screen bg-white flex flex-col pb-[70px] md:pb-0">
      <SEO 
        title="Shipping & Delivery Policy - Fast Delivery"
        description="Learn about Revive Wardrobe's shipping and delivery policy. UAE delivery in 1-3 days, international shipping available. Flat AED 20 shipping within UAE."
        keywords="shipping policy, delivery, UAE shipping, international delivery, shipping fees, buy clothes online dubai, online fashion store uae, dubai clothing store, modest fashion dubai, shein dubai uae online, online clothes shopping uae, abaya online uae, zara uae online, shein online shopping dubai, matalan uae online, order clothes online dubai, best abaya shops in Dubai, Dubai abaya online worldwide shipping, abaya shop Dubai online, luxury abaya Dubai online"
        canonical="/shipping"
      />
      <Navbar />
      <div className="container mx-auto px-4 py-8 flex-grow">
        <h1 className="text-3xl md:text-4xl font-serif mb-4 text-center">Shipping, Delivery & Payment Policies</h1>
        <div className="prose max-w-none text-gray-700 mx-auto">
          <h2 id="section1" className="text-xl font-bold mt-8 mb-2">1. Delivery Locations</h2>
          <p>We deliver within UAE and to other countries via third-party couriers.</p>
          <h2 id="section2" className="text-xl font-bold mt-8 mb-2">2. Delivery Timeline</h2>
          <ul className="list-disc ml-6">
            <li>UAE: 1–3 working days</li>
            <li>International: 4–10 working days</li>
          </ul>
          <h2 id="section3" className="text-xl font-bold mt-8 mb-2">3. Delivery Fees</h2>
          <ul className="list-disc ml-6">
            <li>UAE: Flat AED 20</li>
            <li>International: Shown at checkout based on location</li>
          </ul>
          <h2 id="section4" className="text-xl font-bold mt-8 mb-2">4. Delivery Proof</h2>
          <p>Customer must sign and confirm the delivery receipt as proof.</p>
          <h2 id="section5" className="text-xl font-bold mt-8 mb-2">5. Multiple Shipments</h2>
          <p>Multiple orders/shipments may result in multiple charges on the cardholder's statement.</p>
          <h2 id="section6" className="text-xl font-bold mt-8 mb-2">6. Payment Confirmation</h2>
          <p>A confirmation notice will be sent to the customer via email within 24 hours of payment.</p>
          <h2 id="section7" className="text-xl font-bold mt-8 mb-2">7. Pricing & Currency</h2>
          <p>Prices and currencies at checkout are final and charged in AED.</p>
          <p>Sanctioned countries such as Iran, Cuba, North Korea, Sudan, Syria, etc., are restricted from checkout.</p>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default Shipping