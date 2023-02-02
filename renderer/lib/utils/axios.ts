import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.apiurl,
  withCredentials: true,
});

export default axiosInstance;
