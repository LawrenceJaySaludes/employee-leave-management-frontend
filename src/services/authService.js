import api from "./api";

const authService = {
  login: (credentials) => api.post("/login", credentials),
  logout: () => api.post("/logout"),
  me: () => api.get("/me"),
};

export default authService;
