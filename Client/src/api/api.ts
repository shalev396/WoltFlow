import axios from "axios";
import { responseInterceptor, errorInterceptor } from "@/utils/authInterceptor";

const isDev = import.meta.env.VITE_ENV === "Development";
const baseURL = isDev
  ? "http://localhost:3000/api"
  : `${window.location.origin}/api`;

export const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Important for cookies
});

// Add response interceptor
api.interceptors.response.use(responseInterceptor, errorInterceptor);
