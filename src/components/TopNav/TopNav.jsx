import React, { useRef, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import api from "../../services/api";
import styles from "./TopNav.module.css";
// تم إزالة React Icons واستبدالها بالصور

function TopNav() {
  const canvasRef = useRef();
  const [isLightMode, setIsLightMode] = useState(false);
  const [sliderTexts, setSliderTexts] = useState([]);
  const [socialLinks, setSocialLinks] = useState({});
  const [loading, setLoading] = useState(true);
  const { t, i18n } = useTranslation("global");

  // بيانات احتياطية في حالة فشل API
  const fallbackTexts = [
    { id: 1, text: t("topnav.welcome") },
    { id: 2, text: t("topnav.free_shipping") },
    { id: 3, text: t("topnav.support") },
  ];

  // روابط اجتماعية افتراضية
  const fallbackSocialLinks = {
    facebook_link: "https://facebook.com/thanawyastore",
    whats_link: "https://wa.me/1234567890",
    telegram_link: "https://t.me/thanawyastore",
    instgram_link: "https://instagram.com/thanawyastore",
    tiktok_link: "https://tiktok.com/@thanawyastore",
  };

  // جلب بيانات النصوص المتحركة والروابط الاجتماعية من API
  useEffect(() => {
    fetchSliderTexts();
    fetchSocialLinks();
  }, [i18n.language]);

  const fetchSliderTexts = async () => {
    try {
      setLoading(true);
      const response = await api.get("/settings/sliders-text-navbar", {
        headers: {
          lang: i18n.language || "en",
        },
      });

      if (response.data?.status && response.data?.data) {
        setSliderTexts(response.data.data);
      } else {
        setSliderTexts(fallbackTexts);
      }
    } catch (error) {
      console.error("Error fetching slider texts:", error);
      setSliderTexts(fallbackTexts);
    } finally {
      setLoading(false);
    }
  };

  const fetchSocialLinks = async () => {
    try {
      const response = await api.get("/settings/footer", {
        headers: {
          lang: i18n.language || "en",
        },
      });

      if (response.data?.status && response.data?.data) {
        setSocialLinks(response.data.data);
      } else {
        setSocialLinks(fallbackSocialLinks);
      }
    } catch (error) {
      console.error("Error fetching social links:", error);
      setSocialLinks(fallbackSocialLinks);
    }
  };

  // تحقق من الوضع المظلم/الفاتح
  useEffect(() => {
    const checkTheme = () => {
      const isLight = document.body.getAttribute("data-theme") === "light";
      setIsLightMode(isLight);
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

  // انيميشن النجوم (مبسط بدون Three.js)
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = 70;

    const stars = [];
    const starCount = 30;

    // إنشاء النجوم
    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 1,
        speed: Math.random() * 0.5 + 0.1,
        opacity: Math.random() * 0.8 + 0.2,
      });
    }

    let animationId;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      stars.forEach((star) => {
        star.x -= star.speed;
        if (star.x < 0) {
          star.x = canvas.width;
          star.y = Math.random() * canvas.height;
        }

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
        ctx.fill();
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, []);

  return (
    <section className={styles.topNav}>
      <canvas ref={canvasRef} className={styles.starsCanvas} />

      <div className={styles.container}>
        {/* النص المتحرك */}
        <div className={styles.scrollingWrapper}>
          <div className={styles.scrollingText}>
            {loading ? (
              <span className={styles.textItem}>
                {t("loading") || "Loading..."}
              </span>
            ) : (
              sliderTexts.map((item, idx) => (
                <span key={item.id} className={styles.textItem}>
                  {item.text}
                  {idx !== sliderTexts.length - 1 && (
                    <span className={styles.separator}>|</span>
                  )}
                </span>
              ))
            )}
          </div>
        </div>

        {/* روابط السوشيال ميديا */}
        <div className={styles.socialLinks}>
          {socialLinks.facebook_link && (
            <a
              href={socialLinks.facebook_link}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialLink}
              title="فيسبوك"
            >
              <img
                src="/facebook.png"
                alt="فيسبوك"
                className={styles.socialIcon}
              />
            </a>
          )}
          {socialLinks.whats_link && (
            <a
              href={socialLinks.whats_link}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialLink}
              title="واتساب"
            >
              <img
                src="/whatsapp.png"
                alt="واتساب"
                className={styles.socialIcon}
              />
            </a>
          )}
          {socialLinks.telegram_link && (
            <a
              href={socialLinks.telegram_link}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialLink}
              title="تيليجرام"
            >
              <img
                src="/telegram.png"
                alt="تيليجرام"
                className={styles.socialIcon}
              />
            </a>
          )}
          {socialLinks.instgram_link && (
            <a
              href={socialLinks.instgram_link}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialLink}
              title="إنستجرام"
            >
              <img
                src="/instagram.png"
                alt="إنستجرام"
                className={styles.socialIcon}
              />
            </a>
          )}
          {socialLinks.tiktok_link && (
            <a
              href={socialLinks.tiktok_link}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialLink}
              title="تيك توك"
            >
              <img
                src="/tiktok.png"
                alt="تيك توك"
                className={styles.socialIcon}
              />
            </a>
          )}
        </div>
      </div>
    </section>
  );
}

export default TopNav;
