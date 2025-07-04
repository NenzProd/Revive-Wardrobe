import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { GoogleAuthButton } from '@/components/auth/GoogleAuthButton'
import { useToast } from '@/hooks/use-toast'
import axios from 'axios'
import { useCartStore } from '@/stores/useCartStore'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { OTPInput } from '@/components/auth/OTPInput'

const Signup = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const setToken = useCartStore(state => state.setToken)
  const token = useCartStore(state => state.token)
  const backendUrl = useCartStore(state => state.backendUrl)
  const navigate = useNavigate()
  const [showPhoneModal, setShowPhoneModal] = useState(false)
  const [pendingCredential, setPendingCredential] = useState(null)
  const [googlePhone, setGooglePhone] = useState('')
  const fetchUser = useCartStore(state => state.fetchUser)
  const [showOtpModal, setShowOtpModal] = useState(false)
  const [otp, setOtp] = useState('')
  const [otpLoading, setOtpLoading] = useState(false)
  const [otpError, setOtpError] = useState('')

  const handleInputChange = e => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const response = await axios.post(
        backendUrl + '/api/user/register',
        {
          name: formData.fullName,
          phone: formData.phoneNumber,
          email: formData.email,
          password: formData.password
        }
      )
      if (response.data.success) {
        setShowOtpModal(true)
        toast({
          title: 'Verify Email',
          description: 'An OTP has been sent to your email. Please verify to complete registration.'
        })
      } else {
        toast({
          title: 'Signup Failed',
          description: response.data.message,
          variant: 'destructive'
        })
      }
    } catch (error) {
      toast({
        title: 'Signup Failed',
        description: error.message,
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignupPhoneRequired = credentialResponse => {
    setPendingCredential(credentialResponse)
    setShowPhoneModal(true)
  }

  const handlePhoneSubmit = async e => {
    e.preventDefault()
    if (!googlePhone || !pendingCredential) return

    try {
      const res = await axios.post(
        backendUrl + '/api/user/google-login',
        {
          credential: pendingCredential.credential,
          signupAllowed: true,
          phone: googlePhone
        }
      )
      if (res.data.success) {
        setToken(res.data.token)
        localStorage.setItem('token', res.data.token)
        await fetchUser(res.data.token)
        toast({ title: 'Signup Successful', description: 'Welcome!' })
        navigate('/')
      } else {
        toast({ title: 'Google Signup Failed', description: res.data.message, variant: 'destructive' })
      }
    } catch (err) {
      toast({ title: 'Google Signup Failed', description: err.message, variant: 'destructive' })
    } finally {
      setShowPhoneModal(false)
      setGooglePhone('')
      setPendingCredential(null)
    }
  }

  const handleOtpSubmit = async e => {
    e.preventDefault()
    setOtpLoading(true)
    setOtpError('')
    try {
      const res = await axios.post(
        backendUrl + '/api/user/verify-email-otp',
        { email: formData.email, otp }
      )
      if (res.data.success) {
        setShowOtpModal(false)
        toast({ title: 'Email Verified', description: 'Your account is now verified. Please log in.' })
        navigate('/login')
      } else {
        setOtpError(res.data.message || 'Invalid OTP')
      }
    } catch (err) {
      setOtpError(err.message)
    } finally {
      setOtpLoading(false)
    }
  }

  useEffect(() => {
    if (token) {
      navigate('/')
    }
  }, [token, navigate])

  return (
    <>
   
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-revive-blush to-white px-4 py-8'>
    <Navbar />
      <div className='w-full max-w-md'>
       
        <Card className='shadow-2xl border-0 bg-white/95 backdrop-blur-sm'>
          <CardHeader className='text-center pb-6'>
            <CardTitle className='text-2xl font-serif text-revive-black'>Create Account</CardTitle>
            <CardDescription className='text-revive-black/60'>
              Sign up to get started
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-6'>
            <GoogleAuthButton isSignup={true} onSignupPhoneRequired={handleGoogleSignupPhoneRequired} />

            <div className='relative'>
              <div className='absolute inset-0 flex items-center'>
                <span className='w-full border-t border-revive-black/20' />
              </div>
              <div className='relative flex justify-center text-xs uppercase'>
                <span className='bg-white px-4 text-revive-black/60 font-medium'>
                  Or continue with
                </span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className='space-y-5'>
              <div className='space-y-2'>
                <Label htmlFor='fullName' className='text-revive-black font-medium'>Full Name</Label>
                <Input
                  id='fullName'
                  name='fullName'
                  type='text'
                  placeholder='Enter your full name'
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className='border-revive-black/30 focus:border-revive-red focus:ring-revive-red'
                  required
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='phoneNumber' className='text-revive-black font-medium'>Phone Number</Label>
                <Input
                  id='phoneNumber'
                  name='phoneNumber'
                  type='tel'
                  placeholder='Enter your phone number'
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  className='border-revive-black/30 focus:border-revive-red focus:ring-revive-red'
                  required
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='email' className='text-revive-black font-medium'>
                  Email <span className='text-revive-black/50 font-normal'></span>
                </Label>
                <Input
                  id='email'
                  name='email'
                  type='email'
                  placeholder='Enter your email'
                  value={formData.email}
                  onChange={handleInputChange}
                  className='border-revive-black/30 focus:border-revive-red focus:ring-revive-red'
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='password' className='text-revive-black font-medium'>Password</Label>
                <div className='relative'>
                  <Input
                    id='password'
                    name='password'
                    type={showPassword ? 'text' : 'password'}
                    placeholder='Create a password'
                    value={formData.password}
                    onChange={handleInputChange}
                    className='border-revive-black/30 focus:border-revive-red focus:ring-revive-red pr-12'
                    required
                  />
                  <Button
                    type='button'
                    variant='ghost'
                    size='sm'
                    className='absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-revive-black/60 hover:text-revive-black'
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className='h-4 w-4' />
                    ) : (
                      <Eye className='h-4 w-4' />
                    )}
                  </Button>
                </div>
              </div>

              <Button
                type='submit'
                className='w-full bg-revive-red hover:bg-revive-red/90 text-white font-medium h-12'
                disabled={isLoading}
              >
                {isLoading ? 'Creating account...' : 'Create Account'}
              </Button>
            </form>

            <div className='text-center text-sm'>
              <span className='text-revive-black/60'>Already have an account?</span>{' '}
              <Link to='/login' className='text-revive-red hover:text-revive-red/80 font-medium transition-colors'>
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
    {showPhoneModal && (
      <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50'>
        <form onSubmit={handlePhoneSubmit} className='bg-white p-6 rounded shadow-lg space-y-4 w-80'>
          <h2 className='text-lg font-semibold text-revive-black'>Enter your phone number</h2>
          <input
            type='tel'
            value={googlePhone}
            onChange={e => setGooglePhone(e.target.value)}
            className='w-full border border-revive-black/30 rounded px-3 py-2 focus:outline-none focus:border-revive-red'
            placeholder='Phone number'
            required
          />
          <div className='flex justify-end'>
            <button
              type='button'
              className='mr-2 px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300'
              onClick={() => setShowPhoneModal(false)}
            >
              Cancel
            </button>
            <button
              type='submit'
              className='px-4 py-2 rounded bg-revive-red text-white hover:bg-revive-red/90'
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    )}
    {showOtpModal && (
      <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50'>
        <form onSubmit={handleOtpSubmit} className='bg-white p-6 rounded shadow-lg space-y-4 w-80'>
          <h2 className='text-lg font-semibold text-revive-black'>Verify Your Email</h2>
          <p className='text-sm text-revive-black/70 mb-2'>Enter the OTP sent to <b>{formData.email}</b></p>
          <OTPInput value={otp} onChange={setOtp} length={6} />
          {otpError && <div className='text-red-500 text-sm'>{otpError}</div>}
          <div className='flex justify-end'>
            <button
              type='button'
              className='mr-2 px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300'
              onClick={() => setShowOtpModal(false)}
            >
              Cancel
            </button>
            <button
              type='submit'
              className='px-4 py-2 rounded bg-revive-red text-white hover:bg-revive-red/90'
              disabled={otpLoading || otp.length !== 6}
            >
              {otpLoading ? 'Verifying...' : 'Verify'}
            </button>
          </div>
        </form>
      </div>
    )}
    <Footer />
    </>
  )
}

export default Signup