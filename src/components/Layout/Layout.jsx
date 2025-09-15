import React from "react";
import TopNav from "../TopNav/TopNav";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";

const Layout = ({ children }) => {
  return (
    <>
      <TopNav />
      <Navbar />
      {children}
      <Footer />
    </>
  );
};

export default Layout;
