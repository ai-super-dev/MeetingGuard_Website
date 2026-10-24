/** phone_frame.png intrinsic size. */
export const FRAME_W = 1024;
export const FRAME_H = 1536;

/**
 * Corners of the transparent screen opening inside phone_frame.png, found by
 * scanning its alpha channel and intersecting the fitted bezel edges
 * (TL, TR, BR, BL — frame px).
 */
const SCREEN_QUAD: [number, number][] = [
  [360.8, 89.6],
  [897.1, 39.0],
  [674.7, 1423.5],
  [88.6, 1364.8],
];

/** Screen layout size (CSS px) before it is projected into the opening. */
export const SCREEN_W = 390;
export const SCREEN_H = 880;

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
