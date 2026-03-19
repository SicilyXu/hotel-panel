import { OrderStatus, SortOption } from "../../../types/order";
import { Button } from "../../../components/base/Button";

interface FilterBarProps {
  activeStatus: OrderStatus | "all";
  onStatusChange: (s: OrderStatus | "all") => void;
  sortBy: SortOption;
  onSortChange: (s: SortOption) => void;
  counts: Record<string, number>;
}

const statusFilters: {
  key: OrderStatus | "all";
  label: string;
  color: string;
  activeColor: string;
}[] = [
  { key: "all",        label: "All",        color: "border-gray-200 text-gray-600 hover:border-gray-400",          activeColor: "bg-gray-900 text-white border-gray-900" },
  { key: "Placed",     label: "Placed",     color: "border-slate-200 text-slate-600 hover:border-slate-400",        activeColor: "bg-slate-600 text-white border-slate-600" },
  { key: "Accepted",   label: "Accepted",   color: "border-teal-200 text-teal-700 hover:border-teal-400",           activeColor: "bg-teal-600 text-white border-teal-600" },
  { key: "Preparing",  label: "Preparing",  color: "border-amber-200 text-amber-700 hover:border-amber-400",        activeColor: "bg-amber-500 text-white border-amber-500" },
  { key: "Ready",      label: "Ready",      color: "border-emerald-200 text-emerald-700 hover:border-emerald-400",  activeColor: "bg-emerald-500 text-white border-emerald-500" },
  { key: "PickedUp",   label: "Picked Up",  color: "border-teal-200 text-teal-600 hover:border-teal-400",           activeColor: "bg-teal-500 text-white border-teal-500" },
  { key: "Delivering", label: "Delivering", color: "border-sky-200 text-sky-700 hover:border-sky-400",              activeColor: "bg-sky-500 text-white border-sky-500" },
  { key: "Delivered",  label: "Delivered",  color: "border-emerald-200 text-emerald-800 hover:border-emerald-400",  activeColor: "bg-emerald-700 text-white border-emerald-700" },
  { key: "Cancelled",  label: "Cancelled",  color: "border-gray-200 text-gray-500 hover:border-gray-400",           activeColor: "bg-gray-400 text-white border-gray-400" },
];

export function FilterBar({ activeStatus, onStatusChange, sortBy, onSortChange, counts }: FilterBarProps) {
  return (
    <div className="bg-white border-b border-gray-100 px-6 py-3 flex items-center gap-3 flex-wrap sticky top-0 z-10">
      <div className="flex items-center gap-2 flex-wrap flex-1">
        {statusFilters.map(f => (
          <button
            key={f.key}
            onClick={() => onStatusChange(f.key)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer whitespace-nowrap
              ${activeStatus === f.key ? f.activeColor : f.color}`}
          >
            {f.label}
            <span className={`text-[10px] font-bold px-1 rounded-full leading-tight
              ${activeStatus === f.key ? "bg-white/25 text-white" : "bg-gray-100 text-gray-600"}`}>
              {counts[f.key] ?? 0}
            </span>
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        <div className="w-4 h-4 flex items-center justify-center">
          <i className="ri-sort-desc text-gray-400 text-sm" />
        </div>
        <select
          value={sortBy}
          onChange={e => onSortChange(e.target.value as SortOption)}
          className="text-xs border border-gray-200 rounded-lg px-2.5 py-1.5 text-gray-700 bg-white cursor-pointer focus:outline-none focus:border-gray-400"
        >
          <option value="latest">Latest First</option>
          <option value="room">Room Number</option>
          <option value="amount">Highest Amount</option>
        </select>

        <Button variant="primary" size="sm" icon="ri-add-line">New Order</Button>
      </div>
    </div>
  );
}
