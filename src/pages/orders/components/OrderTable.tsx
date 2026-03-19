import { useState } from "react";
import { Order, OrderStatus, SortOption } from "../../../types/order";
import { StatusBadge } from "../../../components/base/Badge";
import { RatingStars } from "../../../components/base/RatingStars";

interface OrderTableProps {
  orders: Order[];
  selectedId: string | null;
  onSelect: (order: Order) => void;
  sortBy: SortOption;
  sortDir: "asc" | "desc";
  onSortChange: (s: SortOption, dir: "asc" | "desc") => void;
  onSortReset: () => void;
}

// ─── Helpers ───────────────────────────────────────────────────────────────

function timeAgo(iso: string): string {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (diff < 1)  return "just now";
  if (diff < 60) return `${diff}m ago`;
  const h = Math.floor(diff / 60);
  const m = diff % 60;
  return m > 0 ? `${h}h ${m}m ago` : `${h}h ago`;
}

function fmtAmount(n: number): string {
  return n === 0 ? "—" : `$${n.toFixed(2)}`;
}

// ─── Attention cell ────────────────────────────────────────────────────────

function AttentionCell({ isUrgent, isDelayed, hasReminder }: { isUrgent: boolean; isDelayed: boolean; hasReminder: boolean }) {
  if (isUrgent) {
    return (
      <div className="flex items-center gap-1.5">
        <span className="relative flex w-2.5 h-2.5 flex-shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
          <span className="relative inline-flex rounded-full w-2.5 h-2.5 bg-red-500" />
        </span>
        <span className="text-[10px] font-black text-red-600 uppercase tracking-widest whitespace-nowrap">Urgent</span>
      </div>
    );
  }
  if (isDelayed) {
    return (
      <div className="flex items-center gap-1.5">
        <div className="w-4 h-4 flex items-center justify-center flex-shrink-0">
          <i className="ri-time-line text-amber-500 text-xs" />
        </div>
        <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest whitespace-nowrap">Delayed</span>
      </div>
    );
  }
  if (hasReminder) {
    return (
      <div className="flex items-center gap-1.5">
        <div className="w-4 h-4 flex items-center justify-center flex-shrink-0">
          <i className="ri-notification-3-line text-teal-500 text-xs" />
        </div>
        <span className="text-[10px] font-black text-teal-600 uppercase tracking-widest whitespace-nowrap">Reminder</span>
      </div>
    );
  }
  return <span className="w-2.5 h-2.5 rounded-full bg-gray-200 inline-block" />;
}

// ─── Sortable column header ────────────────────────────────────────────────

interface SortHeaderProps {
  label: string;
  sortKey: SortOption;
  current: SortOption;
  sortDir: "asc" | "desc";
  onSort: (s: SortOption, dir: "asc" | "desc") => void;
  onReset: () => void;
}

function SortHeader({ label, sortKey, current, sortDir, onSort, onReset }: SortHeaderProps) {
  const active = current === sortKey;

  const handleClick = () => {
    if (!active)              onSort(sortKey, "desc");       // 1st click → desc
    else if (sortDir === "desc") onSort(sortKey, "asc");     // 2nd click → asc
    else                      onReset();                     // 3rd click → reset
  };

  const icon = !active
    ? "ri-arrow-up-down-line"
    : sortDir === "desc"
      ? "ri-arrow-down-s-line"
      : "ri-arrow-up-s-line";

  return (
    <button
      onClick={handleClick}
      className={`flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider cursor-pointer whitespace-nowrap group transition-colors
        ${active ? "text-gray-900" : "text-gray-400 hover:text-gray-600"}`}
    >
      {label}
      <i className={`text-[10px] transition-colors
        ${active ? `${icon} text-gray-700` : `${icon} text-gray-300 group-hover:text-gray-500`}`}
      />
    </button>
  );
}

// ─── Row highlight classes ─────────────────────────────────────────────────

function rowClass(order: Order, isSelected: boolean): string {
  if (isSelected)       return "border-l-[3px] border-teal-500 bg-teal-50/80";
  if (order.isUrgent)   return "border-l-[3px] border-red-500 bg-red-50/50 hover:bg-red-50/80";
  if (order.isDelayed)  return "border-l-[3px] border-amber-400 bg-amber-50/40 hover:bg-amber-50/70";
  if (order.hasReminder) return "border-l-[3px] border-teal-300 bg-teal-50/30 hover:bg-teal-50/50";
  if (order.status === "Cancelled") return "border-l-[3px] border-transparent opacity-50 hover:opacity-70";
  if (order.status === "Delivered") return "border-l-[3px] border-transparent bg-white hover:bg-gray-50/80";
  return "border-l-[3px] border-transparent bg-white hover:bg-gray-50/80";
}

// ─── Main Table ────────────────────────────────────────────────────────────

export function OrderTable({ orders, selectedId, onSelect, sortBy, sortDir, onSortChange, onSortReset }: OrderTableProps) {
  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-14 h-14 flex items-center justify-center rounded-full bg-gray-100 mb-4">
          <i className="ri-file-search-line text-gray-400 text-2xl" />
        </div>
        <p className="text-sm font-bold text-gray-600">No orders match your filters</p>
        <p className="text-xs text-gray-400 mt-1">Try changing the status filter or search query</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        {/* ── Header ───────────────────────────────────────── */}
        <thead>
          <tr className="bg-gray-50/80 border-b border-gray-100">
            {/* Attention */}
            <th className="w-28 px-4 py-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              Attention
            </th>

            {/* Room + Guest */}
            <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              Room / Guest
            </th>

            {/* Order ID */}
            <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              Order ID
            </th>

            {/* Total */}
            <th className="px-4 py-3 text-left">
              <SortHeader label="Total" sortKey="amount" current={sortBy} sortDir={sortDir} onSort={onSortChange} onReset={onSortReset} />
            </th>

            {/* Time */}
            <th className="px-4 py-3 text-left">
              <SortHeader label="Created" sortKey="latest" current={sortBy} sortDir={sortDir} onSort={onSortChange} onReset={onSortReset} />
            </th>

            {/* Status */}
            <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              Status
            </th>

            {/* Rating */}
            <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              Rating
            </th>

            {/* Action */}
            <th className="w-10 px-3 py-3" />
          </tr>
        </thead>

        {/* ── Body ─────────────────────────────────────────── */}
        <tbody>
          {orders.map((order, idx) => {
            const isSelected = order.id === selectedId;
            const isEven = idx % 2 === 0;

            return (
              <tr
                key={order.id}
                onClick={() => onSelect(order)}
                className={`cursor-pointer transition-all duration-100 group
                  ${rowClass(order, isSelected)}
                  ${!isSelected && !order.isUrgent && !order.isDelayed && isEven ? "bg-gray-50/30" : ""}
                `}
              >
                {/* ── Attention ──────────────────────────────── */}
                <td className="px-4 py-3.5">
                  <AttentionCell isUrgent={order.isUrgent} isDelayed={order.isDelayed} hasReminder={order.hasReminder} />
                </td>

                {/* ── Room + Guest ───────────────────────────── */}
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-black font-mono text-gray-900 leading-none w-14 flex-shrink-0">
                      {order.roomNumber}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-800 truncate max-w-[160px]">
                        {order.guestName}
                      </p>
                      {order.items.length > 0 && (
                        <p className="text-[10px] text-gray-400 truncate max-w-[160px]">
                          {order.items[0].name}
                          {order.items.length > 1 && ` +${order.items.length - 1}`}
                        </p>
                      )}
                    </div>
                  </div>
                </td>

                {/* ── Order ID ───────────────────────────────── */}
                <td className="px-4 py-3.5">
                  <span className="text-xs font-mono text-gray-400 whitespace-nowrap">{order.id}</span>
                </td>

                {/* ── Total ──────────────────────────────────── */}
                <td className="px-4 py-3.5">
                  <span className={`text-sm font-bold whitespace-nowrap
                    ${order.totalAmount > 200 ? "text-gray-900" : "text-gray-700"}`}>
                    {fmtAmount(order.totalAmount)}
                  </span>
                </td>

                {/* ── Created time ───────────────────────────── */}
                <td className="px-4 py-3.5">
                  <span className="text-xs text-gray-500 whitespace-nowrap">{timeAgo(order.createdAt)}</span>
                </td>

                {/* ── Status ─────────────────────────────────── */}
                <td className="px-4 py-3.5">
                  <StatusBadge status={order.status} size="sm" />
                </td>

                {/* ── Rating ─────────────────────────────────── */}
                <td className="px-4 py-3.5">
                  {order.rating ? (
                    <RatingStars score={order.rating} size="sm" showValue />
                  ) : (
                    <span className="text-gray-300 text-xs">—</span>
                  )}
                </td>

                {/* ── Open arrow ─────────────────────────────── */}
                <td className="px-3 py-3.5">
                  <div className="w-6 h-6 flex items-center justify-center rounded-md
                    text-gray-300 group-hover:text-gray-500 group-hover:bg-gray-100 transition-all">
                    <i className="ri-arrow-right-s-line text-base" />
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
