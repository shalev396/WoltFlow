import axios from "axios";
import { responseInterceptor, errorInterceptor } from "@/utils/authInterceptor";

const isLocal = import.meta.env.VITE_ENV === "local";
const baseURL = isLocal
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
