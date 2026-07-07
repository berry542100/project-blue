type SkeletonLinesProps = {
  lines?: number;
};

export function SkeletonLines({ lines = 3 }: SkeletonLinesProps) {
  const widths = ["w-full", "w-[88%]", "w-[72%]", "w-[60%]", "w-[80%]"];

  return (
    <div className="space-y-2.5" aria-hidden>
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className={`h-2 animate-pulse rounded-full bg-white/[0.07] ${widths[index % widths.length]}`}
          style={{ animationDelay: `${index * 120}ms` }}
        />
      ))}
    </div>
  );
}
