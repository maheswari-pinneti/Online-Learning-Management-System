import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

export const apiClient = axios.create({
  baseURL: 'https://dummyjson.com',
  timeout: 8000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response Interceptor with user-friendly error formatting
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError<{ message?: string }>) => {
    let message = 'An unexpected network error occurred. Please try again.';
    if (error.response?.data?.message) {
      message = error.response.data.message;
    } else if (error.message) {
      message = error.message;
    }

    // Suppress console spam in automated test runners (e.g. Vitest / JSDOM offline tests)
    if (typeof process !== 'undefined' && process.env?.NODE_ENV !== 'test') {
      console.warn('[API Client Error]:', message);
    }

    return Promise.reject(new Error(message));
  }
);
