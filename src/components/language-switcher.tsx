"use client";

import { useLocale, useTranslations } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";

export function LanguageSwitcher() {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("locales");

  function switchLocale(nextLocale: Locale) {
    if (nextLocale === locale) return;
    router.replace(pathname, { locale: nextLocale });
  }

  return (
    <div className="flex items-center gap-2 text-xs text-white/40">
      <button
        type="button"
        onClick={() => switchLocale("en")}
        className={`transition-colors ${
          locale === "en"
            ? "font-medium text-white"
            : "hover:text-white/70"
        }`}
        aria-current={locale === "en" ? "true" : undefined}
      >
        {t("en")}
      </button>
      <span className="text-white/20" aria-hidden>
        |
      </span>
      <button
        type="button"
        onClick={() => switchLocale("zh")}
        className={`transition-colors ${
          locale === "zh"
            ? "font-medium text-white"
            : "hover:text-white/70"
        }`}
        aria-current={locale === "zh" ? "true" : undefined}
      >
        {t("zh")}
      </button>
    </div>
  );
}
