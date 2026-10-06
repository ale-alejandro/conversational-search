"use client";

import { toBackgroundCss, type GradientMode, type MeshPoint } from "./types";

interface FloatingSparkleTriggerProps {
  bgColors: string[];
  gradientAngle: number;
  gradientMode: GradientMode;
  meshPoints: MeshPoint[];
  iconImage: string;
  /** Already-resolved icon color (parent decides auto vs manual). */
  iconColor: string;
}

export function FloatingSparkleTrigger({
  bgColors,
  gradientAngle,
  gradientMode,
  meshPoints,
  iconImage,
  iconColor,
}: FloatingSparkleTriggerProps) {
  return (
    <button
      type="button"
      aria-label="Open conversational search"
      className="size-20 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 ease-out hover:scale-105 active:scale-95"
      style={{
        background: toBackgroundCss(
          bgColors,
          gradientAngle,
          gradientMode,
          meshPoints,
        ),
      }}
    >
      <span
        className="size-9 bg-current"
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
    </button>
  );
}
