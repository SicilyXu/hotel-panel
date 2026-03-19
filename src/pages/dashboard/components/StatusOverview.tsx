import { useOrders } from "../../../context/OrdersContext";
import { OrderStatus } from "../../../types/order";

interface StatusTile {
  status: OrderStatus;
  label: string;
  dotColor: string;
  tileBg: string;
  textColor: string;
  countColor: string;
  barColor: string;
}

const TILES: StatusTile[] = [
  { status: "Placed",     label: "Placed",      dotColor: "bg-slate-400",    tileBg: "bg-slate-50",    textColor: "text-slate-600",  countColor: "text-slate-800",   barColor: "bg-slate-400" },
  { status: "Accepted",   label: "Accepted",    dotColor: "bg-teal-500",     tileBg: "bg-teal-50",     textColor: "text-teal-600",   countColor: "text-teal-800",    barColor: "bg-teal-400" },
  { status: "Preparing",  label: "Preparing",   dotColor: "bg-amber-400",    tileBg: "bg-amber-50",    textColor: "text-amber-700",  countColor: "text-amber-900",   barColor: "bg-amber-400" },
  { status: "Ready",      label: "Ready",       dotColor: "bg-emerald-400",  tileBg: "bg-emerald-50",  textColor: "text-emerald-700",countColor: "text-emerald-900", barColor: "bg-emerald-400" },
  { status: "PickedUp",   label: "Picked Up",   dotColor: "bg-teal-400",     tileBg: "bg-teal-50",     textColor: "text-teal-600",   countColor: "text-teal-800",    barColor: "bg-teal-400" },
  { status: "Delivering", label: "Delivering",  dotColor: "bg-cyan-500",     tileBg: "bg-cyan-50",     textColor: "text-cyan-700",   countColor: "text-cyan-900",    barColor: "bg-cyan-400" },
  { status: "Delivered",  label: "Delivered",   dotColor: "bg-emerald-600",  tileBg: "bg-emerald-50",  textColor: "text-emerald-700",countColor: "text-emerald-900", barColor: "bg-emerald-600" },
  { status: "Cancelled",  label: "Cancelled",   dotColor: "bg-gray-300",     tileBg: "bg-gray-50",     textColor: "text-gray-500",   countColor: "text-gray-700",    barColor: "bg-gray-300" },
];

export function StatusOverview() {
  const { counts } = useOrders();
  const total = counts["all"] ?? 0;
  const maxCount = Math.max(...TILES.map(t => counts[t.status] ?? 0), 1);

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <h3 className="text-sm font-bold text-gray-900">Status Overview</h3>
        <span className="text-xs font-semibold text-gray-400">{total} orders</span>
      </div>

      {/* Stacked proportion bar */}
      <div className="flex h-2 rounded-full overflow-hidden gap-px mb-5 flex-shrink-0">
        {TILES.map(t => {
          const c = counts[t.status] ?? 0;
          if (!c || !total) return null;
          return (
            <div
              key={t.status}
              className={`${t.barColor} transition-all`}
              style={{ width: `${(c / total) * 100}%` }}
              title={`${t.label}: ${c}`}
            />
          );
        })}
      </div>

      {/* Status tiles — scannable rows */}
      <div className="flex-1 space-y-1.5">
        {TILES.map(tile => {
          const count = counts[tile.status] ?? 0;
          const width = maxCount > 0 ? Math.max((count / maxCount) * 100, count > 0 ? 6 : 0) : 0;

          return (
            <div key={tile.status} className="flex items-center gap-2.5">
              {/* Status label */}
              <div className="flex items-center gap-1.5 w-20 flex-shrink-0">
                <span className={`w-2 h-2 rounded-full flex-shrink-0 ${tile.dotColor} ${count === 0 ? "opacity-30" : ""}`} />
                <span className={`text-xs font-medium truncate ${count === 0 ? "text-gray-300" : "text-gray-600"}`}>{tile.label}</span>
              </div>

              {/* Progress bar track */}
              <div className="flex-1 bg-gray-100 rounded-full h-6 overflow-hidden">
                {count > 0 && (
                  <div
                    className={`${tile.barColor} h-full rounded-full flex items-center justify-end pr-2 transition-all duration-500`}
                    style={{ width: `${width}%`, minWidth: "2rem" }}
                  >
                    <span className="text-[10px] font-black text-white leading-none">{count}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick legend at bottom */}
      <div className="mt-4 pt-3 border-t border-gray-100 flex-shrink-0 flex items-center justify-between text-[10px] text-gray-400">
        <div className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block" />
          <span>Active</span>
          <span className="font-bold text-gray-600 ml-1">{
            ["Placed","Accepted","Preparing","Ready","PickedUp","Delivering"]
              .reduce((s, st) => s + (counts[st] ?? 0), 0)
          }</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 inline-block" />
          <span>Delivered</span>
          <span className="font-bold text-gray-600 ml-1">{counts["Delivered"] ?? 0}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-gray-300 inline-block" />
          <span>Cancelled</span>
          <span className="font-bold text-gray-600 ml-1">{counts["Cancelled"] ?? 0}</span>
        </div>
      </div>
    </div>
  );
}
