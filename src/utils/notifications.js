// نظام الإشعارات - يمكن استخدامه في أي مكان في التطبيق
export const showNotification = (type, message, duration = 3000) => {
  // استخدام النظام المخصص للإشعارات
  if (window.showNotification) {
    return window.showNotification({
      type: type,
      message: message,
      duration: duration,
    });
  }

  // fallback إلى console.log في حالة عدم توفر النظام
  console.log(`[${type.toUpperCase()}] ${message}`);
};

export const showSuccess = (message, duration = 5000) => {
  return showNotification("success", message, duration);
};

export const showError = (message, duration = 7000) => {
  return showNotification("error", message, duration);
};

export const showWarning = (message, duration = 6000) => {
  return showNotification("warning", message, duration);
};

export const showInfo = (message, duration = 5000) => {
  return showNotification("info", message, duration);
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
