"use client";

import { Search } from "lucide-react";
import { FloatingSparkleTrigger } from "./floating-sparkle-trigger";
import { resolveIconColor, type AppearanceState } from "./types";

interface PreviewPaneProps {
  state: AppearanceState;
}

export function PreviewPane({ state }: PreviewPaneProps) {
  return (
    <section className="flex-1 flex flex-col gap-2 p-6 min-w-0">
      <h2 className="font-bold text-base text-[#262626]">Preview</h2>
      <p className="text-[13px] text-[#808080]">
        Live preview of the trigger button with your current settings.
      </p>

      <div className="bg-[#f8fafc] flex-1 flex flex-col rounded-lg overflow-hidden">
        <div className="bg-white border border-[#e2e8f0] rounded-xl flex-1 flex flex-col shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-4px_rgba(0,0,0,0.1)] overflow-hidden">
          <header className="bg-[#f5f5f5] border-b border-[#e2e8f0] h-[52px] flex items-center justify-between px-4 shrink-0">
            <div className="flex items-center gap-2">
              <span className="block size-3 rounded-full bg-[#f96057]" />
              <span className="block size-3 rounded-full bg-[#f8ce52]" />
              <span className="block size-3 rounded-full bg-[#5fcf65]" />
            </div>
            <button
              type="button"
              className="rounded-lg border border-[#e5e5e5] bg-white/80 backdrop-blur px-4 py-1 text-sm font-semibold text-[#171717] shadow-sm hover:bg-white transition-colors"
            >
              View Live Page
            </button>
            <div className="w-[52px]" aria-hidden />
          </header>

          <div className="bg-white flex-1 flex flex-col relative">
            <div className="flex items-start justify-between pt-4 px-4">
              <FakeLogo />
              <nav className="flex items-center gap-2">
                <span className="px-4 py-4 text-[13px] text-black">
                  Manager Access
                </span>
                <span className="px-4 py-4 text-[13px] text-black">
                  Basket (0)
                </span>
                <button
                  type="button"
                  className="size-9 flex items-center justify-center rounded-md border border-[#e2e8f0] bg-white"
                >
                  <Search className="size-4 text-[#262626]" />
                </button>
              </nav>
            </div>

            <FloatingSparkleTrigger
              bgColors={state.bgColors}
              gradientAngle={state.gradientAngle}
              gradientMode={state.gradientMode}
              meshPoints={state.meshPoints}
              iconImage={state.iconImage}
              iconColor={resolveIconColor(state)}
              position={state.position}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function FakeLogo() {
  return (
    <div className="flex items-center gap-1">
      <div className="leading-tight">
        <div className="font-light text-[22px] text-[#262626]">Live</div>
        <div className="font-bold text-[22px] text-[#262626] -mt-1">
          Healthy
        </div>
      </div>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className="size-6 text-[#e11d48]"
        aria-hidden
      >
        <path
          d="M12 21s-7-4.5-9.5-9A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 9.5 6c-2.5 4.5-9.5 9-9.5 9z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
