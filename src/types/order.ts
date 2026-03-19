// ─── Order Status ──────────────────────────────────────────────────────────
// Full lifecycle: Placed → Accepted → Preparing → Ready → PickedUp / Delivering → Delivered
// Can be Cancelled at any stage.

export type OrderStatus =
  | "Placed"
  | "Accepted"
  | "Preparing"
  | "Ready"
  | "PickedUp"
  | "Delivering"
  | "Cancelled"
  | "Delivered";

// ─── Order Item ────────────────────────────────────────────────────────────

export interface OrderItem {
  name: string;
  quantity: number;
}

// ─── Guest Rating ──────────────────────────────────────────────────────────
// Optional — only present when status === "Delivered" and guest has rated.

export type StarRating = 1 | 2 | 3 | 4 | 5;

// ─── Order ─────────────────────────────────────────────────────────────────

export interface Order {
  id: string;
  guestName: string;
  roomNumber: string;
  totalAmount: number;        // in USD
  status: OrderStatus;
  createdAt: string;          // ISO 8601 timestamp
  updatedAt: string;          // ISO 8601 timestamp
  items: OrderItem[];
  notes: string;              // empty string when no notes
  isUrgent: boolean;
  hasReminder: boolean;
  isDelayed: boolean;
  rating?: StarRating;        // optional — only on Delivered orders
}

// ─── Auxiliary / UI types ──────────────────────────────────────────────────

export type SortOption = "latest" | "room" | "amount";

export interface OrderFilters {
  status: OrderStatus | "all";
  sort: SortOption;
  sortDir: "asc" | "desc";
  search: string;
}

// Derived progress steps for the detail-panel timeline
export const STATUS_STEPS: OrderStatus[] = [
  "Placed",
  "Accepted",
  "Preparing",
  "Ready",
  "Delivering",
  "Delivered",
];

// ─── Delay Thresholds ─────────────────────────────────────────────────────
// How many minutes an order can stay in a given status before auto-flagged as delayed.

export const DELAY_THRESHOLDS_MIN: Partial<Record<OrderStatus, number>> = {
  Placed:     5,
  Accepted:   10,
  Preparing:  25,
  Ready:      10,
  PickedUp:   20,
  Delivering: 25,
};

// ─── Alert types (unchanged) ───────────────────────────────────────────────

export type AlertType =
  | "overdue"
  | "vip"
  | "complaint"
  | "allergy"
  | "quality"
  | "delay";

export type AlertPriority = "critical" | "high" | "medium";

export interface Alert {
  id: string;
  orderId: string;
  roomNumber: string;
  type: AlertType;
  message: string;
  createdAt: string;
  elapsed: string;
  resolved: boolean;
  priority: AlertPriority;
}

// ─── Activity feed ─────────────────────────────────────────────────────────

export type ActivityType =
  | "order_created"
  | "status_change"
  | "delivered"
  | "assigned"
  | "cancelled"
  | "escalated";

export interface ActivityEvent {
  id: string;
  type: ActivityType;
  orderId: string;
  room: string;
  text: string;
  time: string;
  color: "red" | "emerald" | "teal" | "slate" | "amber";
}

// ─── Metrics ───────────────────────────────────────────────────────────────

export interface MetricData {
  label: string;
  value: number | string;
  icon: string;
  trend?: string;
  trendUp?: boolean;
  accentClass: string;
  iconBgClass: string;
}
