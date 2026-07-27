import api from "./api";

const leaveTypeService = {
  getAll: (params) => api.get("/leave-types", { params }),
  getById: (id) => api.get(`/leave-types/${id}`),
  create: (data) => api.post("/leave-types", data),
  update: (id, data) => api.put(`/leave-types/${id}`, data),
  delete: (id) => api.delete(`/leave-types/${id}`),
};

export default leaveTypeService;
