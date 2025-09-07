import React, { useState, useEffect } from "react";
import styles from "./HeroSection.module.css";

function HeroSection() {
  // صور متعددة لمكتبة ثانوية ستور
  const bookImages = [
    { title: "الكتب الدراسية", src: "/bookPng.jpg" },
    { title: "الكتب الدراسية", src: "/bookPng2.webp" },
    { title: "الكتب الدراسية", src: "/bookPng3.jpg" }
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // تبديل الصور كل 4 ثواني
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === bookImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 4000); // 4 ثواني

    return () => clearInterval(interval);
  }, []);

  const currentBookData = bookImages[currentImageIndex];

  return (
    <section className={styles.hero}>
     
      {/* يمين: النصوص والأزرار */}
      <div className={styles.right}>
        <h1 className={styles.title}>
          احصل على <span className={styles.highlight1}>كتبك</span> الدراسية
          <br />
          واستمتع بأفضل <span className={styles.highlight2}>العروض</span>
        </h1>

        <p style={{textAlign: "center"}} className={styles.subtitle}>
          كتب دراسية شاملة لجميع المواد والصفوف الدراسية من الابتدائي حتى الثانوي.
          <br />
          استمتع بتجربة تعليمية متكاملة مع توصيل سريع ومضمون.
        </p>

        <div className={styles.ctaRow}>
          <button className={styles.primaryBtn}>اطلب الآن</button>
          <button className={styles.ghostBtn}>سجل الآن</button>
        </div>
      </div>
      
      {/* يسار: الصورة المتغيرة */}
      <div className={styles.left}>
        <div className={styles.mainCard}>
          <img
            src={currentBookData.src}
            alt={currentBookData.title}
            className={styles.mainImg}
            key={currentImageIndex} // لإعادة تحميل الصورة
          />
          <div className={styles.badge}>{currentBookData.title}</div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
