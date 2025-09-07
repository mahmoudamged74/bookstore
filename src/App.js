import React, { useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

import TopNav from "./components/TopNav/TopNav";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import Home from "./pages/Home/Home";
import ScrollToTopButton from "./components/ScrollToTop/ScrollToTop";
import Loader from "./components/Loader/Loader";
import NotificationContainer from "./components/Notification/NotificationContainer";
import AllGames from "./pages/AllGames/AllGames";
import GameDetails from "./pages/gameDetails/gameDetails";
import BuyGame from "./pages/BuyGame/BuyGame";
import Offers from "./pages/Offers/Offers";
import About from "./pages/About/About";
import FAQ from "./pages/FAQ/FAQ";
import Auth from "./pages/Auth/Auth";
import AllMostSelling from "./pages/AllMostSelling/AllMostSelling";

function ScrollToTop() {
  const { pathname, hash } = useLocation();
  
  useEffect(() => {
    // Scroll to top when pathname changes
    if (!hash) {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);
  
  useEffect(() => {
    // Handle anchor links
    if (hash) {
      const element = document.querySelector(hash);
      if (element) {
        const navbarHeight = 80; // Approximate navbar height
        const elementPosition = element.offsetTop - navbarHeight;
        window.scrollTo({
          top: elementPosition,
          behavior: 'smooth'
        });
      }
    }
  }, [hash]);
  
  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <Loader />
      <ScrollToTop />
      <TopNav />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/games" element={<AllGames />} />
        <Route path="/book-details" element={<GameDetails />} />
        <Route path="/buy-game" element={<BuyGame />} />
        <Route path="/offers" element={<Offers />} />
        <Route path="/about" element={<About />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/all-most-selling" element={<AllMostSelling />} />
      </Routes>
      <Footer />
      <ScrollToTopButton />
      <NotificationContainer />
    </BrowserRouter>
  );
}
