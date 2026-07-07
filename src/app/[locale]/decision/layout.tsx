import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing, type Locale } from "@/i18n/routing";

type DecisionLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: DecisionLayoutProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });

  return {
    title: t("decisionTitle"),
    description: t("decisionDescription"),
  };
}

export default async function DecisionLayout({
  children,
  params,
}: DecisionLayoutProps) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as Locale)) {
    return children;
  }

  setRequestLocale(locale);
  return children;
}
