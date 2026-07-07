"use client";

import { BrandMark } from "@/components/brand-mark";
import { LanguageSwitcher } from "@/components/language-switcher";
import { Link } from "@/i18n/navigation";

type SiteHeaderProps = {
  showHomeLink?: boolean;
};

export function SiteHeader({ showHomeLink = false }: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-white/[0.05] bg-[#050816]/80 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-3xl items-center justify-between px-6 py-4 sm:px-8">
        {showHomeLink ? (
          <Link href="/" className="transition-opacity hover:opacity-80">
            <BrandMark logoSize={24} textClassName="text-sm" />
          </Link>
        ) : (
          <BrandMark logoSize={24} textClassName="text-sm" />
        )}
        <div className="flex items-center gap-3">
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
}
