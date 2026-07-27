import { NavLink } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import {
  HiHome,
  HiUsers,
  HiCalendarDays,
  HiClipboardDocumentList,
  HiCheckBadge,
  HiCog6Tooth,
  HiUserCircle,
  HiXMark,
} from "react-icons/hi2";

const mainNav = [
  { name: "Dashboard", href: "/dashboard", icon: HiHome },
];

const managementNav = [
  { name: "Employees", href: "/employees", icon: HiUsers, adminOnly: true },
  { name: "Leave Types", href: "/leave-types", icon: HiCalendarDays, adminOnly: true },
  { name: "Leave Requests", href: "/leave-requests", icon: HiClipboardDocumentList },
  { name: "Approval Queue", href: "/admin/leave-requests", icon: HiCheckBadge, adminOnly: true },
];

const bottomNav = [
  { name: "Profile", href: "/profile", icon: HiUserCircle },
  { name: "Settings", href: "/settings", icon: HiCog6Tooth },
];

function NavItem({ item, onClick }) {
  return (
    <NavLink
      to={item.href}
      onClick={onClick}
      className={({ isActive }) =>
        `group flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-150 ${
          isActive
            ? "bg-primary-50 text-primary-700 shadow-sm shadow-primary-100"
            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
        }`
      }
    >
      {({ isActive }) => (
        <>
          <div
            className={`flex items-center justify-center w-8 h-8 rounded-lg transition-colors duration-150 ${
              isActive
                ? "bg-primary-100 text-primary-600"
                : "bg-slate-100 text-slate-400 group-hover:bg-slate-200 group-hover:text-slate-600"
            }`}
          >
            <item.icon className="h-[18px] w-[18px]" />
          </div>
          {item.name}
        </>
      )}
    </NavLink>
  );
}

export default function Sidebar({ mobileOpen, setMobileOpen }) {
  const { isAdmin } = useAuth();

  const filteredManagement = managementNav.filter((item) => !item.adminOnly || isAdmin);

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-50 h-full w-[260px] bg-white border-r border-slate-200/80 transform transition-transform duration-300 ease-out lg:translate-x-0 ${
          mobileOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between h-[68px] px-5 border-b border-slate-100">
            <NavLink to="/dashboard" className="flex items-center gap-2.5 group">
              <img src="/lms.png" alt="LeaveHub" className="h-9 w-9 rounded-xl object-cover shadow-md shadow-primary-200 group-hover:shadow-lg group-hover:shadow-primary-200 transition-shadow" />
              <div className="flex flex-col">
                <span className="text-[15px] font-bold text-slate-900 tracking-tight leading-none">LeaveHub</span>
                <span className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">Management</span>
              </div>
            </NavLink>
            <button
              onClick={() => setMobileOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
            >
              <HiXMark className="h-5 w-5" />
            </button>
          </div>

          <nav className="flex-1 px-3 py-4 space-y-6 overflow-y-auto">
            <div className="space-y-1">
              {mainNav.map((item) => (
                <NavItem key={item.name} item={item} onClick={() => setMobileOpen(false)} />
              ))}
            </div>

            {filteredManagement.length > 0 && (
              <div className="space-y-1">
                <p className="px-3 text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
                  Management
                </p>
                {filteredManagement.map((item) => (
                  <NavItem key={item.name} item={item} onClick={() => setMobileOpen(false)} />
                ))}
              </div>
            )}
          </nav>

          <div className="px-3 py-4 border-t border-slate-100 space-y-1">
            <p className="px-3 text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
              Account
            </p>
            {bottomNav.map((item) => (
              <NavItem key={item.name} item={item} onClick={() => setMobileOpen(false)} />
            ))}
          </div>
        </div>
      </aside>
    </>
  );
}
