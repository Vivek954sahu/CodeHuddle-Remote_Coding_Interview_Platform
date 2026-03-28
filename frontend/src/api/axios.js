import axios from "axios";
import { refreshToken } from "./authApi";

const Axios = axios.create({
// baseURL: "http://localhost:3000/api",
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true
});

Axios.interceptors.request.use((config) => {

    const token = localStorage.getItem("accessToken");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

Axios.interceptors.response.use(
    (response) => response,

    async (error) => {
        const originalRequest = error.config;

        // if the failure happened during a refresh attempt, bail out and log out
        if (originalRequest?.url?.includes("/v1/auth/refresh")) {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("user");
            window.location.href = "/login";
            return Promise.reject(error);
        }

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {

                const res = await refreshToken();

                const newAccessToken = res.data.accessToken;

                localStorage.setItem("accessToken", newAccessToken);
                Axios.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

                return Axios(originalRequest);

            } catch (refreshError) {
                localStorage.removeItem("accessToken");
                localStorage.removeItem("user");
                window.location.href = "/login";
            }
        }

        return Promise.reject(error);
    }
);

export default Axios;