import type { ReactNode } from "react";

const VARIANTS = {
  completado: "bg-sage/16 text-sage",
  pendiente: "bg-amber/16 text-amber",
  "en-curso": "bg-living-teal text-linen",
  eliminado: "bg-rojo/12 text-rojo line-through",
  neutro: "bg-mist text-water-mid",
} as const;

export function Badge({
  variant = "neutro",
  children,
}: {
  variant?: keyof typeof VARIANTS;
  children: ReactNode;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 font-sans text-[10px] font-medium tracking-[0.08em] uppercase ${VARIANTS[variant]}`}
    >
      {children}
    </span>
  );
}
