"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "./nav-items";

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex justify-around bg-deep-water px-2 pt-2.5 pb-[calc(env(safe-area-inset-bottom)+10px)] lg:hidden">
      {NAV_ITEMS.map(({ href, label, Icon }) => {
        const active = pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className="flex min-h-[44px] min-w-[44px] flex-col items-center justify-center gap-1"
          >
            <Icon
              width={22}
              height={22}
              stroke={active ? "var(--teal-bright)" : "rgba(220,234,232,.5)"}
            />
            <span
              className="font-sans text-[10px] font-medium"
              style={{ color: active ? "var(--teal-bright)" : "rgba(220,234,232,.5)" }}
            >
              {label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
