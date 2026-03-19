import { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
  icon?: string;
  iconRight?: string;
  children?: ReactNode;
  fullWidth?: boolean;
}

const variantClasses: Record<string, string> = {
  primary: "bg-emerald-600 text-white hover:bg-emerald-700 active:scale-[0.98]",
  secondary: "bg-slate-800 text-white hover:bg-slate-900 active:scale-[0.98]",
  danger: "bg-red-600 text-white hover:bg-red-700 active:scale-[0.98]",
  ghost: "bg-transparent text-slate-600 hover:bg-slate-100 active:scale-[0.98]",
  outline: "bg-transparent border border-slate-300 text-slate-700 hover:bg-slate-50 active:scale-[0.98]",
};

const sizeClasses: Record<string, string> = {
  sm: "text-xs px-3 py-1.5 rounded-md gap-1.5",
  md: "text-sm px-4 py-2 rounded-md gap-2",
  lg: "text-sm px-5 py-2.5 rounded-md gap-2",
};

export function Button({
  variant = "primary",
  size = "md",
  icon,
  iconRight,
  children,
  fullWidth = false,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center whitespace-nowrap font-medium transition-all cursor-pointer select-none
        ${variantClasses[variant]} ${sizeClasses[size]}
        ${fullWidth ? "w-full" : ""}
        ${disabled ? "opacity-50 cursor-not-allowed pointer-events-none" : ""}
        ${className}`}
      disabled={disabled}
      {...props}
    >
      {icon && <i className={`${icon} text-base leading-none`} />}
      {children}
      {iconRight && <i className={`${iconRight} text-base leading-none`} />}
    </button>
  );
}
