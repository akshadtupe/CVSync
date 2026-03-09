import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000/api/",
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("access");

  // no attach token for register or login
  if (
    token &&
    !config.url.includes("register") &&
    !config.url.includes("token")
  ) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
export default API;