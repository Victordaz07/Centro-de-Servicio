import type { ReactNode } from "react";
import Image from "next/image";

export function EmptyState({
  icon,
  illustration = false,
  title,
  description,
  action,
}: {
  icon?: ReactNode;
  /** Usa la ilustración low-poly del sistema de arte en vez del ícono. */
  illustration?: boolean;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-[20px] border border-dashed border-deep-water/15 bg-white/60 px-8 py-16 text-center">
      {illustration ? (
        <Image
          src="/art/estado-vacio.webp"
          alt=""
          width={260}
          height={195}
          className="h-auto w-[260px] max-w-full"
        />
      ) : (
        icon && (
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-mist text-water-mid">
            {icon}
          </div>
        )
      )}
      <div className="flex flex-col gap-2">
        <p className="font-serif text-xl text-deep-water">{title}</p>
        {description && (
          <p className="max-w-sm text-sm text-water-mid">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}
