"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconRing } from "@/components/icons";
import { NAV_ITEMS } from "./nav-items";

export function SideRail() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-y-0 left-0 z-40 hidden w-[88px] flex-col items-center gap-1.5 bg-deep-water py-5 lg:flex">
      <IconRing width={28} height={28} stroke="var(--teal-bright)" className="mb-3" />
      {NAV_ITEMS.map(({ href, label, Icon }) => {
        const active = pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className="flex min-h-[56px] w-16 flex-col items-center justify-center gap-1 rounded-2xl"
            style={{ background: active ? "var(--living-teal)" : "transparent" }}
          >
            <Icon
              width={20}
              height={20}
              stroke={active ? "var(--linen)" : "rgba(220,234,232,.55)"}
            />
            <span
              className="px-1 text-center font-sans text-[10px] font-medium leading-tight"
              style={{ color: active ? "var(--linen)" : "rgba(220,234,232,.55)" }}
            >
              {label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
