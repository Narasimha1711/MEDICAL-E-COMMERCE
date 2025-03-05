import React from 'react';
import { FaArrowRight } from 'react-icons/fa';

const HeroSection = () => {
  return (
    <div className="relative h-[600px] bg-gradient-to-r from-blue-600 to-blue-400">
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative container mx-auto px-4 h-full flex items-center">
        <div className="max-w-2xl text-white">
          <h5 className="text-xl font-semibold mb-4">YOUR TRUSTED HEALTHCARE PARTNER</h5>
          <h1 className="text-5xl font-bold mb-6">Quality Healthcare at Your Doorstep</h1>
          <p className="text-lg mb-8 opacity-90">
            Get up to 40% off on your first order. Free delivery on orders above ₹499.
            24/7 customer support and expert consultation available.
          </p>
          <button className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold 
                           flex items-center gap-2 hover:bg-blue-50 transition-colors">
            Shop Now <FaArrowRight />
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;