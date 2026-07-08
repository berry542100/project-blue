"use client";

import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { SiteHeader } from "@/components/site-header";
import { getSelectedModelId } from "@/lib/model-cookie-client";

type DecisionResult = {
  summary: string;
  options: string[];
  risks: string[];
  recommendation: string;
  confidence: number;
};

type ApiResponse =
  | { success: true; result: string | DecisionResult }
  | { success: false; message: string; code?: string; detail?: string };

const timelineKeys = [
  "goal",
  "options",
  "risks",
  "recommendation",
  "confidence",
] as const;

type TimelineKey = (typeof timelineKeys)[number];

function GoalSkeleton() {
  return (
    <div className="space-y-2.5">
      <div className="skeleton h-2.5 w-full" />
      <div className="skeleton h-2.5 w-[88%]" />
      <div className="skeleton h-2.5 w-[72%]" />
    </div>
  );
}

function OptionsSkeleton() {
  return (
    <div className="space-y-3">
      {[100, 92, 84].map((width) => (
        <div
          key={width}
          className="rounded-lg border border-white/[0.04] bg-white/[0.02] p-3"
        >
          <div className="skeleton mb-2 h-2 w-16" />
          <div className="skeleton h-2" style={{ width: `${width}%` }} />
        </div>
      ))}
    </div>
  );
}

function RisksSkeleton() {
  return (
    <div className="space-y-2.5">
      <div className="skeleton h-2.5 w-full" />
      <div className="skeleton h-2.5 w-[94%]" />
      <div className="skeleton h-2.5 w-[80%]" />
      <div className="skeleton h-2.5 w-[65%]" />
    </div>
  );
}

function RecommendationSkeleton() {
  return (
    <div className="space-y-3">
      <div className="rounded-lg border border-[#3B82F6]/15 bg-[#3B82F6]/[0.04] p-3.5">
        <div className="skeleton mb-2.5 h-2.5 w-24 bg-[#3B82F6]/20" />
        <div className="space-y-2">
          <div className="skeleton h-2 w-full bg-[#3B82F6]/15" />
          <div className="skeleton h-2 w-[90%] bg-[#3B82F6]/15" />
          <div className="skeleton h-2 w-[75%] bg-[#3B82F6]/15" />
        </div>
      </div>
    </div>
  );
}

function ConfidenceSkeleton() {
  return (
    <div className="space-y-2.5">
      <div className="skeleton h-2.5 w-24" />
      <div className="skeleton h-2.5 w-16" />
    </div>
  );
}

function renderSkeleton(key: TimelineKey) {
  switch (key) {
    case "goal":
      return <GoalSkeleton />;
    case "options":
      return <OptionsSkeleton />;
    case "risks":
      return <RisksSkeleton />;
    case "recommendation":
      return <RecommendationSkeleton />;
    case "confidence":
      return <ConfidenceSkeleton />;
  }
}

function renderContent(key: TimelineKey, result: DecisionResult) {
  switch (key) {
    case "goal":
      return (
        <p className="text-[13px] leading-relaxed text-white/70 sm:text-sm">
          {result.summary}
        </p>
      );
    case "options":
      return (
        <ul className="space-y-3">
          {result.options.map((option, index) => (
            <li
              key={`${option}-${index}`}
              className="rounded-lg border border-white/[0.04] bg-white/[0.02] p-3"
            >
              <p className="text-[13px] leading-relaxed text-white/70 sm:text-sm">
                {option}
              </p>
            </li>
          ))}
        </ul>
      );
    case "risks":
      return (
        <ul className="space-y-2">
          {result.risks.map((risk, index) => (
            <li
              key={`${risk}-${index}`}
              className="text-[13px] leading-relaxed text-white/70 sm:text-sm"
            >
              {risk}
            </li>
          ))}
        </ul>
      );
    case "recommendation":
      return (
        <div className="rounded-lg border border-[#3B82F6]/15 bg-[#3B82F6]/[0.04] p-3.5">
          <p className="text-[13px] leading-relaxed text-white/80 sm:text-sm">
            {result.recommendation}
          </p>
        </div>
      );
    case "confidence":
      return (
        <p className="text-2xl font-semibold tabular-nums tracking-tight text-[#3B82F6]">
          {result.confidence}%
        </p>
      );
  }
}

function normalizeResult(parsed: Partial<DecisionResult>): DecisionResult {
  return {
    summary: parsed.summary ?? "",
    options: Array.isArray(parsed.options) ? parsed.options : [],
    risks: Array.isArray(parsed.risks) ? parsed.risks : [],
    recommendation: parsed.recommendation ?? "",
    confidence:
      typeof parsed.confidence === "number" ? parsed.confidence : 0,
  };
}

function parseDecisionResult(raw: string | DecisionResult): DecisionResult {
  if (typeof raw !== "string") {
    return normalizeResult(raw);
  }

  let cleaned = raw.trim();
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/, "").replace(/\s*```$/, "");
  }

  return normalizeResult(JSON.parse(cleaned) as Partial<DecisionResult>);
}

export default function DecisionPage() {
  const t = useTranslations("decision");
  const tErrors = useTranslations("errors");

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<DecisionResult | null>(null);
  const loadingRef = useRef(false);
  const hydratedRef = useRef(false);

  async function runAnalysis(text: string) {
    const trimmed = text.trim();
    if (!trimmed || loadingRef.current) return;

    loadingRef.current = true;
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/decision", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          input: trimmed,
          model: getSelectedModelId(),
        }),
      });

      let data: ApiResponse;

      try {
        data = (await response.json()) as ApiResponse;
      } catch {
        setError(tErrors("generic"));
        return;
      }

      if (!response.ok || !data.success) {
        const message =
          !data.success && data.code === "AI_CONFIGURATION_ERROR"
            ? data.detail ?? tErrors("notConfigured")
            : !data.success && data.message === "AI request failed"
              ? tErrors("aiRequestFailed")
              : !data.success && data.message === "Invalid AI response format"
                ? tErrors("parseFailed")
                : tErrors("generic");
        setError(message);
        return;
      }

      setResult(
        typeof data.result === "string"
          ? parseDecisionResult(data.result)
          : normalizeResult(data.result),
      );
    } catch (err) {
      setError(
        err instanceof SyntaxError
          ? tErrors("parseFailed")
          : tErrors("generic"),
      );
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  }

  async function analyzeDecision(
    event?: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>,
  ) {
    event?.preventDefault();
    await runAnalysis(input);
  }

  useEffect(() => {
    if (hydratedRef.current) return;
    hydratedRef.current = true;

    const saved = sessionStorage.getItem("decisionInput") ?? "";
    const pending = sessionStorage.getItem("pendingAnalyze") === "true";

    if (!saved && !pending) return;

    sessionStorage.removeItem("decisionInput");
    sessionStorage.removeItem("pendingAnalyze");

    if (saved) {
      setInput(saved);
    }

    if (pending && saved.trim()) {
      void runAnalysis(saved.trim());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run once on mount with sessionStorage payload
  }, []);

  const showSkeleton = loading || !result;

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
        <SiteHeader showHomeLink />

        <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-12 sm:px-8 sm:py-16">
          <section>
            <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.13em] text-white/25">
              {t("decisionInput")}
            </p>
            <form onSubmit={analyzeDecision}>
              <textarea
                rows={5}
                value={input}
                onChange={(event) => setInput(event.target.value)}
                disabled={loading}
                placeholder={t("inputPlaceholder")}
                className="w-full resize-none rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-3.5 text-sm leading-relaxed text-white placeholder:text-white/25 shadow-[0_0_0_1px_rgba(255,255,255,0.03)_inset,0_1px_4px_rgba(0,0,0,0.12)] outline-none backdrop-blur-md transition-[border-color,box-shadow,background-color] duration-300 focus:border-[#3B82F6]/45 focus:bg-white/[0.06] focus:shadow-[0_0_0_1px_rgba(59,130,246,0.15)_inset,0_0_0_3px_rgba(59,130,246,0.07)] disabled:cursor-not-allowed disabled:opacity-50 sm:min-h-[140px] sm:py-4"
              />
              <button
                type="submit"
                disabled={loading}
                className="group relative mt-3 w-full overflow-hidden rounded-xl bg-[#3B82F6] px-4 py-2.5 text-sm font-medium text-white shadow-[0_1px_2px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.12)] transition-[transform,box-shadow,background-color] duration-500 ease-out hover:-translate-y-px hover:bg-[#2563EB] hover:shadow-[0_6px_24px_rgba(59,130,246,0.3),inset_0_1px_0_rgba(255,255,255,0.12)] active:translate-y-0 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-[0_1px_2px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.12)] sm:py-3"
              >
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/[0.1] to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full group-disabled:translate-x-full"
                />
                <span className="relative">
                  {loading ? t("analyzing") : t("analyzeDecision")}
                </span>
              </button>
            </form>

            {error && (
              <div
                role="alert"
                className="mt-3 rounded-xl border border-red-500/20 bg-red-500/[0.06] px-4 py-3 text-sm text-red-300/90 shadow-[0_0_0_1px_rgba(239,68,68,0.08)_inset] backdrop-blur-sm"
              >
                {error}
              </div>
            )}
          </section>

          <section className="mt-16 sm:mt-20">
            <p className="mb-8 text-[11px] font-medium uppercase tracking-[0.13em] text-white/25 sm:mb-10">
              {t("analysisTimeline")}
            </p>

            <div className="relative space-y-4 sm:space-y-5">
              <div
                aria-hidden
                className="absolute bottom-6 left-[11px] top-6 w-px bg-gradient-to-b from-white/[0.08] via-white/[0.06] to-transparent sm:left-[13px]"
              />

              {timelineKeys.map((key, index) => (
                <article key={key} className="relative pl-9 sm:pl-10">
                  <div
                    aria-hidden
                    className="absolute left-0 top-5 flex size-[22px] items-center justify-center sm:top-6 sm:size-[26px]"
                  >
                    <div className="size-[9px] rounded-full border border-[#3B82F6]/40 bg-[#3B82F6]/20 shadow-[0_0_12px_rgba(59,130,246,0.25)] sm:size-[10px]" />
                  </div>

                  <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.02)_inset] backdrop-blur-sm sm:p-6">
                    <div className="mb-4 flex items-center justify-between sm:mb-5">
                      <h2 className="text-[15px] font-medium tracking-[-0.02em] text-white">
                        {t(`timeline.${key}`)}
                      </h2>
                      <span className="text-[11px] tabular-nums tracking-wider text-white/20">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>
                    {showSkeleton
                      ? renderSkeleton(key)
                      : renderContent(key, result!)}
                  </div>
                </article>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
