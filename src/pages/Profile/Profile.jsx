import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  FaUser,
  FaEdit,
  FaLock,
  FaSave,
  FaTimes,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import api from "../../services/api";
import { showNotification } from "../../utils/notifications";
import styles from "./Profile.module.css";

const Profile = () => {
  const { t, i18n } = useTranslation("global");
  const dir = i18n?.dir ? i18n.dir() : "ltr";
  const [activeTab, setActiveTab] = useState("profile");
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    parent_phone: "",
    grade_id: "",
    section_id: "",
    city_id: "",
    image: null,
  });
  const [passwordData, setPasswordData] = useState({
    old_password: "",
    new_password: "",
    new_password_confirmation: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    old_password: false,
    new_password: false,
    new_password_confirmation: false,
  });
  const [grades, setGrades] = useState([]);
  const [cities, setCities] = useState([]);
  const [sections, setSections] = useState([]);

  useEffect(() => {
    fetchProfileData();
    fetchGrades();
    fetchCities();
    // if formData.grade_id initially set, fetch sections
    if (formData.grade_id) fetchSections(formData.grade_id);
  }, []);

  const fetchProfileData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        showNotification(
          "error",
          t("auth.profile.please_login") || "Please login first"
        );
        setLoading(false);
        return;
      }

      const response = await api.get("/auth/get-profile", {
        headers: {
          Authorization: `Bearer ${token}`,
          lang: i18n.language || "en",
        },
      });

      if (response.data?.status) {
        setProfileData(response.data.data);
        setFormData({
          name: response.data.data.name || "",
          phone: response.data.data.phone || "",
          parent_phone: response.data.data.parent_phone || "",
          grade_id: response.data.data.grade_id || "",
          section_id: response.data.data.section_id || "",
          city_id: response.data.data.city_id || "",
          image: null,
        });
        if (response.data.data.grade_id) {
          fetchSections(response.data.data.grade_id);
        }
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      showNotification(
        "error",
        t("auth.profile.failed_fetch_profile") || "Failed to fetch profile data"
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchGrades = async () => {
    try {
      const response = await api.get("/settings/grades");
      setGrades(response.data?.data || []);
    } catch (error) {
      console.error("Error fetching grades:", error);
    }
  };

  const fetchCities = async () => {
    try {
      const response = await api.get("/settings/cities");
      setCities(response.data?.data || []);
    } catch (error) {
      console.error("Error fetching cities:", error);
    }
  };

  const fetchSections = async (gradeId) => {
    try {
      if (!gradeId) {
        setSections([]);
        return;
      }
      const response = await api.get(`/settings/sections/${gradeId}`);
      setSections(response.data?.data || []);
    } catch (error) {
      console.error("Error fetching sections:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
      if (name === "grade_id") {
        fetchSections(value);
      }
    }
  };

  const handlePasswordChange = (e) => {
    setPasswordData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleUpdateProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const formDataToSend = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        // include 0 and false as valid, skip null/"" only
        if (value !== null && value !== "") {
          formDataToSend.append(key, value);
        }
      });

      const response = await api.post("/auth/update-profile", formDataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
          lang: i18n.language || "en",
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data?.status) {
        showNotification(
          "success",
          response.data.message || t("auth.profile.updated")
        );
        setEditing(false);
        fetchProfileData();
      } else {
        showNotification(
          "error",
          response.data?.message || t("auth.profile.failed")
        );
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      showNotification(
        "error",
        t("auth.profile.failed_update_profile") || "Failed to update profile"
      );
    }
  };

  const handleUpdatePassword = async () => {
    try {
      const token = localStorage.getItem("token");
      const formDataToSend = new FormData();

      Object.entries(passwordData).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });

      const response = await api.post(
        "/auth/update-password-profile",
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            lang: i18n.language || "en",
          },
        }
      );

      if (response.data?.status) {
        showNotification(
          "success",
          response.data.message || t("auth.profile.password_changed")
        );
        setPasswordData({
          old_password: "",
          new_password: "",
          new_password_confirmation: "",
        });
      } else {
        showNotification(
          "error",
          response.data?.message || t("auth.profile.failed")
        );
      }
    } catch (error) {
      console.error("Error updating password:", error);
      showNotification(
        "error",
        t("auth.profile.failed_update_password") || "Failed to update password"
      );
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
            lang: i18n.language || "en",
          },
        }
      );

      if (response.data?.status) {
        showNotification(
          "success",
          response.data.message || t("auth.profile.logged_out")
        );
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/";
      } else {
        showNotification(
          "error",
          response.data?.message || t("auth.profile.failed")
        );
      }
    } catch (error) {
      console.error("Error logging out:", error);
      showNotification(
        "error",
        t("auth.profile.failed_logout") || "Failed to logout"
      );
    }
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>{t("auth.profile.loading_profile") || "Loading profile..."}</p>
      </div>
    );
  }

  return (
    // set dir attribute on container so CSS [dir="rtl"] rules work
    <div className={styles.profileContainer} dir={dir}>
      <div className={styles.sidebar}>
        <div className={styles.profileHeader}>
          <div className={styles.profileImage}>
            <img
              src={profileData?.image || "/placeholder.png"}
              alt="Profile"
              onError={(e) => {
                e.target.src = "/placeholder.png";
              }}
            />
          </div>
          <h3>{profileData?.name}</h3>
          <p>{profileData?.grade_name}</p>
        </div>

        <nav className={styles.sidebarNav}>
          <button
            className={`${styles.navItem} ${
              activeTab === "profile" ? styles.active : ""
            }`}
            onClick={() => setActiveTab("profile")}
          >
            <FaUser />
            <span>
              {t("auth.profile.profile_information") || "Profile Information"}
            </span>
          </button>
          <button
            className={`${styles.navItem} ${
              activeTab === "password" ? styles.active : ""
            }`}
            onClick={() => setActiveTab("password")}
          >
            <FaLock />
            <span>
              {t("auth.profile.change_password") || "Change Password"}
            </span>
          </button>
        </nav>

        <div className={styles.logoutSection}>
          <button className={styles.logoutBtn} onClick={handleLogout}>
            {t("auth.profile.logout") || "Logout"}
          </button>
        </div>
      </div>

      <div className={styles.mainContent}>
        {activeTab === "profile" && (
          <div className={styles.profileTab}>
            <div className={styles.tabHeader}>
              <h2>
                {t("auth.profile.profile_information") || "Profile Information"}
              </h2>
              <button
                className={styles.editBtn}
                onClick={() => setEditing(!editing)}
              >
                {editing ? <FaTimes /> : <FaEdit />}
                <span>
                  {editing
                    ? t("auth.profile.cancel") || "Cancel"
                    : t("auth.profile.edit") || "Edit"}
                </span>
              </button>
            </div>

            <div className={styles.profileForm}>
              <div className={styles.imageSection}>
                <div className={styles.formGroup}>
                  <label>
                    {t("auth.profile.profile_image") || "Profile Image"}
                  </label>
                  <div className={styles.imageUpload}>
                    <img
                      src={profileData?.image || "/placeholder.png"}
                      alt="Profile"
                      onError={(e) => {
                        e.target.src = "/placeholder.png";
                      }}
                    />
                    {editing && (
                      <input
                        type="file"
                        name="image"
                        accept="image/*"
                        onChange={handleInputChange}
                        className={styles.fileInput}
                      />
                    )}
                  </div>
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>{t("auth.profile.full_name") || "Full Name"}</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    disabled={!editing}
                    className={styles.input}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>
                    {t("auth.profile.phone_number") || "Phone Number"}
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    disabled={!editing}
                    className={styles.input}
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>
                    {t("auth.profile.parent_phone") || "Parent Phone"}
                  </label>
                  <input
                    type="tel"
                    name="parent_phone"
                    value={formData.parent_phone}
                    onChange={handleInputChange}
                    disabled={!editing}
                    className={styles.input}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>{t("auth.profile.grade") || "Grade"}</label>
                  <select
                    name="grade_id"
                    value={formData.grade_id}
                    onChange={handleInputChange}
                    disabled={!editing}
                    className={styles.input}
                  >
                    <option value="">
                      {t("auth.profile.select_grade") || "Select Grade"}
                    </option>
                    {grades.map((grade) => (
                      <option key={grade.id} value={grade.id}>
                        {grade.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>{t("auth.profile.section") || "Section"}</label>
                  <select
                    name="section_id"
                    value={formData.section_id}
                    onChange={handleInputChange}
                    disabled={!editing}
                    className={styles.input}
                  >
                    <option value="">
                      {t("auth.profile.select_section") || "Select Section"}
                    </option>
                    {sections.map((section) => (
                      <option key={section.id} value={section.id}>
                        {section.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label>{t("auth.profile.city") || "City"}</label>
                  <select
                    name="city_id"
                    value={formData.city_id}
                    onChange={handleInputChange}
                    disabled={!editing}
                    className={styles.input}
                  >
                    <option value="">
                      {t("auth.profile.select_city") || "Select City"}
                    </option>
                    {cities.map((city) => (
                      <option key={city.id} value={city.id}>
                        {city.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {editing && (
                <div className={styles.formActions}>
                  <button
                    className={styles.saveBtn}
                    onClick={handleUpdateProfile}
                  >
                    <FaSave />
                    <span>
                      {t("auth.profile.save_changes") || "Save Changes"}
                    </span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "password" && (
          <div className={styles.passwordTab}>
            <div className={styles.tabHeader}>
              <h2>{t("auth.profile.change_password") || "Change Password"}</h2>
            </div>

            <div className={styles.passwordForm}>
              <div className={styles.formGroup}>
                <label>
                  {t("auth.profile.current_password") || "Current Password"}
                </label>
                <div className={styles.passwordInputWrapper}>
                  <input
                    type={showPasswords.old_password ? "text" : "password"}
                    name="old_password"
                    value={passwordData.old_password}
                    onChange={handlePasswordChange}
                    className={styles.input}
                    placeholder={
                      t("auth.profile.enter_current_password") ||
                      "Enter current password"
                    }
                  />
                  <button
                    type="button"
                    className={styles.passwordToggle}
                    onClick={() => togglePasswordVisibility("old_password")}
                    aria-label={
                      showPasswords.old_password
                        ? t("auth.profile.hide") || "Hide"
                        : t("auth.profile.show") || "Show"
                    }
                  >
                    {showPasswords.old_password ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>
                  {t("auth.profile.new_password") || "New Password"}
                </label>
                <div className={styles.passwordInputWrapper}>
                  <input
                    type={showPasswords.new_password ? "text" : "password"}
                    name="new_password"
                    value={passwordData.new_password}
                    onChange={handlePasswordChange}
                    className={styles.input}
                    placeholder={
                      t("auth.profile.enter_new_password") ||
                      "Enter new password"
                    }
                  />
                  <button
                    type="button"
                    className={styles.passwordToggle}
                    onClick={() => togglePasswordVisibility("new_password")}
                    aria-label={
                      showPasswords.new_password
                        ? t("auth.profile.hide") || "Hide"
                        : t("auth.profile.show") || "Show"
                    }
                  >
                    {showPasswords.new_password ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>
                  {t("auth.profile.confirm_new_password") ||
                    "Confirm New Password"}
                </label>
                <div className={styles.passwordInputWrapper}>
                  <input
                    type={
                      showPasswords.new_password_confirmation
                        ? "text"
                        : "password"
                    }
                    name="new_password_confirmation"
                    value={passwordData.new_password_confirmation}
                    onChange={handlePasswordChange}
                    className={styles.input}
                    placeholder={
                      t("auth.profile.confirm_new_password_placeholder") ||
                      "Confirm new password"
                    }
                  />
                  <button
                    type="button"
                    className={styles.passwordToggle}
                    onClick={() =>
                      togglePasswordVisibility("new_password_confirmation")
                    }
                    aria-label={
                      showPasswords.new_password_confirmation
                        ? t("auth.profile.hide") || "Hide"
                        : t("auth.profile.show") || "Show"
                    }
                  >
                    {showPasswords.new_password_confirmation ? (
                      <FaEyeSlash />
                    ) : (
                      <FaEye />
                    )}
                  </button>
                </div>
              </div>

              <div className={styles.formActions}>
                <button
                  className={styles.saveBtn}
                  onClick={handleUpdatePassword}
                >
                  <FaLock />
                  <span>
                    {t("auth.profile.update_password") || "Update Password"}
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
