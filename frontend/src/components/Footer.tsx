import React from 'react';
import { Facebook, Instagram, Twitter, Linkedin } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';


const Footer = () => {
  return (
    <footer className="bg-revive-black text-white pt-16 pb-8">
      <div className="container mx-auto px-6 sm:px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-10">
          {/* About */}
          <div>
            <h3 className="text-xl font-serif mb-4 text-white">Revive Wardrobe</h3>
            <p className="text-gray-400 mb-4">
              Elegance reimagined for the modern woman. Discover timeless fashion that empowers and inspires.
            </p>
            <div className="flex space-x-4 mt-6">
              <a href="https://www.facebook.com/revivewardrobe" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-revive-gold hover:text-white transition-colors">
                <Facebook size={20} />
              </a>
              <a href="https://www.instagram.com/revivewardrobe_uae" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-revive-gold hover:text-white transition-colors">
                <Instagram size={20} />
              </a>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h3 className="text-xl font-serif mb-4 text-white">Shop</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="/" className="hover:text-revive-gold transition-colors">Home</a></li>
              <li><a href="/about" className="hover:text-revive-gold transition-colors">About Us</a></li>
              <li><a href="/shop" className="hover:text-revive-gold transition-colors">Collections</a></li>
              <li><a href="/blog" className="hover:text-revive-gold transition-colors">Blog</a></li>
              <li><a href="/contact" className="hover:text-revive-gold transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Policies Links */}
          <div>
            <h3 className="text-xl font-serif mb-4 text-white">Policies</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="/terms" className="hover:text-revive-gold transition-colors">Terms & Conditions</a></li>
              <li><a href="/privacy" className="hover:text-revive-gold transition-colors">Privacy & Cookie Policy</a></li>
              <li><a href="/shipping" className="hover:text-revive-gold transition-colors">Shipping, Delivery & Payment Policies</a></li>
              <li><a href="/returns" className="hover:text-revive-gold transition-colors">Returns, Refunds & Cancellation Policy</a></li>
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-xl font-serif mb-4 text-white">Contact Us</h3>
            <address className="not-italic text-gray-400 space-y-2">
              <p>Ras Al Khaimah</p>
              <p>United Arab Emirates</p>
              {/* <p className="pt-2">
                <a href="tel:+971521919358" className="hover:text-revive-gold transition-colors">+971521919358</a>
              </p> */}
              <p>
                <a href="mailto:info@revivewardrobe.com" className="hover:text-revive-gold transition-colors">info@revivewardrobe.com</a>
              </p>
            </address>
            <div className="mt-6">
              <p className="text-gray-400 mb-2">Pay easily with:</p>
              <div className="flex space-x-3 items-center payment-icons">
                <img src="/pay_icons/visa_icon.png" alt="Visa" className="h-6" />
                <img src="/pay_icons/mastercard_icon.png" alt="MasterCard" className="h-6" />
                <img src="/pay_icons/unionPay_icon.png" alt="UnionPay" className="h-6" />
                <img src="/pay_icons/american_express.png" alt="American Express" className="h-6" />
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-10 pt-8 pb-8">
          <div className="flex flex-col md:flex-row items-center">
            {/* Center copyright text */}
            <div className="text-center flex-grow mb-4 md:mb-0">
              <div className="text-gray-400 text-sm">
                © 2025 REVIVE WARDROBE. All rights reserved.
              </div>
              <div className="text-gray-400 text-sm mt-2">
                Stitched with <FontAwesomeIcon icon={faHeart} className="text-red-500" /> by <a href="https://tensketch.com" className="hover:text-revive-gold transition-colors">TenSketch</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
