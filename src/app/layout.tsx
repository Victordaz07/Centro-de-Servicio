import type { Metadata, Viewport } from "next";
import { Fraunces, Karla } from "next/font/google";
import { Providers } from "@/components/providers";
import { ShellGate } from "@/components/shell/shell-gate";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const karla = Karla({
  variable: "--font-karla",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Centro de Servicio",
  description: "Secretario, Gather y BautizApp unificados sobre un mismo modelo de datos.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Centro de Servicio",
  },
};

export const viewport: Viewport = {
  themeColor: "#0e3b43",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${fraunces.variable} ${karla.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-linen font-sans text-ink">
        <Providers>
          <ShellGate>{children}</ShellGate>
        </Providers>
      </body>
    </html>
  );
}
