import { useState, useEffect } from "react";
import { Order, OrderStatus } from "../../../types/order";
import { useOrders } from "../../../context/OrdersContext";
import { StatusBadge } from "../../../components/base/Badge";
import { RatingStars } from "../../../components/base/RatingStars";
import { Button } from "../../../components/base/Button";
import { StatusStepper } from "./detail/StatusStepper";
import { QuickActions } from "./detail/QuickActions";

// ─── Next-step config ──────────────────────────────────────────────────────

const NEXT_STATUS: Partial<Record<OrderStatus, OrderStatus>> = {
  Placed:     "Accepted",
  Accepted:   "Preparing",
  Preparing:  "Ready",
  Ready:      "PickedUp",
  PickedUp:   "Delivering",
  Delivering: "Delivered",
};

const NEXT_LABEL: Partial<Record<OrderStatus, string>> = {
  Placed:     "Accept Order",
  Accepted:   "Start Preparing",
  Preparing:  "Mark Ready",
  Ready:      "Confirm Picked Up",
  PickedUp:   "Out for Delivery",
  Delivering: "Mark Delivered",
};

const NEXT_ICON: Partial<Record<OrderStatus, string>> = {
  Placed:     "ri-thumb-up-line",
  Accepted:   "ri-restaurant-line",
  Preparing:  "ri-checkbox-circle-line",
  Ready:      "ri-shopping-bag-line",
  PickedUp:   "ri-navigation-line",
  Delivering: "ri-check-double-line",
};

// ─── Helpers ───────────────────────────────────────────────────────────────

function fmtTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false });
}

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function elapsed(iso: string): string {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (diff < 60) return `${diff}m ago`;
  return `${Math.floor(diff / 60)}h ${diff % 60}m ago`;
}

// ─── Note types ────────────────────────────────────────────────────────────

interface Note {
  id: string;
  text: string;
  timestamp: string;
  type: "note" | "status_change" | "flag_change";
}

// ─── Header ────────────────────────────────────────────────────────────────

function PanelHeader({ order, onClose }: { order: Order; onClose: () => void }) {
  const headerBg = order.isUrgent
    ? "bg-red-50 border-red-100"
    : order.isDelayed
      ? "bg-amber-50 border-amber-100"
      : "bg-gray-50 border-gray-100";

  return (
    <div className={`px-5 py-3.5 border-b flex-shrink-0 ${headerBg}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          {/* ID + status row */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-mono text-gray-400">{order.id}</span>
            <StatusBadge status={order.status} size="sm" />
            {order.isUrgent && (
              <span className="inline-flex items-center gap-1 text-[10px] font-black px-1.5 py-0.5 rounded bg-red-200 text-red-700 uppercase tracking-widest">
                <i className="ri-alarm-warning-fill text-[10px]" /> Urgent
              </span>
            )}
            {order.isDelayed && (
              <span className="inline-flex items-center gap-1 text-[10px] font-black px-1.5 py-0.5 rounded bg-amber-200 text-amber-700 uppercase tracking-widest">
                <i className="ri-time-line text-[10px]" /> Delayed
              </span>
            )}
            {order.hasReminder && (
              <span className="inline-flex items-center gap-1 text-[10px] font-black px-1.5 py-0.5 rounded bg-teal-200 text-teal-700 uppercase tracking-widest">
                <i className="ri-notification-3-fill text-[10px]" /> Reminder
              </span>
            )}
          </div>
          {/* Timestamps */}
          <p className="text-[10px] text-gray-400 mt-1">
            Created {fmtDate(order.createdAt)} · {fmtTime(order.createdAt)}
            <span className="mx-1.5 text-gray-300">·</span>
            Updated {elapsed(order.updatedAt)}
          </p>
        </div>
        <button
          onClick={onClose}
          className="w-7 h-7 flex items-center justify-center rounded-lg bg-white/80 hover:bg-white border border-gray-200 text-gray-500 hover:text-gray-700 cursor-pointer transition-all flex-shrink-0"
        >
          <i className="ri-close-line text-base" />
        </button>
      </div>
    </div>
  );
}

// ─── Section wrapper ───────────────────────────────────────────────────────

function Section({ title, children, noPad }: { title?: string; children: React.ReactNode; noPad?: boolean }) {
  return (
    <div className={`border-b border-gray-100 ${noPad ? "" : "px-5 py-4"}`}>
      {title && (
        <p className={`text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 ${noPad ? "px-5 pt-4" : ""}`}>
          {title}
        </p>
      )}
      {children}
    </div>
  );
}

// ─── Main Panel ────────────────────────────────────────────────────────────

interface OrderDetailPanelProps {
  order: Order | null;
  onClose: () => void;
  onStatusChange: (orderId: string, newStatus: OrderStatus) => void;
}

export function OrderDetailPanel({ order, onClose, onStatusChange }: OrderDetailPanelProps) {
  const { toggleUrgent, toggleReminder, markResolved } = useOrders();

  const [notes, setNotes] = useState<Note[]>([]);
  const [noteInput, setNoteInput] = useState("");
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // Reset cancel confirm when order changes
  useEffect(() => {
    setConfirmCancel(false);
  }, [order?.id]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  if (!order) return null;

  const next = NEXT_STATUS[order.status];
  const nextLabel = NEXT_LABEL[order.status];
  const nextIcon = NEXT_ICON[order.status];
  const isTerminal = order.status === "Delivered" || order.status === "Cancelled";

  // ── Handlers ─────────────────────────────────────────────────────────────
  const handleStepClick = (status: OrderStatus) => {
    onStatusChange(order.id, status);
    setNotes(prev => [{
      id: Date.now().toString(),
      text: `Status changed to ${status}`,
      timestamp: new Date().toISOString(),
      type: "status_change",
    }, ...prev]);
    showToast(`Status → ${status}`);
  };

  const handleAdvance = () => {
    if (!next) return;
    onStatusChange(order.id, next);
    setNotes(prev => [{
      id: Date.now().toString(),
      text: `Status changed to ${next}`,
      timestamp: new Date().toISOString(),
      type: "status_change",
    }, ...prev]);
    showToast(`Status → ${next}`);
  };

  const handleToggleUrgent = () => {
    toggleUrgent(order.id);
    const msg = order.isUrgent ? "Urgent flag removed" : "Marked as Urgent";
    setNotes(prev => [{ id: Date.now().toString(), text: msg, timestamp: new Date().toISOString(), type: "flag_change" }, ...prev]);
    showToast(msg);
  };

  const handleToggleReminder = () => {
    toggleReminder(order.id);
    const msg = order.hasReminder ? "Reminder removed" : "Reminder set";
    setNotes(prev => [{ id: Date.now().toString(), text: msg, timestamp: new Date().toISOString(), type: "flag_change" }, ...prev]);
    showToast(msg);
  };

  const handleMarkResolved = () => {
    markResolved(order.id);
    setNotes(prev => [{ id: Date.now().toString(), text: "Issue marked as resolved", timestamp: new Date().toISOString(), type: "flag_change" }, ...prev]);
    showToast("Issue resolved ✓");
  };

  const handleCancel = () => {
    if (!confirmCancel) { setConfirmCancel(true); return; }
    onStatusChange(order.id, "Cancelled");
    setConfirmCancel(false);
    showToast("Order cancelled");
  };

  const handleAddNote = () => {
    if (!noteInput.trim()) return;
    setNotes(prev => [{
      id: Date.now().toString(),
      text: noteInput.trim(),
      timestamp: new Date().toISOString(),
      type: "note",
    }, ...prev]);
    setNoteInput("");
  };

  return (
    <>
      {/* ── Backdrop ──────────────────────────────────────────── */}
      <div className="fixed inset-0 bg-black/10 z-30" onClick={onClose} />

      {/* ── Drawer ────────────────────────────────────────────── */}
      <div className="fixed right-0 top-0 h-full w-[480px] bg-white z-40 flex flex-col border-l border-gray-200">

        {/* ── Header ─────────────────────────────────────────── */}
        <PanelHeader order={order} onClose={onClose} />

        {/* ── Scrollable body ────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto">

          {/* 1 · Status stepper */}
          <Section title="Status Flow">
            <StatusStepper
              currentStatus={order.status}
              onStepClick={handleStepClick}
            />
          </Section>

          {/* 2 · Quick actions */}
          <Section title="Quick Actions">
            <QuickActions
              order={order}
              onToggleUrgent={handleToggleUrgent}
              onToggleReminder={handleToggleReminder}
              onMarkResolved={handleMarkResolved}
              onCancel={handleCancel}
            />
            {confirmCancel && (
              <div className="mt-3 flex items-center gap-3 px-3 py-2.5 rounded-xl bg-red-50 border border-red-200">
                <i className="ri-error-warning-line text-red-500 text-base flex-shrink-0" />
                <p className="text-xs text-red-700 font-semibold flex-1">Confirm cancel this order?</p>
                <button
                  onClick={handleCancel}
                  className="text-xs font-bold text-white bg-red-600 hover:bg-red-700 px-3 py-1.5 rounded-lg cursor-pointer transition-colors whitespace-nowrap"
                >
                  Yes, Cancel
                </button>
                <button
                  onClick={() => setConfirmCancel(false)}
                  className="text-xs text-gray-500 hover:text-gray-700 cursor-pointer"
                >
                  No
                </button>
              </div>
            )}
          </Section>

          {/* 3 · Room + Guest + Amount */}
          <Section>
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-end gap-2">
                  <span className="text-5xl font-black font-mono text-gray-900 leading-none">{order.roomNumber}</span>
                  <span className="text-xs text-gray-400 mb-1.5">Room</span>
                </div>
                <p className="text-base font-semibold text-gray-700 mt-2">{order.guestName}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400 mb-1">Order Total</p>
                <p className={`text-3xl font-black leading-none ${order.totalAmount > 0 ? "text-gray-900" : "text-gray-400"}`}>
                  {order.totalAmount > 0 ? `$${order.totalAmount.toFixed(2)}` : "—"}
                </p>
              </div>
            </div>

            {/* Original notes/instructions */}
            {order.notes ? (
              <div className="mt-4 flex gap-2.5 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2.5">
                <i className="ri-information-line text-amber-500 text-base flex-shrink-0 mt-0.5" />
                <p className="text-xs text-amber-900 leading-relaxed">{order.notes}</p>
              </div>
            ) : (
              <p className="mt-3 text-xs text-gray-400 italic">No special instructions.</p>
            )}
          </Section>

          {/* 4 · Items */}
          <Section title={`Items (${order.items.length})`}>
            <div className="space-y-1.5">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-gray-50 border border-gray-100">
                  <div className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-200 text-gray-700 text-xs font-bold flex-shrink-0">
                    {item.quantity}
                  </div>
                  <p className="text-sm font-medium text-gray-800 flex-1">{item.name}</p>
                  <i className="ri-check-line text-gray-300 text-sm" />
                </div>
              ))}
            </div>
          </Section>

          {/* 5 · Rating (Delivered only) */}
          {order.status === "Delivered" && (
            <Section title="Guest Rating">
              {order.rating ? (
                <div className="flex items-center gap-4">
                  <RatingStars score={order.rating} size="lg" showValue />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500">
                      {order.rating === 5 ? "Excellent service" :
                       order.rating === 4 ? "Good experience" :
                       order.rating === 3 ? "Average — may need follow-up" :
                       "Poor — follow up with guest"}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-gray-400">
                  <i className="ri-star-line text-gray-300 text-base" />
                  <p className="text-xs italic">No rating submitted by guest yet.</p>
                </div>
              )}
            </Section>
          )}

          {/* 6 · Activity log + notes */}
          <Section title="Activity & Notes" noPad>
            <div className="px-5 pb-3 pt-0">
              {/* Note input */}
              <div className="flex gap-2 mb-3 pt-0">
                <input
                  type="text"
                  placeholder="Add a note or update…"
                  value={noteInput}
                  onChange={e => setNoteInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleAddNote()}
                  className="flex-1 text-xs border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-teal-400 bg-gray-50 text-gray-700 placeholder-gray-400"
                />
                <button
                  onClick={handleAddNote}
                  className="w-8 h-8 flex items-center justify-center rounded-lg bg-teal-600 hover:bg-teal-700 text-white cursor-pointer transition-colors flex-shrink-0"
                >
                  <i className="ri-send-plane-fill text-sm" />
                </button>
              </div>

              {/* Log entries */}
              {notes.length === 0 ? (
                <p className="text-xs text-gray-400 italic text-center py-3">No activity yet for this order.</p>
              ) : (
                <div className="space-y-2">
                  {notes.map(n => (
                    <div
                      key={n.id}
                      className={`flex gap-2.5 px-3 py-2.5 rounded-lg
                        ${n.type === "note"          ? "bg-amber-50 border-l-4 border-amber-300" : ""}
                        ${n.type === "status_change" ? "bg-teal-50  border-l-4 border-teal-300"  : ""}
                        ${n.type === "flag_change"   ? "bg-gray-50  border-l-4 border-gray-300"  : ""}
                      `}
                    >
                      <i className={`text-sm flex-shrink-0 mt-0.5
                        ${n.type === "note"          ? "ri-sticky-note-2-line text-amber-500" : ""}
                        ${n.type === "status_change" ? "ri-refresh-line text-teal-500"         : ""}
                        ${n.type === "flag_change"   ? "ri-flag-2-line text-gray-500"          : ""}
                      `} />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-700 leading-relaxed">{n.text}</p>
                        <p className="text-[10px] text-gray-400 mt-0.5">{fmtTime(n.timestamp)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Section>
        </div>

        {/* ── Sticky footer ──────────────────────────────────── */}
        <div className="border-t border-gray-100 bg-white flex-shrink-0 p-4 space-y-2.5">
          {isTerminal ? (
            /* Terminal state footer */
            <div className={`flex items-center gap-3 px-4 py-3 rounded-xl
              ${order.status === "Delivered" ? "bg-emerald-50 border border-emerald-200" : "bg-gray-100 border border-gray-200"}`}>
              <i className={`text-lg ${order.status === "Delivered" ? "ri-check-double-line text-emerald-600" : "ri-close-circle-line text-gray-500"}`} />
              <div>
                <p className={`text-sm font-bold ${order.status === "Delivered" ? "text-emerald-800" : "text-gray-600"}`}>
                  {order.status === "Delivered" ? "Order Delivered" : "Order Cancelled"}
                </p>
                <p className="text-xs text-gray-500">This order is closed.</p>
              </div>
            </div>
          ) : next ? (
            /* Advance button */
            <Button
              variant="primary"
              size="lg"
              fullWidth
              icon={nextIcon}
              onClick={handleAdvance}
              className="justify-center text-sm font-bold"
            >
              {nextLabel}
              <span className="ml-2 text-xs opacity-70">→ {next}</span>
            </Button>
          ) : null}
        </div>
      </div>

      {/* ── Toast notification ─────────────────────────────── */}
      {toast && (
        <div className="fixed bottom-6 right-[500px] z-50 bg-gray-900 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xl animate-bounce">
          {toast}
        </div>
      )}
    </>
  );
}
