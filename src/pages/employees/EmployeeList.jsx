import { useState, useEffect, useCallback } from "react";
import employeeService from "../../services/employeeService";
import DataTable from "../../components/DataTable";
import Pagination from "../../components/Pagination";
import SearchBar from "../../components/SearchBar";
import ConfirmModal from "../../components/ConfirmModal";
import Swal from "sweetalert2";
import { HiPlus, HiPencilSquare, HiTrash } from "react-icons/hi2";

const emptyForm = { name: "", email: "", password: "", department: "" };

export default function EmployeeList() {
  const [employees, setEmployees] = useState([]);
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

  const fetchEmployees = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, per_page: 10 };
      if (search) params.search = search;
      const response = await employeeService.getAll(params);
      setEmployees(response.data.data);
      setPagination(response.data.pagination);
    } catch {
      Swal.fire({ icon: "error", title: "Error", text: "Failed to load employees." });
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

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

  const openEdit = (emp) => {
    setForm({ name: emp.name, email: emp.email, password: "", department: emp.department || "" });
    setEditMode(true);
    setEditId(emp.id);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editMode) {
        const payload = { name: form.name, email: form.email, department: form.department };
        if (form.password) payload.password = form.password;
        await employeeService.update(editId, payload);
        Swal.fire({ icon: "success", title: "Updated!", timer: 1500, showConfirmButton: false, toast: true, position: "top-end" });
      } else {
        await employeeService.create(form);
        Swal.fire({ icon: "success", title: "Created!", timer: 1500, showConfirmButton: false, toast: true, position: "top-end" });
      }
      setShowModal(false);
      fetchEmployees();
    } catch (err) {
      Swal.fire({ icon: "error", title: "Error", text: err.response?.data?.message || "Operation failed." });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await employeeService.delete(deleteTarget.id);
      Swal.fire({ icon: "success", title: "Deleted!", timer: 1500, showConfirmButton: false, toast: true, position: "top-end" });
      setDeleteTarget(null);
      fetchEmployees();
    } catch (err) {
      Swal.fire({ icon: "error", title: "Error", text: err.response?.data?.message || "Failed to delete." });
    }
  };

  const columns = [
    {
      key: "name",
      label: "Name",
      render: (val) => (
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
            {(val || "U").split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
          </div>
          <span className="font-medium text-slate-800">{val}</span>
        </div>
      ),
    },
    { key: "email", label: "Email" },
    { key: "department", label: "Department", render: (val) => val || <span className="text-slate-300">-</span> },
    {
      key: "actions",
      label: "",
      render: (_, row) => (
        <div className="flex items-center justify-end gap-1">
          <button onClick={(e) => { e.stopPropagation(); openEdit(row); }} className="p-2 rounded-lg text-slate-400 hover:text-primary-600 hover:bg-primary-50 transition-colors" title="Edit">
            <HiPencilSquare className="h-4 w-4" />
          </button>
          <button onClick={(e) => { e.stopPropagation(); setDeleteTarget(row); }} className="p-2 rounded-lg text-slate-400 hover:text-danger hover:bg-red-50 transition-colors" title="Delete">
            <HiTrash className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Employees</h1>
          <p className="text-slate-500 mt-1">{pagination.total} total employees</p>
        </div>
        <button onClick={openCreate} className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary-600 text-white text-sm font-medium rounded-xl hover:bg-primary-700 shadow-sm shadow-primary-200 transition-all">
          <HiPlus className="h-4 w-4" />
          Add Employee
        </button>
      </div>

      <SearchBar value={search} onChange={handleSearch} placeholder="Search by name, email, or department..." className="max-w-sm" />

      <DataTable columns={columns} data={employees} loading={loading} emptyTitle="No employees found" emptyDescription="Add your first employee to get started." />

      <Pagination currentPage={page} totalPages={pagination.last_page} onPageChange={setPage} />

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl shadow-slate-200/50 max-w-md w-full p-6 animate-scale-in">
            <h3 className="text-lg font-semibold text-slate-900">{editMode ? "Edit Employee" : "Add Employee"}</h3>
            <p className="text-sm text-slate-500 mt-1">{editMode ? "Update employee information" : "Create a new employee account"}</p>
            <form onSubmit={handleSubmit} className="space-y-4 mt-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Full name</label>
                <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Email address</label>
                <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Password {editMode && <span className="text-slate-400 font-normal">(leave blank to keep)</span>}</label>
                <input type="password" required={!editMode} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Department</label>
                <input type="text" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all" placeholder="e.g. Engineering" />
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

      <ConfirmModal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} title="Delete Employee" message={`Are you sure you want to delete ${deleteTarget?.name}? This action cannot be undone.`} />
    </div>
  );
}
