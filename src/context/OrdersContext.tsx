import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
  useMemo,
} from "react";
import { mockOrders } from "../mocks/orders";
import {
  Order,
  OrderStatus,
  OrderFilters,
  SortOption,
  DELAY_THRESHOLDS_MIN,
} from "../types/order";

// ─── Auto-delay helper ────────────────────────────────────────────────────
// Computes whether an order is delayed based on how long it has been in its
// current status. The mock's `isDelayed: true` is also respected.

function computeIsDelayed(order: Order): boolean {
  if (["Delivered", "Cancelled"].includes(order.status)) return false;
  if (order.isDelayed) return true; // manual flag always wins
  const threshold = DELAY_THRESHOLDS_MIN[order.status];
  if (!threshold) return false;
  const elapsedMin = (Date.now() - new Date(order.updatedAt).getTime()) / 60000;
  return elapsedMin >= threshold;
}

interface OrdersContextType {
  orders: Order[];
  filteredOrders: Order[];
  selectedOrder: Order | null;
  filters: OrderFilters;
  setStatusFilter: (s: OrderStatus | "all") => void;
  setSortFilter: (s: SortOption, dir?: "asc" | "desc") => void;
  setSearchFilter: (s: string) => void;
  selectOrder: (order: Order | null) => void;
  updateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;
  toggleUrgent: (orderId: string) => void;
  toggleReminder: (orderId: string) => void;
  markResolved: (orderId: string) => void;
  counts: Record<string, number>;
}

const OrdersContext = createContext<OrdersContextType | null>(null);

export function OrdersProvider({ children }: { children: ReactNode }) {
  const [rawOrders, setRawOrders] = useState<Order[]>(mockOrders);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [tick, setTick] = useState(0);
  const [filters, setFilters] = useState<OrderFilters>({
    status: "all",
    sort: "latest",
    sortDir: "desc",
    search: "",
  });

  // Re-compute auto-delays every 60 seconds
  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 60_000);
    return () => clearInterval(id);
  }, []);

  // ── Processed orders: auto-delay overlaid ──────────────────────────────
  const orders = useMemo(
    () => rawOrders.map(o => ({ ...o, isDelayed: computeIsDelayed(o) })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [rawOrders, tick]
  );

  // Keep selectedOrder in sync when orders update
  useEffect(() => {
    if (!selectedOrder) return;
    const updated = orders.find(o => o.id === selectedOrder.id);
    if (updated) setSelectedOrder(updated);
  }, [orders, selectedOrder?.id]);

  // ── Filter + sort pipeline ──────────────────────────────────────────────
  const filteredOrders = useMemo(() => {
    let result = [...orders];

    if (filters.status !== "all") {
      result = result.filter(o => o.status === filters.status);
    }
    if (filters.search.trim()) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        o =>
          o.id.toLowerCase().includes(q) ||
          o.roomNumber.includes(q) ||
          o.guestName.toLowerCase().includes(q) ||
          o.items.some(i => i.name.toLowerCase().includes(q))
      );
    }
    if (filters.sort === "latest") {
      result.sort((a, b) =>
        filters.sortDir === "desc"
          ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          : new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
    } else if (filters.sort === "room") {
      result.sort((a, b) =>
        filters.sortDir === "desc"
          ? b.roomNumber.localeCompare(a.roomNumber)
          : a.roomNumber.localeCompare(b.roomNumber)
      );
    } else if (filters.sort === "amount") {
      result.sort((a, b) =>
        filters.sortDir === "desc"
          ? b.totalAmount - a.totalAmount
          : a.totalAmount - b.totalAmount
      );
    }

    return result;
  }, [orders, filters]);

  // ── Derived counts ──────────────────────────────────────────────────────
  const counts = useMemo(() => {
    const base: Record<string, number> = { all: orders.length };
    for (const o of orders) {
      base[o.status] = (base[o.status] ?? 0) + 1;
    }
    return base;
  }, [orders]);

  // ── Generic order updater ───────────────────────────────────────────────
  const updateRaw = useCallback((orderId: string, patch: Partial<Order>) => {
    const now = new Date().toISOString();
    setRawOrders(prev =>
      prev.map(o => o.id === orderId ? { ...o, ...patch, updatedAt: now } : o)
    );
  }, []);

  // ── Setters ─────────────────────────────────────────────────────────────
  const setStatusFilter  = useCallback((s: OrderStatus | "all") => setFilters(f => ({ ...f, status: s })), []);
  const setSortFilter = useCallback((s: SortOption, dir: "asc" | "desc" = "desc") => {
    setFilters(f => ({ ...f, sort: s, sortDir: dir }));
  }, []);
  const setSearchFilter  = useCallback((s: string) => setFilters(f => ({ ...f, search: s })), []);
  const selectOrder      = useCallback((order: Order | null) => setSelectedOrder(order), []);

  // ── Actions ─────────────────────────────────────────────────────────────
  const updateOrderStatus = useCallback((orderId: string, newStatus: OrderStatus) => {
    updateRaw(orderId, { status: newStatus });
  }, [updateRaw]);

  const toggleUrgent = useCallback((orderId: string) => {
    setRawOrders(prev =>
      prev.map(o => o.id === orderId ? { ...o, isUrgent: !o.isUrgent, updatedAt: new Date().toISOString() } : o)
    );
  }, []);

  const toggleReminder = useCallback((orderId: string) => {
    setRawOrders(prev =>
      prev.map(o => o.id === orderId ? { ...o, hasReminder: !o.hasReminder, updatedAt: new Date().toISOString() } : o)
    );
  }, []);

  const markResolved = useCallback((orderId: string) => {
    updateRaw(orderId, { isUrgent: false, isDelayed: false });
  }, [updateRaw]);

  return (
    <OrdersContext.Provider
      value={{
        orders,
        filteredOrders,
        selectedOrder,
        filters,
        setStatusFilter,
        setSortFilter,
        setSearchFilter,
        selectOrder,
        updateOrderStatus,
        toggleUrgent,
        toggleReminder,
        markResolved,
        counts,
      }}
    >
      {children}
    </OrdersContext.Provider>
  );
}

export function useOrders() {
  const ctx = useContext(OrdersContext);
  if (!ctx) throw new Error("useOrders must be used within <OrdersProvider>");
  return ctx;
}
