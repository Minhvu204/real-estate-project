import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import HOME_EN from "../locales/en/sellerPage.json";
import HOME_VI from "../locales/VI/sellerPage.json";
import PROPERTY_PAGE_EN from "../locales/en/propertyPage.json";
import PROPERTY_PAGE_VI from "../locales/VI/propertyPage.json";
import PROPERTY_DETAIl_EN from "../locales/en/propertyDetail.json";
import PROPERTY_DETAIl_VI from "../locales/vi/propertyDetail.json";
import TAXONOMIES_EN from "../locales/en/taxonomies.json";
import TAXONOMIES_VI from "../locales/vi/taxonomies.json";
import LanguageDetector from 'i18next-browser-languagedetector';
import PROPERTIES_EN from "../locales/en/properties.json";
import PROPERTIES_VI from "../locales/vi/properties.json";
import PROFILE_EN from "../locales/en/profile.json";
import PROFILE_VI from "../locales/vi/profile.json";
import MY_PROPERTIES_EN from "../locales/en/myProperties.json";
import MY_PROPERTIES_VI from "../locales/vi/myProperties.json";
import CREATEPROPERTYPAGE_EN from "../locales/en/createPropertyPage.json";
import CREATEPROPERTYPAGE_VI from "../locales/vi/createPropertyPage.json";
import ADDRESSAUTOCOMPLETE_EN from "../locales/en/addressAutocomplete.json";
import ADDRESSAUTOCOMPLETE_VI from "../locales/vi/addressAutocomplete.json";
import LIST_PROPERTIES_ADMIN_EN from "../locales/en/listProperties.json";
import LIST_PROPERTIES_ADMIN_VI from "../locales/vi/listProperties.json";
import DETAIL_PROPERTIES_ADMIN_EN from "../locales/en/detailProperty.json";
import DETAIL_PROPERTIES_ADMIN_VI from "../locales/vi/detailProperty.json";
import LIST_AGENTS_EN from "../locales/en/listAgents.json";
import LIST_AGENTS_VI from "../locales/vi/listAgents.json";
export const resources = {
    en: {
        home: HOME_EN,
        properties: PROPERTIES_EN,  //import từ các file ở locales/en mà muốn sử dụng, 
        propertyPage: PROPERTY_PAGE_EN,
        propertyDetail: PROPERTY_DETAIl_EN,
        taxonomies: TAXONOMIES_EN,
        profile: PROFILE_EN,
        myProperties: MY_PROPERTIES_EN,
        createPropertyPage: CREATEPROPERTYPAGE_EN,
        addressAutocomplete: ADDRESSAUTOCOMPLETE_EN,
        listProperties: LIST_PROPERTIES_ADMIN_EN,
        detailProperty: DETAIL_PROPERTIES_ADMIN_EN,
        listAgents: LIST_AGENTS_EN
    },
    vi: {
        home: HOME_VI,
        properties: PROPERTIES_VI,  //import từ các file ở locales/vi mà muốn sử dụng, 
        propertyPage: PROPERTY_PAGE_VI,
        propertyDetail: PROPERTY_DETAIl_VI,
        taxonomies: TAXONOMIES_VI,
        profile: PROFILE_VI,
        myProperties: MY_PROPERTIES_VI,
        createPropertyPage: CREATEPROPERTYPAGE_VI,
        addressAutocomplete: ADDRESSAUTOCOMPLETE_VI,
        listProperties: LIST_PROPERTIES_ADMIN_VI,
        detailProperty: DETAIL_PROPERTIES_ADMIN_VI,
        listAgents: LIST_AGENTS_VI
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
            ns: ["home", "properties", "propertyPage", "propertyDetail", "profile", "myProperties", 'createPropertyPage', 'addressAutocomplete', 'listAgents'],     //add các namespace khi viết thêm ở trên vào mảng này
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
