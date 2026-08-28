import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Centro de Servicio",
    short_name: "Centro de Servicio",
    description: "Secretario, Gather y BautizApp unificados sobre un mismo modelo de datos.",
    start_url: "/",
    display: "standalone",
    background_color: "#f7f1e4",
    theme_color: "#0e3b43",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
