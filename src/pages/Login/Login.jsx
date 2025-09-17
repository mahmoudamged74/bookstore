import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import api from "../../services/api";
import styles from "./Login.module.css";

const Login = () => {
  const { t, i18n, ready } = useTranslation("global");
  const navigate = useNavigate();

  // Don't render until translations are ready
  if (!ready) {
    return <div>Loading...</div>;
  }

  const [formData, setFormData] = useState({
    phone: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.phone || !formData.password) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("phone", formData.phone);
      formDataToSend.append("password", formData.password);

      const response = await api.post("/auth/login", formDataToSend);

      if (response.data.status === "success") {
        // Store token and user data in localStorage
        localStorage.setItem("token", response.data.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.data));

        toast.success(response.data.message);
        window.location.href = "/";
      } else {
        toast.error(response.data.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error(
        error.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`${styles.authContainer} ${
        i18n.language === "ar" ? styles.rtl : styles.ltr
      }`}
    >
      <div className={styles.authWrapper}>
        {/* Left Side - Logo */}
        <div className={styles.logoSection}>
          <div className={styles.logoContainer}>
            <img src="/bookLogo.png" alt="Logo" className={styles.logo} />
            <h1 className={styles.logoText}>{t("auth.logo.title")}</h1>
            <p className={styles.logoSubtext}>{t("auth.logo.subtitle")}</p>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className={styles.formSection}>
          <div className={styles.formContainer}>
            <h2 className={styles.formTitle}>{t("auth.login.title")}</h2>

            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.inputGroup}>
                <label htmlFor="phone">{t("auth.login.phone")}</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className={styles.input}
                  placeholder={t("auth.login.phone_placeholder")}
                />
              </div>

              <div
                className={`${styles.inputGroup} ${styles.passwordInputGroup}`}
              >
                <label htmlFor="password">{t("auth.login.password")}</label>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className={`${styles.input} ${styles.passwordInput}`}
                  placeholder={t("auth.login.password_placeholder")}
                />
                <button
                  type="button"
                  className={styles.passwordToggle}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              <div className={styles.forgotPassword}>
                <Link to="/forgot-password" className={styles.forgotLink}>
                  {t("auth.login.forgot_password")}
                </Link>
              </div>

              <button
                type="submit"
                className={styles.submitBtn}
                disabled={loading}
              >
                {loading ? "Logging in..." : t("auth.login.submit")}
              </button>
            </form>

            <div className={styles.switchForm}>
              <p>
                {t("auth.login.no_account")}
                <Link to="/register" className={styles.switchBtn}>
                  {t("auth.login.create_account")}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
