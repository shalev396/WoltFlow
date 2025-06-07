import axios from "axios";
import { store } from "@/store/store";
import { clearUser } from "@/store/slices/googleUserSlice";

const isDev = import.meta.env.MODE === "development";
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
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Dispatch logout action
      store.dispatch(clearUser());
      // Redirect to home page
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);
