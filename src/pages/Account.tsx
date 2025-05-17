
import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Newsletter from '../components/Newsletter';
import { User, Package, Heart, Settings, LogOut, MapPin } from 'lucide-react';

const Account = () => {
  const [activeTab, setActiveTab] = useState('orders');
  
  const tabs = [
    { id: 'orders', name: 'My Orders', icon: Package },
    { id: 'wishlist', name: 'Wishlist', icon: Heart },
    { id: 'addresses', name: 'Addresses', icon: MapPin },
    { id: 'settings', name: 'Account Settings', icon: Settings }
  ];
  
  return (
    <div className="min-h-screen bg-white flex flex-col pt-[64px] md:pt-[88px] pb-[70px] md:pb-0">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 flex-grow">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-serif mb-4">My Account</h1>
          <div className="w-24 h-1 bg-revive-red mx-auto mb-6"></div>
        </div>
        
        <div className="flex flex-col md:flex-row gap-8 max-w-6xl mx-auto">
          {/* Sidebar */}
          <div className="md:w-1/4">
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm mb-6">
              <div className="flex items-center space-x-4 mb-6">
                <div className="bg-revive-red rounded-full p-2">
                  <User className="text-white" size={24} />
                </div>
                <div>
                  <p className="font-medium">Sarah Johnson</p>
                  <p className="text-gray-500 text-sm">sarah.j@example.com</p>
                </div>
              </div>
            </div>
            
            <nav>
              <ul className="space-y-1">
                {tabs.map(tab => (
                  <li key={tab.id}>
                    <button
                      className={`w-full flex items-center space-x-2 px-4 py-3 rounded-lg text-left ${
                        activeTab === tab.id 
                          ? 'bg-revive-red text-white' 
                          : 'hover:bg-gray-100 text-gray-700'
                      }`}
                      onClick={() => setActiveTab(tab.id)}
                    >
                      <tab.icon size={18} />
                      <span>{tab.name}</span>
                    </button>
                  </li>
                ))}
                <li>
                  <button
                    className="w-full flex items-center space-x-2 px-4 py-3 rounded-lg text-left hover:bg-gray-100 text-gray-700"
                  >
                    <LogOut size={18} />
                    <span>Logout</span>
                  </button>
                </li>
              </ul>
            </nav>
          </div>
          
          {/* Content Area */}
          <div className="md:w-3/4 bg-white rounded-lg shadow-sm p-6">
            {activeTab === 'orders' && (
              <div>
                <h2 className="text-xl font-semibold mb-4">My Orders</h2>
                <div className="border rounded-lg overflow-hidden">
                  <div className="p-8 text-center">
                    <Package className="mx-auto text-gray-300 mb-4" size={48} />
                    <p className="text-lg text-gray-500">No orders yet</p>
                    <p className="text-gray-400 mt-1">When you place orders, they will appear here</p>
                    <a 
                      href="/shop"
                      className="mt-4 inline-block bg-revive-red hover:bg-red-700 text-white font-bold py-2 px-6 rounded-full transition-colors duration-300"
                    >
                      Start Shopping
                    </a>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'wishlist' && (
              <div>
                <h2 className="text-xl font-semibold mb-4">My Wishlist</h2>
                <p className="text-gray-500">
                  View and manage your wishlist items. <a href="/wishlist" className="text-revive-red hover:underline">Go to Wishlist</a>
                </p>
              </div>
            )}
            
            {activeTab === 'addresses' && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Saved Addresses</h2>
                <div className="border rounded-lg p-6 text-center">
                  <MapPin className="mx-auto text-gray-300 mb-4" size={48} />
                  <p className="text-gray-500">No addresses saved yet</p>
                  <button 
                    className="mt-4 bg-revive-red hover:bg-red-700 text-white font-bold py-2 px-6 rounded-full transition-colors duration-300"
                  >
                    Add New Address
                  </button>
                </div>
              </div>
            )}
            
            {activeTab === 'settings' && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Account Settings</h2>
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input 
                      type="text" 
                      defaultValue="Sarah Johnson"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input 
                      type="email" 
                      defaultValue="sarah.j@example.com"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <input 
                      type="password" 
                      value="••••••••"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      readOnly
                    />
                    <button type="button" className="mt-1 text-sm text-revive-red hover:underline">
                      Change Password
                    </button>
                  </div>
                  <div className="pt-4">
                    <button 
                      type="button"
                      className="bg-revive-red hover:bg-red-700 text-white font-bold py-2 px-6 rounded-full transition-colors duration-300"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <Newsletter />
      <Footer />
    </div>
  );
};

export default Account;
