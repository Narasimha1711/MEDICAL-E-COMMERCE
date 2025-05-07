import React from 'react';
import AboutHero from '../Components/About/AboutHero';
import TeamSection from '../Components/About/TeamSection';
import Features from '../Components/About/Features';
import FAQ from '../Components/About/FAQ';
import Contact from '../Components/About/Contact';
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