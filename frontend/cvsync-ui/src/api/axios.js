import axios from "axios";

console.log("API URL:", import.meta.env.VITE_API_URL);

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("access");

  //no attach token for register or login
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