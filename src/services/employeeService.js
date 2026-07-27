import api from "./api";
import { isDemoMode } from "../config/demo";
import { mockEmployees, mockPaginate } from "../data/mockData";

const employeeService = {
  getAll: (params) => {
    if (isDemoMode) {
      return Promise.resolve({ data: mockPaginate(mockEmployees, params) });
    }
    return api.get("/employees", { params });
  },
  getById: (id) => {
    if (isDemoMode) {
      const emp = mockEmployees.find((e) => e.id === Number(id));
      return Promise.resolve({ data: { data: emp } });
    }
    return api.get(`/employees/${id}`);
  },
  create: (data) => {
    if (isDemoMode) {
      return Promise.resolve({ data: { message: "Created (demo)" } });
    }
    return api.post("/employees", data);
  },
  update: (id, data) => {
    if (isDemoMode) {
      return Promise.resolve({ data: { message: "Updated (demo)" } });
    }
    return api.put(`/employees/${id}`, data);
  },
  delete: (id) => {
    if (isDemoMode) {
      return Promise.resolve({ data: { message: "Deleted (demo)" } });
    }
    return api.delete(`/employees/${id}`);
  },
};

export default employeeService;
