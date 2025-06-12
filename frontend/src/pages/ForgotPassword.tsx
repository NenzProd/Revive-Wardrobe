import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { OTPInput } from "@/components/auth/OTPInput";
import { useToast } from "@/hooks/use-toast";

type Step = "enter-contact" | "verify-otp" | "reset-password";

const ForgotPassword = () => {
  const [step, setStep] = useState<Step>("enter-contact");
  const [contactMethod, setContactMethod] = useState<"email" | "phone">("email");
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

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log("Sending OTP to:", contact);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "OTP Sent",
        description: `Verification code sent to your ${contactMethod}`,
      });
      
      setStep("verify-otp");
    } catch (error) {
      toast({
        title: "Failed to Send OTP",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    setIsLoading(true);

    try {
      console.log("Verifying OTP:", otp);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "OTP Verified",
        description: "Please set your new password",
      });
      
      setStep("reset-password");
    } catch (error) {
      toast({
        title: "Invalid OTP",
        description: "Please check your code and try again.",
        variant: "destructive",
      });
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

    try {
      console.log("Resetting password");
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Password Reset Successful",
        description: "Your password has been updated successfully.",
      });
      
      window.location.href = "/login";
    } catch (error) {
      toast({
        title: "Password Reset Failed",
        description: "Please try again.",
        variant: "destructive",
      });
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-revive-blush to-white px-4 py-8">
      <div className="w-full max-w-md">
        {/* Logo/Brand Section */}
        <div className="text-center mb-8">
          <h1 className="font-serif text-4xl font-bold text-revive-black mb-2">
            REVIVE WARDROBE
          </h1>
          <p className="text-revive-black/70 text-sm">
            Reset Your Password
          </p>
        </div>

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
                  <div className="flex space-x-2">
                    <Button
                      type="button"
                      variant={contactMethod === "email" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setContactMethod("email")}
                      className={`flex-1 ${contactMethod === "email" 
                        ? "bg-revive-red hover:bg-revive-red/90 text-white" 
                        : "border-revive-black/30 text-revive-black hover:bg-revive-black hover:text-white"
                      }`}
                    >
                      <Mail className="h-4 w-4 mr-1" />
                      Email
                    </Button>
                    <Button
                      type="button"
                      variant={contactMethod === "phone" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setContactMethod("phone")}
                      className={`flex-1 ${contactMethod === "phone" 
                        ? "bg-revive-red hover:bg-revive-red/90 text-white" 
                        : "border-revive-black/30 text-revive-black hover:bg-revive-black hover:text-white"
                      }`}
                    >
                      <Phone className="h-4 w-4 mr-1" />
                      Phone
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="contact" className="text-revive-black font-medium">
                      {contactMethod === "email" ? "Email Address" : "Phone Number"}
                    </Label>
                    <Input
                      id="contact"
                      type={contactMethod === "email" ? "email" : "tel"}
                      placeholder={contactMethod === "email" ? "Enter your email" : "Enter your phone number"}
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
                    We sent a verification code to your {contactMethod}
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
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ForgotPassword;