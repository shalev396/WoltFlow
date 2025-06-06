import axios from "axios";

const isDev = import.meta.env.MODE === "development";
const baseURL = isDev
  ? "http://localhost:3000/api"
  : `${window.location.origin}/api`;

export const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});
