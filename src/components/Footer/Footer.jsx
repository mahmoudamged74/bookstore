import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import api from "../../services/api";
import styles from "./Footer.module.css";

const Footer = () => {
  const { t, i18n } = useTranslation("global");
  const [isLightMode, setIsLightMode] = useState(false);
  const [footerData, setFooterData] = useState(null);

  // مراقبة تغيير الثيم
  useEffect(() => {
    const checkTheme = () => {
      const theme = localStorage.getItem("theme");
      setIsLightMode(theme === "light");
    };

    checkTheme();

    // مراقبة تغيير الثيم
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => observer.disconnect();
  }, []);

  // جلب بيانات الفوتر من API
  useEffect(() => {
    fetchFooterData();
  }, [i18n.language]);

  const fetchFooterData = async () => {
    try {
      const response = await api.get("/settings/footer", {
        headers: {
          lang: i18n.language || "en",
        },
      });

      if (response.data?.status) {
        setFooterData(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching footer data:", error);
    }
  };
  return (
    <footer
      className={`${styles.footer} ${
        i18n.language === "ar" ? styles.rtl : styles.ltr
      }`}
    >
      <div className={styles.inner}>
        {/* الصف العلوي */}
        <div className={styles.topRow}>
          {/* العمود الأيسر: لوجو + نص + سوشيال */}
          <div className={styles.brandCol}>
            <img
              src={isLightMode ? "/bookLogo2.png" : "/bookLogo.png"}
              alt="ThanawyaStore"
              className={styles.logo}
            />
            <p className={styles.desc}>
              {footerData?.footerText || t("footer.description")}
            </p>
            <div className={styles.social}>
              {footerData?.facebook_link && (
                <a
                  href={footerData.facebook_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="فيسبوك"
                >
                  <img
                    src="/facebook.png"
                    alt="فيسبوك"
                    className={styles.socialIcon}
                  />
                </a>
              )}
              {footerData?.whats_link && (
                <a
                  href={footerData.whats_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="واتساب"
                >
                  <img
                    src="/whatsapp.png"
                    alt="واتساب"
                    className={styles.socialIcon}
                  />
                </a>
              )}
              {footerData?.instgram_link && (
                <a
                  href={footerData.instgram_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="إنستجرام"
                >
                  <img
                    src="/instagram.png"
                    alt="إنستجرام"
                    className={styles.socialIcon}
                  />
                </a>
              )}
              {footerData?.tiktok_link && (
                <a
                  href={footerData.tiktok_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="تيك توك"
                >
                  <img
                    src="/tiktok.png"
                    alt="تيك توك"
                    className={styles.socialIcon}
                  />
                </a>
              )}
              {footerData?.telegram_link && (
                <a
                  href={footerData.telegram_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="تلجرام"
                >
                  <img
                    src="/telegram.png"
                    alt="تلجرام"
                    className={styles.socialIcon}
                  />
                </a>
              )}
            </div>
          </div>

          {/* العمود الأوسط: روابط */}
          <nav className={styles.navCol} aria-label={t("footer.nav_label")}>
            <a href="/">{t("navbar.home")}</a>
            <a href="/shop-books">{t("navbar.shopbooks")}</a>
            <a href="/about">{t("navbar.about")}</a>
            <a href="/faq">{t("navbar.faq")}</a>
            <a href="/contact">{t("footer.contact_us")}</a>
            <a href="/profile">{t("footer.my_account")}</a>
          </nav>
        </div>

        <hr className={styles.hr} />

        {/* الصف السفلي */}
        <div className={styles.bottomRow}>
          {/* عمود فارغ لضبط السنتر (يوازي بنية 3 أعمدة) */}
          <div aria-hidden="true" />

          {/* حقوق النشر في المنتصف */}
          <p className={styles.copy}>{t("footer.copyright")}</p>

          {/* عمود فارغ لضبط السنتر */}
          <div aria-hidden="true" />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
