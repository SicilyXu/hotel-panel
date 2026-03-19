interface RatingStarsProps {
  score: number;        // 1–5, supports .5 steps
  showValue?: boolean;
  size?: "sm" | "md" | "lg";
  comment?: string;
}

const sizeMap = {
  sm: "text-xs",
  md: "text-sm",
  lg: "text-base",
};

export function RatingStars({
  score,
  showValue = true,
  size = "sm",
  comment,
}: RatingStarsProps) {
  const clamped = Math.min(5, Math.max(0, score));

  return (
    <div className="flex flex-col gap-0.5">
      <div className="flex items-center gap-1">
        <div className={`flex items-center gap-0.5 ${sizeMap[size]}`}>
          {[1, 2, 3, 4, 5].map(star => {
            const filled = clamped >= star;
            const half = !filled && clamped >= star - 0.5;
            return (
              <span key={star} className={filled ? "text-amber-400" : half ? "text-amber-300" : "text-gray-200"}>
                <i className={filled ? "ri-star-fill" : half ? "ri-star-half-fill" : "ri-star-line"} />
              </span>
            );
          })}
        </div>
        {showValue && (
          <span className="text-xs font-bold text-gray-700 leading-none">
            {clamped.toFixed(1)}
          </span>
        )}
      </div>
      {comment && (
        <p className="text-[10px] text-gray-500 italic leading-relaxed">
          &quot;{comment}&quot;
        </p>
      )}
    </div>
  );
}
