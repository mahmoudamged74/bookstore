import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Layout from "./components/Layout/Layout";
import Home from "./pages/Home/Home";
import ScrollToTopButton from "./components/ScrollToTop/ScrollToTop";
import Loader from "./components/Loader/Loader";
import NotificationContainer from "./components/Notification/NotificationContainer";
import AllGames from "./pages/AllGames/AllGames";
import GameDetails from "./pages/gameDetails/gameDetails";
import Offers from "./pages/Offers/Offers";
import About from "./pages/About/About";
import FAQ from "./pages/FAQ/FAQ";
import Contact from "./pages/Contact/Contact";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import OTP from "./pages/OTP/OTP";
import OtpForgetpass from "./pages/OtpForgetpass/OtpForgetpass";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import ResetPassword from "./pages/ResetPassword/ResetPassword";
import AllMostSelling from "./pages/AllMostSelling/AllMostSelling";
import Profile from "./pages/Profile/Profile";
import AllTeacherBooks from "./pages/AllTeacherBooks/AllTeacherBooks";
import AllOffers from "./pages/AllOffers/AllOffers";
import Cart from "./pages/Cart/Cart";
import ShopBooks from "./pages/ShopBooks/ShopBooks";

// ✅ Scroll restoration
function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  useEffect(() => {
    if (hash) {
      const element = document.querySelector(hash);
      if (element) {
        const navbarHeight = 80;
        const elementPosition = element.offsetTop - navbarHeight;
        window.scrollTo({
          top: elementPosition,
          behavior: "smooth",
        });
      }
    }
  }, [hash]);

  return null;
}

export default function App() {
  const { t, i18n, ready } = useTranslation("global");

  // ✅ ظبط اتجاه الموقع مع تغيير اللغة
  useEffect(() => {
    const dir = i18n.language === "ar" ? "rtl" : "ltr";
    document.documentElement.setAttribute("dir", dir);
    document.documentElement.setAttribute("lang", i18n.language);
  }, [i18n.language]);

  // ✅ زرار للتبديل بين اللغات (ممكن تشيله بعدين وتحط مكانه dropdown في الـ Layout)
  const toggleLanguage = () => {
    const newLang = i18n.language === "ar" ? "en" : "ar";
    i18n.changeLanguage(newLang);
    // تأكد من حفظ اللغة في localStorage
    localStorage.setItem("i18nextLng", newLang);
  };

  // ✅ Don't render until i18next is ready
  if (!ready) {
    return <Loader />;
  }

  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Loader />
          <ScrollToTop />
          <ToastContainer position="top-right" autoClose={3000} />

          {/* زرار تجربة التبديل */}
          <div style={{ position: "fixed", top: 10, right: 10, zIndex: 1000 }}>
            <button onClick={toggleLanguage}>{t("change_language")}</button>
          </div>

          <Routes>
            <Route
              path="/"
              element={
                <Layout>
                  <Home />
                </Layout>
              }
            />
            <Route
              path="/games"
              element={
                <Layout>
                  <AllGames />
                </Layout>
              }
            />
            <Route
              path="/book-details/:id"
              element={
                <Layout>
                  <GameDetails />
                </Layout>
              }
            />

            <Route
              path="/offers"
              element={
                <Layout>
                  <Offers />
                </Layout>
              }
            />
            <Route
              path="/shop-books"
              element={
                <Layout>
                  <ShopBooks />
                </Layout>
              }
            />
            <Route
              path="/about"
              element={
                <Layout>
                  <About />
                </Layout>
              }
            />
            <Route
              path="/faq"
              element={
                <Layout>
                  <FAQ />
                </Layout>
              }
            />
            <Route
              path="/contact"
              element={
                <Layout>
                  <Contact />
                </Layout>
              }
            />
            <Route
              path="/cart"
              element={
                <Layout>
                  <Cart />
                </Layout>
              }
            />
            <Route
              path="/all-most-selling"
              element={
                <Layout>
                  <AllMostSelling />
                </Layout>
              }
            />
            <Route
              path="/all-teacher-books"
              element={
                <Layout>
                  <AllTeacherBooks />
                </Layout>
              }
            />
            <Route
              path="/all-offers"
              element={
                <Layout>
                  <AllOffers />
                </Layout>
              }
            />
            <Route
              path="/shop-books"
              element={
                <Layout>
                  <ShopBooks />
                </Layout>
              }
            />

            {/* صفحات المصادقة */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/otp" element={<OTP />} />
            <Route path="/otp-forgetpass" element={<OtpForgetpass />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* صفحة البروفايل */}
            <Route
              path="/profile"
              element={
                <Layout>
                  <Profile />
                </Layout>
              }
            />
          </Routes>

          <ScrollToTopButton />
          <NotificationContainer />
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}
