import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GoogleAuthButton } from "@/components/auth/GoogleAuthButton";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const [loginMethod, setLoginMethod] = useState<"email" | "phone">("email");
  const [formData, setFormData] = useState({
    emailOrPhone: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Add your authentication logic here
      console.log("Login attempt:", formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Login Successful",
        description: "Welcome back!",
      });
    } catch (error) {
      toast({
        title: "Login Failed",
        description: "Please check your credentials and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
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
            Rediscover Your Style
          </p>
        </div>

        <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl font-serif text-revive-black">Welcome Back</CardTitle>
            <CardDescription className="text-revive-black/60">
              Sign in to your account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <GoogleAuthButton />
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-revive-black/20" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-4 text-revive-black/60 font-medium">
                  Or continue with
                </span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-3">
                <div className="flex space-x-2">
                  <Button
                    type="button"
                    variant={loginMethod === "email" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setLoginMethod("email")}
                    className={`flex-1 ${loginMethod === "email" 
                      ? "bg-revive-red hover:bg-revive-red/90 text-white" 
                      : "border-revive-black/30 text-revive-black hover:bg-revive-black hover:text-white"
                    }`}
                  >
                    <Mail className="h-4 w-4 mr-1" />
                    Email
                  </Button>
                  <Button
                    type="button"
                    variant={loginMethod === "phone" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setLoginMethod("phone")}
                    className={`flex-1 ${loginMethod === "phone" 
                      ? "bg-revive-red hover:bg-revive-red/90 text-white" 
                      : "border-revive-black/30 text-revive-black hover:bg-revive-black hover:text-white"
                    }`}
                  >
                    <Phone className="h-4 w-4 mr-1" />
                    Phone
                  </Button>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="emailOrPhone" className="text-revive-black font-medium">
                    {loginMethod === "email" ? "Email" : "Phone Number"}
                  </Label>
                  <Input
                    id="emailOrPhone"
                    name="emailOrPhone"
                    type={loginMethod === "email" ? "email" : "tel"}
                    placeholder={loginMethod === "email" ? "Enter your email" : "Enter your phone number"}
                    value={formData.emailOrPhone}
                    onChange={handleInputChange}
                    className="border-revive-black/30 focus:border-revive-red focus:ring-revive-red"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-revive-black font-medium">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="border-revive-black/30 focus:border-revive-red focus:ring-revive-red pr-12"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-revive-black/60 hover:text-revive-black"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="flex justify-end">
                <Link
                  to="/forgot-password"
                  className="text-sm text-revive-red hover:text-revive-red/80 font-medium transition-colors"
                >
                  Forgot Password?
                </Link>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-revive-red hover:bg-revive-red/90 text-white font-medium h-12"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <div className="text-center text-sm">
              <span className="text-revive-black/60">Don't have an account?</span>{" "}
              <Link to="/signup" className="text-revive-red hover:text-revive-red/80 font-medium transition-colors">
                Sign up
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;