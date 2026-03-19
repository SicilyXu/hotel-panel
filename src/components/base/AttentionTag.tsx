import { AttentionTagType } from "../../types/order";

interface AttentionTagProps {
  type: AttentionTagType;
  size?: "sm" | "md";
}

const tagConfig: Record<
  AttentionTagType,
  { label: string; icon: string; classes: string }
> = {
  vip: {
    label: "VIP",
    icon: "ri-vip-crown-fill",
    classes: "bg-yellow-100 text-yellow-800 border border-yellow-300",
  },
  allergy: {
    label: "Allergy",
    icon: "ri-alert-fill",
    classes: "bg-red-100 text-red-700 border border-red-300",
  },
  medical: {
    label: "Medical",
    icon: "ri-heart-pulse-line",
    classes: "bg-rose-100 text-rose-700 border border-rose-300",
  },
  special_occasion: {
    label: "Special",
    icon: "ri-gift-line",
    classes: "bg-purple-100 text-purple-700 border border-purple-300",
  },
  complaint: {
    label: "Complaint",
    icon: "ri-emotion-sad-line",
    classes: "bg-orange-100 text-orange-700 border border-orange-300",
  },
  express: {
    label: "Express",
    icon: "ri-flashlight-line",
    classes: "bg-teal-100 text-teal-700 border border-teal-300",
  },
  do_not_disturb: {
    label: "DND",
    icon: "ri-forbid-line",
    classes: "bg-gray-100 text-gray-600 border border-gray-300",
  },
};

export function AttentionTag({ type, size = "md" }: AttentionTagProps) {
  const config = tagConfig[type];
  const sizeClasses =
    size === "sm"
      ? "text-[10px] px-1.5 py-0.5 gap-1"
      : "text-xs px-2 py-0.5 gap-1.5";

  return (
    <span
      className={`inline-flex items-center rounded-full font-semibold whitespace-nowrap ${sizeClasses} ${config.classes}`}
    >
      <i className={`${config.icon} leading-none`} />
      {config.label}
    </span>
  );
}

interface AttentionTagListProps {
  tags: AttentionTagType[];
  max?: number;
  size?: "sm" | "md";
}

export function AttentionTagList({
  tags,
  max = 3,
  size = "sm",
}: AttentionTagListProps) {
  if (!tags || tags.length === 0) return null;
  const visible = tags.slice(0, max);
  const overflow = tags.length - max;

  return (
    <div className="flex items-center gap-1 flex-wrap">
      {visible.map(tag => (
        <AttentionTag key={tag} type={tag} size={size} />
      ))}
      {overflow > 0 && (
        <span className="text-[10px] text-gray-400 font-medium">
          +{overflow}
        </span>
      )}
    </div>
  );
}
