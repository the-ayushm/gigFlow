import axios from "axios";

const api = axios.create({
  baseURL: "https://gigflow-backend-9ndn.onrender.com/api",
  withCredentials: true,
});

export default api;
