import React from 'react';
import HeroSection from '../../components/Hero/HeroSection';
import GameStore from '../../components/GameStore/GameStore';
import Offers from '../../components/Offers/offers';
import MostSelling from '../../components/GameStore/MostSelling';
import Features from '../../components/Features/Features';
const Home = () => {
  return (
    <>
      <HeroSection />
      <GameStore />
      <MostSelling />
      <Offers />
      <Features />
    </>
  );
};

export default Home;
