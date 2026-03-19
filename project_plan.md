# Hotel Order Tracking Panel

## 1. Project Description
An internal operational dashboard for hotel staff to track, manage, and fulfill room service and guest orders in real time. Designed for speed and clarity during busy service periods — not customer-facing. Target users are front desk staff, room service coordinators, and floor managers.

## 2. Page Structure
- `/` → redirect to `/dashboard`
- `/dashboard` — Dashboard Overview (KPIs, status chart, recent alerts, activity timeline)
- `/orders` — Order List (table with filters, search, order detail slide-in panel)

## 3. Core Features
- [x] Dashboard overview with KPI metrics
- [x] Status distribution chart
- [x] Recent urgent alerts panel (dashboard widget)
- [x] Activity timeline
- [x] Order list with filters (status chips) and search
- [x] Order detail slide-in panel
- [x] Vertical status tracking timeline per order
- [x] Urgent/attention alert system (global overlay panel)
- [x] Mock data for all entities

## 4. Data Model Design (Mock Only)

### Order
| Field | Type | Description |
|-------|------|-------------|
| id | string | Unique order ID |
| roomNumber | string | Hotel room number |
| guestName | string | Guest name |
| items | OrderItem[] | List of ordered items |
| status | OrderStatus | new / pending / in_progress / completed / urgent / cancelled |
| priority | high / normal / low | Visual priority indicator |
| assignedTo | StaffMember | Assigned staff |
| createdAt | Date | Creation timestamp |
| updatedAt | Date | Last update timestamp |
| notes | string | Internal notes |
| timeline | TimelineEvent[] | Status history |

### OrderItem
| Field | Type | Description |
|-------|------|-------------|
| id | string | Item ID |
| name | string | Item name |
| quantity | number | Quantity |
| instructions | string | Special instructions |
| status | string | Item-level status |

### Alert
| Field | Type | Description |
|-------|------|-------------|
| id | string | Alert ID |
| orderId | string | Related order |
| roomNumber | string | Room number |
| type | string | Alert type |
| message | string | Alert message |
| createdAt | Date | Created timestamp |
| resolved | boolean | Resolved status |

## 5. Backend / Third-party Integration Plan
- Supabase: Not needed (mock data only for this prototype)
- Shopify: Not applicable
- Stripe: Not applicable

## 6. Development Phase Plan

### Phase 1: Full Prototype (Current)
- Goal: Build complete functional UI with mock data
- Deliverable: Dashboard, Order List, Order Detail Panel, Alerts System
