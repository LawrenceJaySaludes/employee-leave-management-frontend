import { useAuth } from "../hooks/useAuth";
import { HiCog6Tooth, HiInformationCircle } from "react-icons/hi2";

export default function Settings() {
  const { user } = useAuth();

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Settings</h1>
        <p className="text-slate-500 mt-1">Manage your account preferences</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-primary-50">
            <HiCog6Tooth className="h-5 w-5 text-primary-600" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Account Settings</h3>
            <p className="text-xs text-slate-500">Manage your account information</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-slate-100">
            <div>
              <p className="text-sm font-medium text-slate-700">Email Address</p>
              <p className="text-sm text-slate-500">{user?.email}</p>
            </div>
          </div>
          <div className="flex items-center justify-between py-3 border-b border-slate-100">
            <div>
              <p className="text-sm font-medium text-slate-700">Role</p>
              <p className="text-sm text-slate-500 capitalize">{user?.role}</p>
            </div>
          </div>
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="text-sm font-medium text-slate-700">Department</p>
              <p className="text-sm text-slate-500">{user?.department || "Not assigned"}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-50 rounded-2xl border border-slate-200/60 p-5 flex items-start gap-3">
        <HiInformationCircle className="h-5 w-5 text-slate-400 mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-sm font-medium text-slate-700">Need to change your settings?</p>
          <p className="text-sm text-slate-500 mt-1">Contact your administrator to update account settings, permissions, or department information.</p>
        </div>
      </div>
    </div>
  );
}
