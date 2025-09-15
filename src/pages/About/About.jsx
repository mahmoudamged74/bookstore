import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import api from "../../services/api";
import styles from "./About.module.css";

function About() {
  const { t, i18n } = useTranslation("global");
  const [aboutData, setAboutData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAboutData();
  }, [i18n.language]);

  const fetchAboutData = async () => {
    try {
      setLoading(true);
      const response = await api.get("/settings/about-us", {
        headers: {
          lang: i18n.language || "en",
        },
      });

      if (response.data?.status) {
        setAboutData(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching about data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>{t("loading") || "Loading..."}</p>
      </div>
    );
  }

  return (
    <div
      className={`${styles.aboutPage} ${
        i18n.language === "ar" ? styles.rtl : styles.ltr
      }`}
    >
      {/* Hero Section */}
      <section className={styles.heroSection}>
        {/* يمين: النصوص */}
        <div className={styles.right}>
          <h1 className={styles.heroTitle}>
            {t("gamestore.about.hero.title")}
          </h1>
          <p className={styles.heroSubtitle}>
          {aboutData?.about_section}
          </p>
        </div>

        {/* يسار: الصورة */}
        <div className={styles.left}>
          <div className={styles.mainCard}>
            <img
              src={aboutData?.about_image || "/bookPng3.jpg"}
              alt={t("gamestore.about.hero.brand_name")}
              className={styles.mainImg}
            />
            <div className={styles.badge}>
              {t("gamestore.about.hero.brand_name")}
            </div>
          </div>
        </div>
      </section>

      {/* About Content */}
      <section className={styles.aboutContent}>
        <div className={styles.container}>
          <div className={styles.contentGrid}>
            <div className={styles.textContent}>
              <h2 className={styles.sectionTitle}>
                {t("gamestore.about.content.title")}
              </h2>
              {/* <p className={styles.description}>
                {aboutData?.about_section ||
                  t("gamestore.about.content.vision")}
              </p> */}
              <p className={styles.description}>
                {aboutData?.vision_section}
              </p>
              {/* <p className={styles.description}>
                {t("gamestore.about.content.commitment")}
              </p> */}
            </div>
            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <div className={styles.statNumber}>
                  {aboutData?.students || "100K+"}
                </div>
                <div className={styles.statLabel}>
                  {t("gamestore.about.stats.students")}
                </div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statNumber}>
                  {aboutData?.books_count || "3500+"}
                </div>
                <div className={styles.statLabel}>
                  {t("gamestore.about.stats.books")}
                </div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statNumber}>
                  {aboutData?.support || "24/7"}
                </div>
                <div className={styles.statLabel}>
                  {t("gamestore.about.stats.support")}
                </div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statNumber}>
                  {aboutData?.success_rate || "98%"}
                </div>
                <div className={styles.statLabel}>
                  {t("gamestore.about.stats.satisfaction")}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;
