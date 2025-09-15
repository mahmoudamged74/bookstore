import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import api from "../../services/api";
import Notification from "./Notification";
import styles from "./NotificationContainer.module.css";

const NotificationContainer = () => {
  const [notifications, setNotifications] = useState([]);
  const [hasShownMessage, setHasShownMessage] = useState(false);
  const { i18n } = useTranslation("global");

  // إضافة إشعار جديد
  const addNotification = (notification) => {
    const id = Date.now() + Math.random();
    const newNotification = {
      id,
      type: "info",
      duration: 4000,
      ...notification,
    };

    // السماح بأكثر من إشعار
    setNotifications((prev) => [...prev, newNotification]);
    return id;
  };

  // إزالة إشعار
  const removeNotification = (id) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id)
    );
  };

  // إزالة جميع الإشعارات
  const clearAllNotifications = () => {
    setNotifications([]);
  };

  // جلب الرسائل من API مرة واحدة فقط
  useEffect(() => {
    if (!hasShownMessage) {
      fetchMessages();
    }
  }, [hasShownMessage]);

  // إعادة تعيين الرسالة عند تغيير اللغة
  useEffect(() => {
    setHasShownMessage(false);
  }, [i18n.language]);

  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = { lang: i18n.language || "en" };
      if (token) headers.Authorization = `Bearer ${token}`;

      const response = await api.get("/settings/message", { headers });

      if (response.data?.status && response.data?.data) {
        addNotification({
          type: "info",
          message: response.data.data.content,
          duration: 10000,
        });
        setHasShownMessage(true);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);

      if (error.response?.status === 401) {
        try {
          const response = await api.get("/settings/message", {
            headers: { lang: i18n.language || "en" },
          });

          if (response.data?.status && response.data?.data) {
            addNotification({
              type: "info",
              message: response.data.data.content,
              duration: 10000,
            });
            setHasShownMessage(true);
          }
        } catch (retryError) {
          console.error("Error fetching messages without token:", retryError);
        }
      }
    }
  };

  // إتاحة الدوال في window لاستخدامها في أي مكان
  useEffect(() => {
    window.showNotification = addNotification;
    window.clearAllNotifications = clearAllNotifications;

    return () => {
      delete window.showNotification;
      delete window.clearAllNotifications;
    };
  }, []);

  return (
    <div className={styles.container}>
      {notifications.length > 0 && (
        <div className={styles.notificationsWrapper}>
          {notifications.map((notification) => (
            <Notification
              key={notification.id}
              {...notification}
              onClose={removeNotification}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationContainer;
