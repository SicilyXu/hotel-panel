import { OrderStatus, AlertType } from "../../types/order";

// ─── StatusBadge ─────────────────────────────────────────

interface StatusBadgeProps {
  status: OrderStatus;
  size?: "sm" | "md";
}

const statusConfig: Record<OrderStatus, { label: string; classes: string; dot: string }> = {
  Placed: {
    label: "Placed",
    classes: "bg-slate-50 text-slate-700 border border-slate-200",
    dot: "bg-slate-400",
  },
  Accepted: {
    label: "Accepted",
    classes: "bg-teal-50 text-teal-700 border border-teal-200",
    dot: "bg-teal-500",
  },
  Preparing: {
    label: "Preparing",
    classes: "bg-amber-50 text-amber-700 border border-amber-200",
    dot: "bg-amber-500",
  },
  Ready: {
    label: "Ready",
    classes: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    dot: "bg-emerald-500",
  },
  PickedUp: {
    label: "Picked Up",
    classes: "bg-cyan-50 text-cyan-700 border border-cyan-200",
    dot: "bg-cyan-500",
  },
  Delivering: {
    label: "Delivering",
    classes: "bg-blue-50 text-blue-700 border border-blue-200",
    dot: "bg-blue-500",
  },
  Delivered: {
    label: "Delivered",
    classes: "bg-green-50 text-green-700 border border-green-200",
    dot: "bg-green-600",
  },
  Cancelled: {
    label: "Cancelled",
    classes: "bg-gray-50 text-gray-400 border border-gray-200 opacity-60",
    dot: "bg-gray-300",
  },
};

const sizeClassesMap = {
  sm: "h-6 px-3 text-xs",
  md: "h-7 px-3.5 text-sm",
};

export function StatusBadge({ status, size = "sm" }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={`
        inline-flex items-center justify-center
        min-w-[100px]   /* ⭐ 关键：统一宽度 */
        ${sizeClassesMap[size]}
        rounded-full
        font-semibold
        whitespace-nowrap
        ${config.classes}
      `}
    >
      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${config.dot}`} />
      {config.label}
    </span>
  );
}

// ─── PriorityDot ─────────────────────────────────────────

interface FlagDotProps {
  isUrgent: boolean;
  isDelayed: boolean;
}

export function FlagDot({ isUrgent, isDelayed }: FlagDotProps) {
  const color = isUrgent ? "bg-red-500" : isDelayed ? "bg-amber-400" : "bg-gray-300";
  return <span className={`inline-block w-2.5 h-2.5 rounded-full ${color}`} />;
}

// ─── CategoryBadge ───────────────────────────────────────

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

// ─── AlertTypeBadge ──────────────────────────────────────

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

// ─── FlagChips ───────────────────────────────────────────

interface FlagChipsProps {
  isUrgent: boolean;
  isDelayed: boolean;
  hasReminder: boolean;
  size?: "sm" | "md";
}

export function FlagChips({ isUrgent, isDelayed, hasReminder, size = "sm" }: FlagChipsProps) {
  const base = size === "sm" ? "h-5 text-[10px] px-2" : "h-6 text-xs px-2.5";

  return (
    <div className="flex items-center gap-1 flex-wrap">
      {isUrgent && (
        <span className={`inline-flex items-center gap-1 rounded-full font-semibold ${base} bg-red-50 text-red-700 border border-red-200`}>
          <i className="ri-alarm-warning-fill text-[10px]" /> Urgent
        </span>
      )}
      {isDelayed && (
        <span className={`inline-flex items-center gap-1 rounded-full font-semibold ${base} bg-amber-50 text-amber-700 border border-amber-200`}>
          <i className="ri-time-line text-[10px]" /> Delayed
        </span>
      )}
      {hasReminder && (
        <span className={`inline-flex items-center gap-1 rounded-full font-semibold ${base} bg-teal-50 text-teal-700 border border-teal-200`}>
          <i className="ri-notification-3-line text-[10px]" /> Reminder
        </span>
      )}
    </div>
  );
}