import type { HTMLAttributes } from "react";

export function Card({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`rounded-[18px] border border-deep-water/8 bg-white p-4 ${className}`}
      {...props}
    />
  );
}
