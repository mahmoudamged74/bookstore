import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import styles from "./Register.module.css";

const Register = () => {
  const { t, i18n, ready } = useTranslation("global");
  const { register } = useAuth();
  const navigate = useNavigate();

  if (!ready) {
    return <div>Loading...</div>;
  }

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    parent_phone: "",
    grade_id: "",
    section_id: "",
    city_id: "",
    password: "",
    password_confirmation: "",
  });

  const [grades, setGrades] = useState([]);
  const [sections, setSections] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // 🟢 Load grades & cities once when language changes
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [gradesRes, citiesRes] = await Promise.all([
          api.get(`/settings/grades?lang=${i18n.language}`),
          api.get(`/settings/cities?lang=${i18n.language}`),
        ]);
        setGrades(gradesRes.data.data || []);
        setCities(citiesRes.data.data || []);
      } catch (error) {
        console.error("Error loading initial data:", error);
        toast.error("Failed to load data. Please try again.");
      }
    };
    loadInitialData();
  }, [i18n.language]);

  // 🟢 Load sections when grade changes
  useEffect(() => {
    const loadSections = async () => {
      if (!formData.grade_id) return;
      try {
        const res = await api.get(
          `/settings/sections/${formData.grade_id}?lang=${i18n.language}`
        );
        setSections(res.data.data || []);
      } catch (error) {
        console.error("Error loading sections:", error);
        toast.error("Failed to load sections. Please try again.");
      }
    };
    loadSections();
  }, [formData.grade_id, i18n.language]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
      ...(name === "grade_id" && { section_id: "" }), // Reset section when grade changes
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.password_confirmation) {
      toast.error("Passwords do not match");
      return;
    }

    if (
      !formData.name ||
      !formData.phone ||
      !formData.parent_phone ||
      !formData.grade_id ||
      !formData.city_id
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      const result = await register(formData);
      if (result.status) {
        toast.success(result.message);
        navigate("/otp", { state: { phone: formData.phone } });
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error(
        error.response?.data?.message || "Registration failed. Try again."
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
            <h2 className={styles.formTitle}>{t("auth.register.title")}</h2>

            <form onSubmit={handleSubmit} className={styles.form}>
              {/* Full Name - Full Width */}
              <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                <label htmlFor="name">{t("auth.register.full_name")}</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className={styles.input}
                  placeholder={t("auth.register.placeholders.full_name")}
                />
              </div>

              {/* Phone and Parent Phone - Side by Side */}
              <div className={styles.inputRow}>
                <div className={styles.inputGroup}>
                  <label htmlFor="phone">{t("auth.register.phone")}</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className={styles.input}
                    placeholder={t("auth.register.placeholders.phone")}
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label htmlFor="parent_phone">
                    {t("auth.register.parent_phone")}
                  </label>
                  <input
                    type="tel"
                    id="parent_phone"
                    name="parent_phone"
                    value={formData.parent_phone}
                    onChange={handleChange}
                    required
                    className={styles.input}
                    placeholder={t("auth.register.placeholders.parent_phone")}
                  />
                </div>
              </div>

              {/* Grade and Section - Side by Side */}
              <div className={styles.inputRow}>
                <div className={styles.inputGroup}>
                  <label htmlFor="grade_id">{t("auth.register.grade")}</label>
                  <select
                    id="grade_id"
                    name="grade_id"
                    value={formData.grade_id}
                    onChange={handleChange}
                    required
                    className={styles.input}
                  >
                    <option value="">{t("auth.register.select_grade")}</option>
                    {grades.map((grade) => (
                      <option key={grade.id} value={grade.id}>
                        {grade.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={styles.inputGroup}>
                  <label htmlFor="section_id">
                    {t("auth.register.section")}
                  </label>
                  <select
                    id="section_id"
                    name="section_id"
                    value={formData.section_id}
                    onChange={handleChange}
                    className={styles.input}
                    disabled={!formData.grade_id}
                  >
                    <option value="">
                      {t("auth.register.select_section")}
                    </option>
                    {sections.map((section) => (
                      <option key={section.id} value={section.id}>
                        {section.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* City - Full Width */}
              <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                <label htmlFor="city_id">{t("auth.register.city")}</label>
                <select
                  id="city_id"
                  name="city_id"
                  value={formData.city_id}
                  onChange={handleChange}
                  required
                  className={styles.input}
                >
                  <option value="">{t("auth.register.select_city")}</option>
                  {cities.map((city) => (
                    <option key={city.id} value={city.id}>
                      {city.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Password and Confirm Password - Side by Side */}
              <div className={styles.inputRow}>
                <div
                  className={`${styles.inputGroup} ${styles.passwordInputGroup}`}
                >
                  <label htmlFor="password">
                    {t("auth.register.password")}
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className={`${styles.input} ${styles.passwordInput}`}
                    placeholder={t("auth.register.placeholders.password")}
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
                  <label htmlFor="password_confirmation">
                    {t("auth.register.confirm_password")}
                  </label>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="password_confirmation"
                    name="password_confirmation"
                    value={formData.password_confirmation}
                    onChange={handleChange}
                    required
                    className={`${styles.input} ${styles.passwordInput}`}
                    placeholder={t(
                      "auth.register.placeholders.confirm_password"
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
              </div>

              {/* Submit */}
              <button
                type="submit"
                className={styles.submitBtn}
                disabled={loading}
              >
                {loading ? "Creating Account..." : t("auth.register.submit")}
              </button>
            </form>

            <div className={styles.switchForm}>
              <p>
                {t("auth.register.has_account")}
                <Link to="/login" className={styles.switchBtn}>
                  {t("auth.register.login")}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
