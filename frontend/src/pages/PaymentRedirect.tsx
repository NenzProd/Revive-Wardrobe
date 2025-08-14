import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useCartStore } from '../stores/useCartStore';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function PaymentRedirect() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { backendUrl, token, clearCart } = useCartStore();
  const [isVerifying, setIsVerifying] = useState(true);
  const [verificationResult, setVerificationResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        // Get payment ID from URL parameters
        const paymentId = searchParams.get('checkout');
        if (!paymentId) {
          setVerificationResult({
            success: false,
            message: 'Payment ID not found in URL parameters.'
          });
          setIsVerifying(false);
          return;
        }

        // Get stored order data
        const storedOrderData = localStorage.getItem('paymennt_order_data');
        if (!storedOrderData) {
          setVerificationResult({
            success: false,
            message: 'Order data not found. Please try placing your order again.'
          });
          setIsVerifying(false);
          return;
        }

        const orderData = JSON.parse(storedOrderData);
        
        // Update order data with payment ID from URL
        orderData.paymentId = paymentId;
        
        // Verify payment with backend
        const response = await axios.post(
          backendUrl + '/api/order/verifyPaymennt',
          orderData,
          { headers: { token } }
        );

        if (response.data.success) {
          // Clear cart and stored data
          clearCart();
          localStorage.removeItem('paymennt_order_data');
          
          setVerificationResult({
            success: true,
            message: 'Payment successful! Your order has been placed.'
          });

          toast({
            title: "Payment Successful",
            description: "Your order has been placed successfully.",
          });

          // Redirect to account page after 3 seconds
          setTimeout(() => {
            navigate('/account');
          }, 3000);
        } else {
          setVerificationResult({
            success: false,
            message: response.data.message || 'Payment verification failed.'
          });

          toast({
            title: "Payment Failed",
            description: response.data.message || "Payment verification failed.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error('Payment verification error:', error);
        setVerificationResult({
          success: false,
          message: 'An error occurred while verifying your payment.'
        });

        toast({
          title: "Error",
          description: "An error occurred while verifying your payment.",
          variant: "destructive",
        });
      } finally {
        setIsVerifying(false);
      }
    };

    verifyPayment();
  }, [backendUrl, token, navigate, toast, clearCart, searchParams]);

  return (
    <div className="min-h-screen bg-white flex flex-col pt-[88px]">
      <Navbar />
      <div className="container mx-auto px-4 py-8 flex-grow flex items-center justify-center">
        <div className="max-w-md w-full text-center">
          {isVerifying ? (
            <div className="space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-revive-red mx-auto"></div>
              <h2 className="text-xl font-serif">Verifying Payment...</h2>
              <p className="text-gray-600">Please wait while we confirm your payment.</p>
              <div className="text-sm text-gray-500">
                <p>This may take a few moments...</p>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-revive-red h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
              </div>
            </div>
          ) : verificationResult ? (
            <div className="space-y-4">
              <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center ${
                verificationResult.success ? 'bg-green-100' : 'bg-red-100'
              }`}>
                {verificationResult.success ? (
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </div>
              <h2 className={`text-xl font-serif ${
                verificationResult.success ? 'text-green-600' : 'text-red-600'
              }`}>
                {verificationResult.success ? 'Payment Successful!' : 'Payment Failed'}
              </h2>
              <p className="text-gray-600">{verificationResult.message}</p>
              {verificationResult.success ? (
                <p className="text-sm text-gray-500">Redirecting to your account in 3 seconds...</p>
              ) : (
                <div className="space-y-2">
                  <button
                    onClick={() => navigate('/checkout')}
                    className="w-full bg-revive-red hover:bg-revive-red/90 text-white font-semibold py-2 px-4 rounded-md transition-colors"
                  >
                    Try Again
                  </button>
                  <button
                    onClick={() => navigate('/')}
                    className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-md transition-colors"
                  >
                    Go Home
                  </button>
                </div>
              )}
            </div>
          ) : null}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default PaymentRedirect;