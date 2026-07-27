import api from "./api";

const leaveRequestService = {
  getMyRequests: (params) => api.get("/leave-requests", { params }),
  create: (data) => api.post("/leave-requests", data),
  getById: (id) => api.get(`/leave-requests/${id}`),
  delete: (id) => api.delete(`/leave-requests/${id}`),
  getAdminRequests: (params) => api.get("/admin/leave-requests", { params }),
  approve: (id) => api.put(`/leave-requests/${id}/approve`),
  reject: (id) => api.put(`/leave-requests/${id}/reject`),
};

export default leaveRequestService;
