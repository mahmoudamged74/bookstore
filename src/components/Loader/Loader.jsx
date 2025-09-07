import React, { useState, useEffect } from 'react';
import styles from './Loader.module.css';

const Loader = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if loader was shown before using sessionStorage
    const hasShownLoader = sessionStorage.getItem('hasShownLoader');
    
    if (!hasShownLoader) {
      setIsVisible(true);
      
      // Hide loader after 3 seconds
      const timer = setTimeout(() => {
        setIsVisible(false);
        sessionStorage.setItem('hasShownLoader', 'true');
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, []);

  if (!isVisible) return null;

  return (
    <div className={styles.loaderOverlay}>
      <div className={styles.loaderContainer}>
        {/* Book Animation */}
        <div className={styles.bookAnimation}>
          <div className={styles.book}>
            <div className={styles.bookCover}>
              <div className={styles.bookTitle}>📚</div>
            </div>
            <div className={styles.bookSpine}></div>
            <div className={styles.bookPages}>
              <div className={styles.page}></div>
              <div className={styles.page}></div>
              <div className={styles.page}></div>
            </div>
            <div className={styles.bookmark}></div>
          </div>
        </div>

        {/* Floating Book Elements */}
        <div className={styles.floatingElements}>
          <div className={styles.floatingIcon}>📖</div>
          <div className={styles.floatingIcon}>📚</div>
          <div className={styles.floatingIcon}>✏️</div>
          <div className={styles.floatingIcon}>📝</div>
          <div className={styles.floatingIcon}>🔖</div>
        </div>

        {/* Loading Text */}
        <div className={styles.loadingText}>
          <h2 className={styles.title}>Thanawia Store</h2>
          <p className={styles.subtitle}>جاري تحميل أفضل الكتب والمراجع...</p>
          <div className={styles.progressBar}>
            <div className={styles.progressFill}></div>
          </div>
        </div>

        {/* Background Particles */}
        <div className={styles.particles}>
          {[...Array(20)].map((_, i) => (
            <div key={i} className={styles.particle}></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Loader;
