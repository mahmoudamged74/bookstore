import React, { useState, useEffect } from "react";
import styles from "./Footer.module.css";
import { FaXTwitter, FaLinkedin, FaFacebook } from "react-icons/fa6";

const Footer = () => {
  const [isLightMode, setIsLightMode] = useState(false);

  // مراقبة تغيير الثيم
  useEffect(() => {
    const checkTheme = () => {
      const theme = localStorage.getItem('theme');
      setIsLightMode(theme === 'light');
    };

    checkTheme();
    
    // مراقبة تغيير الثيم
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.body, { attributes: true, attributeFilter: ['data-theme'] });
    
    return () => observer.disconnect();
  }, []);
  return (
    <footer className={styles.footer} dir="rtl">
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
              كتب دراسية شاملة لجميع المواد والصفوف الدراسية بأفضل الأسعار.
            </p>
            <div className={styles.social}>
              <a href="#" aria-label="X">
                <FaXTwitter />
              </a>
              <a href="#" aria-label="LinkedIn">
                <FaLinkedin />
              </a>
              <a href="#" aria-label="Facebook">
                <FaFacebook />
              </a>
            </div>
          </div>

          {/* العمود الأوسط: روابط */}
          <nav className={styles.navCol} aria-label="روابط التذييل">
            <a href="/">الرئيسية</a>
            <a href="/bestsellers">الأكثر مبيعاً</a>
            <a href="/about">من نحن</a>
            <a href="/faq">الأسئلة الشائعة</a>
            <a href="/account">حسابي</a>
            <a href="/contact">اتصل بنا</a>
          </nav>

        
        </div>

        <hr className={styles.hr} />

        {/* الصف السفلي */}
        <div className={styles.bottomRow}>
          {/* عمود فارغ لضبط السنتر (يوازي بنية 3 أعمدة) */}
          <div aria-hidden="true" />

          {/* حقوق النشر في المنتصف */}
          <p className={styles.copy}>
            © 2025 Brmja Tech. All rights reserved.
          </p>

          {/* عمود فارغ لضبط السنتر */}
          <div aria-hidden="true" />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
