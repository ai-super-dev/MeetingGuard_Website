"use client";

import { createContext, useCallback, useContext, useEffect, useId, useRef, useState, type ButtonHTMLAttributes, type ReactNode } from "react";
import { Loader2, X } from "lucide-react";
import { useA } from "@/lib/agenda/i18n";
import type { ErrorCode } from "@/lib/agenda/validation";

/* ---------- Buttons ---------- */

type Variant = "primary" | "secondary" | "ghost" | "danger";

const VARIANTS: Record<Variant, string> = {
  primary: "bg-inverse text-on-inverse hover:bg-inverse-hover",
  secondary: "border border-white/12 text-white/85 hover:border-white/25 hover:text-white",
  ghost: "text-white/70 hover:bg-white/[0.06] hover:text-white",
  danger: "bg-accent text-[#fff] hover:bg-accent-deep",
};

export function Button({
  variant = "secondary",
  busy = false,
  className = "",
  children,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; busy?: boolean }) {
  return (
    <button
      type="button"
      {...rest}
      disabled={rest.disabled || busy}
      aria-busy={busy || undefined}
      className={`inline-flex h-10 items-center justify-center gap-2 rounded-lg px-4 text-[0.88rem] font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${VARIANTS[variant]} ${className}`}
    >
      {busy && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
      {children}
    </button>
  );
}

/** Square icon button with a visible tooltip and an accessible name. */
export function IconButton({ label, children, className = "", ...rest }: ButtonHTMLAttributes<HTMLButtonElement> & { label: string }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      {...rest}
      className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg text-white/70 transition-colors hover:bg-white/[0.07] hover:text-white disabled:opacity-40 ${className}`}
    >
      {children}
    </button>
  );
}

/* ---------- Form fields ---------- */

// options get a solid background: the field's see-through one would leave a dropdown's list white in dark mode
export const inputClass =
  "h-10 w-full rounded-lg border border-white/12 bg-white/[0.04] px-3 text-[0.92rem] text-white placeholder:text-white/35 outline-none transition-colors focus:border-white/35 aria-[invalid=true]:border-accent disabled:opacity-50 [&>option]:bg-panel [&>option]:text-white";

/**
 * A labelled field. `children` gets the input's id and the ids that
 * describe it (hint and error), so every input is announced with both.
 */
export function Field({
  label,
  hint,
  error,
  className = "",
  children,
}: {
  label: ReactNode;
  hint?: ReactNode;
  error?: ErrorCode | string;
  className?: string;
  children: (props: { id: string; "aria-describedby"?: string; "aria-invalid"?: boolean }) => ReactNode;
}) {
  const a = useA();
  const id = useId();
  const describedBy = [hint ? `${id}-hint` : "", error ? `${id}-error` : ""].filter(Boolean).join(" ") || undefined;
  const message = error ? ((a.errors as Record<string, string>)[error] ?? error) : "";
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-[0.8rem] font-medium text-white/65">
        {label}
      </label>
      {children({ id, "aria-describedby": describedBy, "aria-invalid": error ? true : undefined })}
      {hint && !error && (
        <p id={`${id}-hint`} className="mt-1.5 text-[0.76rem] text-white/45">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-[0.78rem] text-accent-soft" role="alert">
          {message}
        </p>
      )}
    </div>
  );
}

export function Spinner({ label }: { label: string }) {
  return (
    <div role="status" className="grid min-h-[50vh] place-items-center text-white/50">
      <span className="flex items-center gap-3 text-[0.9rem]">
        <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
        {label}
      </span>
    </div>
  );
}

/* ---------- Dialog ---------- */

/**
 * A modal dialog (the native <dialog>, so focus stays inside and Esc closes
 * it). Mount it to open it; `onClose` unmounts it. On phones it rises from
 * the bottom as a sheet.
 */
export function Dialog({
  title,
  onClose,
  children,
  footer,
  size = "md",
  headerExtra,
}: {
  title: ReactNode;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
  size?: "sm" | "md" | "lg";
  headerExtra?: ReactNode;
}) {
  const a = useA();
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const close = useRef(onClose);
  useEffect(() => {
    close.current = onClose;
  });

  // the button that opened the dialog gets the focus back when it closes
  const [opener] = useState(() => (typeof document === "undefined" ? null : (document.activeElement as HTMLElement | null)));

  useEffect(() => {
    const d = ref.current;
    if (d && !d.open) d.showModal();
    // start on the marked button or the first field, otherwise on the dialog itself (not its close button)
    const first = d?.querySelector<HTMLElement>("[data-autofocus], input:not([type=checkbox]):not([type=radio]):not(:disabled), textarea");
    (first ?? d)?.focus();
    return () => opener?.focus?.();
  }, [opener]);

  const width = size === "sm" ? "sm:max-w-[420px]" : size === "lg" ? "sm:max-w-[680px]" : "sm:max-w-[540px]";
  return (
    <dialog
      ref={ref}
      tabIndex={-1}
      aria-labelledby={titleId}
      onCancel={(e) => {
        e.preventDefault();
        close.current();
      }}
      onClick={(e) => {
        // a click on the backdrop (the dialog element itself, outside its box) closes it
        if (e.target === ref.current) close.current();
      }}
      className={`m-auto w-full max-w-none overflow-hidden border border-white/10 bg-panel p-0 text-white shadow-[0_24px_80px_rgba(0,0,0,0.55)] backdrop:bg-black/55 backdrop:backdrop-blur-[2px] max-sm:mb-0 max-sm:max-h-[92dvh] max-sm:rounded-t-2xl sm:max-h-[calc(100dvh-48px)] sm:rounded-2xl ${width}`}
    >
      <div className="flex max-h-[inherit] flex-col">
        <div className="flex items-start gap-3 border-b border-white/[0.07] px-5 py-4">
          <h2 id={titleId} className="min-w-0 flex-1 pt-1 text-[1.05rem] leading-snug font-semibold">
            {title}
          </h2>
          {headerExtra}
          <IconButton label={a.common.close} onClick={() => close.current()} className="-mr-2">
            <X className="h-4 w-4" />
          </IconButton>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">{children}</div>
        {footer && <div className="flex flex-wrap items-center justify-end gap-2 border-t border-white/[0.07] px-5 py-3">{footer}</div>}
      </div>
    </dialog>
  );
}

/* ---------- Toasts ---------- */

type Toast = { id: number; text: string; tone: "ok" | "error"; action?: { label: string; run: () => void } };
type ToastApi = (text: string, opts?: { tone?: "ok" | "error"; action?: Toast["action"] }) => void;

const ToastContext = createContext<ToastApi>(() => {});

/** Short messages after an action ("Saved"), with an optional Undo. */
export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const next = useRef(1);
  const dismiss = useCallback((id: number) => setToasts((t) => t.filter((x) => x.id !== id)), []);
  const show = useCallback<ToastApi>(
    (text, opts) => {
      const id = next.current++;
      setToasts((t) => [...t.slice(-2), { id, text, tone: opts?.tone ?? "ok", action: opts?.action }]);
      setTimeout(() => dismiss(id), opts?.action ? 7000 : 4500);
    },
    [dismiss],
  );

  return (
    <ToastContext.Provider value={show}>
      {children}
      <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-20 z-[60] flex flex-col items-center gap-2 px-4 lg:bottom-6">
        {toasts.map((t) => (
          <ToastRow key={t.id} toast={t} onDismiss={() => dismiss(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastRow({ toast, onDismiss }: { toast: Toast; onDismiss: () => void }) {
  const a = useA();
  return (
    <div
      role={toast.tone === "error" ? "alert" : undefined}
      className={`pointer-events-auto flex max-w-[560px] items-center gap-3 rounded-xl border bg-bar px-4 py-3 text-[0.88rem] shadow-[0_12px_40px_rgba(0,0,0,0.45)] ${
        toast.tone === "error" ? "border-accent/50 text-white" : "border-white/10 text-white/90"
      }`}
    >
      <span className="flex-1">{toast.text}</span>
      {toast.action && (
        <button
          type="button"
          className="font-semibold text-accent-soft hover:underline"
          onClick={() => {
            toast.action?.run();
            onDismiss();
          }}
        >
          {toast.action.label}
        </button>
      )}
      <button type="button" aria-label={a.toast.dismiss} className="text-white/45 hover:text-white" onClick={onDismiss}>
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

/** Segmented control (Day / Week / Month and similar). */
export function Segmented<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: { value: T; label: string; shortcut?: string }[];
  onChange: (v: T) => void;
}) {
  return (
    <div role="radiogroup" aria-label={label} className="inline-flex rounded-lg border border-white/10 bg-white/[0.03] p-0.5">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          role="radio"
          aria-checked={value === o.value}
          aria-keyshortcuts={o.shortcut}
          title={o.shortcut && `${o.label} (${o.shortcut})`}
          onClick={() => onChange(o.value)}
          className={`h-8 rounded-md px-3 text-[0.82rem] font-medium transition-colors ${
            value === o.value ? "bg-white/[0.12] text-white" : "text-white/60 hover:text-white"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
