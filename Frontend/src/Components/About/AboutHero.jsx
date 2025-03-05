import React from 'react';
import { motion } from 'framer-motion';
import { FaHeart, FaTruck, FaUserMd } from 'react-icons/fa';

const AboutHero = () => {
  return (
    <section className="hero-section">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1>Delivering Health to Your Doorstep</h1>
        <div className="hero-icons">
          <FaHeart className="hero-icon" />
          <FaTruck className="hero-icon" />
          <FaUserMd className="hero-icon" />
        </div>
        <p className="mission-statement">
          Our mission is to make healthcare accessible to everyone through fast, reliable, 
          and secure medicine delivery. We believe that getting your essential medications 
          should be simple, safe, and stress-free.
        </p>
        <motion.button
          className="cta-button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Get Started
        </motion.button>
      </motion.div>
    </section>
  );
};

export default AboutHero;