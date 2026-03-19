import { Order } from "../../../../types/order";

interface QuickActionsProps {
  order: Order;
  onToggleUrgent: () => void;
  onToggleReminder: () => void;
  onMarkResolved: () => void;
  onCancel: () => void;
}

interface ActionButtonProps {
  icon: string;
  label: string;
  active?: boolean;
  activeClass?: string;
  inactiveClass?: string;
  destructive?: boolean;
  disabled?: boolean;
  onClick: () => void;
  pulse?: boolean;
}

function ActionButton({ icon, label, active, activeClass, inactiveClass, destructive, disabled, onClick, pulse }: ActionButtonProps) {
  const base = "flex flex-col items-center gap-1 px-3 py-2.5 rounded-xl border-2 cursor-pointer transition-all select-none";

  const cls = active
    ? `${activeClass} border-current`
    : destructive
      ? "text-red-500 bg-white border-red-200 hover:bg-red-50"
      : `${inactiveClass ?? "text-gray-500 bg-white border-gray-200 hover:border-gray-300 hover:text-gray-700"}`;

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${cls} ${disabled ? "opacity-40 pointer-events-none" : ""} flex-1`}
    >
      <div className="relative w-5 h-5 flex items-center justify-center">
        <i className={`${icon} text-lg leading-none`} />
        {pulse && active && (
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-red-500 border border-white" />
        )}
      </div>
      <span className="text-[10px] font-semibold leading-tight text-center whitespace-nowrap">{label}</span>
    </button>
  );
}

export function QuickActions({ order, onToggleUrgent, onToggleReminder, onMarkResolved, onCancel }: QuickActionsProps) {
  const hasIssue = order.isUrgent || order.isDelayed;
  const isTerminal = order.status === "Delivered" || order.status === "Cancelled";

  return (
    <div className="flex gap-2">
      {/* Urgent toggle */}
      <ActionButton
        icon="ri-alarm-warning-fill"
        label={order.isUrgent ? "Urgent ON" : "Urgent"}
        active={order.isUrgent}
        activeClass="text-red-600 bg-red-50"
        inactiveClass="text-gray-500 bg-white border-gray-200 hover:border-red-300 hover:text-red-500"
        pulse
        disabled={isTerminal}
        onClick={onToggleUrgent}
      />

      {/* Reminder toggle */}
      <ActionButton
        icon="ri-notification-3-fill"
        label={order.hasReminder ? "Reminder" : "Remind"}
        active={order.hasReminder}
        activeClass="text-teal-600 bg-teal-50"
        inactiveClass="text-gray-500 bg-white border-gray-200 hover:border-teal-300 hover:text-teal-500"
        disabled={isTerminal}
        onClick={onToggleReminder}
      />

      {/* Mark resolved */}
      <ActionButton
        icon="ri-shield-check-line"
        label="Resolved"
        active={false}
        inactiveClass={
          hasIssue
            ? "text-emerald-600 bg-emerald-50 border-emerald-300 hover:bg-emerald-100"
            : "text-gray-300 bg-gray-50 border-gray-100"
        }
        disabled={!hasIssue || isTerminal}
        onClick={onMarkResolved}
      />

      {/* Cancel order */}
      <ActionButton
        icon="ri-close-circle-line"
        label="Cancel"
        destructive
        disabled={isTerminal}
        onClick={onCancel}
      />
    </div>
  );
}
