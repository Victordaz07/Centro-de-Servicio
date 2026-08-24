"use client";

import { useTransition } from "react";
import { toggleContactada, deleteReferencia } from "./actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export type ReferenciaData = {
  id: string;
  fecha: Date;
  contactada: boolean;
  notas: string | null;
  personaQueRefiere: { id: string; nombres: string; apellidos: string };
  personaReferida: { id: string; nombres: string; apellidos: string } | null;
};

export function ReferenciaRow({ referencia }: { referencia: ReferenciaData }) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-deep-water/8 bg-white p-3.5">
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="truncate font-serif text-base text-deep-water">
          {referencia.personaReferida
            ? `${referencia.personaReferida.nombres} ${referencia.personaReferida.apellidos}`
            : "Sin persona vinculada"}
        </span>
        <span className="truncate font-sans text-xs text-water-mid">
          Refiere: {referencia.personaQueRefiere.nombres} {referencia.personaQueRefiere.apellidos}
          {referencia.notas && ` · ${referencia.notas}`}
        </span>
      </div>

      <Badge variant={referencia.contactada ? "completado" : "eliminado"}>
        {referencia.contactada ? "Contactada" : "Sin contactar"}
      </Badge>

      <Button
        variant="tertiary"
        disabled={pending}
        onClick={() => startTransition(() => toggleContactada(referencia.id, !referencia.contactada))}
      >
        {referencia.contactada ? "Marcar sin contactar" : "Marcar contactada"}
      </Button>
      <Button
        variant="ghost"
        disabled={pending}
        onClick={() => startTransition(() => deleteReferencia(referencia.id))}
      >
        Quitar
      </Button>
    </div>
  );
}
