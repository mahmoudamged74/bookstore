import React from "react";
import { useLocation } from "react-router-dom";
import TopNav from "../TopNav/TopNav";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";

const Layout = ({ children }) => {
  const location = useLocation();

  // استبعاد الفوتر من صفحة Profile
  const shouldShowFooter = location.pathname !== "/profile";

  return (
    <>
      <TopNav />
      <Navbar />
      {children}
      {shouldShowFooter && <Footer />}
    </>
  );
};

export default Layout;
