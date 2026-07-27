import api from "./api";
import { isDemoMode } from "../config/demo";
import { mockLeaveTypes, mockPaginate } from "../data/mockData";

const leaveTypeService = {
  getAll: (params) => {
    if (isDemoMode) {
      return Promise.resolve({ data: mockPaginate(mockLeaveTypes, params) });
    }
    return api.get("/leave-types", { params });
  },
  getById: (id) => {
    if (isDemoMode) {
      const lt = mockLeaveTypes.find((t) => t.id === Number(id));
      return Promise.resolve({ data: { data: lt } });
    }
    return api.get(`/leave-types/${id}`);
  },
  create: (data) => {
    if (isDemoMode) {
      return Promise.resolve({ data: { message: "Created (demo)" } });
    }
    return api.post("/leave-types", data);
  },
  update: (id, data) => {
    if (isDemoMode) {
      return Promise.resolve({ data: { message: "Updated (demo)" } });
    }
    return api.put(`/leave-types/${id}`, data);
  },
  delete: (id) => {
    if (isDemoMode) {
      return Promise.resolve({ data: { message: "Deleted (demo)" } });
    }
    return api.delete(`/leave-types/${id}`);
  },
};

export default leaveTypeService;
