import axios, { type AxiosResponse } from "axios";

const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

const api = axios.create({
  baseURL,
  withCredentials: true, 
});

// Keep refresh requests outside the main interceptor chain. Otherwise a failed
// refresh request recursively tries to refresh itself.
const refreshClient = axios.create({ baseURL, withCredentials: true });

let accessToken: string | null = null;
export const setAccessToken = (t: string | null) => {
  accessToken = t;

  if (typeof window !== "undefined") {
    if (t) localStorage.setItem("accessToken", t);
    else localStorage.removeItem("accessToken");
  }
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
    const requestUrl = originalRequest?.url || "";
    const isPublicAuthRequest = requestUrl.includes("/api/auth/");

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !isPublicAuthRequest
    ) {
      originalRequest._retry = true;

      try {
        const { data } = await getRefreshedAccessToken();
        setAccessToken(data.accessToken);

        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        setAccessToken(null);
        if (typeof window !== "undefined") {
          const path = window.location.pathname;
          const isProtectedScreen =
            path.startsWith("/tailor/dashboard") ||
            path === "/tailor/profile" ||
            path === "/complete-profile";
          if (isProtectedScreen) window.location.href = "/auth";
        }
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

type RefreshResponse = { accessToken: string };

let refreshRequest: Promise<AxiosResponse<RefreshResponse>> | null = null;

function getRefreshedAccessToken(): Promise<AxiosResponse<RefreshResponse>> {
  if (!refreshRequest) {
    refreshRequest = refreshClient
      .post<RefreshResponse>("/api/token/refresh")
      .finally(() => {
        refreshRequest = null;
      });
  }

  return refreshRequest;
}

export default api;
