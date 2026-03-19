import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAlerts } from "../../hooks/useAlerts";

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/orders": "Order Management",
};

interface TopBarProps {
  searchValue: string;
  onSearchChange: (val: string) => void;
}

export function TopBar({ searchValue, onSearchChange }: TopBarProps) {
  const location = useLocation();
  const { unresolvedCount, openPanel } = useAlerts();
  const [time, setTime] = useState(new Date());
  const title = pageTitles[location.pathname] || "Dashboard";

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const formattedTime = time.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false });
  const formattedDate = time.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });

  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center px-6 gap-4 sticky top-0 z-20">
      {/* Page Title */}
      <div className="flex-shrink-0">
        <h1 className="text-base font-bold text-gray-900">{title}</h1>
        <p className="text-xs text-gray-400">{formattedDate}</p>
      </div>

      {/* Search */}
      <div className="flex-1 max-w-md mx-4">
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center">
            <i className="ri-search-2-line text-gray-400 text-sm" />
          </div>
          <input
            type="text"
            placeholder="Search orders, rooms, guests…"
            value={searchValue}
            onChange={e => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-16 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg placeholder-gray-400 text-gray-700 focus:outline-none focus:border-emerald-400 focus:bg-white transition-colors"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-gray-400 bg-gray-200 rounded px-1.5 py-0.5 font-mono">⌘K</span>
        </div>
      </div>

      {/* Right actions */}
      <div className="ml-auto flex items-center gap-3">
        {/* Live clock */}
        <div className="text-right hidden sm:block">
          <p className="text-base font-bold text-gray-900 leading-tight font-mono">{formattedTime}</p>
          <p className="text-[10px] text-gray-400 leading-tight">Live</p>
        </div>

        <div className="w-px h-8 bg-gray-100" />

        {/* Alert bell */}
        <button
          onClick={openPanel}
          className="relative w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
        >
          <div className="w-5 h-5 flex items-center justify-center">
            <i className={`ri-notification-3-line text-lg ${unresolvedCount > 0 ? "text-red-500" : "text-gray-500"}`} />
          </div>
          {unresolvedCount > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full text-white text-[9px] font-bold flex items-center justify-center">
              {unresolvedCount}
            </span>
          )}
        </button>

        {/* Avatar */}
        <div className="w-8 h-8 flex items-center justify-center rounded-full bg-emerald-700 text-white text-xs font-bold cursor-pointer flex-shrink-0">
          NO
        </div>
      </div>
    </header>
  );
}
