import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from "axios";
import { store } from "@/redux/store";
import { fetchRefreshToken } from "./auth.api";
import { logout, setToken } from "@/redux/authSlice";

interface RefreshTokenResponse {
  access_token: string;
  refresh_token: string;
}

class Http {
  private static instance: Http;
  private axiosInstance: AxiosInstance;
  private isRefreshing = false;
  private refreshSubscribers: Array<(token: string) => void> = [];
  private readonly MAX_RETRIES = 3;
  private readonly RETRY_DELAY = 1000;
  private tokenChannel: BroadcastChannel;

  private constructor() {
    const axiosConfig: AxiosRequestConfig = {
      baseURL: process.env.NEXT_PUBLIC_API_URL,
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
    };

    this.axiosInstance = axios.create(axiosConfig);

    // Khởi tạo BroadcastChannel
    this.tokenChannel = new BroadcastChannel("auth-token-channel");

    // Lắng nghe sự kiện token được refresh từ tab khác
    this.tokenChannel.onmessage = (event) => {
      if (event.data.type === "TOKEN_REFRESHED") {
        const { accessToken, refreshToken } = event.data;
        store.dispatch(
          setToken({
            accessToken,
            refreshToken,
          })
        );
      }
    };

    this.axiosInstance.interceptors.request.use(
      (config) => {
        const token = store.getState().auth?.accessToken;
        if (token) {
          config.headers = config.headers || {};
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.axiosInstance.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as AxiosRequestConfig & {
          _retry?: boolean;
        };

        // Handle network errors
        if (!error.response) {
          return this.handleNetworkError(originalRequest);
        }

        // Handle 401 errors
        if (error.response.status === 401 && !originalRequest._retry) {
          if (this.isRefreshing) {
            return new Promise((resolve) => {
              this.refreshSubscribers.push((token: string) => {
                originalRequest.headers = originalRequest.headers || {};
                originalRequest.headers["Authorization"] = `Bearer ${token}`;
                resolve(this.axiosInstance(originalRequest));
              });
            });
          }

          this.isRefreshing = true;
          originalRequest._retry = true;
          try {
            const refreshToken = store.getState().auth?.refreshToken;
            if (!refreshToken) {
              throw new Error("No refresh token found!");
            }
            const response = await fetchRefreshToken(refreshToken);
            const { access_token, refresh_token } =
              response.data as RefreshTokenResponse;

            // Cập nhật token trong store
            store.dispatch(
              setToken({
                accessToken: access_token,
                refreshToken: refresh_token,
              })
            );

            // Broadcast token mới đến các tab khác
            this.tokenChannel.postMessage({
              type: "TOKEN_REFRESHED",
              accessToken: access_token,
              refreshToken: refresh_token,
            });

            this.axiosInstance.defaults.headers.common[
              "Authorization"
            ] = `Bearer ${access_token}`;
            originalRequest.headers = originalRequest.headers || {};
            originalRequest.headers["Authorization"] = `Bearer ${access_token}`;

            this.refreshSubscribers.forEach((callback) =>
              callback(access_token)
            );
            this.refreshSubscribers = [];

            return this.axiosInstance(originalRequest);
          } catch (refreshError) {
            store.dispatch(logout());
            window.location.href = "/";
            return Promise.reject(refreshError);
          } finally {
            this.isRefreshing = false;
          }
        }

        // Handle other errors
        return Promise.reject(error);
      }
    );
  }

  private async handleNetworkError(request: AxiosRequestConfig): Promise<any> {
    let retries = 0;
    while (retries < this.MAX_RETRIES) {
      try {
        await new Promise((resolve) =>
          setTimeout(resolve, this.RETRY_DELAY * (retries + 1))
        );
        return await this.axiosInstance(request);
      } catch (error) {
        retries++;
        if (retries === this.MAX_RETRIES) {
          return Promise.reject(error);
        }
      }
    }
  }

  public static getInstance(): AxiosInstance {
    if (!Http.instance) {
      Http.instance = new Http();
    }
    return Http.instance.axiosInstance;
  }

  // Cleanup method để đóng BroadcastChannel khi không cần thiết nữa
  public destroy() {
    if (this.tokenChannel) {
      this.tokenChannel.close();
    }
  }
}

const axiosInstance = Http.getInstance();

export default axiosInstance;
