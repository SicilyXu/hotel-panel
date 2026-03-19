import { useAlerts } from "../../../hooks/useAlerts";
import { AlertTypeBadge } from "../../../components/base/Badge";
import { Button } from "../../../components/base/Button";

export function RecentAlerts() {
  const { alerts, openPanel } = useAlerts();
  const unresolved = alerts.filter(a => !a.resolved).slice(0, 4);

  return (
    <div className="bg-red-50/50 rounded-xl border border-red-100 p-5 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 flex items-center justify-center">
            <i className="ri-alarm-warning-fill text-red-500 text-lg" />
          </div>
          <h3 className="text-sm font-bold text-red-800">Urgent Attention</h3>
          {unresolved.length > 0 && (
            <span className="text-xs font-bold text-white bg-red-500 rounded-full w-5 h-5 flex items-center justify-center">
              {unresolved.length}
            </span>
          )}
        </div>
        <button
          onClick={openPanel}
          className="text-xs text-red-600 hover:text-red-800 font-semibold cursor-pointer transition-colors"
        >
          View all
        </button>
      </div>

      <div className="space-y-3 flex-1">
        {unresolved.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 text-center">
            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-emerald-100 mb-2">
              <i className="ri-check-double-line text-emerald-600 text-lg" />
            </div>
            <p className="text-xs font-semibold text-gray-600">All clear!</p>
            <p className="text-xs text-gray-400 mt-0.5">No active alerts right now.</p>
          </div>
        ) : (
          unresolved.map(alert => (
            <div key={alert.id} className="bg-white rounded-lg border-l-4 border-red-500 border border-red-100 p-3">
              <div className="flex items-start gap-2 mb-1.5">
                <span className="text-xl font-black text-gray-900 font-mono leading-none flex-shrink-0">
                  {alert.roomNumber}
                </span>
                <div className="flex-1 min-w-0 flex items-center gap-2 flex-wrap">
                  <AlertTypeBadge type={alert.type} />
                  <span className="text-xs font-bold text-red-500">{alert.elapsed} ago</span>
                </div>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed line-clamp-2">{alert.message}</p>
            </div>
          ))
        )}
      </div>

      <Button
        variant="danger"
        size="sm"
        fullWidth
        icon="ri-alarm-warning-line"
        onClick={openPanel}
        className="mt-4 justify-center"
      >
        Open Alerts Panel
      </Button>
    </div>
  );
}
