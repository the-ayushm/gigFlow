import axios from "axios";

const api = axios.create({
  baseURL: "https://gigflow-backend-9ndn.onrender.com",
  withCredentials: true,
});

export default api;
