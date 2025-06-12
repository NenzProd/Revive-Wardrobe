import React, { useState, useEffect } from 'react'
import { useCartStore } from '../stores/useCartStore'
import { useNavigate } from 'react-router-dom'
import { MapPin, Plus, CreditCard, Truck, Lock, Star } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Newsletter from '../components/Newsletter'
import { priceSymbol } from '../config/constants'
import axios from 'axios'
import { useToast } from '@/hooks/use-toast'

function Checkout () {
  const { cart, subtotal, shippingCost, total, token, backendUrl, user, clearCart } = useCartStore()
  const [addresses, setAddresses] = useState([])
  const [primaryAddress, setPrimaryAddress] = useState(null)
  const [selectedAddressIdx, setSelectedAddressIdx] = useState(0)
  const [showAddressForm, setShowAddressForm] = useState(false)
  const [addressForm, setAddressForm] = useState({
    name: '', building: '', street: '', area: '', city: '', country: ''
  })
  const [isSavingAddress, setIsSavingAddress] = useState(false)
  const [editAddressIdx, setEditAddressIdx] = useState(-1)
  const [removingIdx, setRemovingIdx] = useState(-1)
  const [selectedPayment, setSelectedPayment] = useState('cod')
  const [isPlacingOrder, setIsPlacingOrder] = useState(false)
  const navigate = useNavigate()
  const { toast } = useToast()

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!token) {
      navigate('/login')
    }
  }, [token, navigate])

  // Fetch addresses from backend
  useEffect(() => {
    async function fetchAddresses () {
      if (!token) return
      try {
        const res = await axios.get(backendUrl + '/api/address/get', { headers: { token } })
        if (res.data.success) {
          setAddresses(res.data.addresses || [])
          setPrimaryAddress(res.data.primaryAddress || null)
          // Set selected to primary if exists
          if (res.data.primaryAddress) {
            const idx = (res.data.addresses || []).findIndex(a => JSON.stringify(a) === JSON.stringify(res.data.primaryAddress))
            setSelectedAddressIdx(idx >= 0 ? idx : 0)
          }
        }
      } catch (err) {
        // Optionally handle error
      }
    }
    fetchAddresses()
  }, [token, backendUrl])

  // Address form handlers
  const handleAddressInput = e => {
    const { name, value } = e.target
    setAddressForm(prev => ({ ...prev, [name]: value }))
  }
  const handleAddAddress = () => {
    setShowAddressForm(true)
    setEditAddressIdx(-1)
    setAddressForm({ name: '', building: '', street: '', area: '', city: '', country: '' })
  }
  const handleEditAddress = idx => {
    setEditAddressIdx(idx)
    setShowAddressForm(true)
    const addr = addresses[idx]
    setAddressForm({
      name: addr.name || '',
      building: addr.building || '',
      street: addr.street || '',
      area: addr.area || '',
      city: addr.city || '',
      country: addr.country || ''
    })
  }
  const handleSaveAddress = async e => {
    e.preventDefault()
    setIsSavingAddress(true)
    try {
      const address = { ...addressForm }
      if (editAddressIdx !== -1) {
        await axios.post(
          backendUrl + '/api/address/edit',
          { addressIndex: editAddressIdx, address },
          { headers: { token } }
        )
        toast({ title: 'Address Updated', description: 'Address updated successfully.' })
      } else {
        await axios.post(
          backendUrl + '/api/address/save',
          { address },
          { headers: { token } }
        )
        toast({ title: 'Address Added', description: 'Address added successfully.' })
      }
      setShowAddressForm(false)
      setEditAddressIdx(-1)
      setAddressForm({ name: '', building: '', street: '', area: '', city: '', country: '' })
      // Refresh addresses
      const res = await axios.get(backendUrl + '/api/address/get', { headers: { token } })
      if (res.data.success) {
        setAddresses(res.data.addresses || [])
        setPrimaryAddress(res.data.primaryAddress || null)
      }
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to save address.', variant: 'destructive' })
    }
    setIsSavingAddress(false)
  }
  const handleSetPrimary = async idx => {
    try {
      await axios.post(
        backendUrl + '/api/address/set-primary',
        { addressIndex: idx },
        { headers: { token } }
      )
      toast({ title: 'Primary Address Updated', description: 'Primary address set successfully.' })
      // Refresh addresses
      const res = await axios.get(backendUrl + '/api/address/get', { headers: { token } })
      if (res.data.success) {
        setAddresses(res.data.addresses || [])
        setPrimaryAddress(res.data.primaryAddress || null)
        setSelectedAddressIdx(idx)
      }
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to set primary address.', variant: 'destructive' })
    }
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
      toast({ title: 'Address Removed', description: 'Address removed successfully.' })
      // Refresh addresses
      const res = await axios.get(backendUrl + '/api/address/get', { headers: { token } })
      if (res.data.success) {
        setAddresses(res.data.addresses || [])
        setPrimaryAddress(res.data.primaryAddress || null)
        setSelectedAddressIdx(0)
      }
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to remove address.', variant: 'destructive' })
    }
    setRemovingIdx(-1)
  }

  const [addressSectionOpen, setAddressSectionOpen] = useState(true)

  // Payment methods
  const paymentMethods = [
    { id: 'razorpay', label: 'Razorpay', icon: <CreditCard size={18} className='mr-2' /> },
    { id: 'cod', label: 'Cash on Delivery', icon: <Truck size={18} className='mr-2' /> },
    { id: 'stripe', label: 'Stripe', icon: <Lock size={18} className='mr-2 text-gray-400' />, disabled: true, note: 'Coming Soon' }
  ]

  // Place Order Handler (COD)
  const handlePlaceOrder = async () => {
    if (!token) {
      toast({ title: 'Error', description: 'You must be logged in to place an order.', variant: 'destructive' })
      return
    }
    if (!addresses[selectedAddressIdx]) {
      toast({ title: 'Error', description: 'Please select a delivery address.', variant: 'destructive' })
      return
    }
    if (cart.length === 0) {
      toast({ title: 'Error', description: 'Your cart is empty.', variant: 'destructive' })
      return
    }
    setIsPlacingOrder(true)
    try {
      const res = await axios.post(
        backendUrl + '/api/order/place',
        {
          userId: user._id,
          email: user.email,
          phone: user.phone,
          items: cart,
          amount: total,
          address: addresses[selectedAddressIdx]
        },
        { headers: { token } }
      )
      if (res.data.success) {
        clearCart()
        toast({ title: 'Order Placed', description: 'Your order has been placed successfully.' })
        navigate('/')
      } else {
        toast({ title: 'Error', description: res.data.message || 'Failed to place order.', variant: 'destructive' })
      }
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to place order.', variant: 'destructive' })
    }
    setIsPlacingOrder(false)
  }

  return (
    <div className='min-h-screen bg-white flex flex-col pt-[88px]'>
      <Navbar />
      <div className='container mx-auto px-4 py-8 flex-grow'>
        <h1 className='text-3xl font-serif mb-8 flex items-center gap-2'>
          <span className='bg-revive-red/10 rounded-full p-2'><MapPin className='text-revive-red' size={24} /></span>
          Checkout
        </h1>
        <div className='flex flex-col lg:flex-row gap-8'>
          {/* Left: Delivery + Payment */}
          <div className='flex-1 space-y-8'>
            {/* Delivery Information */}
            <div className='bg-gray-50 rounded-lg border border-gray-200 shadow-sm p-6'>
              <div className='flex items-center mb-4'>
                <MapPin className='text-revive-red mr-2' />
                <h2 className='text-lg font-serif font-semibold'>Delivery Information</h2>
              </div>
              <div className='mb-4'>
                <div className='text-sm font-medium mb-2'>Saved Addresses</div>
                <div className='space-y-3'>
                  {addresses.length === 0 && <div className='text-gray-500 text-sm'>No addresses saved yet.</div>}
                  {addresses.map((addr, idx) => {
                    const isPrimary = primaryAddress && JSON.stringify(primaryAddress) === JSON.stringify(addr)
                    return (
                      <div
                        key={idx}
                        className={`border rounded-lg p-4 cursor-pointer transition-all flex justify-between items-center ${selectedAddressIdx === idx ? 'border-revive-red bg-white shadow' : 'border-gray-200 bg-gray-100'}`}
                        onClick={() => setSelectedAddressIdx(idx)}
                      >
                        <div>
                          <div className='font-semibold mb-1 flex items-center gap-2'>
                            {addr.name} {isPrimary && <span className='text-xs text-revive-gold flex items-center gap-1'><Star size={14} className='inline' />Primary</span>}
                          </div>
                          <div className='text-gray-700 text-sm whitespace-pre-line'>
                            {addr.building}\n{addr.street}\n{addr.area}\n{addr.city}\n{addr.country}
                          </div>
                        </div>
                        <div className='flex flex-col gap-1'>
                          {!isPrimary && <button className='text-xs text-revive-gold hover:underline' onClick={e => { e.stopPropagation(); handleSetPrimary(idx) }}>Set as Primary</button>}
                          <button className='text-xs text-gray-500 hover:underline' onClick={e => { e.stopPropagation(); handleEditAddress(idx) }}>Edit</button>
                          <button className='text-xs text-red-500 hover:underline' onClick={e => { e.stopPropagation(); handleRemoveAddress(idx) }} disabled={removingIdx === idx}>{removingIdx === idx ? 'Removing...' : 'Remove'}</button>
                        </div>
                      </div>
                    )
                  })}
                </div>
                <button
                  className='mt-4 flex items-center gap-2 px-4 py-2 bg-revive-red hover:bg-revive-red/90 text-white rounded-md font-medium transition-colors'
                  onClick={handleAddAddress}
                >
                  <Plus size={18} /> Add New Address
                </button>
                {/* Address form modal/inline */}
                {showAddressForm && (
                  <form className='mt-6 max-w-lg border rounded-lg p-6 bg-white' onSubmit={handleSaveAddress}>
                    <h3 className='text-lg font-semibold mb-4'>{editAddressIdx !== -1 ? 'Edit Address' : 'Add New Address'}</h3>
                    <div className='mb-3'>
                      <label className='block text-sm font-medium mb-1'>Full Name</label>
                      <input type='text' name='name' value={addressForm.name} onChange={handleAddressInput} className='w-full px-3 py-2 border border-gray-300 rounded-md' required />
                    </div>
                    <div className='mb-3'>
                      <label className='block text-sm font-medium mb-1'>Building Name/Number</label>
                      <input type='text' name='building' value={addressForm.building} onChange={handleAddressInput} className='w-full px-3 py-2 border border-gray-300 rounded-md' required />
                    </div>
                    <div className='mb-3'>
                      <label className='block text-sm font-medium mb-1'>Street Name/Number</label>
                      <input type='text' name='street' value={addressForm.street} onChange={handleAddressInput} className='w-full px-3 py-2 border border-gray-300 rounded-md' required />
                    </div>
                    <div className='mb-3'>
                      <label className='block text-sm font-medium mb-1'>Area/Neighborhood</label>
                      <input type='text' name='area' value={addressForm.area} onChange={handleAddressInput} className='w-full px-3 py-2 border border-gray-300 rounded-md' required />
                    </div>
                    <div className='mb-3'>
                      <label className='block text-sm font-medium mb-1'>City</label>
                      <input type='text' name='city' value={addressForm.city} onChange={handleAddressInput} className='w-full px-3 py-2 border border-gray-300 rounded-md' required />
                    </div>
                    <div className='mb-3'>
                      <label className='block text-sm font-medium mb-1'>Country</label>
                      <input type='text' name='country' value={addressForm.country} onChange={handleAddressInput} className='w-full px-3 py-2 border border-gray-300 rounded-md' required />
                    </div>
                    <div className='flex gap-2 mt-4'>
                      <button type='submit' className='bg-revive-red hover:bg-red-700 text-white font-bold py-2 px-6 rounded-full transition-colors duration-300' disabled={isSavingAddress}>
                        {isSavingAddress ? (editAddressIdx !== -1 ? 'Saving...' : 'Saving...') : (editAddressIdx !== -1 ? 'Save Changes' : 'Save Address')}
                      </button>
                      <button type='button' className='bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-6 rounded-full transition-colors duration-300' onClick={() => { setShowAddressForm(false); setEditAddressIdx(-1); setAddressForm({ name: '', building: '', street: '', area: '', city: '', country: '' }) }}>
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
            {/* Payment Method */}
            <div className='bg-gray-50 rounded-lg border border-gray-200 shadow-sm p-6'>
              <div className='flex items-center mb-4'>
                <CreditCard className='text-revive-red mr-2' />
                <h2 className='text-lg font-serif font-semibold'>Payment Method</h2>
              </div>
              <div className='space-y-3'>
                {paymentMethods.map(method => (
                  <label
                    key={method.id}
                    className={`flex items-center border rounded-lg px-4 py-3 cursor-pointer transition-all ${selectedPayment === method.id ? 'border-revive-red bg-revive-red/10' : 'border-gray-200 bg-white'} ${method.disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
                  >
                    <input
                      type='radio'
                      name='paymentMethod'
                      value={method.id}
                      checked={selectedPayment === method.id}
                      onChange={() => !method.disabled && setSelectedPayment(method.id)}
                      disabled={method.disabled}
                      className='mr-3 accent-revive-red'
                    />
                    {method.icon}
                    <span className='font-medium'>{method.label}</span>
                    {method.note && <span className='ml-2 text-xs text-gray-400'>({method.note})</span>}
                  </label>
                ))}
              </div>
            </div>
          </div>
          {/* Right: Order Summary */}
          <div className='w-full lg:w-[350px]'>
            <div className='bg-white rounded-lg border border-gray-200 shadow-sm p-6 mb-6'>
              <h2 className='text-lg font-serif font-semibold mb-4'>Order Summary</h2>
              {cart.length > 0 && (
                <div className='flex items-center gap-3 mb-4'>
                  <img src={cart[0].image[0]} alt={cart[0].name} className='w-12 h-12 object-cover rounded-md' />
                  <div className='flex-1'>
                    <div className='font-medium'>{cart[0].name}</div>
                    <div className='text-xs text-gray-500'>Qty: {cart[0].quantity}</div>
                  </div>
                  <div className='font-semibold text-revive-red'>
                    {priceSymbol} {cart[0].price.toLocaleString()}
                  </div>
                </div>
              )}
              <div className='border-t border-b border-gray-200 py-4 mb-4'>
                <div className='flex justify-between mb-2'>
                  <span className='text-gray-600'>Subtotal</span>
                  <span>{priceSymbol} {subtotal.toLocaleString()}</span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-gray-600'>Shipping</span>
                  <span>{priceSymbol} {shippingCost.toLocaleString()}</span>
                </div>
              </div>
              <div className='flex justify-between items-center mb-6'>
                <span className='text-lg font-medium'>Total</span>
                <span className='text-xl font-bold text-revive-red'>{priceSymbol} {total.toLocaleString()}</span>
              </div>
              <button
                className='w-full bg-revive-gold hover:bg-revive-gold/90 text-white font-semibold py-3 rounded-md flex items-center justify-center gap-2 transition-colors text-base'
                onClick={handlePlaceOrder}
                disabled={isPlacingOrder}
              >
                {isPlacingOrder ? 'Placing Order...' : 'Place Order'} <span className='ml-1'>&rarr;</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      <Newsletter />
      <Footer />
    </div>
  )
}

export default Checkout