import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { OTPInput } from "@/components/auth/OTPInput";
import { useToast } from "@/hooks/use-toast";
import axios from 'axios'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import SEO from '@/components/SEO'

type Step = "enter-contact" | "verify-otp" | "reset-password";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

const ForgotPassword = () => {
  const [step, setStep] = useState<Step>("enter-contact");
  const [contact, setContact] = useState("");
  const [otp, setOtp] = useState("");
  const [passwords, setPasswords] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    newPassword: false,
    confirmPassword: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [error, setError] = useState('')

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('')
    try {
      const res = await axios.post(`${BACKEND_URL}/api/user/forgot-password`, { email: contact })
      if (res.data.success) {
        toast({
          title: 'OTP Sent',
          description: `Verification code sent to your email`,
        });
        setStep('verify-otp');
      } else {
        setError(res.data.message || 'Failed to send OTP')
      }
    } catch (error) {
      setError(error.message)
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    setIsLoading(true);
    setError('')
    try {
      // For now, just move to next step (backend will check OTP on reset)
      setStep('reset-password');
    } catch (error) {
      setError('Invalid OTP')
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast({
        title: "Passwords Don't Match",
        description: "Please make sure both passwords are the same.",
        variant: "destructive",
      });
      return;
    }
    setIsLoading(true);
    setError('')
    try {
      const res = await axios.post(`${BACKEND_URL}/api/user/reset-password`, {
        email: contact,
        otp,
        newPassword: passwords.newPassword
      })
      if (res.data.success) {
        toast({
          title: "Password Reset Successful",
          description: "Your password has been updated successfully.",
        });
        window.location.href = "/login";
      } else {
        setError(res.data.message || 'Password reset failed')
      }
    } catch (error) {
      setError(error.message)
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = (field: "newPassword" | "confirmPassword") => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  return (
    <>
      <SEO 
        title="Forgot Password - Reset Your Password"
        description="Reset your Revive Wardrobe account password. Enter your email to receive a verification code and create a new password."
        keywords="forgot password, reset password, password recovery, account recovery"
        canonical="/forgot-password"
      />
     <Navbar />
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-revive-blush to-white px-4 py-8">
     
      <div className="w-full max-w-md">

        <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader className="pb-6">
            <div className="flex items-center space-x-3">
              <Link to="/login">
                <Button variant="ghost" size="sm" className="text-revive-black hover:bg-revive-black/10">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <div>
                <CardTitle className="text-2xl font-serif text-revive-black">Reset Password</CardTitle>
                <CardDescription className="text-revive-black/60">
                  {step === "enter-contact" && "Enter your contact information"}
                  {step === "verify-otp" && "Enter the verification code"}
                  {step === "reset-password" && "Create your new password"}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {step === "enter-contact" && (
              <form onSubmit={handleSendOTP} className="space-y-5">
                <div className="space-y-3">
                  {error && <div className='text-red-500 text-sm'>{error}</div>}
                  <div className="space-y-2">
                    <Label htmlFor="contact" className="text-revive-black font-medium">
                      Email Address
                    </Label>
                    <Input
                      id="contact"
                      type="email"
                      placeholder="Enter your email"
                      value={contact}
                      onChange={(e) => setContact(e.target.value)}
                      className="border-revive-black/30 focus:border-revive-red focus:ring-revive-red"
                      required
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-revive-red hover:bg-revive-red/90 text-white font-medium h-12"
                  disabled={isLoading}
                >
                  {isLoading ? "Sending..." : "Get OTP"}
                </Button>
              </form>
            )}

            {step === "verify-otp" && (
              <div className="space-y-6">
                <div className="text-center p-4 bg-revive-blush/50 rounded-lg">
                  <p className="text-sm text-revive-black/70 mb-1">
                    We sent a verification code to your email
                  </p>
                  <p className="font-medium text-revive-black">{contact}</p>
                </div>

                <div className="space-y-3">
                  <Label className="text-revive-black font-medium">Enter OTP</Label>
                  <OTPInput
                    value={otp}
                    onChange={setOtp}
                    length={6}
                  />
                  {error && <div className='text-red-500 text-sm'>{error}</div>}
                </div>

                <Button 
                  onClick={handleVerifyOTP} 
                  className="w-full bg-revive-red hover:bg-revive-red/90 text-white font-medium h-12"
                  disabled={isLoading || otp.length !== 6}
                >
                  {isLoading ? "Verifying..." : "Verify OTP"}
                </Button>

                <div className="text-center">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setStep("enter-contact")}
                    className="text-revive-red hover:bg-revive-red/10"
                  >
                    Didn't receive code? Try again
                  </Button>
                </div>
              </div>
            )}

            {step === "reset-password" && (
              <form onSubmit={handleResetPassword} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="newPassword" className="text-revive-black font-medium">New Password</Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      type={showPasswords.newPassword ? "text" : "password"}
                      placeholder="Enter new password"
                      value={passwords.newPassword}
                      onChange={(e) => setPasswords(prev => ({ ...prev, newPassword: e.target.value }))}
                      className="border-revive-black/30 focus:border-revive-red focus:ring-revive-red pr-12"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-revive-black/60 hover:text-revive-black"
                      onClick={() => togglePasswordVisibility("newPassword")}
                    >
                      {showPasswords.newPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-revive-black font-medium">Confirm Password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showPasswords.confirmPassword ? "text" : "password"}
                      placeholder="Confirm new password"
                      value={passwords.confirmPassword}
                      onChange={(e) => setPasswords(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      className="border-revive-black/30 focus:border-revive-red focus:ring-revive-red pr-12"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-revive-black/60 hover:text-revive-black"
                      onClick={() => togglePasswordVisibility("confirmPassword")}
                    >
                      {showPasswords.confirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-revive-red hover:bg-revive-red/90 text-white font-medium h-12"
                  disabled={isLoading}
                >
                  {isLoading ? "Updating..." : "Change Password"}
                </Button>
                {error && <div className='text-red-500 text-sm'>{error}</div>}
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
    <Footer />
    </>
  );
};

export default ForgotPassword;