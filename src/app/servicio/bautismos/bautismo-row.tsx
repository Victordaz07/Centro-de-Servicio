"use client";

import Link from "next/link";
import { useTransition } from "react";
import { deleteBautismo } from "./actions";
import { IconTrash } from "@/components/icons";

export type BautismoRowData = {
  id: string;
  fecha: Date;
  persona: { id: string; nombres: string; apellidos: string };
  hitosTotal: number;
  hitosCompletados: number;
};

export function BautismoRow({ bautismo }: { bautismo: BautismoRowData }) {
  const [pending, startTransition] = useTransition();
  const progreso =
    bautismo.hitosTotal > 0 ? Math.round((bautismo.hitosCompletados / bautismo.hitosTotal) * 100) : 0;

  return (
    <Link
      href={`/personas/${bautismo.persona.id}`}
      className="flex items-center gap-3 rounded-2xl border border-deep-water/8 bg-white p-3.5 transition hover:border-living-teal"
    >
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="truncate font-serif text-base text-deep-water">
          {bautismo.persona.nombres} {bautismo.persona.apellidos}
        </span>
        <span className="font-sans text-xs text-water-mid">
          {new Intl.DateTimeFormat("es-MX", { day: "numeric", month: "short", year: "numeric" }).format(
            bautismo.fecha
          )}{" "}
          · {bautismo.hitosCompletados} de {bautismo.hitosTotal} hitos
        </span>
      </div>

      <div className="h-1.5 w-20 flex-none overflow-hidden rounded-full bg-mist">
        <div className="h-full rounded-full bg-living-teal" style={{ width: `${progreso}%` }} />
      </div>

      <button
        type="button"
        disabled={pending}
        onClick={(e) => {
          e.preventDefault();
          startTransition(() => deleteBautismo(bautismo.id, bautismo.persona.id));
        }}
        className="flex h-8 w-8 flex-none items-center justify-center rounded-full text-rojo/70 hover:bg-rojo-light"
        aria-label="Eliminar bautismo"
      >
        <IconTrash width={15} height={15} stroke="currentColor" />
      </button>
    </Link>
  );
}
