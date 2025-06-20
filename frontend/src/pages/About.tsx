import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Newsletter from "../components/Newsletter";
import { Store, Truck, CheckCircle, Users, Heart, Leaf } from "lucide-react";

const About = () => {
  const businessFeatures = [
    {
      icon: Store,
      title: "Retail & Online Sales",
      description:
        "Fashion clothing for all occasions through our online store and retail partners.",
    },
    {
      icon: CheckCircle,
      title: "Curated Collections",
      description:
        "Category-specific collections – Casual, Ethnic, Formal, and Accessories.",
    },
    {
      icon: Truck,
      title: "Reliable Fulfillment",
      description:
        "Manual and API-based fulfillment for accurate and timely delivery.",
    },
    {
      icon: Users,
      title: "Customer Service",
      description:
        "Seamless customer service and personalized updates throughout your journey.",
    },
  ];

  const values = [
    {
      icon: Heart,
      title: "Inclusivity",
      description:
        "Fashion that celebrates diversity and fits every body type.",
    },
    {
      icon: Leaf,
      title: "Sustainability",
      description: "Eco-conscious choices that reduce environmental impact.",
    },
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col pt-[64px] md:pt-[88px] pb-[70px] md:pb-0">
      <Navbar />

      <div className="container mx-auto px-4 py-8 flex-grow">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-serif mb-4">About Us</h1>
          <div className="w-24 h-1 bg-revive-red mx-auto mb-6"></div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Revive Wardrobe is more than just a brand – it's a movement toward
            affordable, eco-conscious fashion that feels as good as it looks.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Main Content */}
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-12">
            <h2 className="text-2xl font-serif mb-6 text-center">Our Story</h2>

            <div className="prose max-w-none text-gray-700">
              <p className="mb-4">
                Revive Wardrobe is a Dubai-based online clothing store committed
                to redefining fashion with purpose. We specialize in curated
                collections for women and men that combine modern design,
                sustainable choices, and everyday comfort.
              </p>

              <p className="mb-4">
                Founded with a passion for inclusivity and conscious living,
                Revive Wardrobe is more than just a brand – it's a movement
                toward affordable, eco-conscious fashion that feels as good as
                it looks. Every piece is handpicked with care to ensure style,
                quality, and lasting value.
              </p>

              <p>
                At Revive Wardrobe, we believe fashion should revive confidence,
                express individuality, and support ethical production. We invite
                you to explore a wardrobe that blends elegance, ease, and a
                touch of conscious luxury.
              </p>
            </div>
          </div>

          {/* Business Features */}
          <h2 className="text-2xl font-serif mb-6 text-center">Our Business</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {businessFeatures.map((feature, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg shadow-sm">
                <div className="bg-revive-red rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <feature.icon className="text-white" size={24} />
                </div>
                <h3 className="font-semibold text-lg mb-2 text-center">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-center">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          {/* Our Values */}
          <div className="bg-gray-50 rounded-lg shadow-sm p-8 mb-12">
            <h2 className="text-2xl font-serif mb-8 text-center">Our Values</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {values.map((value, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div className="bg-revive-red rounded-full p-3 w-16 h-16 flex items-center justify-center mb-4">
                    <value.icon className="text-white" size={24} />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{value.title}</h3>
                  <p className="text-gray-600 text-center">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center mb-12">
            <h2 className="text-2xl font-serif mb-4">Join Our Movement</h2>
            <p className="text-gray-600 max-w-2xl mx-auto mb-6">
              Explore our collections and be part of a fashion revolution that
              values style, sustainability, and self-expression.
            </p>
            <a
              href="/shop"
              className="inline-block bg-revive-red hover:bg-red-700 text-white font-bold py-3 px-8 rounded-full transition-colors duration-300"
            >
              Shop Now
            </a>
          </div>
        </div>
      </div>

      <Newsletter />
      <Footer />
    </div>
  );
};

export default About;
