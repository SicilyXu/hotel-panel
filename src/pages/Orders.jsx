import { useState } from "react";

function Orders({ orders, setOrders, setCurrentPage }) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [selectedOrder, setSelectedOrder] = useState(null);

  const filteredOrders = orders.filter(order => {
    const matchSearch =
      order.guestName.toLowerCase().includes(search.toLowerCase().trim()) ||
      order.roomNumber.includes(search);

    const matchStatus =
      status === "All" ||
      order.status.toLowerCase() === status.toLowerCase();

    return matchSearch && matchStatus;
  });

  const updateStatus = (id) => {
    setOrders(prev =>
      prev.map(order => {
        if (order.id !== id) return order;

        let nextStatus = order.status;

        if (order.status === "Preparing") nextStatus = "Ready";
        else if (order.status === "Ready") nextStatus = "Out for Delivery";
        else if (order.status === "Out for Delivery") nextStatus = "Delivered";

        return { ...order, status: nextStatus };
      })
    );
  };

  const getStatusStyle = (status) => {
    const base = {
      padding: "6px 14px",
      borderRadius: "999px",
      fontSize: "12px",
      fontWeight: "600",
    };

    if (status === "Preparing")
      return { ...base, background: "#fef3c7", color: "#92400e" };

    if (status === "Ready")
      return { ...base, background: "#d1fae5", color: "#065f46" };

    if (status === "Out for Delivery")
      return { ...base, background: "#e0e7ff", color: "#3730a3" };

    if (status === "Delivered")
      return { ...base, background: "#dbeafe", color: "#1e3a8a" };

    return base;
  };

  return (
    <div style={{ marginTop: "20px" }}>
      {/* 🔥 返回按钮 */}
      <button
        onClick={() => setCurrentPage("dashboard")}
        style={{
          marginBottom: "20px",
          padding: "10px 14px",
          borderRadius: "10px",
          border: "none",
          background: "#3b82f6",
          color: "#fff",
          cursor: "pointer"
        }}
      >
        ← Back to Dashboard
      </button>

      <h2 style={{ marginBottom: "15px" }}>Orders</h2>

      {/* 搜索栏 */}
      <div
        style={{
          background: "#ffffff",
          padding: "20px",
          borderRadius: "14px",
          boxShadow: "0 8px 25px rgba(0,0,0,0.06)",
          marginBottom: "25px",
          display: "flex",
          gap: "12px"
        }}
      >
        <input
          placeholder="Search guest or room..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: "12px",
            borderRadius: "10px",
            border: "1px solid #ddd"
          }}
        />

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          style={{
            padding: "12px",
            borderRadius: "10px",
            border: "1px solid #ddd"
          }}
        >
          <option value="All">All</option>
          <option value="Preparing">Preparing</option>
          <option value="Ready">Ready</option>
          <option value="Out for Delivery">Out for Delivery</option>
          <option value="Delivered">Delivered</option>
        </select>
      </div>

      {/* 空状态 */}
      {filteredOrders.length === 0 && (
        <p style={{ color: "#888" }}>No orders found</p>
      )}

      {/* 列表 */}
      {filteredOrders.map(order => (
        <div
          key={order.id}
          style={{
            background: "#ffffff",
            padding: "20px",
            borderRadius: "16px",
            marginBottom: "16px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.06)"
          }}
        >
          <strong>{order.id}</strong>
          <p>{order.guestName} • Room {order.roomNumber}</p>

          <div style={getStatusStyle(order.status)}>
            {order.status}
          </div>

          <p>Total: ${order.total}</p>
        </div>
      ))}
    </div>
  );
}

export default Orders;