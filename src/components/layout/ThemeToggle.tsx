"use client";

import { useEffect, useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";
import { useT } from "@/lib/language";
import { readTheme, restoreSavedTheme, setTheme, subscribeTheme, type Theme } from "@/lib/theme";

/** Keeps the saved theme once React has taken over the page (renders nothing). */
export function ThemeRestore() {
  useEffect(restoreSavedTheme, []);
  return null;
}

/** Light / dark switch: shows the current theme's icon and previews the other on hover. */
export function ThemeToggle({ className = "", withLabel = false }: { className?: string; withLabel?: boolean }) {
  const t = useT();
  const theme = useSyncExternalStore<Theme>(subscribeTheme, readTheme, () => "dark");
  const next: Theme = theme === "dark" ? "light" : "dark";
  const label = next === "light" ? t.header.theme.toLight : t.header.theme.toDark;
  const [Current, Next] = theme === "dark" ? [Moon, Sun] : [Sun, Moon];

  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setTheme(next)}
        aria-label={label}
        title={label}
        className={`group relative flex h-8 items-center gap-2 rounded-md text-white/60 transition-colors hover:bg-white/[0.06] hover:text-white ${
          withLabel ? "px-3" : "w-8 justify-center"
        }`}
      >
        <span className="relative grid h-4 w-4 place-items-center">
          <Current className="h-4 w-4 transition duration-300 group-hover:scale-75 group-hover:opacity-0" aria-hidden />
          <Next className="absolute h-4 w-4 scale-75 opacity-0 transition duration-300 group-hover:scale-100 group-hover:opacity-100" aria-hidden />
        </span>
        {withLabel && <span className="text-[0.85rem]">{label}</span>}
      </button>
    </div>
  );
}
