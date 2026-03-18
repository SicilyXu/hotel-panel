import { useState } from "react";
import Dashboard from "./pages/Dashboard";
import Orders from "./pages/Orders";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import { orders as initialOrders } from "./data/orders";

function App() {
  const [orderList, setOrderList] = useState(initialOrders);
  const [currentPage, setCurrentPage] = useState("orders");

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      
      {/* 左侧 Sidebar */}
      <Sidebar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />

      {/* 右侧整体 */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        
        {/* 顶部 Navbar */}
        <Navbar />

        {/* 页面内容 */}
        <div
          style={{
            flex: 1,
            padding: "30px",
            background: "#f5f7fb",
            overflow: "auto"
          }}
        >
          {currentPage === "dashboard" && (
            <Dashboard orders={orderList} />
          )}

          {currentPage === "orders" && (
            <Orders
              orders={orderList}
              setOrders={setOrderList}
              setCurrentPage={setCurrentPage}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;