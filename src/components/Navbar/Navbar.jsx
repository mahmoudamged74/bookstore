import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import styles from "./Navbar.module.css";
import { FaChevronDown } from "react-icons/fa";

const Navbar = () => {
  const location = useLocation();
  const [showDropdown, setShowDropdown] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isLightMode, setIsLightMode] = useState(false);
  const [selectedLang, setSelectedLang] = useState({
    name: "العربية",
    flag: "/Flag_of_Egypt.png",
  });

  const languages = [
    { name: "العربية", flag: "/Flag_of_Egypt.png" },
    { name: "English", flag: "/Flag_of_UK.png" },
  ];

  const handleLangChange = (lang) => {
    setSelectedLang(lang);
    setShowDropdown(false);
    // TODO: منطق تغيير اللغة (i18n/localStorage/router لاحقًا)
  };

  const toggleTheme = () => {
    const newTheme = !isLightMode;
    setIsLightMode(newTheme);
    if (newTheme) {
      document.documentElement.setAttribute("data-theme", "light");
      document.body.setAttribute("data-theme", "light");
    } else {
      document.documentElement.removeAttribute("data-theme");
      document.body.removeAttribute("data-theme");
    }
    localStorage.setItem("theme", newTheme ? "light" : "dark");
  };

  // تحميل الثيم المحفوظ عند بدء التطبيق
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "light") {
      setIsLightMode(true);
      document.documentElement.setAttribute("data-theme", "light");
      document.body.setAttribute("data-theme", "light");
    } else {
      setIsLightMode(false);
      document.documentElement.removeAttribute("data-theme");
      document.body.removeAttribute("data-theme");
    }
  }, []);

  // إغلاق دروب داون عند الضغط في أي مكان
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showDropdown) {
        const langElement = event.target.closest('[class*="lang"]');
        if (!langElement) {
          setShowDropdown(false);
        }
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [showDropdown]);

  return (
    <nav
      className={styles.navbar}
      style={{
        fontFamily: "Tajawal, sans-serif",
        fontWeight: 500,
        fontSize: "14px",
        lineHeight: "16px",
        letterSpacing: "0%",
        textAlign: "center",
        verticalAlign: "middle",
      }}
    >
      {/* Logo */}
      <div className={styles.logo}>
        <img
          src={isLightMode ? "/bookLogo2.png" : "/bookLogo.png"}
          alt="ThanawyaStore"
          style={{ width: "80px", height: "80px" }}
        />
      </div>

      {/* Desktop Links (تظل ظاهرة لحد 990px) */}
      <div className={styles.navLinks}>
        <Link
          to="/"
          className={`${styles.link} ${
            location.pathname === "/" ? styles.active : ""
          }`}
        >
          الرئيسية
        </Link>
        <Link
          to="/all-most-selling"
          className={`${styles.link} ${
            location.pathname === "/all-most-selling" ? styles.active : ""
          }`}
        >
          الأكثر مبيعاً
        </Link>
        <Link
          to="/about"
          className={`${styles.link} ${
            location.pathname === "/about" ? styles.active : ""
          }`}
        >
          من نحن
        </Link>
        <Link
          to="/faq"
          className={`${styles.link} ${
            location.pathname === "/faq" ? styles.active : ""
          }`}
        >
          الأسئلة الشائعة
        </Link>
        <div className={styles.cartIcon}>
          <span className={styles.cartIconSymbol}>🛒</span>
          <span className={styles.cartCount}>0</span>
        </div>
      </div>

      {/* Desktop Auth & Language */}
      <div className={styles.authButtons}>
        {/* Theme Toggle */}
        <button
          className={styles.themeToggle}
          onClick={toggleTheme}
          title={isLightMode ? "التبديل للوضع المظلم" : "التبديل للوضع الفاتح"}
        >
          {isLightMode ? "🌙" : "☀️"}
        </button>

        {/* Language Switcher (Desktop) */}
        <div
          className={styles.lang}
          onClick={() => setShowDropdown((s) => !s)}
          style={{ cursor: "pointer" }}
        >
          <span style={{ color: "white", fontSize: "14px" }}>
            {selectedLang.name}
          </span>
          <FaChevronDown style={{ fontSize: "12px", color: "white" }} />
          <img src={selectedLang.flag} alt="flag" />
          {showDropdown && (
            <ul className={styles.langDropdown}>
              {languages.map((lang) => (
                <li key={lang.name} onClick={() => handleLangChange(lang)}>
                  <img src={lang.flag} alt={lang.name} />
                  {lang.name}
                </li>
              ))}
            </ul>
          )}
        </div>
        <Link to="/auth" className={styles.login}>
          تسجيل الدخول
        </Link>
        {/* لو محتاج زر إنشاء حساب ارجعه هنا */}
        {/* <button className={styles.signup}>إنشاء حساب</button> */}
      </div>

      {/* Hamburger (يظهر تحت 990px) */}
      <button
        className={`${styles.hamburger} ${
          isMobileOpen ? styles.hamburgerOpen : ""
        }`}
        aria-label="فتح قائمة الموبايل"
        onClick={() => {
          setIsMobileOpen(!isMobileOpen);
          setShowDropdown(false);
        }}
      >
        <span />
      </button>

      {/* Mobile Menu */}
      {isMobileOpen && (
        <div className={styles.mobileMenu}>
          <div className={styles.mobilePanel}>
            <Link
              to="/"
              className={`${styles.mobileLink} ${
                location.pathname === "/" ? styles.active : ""
              }`}
              onClick={() => setIsMobileOpen(false)}
            >
              الرئيسية
            </Link>
            <Link
              to="/all-most-selling"
              className={`${styles.mobileLink} ${
                location.pathname === "/all-most-selling" ? styles.active : ""
              }`}
              onClick={() => setIsMobileOpen(false)}
            >
              الأكثر مبيعاً
            </Link>
            <Link
              to="/about"
              className={`${styles.mobileLink} ${
                location.pathname === "/about" ? styles.active : ""
              }`}
              onClick={() => setIsMobileOpen(false)}
            >
              من نحن
            </Link>
            <Link
              to="/faq"
              className={`${styles.mobileLink} ${
                location.pathname === "/faq" ? styles.active : ""
              }`}
              onClick={() => setIsMobileOpen(false)}
            >
              الأسئلة الشائعة
            </Link>
            <div className={styles.mobileCartIcon}>
              <span className={styles.cartIconSymbol}>🛒</span>
              <span className={styles.cartCount}>0</span>
            </div>

            {/* Language inside mobile */}
            <div
              className={styles.lang}
              onClick={() => setShowDropdown((s) => !s)}
              style={{ cursor: "pointer" }}
            >
              <span style={{ color: "white", fontSize: "14px" }}>
                {selectedLang.name}
              </span>
              <FaChevronDown style={{ fontSize: "12px", color: "white" }} />
              <img src={selectedLang.flag} alt="flag" />
              {showDropdown && (
                <ul className={styles.langDropdown}>
                  {languages.map((lang) => (
                    <li
                      key={lang.name}
                      onClick={() => {
                        handleLangChange(lang);
                      }}
                    >
                      <img src={lang.flag} alt={lang.name} />
                      {lang.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Theme Toggle in Mobile */}
            <button
              className={styles.mobileThemeToggle}
              onClick={() => {
                toggleTheme();
                setIsMobileOpen(false);
              }}
              title={
                isLightMode ? "التبديل للوضع المظلم" : "التبديل للوضع الفاتح"
              }
            >
              {isLightMode ? "🌙 الوضع المظلم" : "☀️ الوضع الفاتح"}
            </button>

            <div className={styles.mobileAuth}>
              <Link
                to="/auth"
                className={styles.login}
                onClick={() => setIsMobileOpen(false)}
              >
                تسجيل الدخول
              </Link>
              {/* <button className={styles.signup} onClick={() => setIsMobileOpen(false)}>إنشاء حساب</button> */}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
