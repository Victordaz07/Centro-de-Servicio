"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { BottomNav } from "./bottom-nav";
import { SideRail } from "./side-rail";

const NO_SHELL_PATHS = ["/login"];

export function ShellGate({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const showShell = !NO_SHELL_PATHS.some((path) => pathname.startsWith(path));

  if (!showShell) return <>{children}</>;

  return (
    <div className="flex min-h-full flex-1 flex-col lg:pl-[88px]">
      <SideRail />
      <div className="flex-1 pb-[calc(64px+env(safe-area-inset-bottom))] lg:pb-0">
        {children}
      </div>
      <BottomNav />
    </div>
  );
}
