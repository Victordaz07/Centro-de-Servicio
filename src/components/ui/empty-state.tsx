import type { ReactNode } from "react";

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-[20px] border border-dashed border-deep-water/15 bg-white/60 px-8 py-16 text-center">
      {icon && (
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-mist text-water-mid">
          {icon}
        </div>
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
