import { MetricData } from "../../types/order";

interface MetricsCardProps extends MetricData {
  onClick?: () => void;
}

export function MetricsCard({
  label,
  value,
  icon,
  trend,
  trendUp,
  accentClass,
  iconBgClass,
  onClick,
}: MetricsCardProps) {
  return (
    <div
      className={`bg-white rounded-xl border border-gray-100 p-5 flex items-start justify-between
        ${onClick ? "cursor-pointer hover:border-gray-200 transition-colors" : ""}`}
      onClick={onClick}
    >
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
          {label}
        </p>
        <p className={`text-3xl font-black leading-none ${accentClass}`}>
          {value}
        </p>
        {trend && (
          <p
            className={`text-xs mt-2 font-medium ${trendUp ? "text-emerald-600" : "text-red-500"}`}
          >
            <i
              className={trendUp ? "ri-arrow-up-line" : "ri-arrow-down-line"}
            />
            {" "}
            {trend}
          </p>
        )}
      </div>
      <div
        className={`w-10 h-10 flex items-center justify-center rounded-xl flex-shrink-0 ${iconBgClass}`}
      >
        <i className={`${icon} text-xl`} />
      </div>
    </div>
  );
}
