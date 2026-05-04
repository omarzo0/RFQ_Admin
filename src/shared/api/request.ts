import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import Cookies from "js-cookie";

// Types
type HttpMethod = "get" | "post" | "put" | "patch" | "delete";
type HeadersType = Record<string, string> | null;
type QueryParams = Record<string, string | number | boolean> | undefined;

interface RequestConfig extends AxiosRequestConfig {
  validateStatus: (status: number) => boolean;
}

// Token helpers with multiple storage fallbacks
const getToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return (
    Cookies.get("token") ||
    localStorage.getItem("token") ||
    sessionStorage.getItem("token") ||
    null
  );
};

const getRefreshToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return (
    Cookies.get("refreshToken") ||
    localStorage.getItem("refreshToken") ||
    sessionStorage.getItem("refreshToken") ||
    null
  );
};

const clearAuthStorage = (): void => {
  if (typeof window === "undefined") return;
  Cookies.remove("token");
  Cookies.remove("refreshToken");
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("auth-storage"); // Add this for Zustand sync
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("refreshToken");
};

const saveTokens = (accessToken: string, refreshToken?: string): void => {
  if (typeof window === "undefined") return;
  const cookieOptions = {
    expires: 7,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
  };
  Cookies.set("token", accessToken, cookieOptions);
  localStorage.setItem("token", accessToken);
  if (refreshToken) {
    Cookies.set("refreshToken", refreshToken, cookieOptions);
    localStorage.setItem("refreshToken", refreshToken);
  }
};

// Create axios instance
const api: AxiosInstance = axios.create({
  validateStatus: (status: number) => status <= 500,
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Response interceptor for 401 handling and token refresh
api.interceptors.response.use(
  (response) => {
    if (isUnauthorizedResponse(response)) {
      return handleUnauthorized(response);
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (
      (error.response?.status === 401 || isUnauthorizedResponse(error.response)) &&
      !originalRequest._retry
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = "Bearer " + token;
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = getRefreshToken();
      if (!refreshToken) {
        isRefreshing = false;
        clearAuthStorage();
        return Promise.reject(error);
      }

      try {
        // We use a clean axios call to avoid the interceptor
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_BASE_URL || ""}/api/v1/admin/auth/refresh-token`,
          { refreshToken }
        );

        if (response.data?.success && response.data?.data?.accessToken) {
          const { accessToken, refreshToken: newRefreshToken } = response.data.data;
          saveTokens(accessToken, newRefreshToken);
          api.defaults.headers.common["Authorization"] = "Bearer " + accessToken;
          originalRequest.headers["Authorization"] = "Bearer " + accessToken;
          processQueue(null, accessToken);
          return api(originalRequest);
        } else {
          processQueue(new Error("Refresh failed"), null);
          clearAuthStorage();
          return Promise.reject(error);
        }
      } catch (refreshError) {
        processQueue(refreshError, null);
        clearAuthStorage();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// Check if response indicates invalid auth
const isUnauthorizedResponse = (
  response: AxiosResponse | undefined
): boolean => {
  if (!response) return false;

  const status = response.status;
  const message = response.data?.message?.toLowerCase() || "";

  return (
    status === 401 ||
    message.includes("invalid token") ||
    message.includes("invalid access token") ||
    message.includes("jwt expired")
  );
};

// Handle unauthorized responses
const handleUnauthorized = async (response: AxiosResponse): Promise<any> => {
  const originalRequest = response.config as any;

  if (!originalRequest._retry) {
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then(token => {
        originalRequest.headers['Authorization'] = 'Bearer ' + token;
        return api(originalRequest);
      }).catch(err => Promise.reject(err));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      isRefreshing = false;
      clearAuthStorage();
      return Promise.reject(response);
    }

    try {
      const refreshRes = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL || ""}/api/v1/admin/auth/refresh-token`,
        { refreshToken }
      );

      if (refreshRes.data?.success && refreshRes.data?.data?.accessToken) {
        const { accessToken, refreshToken: newRefreshToken } = refreshRes.data.data;
        saveTokens(accessToken, newRefreshToken);
        originalRequest.headers['Authorization'] = 'Bearer ' + accessToken;
        processQueue(null, accessToken);
        return api(originalRequest);
      } else {
        processQueue(new Error("Refresh failed"), null);
        clearAuthStorage();
        return Promise.reject(response);
      }
    } catch (error) {
      processQueue(error, null);
      clearAuthStorage();
      return Promise.reject(error);
    } finally {
      isRefreshing = false;
    }
  }

  return Promise.reject(response);
};

// Request methods object
const request = {
  async get(
    headers: HeadersType,
    url: string,
    params?: QueryParams
  ): Promise<AxiosResponse> {
    return api.get(url, {
      params,
      headers: headers || undefined,
    });
  },

  async post<T = unknown>(
    headers: HeadersType,
    url: string,
    params?: T
  ): Promise<AxiosResponse> {
    return api.post(url, params, {
      headers: headers || undefined,
    });
  },

  async put<T = unknown>(
    headers: HeadersType,
    url: string,
    params?: T
  ): Promise<AxiosResponse> {
    return api.put(url, params, {
      headers: headers || undefined,
    });
  },

  async patch<T = unknown>(
    headers: HeadersType,
    url: string,
    params?: T
  ): Promise<AxiosResponse> {
    return api.patch(url, params, {
      headers: headers || undefined,
    });
  },

  async delete<T = unknown>(
    headers: HeadersType,
    url: string,
    data?: T
  ): Promise<AxiosResponse> {
    return api.delete(url, {
      data,
      headers: headers || undefined,
    });
  },
};

// Anonymous request methods
export const anonymousRequests = {
  get: (
    headers: HeadersType = null,
    replaceHeaders = false,
    url: string,
    params?: QueryParams
  ) => {
    const finalHeaders = replaceHeaders ? headers : { ...headers };
    return request.get(finalHeaders, url, params);
  },
  post: <T = unknown>(
    headers: HeadersType = null,
    replaceHeaders = false,
    url: string,
    params?: T
  ) => {
    const finalHeaders = replaceHeaders ? headers : { ...headers };
    return request.post(finalHeaders, url, params);
  },
  put: <T = unknown>(
    headers: HeadersType = null,
    replaceHeaders = false,
    url: string,
    params?: T
  ) => {
    const finalHeaders = replaceHeaders ? headers : { ...headers };
    return request.put(finalHeaders, url, params);
  },
};

// Authenticated request methods
export const authRequests = {
  get: (
    headers: HeadersType = null,
    replaceHeaders = false,
    url: string,
    params?: QueryParams
  ) => {
    const token = getToken();
    const authHeaders = {
      Authorization: `Bearer ${token}`,
      ...headers,
    };
    const finalHeaders = replaceHeaders ? headers : authHeaders;
    return request.get(finalHeaders, url, params);
  },
  post: <T = unknown>(
    headers: HeadersType = null,
    replaceHeaders = false,
    url: string,
    params?: T
  ) => {
    const token = getToken();
    const authHeaders = {
      Authorization: `Bearer ${token}`,
      ...headers,
    };
    const finalHeaders = replaceHeaders ? headers : authHeaders;
    return request.post(finalHeaders, url, params);
  },
  put: <T = unknown>(
    headers: HeadersType = null,
    replaceHeaders = false,
    url: string,
    params?: T
  ) => {
    const token = getToken();
    const authHeaders = {
      Authorization: `Bearer ${token}`,
      ...headers,
    };
    const finalHeaders = replaceHeaders ? headers : authHeaders;
    return request.put(finalHeaders, url, params);
  },
  patch: <T = unknown>(
    headers: HeadersType = null,
    replaceHeaders = false,
    url: string,
    params?: T
  ) => {
    const token = getToken();
    const authHeaders = {
      Authorization: `Bearer ${token}`,
      ...headers,
    };
    const finalHeaders = replaceHeaders ? headers : authHeaders;
    return request.patch(finalHeaders, url, params);
  },
  delete: <T = unknown>(
    headers: HeadersType = null,
    replaceHeaders = false,
    url: string,
    params?: T
  ) => {
    const token = getToken();
    const authHeaders = {
      Authorization: `Bearer ${token}`,
      ...headers,
    };
    const finalHeaders = replaceHeaders ? headers : authHeaders;
    return request.delete(finalHeaders, url, params);
  },
};
