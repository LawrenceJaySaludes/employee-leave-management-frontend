import { useState, useEffect, useCallback } from "react";
import leaveTypeService from "../../services/leaveTypeService";
import DataTable from "../../components/DataTable";
import Pagination from "../../components/Pagination";
import SearchBar from "../../components/SearchBar";
import ConfirmModal from "../../components/ConfirmModal";
import DemoButton from "../../components/DemoButton";
import Swal from "sweetalert2";
import { HiPlus, HiPencilSquare, HiTrash } from "react-icons/hi2";

const emptyForm = { name: "", description: "", days_allowed: "", is_paid: true, status: true };

const DEFAULT_LEAVE_TYPES = [
  { name: "Annual Leave", description: "Vacation leave for personal time off", days_allowed: 15, is_paid: true, status: true },
  { name: "Sick Leave", description: "Medical leave for health-related absences", days_allowed: 10, is_paid: true, status: true },
  { name: "Emergency Leave", description: "Leave for unforeseen emergencies", days_allowed: 5, is_paid: true, status: true },
  { name: "Maternity Leave", description: "Leave for expecting mothers", days_allowed: 105, is_paid: true, status: true },
  { name: "Paternity Leave", description: "Leave for new fathers", days_allowed: 7, is_paid: true, status: true },
  { name: "Bereavement Leave", description: "Leave for the loss of an immediate family member", days_allowed: 5, is_paid: true, status: true },
  { name: "Solo Parent Leave", description: "Leave for solo parents as mandated by law", days_allowed: 7, is_paid: true, status: true },
  { name: "Study Leave", description: "Leave for educational pursuits and examinations", days_allowed: 10, is_paid: true, status: true },
  { name: "Birthday Leave", description: "Leave on the employee's birthday", days_allowed: 1, is_paid: true, status: true },
  { name: "Compensatory Leave", description: "Offset leave for overtime or holiday work", days_allowed: 5, is_paid: true, status: true },
  { name: "Special Leave", description: "Leave granted for special circumstances", days_allowed: 15, is_paid: true, status: true },
  { name: "Unpaid Leave", description: "Leave without pay", days_allowed: 365, is_paid: false, status: true },
];

async function seedDefaultTypes(existingTypes) {
  const existingNames = new Set(existingTypes.map((t) => t.name.toLowerCase()));
  const missing = DEFAULT_LEAVE_TYPES.filter((t) => !existingNames.has(t.name.toLowerCase()));
  if (missing.length === 0) return 0;
  let created = 0;
  for (const lt of missing) {
    try {
      await leaveTypeService.create(lt);
      created++;
    } catch {
      // skip if creation fails (e.g. duplicate)
    }
  }
  return created;
}

export default function LeaveTypeList() {
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ last_page: 1, total: 0 });
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchLeaveTypes = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, per_page: 10 };
      if (search) params.search = search;
      const response = await leaveTypeService.getAll(params);
      setLeaveTypes(response.data.data);
      setPagination(response.data.pagination);
    } catch {
      Swal.fire({ icon: "error", title: "Error", text: "Failed to load leave types." });
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    fetchLeaveTypes();
  }, [fetchLeaveTypes]);

  useEffect(() => {
    async function seed() {
      try {
        let allTypes = [];
        let page = 1;
        let lastPage = 1;
        do {
          const response = await leaveTypeService.getAll({ page, per_page: 50 });
          allTypes = allTypes.concat(response.data.data);
          lastPage = response.data.pagination.last_page;
          page++;
        } while (page <= lastPage);
        await seedDefaultTypes(allTypes);
      } catch {
        // ignore seeding errors silently
      }
    }
    seed();
  }, []);

  const handleSearch = (value) => {
    setSearch(value);
    setPage(1);
  };

  const openCreate = () => {
    setForm(emptyForm);
    setEditMode(false);
    setEditId(null);
    setShowModal(true);
  };

  const openEdit = (lt) => {
    setForm({ name: lt.name, description: lt.description || "", days_allowed: lt.days_allowed, is_paid: lt.is_paid, status: lt.status });
    setEditMode(true);
    setEditId(lt.id);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form, days_allowed: Number(form.days_allowed) };
      if (editMode) {
        await leaveTypeService.update(editId, payload);
        Swal.fire({ icon: "success", title: "Updated!", timer: 1500, showConfirmButton: false, toast: true, position: "top-end" });
      } else {
        await leaveTypeService.create(payload);
        Swal.fire({ icon: "success", title: "Created!", timer: 1500, showConfirmButton: false, toast: true, position: "top-end" });
      }
      setShowModal(false);
      fetchLeaveTypes();
    } catch (err) {
      Swal.fire({ icon: "error", title: "Error", text: err.response?.data?.message || "Operation failed." });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await leaveTypeService.delete(deleteTarget.id);
      Swal.fire({ icon: "success", title: "Deleted!", timer: 1500, showConfirmButton: false, toast: true, position: "top-end" });
      setDeleteTarget(null);
      fetchLeaveTypes();
    } catch (err) {
      Swal.fire({ icon: "error", title: "Error", text: err.response?.data?.message || "Failed to delete." });
    }
  };

  const columns = [
    { key: "name", label: "Name", render: (val) => <span className="font-medium text-slate-800">{val}</span> },
    { key: "description", label: "Description", render: (val) => <span className="text-slate-500">{val || "-"}</span> },
    { key: "days_allowed", label: "Days", render: (val) => <span className="font-semibold text-slate-700">{val}</span> },
    {
      key: "is_paid",
      label: "Type",
      render: (val) => (
        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${val ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200" : "bg-slate-100 text-slate-600 ring-1 ring-slate-200"}`}>
          {val ? "Paid" : "Unpaid"}
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (val) => (
        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${val ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200" : "bg-slate-100 text-slate-500 ring-1 ring-slate-200"}`}>
          {val ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      key: "actions",
      label: "",
      render: (_, row) => (
        <div className="flex items-center justify-end gap-1">
          <DemoButton onClick={(e) => { e.stopPropagation(); openEdit(row); }} className="p-2 rounded-lg text-slate-400 hover:text-primary-600 hover:bg-primary-50 transition-colors" title="Edit">
            <HiPencilSquare className="h-4 w-4" />
          </DemoButton>
          <DemoButton onClick={(e) => { e.stopPropagation(); setDeleteTarget(row); }} className="p-2 rounded-lg text-slate-400 hover:text-danger hover:bg-red-50 transition-colors" title="Delete">
            <HiTrash className="h-4 w-4" />
          </DemoButton>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Leave Types</h1>
          <p className="text-slate-500 mt-1">{pagination.total} leave types</p>
        </div>
        <DemoButton onClick={openCreate} className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary-600 text-white text-sm font-medium rounded-xl hover:bg-primary-700 shadow-sm shadow-primary-200 transition-all">
          <HiPlus className="h-4 w-4" />
          Add Leave Type
        </DemoButton>
      </div>

      <SearchBar value={search} onChange={handleSearch} placeholder="Search leave types..." className="max-w-sm" />

      <DataTable columns={columns} data={leaveTypes} loading={loading} emptyTitle="No leave types found" emptyDescription="Create your first leave type to get started." />

      <Pagination currentPage={page} totalPages={pagination.last_page} onPageChange={setPage} />

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl shadow-slate-200/50 max-w-md w-full p-6 animate-scale-in">
            <h3 className="text-lg font-semibold text-slate-900">{editMode ? "Edit Leave Type" : "Add Leave Type"}</h3>
            <p className="text-sm text-slate-500 mt-1">{editMode ? "Update leave type details" : "Create a new leave category"}</p>
            <form onSubmit={handleSubmit} className="space-y-4 mt-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Name</label>
                <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all" placeholder="e.g. Annual Leave" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Description</label>
                <textarea rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all resize-none" placeholder="Optional description..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Days Allowed</label>
                <input type="number" min="1" required value={form.days_allowed} onChange={(e) => setForm({ ...form, days_allowed: e.target.value })} className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all" />
              </div>
              <div className="flex items-center gap-6 pt-1">
                <label className="flex items-center gap-2.5 text-sm text-slate-700 cursor-pointer">
                  <input type="checkbox" checked={form.is_paid} onChange={(e) => setForm({ ...form, is_paid: e.target.checked })} className="w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500/20" />
                  Paid Leave
                </label>
                <label className="flex items-center gap-2.5 text-sm text-slate-700 cursor-pointer">
                  <input type="checkbox" checked={form.status} onChange={(e) => setForm({ ...form, status: e.target.checked })} className="w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500/20" />
                  Active
                </label>
              </div>
              <div className="flex justify-end gap-3 pt-3">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2.5 text-sm font-medium text-slate-700 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors">Cancel</button>
                <button type="submit" disabled={saving} className="px-5 py-2.5 text-sm font-medium text-white bg-primary-600 rounded-xl hover:bg-primary-700 disabled:opacity-50 shadow-sm shadow-primary-200 transition-all">
                  {saving ? "Saving..." : editMode ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} title="Delete Leave Type" message={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`} />
    </div>
  );
}
