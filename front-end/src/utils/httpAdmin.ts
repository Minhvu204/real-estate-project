import axios from "axios";
import { API_BASE_ADMIN_URL } from "../config/apiConfig";

export const httpAdmin = axios.create({
    baseURL: API_BASE_ADMIN_URL,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
});

httpAdmin.interceptors.response.use(
    (response) => response,
    (error) => {
        console.log("API Error", error);
        return Promise.reject(error);
    }
)