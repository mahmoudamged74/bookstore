import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import styles from "./Navbar.module.css";
import {
  FaChevronDown,
  FaUser,
  FaSignOutAlt,
  FaShoppingCart,
} from "react-icons/fa";
import api from "../../services/api";
import { showNotification } from "../../utils/notifications";
import { useCart } from "../../context/CartContext";

const Navbar = () => {
  const location = useLocation();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isLightMode, setIsLightMode] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState(null);

  const { i18n, t } = useTranslation("global");
  const { cartCount } = useCart();

  const languages = [
    { code: "ar", name: "العربية", flag: "/Flag_of_Egypt.png" },
    { code: "en", name: "English", flag: "/Flag_of_UK.png" },
  ];

  // ✅ اللغة الحالية
  const currentLang =
    languages.find((l) => l.code === i18n.language) || languages[0];

  const handleLangChange = (lang) => {
    i18n.changeLanguage(lang.code);
    setShowDropdown(false);
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
      if (!savedTheme) {
        localStorage.setItem("theme", "dark");
      }
    }
  }, []);

  // تحقق من حالة تسجيل الدخول
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
      fetchUserProfile();
    } else {
      setIsLoggedIn(false);
      setUserProfile(null);
    }
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get("/auth/get-profile", {
        headers: {
          Authorization: `Bearer ${token}`,
          lang: "en",
        },
      });

      if (response.data.status) {
        setUserProfile(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      localStorage.removeItem("token");
      setIsLoggedIn(false);
      setUserProfile(null);
    }
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.post(
        "/auth/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            lang: "en",
          },
        }
      );

      if (response.data.status) {
        showNotification("success", response.data.message);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setIsLoggedIn(false);
        setUserProfile(null);
        setShowProfileDropdown(false);
        window.location.href = "/";
      } else {
        showNotification("error", response.data.message);
      }
    } catch (error) {
      console.error("Error logging out:", error);
      showNotification("error", "Failed to logout");
    }
  };

  // إغلاق dropdown عند الضغط خارجها
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showDropdown) {
        const langElement = event.target.closest('[class*="lang"]');
        if (!langElement) {
          setShowDropdown(false);
        }
      }
      if (showProfileDropdown) {
        const profileElement = event.target.closest('[class*="profile"]');
        if (!profileElement) {
          setShowProfileDropdown(false);
        }
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [showDropdown, showProfileDropdown]);

  // تغيير الـ Navbar عند التمرير
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      setIsScrolled(scrollTop > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`${styles.navbar} ${isScrolled ? styles.scrolled : ""}`}
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

      {/* Desktop Links */}
      <div className={styles.navLinks}>
        <Link
          to="/"
          className={`${styles.link} ${
            location.pathname === "/" ? styles.active : ""
          }`}
        >
          {t("navbar.home")}
        </Link>
        <Link
          to="/shop-books"
          className={`${styles.link} ${
            location.pathname === "/shop-books" ? styles.active : ""
          }`}
        >
          {t("navbar.shopbooks")}
        </Link>
        <Link
          to="/about"
          className={`${styles.link} ${
            location.pathname === "/about" ? styles.active : ""
          }`}
        >
          {t("navbar.about")}
        </Link>
        <Link
          to="/faq"
          className={`${styles.link} ${
            location.pathname === "/faq" ? styles.active : ""
          }`}
        >
          {t("navbar.faq")}
        </Link>
        <Link
          to="/contact"
          className={`${styles.link} ${
            location.pathname === "/contact" ? styles.active : ""
          }`}
        >
          {t("navbar.contact")}
        </Link>
        <Link to="/cart" className={styles.cartIcon}>
          <FaShoppingCart className={styles.cartIconSymbol} />
          {cartCount > 0 && (
            <span className={styles.cartCount}>{cartCount}</span>
          )}
        </Link>
      </div>

      {/* Mobile Cart */}
      <Link to="/cart" className={styles.mobileCartIcon}>
        <FaShoppingCart className={styles.cartIconSymbol} />
        {cartCount > 0 && <span className={styles.cartCount}>{cartCount}</span>}
      </Link>

      {/* Desktop Auth & Language */}
      <div className={styles.authButtons}>
        {/* Theme Toggle */}
        <button
          className={styles.themeToggle}
          onClick={toggleTheme}
          title={isLightMode ? t("navbar.dark_mode") : t("navbar.light_mode")}
        >
          {isLightMode ? "🌙" : "☀️"}
        </button>

        {/* Language Switcher */}
        <div
          className={styles.lang}
          onClick={() => setShowDropdown((s) => !s)}
          style={{ cursor: "pointer" }}
        >
          <span style={{ color: "white", fontSize: "14px" }}>
            {currentLang.name}
          </span>
          <FaChevronDown style={{ fontSize: "12px", color: "white" }} />
          <img src={currentLang.flag} alt="flag" />
          {showDropdown && (
            <ul className={styles.langDropdown}>
              {languages.map((lang) => (
                <li key={lang.code} onClick={() => handleLangChange(lang)}>
                  <img src={lang.flag} alt={lang.name} />
                  {lang.name}
                </li>
              ))}
            </ul>
          )}
        </div>

        {isLoggedIn ? (
          <div className={styles.profileDropdown}>
            <button
              className={styles.profileButton}
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
            >
              <span className={styles.profileName}>{userProfile?.name}</span>
              <FaChevronDown className={styles.dropdownIcon} />
            </button>
            {showProfileDropdown && (
              <div className={styles.profileMenu}>
                <Link
                  to="/profile"
                  className={styles.profileMenuItem}
                  onClick={() => setShowProfileDropdown(false)}
                >
                  <FaUser />
                  <span>Profile</span>
                </Link>
                <button
                  className={styles.profileMenuItem}
                  onClick={handleLogout}
                >
                  <FaSignOutAlt />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link to="/login" className={styles.login}>
            {t("navbar.login")}
          </Link>
        )}
      </div>

      {/* Hamburger */}
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
              {t("navbar.home")}
            </Link>
            <Link
              to="/shop-books"
              className={`${styles.mobileLink} ${
                location.pathname === "/shop-books" ? styles.active : ""
              }`}
              onClick={() => setIsMobileOpen(false)}
            >
              {t("navbar.shopbooks")}
            </Link>
            <Link
              to="/about"
              className={`${styles.mobileLink} ${
                location.pathname === "/about" ? styles.active : ""
              }`}
              onClick={() => setIsMobileOpen(false)}
            >
              {t("navbar.about")}
            </Link>
            <Link
              to="/faq"
              className={`${styles.mobileLink} ${
                location.pathname === "/faq" ? styles.active : ""
              }`}
              onClick={() => setIsMobileOpen(false)}
            >
              {t("navbar.faq")}
            </Link>

            {/* Language in Mobile */}
            <div
              className={styles.lang}
              onClick={() => setShowDropdown((s) => !s)}
              style={{ cursor: "pointer" }}
            >
              <span style={{ color: "white", fontSize: "14px" }}>
                {currentLang.name}
              </span>
              <FaChevronDown style={{ fontSize: "12px", color: "white" }} />
              <img src={currentLang.flag} alt="flag" />
              {showDropdown && (
                <ul className={styles.langDropdown}>
                  {languages.map((lang) => (
                    <li key={lang.code} onClick={() => handleLangChange(lang)}>
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
                isLightMode ? t("navbar.dark_mode") : t("navbar.light_mode")
              }
            >
              {isLightMode
                ? "🌙 " + t("navbar.dark_mode")
                : "☀️ " + t("navbar.light_mode")}
            </button>

            <div className={styles.mobileAuth}>
              {isLoggedIn ? (
                <>
                  <Link
                    to="/profile"
                    className={styles.login}
                    onClick={() => setIsMobileOpen(false)}
                  >
                    <FaUser />
                    Profile
                  </Link>
                  <button
                    className={styles.logoutBtn}
                    onClick={() => {
                      handleLogout();
                      setIsMobileOpen(false);
                    }}
                  >
                    <FaSignOutAlt />
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className={styles.login}
                  onClick={() => setIsMobileOpen(false)}
                >
                  {t("navbar.login")}
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
