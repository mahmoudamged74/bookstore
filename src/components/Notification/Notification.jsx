import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import styles from "./Notification.module.css";

const Notification = ({
  id,
  type = "info",
  title,
  message,
  duration = 5000,
  onClose,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const { i18n } = useTranslation("global");
  const dir = i18n?.dir ? i18n.dir() : "ltr";

  useEffect(() => {
    // إظهار الإشعار بعد 100ms
    const showTimer = setTimeout(() => {
      setIsVisible(true);

      // بدء عداد الإغلاق بعد الظهور
      const hideTimer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => clearTimeout(hideTimer);
    }, 100);

    return () => clearTimeout(showTimer);
  }, [duration]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      onClose(id);
    }, 300); // مدة الانيميشن
  };

  const getIcon = () => {
    switch (type) {
      case "success":
        return "✓";
      case "error":
        return "✕";
      case "warning":
        return "⚠";
      case "info":
      default:
        return "ℹ";
    }
  };

  return (
    <div
      className={`${styles.notification} ${styles[type]} ${
        isVisible ? styles.show : ""
      } ${isExiting ? styles.hide : ""}`}
      dir={dir}
    >
      <div className={styles.notificationContent}>
        <div className={styles.iconContainer}>
          <span className={styles.icon}>{getIcon()}</span>
        </div>

        <div className={styles.textContent}>
          {title && <h4 className={styles.title}>{title}</h4>}
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
        <div
          className={styles.progressFill}
          style={{
            animationDuration: `${duration}ms`,
          }}
        ></div>
      </div>
    </div>
  );
};

export default Notification;
