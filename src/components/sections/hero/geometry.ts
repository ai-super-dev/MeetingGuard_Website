import type { CSSProperties } from "react";

/*
 * Hero scene coordinates. Everything is laid out in the 1672×941 pixel space
 * of the "First page" reference and converted to percentages, so the scene
 * scales as one piece at any viewport size.
 */
export const SCENE_W = 1672;
export const SCENE_H = 941;

/** Box (in scene px) → absolute-position style in %. */
export function sceneBox(x: number, y: number, w: number, h: number): CSSProperties {
  return {
    left: `${(x / SCENE_W) * 100}%`,
    top: `${(y / SCENE_H) * 100}%`,
    width: `${(w / SCENE_W) * 100}%`,
    height: `${(h / SCENE_H) * 100}%`,
  };
}

/** Square box centred on (cx, cy) with side `size`, in scene px. */
export function sceneSquare(cx: number, cy: number, size: number): CSSProperties {
  return sceneBox(cx - size / 2, cy - size / 2, size, size);
}

/* ---------- phone ---------- */

/** phone_border.png intrinsic size. */
export const FRAME_W = 971;
export const FRAME_H = 1619;

/** Where the phone sits in the scene (scene px). Height follows the PNG's aspect. */
export const PHONE = { x: 930, y: 98, w: 486 };
export const PHONE_H = (PHONE.w * FRAME_H) / FRAME_W;

/**
 * Corners of the transparent screen opening inside phone_border.png, found by
 * scanning its alpha channel and intersecting the fitted bezel edges
 * (TL, TR, BR, BL — frame px).
 */
const SCREEN_QUAD: [number, number][] = [
  [337.7, 83.5],
  [904.7, 108.7],
  [629.2, 1505.7],
  [35.7, 1425.9],
];

/** Lock-screen layout size (CSS px) before it is projected into the opening. */
export const SCREEN_W = 390;
export const SCREEN_H = 870;

/**
 * matrix3d that maps a SCREEN_W×SCREEN_H box onto the screen quad (a true
 * projective transform, so the UI follows the phone's perspective exactly).
 * The quad is grown slightly so the bezel overlaps the screen edges.
 */
export const SCREEN_MATRIX = (() => {
  const grow = 1.012;
  const cx = SCREEN_QUAD.reduce((s, p) => s + p[0], 0) / 4;
  const cy = SCREEN_QUAD.reduce((s, p) => s + p[1], 0) / 4;
  const [[x0, y0], [x1, y1], [x2, y2], [x3, y3]] = SCREEN_QUAD.map(([x, y]) => [
    cx + (x - cx) * grow,
    cy + (y - cy) * grow,
  ]);

  const dx1 = x1 - x2, dx2 = x3 - x2, dx3 = x0 - x1 + x2 - x3;
  const dy1 = y1 - y2, dy2 = y3 - y2, dy3 = y0 - y1 + y2 - y3;
  const den = dx1 * dy2 - dx2 * dy1;
  const g = (dx3 * dy2 - dx2 * dy3) / den;
  const h = (dx1 * dy3 - dx3 * dy1) / den;
  const a = x1 - x0 + g * x1, b = x3 - x0 + h * x3;
  const d = y1 - y0 + g * y1, e = y3 - y0 + h * y3;
  const w = SCREEN_W, hh = SCREEN_H;
  const m = [a / w, d / w, 0, g / w, b / hh, e / hh, 0, h / hh, 0, 0, 1, 0, x0, y0, 0, 1];
  return `matrix3d(${m.map((n) => +n.toFixed(6)).join(",")})`;
})();
