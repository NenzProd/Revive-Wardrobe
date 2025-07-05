import { GoogleLogin } from '@react-oauth/google'
import { useCartStore } from '@/stores/useCartStore'
import { useToast } from '@/hooks/use-toast'
import axios from 'axios'

export function GoogleAuthButton ({ isSignup = false, onSignupPhoneRequired }) {
  const setToken = useCartStore(state => state.setToken)
  const fetchUser = useCartStore(state => state.fetchUser)
  const backendUrl = useCartStore(state => state.backendUrl)
  const { toast } = useToast()

  type GooglePayload = {
    credential: string
    signupAllowed: boolean
    phone?: string
  }

  const handleSuccess = async (credentialResponse, phone) => {
    try {
      const payload: GooglePayload = {
        credential: credentialResponse.credential,
        signupAllowed: !!isSignup
      }
      if (isSignup && phone) payload.phone = phone
      const res = await axios.post(
        backendUrl + '/api/user/google-login',
        payload
      )
      if (res.data.success) {
        setToken(res.data.token)
        localStorage.setItem('token', res.data.token)
        await fetchUser(res.data.token)
        toast({ title: isSignup ? 'Signup Successful' : 'Login Successful', description: 'Welcome!' })
        window.location.href = '/'
      } else if (isSignup && res.data.message === 'Phone number required for signup.' && onSignupPhoneRequired) {
        // Ask for phone, then retry
        onSignupPhoneRequired(credentialResponse)
      } else {
        toast({ title: 'Google Login Failed', description: res.data.message, variant: 'destructive' })
      }
    } catch (err) {
      toast({ title: 'Google Login Failed', description: err.message, variant: 'destructive' })
    }
  }

  return (
    <GoogleLogin
      onSuccess={cred => handleSuccess(cred, undefined)}
      onError={() => toast({ title: 'Google Login Failed', description: 'Try again', variant: 'destructive' })}
      useOneTap
      text={isSignup ? 'signup_with' : 'signin_with'}
    />
  )
}
