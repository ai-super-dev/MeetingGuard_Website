"use client";

/*
 * The pieces of the meeting form, shaped like the app's (react-native-paper):
 * sections on cards, chips, switches, outlined fields whose label sits inside
 * until there is text, and "Change date" / "Change time" rows.
 */

import { useId, useRef, useState, type ReactNode } from "react";
import { Check, ChevronRight } from "lucide-react";
import { useA } from "@/lib/agenda/i18n";
import type { ErrorCode } from "@/lib/agenda/validation";

export function FormSection({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <section aria-label={title} className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-4">
      {title && <h3 className="mb-3 text-[0.95rem] font-semibold">{title}</h3>}
      {children}
    </section>
  );
}

export function Subheading({ children }: { children: ReactNode }) {
  return <p className="mt-4 mb-2 text-[0.84rem] font-medium">{children}</p>;
}

/** Muted line under a control. */
export function Helper({ children, tone }: { children: ReactNode; tone?: "error" | "muted" }) {
  return (
    <p role={tone === "error" ? "alert" : undefined} className={`mt-2 text-[0.78rem] leading-relaxed ${tone === "error" ? "text-accent-soft" : tone === "muted" ? "text-white/45" : "text-white/60"}`}>
      {children}
    </p>
  );
}

const chipClass = (on: boolean) =>
  `inline-flex min-h-8 items-center gap-1.5 rounded-lg border px-3 py-1 text-[0.82rem] transition-colors ${
    on ? "border-transparent bg-white/[0.13] text-white" : "border-white/15 text-white/75 hover:border-white/30 hover:text-white"
  }`;

/** One choice out of several, as chips. */
export function ChoiceChips<T extends string | number>({ label, value, options, onChange }: { label: string; value: T; options: { value: T; label: string }[]; onChange: (v: T) => void }) {
  return (
    <div role="radiogroup" aria-label={label} className="flex flex-wrap gap-2">
      {options.map((o) => {
        const on = o.value === value;
        return (
          <button key={String(o.value)} type="button" role="radio" aria-checked={on} onClick={() => onChange(o.value)} className={chipClass(on)}>
            {on && <Check className="h-3.5 w-3.5" aria-hidden />}
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

/** Several choices, as chips that toggle. */
export function ToggleChip({ on, onClick, label, children }: { on: boolean; onClick: () => void; label?: string; children: ReactNode }) {
  return (
    <button type="button" aria-pressed={on} aria-label={label} onClick={onClick} className={chipClass(on)}>
      {on && <Check className="h-3.5 w-3.5" aria-hidden />}
      {children}
    </button>
  );
}

export function Switch({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-[0.88rem]">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-10 shrink-0 rounded-full transition-colors ${checked ? "bg-inverse" : "bg-white/15"}`}
      >
        <span className={`absolute top-1 h-4 w-4 rounded-full transition-all ${checked ? "left-5 bg-on-inverse" : "left-1 bg-white/70"}`} />
      </button>
    </div>
  );
}

/**
 * An outlined field whose label sits inside it until there is text, then moves
 * to the top edge, as in the app.
 */
export function FloatField({
  label,
  value,
  onChange,
  error,
  multiline = false,
  className = "",
  ...rest
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: ErrorCode | string;
  multiline?: boolean;
  className?: string;
  type?: string;
  inputMode?: "text" | "email" | "url" | "numeric";
  maxLength?: number;
  autoFocus?: boolean;
  autoComplete?: string;
  placeholder?: string;
}) {
  const a = useA();
  const id = useId();
  const [focused, setFocused] = useState(false);
  const raised = focused || value !== "";
  const message = error ? ((a.errors as Record<string, string>)[error] ?? error) : "";
  const box = `w-full rounded-lg border bg-transparent px-3 text-[0.92rem] text-white outline-none transition-colors placeholder:text-white/35 ${
    error ? "border-accent" : "border-white/20 hover:border-white/35 focus:border-white/60"
  }`;
  const common = {
    id,
    value,
    onChange: (e: { target: { value: string } }) => onChange(e.target.value),
    onFocus: () => setFocused(true),
    onBlur: () => setFocused(false),
    "aria-invalid": error ? true : undefined,
    "aria-describedby": error ? `${id}-error` : undefined,
    ...rest,
    placeholder: raised ? rest.placeholder : undefined,
  };
  return (
    <div className={className}>
      <div className="relative">
        {multiline ? <textarea {...common} rows={3} className={`${box} min-h-[52px] resize-y pt-5 pb-2`} /> : <input {...common} className={`${box} h-[52px] pt-4`} />}
        <label
          htmlFor={id}
          className={`pointer-events-none absolute left-3 transition-all ${raised ? "top-1.5 text-[0.7rem]" : multiline ? "top-3.5 text-[0.92rem]" : "top-1/2 -translate-y-1/2 text-[0.92rem]"} ${
            error ? "text-accent-soft" : raised && focused ? "text-white/80" : "text-white/50"
          }`}
        >
          {label}
        </label>
      </div>
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-1.5 text-[0.78rem] text-accent-soft">
          {message}
        </p>
      )}
    </div>
  );
}

/** The rows of a grouped list ("Change date", "Change time"). */
export function ListGroup({ children }: { children: ReactNode }) {
  return <div className="divide-y divide-white/[0.07] overflow-hidden rounded-xl border border-white/[0.1]">{children}</div>;
}

/**
 * A row that opens the browser's date or time picker. Browsers that can't open
 * it from a button show the field under the row instead.
 */
export function PickerRow({ icon, title, supporting, type, value, onChange, invalid }: { icon: ReactNode; title: string; supporting: string; type: "date" | "time"; value: string; onChange: (v: string) => void; invalid?: boolean }) {
  const input = useRef<HTMLInputElement>(null);
  const [inline, setInline] = useState(false);
  const open = () => {
    const el = input.current;
    if (!el) return;
    try {
      el.showPicker();
    } catch {
      setInline(true);
      requestAnimationFrame(() => el.focus());
    }
  };
  return (
    <div className="relative">
      <button type="button" onClick={open} className="flex w-full items-center gap-4 px-4 py-3 text-left transition-colors hover:bg-white/[0.04]">
        <span className="text-white/70" aria-hidden>
          {icon}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[0.92rem] font-medium">{title}</span>
          <span className={`block text-[0.8rem] ${invalid ? "text-accent-soft" : "text-white/55"}`}>{supporting}</span>
        </span>
        <ChevronRight className="h-4 w-4 text-white/60" aria-hidden />
      </button>
      <input
        ref={input}
        type={type}
        value={value}
        onChange={(e) => e.target.value && onChange(e.target.value)}
        aria-label={title}
        tabIndex={inline ? 0 : -1}
        // kept under the row, so the picker opens there
        className={inline ? "mx-4 mb-3 h-10 rounded-lg border border-white/20 bg-transparent px-3 text-[0.92rem] text-white" : "pointer-events-none absolute bottom-1 left-4 h-px w-px opacity-0"}
      />
    </div>
  );
}
