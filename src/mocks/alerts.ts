// Re-export Alert type from canonical types
export type { Alert, AlertType, AlertPriority } from "../types/order";

import { Alert } from "../types/order";

export const mockAlerts: Alert[] = [
  {
    id: "ALT-001",
    orderId: "ORD-0001",
    roomNumber: "412",
    type: "allergy",
    message: "VIP guest — severe peanut allergy on file. Order delayed 45 min. Verify all ingredients before dispatch.",
    createdAt: "2026-03-19T08:34:00Z",
    elapsed: "22 min",
    resolved: false,
    priority: "critical",
  },
  {
    id: "ALT-002",
    orderId: "ORD-0002",
    roomNumber: "109",
    type: "allergy",
    message: "Guest has severe lactose intolerance. Confirm no dairy in cappuccino (use oat milk) before sending.",
    createdAt: "2026-03-19T09:02:00Z",
    elapsed: "15 min",
    resolved: false,
    priority: "critical",
  },
  {
    id: "ALT-003",
    orderId: "ORD-0003",
    roomNumber: "601",
    type: "delay",
    message: "Anniversary order (ORD-0003) still Accepted after 27 min. Champagne must be served chilled — time-sensitive.",
    createdAt: "2026-03-19T08:50:00Z",
    elapsed: "27 min",
    resolved: false,
    priority: "high",
  },
  {
    id: "ALT-004",
    orderId: "ORD-0004",
    roomNumber: "218",
    type: "overdue",
    message: "Breakfast order Ready but not picked up. Guest checking out at 10:00am — deliver immediately.",
    createdAt: "2026-03-19T08:45:00Z",
    elapsed: "32 min",
    resolved: false,
    priority: "high",
  },
  {
    id: "ALT-005",
    orderId: "ORD-0012",
    roomNumber: "417",
    type: "delay",
    message: "Afternoon tea order still Preparing after 70 min. Guest has been waiting — escalate to kitchen.",
    createdAt: "2026-03-19T09:10:00Z",
    elapsed: "7 min",
    resolved: false,
    priority: "medium",
  },
];
