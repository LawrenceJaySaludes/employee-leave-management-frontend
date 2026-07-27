import { useAuth } from "../hooks/useAuth";
import { HiUser, HiEnvelope, HiBriefcase, HiShieldCheck, HiCalendarDays } from "react-icons/hi2";
import dayjs from "dayjs";

export default function Profile() {
  const { user } = useAuth();

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  const infoItems = [
    { icon: HiEnvelope, label: "Email", value: user?.email },
    { icon: HiShieldCheck, label: "Role", value: user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : "Employee" },
    { icon: HiBriefcase, label: "Department", value: user?.department || "Not assigned" },
    { icon: HiCalendarDays, label: "Joined", value: user?.created_at ? dayjs(user.created_at).format("MMMM D, YYYY") : "-" },
  ];

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Profile</h1>
        <p className="text-slate-500 mt-1">Your account information</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
        <div className="h-24 bg-gradient-to-r from-primary-500 to-primary-700 relative" />
        <div className="px-8 pb-8">
          <div className="flex items-end gap-5 -mt-8">
            <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-2xl font-bold ring-4 ring-white shadow-lg flex-shrink-0">
              {initials}
            </div>
            <div className="pb-2">
              <h2 className="text-xl font-bold text-slate-900">{user?.name}</h2>
              <p className="text-sm text-slate-500">{user?.email}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {infoItems.map((item) => (
          <div key={item.label} className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-5">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-slate-100">
                <item.icon className="h-5 w-5 text-slate-500" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{item.label}</p>
                <p className="text-sm font-semibold text-slate-800 mt-0.5">{item.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6">
        <h3 className="text-sm font-semibold text-slate-900 mb-4">Role & Permissions</h3>
        <div className="flex items-center gap-3">
          <span className={`inline-flex px-3 py-1.5 rounded-full text-xs font-semibold ${
            user?.role === "admin"
              ? "bg-primary-50 text-primary-700 ring-1 ring-primary-200"
              : "bg-slate-100 text-slate-600 ring-1 ring-slate-200"
          }`}>
            {user?.role === "admin" ? (
              <span className="flex items-center gap-1.5">
                <HiUser className="h-3.5 w-3.5" />
                Administrator
              </span>
            ) : (
              <span className="flex items-center gap-1.5">
                <HiUser className="h-3.5 w-3.5" />
                Employee
              </span>
            )}
          </span>
        </div>
      </div>
    </div>
  );
}
