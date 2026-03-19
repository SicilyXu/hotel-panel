import { OrderStatus } from "../../../../types/order";

const STEPS: { status: OrderStatus; shortLabel: string; icon: string }[] = [
  { status: "Placed",     shortLabel: "Placed",    icon: "ri-file-add-line" },
  { status: "Accepted",   shortLabel: "Accepted",  icon: "ri-thumb-up-line" },
  { status: "Preparing",  shortLabel: "Preparing", icon: "ri-restaurant-line" },
  { status: "Ready",      shortLabel: "Ready",     icon: "ri-checkbox-circle-line" },
  { status: "PickedUp",   shortLabel: "Picked Up", icon: "ri-shopping-bag-line" },
  { status: "Delivering", shortLabel: "Delivering",icon: "ri-navigation-line" },
  { status: "Delivered",  shortLabel: "Delivered", icon: "ri-check-double-line" },
];

const STATUS_INDEX: Record<OrderStatus, number> = {
  Placed:     0,
  Accepted:   1,
  Preparing:  2,
  Ready:      3,
  PickedUp:   4,
  Delivering: 5,
  Delivered:  6,
  Cancelled: -1,
};

interface StatusStepperProps {
  currentStatus: OrderStatus;
  onStepClick: (status: OrderStatus) => void;
}

export function StatusStepper({ currentStatus, onStepClick }: StatusStepperProps) {
  const currentIdx = STATUS_INDEX[currentStatus] ?? -1;
  const isCancelled = currentStatus === "Cancelled";

  if (isCancelled) {
    return (
      <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl border border-gray-200">
        <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 flex-shrink-0">
          <i className="ri-close-line text-gray-500 text-base" />
        </div>
        <div>
          <p className="text-sm font-bold text-gray-500">Order Cancelled</p>
          <p className="text-xs text-gray-400">This order has been cancelled and is no longer active.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Step dots + connecting lines */}
      <div className="flex items-center w-full">
        {STEPS.map((step, idx) => {
          const isDone    = idx < currentIdx;
          const isCurrent = idx === currentIdx;
          const isPending = idx > currentIdx;

          return (
            <div key={step.status} className="flex items-center flex-1 last:flex-none">
              {/* Node */}
              <button
                onClick={() => !isCurrent && onStepClick(step.status)}
                title={`Set to ${step.status}`}
                className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer
                  border-2 group relative
                  ${isDone    ? "bg-emerald-500 border-emerald-400 hover:bg-emerald-600"                : ""}
                  ${isCurrent ? "bg-white border-teal-500 ring-4 ring-teal-100 shadow-sm cursor-default" : ""}
                  ${isPending ? "bg-white border-gray-200 hover:border-gray-400"                         : ""}
                `}
              >
                {isDone && <i className="ri-check-line text-white text-xs font-bold" />}
                {isCurrent && <span className="w-2.5 h-2.5 rounded-full bg-teal-500 animate-pulse block" />}
                {isPending && (
                  <span className="text-[10px] font-bold text-gray-300 group-hover:text-gray-500 transition-colors">
                    {idx + 1}
                  </span>
                )}
              </button>

              {/* Connector line (all except last) */}
              {idx < STEPS.length - 1 && (
                <div className={`flex-1 h-0.5 mx-0.5 ${isDone ? "bg-emerald-300" : "bg-gray-200"}`} />
              )}
            </div>
          );
        })}
      </div>

      {/* Step labels */}
      <div className="flex items-start w-full mt-1.5">
        {STEPS.map((step, idx) => {
          const isDone    = idx < currentIdx;
          const isCurrent = idx === currentIdx;

          return (
            <div key={step.status} className="flex-1 last:flex-none flex justify-center">
              <span className={`text-[9px] font-semibold leading-tight text-center block max-w-[44px] truncate
                ${isDone    ? "text-emerald-600" : ""}
                ${isCurrent ? "text-teal-700 font-black" : ""}
                ${!isDone && !isCurrent ? "text-gray-400" : ""}
              `}>
                {step.shortLabel}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
