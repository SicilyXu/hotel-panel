import { useOrders } from "../../../context/OrdersContext";
import { useNavigate } from "react-router-dom";
import { Order } from "../../../types/order";
import { StatusBadge } from "../../../components/base/Badge";
import { RatingStars } from "../../../components/base/RatingStars";

function formatTime(iso: string): string {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (diff < 1) return "just now";
  if (diff < 60) return `${diff}m ago`;
  return `${Math.floor(diff / 60)}h ${diff % 60}m ago`;
}

interface OrderRowProps {
  order: Order;
  onClick: () => void;
  showRating?: boolean;
}

function OrderRow({ order, onClick, showRating }: OrderRowProps) {
  return (
    <div
      onClick={onClick}
      className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 cursor-pointer transition-colors"
    >
      <span className="text-lg font-black font-mono text-gray-900 w-12 flex-shrink-0 leading-none">
        {order.roomNumber}
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-gray-800 truncate">{order.guestName}</p>
        <p className="text-[10px] text-gray-400 font-mono truncate">{order.id}</p>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        {showRating && order.rating ? (
          <RatingStars score={order.rating} size="sm" showValue={false} />
        ) : (
          <StatusBadge status={order.status} size="sm" />
        )}
        <span className="text-[10px] text-gray-400 whitespace-nowrap">{formatTime(order.createdAt)}</span>
      </div>
    </div>
  );
}

interface PanelProps {
  title: string;
  icon: string;
  accent: string;
  orders: Order[];
  showRating?: boolean;
  onOrderClick: (o: Order) => void;
  emptyText: string;
}

function Panel({ title, icon, accent, orders, showRating, onOrderClick, emptyText }: PanelProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden flex flex-col">
      <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2 flex-shrink-0">
        <div className={`w-5 h-5 flex items-center justify-center ${accent}`}>
          <i className={`${icon} text-sm`} />
        </div>
        <h3 className="text-sm font-bold text-gray-900">{title}</h3>
        <span className="ml-auto text-xs font-bold text-gray-400">{orders.length}</span>
      </div>
      {orders.length === 0 ? (
        <div className="flex items-center justify-center h-24">
          <p className="text-xs text-gray-400 italic">{emptyText}</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-50">
          {orders.map(o => (
            <OrderRow key={o.id} order={o} onClick={() => onOrderClick(o)} showRating={showRating} />
          ))}
        </div>
      )}
    </div>
  );
}

export function RecentActivity() {
  const { orders, selectOrder } = useOrders();
  const navigate = useNavigate();

  const handleClick = (o: Order) => {
    navigate("/orders");
    selectOrder(o);
  };

  // Latest 5 non-terminal orders, sorted newest first
  const latest = [...orders]
    .filter(o => !["Delivered","Cancelled"].includes(o.status))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 6);

  // Last 6 delivered, sorted newest first
  const completed = [...orders]
    .filter(o => o.status === "Delivered")
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 6);

  return (
    <div className="grid grid-cols-2 gap-4">
      <Panel
        title="Latest Orders"
        icon="ri-file-list-3-line"
        accent="text-slate-600"
        orders={latest}
        onOrderClick={handleClick}
        emptyText="No active orders"
      />
      <Panel
        title="Recent Completions"
        icon="ri-check-double-line"
        accent="text-emerald-600"
        orders={completed}
        showRating
        onOrderClick={handleClick}
        emptyText="No completed orders yet"
      />
    </div>
  );
}
