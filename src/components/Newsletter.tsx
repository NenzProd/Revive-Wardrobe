
import React from 'react';
import { Mail } from 'lucide-react';

const Newsletter = () => {
  return (
    <section className="py-16 bg-revive-blush/30">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <Mail size={36} className="text-revive-red mx-auto mb-4" />
          <h2 className="text-3xl md:text-4xl font-serif mb-4">Join Our Community</h2>
          <p className="text-gray-600 mb-8">
            Subscribe to receive exclusive offers, early access to new collections, and style inspirations tailored just for you.
          </p>
          <form className="flex flex-col sm:flex-row gap-2 max-w-xl mx-auto">
            <input
              type="email"
              placeholder="Your email address"
              className="px-4 py-3 bg-white border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-revive-red flex-grow"
              required
            />
            <button
              type="submit"
              className="bg-revive-red hover:bg-opacity-90 text-white px-6 py-3 rounded transition-all font-medium"
            >
              Subscribe
            </button>
          </form>
          <p className="text-sm text-gray-500 mt-4">
            By subscribing, you agree to our Privacy Policy and consent to receive updates from our company.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
