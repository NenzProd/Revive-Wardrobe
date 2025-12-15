import { GoogleLogin } from '@react-oauth/google'
import { useCartStore } from '@/stores/useCartStore'
import { useToast } from '@/hooks/use-toast'
import axios from 'axios'
import { useState } from 'react'

export function GoogleAuthButton({ isSignup = false }) {
  const setToken = useCartStore(state => state.setToken)
  const fetchUser = useCartStore(state => state.fetchUser)
  const backendUrl = useCartStore(state => state.backendUrl)
  const { toast } = useToast()
  
  const [showPhoneModal, setShowPhoneModal] = useState(false)
  const [googlePhone, setGooglePhone] = useState('')
  const [pendingCredential, setPendingCredential] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  type GooglePayload = {
    credential: string
    signupAllowed: boolean
    phone?: string
  }

  const processLogin = async (credentialResponse, phone?: string) => {
    try {
      const payload: GooglePayload = {
        credential: credentialResponse.credential,
         // Always allow signup if we have the phone number or if it's the first try (we might get 'Phone number required' error)
         // Actually, for Login page, we want to allow signup ONLY if the user is okay with it (which they are if they provide phone)
         // But the backend checks 'signupAllowed'.
         // If we are in 'isSignup=true' mode, we send true.
         // If 'isSignup=false' (Login page), we send true ONLY if we are retrying with phone.
         // Wait, the user request is "it should create me a account rather than giving me error". 
         // So effectively, Login becomes Signup if account doesn't exist.
        signupAllowed: true 
      }
      
      if (phone) payload.phone = phone

      const res = await axios.post(
        backendUrl + '/api/user/google-login',
        payload
      )
      
      if (res.data.success) {
        setToken(res.data.token)
        localStorage.setItem('token', res.data.token)
        await fetchUser(res.data.token)
        toast({ title: 'Success', description: 'Welcome!' })
        
        // Redirect based on cart items
        const currentCart = useCartStore.getState().cart
        if (currentCart && currentCart.length > 0) {
          window.location.href = '/cart'
        } else {
          window.location.href = '/shop'
        }
        return true
      } else if (res.data.message === 'Phone number required for signup.') {
         // This is the key part: if backend says phone needed, we ask user.
         setPendingCredential(credentialResponse)
         setShowPhoneModal(true)
         return false
      } else {
        toast({ title: 'Google Login Failed', description: res.data.message, variant: 'destructive' })
        return false
      }
    } catch (err) {
      toast({ title: 'Google Login Failed', description: err.message, variant: 'destructive' })
      return false
    }
  }

  const handleSuccess = async (credentialResponse) => {
    await processLogin(credentialResponse)
  }

  const handlePhoneSubmit = async (e) => {
    e.preventDefault()
    if (!googlePhone || !pendingCredential) return
    
    setLoading(true)
    const success = await processLogin(pendingCredential, googlePhone)
    setLoading(false)
    
    if (success) {
      setShowPhoneModal(false)
      setGooglePhone('')
      setPendingCredential(null)
    }
  }

  return (
    <>
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={() => toast({ title: 'Google Login Failed', description: 'Try again', variant: 'destructive' })}
        useOneTap
        text={isSignup ? 'signup_with' : 'signin_with'}
      />

      {showPhoneModal && (
        <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50'>
          <form onSubmit={handlePhoneSubmit} className='bg-white p-6 rounded shadow-lg space-y-4 w-80'>
            <h2 className='text-lg font-semibold text-revive-black'>Enter your phone number</h2>
            <p className='text-xs text-gray-600'>We need your phone number to create your account.</p>
            <input
              type='tel'
              value={googlePhone}
              onChange={e => setGooglePhone(e.target.value)}
              className='w-full border border-revive-black/30 rounded px-3 py-2 focus:outline-none focus:border-revive-red'
              placeholder='Phone number'
              required
            />
            <div className='flex justify-center w-full'>
              <button
                type='submit'
                className='px-4 py-2 rounded bg-revive-red text-white hover:bg-revive-red/90 w-full'
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Submit'}
              </button>
            </div>
            <button 
              type="button" 
              onClick={() => setShowPhoneModal(false)}
              className="text-xs text-gray-500 hover:text-gray-700 w-full text-center mt-2"
            >
              Cancel
            </button>
          </form>
        </div>
      )}
    </>
  )
}
