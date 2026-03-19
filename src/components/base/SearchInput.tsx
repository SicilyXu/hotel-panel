import { InputHTMLAttributes, useRef } from "react";

interface SearchInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  value: string;
  onChange: (val: string) => void;
  onClear?: () => void;
  fullWidth?: boolean;
}

export function SearchInput({
  value,
  onChange,
  onClear,
  fullWidth = false,
  placeholder = "Search…",
  className = "",
  ...props
}: SearchInputProps) {
  const ref = useRef<HTMLInputElement>(null);

  return (
    <div className={`relative ${fullWidth ? "w-full" : "w-auto"} ${className}`}>
      <div className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center pointer-events-none">
        <i className="ri-search-2-line text-gray-400 text-sm" />
      </div>
      <input
        ref={ref}
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-9 pr-8 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg
          placeholder-gray-400 text-gray-700
          focus:outline-none focus:border-emerald-400 focus:bg-white
          transition-colors"
        {...props}
      />
      {value && (
        <button
          type="button"
          onClick={() => {
            onChange("");
            onClear?.();
            ref.current?.focus();
          }}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center
            text-gray-400 hover:text-gray-600 cursor-pointer transition-colors"
        >
          <i className="ri-close-line text-sm" />
        </button>
      )}
    </div>
  );
}
