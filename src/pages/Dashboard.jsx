import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import dashboardService from "../services/dashboardService";
import LoadingSpinner from "../components/LoadingSpinner";
import {
  HiUsers,
  HiClipboardDocumentList,
  HiClock,
  HiCheckCircle,
  HiXCircle,
  HiCalendarDays,
  HiArrowRight,
  HiBriefcase,
} from "react-icons/hi2";
import dayjs from "dayjs";

const statusColors = {
  pending: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  approved: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  rejected: "bg-red-50 text-red-700 ring-1 ring-red-200",
};

const monthNames = [
  "", "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

function StatCard({ icon: Icon, label, value, color, bgColor, trend }) {
  return (
    <div className="group bg-white rounded-2xl shadow-sm border border-slate-200/60 p-5 hover:shadow-md hover:border-slate-300/60 transition-all duration-200">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-slate-500 truncate">{label}</p>
          <p className="text-3xl font-bold text-slate-900 mt-1.5 tracking-tight">{value ?? 0}</p>
        </div>
        <div className={`flex-shrink-0 p-2.5 rounded-xl ${bgColor} group-hover:scale-105 transition-transform`}>
          <Icon className={`h-5 w-5 ${color}`} />
        </div>
      </div>
      {trend && (
        <div className="mt-3 flex items-center gap-1.5 text-xs font-medium text-slate-500">
          <span className="text-slate-400">{trend}</span>
        </div>
      )}
    </div>
  );
}

function AdminDashboard({ data }) {
  const navigate = useNavigate();
  const recentThree = (data.recent_requests || []).slice(0, 3);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Dashboard</h1>
        <p className="text-slate-500 mt-1">Welcome back. Here's your organization overview.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard icon={HiUsers} label="Total Employees" value={data.total_employees} color="text-primary-600" bgColor="bg-primary-50" />
        <StatCard icon={HiClipboardDocumentList} label="Leave Types" value={data.total_leave_types} color="text-violet-600" bgColor="bg-violet-50" />
        <StatCard icon={HiCalendarDays} label="Total Requests" value={data.total_leave_requests} color="text-blue-600" bgColor="bg-blue-50" />
        <StatCard icon={HiClock} label="Pending" value={data.pending_requests} color="text-amber-600" bgColor="bg-amber-50" />
        <StatCard icon={HiCheckCircle} label="Approved" value={data.approved_requests} color="text-emerald-600" bgColor="bg-emerald-50" />
        <StatCard icon={HiXCircle} label="Rejected" value={data.rejected_requests} color="text-red-600" bgColor="bg-red-50" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {data.monthly_requests && data.monthly_requests.length > 0 && (
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6">
            <h2 className="text-sm font-semibold text-slate-900 mb-5">Monthly Requests</h2>
            <div className="space-y-3.5">
              {data.monthly_requests.map((m) => {
                const maxVal = Math.max(...data.monthly_requests.map((x) => x.total), 1);
                return (
                  <div key={m.month} className="flex items-center gap-3">
                    <span className="text-xs font-semibold text-slate-500 w-7">{monthNames[m.month] || m.month}</span>
                    <div className="flex-1 bg-slate-100 rounded-full h-6 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-primary-400 to-primary-600 h-full rounded-full transition-all duration-500 ease-out flex items-center justify-end pr-2"
                        style={{ width: `${Math.max((m.total / maxVal) * 100, 8)}%` }}
                      >
                        {m.total > 0 && <span className="text-[10px] font-bold text-white">{m.total}</span>}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {recentThree.length > 0 && (
          <div className="lg:col-span-3 bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-900">Recent Requests</h2>
              <button
                onClick={() => navigate("/admin/leave-requests")}
                className="text-xs font-medium text-primary-600 hover:text-primary-700 transition-colors"
              >
                View All Requests
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-100">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="px-6 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Employee</th>
                    <th className="px-6 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Dates</th>
                    <th className="px-6 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {recentThree.map((req) => (
                    <tr key={req.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                            {(req.user?.name || "U").split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                          </div>
                          <span className="text-sm font-medium text-slate-800">{req.user?.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-3.5 text-sm text-slate-600">{req.leaveType?.name}</td>
                      <td className="px-6 py-3.5 text-sm text-slate-500">
                        {dayjs(req.start_date).format("MMM D")} - {dayjs(req.end_date).format("MMM D, YYYY")}
                      </td>
                      <td className="px-6 py-3.5">
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${statusColors[req.status] || "bg-slate-100 text-slate-600"}`}>
                          {req.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function EmployeeDashboard({ data }) {
  const navigate = useNavigate();
  const recentThree = (data.recent_requests || []).slice(0, 3);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">My Dashboard</h1>
        <p className="text-slate-500 mt-1">Your leave overview at a glance.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={HiCalendarDays} label="Total Requests" value={data.total_requests} color="text-violet-600" bgColor="bg-violet-50" />
        <StatCard icon={HiClock} label="Pending" value={data.pending_requests} color="text-amber-600" bgColor="bg-amber-50" />
        <StatCard icon={HiCheckCircle} label="Approved" value={data.approved_requests} color="text-emerald-600" bgColor="bg-emerald-50" />
        <StatCard icon={HiXCircle} label="Rejected" value={data.rejected_requests} color="text-red-600" bgColor="bg-red-50" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl p-6 text-white shadow-lg shadow-primary-200">
            <HiBriefcase className="h-8 w-8 text-primary-100 mb-4" />
            <h3 className="text-lg font-semibold">Quick Actions</h3>
            <p className="text-sm text-primary-100 mt-1 mb-5">Need time off? Submit a request.</p>
            <button
              onClick={() => navigate("/leave-requests")}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/20 hover:bg-white/30 rounded-xl text-sm font-medium transition-colors backdrop-blur-sm"
            >
              New Leave Request
              <HiArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          {data.monthly_requests && data.monthly_requests.length > 0 && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6">
              <h2 className="text-sm font-semibold text-slate-900 mb-5">Monthly Requests</h2>
              <div className="space-y-3.5">
                {data.monthly_requests.map((m) => {
                  const maxVal = Math.max(...data.monthly_requests.map((x) => x.total), 1);
                  return (
                    <div key={m.month} className="flex items-center gap-3">
                      <span className="text-xs font-semibold text-slate-500 w-7">{monthNames[m.month] || m.month}</span>
                      <div className="flex-1 bg-slate-100 rounded-full h-6 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-primary-400 to-primary-600 h-full rounded-full transition-all duration-500 ease-out flex items-center justify-end pr-2"
                          style={{ width: `${Math.max((m.total / maxVal) * 100, 8)}%` }}
                        >
                          {m.total > 0 && <span className="text-[10px] font-bold text-white">{m.total}</span>}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {recentThree.length > 0 && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-slate-900">Recent Requests</h2>
                <button
                  onClick={() => navigate("/leave-requests")}
                  className="text-xs font-medium text-primary-600 hover:text-primary-700 transition-colors"
                >
                  View All Requests
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-100">
                  <thead>
                    <tr className="bg-slate-50/50">
                      <th className="px-6 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Dates</th>
                      <th className="px-6 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Days</th>
                      <th className="px-6 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {recentThree.map((req) => (
                      <tr key={req.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-3.5 text-sm font-medium text-slate-800">{req.leaveType?.name}</td>
                        <td className="px-6 py-3.5 text-sm text-slate-500">
                          {dayjs(req.start_date).format("MMM D")} - {dayjs(req.end_date).format("MMM D, YYYY")}
                        </td>
                        <td className="px-6 py-3.5 text-sm text-slate-600 font-medium">{req.total_days}</td>
                        <td className="px-6 py-3.5">
                          <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${statusColors[req.status] || "bg-slate-100 text-slate-600"}`}>
                            {req.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { isAdmin } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const response = await dashboardService.getData();
        setData(response.data.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    }
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="h-12 w-12 rounded-2xl bg-red-50 flex items-center justify-center mb-4">
          <HiXCircle className="h-6 w-6 text-danger" />
        </div>
        <p className="text-sm font-medium text-slate-700">{error}</p>
      </div>
    );
  }

  if (!data) return null;

  return isAdmin ? <AdminDashboard data={data} /> : <EmployeeDashboard data={data} />;
}
