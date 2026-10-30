"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { BareFrame } from "@/components/agenda/Frame";
import { Button, Field, inputClass, Spinner } from "@/components/agenda/ui";
import { GoogleIcon } from "@/components/icons/brand";
import { APPLE_SIGN_IN } from "@/lib/agenda/config";
import { useA } from "@/lib/agenda/i18n";
import { AuthError, sendPasswordReset, signInWithApple, signInWithGoogle, signInWithPassword, takeDeletedNotice, useAgenda } from "@/lib/agenda/store";
import { isEmail } from "@/lib/agenda/validation";
import { useHref, useLang, useT } from "@/lib/language";

type Errors = { email?: string; password?: string; form?: string };

export function SignInPage() {
  const href = useHref();
  return (
    <BareFrame logoHref={href("/")}>
      <SignIn />
    </BareFrame>
  );
}

function SignIn() {
  const a = useA();
  const t = useT();
  const lang = useLang();
  const href = useHref();
  const router = useRouter();
  const s = useAgenda();
  const [mode, setMode] = useState<"signIn" | "reset" | "resetSent">("signIn");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [busy, setBusy] = useState<"" | "google" | "apple" | "password" | "reset">("");
  const [deleted] = useState(takeDeletedNotice);

  // already signed in: straight to the agenda
  useEffect(() => {
    if (s.ready && s.user) router.replace(href("/app"));
  }, [s.ready, s.user, router, href]);

  if (!s.ready || s.user) return <Spinner label={a.loading} />;

  const switchMode = (next: typeof mode) => {
    setMode(next);
    setErrors({});
  };

  const fail = (err: unknown) => {
    setBusy("");
    const code = err instanceof AuthError ? err.code : navigator.onLine ? "generic" : "network";
    // closing the sign-in window isn't an error
    if (code !== "cancelled") setErrors({ form: a.signIn.errors[code] });
  };

  const withProvider = async (provider: "google" | "apple") => {
    setErrors({});
    setBusy(provider);
    try {
      await (provider === "google" ? signInWithGoogle : signInWithApple)(lang);
    } catch (err) {
      fail(err);
    }
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const found: Errors = {};
    if (!isEmail(email.trim())) found.email = a.signIn.errors.email;
    if (mode === "signIn" && !password) found.password = a.signIn.errors.password;
    setErrors(found);
    if (Object.keys(found).length) return;
    if (mode === "reset") {
      setBusy("reset");
      try {
        await sendPasswordReset(email.trim());
        setBusy("");
        setMode("resetSent");
      } catch (err) {
        fail(err);
      }
      return;
    }
    setBusy("password");
    try {
      await signInWithPassword(email.trim(), password, lang);
    } catch (err) {
      fail(err);
    }
  };

  return (
    <div className="w-full max-w-[400px]">
      <div className="surface rounded-2xl p-6 sm:p-8">
        {mode === "signIn" ? (
          <>
            <h1 className="text-[1.45rem] leading-tight font-semibold tracking-[-0.02em]">{a.signIn.title}</h1>
            <p className="mt-2 text-[0.9rem] leading-relaxed text-white/60">{a.signIn.lead}</p>
            {deleted && (
              <p role="status" className="mt-4 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-[0.85rem] text-white/75">
                {a.signIn.deleted}
              </p>
            )}

            <button
              type="button"
              onClick={() => withProvider("google")}
              disabled={!!busy}
              aria-busy={busy === "google" || undefined}
              className="mt-6 flex h-11 w-full items-center justify-center gap-3 rounded-lg border border-white/15 bg-white/[0.03] text-[0.92rem] font-medium transition-colors hover:border-white/30 disabled:opacity-60"
            >
              <GoogleIcon className="h-[18px] w-[18px]" />
              {a.signIn.google}
            </button>
            {APPLE_SIGN_IN && (
              <button
                type="button"
                onClick={() => withProvider("apple")}
                disabled={!!busy}
                aria-busy={busy === "apple" || undefined}
                className="mt-2 flex h-11 w-full items-center justify-center gap-3 rounded-lg border border-white/15 bg-white/[0.03] text-[0.92rem] font-medium transition-colors hover:border-white/30 disabled:opacity-60"
              >
                {a.signIn.apple}
              </button>
            )}
            {errors.form && (
              <p role="alert" className="mt-3 rounded-lg border border-accent/40 bg-accent/10 px-3 py-2 text-[0.85rem]">
                {errors.form}
              </p>
            )}

            <div className="my-5 flex items-center gap-3 text-[0.75rem] text-white/40" aria-hidden>
              <span className="h-px flex-1 bg-white/10" />
              {a.signIn.or}
              <span className="h-px flex-1 bg-white/10" />
            </div>
          </>
        ) : (
          <>
            <h1 className="text-[1.3rem] leading-tight font-semibold">{a.signIn.resetTitle}</h1>
            <p className="mt-2 mb-5 text-[0.9rem] text-white/60">{mode === "resetSent" ? a.signIn.resetSent(email.trim()) : a.signIn.resetLead}</p>
          </>
        )}

        {mode !== "resetSent" && (
          <form onSubmit={submit} noValidate className="space-y-4">
            <Field label={a.signIn.email} error={errors.email}>
              {(p) => <input {...p} type="email" autoComplete="email" inputMode="email" className={inputClass} value={email} onChange={(e) => setEmail(e.target.value)} />}
            </Field>
            {mode === "signIn" && (
              <Field label={a.signIn.password} error={errors.password}>
                {(p) => (
                  <div className="relative">
                    <input
                      {...p}
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      className={`${inputClass} pr-11`}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      aria-label={showPassword ? a.signIn.hide : a.signIn.show}
                      aria-pressed={showPassword}
                      className="absolute top-1/2 right-1 grid h-8 w-9 -translate-y-1/2 place-items-center text-white/50 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                )}
              </Field>
            )}
            <Button variant="primary" type="submit" className="h-11 w-full" busy={busy === "password" || busy === "reset"} disabled={!!busy}>
              {mode === "signIn" ? a.signIn.submit : a.signIn.resetSend}
            </Button>
          </form>
        )}

        <div className="mt-4 text-center text-[0.84rem]">
          {mode === "signIn" ? (
            <button type="button" onClick={() => switchMode("reset")} className="text-white/65 hover:text-white hover:underline">
              {a.signIn.forgot}
            </button>
          ) : (
            <button type="button" onClick={() => switchMode("signIn")} className="text-white/65 hover:text-white hover:underline">
              {a.signIn.back}
            </button>
          )}
        </div>
      </div>

      <p className="mt-6 text-center text-[0.85rem] text-white/60">
        {a.signIn.noAccount}{" "}
        <a href={`${href("/")}#download`} className="font-medium text-white hover:underline">
          {a.signIn.getApp}
        </a>
      </p>
      <p className="mt-3 text-center text-[0.75rem] text-white/40">
        {a.signIn.agree}{" "}
        <Link href={href("/terms-of-service")} className="underline hover:text-white/70">
          {t.pages.terms.toLowerCase()}
        </Link>{" "}
        {a.signIn.and}{" "}
        <Link href={href("/privacy-policy")} className="underline hover:text-white/70">
          {t.pages.privacy.toLowerCase()}
        </Link>
        .
      </p>
    </div>
  );
}
