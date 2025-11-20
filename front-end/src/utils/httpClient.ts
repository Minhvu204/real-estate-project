import axios from "axios";
import { API_BASE_CLIENT_URL } from "../config/apiConfig";
import { getLanguage, type Lang } from "./storage";

export const httpClient = axios.create({
    baseURL: API_BASE_CLIENT_URL,
    timeout: 10000,
});

httpClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("auth_token");
        const lang: Lang = getLanguage();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        config.headers["Accept-Language"] = lang;
        return config;
    },
    (error) => Promise.reject(error)
);

httpClient.interceptors.response.use(
    (response) => response,
    (error) => {
        console.log("API Error Client:", error.response?.data);
        return Promise.reject(error);
    }
);
