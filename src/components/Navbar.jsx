import { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { HiBars3, HiBell, HiArrowRightOnRectangle, HiChevronRight, HiMagnifyingGlass } from "react-icons/hi2";

const routeTitles = {
  "/dashboard": "Dashboard",
  "/employees": "Employees",
  "/leave-types": "Leave Types",
  "/leave-requests": "My Leave Requests",
  "/admin/leave-requests": "All Leave Requests",
  "/profile": "Profile",
  "/settings": "Settings",
};

export default function Navbar({ onMenuClick }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  const currentTitle = routeTitles[location.pathname] || "Dashboard";
  const breadcrumb = location.pathname === "/dashboard" ? null : (
    <span className="flex items-center gap-1.5 text-sm text-slate-400">
      <HiChevronRight className="h-3.5 w-3.5" />
      <span className="text-slate-600 font-medium">{currentTitle}</span>
    </span>
  );

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-slate-200/60">
      <div className="flex items-center justify-between h-[68px] px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors"
          >
            <HiBars3 className="h-5 w-5" />
          </button>

          <div className="hidden lg:flex items-center gap-1.5">
            <span className="text-[15px] font-semibold text-slate-800">{currentTitle}</span>
            {breadcrumb}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200/60 rounded-xl text-sm text-slate-400 min-w-[200px]">
            <HiMagnifyingGlass className="h-4 w-4 text-slate-400" />
            <span>Search...</span>
            <kbd className="ml-auto text-[10px] font-medium bg-white border border-slate-200 rounded px-1.5 py-0.5 text-slate-400">
              /
            </kbd>
          </div>

          <button className="relative p-2.5 rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors">
            <HiBell className="h-5 w-5" />
            <span className="absolute top-2 right-2 h-2 w-2 bg-danger rounded-full ring-2 ring-white" />
          </button>

          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center justify-center h-9 w-9 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 text-white text-sm font-semibold shadow-sm">
                {initials}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium text-slate-800 leading-none">{user?.name}</p>
                <p className="text-xs text-slate-400 mt-0.5 capitalize">{user?.role}</p>
              </div>
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200/60 py-1.5 animate-scale-in z-50">
                <div className="px-4 py-3 border-b border-slate-100">
                  <p className="text-sm font-semibold text-slate-800">{user?.name}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{user?.email}</p>
                </div>
                <div className="py-1.5">
                  <button
                    onClick={() => { setDropdownOpen(false); logout(); }}
                    className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm font-medium text-danger hover:bg-red-50 transition-colors"
                  >
                    <HiArrowRightOnRectangle className="h-4 w-4" />
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
