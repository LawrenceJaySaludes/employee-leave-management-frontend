import api from "./api";
import { isDemoMode } from "../config/demo";
import { mockDashboardData } from "../data/mockData";

const dashboardService = {
  getData: () => {
    if (isDemoMode) {
      return Promise.resolve({ data: { data: mockDashboardData } });
    }
    return api.get("/dashboard");
  },
};

export default dashboardService;
