import axios from "axios";

// const API_URL = "http://localhost:3500/api/v1/auth/";

// const API_URL = `https://64.227.162.145/api/v1/auth/`;
 const API_URL = `${process.env.REACT_APP_API_URL}/api/v1/auth/`;


      
const register = (username, email, password) => {
  return axios.post(API_URL + "register",{
    name: username,
    email,
    password,
  }) .then((response) => {
    if (response.data.user) {
      localStorage.setItem("user", JSON.stringify(response.data));
      localStorage.setItem("token",JSON.stringify(response.data.tokens.access.token))
      localStorage.setItem("refreshToken",JSON.stringify(response.data.tokens.refresh.token))
    }

    return response.data;
  });
};

const login = (email, password) => {
  console.log(API_URL)
  return axios
    .post(API_URL + "login", {
      email,
      password,
    })
    .then((response) => {
      if (response.data.user) {
        localStorage.setItem("user", JSON.stringify(response.data));
        localStorage.setItem("token",JSON.stringify(response.data.tokens.access.token))
        localStorage.setItem("refreshToken",JSON.stringify(response.data.tokens.refresh.token))
      }

      return response.data;
    });
};

// logout pending because of refresh token 
const logout = () => {

  const refreshToken = JSON.parse(localStorage.getItem('refreshToken'))
  localStorage.removeItem("user");
  localStorage.removeItem("token");
  
  return axios.post(API_URL + "logout",{refreshToken}).then((response) => {
    console.log('logout')
    localStorage.removeItem("refreshToken");
    return response.data;
  }).catch((err) => {
    console.log(err)
  });
};

const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};

const AuthService = {
  register,
  login,
  logout,
  getCurrentUser,
}

export default AuthService;