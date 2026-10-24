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

/* ---------- the shared tilted axis ---------- */

/**
 * The phone's long axis leans 11.9° clockwise: it runs through the centres of
 * the screen opening's top (621, 96) and bottom (332, 1466) edges in
 * phone_border.png. The phone moves along this axis, and the hole, galaxy
 * and wave beneath it are discs perpendicular to it — so all of them share
 * one axis and the phone dives straight into the hole's centre.
 */
export const AXIS_DEG = 11.9;
const AX = Math.sin((AXIS_DEG * Math.PI) / 180); // x step per unit along the axis (downwards = −AX)
const AY = Math.cos((AXIS_DEG * Math.PI) / 180); // y step per unit along the axis (downwards = +AY)

/** Centre of the hole (scene px) and its radius; `flat` is the disc's apparent height/width. */
export const HOLE = { cx: 1110, cy: 760, r: 360, flat: 0.3 };

/** Where the phone's axis leaves the bottom of the frame (frame px). */
const FRAME_AXIS_BOTTOM = [306, 1590] as const;

/** Phone width in scene px; height follows the PNG's aspect. */
const PHONE_W = 400;
export const PHONE_H = (PHONE_W * FRAME_H) / FRAME_W;
const PHONE_SCALE = PHONE_W / FRAME_W;
/** Gap between the phone's bottom and the hole's centre at the top of the hover. */
const REST_GAP = 20;

/** Phone box positioned so its axis passes exactly through the hole's centre. */
export const PHONE = {
  x: HOLE.cx + REST_GAP * AX - FRAME_AXIS_BOTTOM[0] * PHONE_SCALE,
  y: HOLE.cy - REST_GAP * AY - FRAME_AXIS_BOTTOM[1] * PHONE_SCALE,
  w: PHONE_W,
};

/** Offset (as % of the phone box) for sinking `px` scene px down the axis. */
function alongAxis(px: number) {
  return { x: `${((-AX * px) / PHONE_W) * 100}%`, y: `${((AY * px) / PHONE_H) * 100}%` };
}
/** How deep the phone dives into the hole each cycle, and where it emerges from on load. */
export const DIVE = alongAxis(84);
export const EMERGE = alongAxis(330);

/**
 * The phone sits in a fixed box masked along the hole's surface (the line
 * through the hole centre, perpendicular to the axis), so whatever goes
 * below the surface disappears into the hole.
 */
export const PORTAL_BOX = { x: 880, y: 40, w: 600, h: 900 };
export const PORTAL_MASK = (() => {
  const a = (AXIS_DEG * Math.PI) / 180;
  const { w, h } = PORTAL_BOX;
  const len = Math.abs(w * Math.sin(a)) + Math.abs(h * Math.cos(a));
  const cx = PORTAL_BOX.x + w / 2;
  const cy = PORTAL_BOX.y + h / 2;
  // CSS gradient line runs bottom-left → top-right through the box centre
  const along = (HOLE.cx - cx) * Math.sin(a) - (HOLE.cy - cy) * Math.cos(a);
  const p = (0.5 + along / len) * 100;
  return `linear-gradient(${AXIS_DEG}deg, transparent ${p.toFixed(2)}%, #000 ${(p + 0.8).toFixed(2)}%)`;
})();

/**
 * Base wave: wave_effect.png's ring spans ~92% of its width, is centred at
 * 53% of its height and is drawn very flat (~0.143), so it is stretched to
 * the hole's flatness and rotated onto the axis.
 */
export const WAVE = { w: 860, stretch: HOLE.flat / 0.143 };
export const WAVE_H = (WAVE.w * SCENE_H) / SCENE_W;

/** One clock for the dive, wave and galaxy so they move together. */
export const HOVER = "6s ease-in-out 1.6s infinite both";

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
