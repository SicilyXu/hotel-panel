import { useState, useMemo } from "react";
import { AppShell } from "../../components/feature/AppShell";
import { OrderControlBar, AttentionFilter } from "./components/OrderControlBar";
import { OrderTable } from "./components/OrderTable";
import { OrderDetailPanel } from "./components/OrderDetailPanel";
import { useOrders } from "../../context/OrdersContext";

export default function OrdersPage() {
  const {
    orders,
    filteredOrders,
    selectedOrder,
    filters,
    counts,
    setStatusFilter,
    setSortFilter,
    setSearchFilter,
    selectOrder,
    updateOrderStatus,
  } = useOrders();

  // Attention filter is local (UI concern only, on top of context filters)
  const [attentionFilter, setAttentionFilter] = useState<AttentionFilter>("all");

  // Apply attention filter on top of context-filtered orders
  const visibleOrders = useMemo(() => {
    if (attentionFilter === "urgent")    return filteredOrders.filter(o => o.isUrgent);
    if (attentionFilter === "delayed")   return filteredOrders.filter(o => o.isDelayed && !o.isUrgent);
    if (attentionFilter === "reminder")  return filteredOrders.filter(o => o.hasReminder && !o.isUrgent && !o.isDelayed);
    if (attentionFilter === "attention") return filteredOrders.filter(o => o.isUrgent || o.isDelayed || o.hasReminder);
    return filteredOrders;
  }, [filteredOrders, attentionFilter]);

  // Counts for attention filter badges
  const urgentCount   = orders.filter(o => o.isUrgent).length;
  const delayedCount  = orders.filter(o => o.isDelayed && !o.isUrgent).length;
  const reminderCount = orders.filter(o => o.hasReminder && !o.isUrgent && !o.isDelayed).length;

  return (
    <AppShell searchValue={filters.search} onSearchChange={setSearchFilter}>
      <div className="flex flex-col h-full overflow-hidden">
        {/* ── Sticky control bar ──────────────────────────── */}
        <OrderControlBar
          search={filters.search}
          onSearchChange={setSearchFilter}
          activeStatus={filters.status}
          onStatusChange={(s) => {
            setStatusFilter(s);
            setAttentionFilter("all"); // reset attention when status changes
          }}
          statusCounts={counts}
          attentionFilter={attentionFilter}
          onAttentionChange={setAttentionFilter}
          urgentCount={urgentCount}
          delayedCount={delayedCount}
          reminderCount={reminderCount}
          sortBy={filters.sort}
          onSortChange={setSortFilter}
          resultCount={visibleOrders.length}
          totalCount={orders.length}
        />

        {/* ── Order table ─────────────────────────────────── */}
        <div className="flex-1 overflow-auto bg-white">
          <OrderTable
            orders={visibleOrders}
            selectedId={selectedOrder?.id ?? null}
            onSelect={selectOrder}
            sortBy={filters.sort}
            sortDir={filters.sortDir}
            onSortChange={setSortFilter}
            onSortReset={() => setSortFilter("latest", "desc")}
          />
        </div>
      </div>

      {/* ── Order detail panel (slide-in) ─────────────────── */}
      <OrderDetailPanel
        order={selectedOrder}
        onClose={() => selectOrder(null)}
        onStatusChange={updateOrderStatus}
      />
    </AppShell>
  );
}
