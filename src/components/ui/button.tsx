import type { ButtonHTMLAttributes } from "react";

const VARIANTS = {
  primary:
    "bg-dawn-coral text-cream hover:opacity-90 disabled:bg-line disabled:text-ink/40 disabled:opacity-100",
  secondary:
    "border-[1.5px] border-living-teal text-water-mid hover:bg-mist disabled:border-line disabled:text-ink/40",
  tertiary: "bg-mist text-water-mid hover:bg-mist/70 disabled:bg-line disabled:text-ink/40",
  ghost: "text-rojo hover:bg-rojo-light",
} as const;

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof VARIANTS;
};

export function Button({ variant = "primary", className = "", ...props }: Props) {
  return (
    <button
      className={`inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl px-4 font-sans text-sm font-medium transition disabled:cursor-not-allowed ${VARIANTS[variant]} ${className}`}
      {...props}
    />
  );
}
