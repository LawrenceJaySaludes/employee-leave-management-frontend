import api from "./api";
import { isDemoMode } from "../config/demo";
import { mockMyRequests, mockAllRequests, mockPaginate } from "../data/mockData";

const leaveRequestService = {
  getMyRequests: (params) => {
    if (isDemoMode) {
      return Promise.resolve({ data: { data: mockMyRequests } });
    }
    return api.get("/leave-requests", { params });
  },
  create: (data) => {
    if (isDemoMode) {
      return Promise.resolve({ data: { message: "Created (demo)" } });
    }
    return api.post("/leave-requests", data);
  },
  getById: (id) => {
    if (isDemoMode) {
      const req = mockMyRequests.find((r) => r.id === Number(id));
      return Promise.resolve({ data: { data: req } });
    }
    return api.get(`/leave-requests/${id}`);
  },
  delete: (id) => {
    if (isDemoMode) {
      return Promise.resolve({ data: { message: "Deleted (demo)" } });
    }
    return api.delete(`/leave-requests/${id}`);
  },
  getAdminRequests: (params) => {
    if (isDemoMode) {
      return Promise.resolve({ data: mockPaginate(mockAllRequests, params) });
    }
    return api.get("/admin/leave-requests", { params });
  },
  approve: (id) => {
    if (isDemoMode) {
      return Promise.resolve({ data: { message: "Approved (demo)" } });
    }
    return api.put(`/leave-requests/${id}/approve`);
  },
  reject: (id) => {
    if (isDemoMode) {
      return Promise.resolve({ data: { message: "Rejected (demo)" } });
    }
    return api.put(`/leave-requests/${id}/reject`);
  },
};

export default leaveRequestService;
