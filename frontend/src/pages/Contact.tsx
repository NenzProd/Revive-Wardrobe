import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Newsletter from "../components/Newsletter";
import { Mail, Phone, MapPin, Send, MessageSquare, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [result, setResult] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
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
    
    // Try multiple approaches for better compatibility
    const submitData = {
      access_key: "8fe96749-31d0-42ce-805a-fa6b07f765f2",
      name: formData.name,
      email: formData.email,
      subject: formData.subject,
      message: formData.message,
    };

    try {
      // First try: JSON approach (often works better)
      let response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData)
      });

      // If JSON fails, try FormData approach
      if (!response.ok) {
        const formDataToSend = new FormData();
        formDataToSend.append("access_key", submitData.access_key);
        formDataToSend.append("name", submitData.name);
        formDataToSend.append("email", submitData.email);
        formDataToSend.append("subject", submitData.subject);
        formDataToSend.append("message", submitData.message);

        response = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          body: formDataToSend
        });
      }

      const data = await response.json();

      if (data.success) {
        setResult("Form Submitted Successfully");
        toast({
          title: "Message sent!",
          description: "We'll get back to you within 24 hours.",
        });
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        console.log("Error", data);
        setResult(data.message || "Failed to submit form");
        toast({
          title: "Error",
          description: data.message || "Failed to send message. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error:", error);
      
      // Fallback: Show contact info instead of error
      setResult("Unable to connect to server. Please contact us directly at info@revivewardrobe.com or call +971 52 191 9358");
      toast({
        title: "Connection Issue",
        description: "Please contact us directly using the information provided above.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "Email Us",
      content: "info@revivewardrobe.com",
      description: "Get answers within 24 hours",
    },
    {
      icon: Phone,
      title: "Call Us",
      content: "+971 52 191 9358",
      description: "Sun-Thu, 9AM-6PM UAE Time",
    },
    {
      icon: MapPin,
      title: "Office Address",
      content:
        "Revive Wardrobe FZ-LLC\nCompass Building, Al Shohada Road, Al Hamra Industrial Zone-FZ, Ras Al Khaimah, United Arab Emirates",
      description: "For any queries or assistance, please contact us.",
    },
    {
      icon: MapPin,
      title: "Warehouse Address",
      content:
        "Depoter\nWarehouse 14, street 24, Al Quoz 4 , Dubai, United Arab Emirates",
      description: "For any queries or assistance, please contact us.",
    },
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col pb-[70px] md:pb-0">
      <Navbar />

      <div className="container mx-auto px-4 py-8 flex-grow">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-serif mb-4">Contact Us</h1>
          <div className="w-24 h-1 bg-revive-red mx-auto mb-6"></div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Have questions about our intimate collections? We're here to help
            you find the perfect pieces for your wardrobe.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Contact Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {contactInfo.map((info, index) => (
              <div
                key={index}
                className="bg-gray-50 p-6 rounded-lg shadow-sm text-center"
              >
                <div className="bg-revive-red rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <info.icon className="text-white" size={24} />
                </div>
                <h3 className="font-semibold text-lg mb-2">{info.title}</h3>
                <p className="text-revive-red font-medium mb-1">
                  {info.content}
                </p>
                <p className="text-gray-500 text-sm">{info.description}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Contact Form */}
            <div className="lg:w-2/3">
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center space-x-2 mb-6">
                  <MessageSquare className="text-revive-red" size={24} />
                  <h2 className="text-xl font-semibold">Send us a Message</h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
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
                        Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-revive-red"
                        placeholder="your.email@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Subject *
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-revive-red"
                      placeholder="What's this about?"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Message *
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={6}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-revive-red resize-none"
                      placeholder="Tell us how we can help you..."
                    ></textarea>
                  </div>

                  <div className="space-y-3">
                    <div className="flex gap-3">
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-revive-red hover:bg-red-700 text-white font-bold py-2 px-6 rounded-full transition-colors duration-300 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed flex-1"
                      >
                        <Send size={18} />
                        <span>{isSubmitting ? "Sending..." : "Send Message"}</span>
                      </Button>
                      
                
                    </div>
                    
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

            {/* FAQ Section */}
            <div className="lg:w-1/3">
              <div className="bg-gray-50 rounded-lg shadow-sm p-6">
                <div className="flex items-center space-x-2 mb-6">
                  <Clock className="text-revive-red" size={24} />
                  <h2 className="text-xl font-semibold">Quick Answers</h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">
                      Shipping & Delivery
                    </h3>
                    <p className="text-gray-600 text-sm">
                      We deliver across India within 3-7 business days. Free
                      shipping on orders above ₹2,000.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">
                      Size Guide
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Check our detailed size guide or contact us for
                      personalized sizing assistance.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">
                      Returns & Exchange
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Easy 15-day return policy for unworn items with original
                      tags and packaging.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">
                      Custom Stitching
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Our expert tailors can customize any piece to your
                      measurements. Additional charges apply.
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <p className="text-sm text-gray-500 text-center">
                    <strong>Response Time:</strong>
                    <br />
                    We typically respond within 4-6 hours during business hours.
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

export default Contact;
