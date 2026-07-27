import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "../contexts/AuthContext";
import ProtectedRoute from "../components/ProtectedRoute";
import AdminLayout from "../layouts/AdminLayout";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import EmployeeList from "../pages/employees/EmployeeList";
import LeaveTypeList from "../pages/leaveTypes/LeaveTypeList";
import MyRequests from "../pages/leaveRequests/MyRequests";
import AllRequests from "../pages/leaveRequests/AllRequests";
import Profile from "../pages/Profile";
import Settings from "../pages/Settings";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="employees" element={<ProtectedRoute adminOnly><EmployeeList /></ProtectedRoute>} />
            <Route path="leave-types" element={<ProtectedRoute adminOnly><LeaveTypeList /></ProtectedRoute>} />
            <Route path="leave-requests" element={<MyRequests />} />
            <Route path="admin/leave-requests" element={<ProtectedRoute adminOnly><AllRequests /></ProtectedRoute>} />
            <Route path="profile" element={<Profile />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
