"use client";

import { useTransition } from "react";
import { renovarRecomendo, deleteRecomendo } from "./actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export type RecomendoData = {
  id: string;
  fechaVencimiento: Date;
  notas: string | null;
  persona: { id: string; nombres: string; apellidos: string };
};

function vencimientoInfo(fecha: Date): {
  label: string;
  variant: "completado" | "pendiente" | "eliminado";
} {
  const dias = Math.ceil((fecha.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  const fechaFmt = new Intl.DateTimeFormat("es-MX", { day: "numeric", month: "short", year: "numeric" }).format(
    fecha
  );

  if (dias < 0) return { label: `Vencido · ${fechaFmt}`, variant: "eliminado" };
  if (dias <= 30) return { label: `Vence ${fechaFmt}`, variant: "pendiente" };
  return { label: `Vigente · ${fechaFmt}`, variant: "completado" };
}

export function RecomendoRow({ recomendo }: { recomendo: RecomendoData }) {
  const [pending, startTransition] = useTransition();
  const vencimiento = vencimientoInfo(recomendo.fechaVencimiento);

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-deep-water/8 bg-white p-3.5">
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="truncate font-serif text-base text-deep-water">
          {recomendo.persona.nombres} {recomendo.persona.apellidos}
        </span>
        {recomendo.notas && (
          <span className="truncate font-sans text-xs text-water-mid">{recomendo.notas}</span>
        )}
      </div>

      <Badge variant={vencimiento.variant}>{vencimiento.label}</Badge>

      <Button
        variant="tertiary"
        disabled={pending}
        onClick={() => startTransition(() => renovarRecomendo(recomendo.id))}
      >
        Renovar +2 años
      </Button>
      <Button
        variant="ghost"
        disabled={pending}
        onClick={() => startTransition(() => deleteRecomendo(recomendo.id))}
      >
        Quitar
      </Button>
    </div>
  );
}
