import axios from "axios";
import AuthService from './auth.service'; // Adjust the path accordingly

// Create an Axios instance
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL + "/api/v1/auth",
});

// Request interceptor to add the token to headers
api.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // If 401 error and not retrying already
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const newTokens = await AuthService.refreshToken();
        if (newTokens) {
          // Retry the original request with new token
          axios.defaults.headers.common['Authorization'] = `Bearer ${newTokens.tokens.access.token}`;
          originalRequest.headers['Authorization'] = `Bearer ${newTokens.tokens.access.token}`;
          return api(originalRequest);
        }
      } catch (err) {
        console.error("Error refreshing token:", err);
        AuthService.logout(); // Log out the user if token refresh fails
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
