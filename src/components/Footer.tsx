
import React from 'react';
import { Facebook, Instagram, Twitter, Linkedin } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';

const Footer = () => {
  return (
    <footer className="bg-revive-black text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-10">
          {/* About */}
          <div>
            <h3 className="text-xl font-serif mb-4 text-white">Revive Wardrobe</h3>
            <p className="text-gray-400 mb-4">
              Elegance reimagined for the modern woman. Discover timeless fashion that empowers and inspires.
            </p>
            <div className="flex space-x-4 mt-6">
              <a href="#" aria-label="Facebook" className="text-revive-gold hover:text-white transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" aria-label="Instagram" className="text-revive-gold hover:text-white transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" aria-label="Twitter" className="text-revive-gold hover:text-white transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" aria-label="LinkedIn" className="text-revive-gold hover:text-white transition-colors">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h3 className="text-xl font-serif mb-4 text-white">Shop</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="/about" className="hover:text-revive-gold transition-colors">About Us</a></li>
              <li><a href="/shop" className="hover:text-revive-gold transition-colors">Collections</a></li>
              <li><a href="/categories" className="hover:text-revive-gold transition-colors">Categories</a></li>
              <li><a href="/blog" className="hover:text-revive-gold transition-colors">Our Blog</a></li>
              <li><a href="/lookbook" className="hover:text-revive-gold transition-colors">Lookbook</a></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-xl font-serif mb-4 text-white">Customer Service</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="/contact" className="hover:text-revive-gold transition-colors">Contact Us</a></li>
              <li><a href="/shipping" className="hover:text-revive-gold transition-colors">Shipping & Returns</a></li>
              <li><a href="/faq" className="hover:text-revive-gold transition-colors">FAQ</a></li>
              <li><a href="/size-guide" className="hover:text-revive-gold transition-colors">Size Guide</a></li>
              <li><a href="/privacy" className="hover:text-revive-gold transition-colors">Privacy Policy</a></li>
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
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-10 pt-8 text-center">
          <div className="text-gray-400 text-sm">
            © {new Date().getFullYear()} REVIVE WARDROBE. All rights reserved.
          </div>
          <div className="text-gray-400 text-sm mt-2">
            Stitched with <FontAwesomeIcon icon={faHeart} className="text-red-500" /> by <a href="https://tensketch.com" className="hover:text-revive-gold transition-colors">TenSketch</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
