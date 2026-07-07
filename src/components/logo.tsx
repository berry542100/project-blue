type LogoProps = {
  size?: number;
  className?: string;
};

export function Logo({ size = 32, className }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <rect width="32" height="32" rx="7.5" fill="#3B82F6" />
      <path
        fill="#FFFFFF"
        d="M10.25 7.5h2.75v17h-2.75V7.5zm2.75 0h5.25c2.9 0 4.75 1.85 4.75 4.35s-1.85 4.35-4.75 4.35h-5.25V7.5z"
      />
      <path
        fill="#FFFFFF"
        d="M13 16.35h4.65c2.35 0 3.85 1.25 3.85 3.05s-1.5 3.05-3.85 3.05H13v-6.1z"
      />
      <path
        fill="#FFFFFF"
        d="M13 20.95h5.05c2.55 0 4.2 1.35 4.2 3.45s-1.65 3.45-4.2 3.45H13v-6.9z"
      />
    </svg>
  );
}
