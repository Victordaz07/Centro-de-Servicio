"use client";

import { useTransition } from "react";
import { updateEstadoLlamamiento, deleteLlamamiento, restoreLlamamiento } from "./actions";
import { EstadoLlamamiento } from "@/generated/prisma/enums";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export type LlamamientoData = {
  id: string;
  llamamientoPropuesto: string;
  estado: EstadoLlamamiento;
  deletedAt: Date | null;
  persona: { id: string; nombres: string; apellidos: string };
};

const ESTADO_BADGE = {
  ORANDO: "neutro",
  PROPUESTO: "pendiente",
  EXTENDIDO: "completado",
} as const;

const ESTADO_LABEL = {
  ORANDO: "Orando",
  PROPUESTO: "Propuesto",
  EXTENDIDO: "Extendido",
} as const;

export function LlamamientoRow({ llamamiento }: { llamamiento: LlamamientoData }) {
  const [pending, startTransition] = useTransition();

  return (
    <div
      className={`flex flex-wrap items-center gap-3 rounded-2xl border border-deep-water/8 bg-white p-3.5 ${
        llamamiento.deletedAt ? "opacity-60" : ""
      }`}
    >
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="truncate font-serif text-base text-deep-water">
          {llamamiento.persona.nombres} {llamamiento.persona.apellidos}
        </span>
        <span className="truncate font-sans text-xs text-water-mid">
          {llamamiento.llamamientoPropuesto}
        </span>
      </div>

      <Badge variant={ESTADO_BADGE[llamamiento.estado]}>{ESTADO_LABEL[llamamiento.estado]}</Badge>

      {llamamiento.deletedAt ? (
        <Button
          variant="tertiary"
          disabled={pending}
          onClick={() => startTransition(() => restoreLlamamiento(llamamiento.id))}
        >
          Restaurar
        </Button>
      ) : (
        <>
          {llamamiento.estado !== "PROPUESTO" && (
            <Button
              variant="tertiary"
              disabled={pending}
              onClick={() =>
                startTransition(() =>
                  updateEstadoLlamamiento(llamamiento.id, EstadoLlamamiento.PROPUESTO)
                )
              }
            >
              Proponer
            </Button>
          )}
          {llamamiento.estado !== "EXTENDIDO" && (
            <Button
              variant="tertiary"
              disabled={pending}
              onClick={() =>
                startTransition(() =>
                  updateEstadoLlamamiento(llamamiento.id, EstadoLlamamiento.EXTENDIDO)
                )
              }
            >
              Extender
            </Button>
          )}
          <Button
            variant="ghost"
            disabled={pending}
            onClick={() => startTransition(() => deleteLlamamiento(llamamiento.id))}
          >
            Quitar
          </Button>
        </>
      )}
    </div>
  );
}
