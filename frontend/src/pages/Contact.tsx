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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message sent!",
      description: "We'll get back to you within 24 hours.",
    });
    setFormData({ name: "", email: "", subject: "", message: "" });
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
      title: "Warehouse Address",
      content:
        "Revive Wardrobe FZ-LLC\nCompass Building, Al Shohada Road, Al Hamra Industrial Zone-FZ, Ras Al Khaimah, United Arab Emirates",
      description: "For any queries or assistance, please contact us.",
    },
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col pt-[64px] md:pt-[88px] pb-[70px] md:pb-0">
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

                  <Button
                    type="submit"
                    className="bg-revive-red hover:bg-red-700 text-white font-bold py-2 px-6 rounded-full transition-colors duration-300 flex items-center space-x-2"
                  >
                    <Send size={18} />
                    <span>Send Message</span>
                  </Button>
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
