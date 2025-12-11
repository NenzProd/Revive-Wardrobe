import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Newsletter from "../components/Newsletter";
import { Scissors, MapPin, Phone, Mail, Send, Package, Ruler, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import SEO from "../components/SEO";

const StichingService = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    addressType: "",
    fullAddress: "",
    landmark: "",
    city: "",
    pinCode: "",
    serviceType: "",
    itemCount: "",
    message: "",
  });
  const [result, setResult] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setResult("Sending....");
    
    const submitData = {
      access_key: "8fe96749-31d0-42ce-805a-fa6b07f765f2",
      subject: "New Stitching Service Request",
      name: formData.name,
      phone: formData.phoneNumber,
      address_type: formData.addressType,
      full_address: formData.fullAddress,
      landmark: formData.landmark,
      city: formData.city,
      pin_code: formData.pinCode,
      service_type: formData.serviceType,
      item_count: formData.itemCount,
      message: formData.message,
    };

    try {
      let response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData)
      });

      if (!response.ok) {
        const formDataToSend = new FormData();
        Object.entries(submitData).forEach(([key, value]) => {
          formDataToSend.append(key, value);
        });

        response = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          body: formDataToSend
        });
      }

      const data = await response.json();

      if (data.success) {
        setResult("Stitching Service Request Submitted Successfully");
        toast({
          title: "Request submitted!",
          description: "We'll contact you within 24 hours to discuss your stitching requirements.",
        });
        setFormData({
          name: "",
          phoneNumber: "",
          addressType: "",
          fullAddress: "",
          landmark: "",
          city: "",
          pinCode: "",
          serviceType: "",
          itemCount: "",
          message: "",
        });
      } else {
        console.log("Error", data);
        setResult(data.message || "Failed to submit request");
        toast({
          title: "Error",
          description: data.message || "Failed to send request. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error:", error);
      setResult("Unable to connect to server. Please contact us directly at info@revivewardrobe.com or call +971 58 244 7684");
      toast({
        title: "Connection Issue",
        description: "Please contact us directly using the information provided.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const serviceTypes = [
    "Ethnic Elegance",
    "Graceful Abayas", 
    "Designer Jalabiya"
  ];

  const addressTypes = [
    "Home",
    "Office",
    "Other"
  ];

  const serviceFeatures = [
    {
      icon: Scissors,
      title: "Expert Tailoring",
      description: "Professional stitching with attention to detail",
    },
    {
      icon: Ruler,
      title: "Perfect Fit",
      description: "Custom measurements for the perfect fit",
    },
    {
      icon: Package,
      title: "Premium Fabrics",
      description: "High-quality materials for lasting comfort",
    },
    {
      icon: Clock,
      title: "Quick Turnaround",
      description: "Fast delivery within 7-14 business days",
    },
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col pb-[70px] md:pb-0">
      <SEO 
        title="Custom Stitching Service - Expert Tailoring"
        description="Get custom stitching services at Revive Wardrobe. Expert tailors create beautiful ethnic wear, abayas, and jalabiya with precision and care."
        keywords="custom stitching, tailoring service, custom clothing, bespoke fashion, alterations, custom abayas, buy clothes online dubai, online fashion store uae, dubai clothing store, modest fashion dubai, shein dubai uae online, online clothes shopping uae, abaya online uae, zara uae online, shein online shopping dubai, matalan uae online, order clothes online dubai, best abaya shops in Dubai, Dubai abaya online worldwide shipping, abaya shop Dubai online, luxury abaya Dubai online"
        canonical="/stitching-service"
      />
      <Navbar />

      <div className="container mx-auto px-4 py-8 flex-grow">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-serif mb-4">Custom Stitching Service</h1>
          <div className="w-24 h-1 bg-revive-red mx-auto mb-6"></div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Get your favorite designs custom-tailored to perfection. Our expert artisans 
            create beautiful ethnic wear, abayas, and jalabiya with precision and care.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Service Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {serviceFeatures.map((feature, index) => (
              <div
                key={index}
                className="bg-gray-50 p-6 rounded-lg shadow-sm text-center"
              >
                <div className="bg-revive-red rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <feature.icon className="text-white" size={24} />
                </div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-gray-500 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Stitching Service Form */}
            <div className="lg:w-2/3">
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center space-x-2 mb-6">
                  <Scissors className="text-revive-red" size={24} />
                  <h2 className="text-xl font-semibold">Request Custom Stitching</h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Personal Information */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Name *
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-revive-red"
                          placeholder="Your full name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          name="phoneNumber"
                          value={formData.phoneNumber}
                          onChange={handleInputChange}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-revive-red"
                          placeholder="+971 XX XXX XXXX"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Address Information */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Address Information</h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Address Type *
                          </label>
                          <select
                            name="addressType"
                            value={formData.addressType}
                            onChange={handleInputChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-revive-red"
                          >
                            <option value="">Select address type</option>
                            {addressTypes.map((type) => (
                              <option key={type} value={type}>
                                {type}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            City *
                          </label>
                          <input
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleInputChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-revive-red"
                            placeholder="Your city"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Full Address *
                        </label>
                        <textarea
                          name="fullAddress"
                          value={formData.fullAddress}
                          onChange={handleInputChange}
                          required
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-revive-red resize-none"
                          placeholder="Building name, floor, apartment/office number, street name, area"
                        ></textarea>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Landmark
                          </label>
                          <input
                            type="text"
                            name="landmark"
                            value={formData.landmark}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-revive-red"
                            placeholder="Nearby landmark"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Pin Code *
                          </label>
                          <input
                            type="text"
                            name="pinCode"
                            value={formData.pinCode}
                            onChange={handleInputChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-revive-red"
                            placeholder="6-digit pin code"
                            pattern="[0-9]{6}"
                            maxLength={6}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Service Details */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Service Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Service Type *
                        </label>
                        <select
                          name="serviceType"
                          value={formData.serviceType}
                          onChange={handleInputChange}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-revive-red"
                        >
                          <option value="">Select service type</option>
                          {serviceTypes.map((type) => (
                            <option key={type} value={type}>
                              {type}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          How many Items do you have to Stitch? *
                        </label>
                        <input
                          type="number"
                          name="itemCount"
                          value={formData.itemCount}
                          onChange={handleInputChange}
                          required
                          min="1"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-revive-red"
                          placeholder="Number of items"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Additional Message */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Message
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-revive-red resize-none"
                      placeholder="Special instructions, preferred measurements, fabric preferences, delivery timeline, or any other details..."
                    ></textarea>
                  </div>

                  <div className="space-y-3">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-revive-red hover:bg-red-700 text-white font-bold py-2 px-6 rounded-full transition-colors duration-300 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed w-full md:w-auto"
                    >
                      <Send size={18} />
                      <span>{isSubmitting ? "Submitting Request..." : "Submit Stitching Request"}</span>
                    </Button>
                    
                    {result && (
                      <div className={`text-sm text-center p-3 rounded-md ${
                        result.includes("Successfully") 
                          ? "bg-green-100 text-green-700 border border-green-200" 
                          : "bg-red-100 text-red-700 border border-red-200"
                      }`}>
                        {result}
                      </div>
                    )}
                  </div>
                </form>
              </div>
            </div>

            {/* Information Section */}
            <div className="lg:w-1/3">
              <div className="bg-gray-50 rounded-lg shadow-sm p-6">
                <div className="flex items-center space-x-2 mb-6">
                  <Package className="text-revive-red" size={24} />
                  <h2 className="text-xl font-semibold">Service Information</h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">
                      Processing Time
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Custom stitching takes 7-14 business days depending on complexity 
                      and item count. Rush orders available on request.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">
                      Measurement Process
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Our team will schedule a visit to take precise measurements 
                      or guide you through self-measurement techniques.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">
                      Service Areas
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Currently serving Dubai, Sharjah, Ajman, and Ras Al Khaimah. 
                      Contact us for other Emirates.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">
                      Quality Guarantee
                    </h3>
                    <p className="text-gray-600 text-sm">
                      All our custom pieces come with quality assurance and 
                      free minor alterations within 15 days.
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Phone size={16} />
                    <span>+971 58 244 7684</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-500 mt-2">
                    <Mail size={16} />
                    <span>info@revivewardrobe.com</span>
                  </div>
                  <p className="text-sm text-gray-500 text-center mt-4">
                    <strong>Response Time:</strong>
                    <br />
                    We'll contact you within 24 hours to confirm your request and schedule measurements.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Newsletter />
      <Footer />
    </div>
  );
};

export default StichingService;