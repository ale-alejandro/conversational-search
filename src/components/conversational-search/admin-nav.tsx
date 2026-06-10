"use client";

import {
  LayoutGrid,
  Users,
  Calendar,
  ChartPie,
  ShoppingCart,
  Globe,
  Copy,
  CirclePlus,
  SlidersHorizontal,
  HelpCircle,
} from "lucide-react";

const navIcons = [
  LayoutGrid,
  Users,
  Calendar,
  ChartPie,
  ShoppingCart,
  Globe,
  Copy,
  CirclePlus,
];

export function AdminNav() {
  return (
    <div className="bg-[#2864f6] flex flex-col items-center justify-between w-[68px] px-2 shrink-0">
      <div className="flex items-center justify-center px-2.5 py-5 w-full">
        <div className="bg-[#7198f9] border border-[#93b1fb] flex items-center justify-center p-2.5 rounded-lg">
          <span className="text-white font-bold text-sm leading-none">ti</span>
        </div>
      </div>

      <div className="flex flex-col gap-2 items-center flex-1 w-full pt-3 pb-4 border-t border-[#4a7bf7]">
        {navIcons.map((Icon, i) => (
          <button
            key={i}
            type="button"
            className="flex items-center justify-center p-2 rounded text-white/80 hover:bg-[#4a7bf7]/60 transition-colors"
          >
            <Icon className="size-6" strokeWidth={1.5} />
          </button>
        ))}
        <button
          type="button"
          className="flex items-center justify-center p-2 rounded bg-[#4a7bf7] text-white"
        >
          <SlidersHorizontal className="size-6" strokeWidth={1.5} />
        </button>
      </div>

      <div className="flex flex-col gap-4 items-center w-full pt-3 pb-4 border-t border-[#4a7bf7]">
        <button
          type="button"
          className="flex items-center justify-center p-2 rounded text-white/80 hover:bg-[#4a7bf7]/60 transition-colors"
        >
          <HelpCircle className="size-6" strokeWidth={1.5} />
        </button>
        <div className="flex items-center justify-center rounded-full size-10 bg-[#4a7bf7] text-white text-sm">
          JD
        </div>
      </div>
    </div>
  );
}
