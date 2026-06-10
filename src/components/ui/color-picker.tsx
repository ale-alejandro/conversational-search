"use client";

import { useEffect, useRef, useState } from "react";

// Multi-point radial color picker (from 21st.dev). `numPoints` controls
// whether the picker emits 1, 2, or 3 colors.
//
// Two modes:
//   - locked (default): satellite dots track the master (angle, radius) ± a
//     spread — dragging the wheel moves all dots together.
//   - unlocked: each dot can be dragged independently. Internally we store a
//     per-index `overrides` array; indices without an override fall back to
//     the locked layout so the dots stay where they were the moment the
//     wheel was unlocked.

function hslToHex(h: number, s: number, l: number) {
  l /= 100;
  s /= 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) =>
    l - a * Math.max(-1, Math.min(Math.min(k(n) - 3, 9 - k(n)), 1));
  return (
    "#" +
    [f(0), f(8), f(4)]
      .map((x) =>
        Math.round(x * 255)
          .toString(16)
          .padStart(2, "0"),
      )
      .join("")
  );
}

interface Point {
  angle: number;
  radius: number;
}

interface ColorPickerProps {
  size?: number;
  padding?: number;
  bulletRadius?: number;
  spreadFactor?: number;
  minSpread?: number;
  maxSpread?: number;
  minLight?: number;
  maxLight?: number;
  numPoints?: number;
  /**
   * Display color shown on the central dot before the user has interacted
   * (locked + 1-point mode only). Lets a parent's stored value drive the
   * dot's appearance even though the picker can't produce arbitrary
   * desaturated colors from angle/radius.
   */
  value?: string;
  /**
   * When true (default), satellite dots track the master via a fixed spread.
   * When false, each dot can be dragged independently.
   */
  locked?: boolean;
  onColorChange?: (colors: string[]) => void;
}

export default function ColorPicker({
  size = 280,
  padding = 20,
  bulletRadius = 18,
  spreadFactor = 0.4,
  minSpread = Math.PI / 1.5,
  maxSpread = Math.PI / 3,
  minLight = 15,
  maxLight = 90,
  numPoints = 1,
  value,
  locked = true,
  onColorChange,
}: ColorPickerProps) {
  const RADIUS = size / 2 - padding;

  // Initial position chosen so the 2-point locked default lands on roughly
  // #0800e9 (satellite, angle+spread → hue ≈ 242°) and #00a6e9 (master,
  // angle → hue ≈ 197°), matching the design spec for the multi-stop default.
  const [angle, setAngle] = useState((197 * Math.PI) / 180);
  const [radius, setRadius] = useState(RADIUS * 0.51);
  const [overrides, setOverrides] = useState<(Point | undefined)[]>([]);
  const [drag, setDrag] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [interacted, setInteracted] = useState(false);
  const interactedRef = useRef(false);
  const lastNumPointsRef = useRef(numPoints);
  const lastLockedRef = useRef(locked);
  const overridesRef = useRef(overrides);

  const ref = useRef<HTMLCanvasElement>(null);

  const normalizedRadius = radius / RADIUS;
  const spread =
    (minSpread + (maxSpread - minSpread) * Math.pow(normalizedRadius, 3)) *
    spreadFactor;

  function pointColor(p: Point) {
    const h = (p.angle * 180) / Math.PI;
    const l = maxLight * (p.radius / RADIUS);
    return hslToHex(h, 100, l);
  }

  function lockedPoint(i: number, n: number): Point {
    if (n === 1) return { angle, radius };
    if (i === 1) return { angle, radius };
    if (i === 0) return { angle: angle + spread, radius };
    return { angle: angle - spread, radius };
  }

  // Synchronously derive the points to render and emit. No effect lag.
  const displayedPoints: Point[] = Array.from({ length: numPoints }, (_, i) => {
    if (!locked && overrides[i]) return overrides[i]!;
    return lockedPoint(i, numPoints);
  });
  const dotColors = displayedPoints.map(pointColor);
  const dotColorsKey = dotColors.join("|");

  useEffect(() => {
    const ctx = ref.current!.getContext("2d")!;
    ctx.clearRect(0, 0, size, size);
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, RADIUS, 0, Math.PI * 2);
    ctx.clip();
    for (let r = 0; r <= RADIUS; r++) {
      for (let a = 0; a < 360; a += 1) {
        const rad = (a * Math.PI) / 180;
        const x = size / 2 + Math.cos(rad) * r;
        const y = size / 2 + Math.sin(rad) * r;
        const lightness = minLight + (maxLight - minLight) * (r / RADIUS);
        ctx.beginPath();
        ctx.strokeStyle = hslToHex(a, 100, lightness);
        ctx.moveTo(x, y);
        ctx.lineTo(x + 1, y + 1);
        ctx.stroke();
      }
    }
  }, [size, RADIUS, minLight, maxLight]);

  useEffect(() => {
    overridesRef.current = overrides;
  }, [overrides]);

  // Lock toggle: when re-locking, snap master to the middle override (if any),
  // then drop overrides so the next unlock starts clean.
  useEffect(() => {
    if (lastLockedRef.current === locked) return;
    if (locked) {
      const o = overridesRef.current;
      const mid = o[1];
      if (mid) {
        setAngle(mid.angle);
        setRadius(mid.radius);
      }
      if (o.length > 0) setOverrides([]);
    }
    lastLockedRef.current = locked;
  }, [locked]);

  // numPoints change: mark interacted, trim overrides if shrinking.
  useEffect(() => {
    if (lastNumPointsRef.current === numPoints) return;
    interactedRef.current = true;
    setInteracted(true);
    setOverrides((curr) =>
      curr.length > numPoints ? curr.slice(0, numPoints) : curr,
    );
    lastNumPointsRef.current = numPoints;
  }, [numPoints]);

  useEffect(() => {
    if (!interactedRef.current) return;
    onColorChange?.(dotColors);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dotColorsKey]);

  function findHitDot(clientX: number, clientY: number): number | null {
    const rect = ref.current!.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    let best: number | null = null;
    let bestDist = Infinity;
    for (let i = 0; i < displayedPoints.length; i++) {
      const p = displayedPoints[i];
      const px = size / 2 + Math.cos(p.angle) * p.radius;
      const py = size / 2 + Math.sin(p.angle) * p.radius;
      const d = Math.hypot(px - x, py - y);
      if (d <= bulletRadius * 1.2 && d < bestDist) {
        best = i;
        bestDist = d;
      }
    }
    return best;
  }

  function setMasterFromPointer(e: React.PointerEvent) {
    const rect = ref.current!.getBoundingClientRect();
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    let r = Math.sqrt(x * x + y * y);
    let a = Math.atan2(y, x);
    if (a < 0) a += 2 * Math.PI;
    r = Math.max(0, Math.min(RADIUS, r));
    setAngle(a);
    setRadius(r);
  }

  function setOverrideFromPointer(e: React.PointerEvent, idx: number) {
    const rect = ref.current!.getBoundingClientRect();
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    let r = Math.sqrt(x * x + y * y);
    let a = Math.atan2(y, x);
    if (a < 0) a += 2 * Math.PI;
    r = Math.max(0, Math.min(RADIUS, r));
    setOverrides((curr) => {
      const next = [...curr];
      while (next.length < numPoints) next.push(undefined);
      next[idx] = { angle: a, radius: r };
      return next;
    });
  }

  function onPointerDown(e: React.PointerEvent) {
    if (!locked) {
      const idx = findHitDot(e.clientX, e.clientY);
      if (idx === null) return;
      interactedRef.current = true;
      setInteracted(true);
      setDragIndex(idx);
      setDrag(true);
      setOverrideFromPointer(e, idx);
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    } else {
      interactedRef.current = true;
      setInteracted(true);
      setDrag(true);
      setMasterFromPointer(e);
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    }
  }
  function onPointerMove(e: React.PointerEvent) {
    if (!drag) return;
    if (!locked && dragIndex !== null) {
      setOverrideFromPointer(e, dragIndex);
    } else if (locked) {
      setMasterFromPointer(e);
    }
  }
  function onPointerUp() {
    setDrag(false);
    setDragIndex(null);
  }

  // For the locked + 1-point default-display path, anchor the dot at center
  // and paint with parent's `value` so the swatch and dot stay in sync.
  const useExternal =
    !interacted && value !== undefined && numPoints === 1 && locked;

  return (
    <div
      style={{ width: size, height: size }}
      className="relative select-none touch-none"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
    >
      <canvas
        ref={ref}
        width={size}
        height={size}
        className="rounded-full opacity-0"
      />

      {displayedPoints.map((p, i) => {
        const isCenter = numPoints === 1 || i === 1;
        const showExternal = useExternal && i === 0;
        const x = showExternal ? size / 2 : size / 2 + Math.cos(p.angle) * p.radius;
        const y = showExternal ? size / 2 : size / 2 + Math.sin(p.angle) * p.radius;
        const bg = showExternal ? value! : pointColor(p);
        if (isCenter) {
          return (
            <div
              key={i}
              className="absolute z-30 rounded-full border-[3px] border-white/90 shadow cursor-grab active:cursor-grabbing pointer-events-none"
              style={{
                left: x - bulletRadius,
                top: y - bulletRadius,
                width: bulletRadius * 2,
                height: bulletRadius * 2,
                background: bg,
              }}
            />
          );
        }
        return (
          <div
            key={i}
            className="absolute z-20 rounded-full border-2 border-white/80 shadow pointer-events-none opacity-90"
            style={{
              left: x - bulletRadius / 1.7,
              top: y - bulletRadius / 1.7,
              width: bulletRadius * 1.2,
              height: bulletRadius * 1.2,
              background: bg,
            }}
          />
        );
      })}
    </div>
  );
}
