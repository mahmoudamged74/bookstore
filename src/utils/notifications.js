// نظام الإشعارات - يمكن استخدامه في أي مكان في التطبيق

export const showNotification = (options) => {
  if (window.showNotification) {
    return window.showNotification(options);
  }
  console.warn('نظام الإشعارات غير متاح');
  return null;
};

export const showSuccess = (title, message, duration = 5000) => {
  return showNotification({
    type: 'success',
    title,
    message,
    duration
  });
};

export const showError = (title, message, duration = 7000) => {
  return showNotification({
    type: 'error',
    title,
    message,
    duration
  });
};

export const showWarning = (title, message, duration = 6000) => {
  return showNotification({
    type: 'warning',
    title,
    message,
    duration
  });
};

export const showInfo = (title, message, duration = 5000) => {
  return showNotification({
    type: 'info',
    title,
    message,
    duration
  });
};

export const clearAllNotifications = () => {
  if (window.clearAllNotifications) {
    window.clearAllNotifications();
  }
};

// أمثلة على الاستخدام:
// showSuccess('تم بنجاح!', 'تم إضافة الكتاب إلى السلة');
// showError('خطأ!', 'حدث خطأ أثناء معالجة الطلب');
// showWarning('تحذير', 'يجب تسجيل الدخول أولاً');
// showInfo('معلومة', 'تم تحديث البيانات بنجاح');
