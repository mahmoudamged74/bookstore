import React, { useState, useEffect } from 'react';
import styles from './Notification.module.css';

const Notification = ({ 
  id, 
  type = 'info', 
  title, 
  message, 
  duration = 5000, 
  onClose 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // إظهار الإشعار بعد تحميل المكون
    const showTimer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    // إخفاء الإشعار تلقائياً
    const hideTimer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, [duration]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      onClose(id);
    }, 300);
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '⚠';
      case 'info':
      default:
        return 'ℹ';
    }
  };

  return (
    <div 
      className={`${styles.notification} ${styles[type]} ${isVisible ? styles.show : ''} ${isExiting ? styles.hide : ''}`}
      dir="rtl"
    >
      <div className={styles.notificationContent}>
        <div className={styles.iconContainer}>
          <span className={styles.icon}>{getIcon()}</span>
        </div>
        
        <div className={styles.textContent}>
          <h4 className={styles.title}>{title}</h4>
          <p className={styles.message}>{message}</p>
        </div>
        
        <button 
          className={styles.closeBtn}
          onClick={handleClose}
          aria-label="إغلاق الإشعار"
        >
          <span className={styles.closeIcon}>×</span>
        </button>
      </div>
      
      <div className={styles.progressBar}>
        <div className={styles.progressFill}></div>
      </div>
    </div>
  );
};

export default Notification;
