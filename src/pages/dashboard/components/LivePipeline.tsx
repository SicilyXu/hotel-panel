import { useOrders } from "../../../context/OrdersContext";
import { useNavigate } from "react-router-dom";
import { Order, OrderStatus } from "../../../types/order";

// ── Time helper ───────────────────────────────────────────────────────────────
function sinceUpdated(iso: string): string {
  const m = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (m < 1) return "—";
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  const rem = m % 60;
  return rem > 0 ? `${h}h ${rem}m` : `${h}h`;
}

// ── Next action mapping ───────────────────────────────────────────────────────
const NEXT_ACTION: Partial<Record<OrderStatus, { label: string; next: OrderStatus }>> = {
  Placed:     { label: "Accept",     next: "Accepted"   },
  Accepted:   { label: "Preparing",  next: "Preparing"  },
  Preparing:  { label: "Mark Ready", next: "Ready"      },
  Ready:      { label: "Picked Up",  next: "PickedUp"   },
  PickedUp:   { label: "Delivering", next: "Delivering" },
  Delivering: { label: "Delivered",  next: "Delivered"  },
};

// ── Local status pill config (same as AttentionSection) ──────────────────────
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

type AttentionKind = "urgent" | "delayed" | "reminder";

function getKind(o: Order): AttentionKind {
  if (o.isUrgent)  return "urgent";
  if (o.isDelayed) return "delayed";
  return "reminder";
}

// ── Pipeline row ──────────────────────────────────────────────────────────────
interface PipelineRowProps {
  order: Order;
  kind?: AttentionKind;
  onOpen: () => void;
  onAdvance: (id: string, next: OrderStatus) => void;
}

// Grid: [flag 68px] [room 44px] [guest 1fr] [status 110px] [time 52px] [action 84px]
const GRID = "68px 44px 1fr 110px 52px 84px";

function PipelineRow({ order, kind, onOpen, onAdvance }: PipelineRowProps) {
  const action = NEXT_ACTION[order.status];
  const since  = sinceUpdated(order.updatedAt);
  const pill   = STATUS_PILL[order.status];

  const leftBorder =
    kind === "urgent"  ? "border-l-red-500"   :
    kind === "delayed" ? "border-l-amber-400"  :
    kind === "reminder"? "border-l-teal-400"   :
                         "border-l-transparent";

  const sinceColor =
    kind === "urgent"  ? "text-red-600 font-black"   :
    kind === "delayed" ? "text-amber-600 font-bold"   :
    kind === "reminder"? "text-teal-600 font-medium"  :
                         "text-gray-400";

  return (
    <div
      className={`grid items-center gap-2 px-3 py-2.5 border-l-[3px] ${leftBorder} hover:bg-gray-50 transition-colors cursor-pointer`}
      style={{ gridTemplateColumns: GRID }}
      onClick={onOpen}
    >
      {/* Col 1 — Flag chip (fixed 68px) */}
      <div className="flex items-center">
        {kind === "urgent" && (
          <span className="w-full text-center text-[9px] font-black py-0.5 rounded bg-red-100 text-red-700 uppercase tracking-widest">
            URGENT
          </span>
        )}
        {kind === "delayed" && (
          <span className="w-full text-center text-[9px] font-black py-0.5 rounded bg-amber-100 text-amber-700 uppercase tracking-widest">
            DELAYED
          </span>
        )}
        {kind === "reminder" && (
          <span className="w-full text-center text-[9px] font-black py-0.5 rounded bg-teal-100 text-teal-700 uppercase tracking-widest">
            REMIND
          </span>
        )}
      </div>

      {/* Col 2 — Room */}
      <span className="text-base font-black font-mono text-gray-900 leading-none truncate">
        {order.roomNumber}
      </span>

      {/* Col 3 — Guest + order ID */}
      <div className="min-w-0">
        <p className="text-xs font-semibold text-gray-800 truncate leading-tight">{order.guestName}</p>
        <p className="text-[9px] font-mono text-gray-400 truncate">{order.id}</p>
      </div>

      {/* Col 4 — Status pill (fixed width, fills column) */}
      <div className={`flex items-center justify-center gap-1.5 rounded-full text-xs font-semibold py-0.5 px-2 ${pill.bg} ${pill.text}`}>
        <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${pill.dot}`} />
        <span className="leading-none">{pill.label}</span>
      </div>

      {/* Col 5 — Time in status (right-aligned, tabular) */}
      <span className={`text-xs text-right tabular-nums leading-none ${sinceColor}`}>
        {since}
      </span>

      {/* Col 6 — Action button (fixed width, fills column) */}
      <div onClick={e => e.stopPropagation()}>
        {action ? (
          <button
            onClick={e => { e.stopPropagation(); onAdvance(order.id, action.next); }}
            className="w-full text-[10px] font-bold py-1.5 rounded-lg bg-gray-900 text-white hover:bg-gray-700 whitespace-nowrap transition-colors cursor-pointer text-center"
          >
            {action.label} →
          </button>
        ) : (
          <span className="w-full block" />
        )}
      </div>
    </div>
  );
}

// ── Column header row ─────────────────────────────────────────────────────────
function PipelineHeader() {
  return (
    <div
      className="grid items-center gap-2 px-3 py-1.5 bg-gray-50/80 border-b border-gray-100"
      style={{ gridTemplateColumns: GRID }}
    >
      <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Flag</span>
      <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Room</span>
      <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Guest</span>
      <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest text-center">Status</span>
      <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest text-right">Time</span>
      <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest text-center">Action</span>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export function LivePipeline() {
  const { orders, selectOrder, updateOrderStatus } = useOrders();
  const navigate = useNavigate();

  const active = orders.filter(o => !["Delivered", "Cancelled"].includes(o.status));

  const sortPriority = (o: Order): number => {
    if (o.isUrgent)    return 0;
    if (o.isDelayed)   return 1;
    if (o.hasReminder) return 2;
    return 3;
  };

  const sorted = [...active].sort((a, b) => {
    const pd = sortPriority(a) - sortPriority(b);
    if (pd !== 0) return pd;
    return new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
  });

  const handleOpen    = (o: Order) => { navigate("/orders"); selectOrder(o); };
  const handleAdvance = (id: string, next: OrderStatus) => updateOrderStatus(id, next);

  const attentionRows = sorted.filter(o => o.isUrgent || o.isDelayed || o.hasReminder);
  const normalRows    = sorted.filter(o => !o.isUrgent && !o.isDelayed && !o.hasReminder);

  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-3">
        <div className="w-5 h-5 flex items-center justify-center">
          <i className="ri-list-check-2 text-gray-600 text-sm" />
        </div>
        <h3 className="text-sm font-bold text-gray-900">Active Pipeline</h3>
        <span className="text-xs font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
          {active.length}
        </span>
      </div>

      {/* Rows */}
      {active.length === 0 ? (
        <div className="flex items-center justify-center py-10 text-center">
          <div>
            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-emerald-100 mx-auto mb-2">
              <i className="ri-check-double-line text-emerald-600 text-base" />
            </div>
            <p className="text-sm font-bold text-gray-600">Pipeline clear</p>
            <p className="text-xs text-gray-400 mt-0.5">No active orders right now</p>
          </div>
        </div>
      ) : (
        <div>
          <PipelineHeader />
          <div className="divide-y divide-gray-50">
            {attentionRows.map(o => (
              <PipelineRow key={o.id} order={o} kind={getKind(o)} onOpen={() => handleOpen(o)} onAdvance={handleAdvance} />
            ))}

            {attentionRows.length > 0 && normalRows.length > 0 && (
              <div className="px-3 py-1 bg-gray-50/60 flex items-center gap-2">
                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Normal</span>
                <span className="flex-1 h-px bg-gray-100" />
              </div>
            )}

            {normalRows.map(o => (
              <PipelineRow key={o.id} order={o} kind={undefined} onOpen={() => handleOpen(o)} onAdvance={handleAdvance} />
            ))}
          </div>
        </div>
      )}

      {active.length > 0 && (
        <div className="border-t border-gray-100 px-4 py-2.5 flex items-center justify-between">
          <span className="text-[10px] text-gray-400">
            Showing all {active.length} active orders
          </span>
          <button
            onClick={() => navigate("/orders")}
            className="text-[10px] font-bold text-gray-500 hover:text-gray-800 flex items-center gap-1 cursor-pointer transition-colors"
          >
            Open full order list <i className="ri-arrow-right-line" />
          </button>
        </div>
      )}
    </div>
  );
}
