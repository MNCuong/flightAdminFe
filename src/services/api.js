import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'http://localhost:5000/bookingBE-MNC/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosClient.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
);

axiosClient.interceptors.response.use(
    (response) => response,
    (error) => {
      console.error('Axios error:', error.response || error.message);
      return Promise.reject(error);
    }
);

export default axiosClient;
