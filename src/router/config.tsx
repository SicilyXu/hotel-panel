import type { RouteObject } from "react-router-dom";
import { Navigate } from "react-router-dom";
import NotFound from "../pages/NotFound";
import DashboardPage from "../pages/dashboard/page";
import OrdersPage from "../pages/orders/page";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <Navigate to="/dashboard" replace />,
  },
  {
    path: "/dashboard",
    element: <DashboardPage />,
  },
  {
    path: "/orders",
    element: <OrdersPage />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
];

export default routes;
