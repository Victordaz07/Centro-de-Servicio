import type { ReactNode } from "react";

export function PageHero({
  eyebrow,
  title,
  subtitle,
  actions,
  image,
  children,
}: {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  actions?: ReactNode;
  /** Cabecera del sistema de arte low-poly (object-position: center right). */
  image?: string;
  children?: ReactNode;
}) {
  return (
    <div
      className="relative overflow-hidden bg-deep-water bg-cover bg-center px-6 pt-8 pb-6 lg:px-10 lg:pt-10"
      style={image ? { backgroundImage: `url(${image})`, backgroundPosition: "center right" } : undefined}
    >
      {image ? (
        <div className="pointer-events-none absolute inset-0 bg-deep-water/[.18]" />
      ) : (
        <svg
          viewBox="0 0 200 200"
          className="pointer-events-none absolute -top-16 -right-14 h-56 w-56 opacity-[.15]"
          fill="none"
          stroke="var(--mist)"
        >
          <circle cx="100" cy="100" r="26" />
          <circle cx="100" cy="100" r="48" />
          <circle cx="100" cy="100" r="72" />
          <circle cx="100" cy="100" r="94" />
        </svg>
      )}
      <div className="relative flex flex-col gap-3">
        {eyebrow && (
          <span className="font-sans text-[11px] font-medium tracking-[0.16em] text-mist/70 uppercase">
            {eyebrow}
          </span>
        )}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h1 className="font-serif text-[28px] leading-[34px] text-linen lg:text-[32px] lg:leading-[38px]">
            {title}
          </h1>
          {actions && <div className="flex gap-2">{actions}</div>}
        </div>
        {subtitle && <p className="font-sans text-sm text-mist/80">{subtitle}</p>}
        {children}
      </div>
    </div>
  );
}
