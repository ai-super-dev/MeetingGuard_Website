"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Check, Sparkles } from "lucide-react";

export type Plan = {
  id: string;
  name: string;
  blurb: string;
  monthly: string;
  yearly: string;
  /** e.g. "Save 27%"; shown with the yearly price. */
  saving?: string;
  trial?: string;
  features: readonly string[];
  highlight?: boolean;
};

/** Plan cards with a monthly / yearly switch. Prices are shown as the app shows them. */
export function PricingPlans({
  plans,
  labels,
}: {
  plans: readonly Plan[];
  labels: { monthly: string; yearly: string; perMonth: string; perYear: string; popular: string; billing: string };
}) {
  const [period, setPeriod] = useState<"monthly" | "yearly">("yearly");
  return (
    <div>
      <div role="group" aria-label={labels.billing} className="mx-auto flex w-fit rounded-xl border border-white/10 bg-white/[0.03] p-1">
        {(["monthly", "yearly"] as const).map((p) => (
          <button
            key={p}
            type="button"
            aria-pressed={period === p}
            onClick={() => setPeriod(p)}
            className={`relative h-9 rounded-lg px-5 text-[0.85rem] font-medium transition-colors ${period === p ? "text-white" : "text-white/55 hover:text-white/85"}`}
          >
            {period === p && <motion.span layoutId="billing-pill" className="absolute inset-0 rounded-lg bg-white/[0.1]" transition={{ type: "spring", stiffness: 400, damping: 34 }} />}
            <span className="relative">{labels[p]}</span>
          </button>
        ))}
      </div>

      <div className="mx-auto mt-10 grid max-w-[1040px] gap-4 md:grid-cols-3">
        {plans.map((plan) => {
          const price = period === "monthly" ? plan.monthly : plan.yearly;
          return (
            <div
              key={plan.id}
              className={`relative flex flex-col rounded-2xl p-7 ${
                plan.highlight
                  ? "border border-accent/35 bg-[radial-gradient(90%_60%_at_50%_0%,rgba(255,60,80,0.14),transparent_70%),linear-gradient(180deg,#121014,#0b0a0d)]"
                  : "surface"
              }`}
            >
              {plan.highlight && (
                <span className="absolute -top-3 left-7 inline-flex items-center gap-1 rounded-full bg-accent px-2.5 py-1 text-[0.7rem] font-semibold text-white">
                  <Sparkles className="h-3 w-3" aria-hidden />
                  {labels.popular}
                </span>
              )}
              <h3 className="text-[1.1rem] font-semibold text-white">{plan.name}</h3>
              <p className="mt-1 text-[0.86rem] text-white/55">{plan.blurb}</p>
              <p className="mt-6 flex items-baseline gap-1.5">
                <span className="text-[2rem] font-semibold tracking-[-0.02em] text-white">{price}</span>
                {plan.id !== "free" && <span className="text-[0.82rem] text-white/45">{period === "monthly" ? labels.perMonth : labels.perYear}</span>}
              </p>
              <div className="mt-2 flex h-6 flex-wrap items-center gap-2">
                {period === "yearly" && plan.saving && (
                  <span className="rounded-full bg-emerald-400/10 px-2 py-0.5 text-[0.72rem] font-medium text-emerald-300">{plan.saving}</span>
                )}
                {plan.trial && <span className="rounded-full bg-white/[0.06] px-2 py-0.5 text-[0.72rem] text-white/65">{plan.trial}</span>}
              </div>
              <ul className="mt-6 space-y-2.5 border-t border-white/[0.07] pt-6">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-[0.9rem] text-white/75">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#ff8a95]" strokeWidth={2.6} aria-hidden />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
