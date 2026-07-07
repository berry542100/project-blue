"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { useRouter } from "@/i18n/navigation";

export function HeroCta() {
  const t = useTranslations("landing");
  const router = useRouter();
  const [input, setInput] = useState("");

  function handleStartAnalysis(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    sessionStorage.setItem("decisionInput", input);
    sessionStorage.setItem("pendingAnalyze", "true");
    router.push("/decision");
  }

  return (
    <form
      onSubmit={handleStartAnalysis}
      className="mt-12 w-full max-w-md space-y-2.5 sm:mt-14"
    >
      <input
        type="text"
        value={input}
        onChange={(event) => setInput(event.target.value)}
        placeholder={t("inputPlaceholder")}
        className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-2.5 text-sm text-white placeholder:text-white/25 shadow-[0_0_0_1px_rgba(255,255,255,0.03)_inset,0_1px_4px_rgba(0,0,0,0.12)] outline-none backdrop-blur-md transition-[border-color,box-shadow,background-color] duration-300 focus:border-[#3B82F6]/45 focus:bg-white/[0.06] focus:shadow-[0_0_0_1px_rgba(59,130,246,0.15)_inset,0_0_0_3px_rgba(59,130,246,0.07)] sm:py-3"
      />
      <button
        type="submit"
        className="group relative flex w-full items-center justify-center overflow-hidden rounded-xl bg-[#3B82F6] px-4 py-2.5 text-sm font-medium text-white shadow-[0_1px_2px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.12)] transition-[transform,box-shadow,background-color] duration-500 ease-out hover:-translate-y-px hover:bg-[#2563EB] hover:shadow-[0_6px_24px_rgba(59,130,246,0.3),inset_0_1px_0_rgba(255,255,255,0.12)] active:translate-y-0 active:scale-[0.99] sm:py-3"
      >
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/[0.1] to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full"
        />
        <span className="relative">{t("startAnalysis")}</span>
      </button>
    </form>
  );
}
