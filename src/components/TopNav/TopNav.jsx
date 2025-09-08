import React, { useRef, useEffect, useState } from "react";
import styles from "./TopNav.module.css";
// تم إزالة React Icons واستبدالها بالصور

function TopNav() {
  const canvasRef = useRef();
  const [isLightMode, setIsLightMode] = useState(false);

  // بيانات ثابتة للمكتبة
  const sliderTexts = [
    { id: 1, text: "📚 كتب دراسية شاملة لجميع المراحل التعليمية" },
    { id: 2, text: "🎯 أفضل الأسعار والخصومات الحصرية" },
    { id: 3, text: "🚚 توصيل سريع ومضمون لجميع أنحاء الجمهورية" },
    { id: 4, text: "⭐ جودة عالية وضمان على جميع المنتجات" },
    { id: 5, text: "📖 مراجع علمية متخصصة للمدرسين والطلاب" },
    { id: 6, text: "🛒 تسوق آمن مع وسائل دفع متعددة" },
  ];

  const socialLinks = {
    facebook: "https://facebook.com/thanawyastore",
    whatsapp: "https://wa.me/1234567890",
    telegram: "https://t.me/thanawyastore",
    instagram: "https://instagram.com/thanawyastore",
    tiktok: "https://tiktok.com/@thanawyastore",
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
            {sliderTexts.map((item, idx) => (
              <span key={item.id} className={styles.textItem}>
                {item.text}
                {idx !== sliderTexts.length - 1 && (
                  <span className={styles.separator}>|</span>
                )}
              </span>
            ))}
          </div>
        </div>

        {/* روابط السوشيال ميديا */}
        <div className={styles.socialLinks}>
          <a
            href={socialLinks.facebook}
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
          <a
            href={socialLinks.whatsapp}
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
          <a
            href={socialLinks.telegram}
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
          <a
            href={socialLinks.instagram}
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
          <a
            href={socialLinks.tiktok}
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
        </div>
      </div>
    </section>
  );
}

export default TopNav;
