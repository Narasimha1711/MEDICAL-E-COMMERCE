import React from 'react';
import AboutHero from '../components/About/AboutHero';
import TeamSection from '../components/About/TeamSection';
import Features from '../components/About/Features';
import FAQ from '../components/About/FAQ';
import Contact from '../components/About/Contact';
import './aboutUs.css'
// import './aboutUs2.css'

const AboutUs = () => {
  return (
    <div className="about-page">
      <AboutHero />
      <TeamSection />
      <Features />
      <FAQ />
      <Contact />
    </div>
  );
};

export default AboutUs;