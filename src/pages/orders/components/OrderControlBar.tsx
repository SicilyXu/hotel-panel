import { useRef } from "react";
import { OrderStatus, SortOption } from "../../../types/order";
import { Button } from "../../../components/base/Button";

export type AttentionFilter = "all" | "attention" | "urgent" | "delayed" | "reminder";

interface OrderControlBarProps {
  // Search
  search: string;
  onSearchChange: (v: string) => void;

  // Status filter
  activeStatus: OrderStatus | "all";
  onStatusChange: (s: OrderStatus | "all") => void;
  statusCounts: Record<string, number>;

  // Attention filter
  attentionFilter: AttentionFilter;
  onAttentionChange: (a: AttentionFilter) => void;
  urgentCount: number;
  delayedCount: number;
  reminderCount: number;

  // Sort
  sortBy: SortOption;
  onSortChange: (s: SortOption, dir?: "asc" | "desc") => void;

  // Result count
  resultCount: number;
  totalCount: number;
}

const statusChips: { key: OrderStatus | "all"; label: string; activeClasses: string; inactiveClasses: string }[] = [
  { key: "all",        label: "All",        activeClasses: "bg-gray-900 text-white",          inactiveClasses: "text-gray-600 hover:bg-gray-100" },
  { key: "Placed",     label: "Placed",     activeClasses: "bg-slate-600 text-white",          inactiveClasses: "text-slate-600 hover:bg-slate-100" },
  { key: "Accepted",   label: "Accepted",   activeClasses: "bg-teal-600 text-white",           inactiveClasses: "text-teal-700 hover:bg-teal-50" },
  { key: "Preparing",  label: "Preparing",  activeClasses: "bg-amber-500 text-white",          inactiveClasses: "text-amber-700 hover:bg-amber-50" },
  { key: "Ready",      label: "Ready",      activeClasses: "bg-emerald-500 text-white",        inactiveClasses: "text-emerald-700 hover:bg-emerald-50" },
  { key: "PickedUp",   label: "Picked Up",  activeClasses: "bg-teal-500 text-white",           inactiveClasses: "text-teal-600 hover:bg-teal-50" },
  { key: "Delivering", label: "Delivering", activeClasses: "bg-sky-500 text-white",            inactiveClasses: "text-sky-700 hover:bg-sky-50" },
  { key: "Delivered",  label: "Delivered",  activeClasses: "bg-emerald-700 text-white",        inactiveClasses: "text-emerald-800 hover:bg-emerald-50" },
  { key: "Cancelled",  label: "Cancelled",  activeClasses: "bg-gray-400 text-white",           inactiveClasses: "text-gray-500 hover:bg-gray-100" },
];

const attentionOptions: { key: AttentionFilter; label: string; icon: string; activeClass: string; inactiveClass: string }[] = [
  { key: "all",       label: "All",       icon: "ri-list-check",          activeClass: "bg-gray-800 text-white",   inactiveClass: "text-gray-600 hover:bg-gray-100" },
  { key: "attention", label: "Attention", icon: "ri-alarm-warning-fill",  activeClass: "bg-rose-600 text-white",   inactiveClass: "text-rose-600 hover:bg-rose-50" },
  { key: "urgent",    label: "Urgent",    icon: "ri-error-warning-fill",  activeClass: "bg-red-600 text-white",    inactiveClass: "text-red-600 hover:bg-red-50" },
  { key: "delayed",   label: "Delayed",   icon: "ri-time-line",           activeClass: "bg-amber-500 text-white",  inactiveClass: "text-amber-700 hover:bg-amber-50" },
  { key: "reminder",  label: "Reminder",  icon: "ri-notification-3-line", activeClass: "bg-teal-600 text-white",   inactiveClass: "text-teal-700 hover:bg-teal-50" },
];

export function OrderControlBar({
  search, onSearchChange,
  activeStatus, onStatusChange, statusCounts,
  attentionFilter, onAttentionChange, urgentCount, delayedCount, reminderCount,
  sortBy, onSortChange,
  resultCount, totalCount,
}: OrderControlBarProps) {
  const searchRef = useRef<HTMLInputElement>(null);
  const attentionCount = urgentCount + delayedCount + reminderCount;

  const getBadge = (key: AttentionFilter): number | null => {
    if (key === "urgent")    return urgentCount;
    if (key === "delayed")   return delayedCount;
    if (key === "reminder")  return reminderCount;
    if (key === "attention") return attentionCount;
    return null;
  };

  return (
    <div className="bg-white border-b border-gray-100 sticky top-0 z-20">
      {/* ── Row 1: Search + Attention + Sort + New ─────────── */}
      <div className="px-5 pt-4 pb-3 flex items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center pointer-events-none">
            <i className="ri-search-2-line text-gray-400 text-sm" />
          </div>
          <input
            ref={searchRef}
            type="text"
            value={search}
            onChange={e => onSearchChange(e.target.value)}
            placeholder="Room, guest, or order ID…"
            className="w-full pl-9 pr-8 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg
              placeholder-gray-400 text-gray-800
              focus:outline-none focus:border-gray-400 focus:bg-white transition-colors"
          />
          {search && (
            <button
              onClick={() => { onSearchChange(""); searchRef.current?.focus(); }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              <i className="ri-close-line text-sm" />
            </button>
          )}
        </div>

        {/* Divider */}
        <div className="w-px h-6 bg-gray-200 flex-shrink-0" />

        {/* Attention filter */}
        <div className="flex items-center bg-gray-100 rounded-lg p-0.5 gap-0.5">
          {attentionOptions.map(opt => {
            const badge = getBadge(opt.key);
            const isActive = attentionFilter === opt.key;
            return (
              <button
                key={opt.key}
                onClick={() => onAttentionChange(opt.key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-all cursor-pointer
                  ${isActive ? opt.activeClass : opt.inactiveClass}`}
              >
                <i className={`${opt.icon} text-xs`} />
                {opt.label}
                {badge !== null && badge > 0 && (
                  <span className={`w-4 h-4 flex items-center justify-center rounded-full text-[10px] font-black
                    ${isActive
                      ? "bg-white/30 text-white"
                      : opt.key === "urgent" || opt.key === "attention"
                        ? "bg-red-100 text-red-700"
                        : opt.key === "delayed"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-teal-100 text-teal-700"
                    }`}>
                    {badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Sort */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <i className="ri-sort-desc text-gray-400 text-sm" />
          <select
            value={sortBy}
            onChange={e => {
              const key = e.target.value as SortOption;
              // Natural default direction per column: room = asc (A→Z), others = desc
              const dir = key === "room" ? "asc" : "desc";
              onSortChange(key, dir);
            }}
            className="text-xs border border-gray-200 rounded-lg px-2.5 py-2 text-gray-700 bg-white cursor-pointer focus:outline-none focus:border-gray-400"
          >
            <option value="latest">Newest first</option>
            <option value="room">Room number</option>
            <option value="amount">Highest total</option>
          </select>
        </div>

        <div className="ml-auto flex-shrink-0">
          <Button variant="primary" size="sm" icon="ri-add-line">New Order</Button>
        </div>
      </div>

      {/* ── Row 2: Status chips + result count ────────────── */}
      <div className="px-5 pb-3 flex items-center gap-1.5 flex-wrap">
        {statusChips.map(chip => {
          const count = chip.key === "all" ? totalCount : (statusCounts[chip.key] ?? 0);
          return (
            <button
              key={chip.key}
              onClick={() => onStatusChange(chip.key)}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold
                transition-all cursor-pointer whitespace-nowrap
                ${activeStatus === chip.key ? chip.activeClasses : chip.inactiveClasses}`}
            >
              {chip.label}
              <span className={`text-[10px] font-black min-w-[16px] text-center leading-none
                ${activeStatus === chip.key ? "opacity-75" : "text-gray-400"}`}>
                {count}
              </span>
            </button>
          );
        })}

        {/* Result indicator */}
        <span className="ml-auto text-xs text-gray-400 flex-shrink-0">
          {resultCount === totalCount
            ? <span><span className="font-bold text-gray-700">{totalCount}</span> orders</span>
            : <span><span className="font-bold text-gray-700">{resultCount}</span> of {totalCount}</span>
          }
          {search && (
            <span className="ml-1 text-gray-400">
              for <span className="font-semibold text-gray-700">&quot;{search}&quot;</span>
            </span>
          )}
        </span>
      </div>
    </div>
  );
}
