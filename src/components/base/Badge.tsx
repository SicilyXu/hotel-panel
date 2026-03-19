import { OrderStatus } from "../../types/order";

// ─── StatusBadge ───────────────────────────────────────────────────────────

interface StatusBadgeProps {
  status: OrderStatus;
  size?: "sm" | "md";
}

const statusConfig: Record<OrderStatus, { label: string; classes: string; dot: string }> = {
  Placed:     { label: "Placed",     classes: "bg-slate-100 text-slate-700 border border-slate-200",      dot: "bg-slate-400" },
  Accepted:   { label: "Accepted",   classes: "bg-teal-100 text-teal-800 border border-teal-200",         dot: "bg-teal-500" },
  Preparing:  { label: "Preparing",  classes: "bg-amber-100 text-amber-800 border border-amber-200",      dot: "bg-amber-500" },
  Ready:      { label: "Ready",      classes: "bg-emerald-100 text-emerald-800 border border-emerald-200",dot: "bg-emerald-500" },
  PickedUp:   { label: "Picked Up",  classes: "bg-teal-100 text-teal-700 border border-teal-200",         dot: "bg-teal-400" },
  Delivering: { label: "Delivering", classes: "bg-sky-100 text-sky-800 border border-sky-200",            dot: "bg-sky-500" },
  Delivered:  { label: "Delivered",  classes: "bg-emerald-100 text-emerald-900 border border-emerald-300",dot: "bg-emerald-600" },
  Cancelled:  { label: "Cancelled",  classes: "bg-gray-100 text-gray-400 border border-gray-200",         dot: "bg-gray-300" },
};

export function StatusBadge({ status, size = "md" }: StatusBadgeProps) {
  const config = statusConfig[status];
  const sizeClasses = size === "sm" ? "text-xs px-2 py-0.5" : "text-xs px-2.5 py-1";
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-semibold whitespace-nowrap ${sizeClasses} ${config.classes}`}>
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${config.dot} ${status === "Cancelled" ? "opacity-50" : ""}`} />
      {config.label}
    </span>
  );
}

// ─── PriorityDot ───────────────────────────────────────────────────────────
// Now driven by isUrgent / isDelayed flags

interface FlagDotProps {
  isUrgent: boolean;
  isDelayed: boolean;
}

export function FlagDot({ isUrgent, isDelayed }: FlagDotProps) {
  const color = isUrgent ? "bg-red-500" : isDelayed ? "bg-amber-400" : "bg-gray-300";
  return <span className={`inline-block w-2.5 h-2.5 rounded-full flex-shrink-0 ${color}`} />;
}

// ─── CategoryBadge (kept for legacy dashboard use) ─────────────────────────

type OrderCategory = "room_service" | "housekeeping" | "concierge" | "maintenance";

const categoryConfig: Record<OrderCategory, { label: string; icon: string }> = {
  room_service:  { label: "Room Service",  icon: "ri-restaurant-line" },
  housekeeping:  { label: "Housekeeping",  icon: "ri-home-3-line" },
  concierge:     { label: "Concierge",     icon: "ri-customer-service-2-line" },
  maintenance:   { label: "Maintenance",   icon: "ri-tools-line" },
};

export function CategoryBadge({ category }: { category: OrderCategory }) {
  const config = categoryConfig[category];
  return (
    <span className="inline-flex items-center gap-1 text-xs text-slate-500 font-medium">
      <i className={config.icon} />
      {config.label}
    </span>
  );
}

// ─── AlertTypeBadge ────────────────────────────────────────────────────────

import { AlertType } from "../../types/order";

const alertTypeConfig: Record<AlertType, { label: string; icon: string }> = {
  overdue:   { label: "Overdue",   icon: "ri-time-line" },
  vip:       { label: "VIP",       icon: "ri-vip-crown-line" },
  complaint: { label: "Complaint", icon: "ri-emotion-sad-line" },
  allergy:   { label: "Allergy",   icon: "ri-alert-line" },
  quality:   { label: "Quality",   icon: "ri-star-line" },
  delay:     { label: "Delay",     icon: "ri-timer-line" },
};

export function AlertTypeBadge({ type }: { type: AlertType }) {
  const config = alertTypeConfig[type];
  return (
    <span className="inline-flex items-center gap-1 text-xs bg-red-50 text-red-700 border border-red-200 px-2 py-0.5 rounded-full font-medium">
      <i className={`${config.icon} text-xs`} />
      {config.label}
    </span>
  );
}

// ─── Flag chips row ────────────────────────────────────────────────────────

interface FlagChipsProps {
  isUrgent: boolean;
  isDelayed: boolean;
  hasReminder: boolean;
  size?: "sm" | "md";
}

export function FlagChips({ isUrgent, isDelayed, hasReminder, size = "sm" }: FlagChipsProps) {
  const base = size === "sm" ? "text-[10px] px-1.5 py-0.5" : "text-xs px-2 py-0.5";
  return (
    <div className="flex items-center gap-1 flex-wrap">
      {isUrgent && (
        <span className={`inline-flex items-center gap-1 rounded-full font-semibold bg-red-100 text-red-700 border border-red-200 ${base}`}>
          <i className="ri-alarm-warning-fill" /> Urgent
        </span>
      )}
      {isDelayed && (
        <span className={`inline-flex items-center gap-1 rounded-full font-semibold bg-amber-100 text-amber-700 border border-amber-200 ${base}`}>
          <i className="ri-time-line" /> Delayed
        </span>
      )}
      {hasReminder && (
        <span className={`inline-flex items-center gap-1 rounded-full font-semibold bg-teal-100 text-teal-700 border border-teal-200 ${base}`}>
          <i className="ri-notification-3-line" /> Reminder
        </span>
      )}
    </div>
  );
}
