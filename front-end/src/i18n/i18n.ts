import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import HOME_EN from "../locales/en/sellerPage.json";
import HOME_VI from "../locales/VI/sellerPage.json";
import LanguageDetector from "i18next-browser-languagedetector";
import LIST_PROPERTIES_ADMIN_EN from "../locales/en/listProperties.json";
import LIST_PROPERTIES_ADMIN_VI from "../locales/vi/listProperties.json";
import DETAIL_PROPERTIES_ADMIN_EN from "../locales/en/detailProperty.json";
import DETAIL_PROPERTIES_ADMIN_VI from "../locales/vi/detailProperty.json";
export const resources = {
  en: {
    home: HOME_EN, //import từ các file ở locales/en mà muốn sử dụng,
    listProperties: LIST_PROPERTIES_ADMIN_EN,
    detailProperty: DETAIL_PROPERTIES_ADMIN_EN,
  },
  vi: {
    home: HOME_VI, //import từ các file ở locales/vi mà muốn sử dụng,
    listProperties: LIST_PROPERTIES_ADMIN_VI,
    detailProperty: DETAIL_PROPERTIES_ADMIN_VI,
  },
};
export const defaultNS = "home";
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: true,
    resources,
    ns: ["home"], //add các namespace khi viết thêm ở trên vào mảng này
    defaultNS,
    fallbackLng: "en",
    detection: {
      // 👇 cấu hình để đọc/lưu ngôn ngữ vào localStorage
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
      lookupLocalStorage: "i18nextLng", // key trong localStorage
    },
    interpolation: {
      escapeValue: false,
    },
  });
