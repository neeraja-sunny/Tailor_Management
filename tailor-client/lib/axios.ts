import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000",
  withCredentials: true, 
});

let accessToken: string | null = null;
export const setAccessToken = (t: string | null) => {
  accessToken = t;
};

// we can have the token in localStorage for persistence. In dev, we want it to reset on refresh for easier testing
const token = typeof window !== "undefined" 
  ? localStorage.getItem("accessToken") 
  : null;

if (token) {
  setAccessToken(token);
}

api.interceptors.request.use((config) => {
  if (accessToken && config && config.headers) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    if ((error.response?.status === 401 || error.response?.status === 403) && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const { data } = await api.post("/api/token/refresh");
        setAccessToken(data.accessToken);

        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        setAccessToken(null);
        if (typeof window !== "undefined") {
          window.location.href = "/auth";
        }
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
