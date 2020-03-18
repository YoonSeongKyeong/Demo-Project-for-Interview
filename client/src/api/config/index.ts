import Axios from 'axios';

export const axiosInstance = Axios.create({
  baseURL: 'http://localhost:3001',
});

export default axiosInstance;
