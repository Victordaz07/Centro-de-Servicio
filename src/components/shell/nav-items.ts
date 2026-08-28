import {
  IconAjustes,
  IconInicio,
  IconOrganizacion,
  IconPersonas,
  IconServicio,
} from "@/components/icons";

export const NAV_ITEMS = [
  { href: "/inicio", label: "Inicio", Icon: IconInicio },
  { href: "/personas", label: "Personas", Icon: IconPersonas },
  { href: "/organizacion", label: "Organización", Icon: IconOrganizacion },
  { href: "/servicio", label: "Servicio", Icon: IconServicio },
  { href: "/ajustes", label: "Ajustes", Icon: IconAjustes },
] as const;
