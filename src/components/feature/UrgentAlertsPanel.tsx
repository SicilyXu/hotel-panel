import { useAlerts } from "../../hooks/useAlerts";
import { AlertTypeBadge } from "../base/Badge";
import { Button } from "../base/Button";

export function UrgentAlertsPanel() {
  const { alerts, isOpen, closePanel, resolveAlert } = useAlerts();
  const unresolved = alerts.filter(a => !a.resolved);
  const resolved = alerts.filter(a => a.resolved);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/20 z-40 backdrop-blur-[1px]"
        onClick={closePanel}
      />

      {/* Panel */}
      <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-2xl z-50 flex flex-col">
        {/* Header */}
        <div className="bg-red-600 px-5 py-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-5 h-5 flex items-center justify-center">
              <i className="ri-alarm-warning-fill text-white text-lg" />
            </div>
            <div>
              <h2 className="text-white font-bold text-sm">Urgent Alerts</h2>
              <p className="text-red-200 text-xs">{unresolved.length} require attention</p>
            </div>
          </div>
          <button
            onClick={closePanel}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-700 hover:bg-red-800 text-white cursor-pointer transition-colors"
          >
            <i className="ri-close-line text-lg" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {unresolved.length > 0 ? (
            <div className="p-4 space-y-3">
              {unresolved.map(alert => (
                <div key={alert.id} className="bg-white rounded-xl border border-red-100 shadow-sm overflow-hidden">
                  <div className="border-l-4 border-red-500 p-4">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-black text-gray-900 font-mono leading-none">
                          {alert.roomNumber}
                        </span>
                        <div>
                          <p className="text-xs text-gray-500 font-medium">Room</p>
                          <p className="text-[10px] text-gray-400 font-mono">{alert.orderId}</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1 flex-shrink-0">
                        <AlertTypeBadge type={alert.type} />
                        <span className="text-xs font-bold text-red-600">{alert.elapsed} ago</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed mb-3">{alert.message}</p>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="danger"
                        size="sm"
                        icon="ri-check-line"
                        onClick={() => resolveAlert(alert.id)}
                        className="flex-1 justify-center"
                      >
                        Resolve
                      </Button>
                      <Button variant="outline" size="sm" icon="ri-eye-line">
                        View Order
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-48 text-center p-8">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-emerald-100 mb-3">
                <i className="ri-check-double-line text-emerald-600 text-xl" />
              </div>
              <p className="text-sm font-semibold text-gray-700">All clear!</p>
              <p className="text-xs text-gray-400 mt-1">No active alerts at this time.</p>
            </div>
          )}

          {/* Resolved section */}
          {resolved.length > 0 && (
            <div className="border-t border-gray-100 p-4">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Resolved</p>
              <div className="space-y-2">
                {resolved.map(alert => (
                  <div key={alert.id} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 opacity-60">
                    <div className="w-4 h-4 flex items-center justify-center">
                      <i className="ri-check-line text-emerald-500 text-sm" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-gray-600">Room {alert.roomNumber}</p>
                      <p className="text-xs text-gray-400 truncate">{alert.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 p-4 flex-shrink-0">
          <button
            onClick={() => alerts.forEach(a => !a.resolved && resolveAlert(a.id))}
            className="w-full text-xs text-gray-500 hover:text-gray-700 underline cursor-pointer transition-colors text-center"
          >
            Mark all as resolved
          </button>
        </div>
      </div>
    </>
  );
}
