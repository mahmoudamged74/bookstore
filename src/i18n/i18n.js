// src/i18n.js
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import HttpBackend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";

i18n
  .use(HttpBackend) // Load translations from public folder
  .use(LanguageDetector) // Detect browser language
  .use(initReactI18next)
  .init({
    lng: "ar", // اللغة الافتراضية
    fallbackLng: "ar",
    debug: false, // تعطيل التصحيح لتجنب رسائل الخطأ في الكونسول
    backend: {
      loadPath: "/translations/{{lng}}/global.json",
    },
    detection: {
      order: ["localStorage", "navigator", "htmlTag"],
      caches: ["localStorage"],
      lookupLocalStorage: "i18nextLng", // اسم المفتاح في localStorage
    },
    interpolation: {
      escapeValue: false, // React already escapes by default
    },
    react: {
      useSuspense: false, // تعطيل Suspense لتجنب مشاكل التحميل
    },
    initImmediate: false, // تأكد من التحميل الكامل قبل البدء
  });

// ✅ Set direction and lang after initialization
i18n.on("initialized", () => {
  const lng = i18n.language;
  const dir = lng === "ar" ? "rtl" : "ltr";
  document.documentElement.setAttribute("dir", dir);
  document.documentElement.setAttribute("lang", lng);

  // تأكد من حفظ اللغة في localStorage إذا لم تكن موجودة
  if (!localStorage.getItem("i18nextLng")) {
    localStorage.setItem("i18nextLng", "ar");
  }
});

// ✅ Also update if language changes dynamically
i18n.on("languageChanged", (lng) => {
  const dir = lng === "ar" ? "rtl" : "ltr";
  document.documentElement.setAttribute("dir", dir);
  document.documentElement.setAttribute("lang", lng);

  // تأكد من حفظ اللغة في localStorage
  localStorage.setItem("i18nextLng", lng);
});

export default i18n;
