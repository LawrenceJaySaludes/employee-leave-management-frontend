import { isDemoMode } from "../config/demo";

export default function DemoButton({ children, onClick, className = "", disabled, ...rest }) {
  const isDisabled = isDemoMode || disabled;

  return (
    <div className="relative group/demo inline-flex">
      <button
        {...rest}
        disabled={isDisabled}
        onClick={isDisabled ? undefined : onClick}
        className={`${className} ${isDemoMode && !disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        {children}
      </button>
      {isDemoMode && (
        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-slate-800 text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover/demo:opacity-100 transition-opacity pointer-events-none z-50 shadow-lg">
          Disabled in Demo Mode
          <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800" />
        </span>
      )}
    </div>
  );
}
