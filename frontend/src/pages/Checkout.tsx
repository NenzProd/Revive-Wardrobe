import React, { useState, useEffect } from "react";
import { useCartStore } from "../stores/useCartStore";
import { useNavigate } from "react-router-dom";
import { MapPin, Plus, CreditCard, Truck, Lock, Star } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Newsletter from "../components/Newsletter";
import { priceSymbol } from "../config/constants";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { CartItem } from '../types/product'
type CartItemWithPrice = CartItem & { price?: number, sku_id?: string }

// Add Razorpay type declaration for TypeScript
interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}
interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  theme?: {
    color?: string;
  };
}
 
declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => { open: () => void };
  }
}

function Checkout() {
  const store = useCartStore();
  const cart = store.cart as CartItemWithPrice[];
  const subtotal = store.subtotal;
  const shippingCost = store.shippingCost;
  const total = store.total;
  const token = store.token;
  const backendUrl = store.backendUrl;
  const user = store.user;
  const clearCart = store.clearCart;
  const [addresses, setAddresses] = useState([]);
  const [primaryAddress, setPrimaryAddress] = useState(null);
  const [selectedAddressIdx, setSelectedAddressIdx] = useState(0);
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
  const [editAddressIdx, setEditAddressIdx] = useState(-1);
  const [removingIdx, setRemovingIdx] = useState(-1);
  const [selectedPayment, setSelectedPayment] = useState("paymennt");
  const [selectedDeliveryType, setSelectedDeliveryType] = useState('next day delivery');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [orderStatus, setOrderStatus] = useState('idle'); // 'idle', 'processing', 'redirecting'
  const navigate = useNavigate();
  const { toast } = useToast();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  // Fetch addresses from backend
  useEffect(() => {
    async function fetchAddresses() {
      if (!token) return;
      try {
        const res = await axios.get(backendUrl + "/api/address/get", {
          headers: { token },
        });
        if (res.data.success) {
          setAddresses(res.data.addresses || []);
          setPrimaryAddress(res.data.primaryAddress || null);
          // Set selected to primary if exists
          if (res.data.primaryAddress) {
            const idx = (res.data.addresses || []).findIndex(
              (a) =>
                JSON.stringify(a) === JSON.stringify(res.data.primaryAddress)
            );
            setSelectedAddressIdx(idx >= 0 ? idx : 0);
          }
        }
      } catch (err) {
        // Optionally handle error
      }
    }
    fetchAddresses();
  }, [token, backendUrl]);

  // Address form handlers
  const handleAddressInput = (e) => {
    const { name, value } = e.target;
    setAddressForm((prev) => ({ ...prev, [name]: value }));
  };
  const handleAddAddress = () => {
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
      email: '',
      phone: ''
    });
  };
  const handleEditAddress = (idx) => {
    setEditAddressIdx(idx);
    setShowAddressForm(true);
    const addr = addresses[idx];
    setAddressForm({
      first_name: addr.first_name || '',
      last_name: addr.last_name || '',
      address: addr.address || '',
      country: addr.country || '',
      postcode: addr.postcode || '',
      state: addr.state || '',
      city: addr.city || '',
      landmark: addr.landmark || '',
      email: addr.email || '',
      phone: addr.phone || ''
    });
  };
  const handleSaveAddress = async (e) => {
    e.preventDefault();
    setIsSavingAddress(true);
    try {
      const address = { ...addressForm };
      if (editAddressIdx !== -1) {
        await axios.post(
          backendUrl + "/api/address/edit",
          { addressIndex: editAddressIdx, address },
          { headers: { token } }
        );
        toast({
          title: "Address Updated",
          description: "Address updated successfully.",
        });
      } else {
        await axios.post(
          backendUrl + "/api/address/save",
          { address },
          { headers: { token } }
        );
        toast({
          title: "Address Added",
          description: "Address added successfully.",
        });
      }
      setShowAddressForm(false);
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
        email: '',
        phone: ''
      });
      // Refresh addresses
      const res = await axios.get(backendUrl + "/api/address/get", {
        headers: { token },
      });
      if (res.data.success) {
        setAddresses(res.data.addresses || []);
        setPrimaryAddress(res.data.primaryAddress || null);
        if ((res.data.addresses || []).length === 1) {
          await axios.post(
            backendUrl + "/api/address/set-primary",
            { addressIndex: 0 },
            { headers: { token } }
          );
          setPrimaryAddress(res.data.addresses[0]);
          setSelectedAddressIdx(0);
        }
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to save address.",
        variant: "destructive",
      });
    }
    setIsSavingAddress(false);
  };
  const handleSetPrimary = async (idx) => {
    try {
      await axios.post(
        backendUrl + "/api/address/set-primary",
        { addressIndex: idx },
        { headers: { token } }
      );
      toast({
        title: "Primary Address Updated",
        description: "Primary address set successfully.",
      });
      // Refresh addresses
      const res = await axios.get(backendUrl + "/api/address/get", {
        headers: { token },
      });
      if (res.data.success) {
        setAddresses(res.data.addresses || []);
        setPrimaryAddress(res.data.primaryAddress || null);
        setSelectedAddressIdx(idx);
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to set primary address.",
        variant: "destructive",
      });
    }
  };
  const handleRemoveAddress = async (idx) => {
    if (!window.confirm("Are you sure you want to remove this address?"))
      return;
    setRemovingIdx(idx);
    try {
      await axios.post(
        backendUrl + "/api/address/remove",
        { addressIndex: idx },
        { headers: { token } }
      );
      toast({
        title: "Address Removed",
        description: "Address removed successfully.",
      });
      // Refresh addresses
      const res = await axios.get(backendUrl + "/api/address/get", {
        headers: { token },
      });
      if (res.data.success) {
        setAddresses(res.data.addresses || []);
        setPrimaryAddress(res.data.primaryAddress || null);
        setSelectedAddressIdx(0);
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to remove address.",
        variant: "destructive",
      });
    }
    setRemovingIdx(-1);
  };

  const [addressSectionOpen, setAddressSectionOpen] = useState(true);

  // Payment methods
  const paymentMethods = [
    // {
    //   id: "razorpay",
    //   label: "Razorpay",
    //   icon: <CreditCard size={18} className="mr-2" />,
    // },
    {
      id: "paymennt",
      label: "Paymennt",
      icon: <CreditCard size={18} className="mr-2" />,
    },
    // { id: 'cod', label: 'Cash on Delivery', icon: <Truck size={18} className='mr-2' /> },
    // { id: 'stripe', label: 'Stripe', icon: <Lock size={18} className='mr-3 text-gray-400' /> }
  ];

  // Delivery type options
  const deliveryTypes = [
    { id: 'next day delivery', label: 'Next Day Delivery' },
    { id: 'same day delivery', label: 'Same Day Delivery' }
  ];

  // Razorpay payment integration (updated)
  const initPay = (order) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: "Revive Wardrobe",
      description: "Order Payment",
      order_id: order.id,
      handler: async (response) => {
        try {
          const verifyData = {
            ...response,
            ...buildOrderPayload('online'),
            address: order.address || addresses[selectedAddressIdx],
            price: {
              ...buildOrderPayload('online').price,
              delivery_type: order.delivery_type || selectedDeliveryType
            }
          };
          const { data } = await axios.post(
            backendUrl + "/api/order/verifyRazorpay",
            verifyData,
            { headers: { token } }
          );
          if (data.success) {
            clearCart();
            toast({
              title: "Payment Successful",
              description: "Your order has been placed.",
            });
            navigate("/account");
          } else {
            toast({
              title: "Error",
              description: data.message || "Payment verification failed.",
              variant: "destructive",
            });
            setIsPlacingOrder(false);
            setOrderStatus('idle');
          }
        } catch (error) {
          toast({
            title: "Error",
            description: error.message,
            variant: "destructive",
          });
          setIsPlacingOrder(false);
          setOrderStatus('idle');
        }
      },
      prefill: {
        name: user?.name,
        email: user?.email,
        contact: user?.phone,
      },
      theme: {
        color: "#FFD700",
      },
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  // Helper to build order payload in new format
  function buildOrderPayload(paymentMode) {
    return {
      userId: user._id,
      order_id: '', // let backend generate or add logic if needed
      address: { ...addresses[selectedAddressIdx] },
      price: {
        payment_mode: paymentMode,
        currency_code: 'AED',
        delivery_type: selectedDeliveryType,
        shipping_charges: '0',
        COD: selectedPayment === 'cod' ? total.toString() : '0',
        tax: '0',
        extra_charges: '0'
      },
      line_items: cart.map(item => {
        let selectedSize = ''
        if (Array.isArray(item.selectedSize)) {
          selectedSize = item.selectedSize[0] || ''
        } else {
          selectedSize = item.selectedSize || ''
        }
        const variant = item.variants?.find(v => typeof v.filter_value === 'string' && typeof selectedSize === 'string' && v.filter_value === selectedSize)
        return {
          product_id: item._id || '',
          sku_id: variant?.sku || '',
          image: item.image || '',
          quantity: item.quantity?.toString() || '1',
          price: (item.price || 0).toString()
        }
      })
    }
  }

  // Place Order Handler (COD, Razorpay & Paymennt, updated)
  const handlePlaceOrder = async () => {
    if (!token) {
      toast({
        title: "Error",
        description: "You must be logged in to place an order.",
        variant: "destructive",
      });
      return;
    }
    if (!addresses[selectedAddressIdx]) {
      toast({
        title: "Error",
        description: "Please select a delivery address.",
        variant: "destructive",
      });
      return;
    }
    if (cart.length === 0) {
      toast({
        title: "Error",
        description: "Your cart is empty.",
        variant: "destructive",
      });
      return;
    }
    
    // Show processing message
    toast({
      title: "Processing Order",
      description: "Please wait while we process your order...",
    });
    
    setIsPlacingOrder(true);
    try {
      if (selectedPayment === "razorpay") {
        // Only create Razorpay order, not DB order
        const responseRazorpay = await axios.post(
          backendUrl + "/api/order/razorpay",
          { amount: total },
          { headers: { token } }
        );
        if (responseRazorpay.data.success) {
          // Update order status to show processing
          setOrderStatus('processing');
          
          // Pass delivery type and address to Razorpay handler
          initPay({
            ...responseRazorpay.data.order,
            delivery_type: selectedDeliveryType,
            address: addresses[selectedAddressIdx]
          });
        } else {
          toast({
            title: "Error",
            description:
              responseRazorpay.data.message || "Failed to initiate payment.",
            variant: "destructive",
          });
          setIsPlacingOrder(false);
          setOrderStatus('idle');
        }
      } else if (selectedPayment === "paymennt") {
        // Create Paymennt checkout
        const orderPayload = buildOrderPayload('online');
        const responsePaymennt = await axios.post(
          backendUrl + "/api/order/paymennt",
          { 
            amount: total,
            address: addresses[selectedAddressIdx],
            line_items: orderPayload.line_items.map(item => ({
              ...item,
              name: cart.find(c => c._id === item.product_id)?.name || 'Product'
            }))
          },
          { headers: { token } }
        );
        if (responsePaymennt.data.success) {
          // Store order data in localStorage for verification after redirect
          localStorage.setItem('paymennt_order_data', JSON.stringify({
            paymentId: responsePaymennt.data.paymentId,
            userId: user._id,
            address: addresses[selectedAddressIdx],
            price: {
              ...orderPayload.price,
              delivery_type: selectedDeliveryType
            },
            line_items: orderPayload.line_items
          }));
          
          // Show success message before redirect
          toast({
            title: "Redirecting to Payment",
            description: "Please complete your payment on the next page.",
          });
          
          // Update order status to show redirecting
          setOrderStatus('redirecting');
          
          // Small delay to show the message and keep button disabled
          setTimeout(() => {
            // Redirect to Paymennt checkout
            window.location.href = responsePaymennt.data.checkoutUrl;
          }, 1500);
          
          // Don't reset isPlacingOrder for successful redirect
          return;
        } else {
          toast({
            title: "Error",
            description:
              responsePaymennt.data.message || "Failed to initiate payment.",
            variant: "destructive",
          });
          setIsPlacingOrder(false);
          setOrderStatus('idle');
        }
      } else {
        // COD fallback
        const orderPayload = buildOrderPayload('cod');
        const res = await axios.post(
          backendUrl + "/api/order/place",
          orderPayload,
          { headers: { token } }
        );
        if (res.data.success) {
          clearCart();
          toast({
            title: "Order Placed",
            description: "Your order has been placed successfully.",
          });
          navigate("/");
        } else {
          toast({
            title: "Error",
            description: res.data.message || "Failed to place order.",
            variant: "destructive",
          });
          setIsPlacingOrder(false);
          setOrderStatus('idle');
        }
      }
    } catch (err) {
      console.error('Order placement error:', err);
      toast({
        title: "Error",
        description: err.response?.data?.message || "Failed to place order. Please try again.",
        variant: "destructive",
      });
      setIsPlacingOrder(false);
      setOrderStatus('idle');
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col pt-[88px] ">
      <Navbar />
      <div className="container mx-auto px-4 py-8 flex-grow">
        <h1 className="text-3xl font-serif mb-8 flex items-center gap-2">
          <span className="bg-revive-red/10 rounded-full p-2">
            <MapPin className="text-revive-red" size={24} />
          </span>
          Checkout
        </h1>
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left: Delivery + Payment */}
          <div className="flex-1 space-y-8">
            {/* Delivery Information */}
            <div className="bg-gray-50 rounded-lg border border-gray-200 shadow-sm p-6">
              <div className="flex items-center mb-4">
                <MapPin className="text-revive-red mr-2" />
                <h2 className="text-lg font-serif font-semibold">
                  Delivery Information
                </h2>
              </div>
              <div className="mb-4">
                <div className="text-sm font-medium mb-2">Saved Addresses</div>
                <div className="space-y-3">
                  {addresses.length === 0 && (
                    <div className="text-gray-500 text-sm">
                      No addresses saved yet.
                    </div>
                  )}
                  {addresses.map((addr, idx) => {
                    const isPrimary =
                      primaryAddress &&
                      JSON.stringify(primaryAddress) === JSON.stringify(addr);
                    return (
                      <div
                        key={idx}
                        className={`border rounded-lg p-4 cursor-pointer transition-all flex justify-between items-center ${
                          selectedAddressIdx === idx
                            ? "border-revive-red bg-white shadow"
                            : "border-gray-200 bg-gray-100"
                        }`}
                        onClick={() => setSelectedAddressIdx(idx)}
                      >
                        <div>
                          <div className="font-semibold mb-1 flex items-center gap-2">
                            {addr.first_name} {addr.last_name}{" "}
                            {isPrimary && (
                              <span className="text-xs text-revive-gold flex items-center gap-1">
                                <Star size={14} className="inline" />
                                Primary
                              </span>
                            )}
                          </div>
                          <div className="text-gray-700 text-sm whitespace-pre-line">
                            {[
                              addr.address,
                              addr.landmark,
                              addr.city,
                              addr.state,
                              addr.postcode,
                              addr.country
                            ].filter(Boolean).join(', ')}
                          </div>
                          <div className="text-xs text-gray-500">
                            Email: {addr.email}, Phone: {addr.phone}
                          </div>
                        </div>
                        <div className="flex flex-col gap-1">
                          {!isPrimary && (
                            <button
                              className="text-xs text-revive-gold hover:underline"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSetPrimary(idx);
                              }}
                            >
                              Set as Primary
                            </button>
                          )}
                          <button
                            className="text-xs text-gray-500 hover:underline"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditAddress(idx);
                            }}
                          >
                            Edit
                          </button>
                          <button
                            className="text-xs text-red-500 hover:underline"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveAddress(idx);
                            }}
                            disabled={removingIdx === idx}
                          >
                            {removingIdx === idx ? "Removing..." : "Remove"}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <button
                  className="mt-4 flex items-center gap-2 px-4 py-2 bg-revive-red hover:bg-revive-red/90 text-white rounded-md font-medium transition-colors"
                  onClick={handleAddAddress}
                >
                  <Plus size={18} /> Add New Address
                </button>
                {/* Address form modal/inline */}
                {showAddressForm && (
                  <form
                    className="mt-6 max-w-lg border rounded-lg p-6 bg-white"
                    onSubmit={handleSaveAddress}
                  >
                    <h3 className="text-lg font-semibold mb-4">
                      {editAddressIdx !== -1
                        ? "Edit Address"
                        : "Add New Address"}
                    </h3>
                    <div className="mb-3">
                      <label className="block text-sm font-medium mb-1">
                        First Name
                      </label>
                      <input
                        type="text"
                        name="first_name"
                        value={addressForm.first_name}
                        onChange={handleAddressInput}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="block text-sm font-medium mb-1">
                        Last Name
                      </label>
                      <input
                        type="text"
                        name="last_name"
                        value={addressForm.last_name}
                        onChange={handleAddressInput}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="block text-sm font-medium mb-1">
                        Address
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={addressForm.address}
                        onChange={handleAddressInput}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="block text-sm font-medium mb-1">
                        Landmark
                      </label>
                      <input
                        type="text"
                        name="landmark"
                        value={addressForm.landmark}
                        onChange={handleAddressInput}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                    </div>
                    <div className="mb-3">
                      <label className="block text-sm font-medium mb-1">
                        City
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={addressForm.city}
                        onChange={handleAddressInput}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="block text-sm font-medium mb-1">
                        State
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={addressForm.state}
                        onChange={handleAddressInput}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="block text-sm font-medium mb-1">
                        Postcode
                      </label>
                      <input
                        type="text"
                        name="postcode"
                        value={addressForm.postcode}
                        onChange={handleAddressInput}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="block text-sm font-medium mb-1">
                        Country
                      </label>
                      <select
                        name="country"
                        value={addressForm.country}
                        onChange={handleAddressInput}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        required
                      >
                        <option value="">Select Country</option>
                        <option value="UAE">UAE</option>
                        <option value="Oman">Oman</option>
                        <option value="Saudi Arabia">Saudi Arabia</option>
                        <option value="Qatar">Qatar</option>
                        <option value="Bahrain">Bahrain</option>
                        <option value="Kuwait">Kuwait</option>
                      </select>
                    </div>
                    <div className="mb-3">
                      <label className="block text-sm font-medium mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={addressForm.email}
                        onChange={handleAddressInput}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="block text-sm font-medium mb-1">
                        Phone
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={addressForm.phone}
                        onChange={handleAddressInput}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        required
                      />
                    </div>
                    <div className="flex gap-2 mt-4">
                      <button
                        type="submit"
                        className="bg-revive-red hover:bg-red-700 text-white font-bold py-2 px-6 rounded-full transition-colors duration-300"
                        disabled={isSavingAddress}
                      >
                        {isSavingAddress
                          ? editAddressIdx !== -1
                            ? "Saving..."
                            : "Saving..."
                          : editAddressIdx !== -1
                          ? "Save Changes"
                          : "Save Address"}
                      </button>
                      <button
                        type="button"
                        className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-6 rounded-full transition-colors duration-300"
                        onClick={() => {
                          setShowAddressForm(false);
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
                            email: '',
                            phone: ''
                          });
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
            {/* Payment Method */}
            <div className="bg-gray-50 rounded-lg border border-gray-200 shadow-sm p-6">
              <div className="flex items-center mb-4">
                <CreditCard className="text-revive-red mr-2" />
                <h2 className="text-lg font-serif font-semibold">
                  Payment Method
                </h2>
              </div>
              <div className="space-y-3">
                {paymentMethods.map((method) => (
                  <label
                    key={method.id}
                    className={`flex items-center border rounded-lg px-4 py-3 cursor-pointer transition-all ${
                      selectedPayment === method.id
                        ? "border-revive-red bg-revive-red/10"
                        : "border-gray-200 bg-white"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method.id}
                      checked={selectedPayment === method.id}
                      onChange={() => setSelectedPayment(method.id)}
                      className="mr-3 accent-revive-red"
                    />
                    {method.icon}
                    <span className="font-medium">{method.label}</span>
                  </label>
                ))}
              </div>
            </div>
            {/* Add Delivery Type selector in the UI, below Payment Method */}
            <div className="bg-gray-50 rounded-lg border border-gray-200 shadow-sm p-6 mt-6">
              <div className="flex items-center mb-4">
                <span className="text-revive-red mr-2">🚚</span>
                <h2 className="text-lg font-serif font-semibold">Delivery Type</h2>
              </div>
              <div className="space-y-3">
                {deliveryTypes.map((type) => (
                  <label
                    key={type.id}
                    className={`flex items-center border rounded-lg px-4 py-3 cursor-pointer transition-all ${
                      selectedDeliveryType === type.id
                        ? 'border-revive-red bg-revive-red/10'
                        : 'border-gray-200 bg-white'
                    }`}
                  >
                    <input
                      type="radio"
                      name="deliveryType"
                      value={type.id}
                      checked={selectedDeliveryType === type.id}
                      onChange={() => setSelectedDeliveryType(type.id)}
                      className="mr-3 accent-revive-red"
                    />
                    <span className="font-medium">{type.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
          {/* Right: Order Summary */}
          <div className="w-full lg:w-[350px]">
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 mb-6">
              <h2 className="text-lg font-serif font-semibold mb-4">
                Order Summary
              </h2>
              {cart.length > 0 && (
                <div className="space-y-3 mb-4">
                  {cart.map((item, index) => (
                    <div key={`${item._id}-${item.selectedSize}-${index}`} className="flex items-center gap-3">
                      <img
                        src={item.image[0]}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded-md"
                      />
                      <div className="flex-1">
                        <div className="font-medium text-sm">{item.name}</div>
                        {item.selectedSize && (
                          <div className="text-xs text-gray-500">
                            Size: {item.selectedSize}
                          </div>
                        )}
                        <div className="text-xs text-gray-500">
                          Qty: {item.quantity}
                        </div>
                      </div>
                      <div className="font-semibold text-revive-red text-sm">
                        {priceSymbol} {((item.price || 0) * item.quantity).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <div className="border-t border-b border-gray-200 py-4 mb-4">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Subtotal</span>
                  <span>
                    {priceSymbol} {subtotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span>
                    {priceSymbol} {shippingCost.toLocaleString()}
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-center mb-6">
                <span className="text-lg font-medium">Total</span>
                <span className="text-xl font-bold text-revive-red">
                  {priceSymbol} {total.toLocaleString()}
                </span>
              </div>
              <button
                className="w-full bg-revive-gold hover:bg-revive-gold/90 text-white font-semibold py-3 rounded-md flex items-center justify-center gap-2 transition-colors text-base disabled:opacity-70 disabled:cursor-not-allowed"
                onClick={handlePlaceOrder}
                disabled={isPlacingOrder}
              >
                {orderStatus === 'redirecting' ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Redirecting to Payment...
                  </>
                ) : orderStatus === 'processing' ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Processing Payment...
                  </>
                ) : isPlacingOrder ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Placing Order...
                  </>
                ) : (
                  <>
                    Place Order
                    <span className="ml-1">&rarr;</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      <Newsletter />
      <Footer />
    </div>
  );
}

export default Checkout;
