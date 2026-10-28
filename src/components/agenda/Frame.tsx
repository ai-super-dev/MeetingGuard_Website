"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { CalendarDays, CircleUser, Info, ListChecks, WifiOff, X } from "lucide-react";
import { LanguageSwitch } from "@/components/layout/LanguageSwitch";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { AppMark, Logo } from "@/components/ui/Logo";
import { useNow, useOnline } from "@/lib/agenda/hooks";
import { useA } from "@/lib/agenda/i18n";
import { onTrial } from "@/lib/agenda/plans";
import { useAgenda } from "@/lib/agenda/store";
import { useHref } from "@/lib/language";
import { splitPath } from "@/lib/routes";
import { Spinner } from "./ui";

const NAV = [
  { key: "agenda", path: "/app", Icon: CalendarDays },
  { key: "tasks", path: "/app/tasks", Icon: ListChecks },
  { key: "account", path: "/app/account", Icon: CircleUser },
] as const;

const BANNER_KEY = "mg-agenda-banner-closed";

function DemoBanner() {
  const a = useA();
  // closed for the rest of this visit
  const [closed, setClosed] = useState(() => {
    try {
      return sessionStorage.getItem(BANNER_KEY) === "1";
    } catch {
      return false;
    }
  });
  if (closed) return null;
  return (
    <div className="flex items-start gap-3 border-b border-warm/20 bg-warm/[0.07] px-4 py-2.5 text-[0.8rem] text-white/75 lg:px-8">
      <Info className="mt-0.5 h-4 w-4 shrink-0 text-warm" aria-hidden />
      <p className="flex-1">{a.demo.banner}</p>
      <button
        type="button"
        aria-label={a.toast.dismiss}
        className="text-white/45 hover:text-white"
        onClick={() => {
          setClosed(true);
          try {
            sessionStorage.setItem(BANNER_KEY, "1");
          } catch {}
        }}
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

function OfflineBanner() {
  const a = useA();
  const online = useOnline();
  if (online) return null;
  return (
    <div role="status" className="flex items-center gap-3 border-b border-accent/30 bg-accent/10 px-4 py-2.5 text-[0.82rem] text-white/85 lg:px-8">
      <WifiOff className="h-4 w-4 shrink-0 text-accent-soft" aria-hidden />
      {a.offline}
    </div>
  );
}

/** Language and theme buttons, shared by every agenda page. */
function Controls() {
  return (
    <div className="flex items-center gap-1.5">
      <LanguageSwitch />
      <ThemeToggle />
    </div>
  );
}

/**
 * The signed-in layout: side menu on a computer, tab bar on a phone. Sends
 * visitors who are not signed in to the sign-in page.
 */
export function AgendaFrame({ title, children, actions }: { title: string; children: ReactNode; actions?: ReactNode }) {
  const a = useA();
  const s = useAgenda();
  const href = useHref();
  const router = useRouter();
  const { path } = splitPath(usePathname());
  const now = useNow();

  useEffect(() => {
    if (s.ready && !s.user) router.replace(href("/app/sign-in"));
  }, [s.ready, s.user, router, href]);

  if (!s.ready || !s.user) return <Spinner label={a.loading} />;

  const plan = a.account.plans[s.entitlement.plan];
  const trial = onTrial(s.entitlement, now);

  return (
    <div className="min-h-dvh lg:pl-[244px]">
      {/* side menu (computer) */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[244px] flex-col border-r border-white/[0.07] bg-bar px-3 py-5 lg:flex">
        <Link href={href("/app")} className="px-3" aria-label={a.nav.agenda}>
          <Logo />
        </Link>
        <nav aria-label={a.nav.main} className="mt-8">
          <ul className="space-y-1">
            {NAV.map(({ key, path: to, Icon }) => {
              const active = path === to;
              return (
                <li key={key}>
                  <Link
                    href={href(to)}
                    aria-current={active ? "page" : undefined}
                    className={`flex h-10 items-center gap-3 rounded-lg px-3 text-[0.9rem] transition-colors ${
                      active ? "bg-white/[0.08] font-medium text-white" : "text-white/65 hover:bg-white/[0.04] hover:text-white"
                    }`}
                  >
                    <Icon className="h-[18px] w-[18px]" aria-hidden />
                    {a.nav[key]}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="mt-auto space-y-3 px-1">
          <Link href={href("/app/account")} className="flex items-center gap-3 rounded-xl border border-white/[0.07] p-3 hover:border-white/15">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/[0.08] text-[0.85rem] font-semibold">
              {s.user.name.charAt(0).toUpperCase()}
            </span>
            <span className="min-w-0 leading-tight">
              <span className="block truncate text-[0.85rem] font-medium">{s.user.name}</span>
              <span className="block truncate text-[0.75rem] text-white/50">
                {plan}
                {trial ? ` · ${a.account.trialShort}` : ""}
              </span>
            </span>
          </Link>
          <a href={href("/")} className="block px-2 text-[0.75rem] text-white/40 hover:text-white/70">
            {a.nav.site}
          </a>
        </div>
      </aside>

      {/* top bar */}
      <header className="sticky top-0 z-30 border-b border-white/[0.07] bg-ink-950/85 backdrop-blur-xl">
        <div className="flex h-14 items-center gap-3 px-4 lg:h-16 lg:px-8">
          <Link href={href("/app")} className="lg:hidden" aria-label={a.nav.agenda}>
            <AppMark className="h-7 w-7" sizes="56px" />
          </Link>
          <h1 className="min-w-0 flex-1 truncate text-[1.05rem] font-semibold tracking-[-0.01em] lg:text-[1.2rem]">{title}</h1>
          <span className="hidden rounded-full border border-warm/40 px-2 py-0.5 text-[0.68rem] font-semibold tracking-wide text-warm uppercase sm:inline">
            {a.demo.badge}
          </span>
          {actions}
          <Controls />
        </div>
      </header>
      <DemoBanner />
      <OfflineBanner />

      <main id="main" className="px-4 pt-4 pb-28 lg:px-8 lg:pb-10">
        {children}
      </main>

      {/* tab bar (phone) */}
      <nav
        aria-label={a.nav.main}
        className="fixed inset-x-0 bottom-0 z-40 border-t border-white/[0.08] bg-bar/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl lg:hidden"
      >
        <ul className="grid grid-cols-3">
          {NAV.map(({ key, path: to, Icon }) => {
            const active = path === to;
            return (
              <li key={key}>
                <Link
                  href={href(to)}
                  aria-current={active ? "page" : undefined}
                  className={`flex h-16 flex-col items-center justify-center gap-1 text-[0.72rem] ${active ? "text-white" : "text-white/50"}`}
                >
                  <Icon className="h-5 w-5" aria-hidden />
                  {a.nav[key]}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}

/** Pages without the menu (sign in, guest invitation): logo, language and theme only. */
export function BareFrame({ children, logoHref }: { children: ReactNode; logoHref: string }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="flex h-16 items-center justify-between px-4 sm:px-8">
        <Link href={logoHref}>
          <Logo />
        </Link>
        <Controls />
      </header>
      <main id="main" className="flex flex-1 items-start justify-center px-4 pt-6 pb-16 sm:items-center sm:pt-0">
        {children}
      </main>
    </div>
  );
}
