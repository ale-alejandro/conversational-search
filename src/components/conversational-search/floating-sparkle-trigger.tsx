"use client";

import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  toBackgroundCss,
  type GradientMode,
  type MeshPoint,
  type TriggerPosition,
} from "./types";

interface FloatingSparkleTriggerProps {
  bgColors: string[];
  gradientAngle: number;
  gradientMode: GradientMode;
  meshPoints: MeshPoint[];
  iconImage: string | null;
  /** Already-resolved icon color (parent decides auto vs manual). */
  iconColor: string;
  position: TriggerPosition;
}

const positionClasses: Record<TriggerPosition, string> = {
  "bottom-right": "bottom-2 right-2",
  "bottom-left": "bottom-2 left-2",
  "top-right": "top-2 right-2",
  "top-left": "top-2 left-2",
};

export function FloatingSparkleTrigger({
  bgColors,
  gradientAngle,
  gradientMode,
  meshPoints,
  iconImage,
  iconColor,
  position,
}: FloatingSparkleTriggerProps) {
  return (
    <button
      type="button"
      aria-label="Open conversational search"
      className={cn(
        "absolute size-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 ease-out hover:scale-105 active:scale-95",
        positionClasses[position],
      )}
      style={{
        background: toBackgroundCss(
          bgColors,
          gradientAngle,
          gradientMode,
          meshPoints,
        ),
      }}
    >
      {iconImage ? (
        <span
          className="size-6 bg-current"
          style={{
            color: iconColor,
            maskImage: `url(${iconImage})`,
            maskPosition: "center",
            maskRepeat: "no-repeat",
            maskSize: "contain",
            WebkitMaskImage: `url(${iconImage})`,
            WebkitMaskPosition: "center",
            WebkitMaskRepeat: "no-repeat",
            WebkitMaskSize: "contain",
          }}
          aria-hidden
        />
      ) : (
        <Sparkles className="size-5" style={{ color: iconColor }} />
      )}
    </button>
  );
}
