import { HiInbox } from "react-icons/hi2";

export default function EmptyState({ icon, title, description, action }) {
  const Icon = icon || HiInbox;

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="rounded-2xl bg-slate-100 p-4 mb-4">
        <Icon className="h-10 w-10 text-slate-400" />
      </div>
      <h3 className="text-base font-semibold text-slate-700 mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-slate-500 max-w-sm mb-4">{description}</p>
      )}
      {action}
    </div>
  );
}
