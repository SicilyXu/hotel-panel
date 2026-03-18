function Navbar() {
    return (
      <div
        style={{
          height: "70px",
          background: "#ffffff",
          display: "flex",
          alignItems: "center",
          padding: "0 25px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
          justifyContent: "space-between"
        }}
      >
        <h2 style={{ margin: 0 }}>Dashboard</h2>
  
        <div style={{ display: "flex", gap: "10px" }}>
          <input
            placeholder="Search..."
            style={{
              padding: "8px 12px",
              borderRadius: "8px",
              border: "1px solid #ddd"
            }}
          />
        </div>
      </div>
    );
  }
  
  export default Navbar;