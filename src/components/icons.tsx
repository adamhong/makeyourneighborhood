type IconProps = { className?: string };

export function PinIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5Z" />
    </svg>
  );
}

export function HeartIcon({ className = "h-4 w-4", filled = false }: IconProps & { filled?: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={2.2}
      strokeLinejoin="round"
      aria-hidden
      className={className}
    >
      <path d="M12 20.5s-7.5-4.6-9.2-9.4C1.6 7.6 3.9 4 7.4 4c2 0 3.5 1.1 4.6 2.7C13.1 5.1 14.6 4 16.6 4c3.5 0 5.8 3.6 4.6 7.1-1.7 4.8-9.2 9.4-9.2 9.4Z" />
    </svg>
  );
}

export function ArrowRightIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden className={className}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export function ShareIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden className={className}>
      <path d="M12 3v12M7 8l5-5 5 5M5 14v5a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-5" />
    </svg>
  );
}

export function LogoMark({ className = "h-9 w-9" }: IconProps) {
  return (
    <svg viewBox="0 0 40 40" aria-hidden className={className}>
      <path d="M20 2C11.7 2 5 8.6 5 16.8 5 27.6 20 38 20 38s15-10.4 15-21.2C35 8.6 28.3 2 20 2Z" fill="var(--color-tomato)" />
      <path d="M12.5 18.5 20 12l7.5 6.5V26a1 1 0 0 1-1 1h-4v-5h-5v5h-4a1 1 0 0 1-1-1v-7.5Z" fill="var(--color-paper)" />
      <circle cx="30" cy="8" r="4" fill="var(--color-sun)" />
    </svg>
  );
}
