"use client";

import { useCallback, useState } from "react";
import {
  ArrowDownLeft,
  ArrowDownRight,
  Lock,
  Minus,
  Plus,
  Sparkles,
  Unlock,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { RadioGroupCards } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import ColorPicker from "@/components/ui/color-picker";
import { cn } from "@/lib/utils";
import {
  DEFAULT_MESH_POINTS,
  toBackgroundCss,
  resolveIconColor,
  DEFAULT_APPEARANCE,
} from "./types";
import type {
  AppearanceState,
  GradientMode,
  MeshPoint,
  TriggerPosition,
} from "./types";

const HEX_REGEX = /^#([0-9a-fA-F]{6})$/;

const DEFAULT_MESH_COLORS = ["#7c0eff", "#0e4dff", "#0efbff", "#f0ffff"];

function clampGradientAngle(value: number) {
  if (!Number.isFinite(value)) return DEFAULT_APPEARANCE.gradientAngle;
  return Math.max(0, Math.min(360, Math.round(value)));
}

function clampPercent(value: number) {
  if (!Number.isFinite(value)) return 50;
  return Math.max(0, Math.min(100, Math.round(value)));
}

const positionItems: {
  value: TriggerPosition;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { value: "bottom-right", label: "Bottom-right", icon: ArrowDownRight },
  { value: "bottom-left", label: "Bottom-left", icon: ArrowDownLeft },
];

interface AppearancePanelProps {
  state: AppearanceState;
  setState: React.Dispatch<React.SetStateAction<AppearanceState>>;
  onReset: () => void;
  pickerKey: number;
}

export function AppearancePanel({
  state,
  setState,
  onReset,
  pickerKey,
}: AppearancePanelProps) {
  const [locked, setLocked] = useState(true);

  const handlePickerChange = useCallback(
    (colors: string[]) => {
      setState((s) => ({
        ...s,
        bgColors: colors.map((c) => c.toLowerCase()),
      }));
    },
    [setState],
  );

  const numPoints = state.bgColors.length;
  const setNumPoints = (n: number) => {
    const next = Math.max(1, Math.min(3, n));
    if (next === numPoints) return;
    setState((s) => {
      if (next > 1 && numPoints === 1) {
        return {
          ...s,
          bgColors: DEFAULT_MESH_COLORS,
          gradientMode: "mesh",
          meshPoints: DEFAULT_MESH_POINTS,
        };
      }
      const trimmed = s.bgColors.slice(0, next);
      while (trimmed.length < next) trimmed.push(s.bgColors[0] ?? "#000000");
      return {
        ...s,
        bgColors: trimmed,
        gradientMode: next > 1 ? s.gradientMode : "linear",
      };
    });
  };
  const setGradientMode = (gradientMode: GradientMode) => {
    setState((s) => {
      if (gradientMode === "mesh") {
        const nextColors = s.bgColors.slice(0, 4);
        while (nextColors.length < 4) {
          nextColors.push(nextColors[nextColors.length - 1] ?? "#000000");
        }
        return {
          ...s,
          gradientMode,
          bgColors: nextColors,
          meshPoints:
            s.meshPoints.length >= 4 ? s.meshPoints : DEFAULT_MESH_POINTS,
        };
      }
      return {
        ...s,
        gradientMode,
        bgColors: s.bgColors.slice(0, 3),
      };
    });
  };

  const isDirty =
    state.bgColors.length !== DEFAULT_APPEARANCE.bgColors.length ||
    state.bgColors.some(
      (c, i) =>
        c.toLowerCase() !== DEFAULT_APPEARANCE.bgColors[i]?.toLowerCase(),
    ) ||
    state.gradientAngle !== DEFAULT_APPEARANCE.gradientAngle ||
    state.gradientMode !== DEFAULT_APPEARANCE.gradientMode ||
    state.meshPoints.length !== DEFAULT_APPEARANCE.meshPoints.length ||
    state.meshPoints.some((p, i) => {
      const defaultPoint = DEFAULT_APPEARANCE.meshPoints[i];
      return !defaultPoint || p.x !== defaultPoint.x || p.y !== defaultPoint.y;
    }) ||
    state.iconImage !== DEFAULT_APPEARANCE.iconImage ||
    state.iconColor !== DEFAULT_APPEARANCE.iconColor ||
    state.position !== DEFAULT_APPEARANCE.position;

  return (
    <aside className="bg-white border-l border-[#e2e8f0] shadow-[0_10px_7.5px_-3px_rgba(0,0,0,0.1),0_4px_3px_-2px_rgba(0,0,0,0.1)] w-[480px] shrink-0 flex flex-col">
      <Tabs defaultValue="appearance" className="flex flex-col flex-1 min-h-0">
        <TabsList
          variant="line"
          className="border-b border-[#d4d4d4] rounded-none w-full justify-start pt-2.5 px-2 h-auto"
        >
          <TabsTrigger value="appearance" className="pb-4 px-1">
            Appearance
          </TabsTrigger>
          <TabsTrigger value="integration" className="pb-4 px-1">
            Search Bar Integration
          </TabsTrigger>
        </TabsList>

        <TabsContent
          value="appearance"
          className="flex flex-col flex-1 min-h-0 overflow-y-auto"
        >
          <div className="px-6 py-4">
            <p className="text-sm text-muted-foreground">
              Customize the floating search trigger button that appears on your
              learner-facing site.
            </p>
          </div>

          <div className="flex flex-col gap-5 px-4 flex-1">
            {/* Background Color */}
            <section className="grid grid-cols-[280px_minmax(0,1fr)] gap-x-4 gap-y-2">
              <label className="text-sm font-medium text-[#314158]">
                Background Color
              </label>
              <label className="text-sm font-medium text-[#314158]">
                Modify Icon
              </label>
              <div className="contents">
                <div
                  className="relative rounded-xl bg-slate-100 p-3 flex flex-col items-center justify-center"
                >
                  {state.gradientMode === "mesh" ? (
                    <MeshGradientEditor
                      colors={state.bgColors}
                      points={state.meshPoints}
                      onChange={(meshPoints) =>
                        setState((s) => ({ ...s, meshPoints }))
                      }
                    />
                  ) : (
                    <>
                      <ColorPicker
                        key={pickerKey}
                        size={240}
                        bulletRadius={16}
                        numPoints={numPoints}
                        locked={locked}
                        value={state.bgColors[0]}
                        onColorChange={handlePickerChange}
                      />
                      <div className="flex items-center justify-center w-full px-1 py-2 relative z-20">
                        <div className="flex gap-2 items-center">
                          <button
                            type="button"
                            aria-label="Remove color stop"
                            disabled={numPoints <= 1}
                            onClick={() => setNumPoints(numPoints - 1)}
                            className="text-muted-foreground size-7 rounded hover:bg-slate-200 transition-colors flex items-center justify-center disabled:opacity-30 disabled:hover:bg-transparent"
                          >
                            <Minus className="size-4" />
                          </button>
                          <span className="text-xs text-muted-foreground tabular-nums w-3 text-center">
                            {numPoints}
                          </span>
                          <button
                            type="button"
                            aria-label="Add color stop"
                            disabled={numPoints >= 3}
                            onClick={() => setNumPoints(numPoints + 1)}
                            className="text-muted-foreground size-7 rounded hover:bg-slate-200 transition-colors flex items-center justify-center disabled:opacity-30 disabled:hover:bg-transparent"
                          >
                            <Plus className="size-4" />
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
                <div className="flex min-w-0 flex-col gap-2">
                  <IconPreviewUpload state={state} setState={setState} />
                  <IconColorModeControl state={state} setState={setState} />
                </div>
              </div>
              <div className="col-span-2 flex flex-col gap-2">
                {numPoints > 1 && (
                  <div className="grid grid-cols-[146px_minmax(0,1fr)] gap-x-4 items-center">
                    <GradientModeControl
                      value={state.gradientMode}
                      onChange={setGradientMode}
                    />
                    {state.gradientMode === "linear" ? (
                      <GradientAngleControl
                        value={state.gradientAngle}
                        onChange={(gradientAngle) =>
                          setState((s) => ({ ...s, gradientAngle }))
                        }
                      />
                    ) : (
                      <div className="h-9 text-xs leading-4 text-muted-foreground flex items-center">
                        Drag mesh anchors to reposition the gradient.
                      </div>
                    )}
                  </div>
                )}
                <div
                  className={cn(
                    "grid gap-2",
                    numPoints > 1 && state.gradientMode === "linear"
                      ? "grid-cols-[146px_36px] items-start"
                      : "grid-cols-[146px]",
                  )}
                >
                  <div className="flex flex-col gap-2">
                    {state.bgColors.map((c, i) => (
                      <ColorField
                        key={i}
                        value={c}
                        disabled={
                          state.gradientMode === "linear" && i > 0 && locked
                        }
                        onChange={(v) =>
                          setState((s) => {
                            const next = [...s.bgColors];
                            next[i] = v.toLowerCase();
                            return { ...s, bgColors: next };
                          })
                        }
                      />
                    ))}
                  </div>
                  {numPoints > 1 && state.gradientMode === "linear" && (
                    <button
                      type="button"
                      aria-label={
                        locked ? "Unlock color stops" : "Lock color stops"
                      }
                      title={
                        locked
                          ? "Unlock to edit color stops independently"
                          : "Lock color stops to the picker"
                      }
                      onClick={() => setLocked((l) => !l)}
                      className="text-muted-foreground size-9 rounded-md border border-[#d1d1d1] bg-white hover:bg-slate-100 transition-colors flex items-center justify-center"
                    >
                      {locked ? (
                        <Lock className="size-4" />
                      ) : (
                        <Unlock className="size-4" />
                      )}
                    </button>
                  )}
                </div>
              </div>
            </section>

            {/* Position */}
            <section className="flex flex-col gap-3">
              <label className="text-sm font-medium text-[#314158]">
                Position
              </label>
              <RadioGroupCards
                items={positionItems}
                value={state.position}
                onValueChange={(v) =>
                  setState((s) => ({ ...s, position: v }))
                }
                columns={2}
              />
            </section>
          </div>

          <div className="flex gap-2 items-center justify-end p-4 border-t border-[#e2e8f0]">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                onReset();
                setLocked(true);
              }}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              className={cn(
                "px-4 min-w-[128px]",
                !isDirty &&
                  "bg-muted text-muted-foreground hover:bg-muted pointer-events-none",
              )}
            >
              Save Changes
            </Button>
          </div>
        </TabsContent>

        <TabsContent
          value="integration"
          className="flex items-center justify-center p-12 text-sm text-muted-foreground"
        >
          Coming soon
        </TabsContent>
      </Tabs>
    </aside>
  );
}

function IconPreviewUpload({
  state,
  setState,
}: {
  state: AppearanceState;
  setState: React.Dispatch<React.SetStateAction<AppearanceState>>;
}) {
  const resolved = resolveIconColor(state);
  const bg = toBackgroundCss(
    state.bgColors,
    state.gradientAngle,
    state.gradientMode,
    state.meshPoints,
  );

  return (
    <label
      className="relative flex-1 min-h-[218px] cursor-pointer overflow-hidden rounded-lg transition-transform duration-200 hover:scale-[1.01] active:scale-[0.99] focus-within:ring-2 focus-within:ring-ring/50"
      style={{ background: bg }}
      title="Change icon"
    >
      <span className="sr-only">Change icon</span>
      <input
        type="file"
        accept="image/png,image/svg+xml,.png,.svg"
        className="sr-only"
        onChange={(e) => {
          const file = e.target.files?.[0];
          e.currentTarget.value = "";
          if (!file) return;
          const isAllowed =
            file.type === "image/png" ||
            file.type === "image/svg+xml" ||
            /\.(png|svg)$/i.test(file.name);
          if (!isAllowed) return;

          const reader = new FileReader();
          reader.onload = () => {
            const result = reader.result;
            if (typeof result !== "string") return;
            setState((s) => ({ ...s, iconImage: result }));
          };
          reader.readAsDataURL(file);
        }}
      />
      <span className="absolute inset-0 flex items-center justify-center">
        {state.iconImage ? (
          <span
            className="size-12 bg-current"
            style={{
              color: resolved,
              maskImage: `url(${state.iconImage})`,
              maskPosition: "center",
              maskRepeat: "no-repeat",
              maskSize: "contain",
              WebkitMaskImage: `url(${state.iconImage})`,
              WebkitMaskPosition: "center",
              WebkitMaskRepeat: "no-repeat",
              WebkitMaskSize: "contain",
            }}
            aria-hidden
          />
        ) : (
          <Sparkles className="size-10" style={{ color: resolved }} />
        )}
      </span>
      {state.bgColors.length > 1 && (
        <span className="absolute left-3 top-3 rounded-md bg-white/85 px-2 py-1 text-xs font-medium tabular-nums text-[#262626] shadow-sm">
          {state.gradientMode === "mesh" ? "Mesh" : `${state.gradientAngle}°`}
        </span>
      )}
      <span className="absolute right-3 bottom-3 rounded-md bg-white/85 px-2 py-1 text-xs font-medium text-[#262626] shadow-sm">
        {state.iconColor === "auto" ? "Auto Icon Color" : "Custom Icon Color"}
      </span>
    </label>
  );
}

function IconColorModeControl({
  state,
  setState,
}: {
  state: AppearanceState;
  setState: React.Dispatch<React.SetStateAction<AppearanceState>>;
}) {
  const isAuto = state.iconColor === "auto";
  const customColor = isAuto ? resolveIconColor(state) : state.iconColor;

  return (
    <div className="flex min-w-0 flex-col gap-2">
      <div className="grid grid-cols-2 rounded-md border border-[#d1d1d1] bg-white p-0.5">
        <button
          type="button"
          aria-pressed={isAuto}
          onClick={() => setState((s) => ({ ...s, iconColor: "auto" }))}
          className={cn(
            "h-8 rounded px-2 text-xs font-medium transition-colors",
            isAuto
              ? "bg-[#262626] text-white"
              : "text-muted-foreground hover:bg-slate-100",
          )}
        >
          Auto
        </button>
        <button
          type="button"
          aria-pressed={!isAuto}
          onClick={() =>
            setState((s) => ({
              ...s,
              iconColor:
                s.iconColor === "auto" ? resolveIconColor(s) : s.iconColor,
            }))
          }
          className={cn(
            "h-8 rounded px-2 text-xs font-medium transition-colors",
            !isAuto
              ? "bg-[#262626] text-white"
              : "text-muted-foreground hover:bg-slate-100",
          )}
        >
          Custom
        </button>
      </div>
      {!isAuto && (
        <ColorField
          value={customColor}
          ariaLabel="Custom icon color"
          onChange={(v) =>
            setState((s) => ({ ...s, iconColor: v.toUpperCase() }))
          }
        />
      )}
    </div>
  );
}

function MeshGradientEditor({
  colors,
  points,
  onChange,
}: {
  colors: string[];
  points: MeshPoint[];
  onChange: (points: MeshPoint[]) => void;
}) {
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const meshPoints = DEFAULT_MESH_POINTS.map((defaultPoint, i) => {
    return points[i] ?? defaultPoint;
  });

  function updatePoint(e: React.PointerEvent, index: number) {
    const surface = e.currentTarget.parentElement;
    if (!surface) return;
    const rect = surface.getBoundingClientRect();
    const x = clampPercent(((e.clientX - rect.left) / rect.width) * 100);
    const y = clampPercent(((e.clientY - rect.top) / rect.height) * 100);
    const next = [...meshPoints];
    next[index] = { x, y };
    onChange(next);
  }

  return (
    <div
      className="relative h-[284px] w-[240px] overflow-hidden rounded-lg border border-black/5 touch-none"
      style={{
        background: toBackgroundCss(colors, 135, "mesh", meshPoints),
      }}
    >
      {meshPoints.map((point, i) => {
        const color = colors[i] ?? colors[i % colors.length] ?? "#000000";
        const isActive = dragIndex === i;
        return (
          <button
            key={i}
            type="button"
            aria-label={`Move mesh color ${i + 1}`}
            onPointerDown={(e) => {
              setDragIndex(i);
              updatePoint(e, i);
              e.currentTarget.setPointerCapture(e.pointerId);
            }}
            onPointerMove={(e) => {
              if (dragIndex === i) updatePoint(e, i);
            }}
            onPointerUp={() => setDragIndex(null)}
            onPointerCancel={() => setDragIndex(null)}
            className={cn(
              "absolute z-20 size-8 -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-white shadow-md transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60",
              isActive
                ? "scale-110 cursor-grabbing"
                : "cursor-grab hover:scale-105",
            )}
            style={{
              left: `${point.x}%`,
              top: `${point.y}%`,
              background: color,
            }}
          />
        );
      })}
    </div>
  );
}

function GradientModeControl({
  value,
  onChange,
}: {
  value: GradientMode;
  onChange: (value: GradientMode) => void;
}) {
  const modes: Array<{ value: GradientMode; label: string }> = [
    { value: "linear", label: "Linear" },
    { value: "mesh", label: "Mesh" },
  ];

  return (
    <div
      className="grid grid-cols-2 rounded-md border border-[#d1d1d1] bg-white p-0.5"
      aria-label="Gradient style"
    >
      {modes.map((mode) => (
        <button
          key={mode.value}
          type="button"
          aria-pressed={value === mode.value}
          onClick={() => onChange(mode.value)}
          className={cn(
            "h-8 rounded px-2 text-xs font-medium transition-colors",
            value === mode.value
              ? "bg-[#262626] text-white"
              : "text-muted-foreground hover:bg-slate-100",
          )}
        >
          {mode.label}
        </button>
      ))}
    </div>
  );
}

function GradientAngleControl({
  value,
  onChange,
}: {
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="flex h-9 min-w-0 items-center gap-3">
      <label
        htmlFor="gradient-angle"
        className="shrink-0 text-sm font-medium text-[#262626]"
      >
        Angle
      </label>
      <input
        id="gradient-angle"
        type="range"
        min={0}
        max={360}
        step={1}
        value={value}
        onChange={(e) => onChange(clampGradientAngle(e.target.valueAsNumber))}
        className="min-w-0 flex-1 accent-[#262626]"
        aria-label="Gradient angle"
      />
    </div>
  );
}

function ColorField({
  value,
  onChange,
  disabled = false,
  ariaLabel = "Background color",
}: {
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
  ariaLabel?: string;
}) {
  const colorValue = HEX_REGEX.test(value) ? value : "#000000";

  return (
    <div
      className={cn(
        "inline-flex h-9 w-[146px] items-center gap-2 rounded-md border border-[#d1d1d1] bg-white px-2 transition-colors focus-within:ring-2 focus-within:ring-ring/50",
        disabled && "bg-[#f8fafc] opacity-55",
      )}
      suppressHydrationWarning
    >
      <input
        type="color"
        value={colorValue}
        disabled={disabled}
        aria-label={ariaLabel}
        onChange={(e) => onChange(e.target.value)}
        className="h-5 w-5 shrink-0 cursor-pointer appearance-none rounded border-0 bg-transparent p-0 disabled:cursor-not-allowed [&::-moz-color-swatch]:rounded-sm [&::-moz-color-swatch]:border [&::-moz-color-swatch]:border-black/10 [&::-webkit-color-swatch]:rounded-sm [&::-webkit-color-swatch]:border [&::-webkit-color-swatch]:border-black/10 [&::-webkit-color-swatch-wrapper]:p-0"
        suppressHydrationWarning
      />
      <input
        key={value}
        type="text"
        defaultValue={value}
        disabled={disabled}
        onChange={(e) => {
          const next = e.target.value;
          if (HEX_REGEX.test(next)) onChange(next);
        }}
        onBlur={(e) => {
          e.currentTarget.value = value;
        }}
        className="min-w-0 flex-1 bg-transparent text-[13px] text-[#333] outline-none disabled:cursor-not-allowed"
        spellCheck={false}
        suppressHydrationWarning
      />
    </div>
  );
}
