/*
 * Light / dark theme. Dark is the default; a visitor's choice is kept in
 * localStorage and applied by THEME_SCRIPT before the page paints, so a light
 * page never flashes dark. The theme lives on <html data-theme>.
 */

export type Theme = "dark" | "light";

const KEY = "mg-theme";
const EVENT = "mg-theme-change";
const THEME_COLOR: Record<Theme, string> = { dark: "#07070a", light: "#f5f5f7" };

/** Inline script for <head>: applies a saved light theme before first paint. */
export const THEME_SCRIPT = `try{if(localStorage.getItem("${KEY}")==="light"){var d=document.documentElement;d.dataset.theme="light";d.style.colorScheme="light"}}catch(e){}`;

export function readTheme(): Theme {
  return document.documentElement.dataset.theme === "light" ? "light" : "dark";
}

export function setTheme(theme: Theme) {
  const root = document.documentElement;
  root.dataset.theme = theme;
  root.style.colorScheme = theme;
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", THEME_COLOR[theme]);
  try {
    localStorage.setItem(KEY, theme);
  } catch {}
  window.dispatchEvent(new Event(EVENT));
}

/**
 * Puts the saved theme back if <html> lost it after the script ran, for
 * example when React rebuilds the page after a hydration error.
 */
export function restoreSavedTheme() {
  try {
    if (localStorage.getItem(KEY) === "light" && readTheme() !== "light") setTheme("light");
  } catch {}
}

export function subscribeTheme(onChange: () => void) {
  window.addEventListener(EVENT, onChange);
  return () => window.removeEventListener(EVENT, onChange);
}
