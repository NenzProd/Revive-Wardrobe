import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Newsletter from '../components/Newsletter'
import { Heart } from 'lucide-react'
import ProductCard from '../components/ProductCard'
import { useCartStore } from '../stores/useCartStore'
import SEO from '../components/SEO'

const Wishlist = () => {
  const wishlist = useCartStore(state => state.wishlist)
  const setWishlist = useCartStore.setState

  const handleRemove = (productId: string) => {
    setWishlist(state => ({
      ...state,
      wishlist: state.wishlist.filter(item => item._id !== productId)
    }))
  }

  return (
    <div className="min-h-screen bg-white flex flex-col pb-[70px] md:pb-0">
      <SEO 
        title="My Wishlist - Saved Items"
        description="View your saved fashion items at Revive Wardrobe. Keep track of your favorite products and add them to cart when ready."
        keywords="wishlist, saved items, favorite products, fashion wishlist, buy clothes online dubai, online fashion store uae, dubai clothing store, modest fashion dubai, shein dubai uae online, online clothes shopping uae, abaya online uae, zara uae online, shein online shopping dubai, matalan uae online, order clothes online dubai, best abaya shops in Dubai, Dubai abaya online worldwide shipping, abaya shop Dubai online, luxury abaya Dubai online"
        canonical="/wishlist"
      />
      <Navbar />
      <div className="container mx-auto px-4 py-8 flex-grow">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-serif mb-4">My Wishlist</h1>
          <div className="w-24 h-1 bg-revive-red mx-auto mb-6"></div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Items you've saved for later. Add them to your cart when you're ready to purchase.
          </p>
        </div>
        {/* Wishlist Content */}
        {wishlist.length === 0 ? (
          <div className="text-center py-16 flex flex-col items-center">
            <Heart size={64} className="text-gray-300 mb-4" />
            <p className="text-xl text-gray-500 mb-2">Your wishlist is empty</p>
            <p className="text-gray-400 mb-6">Add items you love to your wishlist. Review them anytime and easily move them to your cart.</p>
            <a 
              href="/shop"
              className="bg-revive-red hover:bg-red-700 text-white font-bold py-3 px-6 rounded-full transition-colors duration-300"
            >
              Continue Shopping
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {wishlist.map(product => (
              <div key={product._id} className="relative">
                <ProductCard product={product} />
                <button
                  className="absolute top-2 right-2 p-2 bg-white rounded-full shadow hover:bg-gray-100 transition-colors z-10"
                  aria-label="Remove from wishlist"
                  onClick={() => handleRemove(product._id)}
                >
                  <Heart size={18} fill="#ef4444" className="text-red-500" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      <Newsletter />
      <Footer />
    </div>
  )
}

export default Wishlist
