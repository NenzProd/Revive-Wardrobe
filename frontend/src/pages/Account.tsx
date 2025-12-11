import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Newsletter from '../components/Newsletter';
import { User, Package, Heart, Settings, LogOut, MapPin, Pencil, Trash2 } from 'lucide-react';
import { useCartStore } from '../stores/useCartStore';
import axios from 'axios';
import { useToast } from '@/hooks/use-toast';
import SEO from '../components/SEO';

const Account = () => {
  const [activeTab, setActiveTab] = useState('orders');
  const [addresses, setAddresses] = useState([]);
  const [primaryAddress, setPrimaryAddress] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressForm, setAddressForm] = useState({
    first_name: '',
    last_name: '',
    address: '',
    country: '',
    postcode: '',
    state: '',
    city: '',
    landmark: '',
    email: '',
    phone: ''
  });
  const [isSavingAddress, setIsSavingAddress] = useState(false);
  const [settingPrimaryIdx, setSettingPrimaryIdx] = useState(-1);
  const [editAddressIdx, setEditAddressIdx] = useState(-1);
  const [removingIdx, setRemovingIdx] = useState(-1);
  const token = useCartStore(state => state.token);
  const user = useCartStore(state => state.user);
  const fetchUser = useCartStore(state => state.fetchUser);
  const logout = useCartStore(state => state.logout);
  const backendUrl = useCartStore(state => state.backendUrl);
  const navigate = useNavigate();
  const [settingsForm, setSettingsForm] = useState({ name: '', email: '', phone: '' })
  const [settingsError, setSettingsError] = useState('')
  const [settingsSuccess, setSettingsSuccess] = useState('')
  const [isSavingSettings, setIsSavingSettings] = useState(false)
  const [showChangePassword, setShowChangePassword] = useState(false)
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '' })
  const [passwordError, setPasswordError] = useState('')
  const [passwordSuccess, setPasswordSuccess] = useState('')
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const { toast } = useToast()
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [orderSortBy, setOrderSortBy] = useState('newest'); // newest, oldest, status, amount
  const [filteredOrders, setFilteredOrders] = useState([]);

  // Sort orders based on selected criteria
  const sortOrders = (ordersList, sortBy) => {
    const sorted = [...ordersList].sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'oldest':
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case 'status':
          return a.status.localeCompare(b.status);
        case 'amount-high':
          const amountA = a.line_items ? a.line_items.reduce((sum, item) => sum + (parseFloat(item.price) || 0), 0) : 0;
          const amountB = b.line_items ? b.line_items.reduce((sum, item) => sum + (parseFloat(item.price) || 0), 0) : 0;
          return amountB - amountA;
        case 'amount-low':
          const amountA2 = a.line_items ? a.line_items.reduce((sum, item) => sum + (parseFloat(item.price) || 0), 0) : 0;
          const amountB2 = b.line_items ? b.line_items.reduce((sum, item) => sum + (parseFloat(item.price) || 0), 0) : 0;
          return amountA2 - amountB2;
        default:
          return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
    });
    return sorted;
  };

  // Update filtered orders when orders or sort option changes
  useEffect(() => {
    if (orders.length > 0) {
      const sorted = sortOrders(orders, orderSortBy);
      setFilteredOrders(sorted);
    }
  }, [orders, orderSortBy]);

  const handleSortChange = (e) => {
    setOrderSortBy(e.target.value);
  };

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    if (!user && token) {
      fetchUser(token);
    }
  }, [token, user, fetchUser, navigate]);

  useEffect(() => {
    if (user) {
      setSettingsForm({ name: user.name || '', email: user.email || '', phone: user.phone || '' })
    }
  }, [user])

  const fetchAddresses = async () => {
    if (!token) return;
    try {
      const res = await axios.get(backendUrl + '/api/address/get', { headers: { token } });
      if (res.data.success) {
        setAddresses(res.data.addresses || []);
        setPrimaryAddress(res.data.primaryAddress || null);
      }
    } catch (err) {
      // Optionally handle error
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, [token, backendUrl]);

  const handleAddressInput = e => {
    const { name, value } = e.target;
    setAddressForm(prev => ({ ...prev, [name]: value }));
  };

  const handleEditAddress = idx => {
    setEditAddressIdx(idx)
    setShowAddressForm(true)
    const addr = addresses[idx]
    setAddressForm({
      first_name: addr.first_name || '',
      last_name: addr.last_name || '',
      address: addr.address || '',
      country: addr.country || '',
      postcode: addr.postcode || '',
      state: addr.state || '',
      city: addr.city || '',
      landmark: addr.landmark || '',
      email: addr.email || user?.email || '',
      phone: addr.phone || user?.phone || ''
    })
  }

  const handleAddNewAddress = () => {
    setShowAddressForm(true);
    setEditAddressIdx(-1);
    setAddressForm({
      first_name: '',
      last_name: '',
      address: '',
      country: '',
      postcode: '',
      state: '',
      city: '',
      landmark: '',
      email: user?.email || '',
      phone: user?.phone || ''
    });
  }

  const handleRemoveAddress = async idx => {
    if (!window.confirm('Are you sure you want to remove this address?')) return
    setRemovingIdx(idx)
    try {
      await axios.post(
        backendUrl + '/api/address/remove',
        { addressIndex: idx },
        { headers: { token } }
      )
      await fetchAddresses()
      toast({ title: 'Address Removed', description: 'Address removed successfully.' })
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to remove address.', variant: 'destructive' })
    }
    setRemovingIdx(-1)
  }

  const handleAddAddress = async e => {
    e.preventDefault();
    setIsSavingAddress(true);
    try {
      const address = { ...addressForm };
      if (editAddressIdx !== -1) {
        // Edit mode
        await axios.post(
          backendUrl + '/api/address/edit',
          { addressIndex: editAddressIdx, address },
          { headers: { token } }
        )
        toast({ title: 'Address Updated', description: 'Address updated successfully.' })
      } else {
        // Add mode
        await axios.post(
          backendUrl + '/api/address/save',
          { address },
          { headers: { token } }
        )
        toast({ title: 'Address Added', description: 'Address added successfully.' })
      }
      setShowAddressForm(false);
      setEditAddressIdx(-1);
      setAddressForm({ first_name: '', last_name: '', address: '', country: '', postcode: '', state: '', city: '', landmark: '', email: '', phone: '' });
      fetchAddresses();
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to save address.', variant: 'destructive' })
    }
    setIsSavingAddress(false);
  };

  const handleCancelAddressForm = () => {
    setShowAddressForm(false)
    setEditAddressIdx(-1)
    setAddressForm({ first_name: '', last_name: '', address: '', country: '', postcode: '', state: '', city: '', landmark: '', email: '', phone: '' })
  }

  const handleSetPrimary = async idx => {
    setSettingPrimaryIdx(idx)
    try {
      await axios.post(
        backendUrl + '/api/address/set-primary',
        { addressIndex: idx },
        { headers: { token } }
      )
      await fetchAddresses()
      toast({ title: 'Primary Address Updated', description: 'Primary address set successfully.' })
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to set primary address.', variant: 'destructive' })
    }
    setSettingPrimaryIdx(-1)
  }

  const handleSettingsInput = e => {
    const { name, value } = e.target
    setSettingsForm(prev => ({ ...prev, [name]: value }))
    setSettingsError('')
    setSettingsSuccess('')
  }

  const handleSaveSettings = async e => {
    e.preventDefault()
    setIsSavingSettings(true)
    setSettingsError('')
    setSettingsSuccess('')
    try {
      const res = await axios.post(
        backendUrl + '/api/user/update',
        { ...settingsForm },
        { headers: { token } }
      )
      if (res.data.success) {
        setSettingsSuccess('Profile updated successfully')
        fetchUser(token)
        toast({ title: 'Profile Updated', description: 'Your profile has been updated.' })
      } else {
        setSettingsError(res.data.message || 'Failed to update profile')
        toast({ title: 'Error', description: res.data.message || 'Failed to update profile', variant: 'destructive' })
      }
    } catch (err) {
      setSettingsError('Failed to update profile')
      toast({ title: 'Error', description: 'Failed to update profile', variant: 'destructive' })
    }
    setIsSavingSettings(false)
  }

  const handlePasswordInput = e => {
    const { name, value } = e.target
    setPasswordForm(prev => ({ ...prev, [name]: value }))
    setPasswordError('')
    setPasswordSuccess('')
  }

  const handleChangePassword = async e => {
    e.preventDefault()
    setIsChangingPassword(true)
    setPasswordError('')
    setPasswordSuccess('')
    try {
      const res = await axios.post(
        backendUrl + '/api/user/change-password',
        { ...passwordForm },
        { headers: { token } }
      )
      if (res.data.success) {
        setPasswordSuccess('Password updated successfully')
        setPasswordForm({ currentPassword: '', newPassword: '' })
        setShowChangePassword(false)
        toast({ title: 'Password Changed', description: 'Your password has been updated.' })
      } else {
        setPasswordError(res.data.message || 'Failed to change password')
        toast({ title: 'Error', description: res.data.message || 'Failed to change password', variant: 'destructive' })
      }
    } catch (err) {
      setPasswordError('Failed to change password')
      toast({ title: 'Error', description: 'Failed to change password', variant: 'destructive' })
    }
    setIsChangingPassword(false)
  }

  const tabs = [
    { id: 'orders', name: 'My Orders', icon: Package },
    { id: 'wishlist', name: 'Wishlist', icon: Heart },
    { id: 'addresses', name: 'Addresses', icon: MapPin },
    { id: 'settings', name: 'Account Settings', icon: Settings }
  ];
  
  useEffect(() => {
    const fetchOrders = async () => {
      if (!token || !user || !user._id) return;
      setOrdersLoading(true);
      try {
        const res = await axios.post(
          backendUrl + '/api/order/userorders',
          { userId: user._id },
          { headers: { token } }
        );
        if (res.data.success) {
          setOrders(res.data.orders || []);
          console.log(res.data.orders)
        }
      } catch (err) {
        // Optionally handle error
        console.log(err)
      }
      setOrdersLoading(false);
    };
    fetchOrders();
  }, [token, user, backendUrl]);

  return (
    <div className="min-h-screen bg-white flex flex-col pb-[70px] md:pb-0">
      <SEO 
        title="My Account - Manage Your Profile"
        description="Manage your Revive Wardrobe account. View orders, update profile, manage addresses, and track your fashion purchases."
        keywords="my account, user profile, order history, manage account, customer dashboard, buy clothes online dubai, online fashion store uae, dubai clothing store, modest fashion dubai, shein dubai uae online, online clothes shopping uae, abaya online uae, zara uae online, shein online shopping dubai, matalan uae online, order clothes online dubai, best abaya shops in Dubai, Dubai abaya online worldwide shipping, abaya shop Dubai online, luxury abaya Dubai online"
        canonical="/account"
      />
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
                  <p className="font-medium">{user?.name || 'Account User'}</p>
                  <p className="text-gray-500 text-sm">{user?.email || ''}</p>
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
                    onClick={() => { logout(); navigate('/login'); }}
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
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between mb-6">
                  <div className="flex-shrink-0">
                    <h2 className="text-xl font-semibold mb-1">My Orders</h2>
                    {orders.length > 0 && (
                      <p className="text-sm text-gray-500">{orders.length} order{orders.length !== 1 ? 's' : ''} found</p>
                    )}
                  </div>
                  {orders.length > 0 && (
                    <div className="flex items-center gap-2 mt-2 sm:mt-0">
                      <label htmlFor="orderSort" className="text-sm font-medium text-gray-700 whitespace-nowrap">
                        Sort by:
                      </label>
                      <select
                        id="orderSort"
                        value={orderSortBy}
                        onChange={handleSortChange}
                        className="min-w-[140px] px-3 py-2 border border-gray-300 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-revive-red focus:border-transparent shadow-sm hover:border-gray-400 transition-colors"
                      >
                        <option value="newest">Newest First</option>
                        <option value="oldest">Oldest First</option>
                        <option value="status">Status</option>
                        <option value="amount-high">Amount (High to Low)</option>
                        <option value="amount-low">Amount (Low to High)</option>
                      </select>
                    </div>
                  )}
                </div>
                {ordersLoading ? (
                  <div className="p-8 text-center text-gray-500">Loading orders...</div>
                ) : orders.length === 0 ? (
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
                ) : (
                  <div className="space-y-8">
                    {filteredOrders.map((order, idx) => (
                      <div
                        key={order._id || idx}
                        className="rounded-xl shadow-md border border-gray-200 bg-white hover:shadow-lg transition-shadow duration-200"
                      >
                        {/* Order Header */}
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 px-6 py-4 border-b bg-gray-50 rounded-t-xl">
                          <div className="flex items-center gap-3">
                            <span className="font-semibold text-revive-red text-base md:text-lg">Order #{order._id?.toString().slice(-6) || idx+1}</span>
                            <span className="text-xs text-gray-500">{new Date(order.date).toLocaleDateString()}</span>
                          </div>
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-semibold
                              ${order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                                order.status === 'Order Placed' ? 'bg-yellow-100 text-yellow-700' :
                                order.status === 'Shipped' ? 'bg-blue-100 text-blue-700' :
                                order.status === 'Packing' ? 'bg-purple-100 text-purple-700' :
                                order.status === 'Out for Delivery' ? 'bg-orange-100 text-orange-700' :
                                'bg-gray-200 text-gray-700'}
                            `}
                          >
                            {order.status}
                          </span>
                        </div>
                        {/* Items List */}
                        <div className="flex flex-wrap gap-4 px-6 py-4 border-b">
                          {Array.isArray(order.line_items) ? order.line_items.map((item, i) => (
                            <div key={i} className="flex items-center gap-2 bg-gray-50 rounded-md px-2 py-1">
                              <img src={Array.isArray(item.image) ? item.image[0] : item.image} alt={item.sku_id || ''} className="w-10 h-10 object-cover rounded" />
                              <div className="flex flex-col">
                                <span className="font-medium text-sm">{item.sku_id || 'SKU'}</span>
                                <span className="text-xs text-gray-500">Qty: {item.quantity}</span>
                              </div>
                            </div>
                          )) : null}
                        </div>
                        {/* Order Details */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-6 py-4">
                          <div className="space-y-1">
                            <div className="text-gray-600 text-sm">Amount: <span className="font-semibold text-revive-red">{order.price && order.line_items ? order.price.currency_code + ' ' + order.line_items.reduce((sum, item) => sum + (parseFloat(item.price) || 0), 0) : ''}</span></div>
                            <div className="text-gray-600 text-sm">Payment: <span className="font-medium">{order.price?.payment_mode === 'cod' ? 'Pending' : 'Done'}</span></div>
                            <div className="text-gray-600 text-sm">Method: <span className="font-medium">{order.price?.payment_mode || '-'}</span></div>
                          </div>
                          <div className="space-y-1">
                            <div className="text-gray-600 text-sm">Address:</div>
                            <div className="text-xs text-gray-500">
                              {order.address && [
                                order.address.first_name,
                                order.address.last_name,
                                order.address.address,
                                order.address.landmark,
                                order.address.city,
                                order.address.state,
                                order.address.postcode,
                                order.address.country
                              ].filter(Boolean).join(', ')}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
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
                {addresses.length === 0 && !showAddressForm ? (
                  <div className="border rounded-lg p-6 text-center">
                    <MapPin className="mx-auto text-gray-300 mb-4" size={48} />
                    <p className="text-gray-500">No addresses saved yet</p>
                    <button 
                      className="mt-4 bg-revive-red hover:bg-red-700 text-white font-bold py-2 px-6 rounded-full transition-colors duration-300"
                      onClick={handleAddNewAddress}
                    >
                      Add New Address
                    </button>
                  </div>
                ) : showAddressForm ? (
                  <form className="max-w-4xl mx-auto border rounded-lg p-6 bg-gray-50" onSubmit={handleAddAddress}>
                    <h3 className="text-lg font-semibold mb-4">{editAddressIdx !== -1 ? 'Edit Address' : 'Add New Address'}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">First Name *</label>
                        <input type="text" name="first_name" value={addressForm.first_name} onChange={handleAddressInput} className="w-full px-3 py-2 border border-gray-300 rounded-md" required />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Last Name</label>
                        <input type="text" name="last_name" value={addressForm.last_name} onChange={handleAddressInput} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-1">Address</label>
                        <input type="text" name="address" value={addressForm.address} onChange={handleAddressInput} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Landmark</label>
                        <input type="text" name="landmark" value={addressForm.landmark} onChange={handleAddressInput} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">City *</label>
                        <input type="text" name="city" value={addressForm.city} onChange={handleAddressInput} className="w-full px-3 py-2 border border-gray-300 rounded-md" required />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">State *</label>
                        <input type="text" name="state" value={addressForm.state} onChange={handleAddressInput} className="w-full px-3 py-2 border border-gray-300 rounded-md" required />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Postcode *</label>
                        <input type="text" name="postcode" value={addressForm.postcode} onChange={handleAddressInput} className="w-full px-3 py-2 border border-gray-300 rounded-md" required />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-1">Country *</label>
                        <select
                          name="country"
                          value={addressForm.country}
                          onChange={handleAddressInput}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          required
                        >
                          <option value="">Select Country</option>
                          <option value="UAE">UAE</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Email *</label>
                        <input 
                          type="email" 
                          name="email" 
                          value={addressForm.email} 
                          onChange={handleAddressInput} 
                          className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed" 
                          disabled 
                          required 
                        />
                        <p className="text-xs text-gray-500 mt-1">Email is auto-filled from your account</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Phone</label>
                        <input 
                          type="tel" 
                          name="phone" 
                          value={addressForm.phone} 
                          onChange={handleAddressInput} 
                          className="w-full px-3 py-2 border border-gray-300 rounded-md" 
                          placeholder="Enter phone number (optional)"
                        />
                        <p className="text-xs text-gray-500 mt-1">Phone is optional and can be edited</p>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-6">
                      <button type="submit" className="bg-revive-red hover:bg-red-700 text-white font-bold py-2 px-6 rounded-full transition-colors duration-300" disabled={isSavingAddress}>
                        {isSavingAddress ? (editAddressIdx !== -1 ? 'Saving...' : 'Saving...') : (editAddressIdx !== -1 ? 'Save Changes' : 'Save Address')}
                      </button>
                      <button type="button" className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-6 rounded-full transition-colors duration-300" onClick={handleCancelAddressForm}>
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <div>
                    <ul className="space-y-4">
                      {addresses.map((address, idx) => {
                        const isPrimary = primaryAddress && JSON.stringify(primaryAddress) === JSON.stringify(address)
                        return (
                          <li key={idx} className={`border rounded-lg p-4 ${isPrimary ? 'border-revive-red' : 'border-gray-200'}`}>
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="font-medium">{address.first_name} {address.last_name || ''}</p>
                                <p className="text-gray-600 text-sm">
                                  {address.address ? address.address + ', ' : ''}
                                  {address.landmark ? address.landmark + ', ' : ''}
                                  {address.city ? address.city + ', ' : ''}
                                  {address.state ? address.state + ', ' : ''}
                                  {address.postcode ? address.postcode + ', ' : ''}
                                  {address.country || ''}
                                </p>
                                <p className="text-xs text-gray-500">
                                  Email: {address.email}, Phone: {address.phone}
                                </p>
                              </div>
                              <div className="flex flex-col items-end gap-2">
                                {isPrimary && (
                                  <span className="text-xs text-revive-red font-semibold ml-2">Primary</span>
                                )}
                                {!isPrimary && (
                                  <button
                                    className="text-xs bg-revive-red hover:bg-red-700 text-white font-bold py-1 px-4 rounded-full transition-colors duration-300"
                                    onClick={() => handleSetPrimary(idx)}
                                    disabled={settingPrimaryIdx === idx}
                                  >
                                    {settingPrimaryIdx === idx ? 'Setting...' : 'Set as Primary'}
                                  </button>
                                )}
                                <div className="flex gap-2 mt-2">
                                  <button
                                    className="text-xs flex items-center bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-1 px-3 rounded-full transition-colors duration-300"
                                    onClick={() => handleEditAddress(idx)}
                                  >
                                    <Pencil size={14} className="mr-1" /> Edit
                                  </button>
                                  <button
                                    className="text-xs flex items-center bg-gray-100 hover:bg-red-100 text-red-700 font-bold py-1 px-3 rounded-full transition-colors duration-300"
                                    onClick={() => handleRemoveAddress(idx)}
                                    disabled={removingIdx === idx}
                                  >
                                    <Trash2 size={14} className="mr-1" />
                                    {removingIdx === idx ? 'Removing...' : 'Remove'}
                                  </button>
                                </div>
                              </div>
                            </div>
                          </li>
                        )
                      })}
                    </ul>
                    <button 
                      className="mt-6 bg-revive-red hover:bg-red-700 text-white font-bold py-2 px-6 rounded-full transition-colors duration-300"
                      onClick={handleAddNewAddress}
                    >
                      Add New Address
                    </button>
                  </div>
                )}
              </div>
            )}
            
            {activeTab === 'settings' && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Account Settings</h2>
                <form className="space-y-4" onSubmit={handleSaveSettings}>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={settingsForm.name}
                      onChange={handleSettingsInput}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={settingsForm.email}
                      onChange={handleSettingsInput}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={settingsForm.phone}
                      onChange={handleSettingsInput}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  {settingsError && <div className="text-red-600 text-sm">{settingsError}</div>}
                  {settingsSuccess && <div className="text-green-600 text-sm">{settingsSuccess}</div>}
                  <div className="pt-4 flex gap-2">
                    <button
                      type="submit"
                      className="bg-revive-red hover:bg-red-700 text-white font-bold py-2 px-6 rounded-full transition-colors duration-300"
                      disabled={isSavingSettings}
                    >
                      {isSavingSettings ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                      type="button"
                      className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-6 rounded-full transition-colors duration-300"
                      onClick={() => setShowChangePassword(true)}
                    >
                      Change Password
                    </button>
                  </div>
                </form>
                {showChangePassword && (
                  <form className="mt-8 max-w-lg mx-auto border rounded-lg p-6 bg-gray-50" onSubmit={handleChangePassword}>
                    <h3 className="text-lg font-semibold mb-4">Change Password</h3>
                    <div className="mb-3">
                      <label className="block text-sm font-medium mb-1">Current Password</label>
                      <input
                        type="password"
                        name="currentPassword"
                        value={passwordForm.currentPassword}
                        onChange={handlePasswordInput}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="block text-sm font-medium mb-1">New Password</label>
                      <input
                        type="password"
                        name="newPassword"
                        value={passwordForm.newPassword}
                        onChange={handlePasswordInput}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        required
                      />
                    </div>
                    {passwordError && <div className="text-red-600 text-sm">{passwordError}</div>}
                    {passwordSuccess && <div className="text-green-600 text-sm">{passwordSuccess}</div>}
                    <div className="flex gap-2 mt-4">
                      <button
                        type="submit"
                        className="bg-revive-red hover:bg-red-700 text-white font-bold py-2 px-6 rounded-full transition-colors duration-300"
                        disabled={isChangingPassword}
                      >
                        {isChangingPassword ? 'Changing...' : 'Change Password'}
                      </button>
                      <button
                        type="button"
                        className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-6 rounded-full transition-colors duration-300"
                        onClick={() => { setShowChangePassword(false); setPasswordForm({ currentPassword: '', newPassword: '' }); setPasswordError(''); setPasswordSuccess(''); }}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
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
