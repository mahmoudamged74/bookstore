import React, { useState, useEffect } from 'react';
import Notification from './Notification';
import styles from './NotificationContainer.module.css';

const NotificationContainer = () => {
  const [notifications, setNotifications] = useState([]);

  // إضافة إشعار جديد
  const addNotification = (notification) => {
    const id = Date.now() + Math.random();
    const newNotification = {
      id,
      type: 'info',
      duration: 5000,
      ...notification
    };
    
    setNotifications(prev => [...prev, newNotification]);
    return id;
  };

  // إزالة إشعار
  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  // إزالة جميع الإشعارات
  const clearAllNotifications = () => {
    setNotifications([]);
  };

  // إضافة الإشعارات للـ window object للاستخدام في أي مكان
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
          {notifications.map(notification => (
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
