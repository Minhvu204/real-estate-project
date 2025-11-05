import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import HOME_EN from "../locales/en/sellerPage.json";
import HOME_VI from "../locales/VI/sellerPage.json";
import PROPERTY_PAGE_EN from "../locales/en/propertyPage.json";
import PROPERTY_PAGE_VI from "../locales/VI/propertyPage.json";
import PROPERTY_DETAIl_EN from "../locales/en/propertyDetail.json";
import PROPERTY_DETAIl_VI from "../locales/vi/propertyDetail.json";
import LanguageDetector from 'i18next-browser-languagedetector';
export const resources = {
    en: {
        home: HOME_EN,    //import từ các file ở locales/en mà muốn sử dụng, 
        propertyPage: PROPERTY_PAGE_EN,
        propertyDetail: PROPERTY_DETAIl_EN
    },
    vi: {
        home: HOME_VI,   //import từ các file ở locales/vi mà muốn sử dụng, 
        propertyPage: PROPERTY_PAGE_VI,
        propertyDetail: PROPERTY_DETAIl_VI
    }
};
export const defaultNS = 'home'
i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init(
        {
            debug: true,
            resources,
            ns: ['home', 'propertyPage', 'propertyDetail'],     //add các namespace khi viết thêm ở trên vào mảng này
            defaultNS,
            fallbackLng: 'en',
            detection: {
                // 👇 cấu hình để đọc/lưu ngôn ngữ vào localStorage
                order: ["localStorage", "navigator"],
                caches: ["localStorage"],
                lookupLocalStorage: "i18nextLng", // key trong localStorage
            },
            interpolation: {
                escapeValue: false
            }
        }
    )
