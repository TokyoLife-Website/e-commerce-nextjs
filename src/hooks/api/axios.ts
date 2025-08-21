import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosError,
  AxiosResponse,
} from "axios";
import { store } from "@/redux/store";
import { clearUser } from "@/redux/userSlice";
import { ModalType } from "@/types/modal";

class Http {
  private static instance: Http;
  private axiosInstance: AxiosInstance;
  private axiosRefresh: AxiosInstance;

  private constructor() {
    const axiosConfig: AxiosRequestConfig = {
      withCredentials: true,
      baseURL: process.env.NEXT_PUBLIC_API_URL,
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
    };

    this.axiosInstance = axios.create(axiosConfig);
    this.axiosRefresh = axios.create(axiosConfig);

    this.axiosInstance.interceptors.request.use(
      (config) => {
        // Log request for debugging
        console.log(
          `Making ${config.method?.toUpperCase()} request to ${config.url}`
        );
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      async (error: AxiosError) => {
        const originalRequest = error.config as AxiosRequestConfig & {
          _retry?: boolean;
        };
        const modal = store.getState().modal;
        // If access token expired (401) and we haven't already tried to refresh
        if (
          error.response?.status === 401 &&
          originalRequest &&
          !originalRequest._retry
        ) {
          if (
            (modal.isOpen && modal.type === ModalType.LOGIN) ||
            window.location.pathname.startsWith("/admin/login")
          )
            return Promise.reject(error);
          originalRequest._retry = true;

          try {
            // Try to refresh token
            await this.axiosRefresh.post("/auth/refresh-token");

            // Retry the original request
            return this.axiosInstance(originalRequest);
          } catch (refreshError) {
            // Refresh failed, redirect to login
            console.error("Token refresh failed:", refreshError);
            // Clear any local auth state
            store.dispatch(clearUser());
            if (window.location.pathname.startsWith("/admin")) {
              window.location.href = "/admin/login";
            } else {
              window.location.href = "/";
            }
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  public static getInstance(): AxiosInstance {
    if (!Http.instance) {
      Http.instance = new Http();
    }
    return Http.instance.axiosInstance;
  }
}

const axiosInstance = Http.getInstance();

export default axiosInstance;
