import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import api from "../../services/api";
import styles from "./ForgotPassword.module.css";

const ForgotPassword = () => {
  const { t, i18n, ready } = useTranslation("global");
  const navigate = useNavigate();

  // Don't render until translations are ready
  if (!ready) {
    return <div>Loading...</div>;
  }

  const [formData, setFormData] = useState({
    phone: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.phone) {
      toast.error("Please enter your phone number");
      return;
    }

    setLoading(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("phone", formData.phone);

      const response = await api.post("/auth/sendverifycode", formDataToSend);

      if (response.data.status) {
        toast.success("Verification code sent successfully");
        navigate("/otp-forgetpass", { state: { phone: formData.phone } });
      } else {
        toast.error(
          response.data.message || "Failed to send verification code"
        );
      }
    } catch (error) {
      console.error("Send verification code error:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to send verification code. Please try again."
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
            <h2 className={styles.formTitle}>
              {t("auth.forgot_password.title")}
            </h2>
            <p className={styles.description}>
              {t("auth.forgot_password.description")}
            </p>

            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.inputGroup}>
                <label htmlFor="phone">{t("auth.forgot_password.phone")}</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className={styles.input}
                />
              </div>

              <button
                type="submit"
                className={styles.submitBtn}
                disabled={loading}
              >
                {loading ? "Sending..." : t("auth.forgot_password.submit")}
              </button>
            </form>

            <div className={styles.switchForm}>
              <p>
                {t("auth.forgot_password.remembered")}
                <Link to="/login" className={styles.switchBtn}>
                  {t("auth.forgot_password.login")}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
