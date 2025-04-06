import React from 'react';
import '../../styles.css';
import Header from '../../components/Header/Header';
import Hero from '../../components/Hero/Hero';
import Features from '../../components/Features/Features';
import HowItWorks from '../../components/HowItWorks/HowItWorks';
import Benefits from '../../components/Benefits/Benefits';
import Footer from '../../components/Footer/Footer';

function HomePage() {
  return (
    <div className="app">
      <Header />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <Benefits />
      </main>
      <Footer />
    </div>
  );
}

export default HomePage;
