import { useOrders } from "../../../context/OrdersContext";
import { useNavigate } from "react-router-dom";
import { Order, OrderStatus } from "../../../types/order";

function getElapsed(iso: string): string {
  const m = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (m < 1) return "—";
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  const rem = m % 60;
  return rem > 0 ? `${h}h ${rem}m` : `${h}h`;
}

const NEXT_STATUS: Partial<Record<OrderStatus, OrderStatus>> = {
  Placed: "Accepted", Accepted: "Preparing", Preparing: "Ready",
  Ready: "PickedUp", PickedUp: "Delivering", Delivering: "Delivered",
};
const NEXT_LABEL: Partial<Record<OrderStatus, string>> = {
  Placed: "Accept", Accepted: "Preparing", Preparing: "Mark Ready",
  Ready: "Picked Up", PickedUp: "Delivering", Delivering: "Delivered",
};

// Local status config for fixed-width pill rendering
const STATUS_PILL: Record<OrderStatus, { label: string; bg: string; text: string; dot: string }> = {
  Placed:     { label: "Placed",     bg: "bg-slate-100",   text: "text-slate-700",   dot: "bg-slate-400"   },
  Accepted:   { label: "Accepted",   bg: "bg-teal-100",    text: "text-teal-800",    dot: "bg-teal-500"    },
  Preparing:  { label: "Preparing",  bg: "bg-amber-100",   text: "text-amber-800",   dot: "bg-amber-500"   },
  Ready:      { label: "Ready",      bg: "bg-emerald-100", text: "text-emerald-800", dot: "bg-emerald-500" },
  PickedUp:   { label: "Picked Up",  bg: "bg-teal-100",    text: "text-teal-700",    dot: "bg-teal-400"    },
  Delivering: { label: "Delivering", bg: "bg-sky-100",     text: "text-sky-800",     dot: "bg-sky-500"     },
  Delivered:  { label: "Delivered",  bg: "bg-emerald-100", text: "text-emerald-900", dot: "bg-emerald-600" },
  Cancelled:  { label: "Cancelled",  bg: "bg-gray-100",    text: "text-gray-400",    dot: "bg-gray-300"    },
};

type AttentionTag = "urgent" | "delayed" | "reminder";

interface AttentionRowProps {
  order: Order;
  tag: AttentionTag;
  onOpen: () => void;
  onAdvance: (orderId: string, next: OrderStatus) => void;
}

function AttentionRow({ order, tag, onOpen, onAdvance }: AttentionRowProps) {
  const elapsed   = getElapsed(order.updatedAt);
  const nextSt    = NEXT_STATUS[order.status];
  const nextLabel = NEXT_LABEL[order.status];
  const pill      = STATUS_PILL[order.status];

  const borderCls: Record<AttentionTag, string> = {
    urgent:   "border-l-red-500",
    delayed:  "border-l-amber-400",
    reminder: "border-l-teal-400",
  };
  const flagIcon: Record<AttentionTag, string> = {
    urgent:   "ri-alarm-warning-fill",
    delayed:  "ri-time-line",
    reminder: "ri-notification-3-line",
  };
  const flagColor: Record<AttentionTag, string> = {
    urgent:   "text-red-500",
    delayed:  "text-amber-500",
    reminder: "text-teal-500",
  };
  const elapsedColor: Record<AttentionTag, string> = {
    urgent:   "text-red-600 font-black",
    delayed:  "text-amber-600 font-bold",
    reminder: "text-teal-600 font-medium",
  };

  return (
    <div
      className={`grid items-center gap-2 px-3 py-2.5 border-l-[3px] ${borderCls[tag]} hover:bg-gray-50/80 transition-colors cursor-pointer`}
      style={{ gridTemplateColumns: "16px 44px 1fr 110px 52px 84px" }}
      onClick={onOpen}
    >
      {/* Col 1 — Flag icon */}
      <div className="w-4 h-4 flex items-center justify-center">
        <i className={`${flagIcon[tag]} ${flagColor[tag]} text-xs`} />
      </div>

      {/* Col 2 — Room */}
      <span className="text-base font-black font-mono text-gray-900 leading-none truncate">
        {order.roomNumber}
      </span>

      {/* Col 3 — Guest + ID */}
      <div className="min-w-0">
        <p className="text-xs font-semibold text-gray-800 truncate leading-tight">{order.guestName}</p>
        <p className="text-[9px] font-mono text-gray-400 truncate">{order.id}</p>
      </div>

      {/* Col 4 — Status pill (fixed width, always fills column) */}
      <div className={`flex items-center justify-center gap-1.5 rounded-full text-xs font-semibold py-0.5 px-2 border ${pill.bg} ${pill.text} border-transparent`}>
        <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${pill.dot}`} />
        <span className="leading-none">{pill.label}</span>
      </div>

      {/* Col 5 — Elapsed (right-aligned, tabular) */}
      <span className={`text-xs text-right tabular-nums leading-none ${elapsedColor[tag]}`}>
        {elapsed}
      </span>

      {/* Col 6 — Action button (fixed width, fills column) */}
      <div onClick={e => e.stopPropagation()}>
        {nextSt && nextLabel ? (
          <button
            onClick={e => { e.stopPropagation(); onAdvance(order.id, nextSt); }}
            className="w-full text-[10px] font-bold py-1.5 rounded-lg bg-gray-900 text-white hover:bg-gray-700 whitespace-nowrap transition-colors cursor-pointer text-center"
          >
            {nextLabel} →
          </button>
        ) : (
          <span className="w-full block" />
        )}
      </div>
    </div>
  );
}

export function AttentionSection() {
  const { orders, selectOrder, updateOrderStatus } = useOrders();
  const navigate = useNavigate();

  const seen = new Set<string>();
  const rows: { order: Order; tag: AttentionTag }[] = [];

  orders
    .filter(o => o.isUrgent && !["Delivered", "Cancelled"].includes(o.status))
    .forEach(o => { if (!seen.has(o.id)) { seen.add(o.id); rows.push({ order: o, tag: "urgent" }); } });

  orders
    .filter(o => o.isDelayed && !o.isUrgent && !["Delivered", "Cancelled"].includes(o.status))
    .forEach(o => { if (!seen.has(o.id)) { seen.add(o.id); rows.push({ order: o, tag: "delayed" }); } });

  orders
    .filter(o => o.hasReminder && !o.isUrgent && !o.isDelayed && !["Delivered", "Cancelled"].includes(o.status))
    .forEach(o => { if (!seen.has(o.id)) { seen.add(o.id); rows.push({ order: o, tag: "reminder" }); } });

  const urgentCnt  = rows.filter(r => r.tag === "urgent").length;
  const delayedCnt = rows.filter(r => r.tag === "delayed").length;
  const reminderCnt = rows.filter(r => r.tag === "reminder").length;

  const handleOpen = (order: Order) => { navigate("/orders"); selectOrder(order); };
  const handleAdvance = (id: string, next: OrderStatus) => updateOrderStatus(id, next);

  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden h-full flex flex-col">
      {/* Header */}
      <div className={`px-4 py-3 flex items-center justify-between flex-shrink-0 border-b ${rows.length > 0 ? "border-red-100 bg-red-50/50" : "border-gray-100"}`}>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 flex items-center justify-center">
            <i className={`ri-alarm-warning-fill text-sm ${rows.length > 0 ? "text-red-500" : "text-gray-300"}`} />
          </div>
          <h3 className="text-sm font-bold text-gray-900">Attention Needed</h3>
          {rows.length > 0 && (
            <span className="w-5 h-5 flex items-center justify-center rounded-full bg-red-500 text-white text-[10px] font-bold">
              {rows.length}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5 text-[10px] font-semibold">
          {urgentCnt > 0 && (
            <span className="relative group flex items-center gap-1 px-2 py-1 rounded-full bg-red-100 text-red-700 cursor-default">
              <i className="ri-alarm-warning-fill" />{urgentCnt}
              <span className="pointer-events-none absolute top-full left-1/2 -translate-x-1/2 mt-1.5 whitespace-nowrap rounded-md bg-gray-900 px-2 py-1 text-[10px] font-semibold text-white opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-50">
                Urgent
              </span>
            </span>
          )}
          {delayedCnt > 0 && (
            <span className="relative group flex items-center gap-1 px-2 py-1 rounded-full bg-amber-100 text-amber-700 cursor-default">
              <i className="ri-time-line" />{delayedCnt}
              <span className="pointer-events-none absolute top-full left-1/2 -translate-x-1/2 mt-1.5 whitespace-nowrap rounded-md bg-gray-900 px-2 py-1 text-[10px] font-semibold text-white opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-50">
                Delayed
              </span>
            </span>
          )}
          {reminderCnt > 0 && (
            <span className="relative group flex items-center gap-1 px-2 py-1 rounded-full bg-teal-100 text-teal-700 cursor-default">
              <i className="ri-notification-3-line" />{reminderCnt}
              <span className="pointer-events-none absolute top-full left-1/2 -translate-x-1/2 mt-1.5 whitespace-nowrap rounded-md bg-gray-900 px-2 py-1 text-[10px] font-semibold text-white opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-50">
                Reminder
              </span>
            </span>
          )}
        </div>
      </div>

      {/* Rows */}
      <div className="flex-1 overflow-y-auto">
        {rows.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-36 text-center">
            <div className="w-9 h-9 flex items-center justify-center rounded-full bg-emerald-100 mb-2">
              <i className="ri-check-double-line text-emerald-600 text-base" />
            </div>
            <p className="text-sm font-bold text-gray-600">All clear</p>
            <p className="text-xs text-gray-400 mt-0.5">No orders need attention</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {rows.map(({ order, tag }) => (
              <AttentionRow
                key={order.id}
                order={order}
                tag={tag}
                onOpen={() => handleOpen(order)}
                onAdvance={handleAdvance}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
