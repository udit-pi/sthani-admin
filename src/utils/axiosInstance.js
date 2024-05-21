// Wrapper for HTTP requests with Axios
import axios from 'axios';

function getUser() {
    let user = localStorage.getItem('user');

    if (user) {
        user = JSON.parse(user)
    }
    else {
        user = null;
    }

    return user;
}

const axiosInstance = axios.create({
    // baseURL: 'http://localhost:3500/admin',
    // baseURL: ``
});



axiosInstance.interceptors.request.use(config => {
 

    let user = getUser();

    const accessToken = user.tokens.access.token;


   
    config.headers.Authorization = `Bearer ${accessToken}`;

    return config;
});

export default axiosInstance;