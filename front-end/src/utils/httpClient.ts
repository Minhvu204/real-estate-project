import axios from "axios";
import { API_BASE_PUBLIC_URL } from "../config/apiConfig";

export const httpClient = axios.create({
    baseURL: API_BASE_PUBLIC_URL,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
});

httpClient.interceptors.response.use(
    (response) => response,
    (error) => {
        console.log("API Error", error);
        return Promise.reject(error);
    }
)