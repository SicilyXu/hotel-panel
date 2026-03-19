// Re-export canonical types so existing imports from this file still resolve
export type {
  Order,
  OrderItem,
  OrderStatus,
  OrderFilters,
  SortOption,
  StarRating,
  ActivityEvent,
} from "../types/order";

import { Order } from "../types/order";

// ─── Mock Orders ───────────────────────────────────────────────────────────
// 15 food & beverage room-service orders

export const mockOrders: Order[] = [
  // 1 ── Urgent + Delayed, currently Preparing
  {
    id: "ORD-0001",
    guestName: "Alexandra Petrov",
    roomNumber: "412",
    totalAmount: 87.50,
    status: "Preparing",
    createdAt: "2026-03-19T07:45:00Z",
    updatedAt: "2026-03-19T08:34:00Z",
    items: [
      { name: "Club Sandwich", quantity: 1 },
      { name: "Fresh Orange Juice", quantity: 2 },
      { name: "Greek Yogurt Parfait", quantity: 1 },
    ],
    notes: "VIP guest. Severe peanut allergy on file. Expedite — guest waiting 45 min.",
    isUrgent: true,
    hasReminder: true,
    isDelayed: true,
    rating: undefined,
  },

  // 2 ── Urgent, just Placed
  {
    id: "ORD-0002",
    guestName: "Claire Dubois",
    roomNumber: "109",
    totalAmount: 62.00,
    status: "Placed",
    createdAt: "2026-03-19T09:02:00Z",
    updatedAt: "2026-03-19T09:02:00Z",
    items: [
      { name: "Smoked Salmon Bagel", quantity: 2 },
      { name: "Cappuccino", quantity: 2 },
      { name: "Fresh Fruit Platter", quantity: 1 },
    ],
    notes: "Guest has severe lactose intolerance. No dairy in any item.",
    isUrgent: true,
    hasReminder: false,
    isDelayed: false,
    rating: undefined,
  },

  // 3 ── Delayed + Accepted, reminder set
  {
    id: "ORD-0003",
    guestName: "Emma & Lucas Wright",
    roomNumber: "601",
    totalAmount: 198.00,
    status: "Accepted",
    createdAt: "2026-03-19T08:50:00Z",
    updatedAt: "2026-03-19T09:05:00Z",
    items: [
      { name: "Champagne Bottle (Moët)", quantity: 1 },
      { name: "Chocolate Fondue Set", quantity: 1 },
      { name: "Strawberries & Cream", quantity: 2 },
      { name: "Assorted Macarons", quantity: 1 },
    ],
    notes: "Anniversary celebration. Serve chilled. Candles requested with tray.",
    isUrgent: false,
    hasReminder: true,
    isDelayed: true,
    rating: undefined,
  },

  // 4 ── In Ready state, waiting for pickup
  {
    id: "ORD-0004",
    guestName: "Robert Tanaka",
    roomNumber: "218",
    totalAmount: 52.00,
    status: "Ready",
    createdAt: "2026-03-19T08:20:00Z",
    updatedAt: "2026-03-19T08:58:00Z",
    items: [
      { name: "Full English Breakfast", quantity: 1 },
      { name: "Americano Coffee", quantity: 1 },
      { name: "Freshly Squeezed Orange Juice", quantity: 1 },
    ],
    notes: "Early checkout at 10:00am. Please deliver no later than 09:30.",
    isUrgent: false,
    hasReminder: true,
    isDelayed: false,
    rating: undefined,
  },

  // 5 ── Delivering right now
  {
    id: "ORD-0005",
    guestName: "Priya Sharma",
    roomNumber: "734",
    totalAmount: 118.75,
    status: "Delivering",
    createdAt: "2026-03-19T09:05:00Z",
    updatedAt: "2026-03-19T09:28:00Z",
    items: [
      { name: "Veggie Omelette", quantity: 3 },
      { name: "Avocado Toast", quantity: 2 },
      { name: "Green Smoothie", quantity: 3 },
      { name: "Assorted Pastries Basket", quantity: 1 },
    ],
    notes: "Table setup for 3 guests. No onions on one omelette.",
    isUrgent: false,
    hasReminder: false,
    isDelayed: false,
    rating: undefined,
  },

  // 6 ── Delivered, excellent rating
  {
    id: "ORD-0006",
    guestName: "Michael Okafor",
    roomNumber: "305",
    totalAmount: 43.00,
    status: "Delivered",
    createdAt: "2026-03-19T07:30:00Z",
    updatedAt: "2026-03-19T08:05:00Z",
    items: [
      { name: "Continental Breakfast", quantity: 1 },
      { name: "Americano Coffee (double shot)", quantity: 1 },
    ],
    notes: "No dairy in breakfast.",
    isUrgent: false,
    hasReminder: false,
    isDelayed: false,
    rating: 5,
  },

  // 7 ── Delivered, average rating + was delayed
  {
    id: "ORD-0007",
    guestName: "Jennifer & Alan Scott",
    roomNumber: "801",
    totalAmount: 96.50,
    status: "Delivered",
    createdAt: "2026-03-19T07:00:00Z",
    updatedAt: "2026-03-19T07:52:00Z",
    items: [
      { name: "Full English Breakfast", quantity: 2 },
      { name: "Earl Grey Tea", quantity: 1 },
      { name: "Fresh Orange Juice", quantity: 2 },
    ],
    notes: "",
    isUrgent: false,
    hasReminder: false,
    isDelayed: true,
    rating: 3,
  },

  // 8 ── Delivered, poor rating
  {
    id: "ORD-0008",
    guestName: "Thomas Müller",
    roomNumber: "920",
    totalAmount: 34.00,
    status: "Delivered",
    createdAt: "2026-03-19T06:45:00Z",
    updatedAt: "2026-03-19T07:40:00Z",
    items: [
      { name: "Croissant & Jam", quantity: 2 },
      { name: "Cappuccino", quantity: 2 },
    ],
    notes: "",
    isUrgent: false,
    hasReminder: false,
    isDelayed: true,
    rating: 2,
  },

  // 9 ── Delivered, great rating
  {
    id: "ORD-0009",
    guestName: "Sofia Bellini",
    roomNumber: "203",
    totalAmount: 67.00,
    status: "Delivered",
    createdAt: "2026-03-19T08:10:00Z",
    updatedAt: "2026-03-19T08:45:00Z",
    items: [
      { name: "Eggs Benedict", quantity: 1 },
      { name: "Freshly Squeezed Juice", quantity: 1 },
      { name: "Yogurt Bowl", quantity: 1 },
    ],
    notes: "Lactose intolerant — use oat milk.",
    isUrgent: false,
    hasReminder: false,
    isDelayed: false,
    rating: 4,
  },

  // 10 ── Cancelled by guest
  {
    id: "ORD-0010",
    guestName: "Omar Al-Rashid",
    roomNumber: "316",
    totalAmount: 58.00,
    status: "Cancelled",
    createdAt: "2026-03-19T08:40:00Z",
    updatedAt: "2026-03-19T08:55:00Z",
    items: [
      { name: "Shawarma Plate (Halal)", quantity: 2 },
      { name: "Hummus & Pita Bread", quantity: 1 },
    ],
    notes: "",
    isUrgent: false,
    hasReminder: false,
    isDelayed: false,
    rating: undefined,
  },

  // 11 ── Placed, new order
  {
    id: "ORD-0011",
    guestName: "Hiroshi Yamamoto",
    roomNumber: "523",
    totalAmount: 74.00,
    status: "Placed",
    createdAt: "2026-03-19T09:10:00Z",
    updatedAt: "2026-03-19T09:10:00Z",
    items: [
      { name: "Japanese Breakfast Set", quantity: 1 },
      { name: "Miso Soup", quantity: 2 },
      { name: "Green Tea", quantity: 2 },
    ],
    notes: "No MSG. Light seasoning only.",
    isUrgent: false,
    hasReminder: true,
    isDelayed: false,
    rating: undefined,
  },

  // 12 ── Delayed + Preparing, reminder active
  {
    id: "ORD-0012",
    guestName: "Fatima Al-Zahra",
    roomNumber: "417",
    totalAmount: 145.00,
    status: "Preparing",
    createdAt: "2026-03-19T08:00:00Z",
    updatedAt: "2026-03-19T08:20:00Z",
    items: [
      { name: "Afternoon Tea for Two", quantity: 1 },
      { name: "Scones with Clotted Cream", quantity: 4 },
      { name: "Selection of Finger Sandwiches", quantity: 1 },
      { name: "Pot of Darjeeling Tea", quantity: 2 },
    ],
    notes: "No shellfish. Gluten-free option for one guest.",
    isUrgent: false,
    hasReminder: true,
    isDelayed: true,
    rating: undefined,
  },

  // 13 ── PickedUp — en route
  {
    id: "ORD-0013",
    guestName: "Carlos Mendez",
    roomNumber: "210",
    totalAmount: 48.00,
    status: "PickedUp",
    createdAt: "2026-03-19T09:15:00Z",
    updatedAt: "2026-03-19T09:32:00Z",
    items: [
      { name: "Chicken Caesar Salad", quantity: 1 },
      { name: "Sparkling Water (500ml)", quantity: 2 },
      { name: "Tiramisu", quantity: 1 },
    ],
    notes: "No croutons on the salad.",
    isUrgent: false,
    hasReminder: false,
    isDelayed: false,
    rating: undefined,
  },

  // 14 ── Urgent + Accepted, high-value
  {
    id: "ORD-0014",
    guestName: "Viktor Kozlov",
    roomNumber: "1201",
    totalAmount: 485.00,
    status: "Accepted",
    createdAt: "2026-03-19T09:00:00Z",
    updatedAt: "2026-03-19T09:08:00Z",
    items: [
      { name: "Wagyu Beef Sliders", quantity: 3 },
      { name: "Lobster Bisque", quantity: 2 },
      { name: "Vintage Bordeaux (2018)", quantity: 1 },
      { name: "Cheese & Charcuterie Board", quantity: 1 },
      { name: "Chocolate Lava Cake", quantity: 2 },
    ],
    notes: "Penthouse suite — white-glove service required. No substitutions.",
    isUrgent: true,
    hasReminder: true,
    isDelayed: false,
    rating: undefined,
  },

  // 15 ── Delivered, perfect rating
  {
    id: "ORD-0015",
    guestName: "Amara Diallo",
    roomNumber: "615",
    totalAmount: 38.50,
    status: "Delivered",
    createdAt: "2026-03-19T07:50:00Z",
    updatedAt: "2026-03-19T08:25:00Z",
    items: [
      { name: "Banana Pancakes", quantity: 2 },
      { name: "Fresh Berry Smoothie", quantity: 1 },
    ],
    notes: "",
    isUrgent: false,
    hasReminder: false,
    isDelayed: false,
    rating: 5,
  },
];

// ─── Derived status counts ─────────────────────────────────────────────────

export const statusCounts = mockOrders.reduce(
  (acc, o) => {
    acc[o.status] = (acc[o.status] ?? 0) + 1;
    acc.all += 1;
    return acc;
  },
  { all: 0 } as Record<string, number>
);

// ─── Activity feed ─────────────────────────────────────────────────────────

export const activityFeed = [
  { id: "a1",  type: "escalated",     orderId: "ORD-0001", room: "412",  text: "Order escalated — URGENT + delayed 45 min",       time: "2 min ago",  color: "red"     },
  { id: "a2",  type: "order_created", orderId: "ORD-0002", room: "109",  text: "New urgent order placed — allergy on file",        time: "5 min ago",  color: "red"     },
  { id: "a3",  type: "status_change", orderId: "ORD-0005", room: "734",  text: "Order out for delivery — Room 734",                time: "9 min ago",  color: "teal"    },
  { id: "a4",  type: "status_change", orderId: "ORD-0004", room: "218",  text: "Order ready for pickup — Room 218",                time: "12 min ago", color: "amber"   },
  { id: "a5",  type: "delivered",     orderId: "ORD-0009", room: "203",  text: "Delivered to Room 203 — rated 4\u2605",            time: "15 min ago", color: "emerald" },
  { id: "a6",  type: "order_created", orderId: "ORD-0014", room: "1201", text: "High-value penthouse order accepted — $485",       time: "19 min ago", color: "amber"   },
  { id: "a7",  type: "delivered",     orderId: "ORD-0006", room: "305",  text: "Delivered to Room 305 — rated 5\u2605",            time: "23 min ago", color: "emerald" },
  { id: "a8",  type: "cancelled",     orderId: "ORD-0010", room: "316",  text: "Order cancelled by guest (Room 316)",              time: "27 min ago", color: "slate"   },
  { id: "a9",  type: "escalated",     orderId: "ORD-0012", room: "417",  text: "Afternoon tea delayed — 70 min since placed",      time: "31 min ago", color: "red"     },
  { id: "a10", type: "delivered",     orderId: "ORD-0007", room: "801",  text: "Delivered to Room 801 — rated 3\u2605 (was delayed)", time: "38 min ago", color: "amber" },
];
