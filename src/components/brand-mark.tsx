import { Logo } from "./logo";

const FIXED_BRAND_NAME = "Project Blue";

type BrandMarkProps = {
  logoSize?: number;
  className?: string;
  textClassName?: string;
  asHeading?: boolean;
  /** Localized hero title; navbar omits this to keep the fixed brand name. */
  localizedTitle?: string;
};

export function BrandMark({
  logoSize = 28,
  className = "",
  textClassName = "",
  asHeading = false,
  localizedTitle,
}: BrandMarkProps) {
  const TextTag = asHeading ? "h1" : "span";
  const displayText = localizedTitle ?? FIXED_BRAND_NAME;

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      <Logo size={logoSize} />
      <TextTag
        className={`font-semibold tracking-[-0.03em] text-white ${textClassName}`}
      >
        {displayText}
      </TextTag>
    </div>
  );
}
