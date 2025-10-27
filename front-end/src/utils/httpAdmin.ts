import axios from "axios";
import { API_BASE_ADMIN_URL } from "../config/apiConfig";

export const httpAdmin = axios.create({
    baseURL: API_BASE_ADMIN_URL,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
});


httpAdmin.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("auth_token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

httpAdmin.interceptors.response.use(
    (response) => response,
    (error) => {
        console.log("API Error Admin:", error.response?.data);
        return Promise.reject(error);
    }
);
