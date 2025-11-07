import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import HOME_EN from "../locales/en/sellerPage.json";
import HOME_VI from "../locales/vi/sellerPage.json";
import LanguageDetector from 'i18next-browser-languagedetector';
import PROPERTIES_EN from "../locales/en/properties.json";
import PROPERTIES_VI from "../locales/vi/properties.json";
import PROPERTY_PAGE_EN from "../locales/en/propertyPage.json";
import PROPERTY_PAGE_VI from "../locales/vi/propertyPage.json";
import PROPERTY_DETAIL_EN from "../locales/en/propertyDetail.json";
import PROPERTY_DETAIL_VI from "../locales/vi/propertyDetail.json";

export const resources = {
    en: {
        home: HOME_EN,
        properties: PROPERTIES_EN,  //import từ các file ở locales/en mà muốn sử dụng, 
        propertyPage: PROPERTY_PAGE_EN,
        propertyDetail: PROPERTY_DETAIL_EN,
    },
    vi: {
        home: HOME_VI,
        properties: PROPERTIES_VI,  //import từ các file ở locales/vi mà muốn sử dụng, 
        propertyPage: PROPERTY_PAGE_VI,
        propertyDetail: PROPERTY_DETAIL_VI,
    }
};
export const defaultNS = 'home';
i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init(
        {
            debug: true,
            resources,
            ns: ["home", "properties", "propertyPage", "propertyDetail"],     //add các namespace khi viết thêm ở trên vào mảng này
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
