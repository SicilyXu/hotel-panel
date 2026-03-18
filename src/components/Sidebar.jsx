function Sidebar({ currentPage, setCurrentPage }) {
    const container = {
      width: "240px",
      height: "100vh",
      background: "linear-gradient(180deg, #111827, #1f2937)",
      color: "#fff",
      padding: "25px 20px",
      display: "flex",
      flexDirection: "column",
      boxShadow: "4px 0 20px rgba(0,0,0,0.2)"
    };
  
    const titleStyle = {
      fontSize: "20px",
      fontWeight: "bold",
      marginBottom: "30px",
      letterSpacing: "1px"
    };
  
    const item = (active) => ({
      padding: "12px 16px",
      borderRadius: "12px",
      cursor: "pointer",
      marginBottom: "10px",
      background: active
        ? "linear-gradient(135deg, #3b82f6, #6366f1)"
        : "transparent",
      color: active ? "#fff" : "#cbd5f5",
      display: "flex",
      alignItems: "center",
      gap: "10px",
      transition: "all 0.25s ease",
      transform: active ? "scale(1.02)" : "scale(1)"
    });
  
    return (
      <div style={container}>
        <div style={titleStyle}>🏨 Hotel Panel</div>
  
        <div
          style={item(currentPage === "dashboard")}
          onClick={() => setCurrentPage("dashboard")}
          onMouseEnter={(e) => {
            if (currentPage !== "dashboard") {
              e.currentTarget.style.background = "#374151";
            }
          }}
          onMouseLeave={(e) => {
            if (currentPage !== "dashboard") {
              e.currentTarget.style.background = "transparent";
            }
          }}
        >
          📊 Dashboard
        </div>
  
        <div
          style={item(currentPage === "orders")}
          onClick={() => setCurrentPage("orders")}
          onMouseEnter={(e) => {
            if (currentPage !== "orders") {
              e.currentTarget.style.background = "#374151";
            }
          }}
          onMouseLeave={(e) => {
            if (currentPage !== "orders") {
              e.currentTarget.style.background = "transparent";
            }
          }}
        >
          📦 Orders
        </div>
      </div>
    );
  }
  
  export default Sidebar;