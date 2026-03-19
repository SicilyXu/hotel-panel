import { ActivityEvent } from "../../types/order";
import { activityFeed } from "../../mocks/orders";

const colorMap: Record<string, { dot: string }> = {
  red:     { dot: "bg-red-500" },
  emerald: { dot: "bg-emerald-500" },
  teal:    { dot: "bg-teal-500" },
  slate:   { dot: "bg-slate-400" },
  amber:   { dot: "bg-amber-400" },
};

interface ActivityFeedProps {
  events?: ActivityEvent[];
  maxItems?: number;
  title?: string;
}

export function ActivityFeed({
  events = activityFeed as ActivityEvent[],
  maxItems = 10,
  title = "Recent Activity",
}: ActivityFeedProps) {
  const visible = events.slice(0, maxItems);

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <h3 className="text-sm font-bold text-gray-900">{title}</h3>
        <span className="text-xs text-gray-400">Last 60 min</span>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="relative">
          <div className="absolute left-[6px] top-0 bottom-0 w-px bg-gray-100" />
          <div className="space-y-0">
            {visible.map(item => {
              const style = colorMap[item.color] ?? colorMap.slate;
              return (
                <div key={item.id} className="flex gap-4 items-start relative pb-4">
                  <div
                    className={`w-3 h-3 rounded-full flex-shrink-0 mt-1.5 relative z-10
                      border-2 border-white ${style.dot}`}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-gray-800 leading-relaxed">
                          {item.text}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] font-mono text-gray-400">
                            {item.orderId}
                          </span>
                          <span className="text-[10px] text-gray-300">·</span>
                          <span className="text-[10px] font-bold text-gray-500">
                            Room {item.room}
                          </span>
                        </div>
                      </div>
                      <span className="text-[10px] text-gray-400 whitespace-nowrap flex-shrink-0 mt-0.5">
                        {item.time}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
