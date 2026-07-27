import api from "./api";

const dashboardService = {
  getData: () => api.get("/dashboard"),
};

export default dashboardService;
