export type TriggerPosition =
  | "bottom-right"
  | "bottom-left"
  | "top-right"
  | "top-left";

export type GradientMode = "linear" | "mesh";

export interface MeshPoint {
  x: number;
  y: number;
}

export const DEFAULT_MESH_POINTS: MeshPoint[] = [
  { x: 22, y: 72 },
  { x: 52, y: 20 },
  { x: 66, y: 56 },
  { x: 88, y: 58 },
];

export interface AppearanceState {
  bgColors: string[];
  gradientAngle: number;
  gradientMode: GradientMode;
  meshPoints: MeshPoint[];
  iconImage: string | null;
  /**
   * Either a hex color, or the literal "auto" — in which case the icon
   * color is derived from the average luminance of `bgColors` so it always
   * contrasts with the trigger background.
   */
  iconColor: string | "auto";
  position: TriggerPosition;
}

export const DEFAULT_APPEARANCE: AppearanceState = {
  bgColors: ["#262626"],
  gradientAngle: 135,
  gradientMode: "linear",
  meshPoints: DEFAULT_MESH_POINTS,
  iconImage: null,
  iconColor: "auto",
  position: "bottom-right",
};

function meshColorAt(colors: string[], index: number) {
  return colors[index] ?? colors[index % colors.length] ?? "#000000";
}

export function toBackgroundCss(
  colors: string[],
  angle = 135,
  mode: GradientMode = "linear",
  meshPoints: MeshPoint[] = DEFAULT_MESH_POINTS,
) {
  if (colors.length === 0) return "#000000";
  if (colors.length === 1) return colors[0];
  if (mode === "mesh") {
    const base = colors[0];
    const fallback = colors[colors.length - 1] ?? base;
    const meshLayers = DEFAULT_MESH_POINTS.map((defaultPoint, i) => {
      const point = meshPoints[i] ?? defaultPoint;
      const color = meshColorAt(colors, i);
      return `radial-gradient(circle at ${point.x}% ${point.y}%, ${color} 0%, ${color} 16%, transparent 48%)`;
    });
    return [
      ...meshLayers,
      `linear-gradient(${Math.max(0, Math.min(360, Math.round(angle)))}deg, ${base} 0%, ${fallback} 100%)`,
    ].join(", ");
  }
  const normalizedAngle = Math.max(0, Math.min(360, Math.round(angle)));
  if (colors.length === 2) {
    return `linear-gradient(${normalizedAngle}deg, ${colors[0]} 0%, ${colors[1]} 100%)`;
  }
  return `linear-gradient(${normalizedAngle}deg, ${colors[0]} 0%, ${colors[1]} 50%, ${colors[2]} 100%)`;
}

function hexToRgb(hex: string): [number, number, number] | null {
  const m = /^#([0-9a-f]{6})$/i.exec(hex);
  if (!m) return null;
  const n = parseInt(m[1], 16);
  return [(n >> 16) & 0xff, (n >> 8) & 0xff, n & 0xff];
}

/**
 * Returns "#FFFFFF" or "#262626" depending on which contrasts better with
 * the (averaged) background colors. Threshold tuned so mid-tones lean dark.
 */
export function getAutoIconColor(bgColors: string[]): string {
  if (bgColors.length === 0) return "#FFFFFF";
  let r = 0,
    g = 0,
    b = 0,
    n = 0;
  for (const c of bgColors) {
    const rgb = hexToRgb(c);
    if (!rgb) continue;
    r += rgb[0];
    g += rgb[1];
    b += rgb[2];
    n++;
  }
  if (n === 0) return "#FFFFFF";
  r /= n;
  g /= n;
  b /= n;
  // Relative luminance (0..255 scale)
  const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return lum > 150 ? "#262626" : "#FFFFFF";
}

export function resolveIconColor(state: AppearanceState): string {
  return state.iconColor === "auto"
    ? getAutoIconColor(state.bgColors)
    : state.iconColor;
}
