import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import api from "../../services/api";
import styles from "./HeroSection.module.css";

function HeroSection() {
  const { t, i18n } = useTranslation("global");
  const [sliderData, setSliderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // بيانات احتياطية في حالة فشل API
  const fallbackData = {
    slider_title: t("hero.title"),
    slider_text: t("hero.subtitle"),
    "sliders-data": [
      { id: 1, slider: "/bookPng.jpg", category_name: t("hero.book_title") },
      { id: 2, slider: "/bookPng2.webp", category_name: t("hero.book_title") },
      { id: 3, slider: "/bookPng3.jpg", category_name: t("hero.book_title") },
    ],
  };

  // جلب بيانات السلايدرز من API
  useEffect(() => {
    fetchSliderData();
  }, [i18n.language]);

  const fetchSliderData = async () => {
    try {
      setLoading(true);
      const response = await api.get("/home/sliders-section", {
        headers: {
          lang: i18n.language || "en",
        },
      });

      if (response.data?.status && response.data?.data) {
        setSliderData(response.data.data);
      } else {
        setSliderData(fallbackData);
      }
    } catch (error) {
      console.error("Error fetching slider data:", error);
      setSliderData(fallbackData);
    } finally {
      setLoading(false);
    }
  };

  // تبديل الصور كل 4 ثواني
  useEffect(() => {
    if (!sliderData) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === sliderData["sliders-data"].length - 1 ? 0 : prevIndex + 1
      );
    }, 4000); // 4 ثواني

    return () => clearInterval(interval);
  }, [sliderData]);

  if (loading) {
    return (
      <section
        className={`${styles.hero} ${
          i18n.language === "ar" ? styles.rtl : styles.ltr
        }`}
      >
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>{t("loading") || "Loading..."}</p>
        </div>
      </section>
    );
  }

  const currentSliderData = sliderData?.["sliders-data"]?.[currentImageIndex];

  return (
    <section
      className={`${styles.hero} ${
        i18n.language === "ar" ? styles.rtl : styles.ltr
      }`}
    >
      {/* النصوص والأزرار */}
      <div className={styles.right}>
        <h1 className={`${styles.title} ${styles.heroTitle}`}>
          {sliderData?.slider_title || t("hero.title")}
        </h1>

        <p className={`${styles.subtitle} ${styles.heroSubtitle}`}>
          {sliderData?.slider_text || t("hero.subtitle")}
        </p>

        <div className={styles.ctaRow}>
          <button className={`${styles.primaryBtn} ${styles.heroButton}`}>
            {t("hero.order_now")}
          </button>
          <button className={`${styles.ghostBtn} ${styles.heroButton}`}>
            {t("hero.register_now")}
          </button>
        </div>
      </div>

      {/* الصورة المتغيرة */}
      <div className={styles.left}>
        <div className={styles.mainCard}>
          <img
            src={currentSliderData?.slider || "/bookPng.jpg"}
            alt={currentSliderData?.category_name || t("hero.book_title")}
            className={styles.mainImg}
            key={currentImageIndex} // لإعادة تحميل الصورة
          />
          <div className={styles.badge}>
            {currentSliderData?.category_name || t("hero.book_title")}
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
