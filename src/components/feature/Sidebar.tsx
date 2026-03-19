import { NavLink } from "react-router-dom";
import { useAlerts } from "../../hooks/useAlerts";

const navItems = [
  { path: "/dashboard", label: "Dashboard", icon: "ri-dashboard-3-line" },
  { path: "/orders", label: "Orders", icon: "ri-file-list-3-line" },
];

const bottomItems = [
  { label: "Settings", icon: "ri-settings-4-line" },
  { label: "Reports", icon: "ri-bar-chart-2-line" },
];

export function Sidebar() {
  const { unresolvedCount, openPanel } = useAlerts();

  return (
    <aside className="w-60 bg-gray-950 text-white flex flex-col h-screen fixed left-0 top-0 z-30 select-none">
      {/* Brand */}
      <div className="h-16 flex items-center px-5 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-emerald-500">
            <i className="ri-restaurant-2-line text-white text-base" />
          </div>
          <div>
            <p className="text-sm font-bold text-white leading-tight tracking-tight">Grand Azure</p>
            <p className="text-[10px] text-gray-500 leading-tight">F&amp;B Operations Panel</p>
          </div>
        </div>
      </div>

      {/* Main Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        <p className="text-[10px] font-semibold text-gray-600 uppercase tracking-widest px-2 mb-2">Operations</p>

        {navItems.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 h-11 rounded-lg text-sm font-medium transition-all cursor-pointer group
               ${isActive
                ? "bg-white/10 text-white border-l-4 border-emerald-400 pl-2"
                : "text-gray-400 hover:bg-white/5 hover:text-white border-l-4 border-transparent pl-2"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className="w-5 h-5 flex items-center justify-center">
                  <i className={`${item.icon} text-base ${isActive ? "text-emerald-400" : "text-gray-500 group-hover:text-gray-300"}`} />
                </div>
                {item.label}
              </>
            )}
          </NavLink>
        ))}

        {/* Urgent Alerts button */}
        <button
          onClick={openPanel}
          className="w-full flex items-center gap-3 px-3 h-11 rounded-lg text-sm font-medium text-gray-400 hover:bg-white/5 hover:text-white border-l-4 border-transparent pl-2 transition-all cursor-pointer group"
        >
          <div className="w-5 h-5 flex items-center justify-center relative">
            <i className={`ri-alarm-warning-line text-base ${unresolvedCount > 0 ? "text-red-400" : "text-gray-500 group-hover:text-gray-300"}`} />
          </div>
          <span className={unresolvedCount > 0 ? "text-red-300" : ""}>Alerts</span>
          {unresolvedCount > 0 && (
            <span className="ml-auto flex items-center justify-center w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold">
              {unresolvedCount}
            </span>
          )}
        </button>

        <div className="border-t border-white/5 mt-4 pt-4">
          <p className="text-[10px] font-semibold text-gray-600 uppercase tracking-widest px-2 mb-2">More</p>
          {bottomItems.map(item => (
            <button
              key={item.label}
              className="w-full flex items-center gap-3 px-3 h-11 rounded-lg text-sm font-medium text-gray-500 hover:bg-white/5 hover:text-gray-300 border-l-4 border-transparent pl-2 transition-all cursor-pointer"
            >
              <div className="w-5 h-5 flex items-center justify-center">
                <i className={`${item.icon} text-base`} />
              </div>
              {item.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Staff Profile */}
      <div className="border-t border-white/5 p-4">
        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="w-8 h-8 flex items-center justify-center rounded-full bg-emerald-700 text-white text-xs font-bold flex-shrink-0">
            NO
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-300 truncate">Nina Osei</p>
            <p className="text-xs text-gray-600 truncate">F&amp;B Supervisor</p>
          </div>
          <div className="w-5 h-5 flex items-center justify-center">
            <i className="ri-logout-box-r-line text-gray-600 group-hover:text-gray-400 text-base" />
          </div>
        </div>
      </div>
    </aside>
  );
}
