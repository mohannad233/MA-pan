// i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import ar from './locales/ar.json'; // استيراد الترجمة العربية

i18n.use(initReactI18next).init({
  resources: {
    ar: {
      translation: ar, // تعيين الترجمة العربية
    },
  },
  lng: 'ar', // اللغة الافتراضية
  fallbackLng: 'ar', // اللغة الاحتياطية
  interpolation: {
    escapeValue: false, // التفسير في الترجمة
  },
});

export default i18n;
