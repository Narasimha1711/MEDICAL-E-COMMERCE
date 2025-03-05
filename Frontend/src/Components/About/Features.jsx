import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FaRocket, FaCheckCircle, FaMobile, FaHeadset } from 'react-icons/fa';

const Features = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const features = [
    {
      title: 'Quick Delivery',
      description: 'Get your medicines delivered within 2 hours in selected areas',
      icon: <FaRocket className="feature-icon" />
    },
    {
      title: 'Verified Medicines',
      description: '100% authentic medicines from licensed pharmacies',
      icon: <FaCheckCircle className="feature-icon" />
    },
    {
      title: 'Easy to Use',
      description: 'Simple and intuitive app interface for hassle-free ordering',
      icon: <FaMobile className="feature-icon" />
    },
    {
      title: '24/7 Support',
      description: 'Round-the-clock customer service for all your needs',
      icon: <FaHeadset className="feature-icon" />
    }
  ];

  return (
    <section className="features-section" ref={ref}>
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
      >
        Why Choose Us
      </motion.h2>
      <div className="features-grid">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            className="feature-card"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: index * 0.2 }}
            whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
          >
            {feature.icon}
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Features;