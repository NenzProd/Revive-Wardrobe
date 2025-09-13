import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

function Returns () {
  return (
    <div className="min-h-screen bg-white flex flex-col pb-[70px] md:pb-0">
      <Navbar />
      <div className="container mx-auto px-4 py-8 flex-grow">
        <h1 className="text-3xl md:text-4xl font-serif mb-4 text-center">Returns, Refunds & Cancellation Policy</h1>
        <div className="prose max-w-none text-gray-700 mx-auto">
          <h2 id="section1" className="text-xl font-bold mt-8 mb-2">1. Return Policy</h2>
          <ul className="list-disc ml-6">
            <li>Returns accepted within 3 days for unopened, sealed, wrong and damaged products.</li>
            <li>Notify us, return using a registered courier, and include original packaging.</li>
            <li>Items used/tampered with will not be accepted.</li>
            <li>Shipping & handling fees are non-refundable.</li>
          </ul>
          <h2 id="section2" className="text-xl font-bold mt-8 mb-2">2. Refund Policy</h2>
          <ul className="list-disc ml-6">
            <li>Refunds done through the original mode of payment.</li>
            <li>Refunds processed within 10–45 days depending on the issuing bank.</li>
          </ul>
          <h2 id="section3" className="text-xl font-bold mt-8 mb-2">3. Cancellation Policy</h2>
          <ul className="list-disc ml-6">
            <li>Orders can be canceled within 24 hours of placement.</li>
            <li>Refunds go back to the original payment method.</li>
            <li>Processing time: up to 45 days.</li>
          </ul>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default Returns