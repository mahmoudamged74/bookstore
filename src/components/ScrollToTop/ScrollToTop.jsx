import React, { useState, useEffect } from 'react';
import styles from './ScrollToTop.module.css';

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isArabic, setIsArabic] = useState(true); // Default to Arabic

  useEffect(() => {
    // Check if Arabic is selected by looking at navbar
    const checkLanguage = () => {
      const navbar = document.querySelector('nav');
      if (navbar) {
        const isArabicNav = navbar.classList.contains('arabic') || 
                           navbar.className.includes('arabic');
        setIsArabic(isArabicNav);
      }
    };

    checkLanguage();
    
    // Listen for language changes
    const observer = new MutationObserver(checkLanguage);
    observer.observe(document.body, { 
      attributes: true, 
      attributeFilter: ['class'],
      subtree: true 
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <>
      {isVisible && (
        <button
          className={`${styles.scrollToTop} ${isArabic ? styles.arabic : styles.english}`}
          onClick={scrollToTop}
          aria-label={isArabic ? "العودة للأعلى" : "Scroll to top"}
        >
          <span className={styles.arrow}>▲</span>
          <span className={styles.text}>
            أعلى
          </span>
        </button>
      )}
    </>
  );
};

export default ScrollToTop;
