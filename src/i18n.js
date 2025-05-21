import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

//import ไฟล์ภาษา
import en from "./locales/en/translation.json"
import th from "./locales/th/translation.json"
import es from "./locales/es/translation.json"
import cn from "./locales/cn/translation.json"
import ru from "./locales/ru/translation.json"
import vi from "./locales/vi/translation.json"


i18n
  .use(LanguageDetector) // จำค่าภาษาไว้ใน localStorage/cookie
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      th: { translation: th },
      es: { translation: es },
      cn: { translation: cn },
      ru: { translation: ru },
      vi: { translation: vi }
    },
    fallbackLng: "en",
    interpolation: {
      escapeValue: false // ไม่จำเป็นต้อง escape HTML
    }
  });

export default i18n;