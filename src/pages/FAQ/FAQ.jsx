import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import api from "../../services/api";
import styles from "./FAQ.module.css";

function FAQ() {
  const { t, i18n } = useTranslation("global");
  const [openItem, setOpenItem] = useState(null);
  const [faqData, setFaqData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFaqData();
  }, [i18n.language]);

  const fetchFaqData = async () => {
    try {
      setLoading(true);
      const response = await api.get("/settings/faqs", {
        headers: {
          lang: i18n.language || "en",
        },
      });

      if (response.data?.status) {
        setFaqData(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching FAQ data:", error);
      // Fallback to static data if API fails
      setFaqData([
        {
          id: 1,
          question: t("gamestore.faq.questions.how_to_order"),
          answer: t("gamestore.faq.answers.how_to_order"),
        },
        {
          id: 2,
          question: t("gamestore.faq.questions.payment_methods"),
          answer: t("gamestore.faq.answers.payment_methods"),
        },
        {
          id: 3,
          question: t("gamestore.faq.questions.delivery_time"),
          answer: t("gamestore.faq.answers.delivery_time"),
        },
        {
          id: 4,
          question: t("gamestore.faq.questions.return_policy"),
          answer: t("gamestore.faq.answers.return_policy"),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const toggleItem = (id) => {
    console.log("Toggling item:", id, "Current open:", openItem);
    if (openItem === id) {
      // إذا كان نفس الـ item مفتوح، أغلقه
      setOpenItem(null);
    } else {
      // إذا كان item مختلف، افتحه وأغلق الباقي
      setOpenItem(id);
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
      className={`${styles.faqPage} ${
        i18n.language === "ar" ? styles.rtl : styles.ltr
      }`}
    >
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>{t("gamestore.faq.hero.title")}</h1>
          <p className={styles.heroSubtitle}>
            {t("gamestore.faq.hero.subtitle")}
          </p>
        </div>
      </section>

      {/* FAQ Content */}
      <section className={styles.faqContent}>
        <div className={styles.container}>
          <div className={styles.faqList}>
            {faqData.map((item) => (
              <div key={item.id} className={styles.faqItem}>
                <button
                  className={`${styles.faqQuestion} ${
                    openItem === item.id ? styles.active : ""
                  }`}
                  onClick={() => toggleItem(item.id)}
                >
                  <span>{item.question}</span>
                  <span className={styles.arrow}>
                    {openItem === item.id ? "−" : "+"}
                  </span>
                </button>
                <div
                  className={`${styles.faqAnswer} ${
                    openItem === item.id ? styles.open : ""
                  }`}
                >
                  <p>{item.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default FAQ;
