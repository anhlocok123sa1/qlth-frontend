// src/axios.js
import axios from "axios";
import constants from "./constants";

const instance = axios.create({
  baseURL: `${constants.BASE_URL}api`,
});

instance.interceptors.request.use(
  (config) => {
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

export default instance;
