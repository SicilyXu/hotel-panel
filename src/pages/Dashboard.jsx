function Dashboard({ orders }) {
    const total = orders.length;
    const preparing = orders.filter(o => o.status === "Preparing").length;
    const ready = orders.filter(o => o.status === "Ready").length;
    const delivery = orders.filter(o => o.status === "Out for Delivery").length;
    const urgent = orders.filter(o => o.urgent).length;
  
    const cardStyle = (color) => ({
      flex: "1",
      padding: "20px",
      borderRadius: "16px",
      background: "#ffffff",
      boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
      borderLeft: `6px solid ${color}`,
      minWidth: "150px"
    });
  
    return (
      <div>
        <h2>Dashboard</h2>
  
        <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
          <div style={cardStyle("#3b82f6")}>
            <h4>Total Orders</h4>
            <h2>{total}</h2>
          </div>
  
          <div style={cardStyle("#f59e0b")}>
            <h4>Preparing</h4>
            <h2>{preparing}</h2>
          </div>
  
          <div style={cardStyle("#10b981")}>
            <h4>Ready</h4>
            <h2>{ready}</h2>
          </div>
  
          <div style={cardStyle("#8b5cf6")}>
            <h4>Out for Delivery</h4>
            <h2>{delivery}</h2>
          </div>
  
          <div style={cardStyle("#ef4444")}>
            <h4>Urgent</h4>
            <h2>{urgent}</h2>
          </div>
        </div>
      </div>
    );
  }
  
  export default Dashboard;