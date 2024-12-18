import axios from "axios";

// Create an Axios instance with base URL
const api = axios.create({
  baseURL: "https://fintecj-merchant.onrender.com/api" || "http://localhost:5000/api",
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);
export default api;
