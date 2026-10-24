import type { StaticImageData } from "next/image";
import { images } from "@/lib/assets";

/** Screen layout size (CSS px) before it is projected into a frame's opening. */
export const SCREEN_W = 390;
export const SCREEN_H = 880;

type Quad = [number, number][];

/**
 * matrix3d that maps a SCREEN_W×`height` box onto a screen quad (TL, TR, BR,
 * BL — frame px). A true projective transform, so the UI follows the phone's
 * perspective exactly. The quad is grown slightly so the bezel overlaps the
 * screen edges.
 */
function quadMatrix(quad: Quad, height: number) {
  const grow = 1.012;
  const cx = quad.reduce((s, p) => s + p[0], 0) / 4;
  const cy = quad.reduce((s, p) => s + p[1], 0) / 4;
  const [[x0, y0], [x1, y1], [x2, y2], [x3, y3]] = quad.map(([x, y]) => [
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
  const w = SCREEN_W, hh = height;
  const m = [a / w, d / w, 0, g / w, b / hh, e / hh, 0, h / hh, 0, 0, 1, 0, x0, y0, 0, 1];
  return `matrix3d(${m.map((n) => +n.toFixed(6)).join(",")})`;
}

export type FrameSpec = {
  src: StaticImageData;
  w: number;
  h: number;
  /** Screen height (CSS px at SCREEN_W wide) that suits the opening's proportions. */
  screenH: number;
  matrix: string;
};

/**
 * Corner quads below were found by scanning each PNG's alpha channel and
 * intersecting lines fitted to the straight runs of the bezel edges.
 */

/** phone_frame.png — the tilted silver phone in the hero. */
export const SILVER_FRAME: FrameSpec = {
  src: images.phoneFrame,
  w: 1024,
  h: 1536,
  screenH: SCREEN_H,
  matrix: quadMatrix(
    [
      [360.8, 89.6],
      [897.1, 39.0],
      [674.7, 1423.5],
      [88.6, 1364.8],
    ],
    SCREEN_H,
  ),
};

/** phone_blue.png — the tilted blue phone beside the calendar. */
const BLUE_SCREEN_H = 930;
export const BLUE_FRAME: FrameSpec = {
  src: images.phoneBlue,
  w: 1650,
  h: 1920,
  screenH: BLUE_SCREEN_H,
  matrix: quadMatrix(
    [
      [644.8, 230.9],
      [1210.2, 227.1],
      [1012.8, 1637.4],
      [416.7, 1588.2],
    ],
    BLUE_SCREEN_H,
  ),
};
