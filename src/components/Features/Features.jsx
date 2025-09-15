import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import api from "../../services/api";
import styles from "./Features.module.css";

function Features() {
  const { t, i18n } = useTranslation("global");
  const [featuresData, setFeaturesData] = useState(null);
  const [loading, setLoading] = useState(true);

  // بيانات احتياطية في حالة فشل API
  const fallbackData = {
    feature_text: t("features.main_text"),
    features: [
      {
        id: 1,
        title: t("features.support_24h"),
        logo: "/customer-service.png",
      },
      {
        id: 2,
        title: t("features.all_books"),
        logo: "/stack-of-books.png",
      },
      {
        id: 3,
        title: t("features.lowest_shipping"),
        logo: "/pay.png",
      },
      {
        id: 4,
        title: t("features.delivery_anywhere"),
        logo: "/placeholder.png",
      },
      {
        id: 5,
        title: t("features.delivery_time"),
        logo: "/rocket.png",
      },
      {
        id: 6,
        title: t("features.offers_services"),
        logo: "/rocket.png",
      },
    ],
  };

  // جلب بيانات الخصائص من API
  useEffect(() => {
    fetchFeaturesData();
  }, [i18n.language]);

  const fetchFeaturesData = async () => {
    try {
      setLoading(true);
      const response = await api.get("/home/features-section", {
        headers: {
          lang: i18n.language || "en",
        },
      });

      if (response.data?.status && response.data?.data) {
        setFeaturesData(response.data.data);
      } else {
        setFeaturesData(fallbackData);
      }
    } catch (error) {
      console.error("Error fetching features data:", error);
      setFeaturesData(fallbackData);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section
        className={`${styles.features} ${
          i18n.language === "ar" ? styles.rtl : styles.ltr
        }`}
      >
        <div className="container">
          <div className={styles.loading}>
            <div className={styles.spinner}></div>
            <p>{t("loading") || "Loading..."}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className={`${styles.features} ${
        i18n.language === "ar" ? styles.rtl : styles.ltr
      }`}
    >
      <div className="container">
        {/* النص الرئيسي */}
        <div className={styles.header}>
          <p className={styles.mainText}>
            {featuresData?.feature_text || t("features.main_text")}
          </p>
        </div>

        {/* شبكة الكاردات */}
        <div className="row g-4">
          {featuresData?.features?.map((feature) => (
            <div key={feature.id} className="col-lg-4 col-md-6 col-sm-12">
              <div className={styles.featureCard}>
                <div className={styles.iconContainer}>
                  <img
                    src={feature.logo}
                    alt={feature.title}
                    className={styles.icon}
                  />
                </div>
                <h3 className={styles.title}>{feature.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Features;
