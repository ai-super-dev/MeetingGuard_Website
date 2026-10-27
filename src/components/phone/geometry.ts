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
  /** Bounding box of the opaque phone body (frame px); the rest of the PNG is empty margin. */
  body?: { x: number; y: number; w: number; h: number };
  /** Black border (CSS px at SCREEN_W) drawn around the screen, for frames whose opening is the bare metal rim. */
  bezel?: number;
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
  body: { x: 61, y: 16, w: 894, h: 1479 },
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

/** phone-alert.png — the alarm phone beside the calendar. */
export const CAL_FRAME: FrameSpec = {
  src: images.phoneCal,
  w: 1086,
  h: 1448,
  screenH: 905,
  body: { x: 129, y: 38, w: 794, h: 1384 },
  matrix: quadMatrix(
    [
      [353.8, 81.1],
      [873.0, 67.1],
      [694.1, 1359.8],
      [152.3, 1323.1],
    ],
    905,
  ),
};

/**
 * phone_purple.png, phone_red.png and phone_blue.png are the same phone model
 * in the same pose (different colours), so they share one screen quad.
 */
const STEP_PHONE = {
  w: 1650,
  h: 1920,
  screenH: 936,
  body: { x: 396, y: 196, w: 868, h: 1502 },
  matrix: quadMatrix(
    [
      [643.4, 231.5],
      [1211.0, 227.6],
      [1013.0, 1637.5],
      [415.7, 1588.4],
    ],
    936,
  ),
};

/** "How it works" step 1 (Plan). */
export const PURPLE_FRAME: FrameSpec = { src: images.phonePurple, ...STEP_PHONE };
/** "How it works" step 2 (Alert). */
export const RED_FRAME: FrameSpec = { src: images.phoneRed, ...STEP_PHONE };
/** "How it works" step 3 (Join). */
export const BLUE_FRAME: FrameSpec = { src: images.phoneBlue, ...STEP_PHONE };

/** phone_frame_str.png — front-facing silver phone (WhatsApp flow). */
export const STRAIGHT_FRAME: FrameSpec = {
  src: images.phoneFrameStraight,
  w: 1024,
  h: 1536,
  screenH: 845,
  body: { x: 167, y: 66, w: 684, h: 1373 },
  matrix: quadMatrix(
    [
      [206.0, 98.1],
      [810.0, 96.9],
      [810.0, 1406.0],
      [206.0, 1406.0],
    ],
    845,
  ),
};

/**
 * android_phone_tilt.png: Android phone turned slightly (right edge nearer),
 * used for Android-only screens. The black border around the screen is part
 * of the image; the quad is its inner edge.
 */
export const ANDROID_FRAME: FrameSpec = {
  src: images.androidPhone,
  w: 1650,
  h: 1920,
  screenH: 943,
  body: { x: 419, y: 181, w: 846, h: 1531 },
  matrix: quadMatrix(
    [
      [647.1, 231.2],
      [1220.2, 210.3],
      [1040.8, 1654.0],
      [443.9, 1597.7],
    ],
    943,
  ),
};

/**
 * android_phone_tilt_left.png: the earlier Android phone turned the other way
 * (screen facing right), made by mirroring it with the side buttons painted
 * out. Only its metal rim is drawn, so the site adds the black screen border.
 */
export const ANDROID_FRAME_RIGHT: FrameSpec = {
  src: images.androidPhoneLeft,
  w: 1024,
  h: 1536,
  screenH: 916,
  body: { x: 143, y: 36, w: 758, h: 1454 },
  bezel: 10,
  matrix: quadMatrix(
    [
      [193.5, 62],
      [743.8, 101.7],
      [882.1, 1393.9],
      [295.9, 1437.1],
    ],
    916,
  ),
};
