import { useState, useEffect, useCallback, useContext } from "react";
import leaveRequestService from "../../services/leaveRequestService";
import DataTable from "../../components/DataTable";
import Pagination from "../../components/Pagination";
import SearchBar from "../../components/SearchBar";
import { AuthContext } from "../../contexts/AuthContext";
import Swal from "sweetalert2";
import dayjs from "dayjs";
import { HiCheckCircle, HiXCircle } from "react-icons/hi2";

const statusColors = {
  pending: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  approved: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  rejected: "bg-red-50 text-red-700 ring-1 ring-red-200",
};

export default function AllRequests() {
  const { user } = useContext(AuthContext);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ last_page: 1, total: 0 });
  const [actionLoading, setActionLoading] = useState(null);

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, per_page: 10 };
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;
      const response = await leaveRequestService.getAdminRequests(params);
      setRequests(response.data.data);
      setPagination(response.data.pagination);
    } catch {
      Swal.fire({ icon: "error", title: "Error", text: "Failed to load leave requests." });
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const handleSearch = (value) => {
    setSearch(value);
    setPage(1);
  };

  const handleStatusFilter = (value) => {
    setStatusFilter(value);
    setPage(1);
  };

  const handleApprove = async (req) => {
    const result = await Swal.fire({
      title: "Approve Leave Request",
      text: `Approve ${req.employee}'s ${req.leave_type} leave request (${req.total_days} day${req.total_days > 1 ? "s" : ""})?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#10b981",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, approve it",
    });
    if (!result.isConfirmed) return;

    setActionLoading(req.id);
    try {
      await leaveRequestService.approve(req.id);
      Swal.fire({
        icon: "success",
        title: "Approved!",
        text: "Leave request has been approved.",
        timer: 2000,
        showConfirmButton: false,
        toast: true,
        position: "top-end",
      });
      fetchRequests();
    } catch (err) {
      Swal.fire({ icon: "error", title: "Error", text: err.response?.data?.message || "Failed to approve." });
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (req) => {
    const result = await Swal.fire({
      title: "Reject Leave Request",
      text: `Reject ${req.employee}'s ${req.leave_type} leave request?`,
      input: "textarea",
      inputPlaceholder: "Rejection reason (optional)",
      inputAttributes: { "aria-label": "Rejection reason" },
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, reject it",
    });
    if (!result.isConfirmed) return;

    setActionLoading(req.id);
    try {
      await leaveRequestService.reject(req.id);
      Swal.fire({
        icon: "success",
        title: "Rejected!",
        text: "Leave request has been rejected.",
        timer: 2000,
        showConfirmButton: false,
        toast: true,
        position: "top-end",
      });
      fetchRequests();
    } catch (err) {
      Swal.fire({ icon: "error", title: "Error", text: err.response?.data?.message || "Failed to reject." });
    } finally {
      setActionLoading(null);
    }
  };

  const columns = [
    {
      key: "employee",
      label: "Employee",
      render: (val) => (
        <div className="flex items-center gap-2.5">
          <div className="h-7 w-7 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-[10px] font-semibold flex-shrink-0">
            {(val || "U").split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
          </div>
          <span className="font-medium text-slate-800">{val}</span>
        </div>
      ),
    },
    { key: "leave_type", label: "Leave Type", render: (val) => <span className="font-medium text-slate-800">{val}</span> },
    {
      key: "start_date",
      label: "From",
      render: (val) => dayjs(val).format("MMM D, YYYY"),
    },
    {
      key: "end_date",
      label: "To",
      render: (val) => dayjs(val).format("MMM D, YYYY"),
    },
    { key: "total_days", label: "Days", render: (val) => <span className="font-semibold text-slate-700">{val}</span> },
    { key: "reason", label: "Reason", render: (val) => <span className="text-slate-500 line-clamp-1 max-w-[150px]">{val}</span> },
    {
      key: "status",
      label: "Status",
      render: (val, row) => (
        <div className="flex flex-col gap-1">
          <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${statusColors[val] || "bg-slate-100 text-slate-600"}`}>
            {val}
          </span>
          {(val === "approved" || val === "rejected") && row.approved_by && (
            <span className="text-[11px] text-slate-400">
              {val === "approved" ? "by" : "by"} {row.approved_by}
              {row.approved_at && ` · ${dayjs(row.approved_at).format("MMM D")}`}
            </span>
          )}
        </div>
      ),
    },
    {
      key: "actions",
      label: "",
      render: (_, row) => {
        if (row.status !== "pending") return <span className="text-xs text-slate-300 italic">-</span>;
        if (user && row.user_id === user.id) {
          return <span className="text-xs text-slate-400 italic whitespace-nowrap">Cannot approve your own request</span>;
        }
        const isLoading = actionLoading === row.id;
        return (
          <div className="flex items-center justify-end gap-1">
            <button
              onClick={(e) => { e.stopPropagation(); handleApprove(row); }}
              disabled={isLoading}
              className="p-2 rounded-lg text-emerald-500 hover:bg-emerald-50 disabled:opacity-40 transition-colors"
              title="Approve"
            >
              <HiCheckCircle className="h-5 w-5" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); handleReject(row); }}
              disabled={isLoading}
              className="p-2 rounded-lg text-red-500 hover:bg-red-50 disabled:opacity-40 transition-colors"
              title="Reject"
            >
              <HiXCircle className="h-5 w-5" />
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">All Leave Requests</h1>
        <p className="text-slate-500 mt-1">{pagination.total} total requests</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <SearchBar value={search} onChange={handleSearch} placeholder="Search by employee name..." className="max-w-sm" />
        <select value={statusFilter} onChange={(e) => handleStatusFilter(e.target.value)} className="px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 bg-white transition-all">
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      <div className="approval-queue-scroll overflow-y-auto rounded-2xl" style={{ maxHeight: "60vh", scrollBehavior: "smooth" }}>
        <DataTable columns={columns} data={requests} loading={loading} emptyTitle="No leave requests found" emptyDescription="There are no leave requests matching your filters." />
      </div>

      <Pagination currentPage={page} totalPages={pagination.last_page} onPageChange={setPage} />
    </div>
  );
}
