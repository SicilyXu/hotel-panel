import { useOrders } from "../../../context/OrdersContext";

interface KPICardProps {
  label: string;
  value: number;
  icon: string;
  accentColor: string;
  iconBg: string;
  iconColor: string;
  valueColor: string;
  highlight?: boolean;
  note: string;
}

function KPICard({ label, value, icon, accentColor, iconBg, iconColor, valueColor, highlight, note }: KPICardProps) {
  return (
    <div className={`rounded-xl p-4 flex flex-col gap-2 border border-gray-100 border-l-4 ${accentColor} ${highlight ? "bg-red-50" : "bg-white"}`}>
      <div className="flex items-start justify-between">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide leading-tight">{label}</p>
        <div className={`w-7 h-7 flex items-center justify-center rounded-lg ${iconBg} ${iconColor}`}>
          <i className={`${icon} text-base`} />
        </div>
      </div>
      <p className={`text-4xl font-black leading-none font-mono ${valueColor}`}>{value}</p>
      <p className="text-[10px] text-gray-400 font-medium">{note}</p>
    </div>
  );
}

export function KPICards() {
  const { orders } = useOrders();

  // Non-overlapping pipeline buckets
  const newOrders    = orders.filter(o => o.status === "Placed").length;
  const inKitchen    = orders.filter(o => ["Accepted", "Preparing"].includes(o.status)).length;
  const readyPickup  = orders.filter(o => ["Ready", "PickedUp"].includes(o.status)).length;
  const delivering   = orders.filter(o => o.status === "Delivering").length;
  const completed    = orders.filter(o => o.status === "Delivered").length;
  const attention    = orders.filter(o => o.isUrgent || o.isDelayed || o.hasReminder).length;

  const cards: KPICardProps[] = [
    {
      label: "New Orders",
      value: newOrders,
      icon: "ri-inbox-line",
      accentColor: "border-l-slate-400",
      iconBg: "bg-slate-100",
      iconColor: "text-slate-600",
      valueColor: "text-gray-900",
      note: "Awaiting acceptance",
    },
    {
      label: "In Kitchen",
      value: inKitchen,
      icon: "ri-restaurant-2-line",
      accentColor: "border-l-amber-400",
      iconBg: "bg-amber-100",
      iconColor: "text-amber-700",
      valueColor: "text-amber-700",
      note: "Accepted + Preparing",
    },
    {
      label: "Ready / Pickup",
      value: readyPickup,
      icon: "ri-checkbox-circle-line",
      accentColor: "border-l-emerald-400",
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-700",
      valueColor: "text-emerald-700",
      note: "Ready or picked up",
    },
    {
      label: "Delivering",
      value: delivering,
      icon: "ri-navigation-line",
      accentColor: "border-l-teal-400",
      iconBg: "bg-teal-100",
      iconColor: "text-teal-700",
      valueColor: "text-teal-700",
      note: "En route to rooms",
    },
    {
      label: "Completed",
      value: completed,
      icon: "ri-check-double-line",
      accentColor: "border-l-emerald-600",
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-800",
      valueColor: "text-emerald-800",
      note: "Delivered this shift",
    },
    {
      label: "Attention Needed",
      value: attention,
      icon: "ri-alarm-warning-fill",
      accentColor: "border-l-red-500",
      iconBg: "bg-red-100",
      iconColor: "text-red-600",
      valueColor: "text-red-600",
      highlight: true,
      note: "Urgent · Delayed · Reminder",
    },
  ];

  return (
    <div className="grid grid-cols-6 gap-3">
      {cards.map(c => <KPICard key={c.label} {...c} />)}
    </div>
  );
}
