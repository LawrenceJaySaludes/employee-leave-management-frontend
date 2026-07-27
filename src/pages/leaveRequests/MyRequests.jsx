import { useState, useEffect, useCallback } from "react";
import leaveRequestService from "../../services/leaveRequestService";
import leaveTypeService from "../../services/leaveTypeService";
import DataTable from "../../components/DataTable";
import ConfirmModal from "../../components/ConfirmModal";
import DemoButton from "../../components/DemoButton";
import Swal from "sweetalert2";
import dayjs from "dayjs";
import { HiPlus, HiTrash } from "react-icons/hi2";

const statusColors = {
  pending: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  approved: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  rejected: "bg-red-50 text-red-700 ring-1 ring-red-200",
};

const emptyForm = { leave_type_id: "", start_date: "", end_date: "", reason: "" };

export default function MyRequests() {
  const [requests, setRequests] = useState([]);
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    try {
      const response = await leaveRequestService.getMyRequests();
      setRequests(response.data.data);
    } catch {
      Swal.fire({ icon: "error", title: "Error", text: "Failed to load leave requests." });
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchLeaveTypes = useCallback(async () => {
    try {
      const response = await leaveTypeService.getAll({ per_page: 100 });
      setLeaveTypes(response.data.data);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    fetchRequests();
    fetchLeaveTypes();
  }, [fetchRequests, fetchLeaveTypes]);

  const openCreate = () => {
    setForm(emptyForm);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await leaveRequestService.create(form);
      Swal.fire({ icon: "success", title: "Submitted!", timer: 1500, showConfirmButton: false, toast: true, position: "top-end" });
      setShowModal(false);
      fetchRequests();
    } catch (err) {
      Swal.fire({ icon: "error", title: "Error", text: err.response?.data?.message || "Failed to submit request." });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await leaveRequestService.delete(deleteTarget.id);
      Swal.fire({ icon: "success", title: "Cancelled!", timer: 1500, showConfirmButton: false, toast: true, position: "top-end" });
      setDeleteTarget(null);
      fetchRequests();
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.error || err.message || "Failed to cancel the request.";
      Swal.fire({ icon: "error", title: "Delete Failed", text: msg });
    }
  };

  const columns = [
    { key: "leave_type", label: "Leave Type", render: (val) => <span className="font-medium text-slate-800">{val}</span> },
    {
      key: "start_date",
      label: "Start Date",
      render: (val) => dayjs(val).format("MMM D, YYYY"),
    },
    {
      key: "end_date",
      label: "End Date",
      render: (val) => dayjs(val).format("MMM D, YYYY"),
    },
    { key: "total_days", label: "Days", render: (val) => <span className="font-semibold text-slate-700">{val}</span> },
    { key: "reason", label: "Reason", render: (val) => <span className="text-slate-500 line-clamp-1 max-w-[200px]">{val}</span> },
    {
      key: "status",
      label: "Status",
      render: (val) => (
        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${statusColors[val] || "bg-slate-100 text-slate-600"}`}>
          {val}
        </span>
      ),
    },
    {
      key: "actions",
      label: "",
      render: (_, row) => (
        <div className="flex items-center justify-end gap-1">
          {row.status === "pending" && (
            <DemoButton onClick={(e) => { e.stopPropagation(); setDeleteTarget(row); }} className="p-2 rounded-lg text-slate-400 hover:text-danger hover:bg-red-50 transition-colors" title="Cancel request">
              <HiTrash className="h-4 w-4" />
            </DemoButton>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">My Leave Requests</h1>
          <p className="text-slate-500 mt-1">{requests.length} requests</p>
        </div>
        <DemoButton onClick={openCreate} className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary-600 text-white text-sm font-medium rounded-xl hover:bg-primary-700 shadow-sm shadow-primary-200 transition-all">
          <HiPlus className="h-4 w-4" />
          New Request
        </DemoButton>
      </div>

      <DataTable columns={columns} data={requests} loading={loading} emptyTitle="No leave requests" emptyDescription="Submit your first leave request to get started." />

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl shadow-slate-200/50 max-w-md w-full p-6 animate-scale-in">
            <h3 className="text-lg font-semibold text-slate-900">New Leave Request</h3>
            <p className="text-sm text-slate-500 mt-1">Submit a new request for time off</p>
            <form onSubmit={handleSubmit} className="space-y-4 mt-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Leave Type</label>
                <select required value={form.leave_type_id} onChange={(e) => setForm({ ...form, leave_type_id: e.target.value })} className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all bg-white">
                  <option value="">Select leave type</option>
                  {leaveTypes.map((lt) => (
                    <option key={lt.id} value={lt.id}>{lt.name} ({lt.days_allowed} days)</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Start Date</label>
                  <input type="date" required value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })} className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">End Date</label>
                  <input type="date" required value={form.end_date} onChange={(e) => setForm({ ...form, end_date: e.target.value })} className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Reason</label>
                <textarea rows={3} required value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all resize-none" placeholder="Briefly describe the reason for your leave..." />
              </div>
              <div className="flex justify-end gap-3 pt-3">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2.5 text-sm font-medium text-slate-700 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors">Cancel</button>
                <button type="submit" disabled={saving} className="px-5 py-2.5 text-sm font-medium text-white bg-primary-600 rounded-xl hover:bg-primary-700 disabled:opacity-50 shadow-sm shadow-primary-200 transition-all">
                  {saving ? "Submitting..." : "Submit Request"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} title="Cancel Request" message="Are you sure you want to cancel this leave request?" confirmText="Cancel Request" confirmColor="bg-danger hover:bg-red-600" />
    </div>
  );
}
