import api from './api'; // Adjust the path accordingly

const API_URL = `${process.env.REACT_APP_API_URL}/api/v1/auth/`;

const setTokens = (data) => {
  localStorage.setItem("user", JSON.stringify(data));
  localStorage.setItem("token", data.tokens.access.token);
  localStorage.setItem("refreshToken", data.tokens.refresh.token);
};

const register = async (username, email, password) => {
  try {
    const response = await api.post(API_URL + "register", {
      name: username,
      email,
      password,
    });

    if (response.data.user) {
      setTokens(response.data);
    }

    return response.data;
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
};

const login = async (email, password) => {
  try {
    const response = await api.post(API_URL + "login", {
      email,
      password,
    });

    if (response.data.user) {
      setTokens(response.data);
    }

    return response.data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

const logout = async () => {
  const refreshToken = localStorage.getItem("refreshToken");

  try {
    await api.post(API_URL + "logout", { refreshToken });
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    console.log("Logout successful");
  } catch (error) {
    console.error("Logout error:", error);
    // Even if logout request fails, remove tokens from local storage
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
  }
};

const refreshToken = async () => {
  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) throw new Error("No refresh token available");

  try {
    const response = await api.post(API_URL + "refresh-token", { refreshToken });
    if (response.data.user) {
      setTokens(response.data);
    }
    return response.data;
  } catch (error) {
    console.error("Refresh token error:", error);
    throw error;
  }
};

const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};

const AuthService = {
  register,
  login,
  logout,
  refreshToken,
  getCurrentUser,
};

export default AuthService;
