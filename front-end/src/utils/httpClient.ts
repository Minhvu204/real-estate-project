import axios from "axios";
import { API_BASE_CLIENT_URL } from "../config/apiConfig";

export const httpClient = axios.create({
    baseURL: API_BASE_CLIENT_URL,
    timeout: 10000,
});

httpClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("auth_token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
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
