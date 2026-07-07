import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { BrandMark } from "@/components/brand-mark";
import { HeroCta } from "@/components/hero-cta";
import { SiteHeader } from "@/components/site-header";

type HomePageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: HomePageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });

  return {
    title: t("homeTitle"),
    description: t("homeDescription"),
  };
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("landing");
  const tBrand = await getTranslations("brand");

  const popularDecisions = [
    { emoji: "🚗", label: t("popular.buyACar") },
    { emoji: "💼", label: t("popular.career") },
    { emoji: "💰", label: t("popular.finance") },
    { emoji: "❤️", label: t("popular.relationship") },
    { emoji: "✈", label: t("popular.travel") },
    { emoji: "🚀", label: t("popular.startup") },
  ];

  const steps = [
    {
      number: "01",
      title: t("steps.step1Title"),
      description: t("steps.step1Description"),
    },
    {
      number: "02",
      title: t("steps.step2Title"),
      description: t("steps.step2Description"),
    },
    {
      number: "03",
      title: t("steps.step3Title"),
      description: t("steps.step3Description"),
    },
    {
      number: "04",
      title: t("steps.step4Title"),
      description: t("steps.step4Description"),
    },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050816]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_80%_100%,rgba(59,130,246,0.04),transparent)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_30%,black,transparent)]"
      />

      <div className="relative z-10 flex min-h-screen flex-col">
        <SiteHeader />

        <section className="relative flex flex-1 flex-col items-center justify-center px-6 pb-32 pt-20 sm:px-8 sm:pb-40 sm:pt-24">
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 h-[400px] w-[min(100%,480px)] -translate-x-1/2 -translate-y-[55%] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.16)_0%,rgba(59,130,246,0.05)_40%,transparent_70%)] blur-2xl sm:h-[460px] sm:w-[540px]"
          />

          <main className="relative mx-auto flex w-full max-w-3xl flex-col items-center text-center">
            <div className="max-w-md space-y-4 sm:space-y-5">
              <div className="flex justify-center">
                <BrandMark
                  asHeading
                  localizedTitle={tBrand("title")}
                  logoSize={36}
                  textClassName="text-3xl sm:text-4xl md:text-[2.75rem] md:leading-none"
                />
              </div>

              <div className="space-y-3">
                <p className="text-[15px] font-medium tracking-[-0.02em] text-white/80 sm:text-base">
                  {t("sloganThink")}{" "}
                  <span className="text-white/25" aria-hidden>
                    •
                  </span>{" "}
                  {t("sloganAct")}
                </p>
                <p className="mx-auto max-w-xs text-[13px] leading-[1.65] text-white/40 sm:max-w-sm sm:text-sm sm:leading-relaxed">
                  {t("description")}
                </p>
              </div>
            </div>

            <HeroCta />

            <div className="mt-14 w-full sm:mt-16">
              <p className="mb-5 text-[11px] font-medium uppercase tracking-[0.13em] text-white/25 sm:mb-6">
                {t("popularDecisions")}
              </p>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-2.5">
                {popularDecisions.map(({ emoji, label }) => (
                  <button
                    key={label}
                    type="button"
                    className="flex items-center justify-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-2.5 text-xs text-white/55 shadow-[0_0_0_1px_rgba(255,255,255,0.02)_inset] backdrop-blur-md transition-all duration-300 hover:border-white/[0.14] hover:bg-white/[0.07] hover:text-white/90 hover:shadow-[0_0_0_1px_rgba(255,255,255,0.05)_inset,0_2px_12px_rgba(0,0,0,0.1)] active:scale-[0.98] sm:py-3 sm:text-[13px]"
                  >
                    <span className="text-sm leading-none" aria-hidden>
                      {emoji}
                    </span>
                    <span>{label}</span>
                  </button>
                ))}
              </div>
            </div>
          </main>
        </section>

        <section className="border-t border-white/[0.05] px-6 py-28 sm:px-8 sm:py-36">
          <div className="mx-auto w-full max-w-3xl">
            <div className="mb-16 text-center sm:mb-20">
              <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.13em] text-white/25">
                {t("howItWorks")}
              </p>
              <h2 className="text-xl font-semibold tracking-[-0.03em] text-white sm:text-2xl">
                {t("howItWorksTitle")}
              </h2>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 sm:gap-5">
              {steps.map(({ number, title, description }) => (
                <div
                  key={number}
                  className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.02)_inset] backdrop-blur-sm sm:p-6"
                >
                  <span className="text-xs font-medium tabular-nums tracking-wider text-[#3B82F6]/70">
                    {number}
                  </span>
                  <h3 className="mt-3 text-[15px] font-medium tracking-[-0.02em] text-white">
                    {title}
                  </h3>
                  <p className="mt-2 text-[13px] leading-relaxed text-white/40">
                    {description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <footer className="border-t border-white/[0.05] px-6 py-12 sm:px-8">
          <div className="mx-auto flex w-full max-w-3xl flex-col items-center justify-between gap-3 text-center sm:flex-row sm:text-left">
            <p className="text-xs text-white/30">
              © {new Date().getFullYear()} Project Blue
            </p>
            <p className="text-xs text-white/20">{t("footerTagline")}</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
