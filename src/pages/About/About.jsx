import React from "react";
import styles from "./About.module.css";

function About() {
  return (
    <div className={styles.aboutPage} dir="rtl">
      {/* Hero Section */}
      <section className={styles.heroSection}>
   
      

        {/* يمين: النصوص */}
        <div className={styles.right}>
          <h1 className={styles.heroTitle}>من نحن</h1>
          <p className={styles.heroSubtitle}>
            متجر ثانوية ستور الرائد في عالم الكتب الدراسية والأدوات التعليمية. 
            نحن نقدم أفضل تجربة شراء للكتب والأدوات التعليمية في مصر 
            مع ضمان الجودة والأمان في كل معاملة.
          </p>
        </div>
        
        {/* يسار: الصورة */}
        <div className={styles.left}>
          <div className={styles.mainCard}>
            <img src="/bookPng3.jpg" alt="ثانوية ستور" className={styles.mainImg} />
            <div className={styles.badge}>ثانوية ستور</div>
          </div>
        </div>
      </section>

      {/* About Content */}
      <section className={styles.aboutContent}>
        <div className={styles.container}>
          <div className={styles.contentGrid}>
            <div className={styles.textContent}>
              <h2 className={styles.sectionTitle}>رؤيتنا ورسالتنا</h2>
              <p className={styles.description}>
                رؤيتنا هي أن نكون الوجهة الأولى والأكثر ثقة للطلاب والمعلمين في مصر 
                والوطن العربي، من خلال توفير أفضل الكتب الدراسية والأدوات التعليمية 
                التي تساهم في تطوير العملية التعليمية.
              </p>
              <p className={styles.description}>
                رسالتنا تتمثل في دعم المسيرة التعليمية للطلاب من خلال توفير كتب 
                عالية الجودة وأدوات تعليمية متطورة، مع تقديم خدمة عملاء متميزة 
                وضمان رضا العملاء في كل خطوة.
              </p>
              <p className={styles.description}>
                نحن ملتزمون بتقديم تجربة تسوق استثنائية مع ضمان الجودة والأمان، 
                ونسعى دائماً لتطوير خدماتنا وتوسيع مكتبتنا لتشمل أحدث المناهج 
                وأشهر الكتب التعليمية.
              </p>
            </div>
            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <div className={styles.statNumber}>50K+</div>
                <div className={styles.statLabel}>طالب وطالبة</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statNumber}>1000+</div>
                <div className={styles.statLabel}>كتاب متاح</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statNumber}>24/7</div>
                <div className={styles.statLabel}>دعم فني</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statNumber}>98%</div>
                <div className={styles.statLabel}>معدل الرضا</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;
