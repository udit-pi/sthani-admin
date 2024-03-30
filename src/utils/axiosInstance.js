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
    baseURL: 'http://localhost:3500/admin',
});


// Add an interceptor for all requests
axiosInstance.interceptors.request.use(config => {
    // Retrieve the access token from React state or a state management system

    let user = getUser();

    const accessToken = user.tokens.access.token;


    // Add the access token to the Authorization header
    config.headers.Authorization = `Bearer ${accessToken}`;

    return config;
});

export default axiosInstance;