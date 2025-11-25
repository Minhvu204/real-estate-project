// src/api/api.ts
import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE || "http://localhost:3000",
    headers: { "Content-Type": "application/json" },
    withCredentials: true, // Quan trọng: gửi cookie (refresh_token) trong mỗi request
});

// Request interceptor: thêm access token vào header
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("auth_token");
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => Promise.reject(error));

// Response interceptor: tự động refresh token khi gặp 401 error
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

api.interceptors.response.use(
    (response) => response, // Trả về response bình thường
    async (error) => {
        const originalRequest = error.config;

        // Nếu lỗi 401 và chưa retry, thử refresh token
        if (error.response?.status === 401 && !originalRequest._retry) {
            // Không refresh nếu đang ở trang login hoặc đang gọi refresh-token
            if (originalRequest.url?.includes('/auth/login') ||
                originalRequest.url?.includes('/auth/refresh-token')) {
                return Promise.reject(error);
            }

            if (isRefreshing) {
                // Nếu đang refresh, đợi cho đến khi xong
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then(token => {
                    originalRequest.headers['Authorization'] = 'Bearer ' + token;
                    return api(originalRequest);
                }).catch(err => {
                    return Promise.reject(err);
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                // Gọi API refresh token (refresh_token tự động gửi qua cookie)
                const res = await api.post('/api/client/auth/refresh-token');
                const newAccessToken = res.data?.data?.accessToken;

                if (newAccessToken) {
                    // Lưu token mới vào localStorage
                    localStorage.setItem("auth_token", newAccessToken);

                    // Cập nhật token cho request hiện tại và các request đang đợi
                    originalRequest.headers['Authorization'] = 'Bearer ' + newAccessToken;
                    processQueue(null, newAccessToken);

                    isRefreshing = false;

                    // Retry request ban đầu với token mới
                    return api(originalRequest);
                }
            } catch (refreshError) {
                // Refresh token thất bại hoặc hết hạn → logout user
                processQueue(refreshError, null);
                isRefreshing = false;

                // Clear auth và redirect về login
                localStorage.removeItem("auth_token");
                localStorage.removeItem("auth_user");

                // Redirect về login nếu không phải đang ở trang login
                if (!window.location.pathname.includes('/login')) {
                    window.location.href = '/login';
                }

                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;
