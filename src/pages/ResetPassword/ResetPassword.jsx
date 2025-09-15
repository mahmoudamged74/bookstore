import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import api from "../../services/api";
import styles from "./ResetPassword.module.css";

const ResetPassword = () => {
  const { t, i18n, ready } = useTranslation("global");
  const navigate = useNavigate();
  const location = useLocation();

  // Don't render until translations are ready
  if (!ready) {
    return <div>Loading...</div>;
  }

  const [formData, setFormData] = useState({
    new_password: "",
    new_password_confirmation: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Get phone number from navigation state
  const phone = location.state?.phone;

  // Redirect to forgot password if no phone number
  useEffect(() => {
    if (!phone) {
      toast.error("Phone number not found. Please try again.");
      navigate("/forgot-password");
    }
  }, [phone, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.new_password || !formData.new_password_confirmation) {
      toast.error("Please fill in all fields");
      return;
    }

    if (formData.new_password !== formData.new_password_confirmation) {
      toast.error("Passwords do not match");
      return;
    }

    if (formData.new_password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("phone", phone);
      formDataToSend.append("new_password", formData.new_password);
      formDataToSend.append(
        "new_password_confirmation",
        formData.new_password_confirmation
      );

      const response = await api.post("/auth/changepassword", formDataToSend);

      if (response.data.status) {
        toast.success(response.data.message || "Password reset successfully");
        navigate("/login");
      } else {
        toast.error(response.data.message || "Password reset failed");
      }
    } catch (error) {
      console.error("Reset password error:", error);
      toast.error(
        error.response?.data?.message ||
          "Password reset failed. Please try again."
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
              {t("auth.reset_password.title")}
            </h2>

            <form onSubmit={handleSubmit} className={styles.form}>
              <div
                className={`${styles.inputGroup} ${styles.passwordInputGroup}`}
              >
                <label htmlFor="new_password">
                  {t("auth.reset_password.new_password")}
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  id="new_password"
                  name="new_password"
                  value={formData.new_password}
                  onChange={handleChange}
                  required
                  className={`${styles.input} ${styles.passwordInput}`}
                  placeholder={t(
                    "auth.reset_password.new_password_placeholder"
                  )}
                />
                <button
                  type="button"
                  className={styles.passwordToggle}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              <div
                className={`${styles.inputGroup} ${styles.passwordInputGroup}`}
              >
                <label htmlFor="new_password_confirmation">
                  {t("auth.reset_password.confirm_password")}
                </label>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="new_password_confirmation"
                  name="new_password_confirmation"
                  value={formData.new_password_confirmation}
                  onChange={handleChange}
                  required
                  className={`${styles.input} ${styles.passwordInput}`}
                  placeholder={t(
                    "auth.reset_password.confirm_password_placeholder"
                  )}
                />
                <button
                  type="button"
                  className={styles.passwordToggle}
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              <button
                type="submit"
                className={styles.submitBtn}
                disabled={loading}
              >
                {loading ? "Resetting..." : t("auth.reset_password.submit")}
              </button>
            </form>

            <div className={styles.switchForm}>
              <p>
                {t("auth.reset_password.remembered")}
                <Link to="/login" className={styles.switchBtn}>
                  {t("auth.reset_password.login")}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
