import { TimelineEvent, OrderStatus } from "../../../mocks/orders";

const statusStyles: Record<OrderStatus, { dot: string; line: string }> = {
  new: { dot: "bg-slate-400 border-slate-300", line: "bg-slate-200" },
  pending: { dot: "bg-amber-400 border-amber-300", line: "bg-amber-200" },
  in_progress: { dot: "bg-teal-500 border-teal-300", line: "bg-teal-200" },
  completed: { dot: "bg-emerald-500 border-emerald-300", line: "bg-emerald-200" },
  urgent: { dot: "bg-red-500 border-red-300", line: "bg-red-200" },
  cancelled: { dot: "bg-gray-400 border-gray-300", line: "bg-gray-200" },
};

interface StatusTimelineProps {
  events: TimelineEvent[];
}

export function StatusTimeline({ events }: StatusTimelineProps) {
  return (
    <div className="relative">
      {events.map((event, idx) => {
        const style = statusStyles[event.status] || statusStyles.new;
        const isLast = idx === events.length - 1;
        const isCurrent = !event.completed && idx === events.findIndex(e => !e.completed);

        return (
          <div key={event.id} className="flex gap-3 relative">
            {/* Dot + line */}
            <div className="flex flex-col items-center">
              <div className={`relative w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 z-10
                ${event.completed
                  ? style.dot
                  : isCurrent
                    ? "bg-white border-teal-400 ring-2 ring-teal-200"
                    : "bg-white border-gray-300"
                }`}
              >
                {event.completed && (
                  <i className="ri-check-line text-white text-[10px] font-bold" />
                )}
                {isCurrent && (
                  <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse block" />
                )}
              </div>
              {!isLast && (
                <div className={`w-0.5 flex-1 mt-0.5 min-h-[24px] ${event.completed ? style.line : "bg-gray-100"}`} />
              )}
            </div>

            {/* Content */}
            <div className={`pb-5 flex-1 min-w-0 ${isLast ? "pb-0" : ""}`}>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className={`text-xs font-semibold leading-none mb-1
                    ${event.completed ? "text-gray-700" : isCurrent ? "text-teal-700" : "text-gray-400"}`}>
                    {event.label}
                    {isCurrent && (
                      <span className="ml-2 text-[10px] bg-teal-100 text-teal-700 px-1.5 py-0.5 rounded-full font-bold">Current</span>
                    )}
                  </p>
                  {event.completedBy && (
                    <p className="text-[10px] text-gray-400">{event.completedBy}</p>
                  )}
                </div>
                {event.timestamp && event.completed && (
                  <span className="text-[10px] text-gray-400 font-mono flex-shrink-0">{event.timestamp}</span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
