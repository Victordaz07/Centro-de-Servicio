import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import type { PersonaRowData } from "./types";

function initials(nombres: string, apellidos: string) {
  return `${nombres[0] ?? ""}${apellidos[0] ?? ""}`.toUpperCase();
}

export function PersonaRow({
  persona,
  active,
  query,
}: {
  persona: PersonaRowData;
  active: boolean;
  query?: string;
}) {
  const secondary = [persona.telefono, persona.notas].filter(Boolean).join(" · ");

  return (
    <Link
      href={`/personas/${persona.id}${query ?? ""}`}
      className={`flex min-h-[62px] items-center gap-3 rounded-2xl border bg-white p-2.5 transition ${
        active ? "border-[1.5px] border-living-teal" : "border-deep-water/8"
      } ${persona.deletedAt ? "opacity-60" : ""}`}
    >
      <div
        className={`flex h-[38px] w-[38px] flex-none items-center justify-center rounded-[13px] font-serif text-sm ${
          active ? "bg-living-teal text-linen" : "bg-mist text-water-mid"
        }`}
      >
        {initials(persona.nombres, persona.apellidos)}
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="truncate font-serif text-base leading-[21px] text-deep-water">
          {persona.nombres} {persona.apellidos}
        </span>
        {persona.deletedAt ? (
          <Badge variant="eliminado">Eliminada</Badge>
        ) : secondary ? (
          <span className="truncate font-sans text-xs text-water-mid">{secondary}</span>
        ) : null}
      </div>
    </Link>
  );
}
