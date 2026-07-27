import api from "./api";
import { isDemoMode } from "../config/demo";
import { mockUser } from "../data/mockData";

const authService = {
  login: (credentials) => {
    if (isDemoMode) {
      return Promise.resolve({ data: { token: "demo-token", user: mockUser } });
    }
    return api.post("/login", credentials);
  },
  logout: () => {
    if (isDemoMode) {
      return Promise.resolve({ data: { message: "Logged out" } });
    }
    return api.post("/logout");
  },
  me: () => {
    if (isDemoMode) {
      return Promise.resolve({ data: { data: mockUser } });
    }
    return api.get("/me");
  },
};

export default authService;
