import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import HOME_EN from "../locales/en/sellerPage.json";
import HOME_VI from "../locales/VI/sellerPage.json"

const resources = {
    en: {
        home: HOME_EN    //import từ các file ở locales/en mà muốn sử dụng, 
    },
    vi: {
        home: HOME_VI   //import từ các file ở locales/vi mà muốn sử dụng, 
    }
};
const defaultNS = 'home'
i18n
    .use(initReactI18next)
    .init(
        {
            resources,
            lng: 'en',
            ns: ['home'],     //add các namespace khi viết thêm ở trên vào mảng này
            defaultNS,
            fallbackLng: 'en',
            interpolation: {
                escapeValue: false
            }


        }
    )
