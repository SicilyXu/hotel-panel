import { useOrders } from "../../../context/OrdersContext";
import { OrderStatus } from "../../../types/order";

interface BarConfig {
  key: OrderStatus;
  label: string;
  color: string;
  textColor: string;
}

const bars: BarConfig[] = [
  { key: "Placed",     label: "Placed",     color: "bg-slate-400",   textColor: "text-slate-700" },
  { key: "Accepted",   label: "Accepted",   color: "bg-teal-500",    textColor: "text-teal-700" },
  { key: "Preparing",  label: "Preparing",  color: "bg-amber-400",   textColor: "text-amber-700" },
  { key: "Ready",      label: "Ready",      color: "bg-emerald-400", textColor: "text-emerald-700" },
  { key: "PickedUp",   label: "Picked Up",  color: "bg-teal-400",    textColor: "text-teal-600" },
  { key: "Delivering", label: "Delivering", color: "bg-sky-400",     textColor: "text-sky-700" },
  { key: "Delivered",  label: "Delivered",  color: "bg-emerald-600", textColor: "text-emerald-800" },
  { key: "Cancelled",  label: "Cancelled",  color: "bg-gray-300",    textColor: "text-gray-500" },
];

export function StatusChart() {
  const { counts, orders } = useOrders();
  const total     = counts["all"] ?? 0;
  const maxCount  = Math.max(...bars.map(b => counts[b.key] ?? 0), 1);
  const urgentCnt  = orders.filter(o => o.isUrgent).length;
  const delayedCnt = orders.filter(o => o.isDelayed).length;
  const reminderCnt= orders.filter(o => o.hasReminder).length;

  const flagSummary = [
    { label: "Urgent",    icon: "ri-alarm-warning-fill",  color: "text-red-600 bg-red-50",    value: urgentCnt },
    { label: "Delayed",   icon: "ri-time-line",            color: "text-amber-700 bg-amber-50", value: delayedCnt },
    { label: "Reminders", icon: "ri-notification-3-line",  color: "text-teal-700 bg-teal-50",   value: reminderCnt },
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5 h-full">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-sm font-bold text-gray-900">Order Status Breakdown</h3>
          <p className="text-xs text-gray-400 mt-0.5">{total} total orders today</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-black text-gray-900">{total}</p>
          <p className="text-xs text-gray-400">orders</p>
        </div>
      </div>

      {/* Stacked summary bar */}
      <div className="flex h-2 rounded-full overflow-hidden gap-0.5 mb-5">
        {bars.map(b => {
          const c = counts[b.key] ?? 0;
          return c > 0 ? (
            <div key={b.key} className={b.color} style={{ width: `${(c / total) * 100}%` }} />
          ) : null;
        })}
      </div>

      {/* Horizontal bars */}
      <div className="space-y-2.5">
        {bars.map(bar => {
          const count = counts[bar.key] ?? 0;
          return (
            <div key={bar.key} className="flex items-center gap-3">
              <span className="text-xs text-gray-600 font-medium w-20 flex-shrink-0">{bar.label}</span>
              <div className="flex-1 bg-gray-100 rounded-full h-7 overflow-hidden">
                <div
                  className={`${bar.color} h-full rounded-full transition-all duration-500`}
                  style={{ width: count > 0 ? `${(count / maxCount) * 100}%` : "0%" }}
                />
              </div>
              <span className={`text-xs font-bold w-5 text-right ${bar.textColor}`}>{count}</span>
            </div>
          );
        })}
      </div>

      {/* Flag summary */}
      <div className="mt-5 pt-4 border-t border-gray-100 grid grid-cols-3 gap-3">
        {flagSummary.map(f => (
          <div key={f.label} className="text-center">
            <div className={`w-8 h-8 flex items-center justify-center mx-auto rounded-lg ${f.color}`}>
              <i className={`${f.icon} text-base`} />
            </div>
            <p className="text-lg font-black text-gray-900 mt-1">{f.value}</p>
            <p className="text-[10px] text-gray-400">{f.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
