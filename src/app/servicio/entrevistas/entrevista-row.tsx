"use client";

import { useTransition } from "react";
import { updateEstadoEntrevista, deleteEntrevista, restoreEntrevista } from "./actions";
import { EstadoEntrevista } from "@/generated/prisma/enums";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export type EntrevistaData = {
  id: string;
  motivo: string;
  fecha: Date | null;
  estado: EstadoEntrevista;
  deletedAt: Date | null;
  persona: { id: string; nombres: string; apellidos: string };
};

const ESTADO_BADGE = {
  PENDIENTE: "pendiente",
  AGENDADA: "en-curso",
  HECHA: "completado",
} as const;

const ESTADO_LABEL = {
  PENDIENTE: "Pendiente",
  AGENDADA: "Agendada",
  HECHA: "Hecha",
} as const;

export function EntrevistaRow({ entrevista }: { entrevista: EntrevistaData }) {
  const [pending, startTransition] = useTransition();

  return (
    <div
      className={`flex flex-wrap items-center gap-3 rounded-2xl border border-deep-water/8 bg-white p-3.5 ${
        entrevista.deletedAt ? "opacity-60" : ""
      }`}
    >
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="truncate font-serif text-base text-deep-water">
          {entrevista.persona.nombres} {entrevista.persona.apellidos}
        </span>
        <span className="truncate font-sans text-xs text-water-mid">
          {entrevista.motivo}
          {entrevista.fecha &&
            ` · ${new Intl.DateTimeFormat("es-MX", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" }).format(entrevista.fecha)}`}
        </span>
      </div>

      <Badge variant={ESTADO_BADGE[entrevista.estado]}>{ESTADO_LABEL[entrevista.estado]}</Badge>

      {entrevista.deletedAt ? (
        <Button
          variant="tertiary"
          disabled={pending}
          onClick={() => startTransition(() => restoreEntrevista(entrevista.id))}
        >
          Restaurar
        </Button>
      ) : (
        <>
          {entrevista.estado !== "AGENDADA" && (
            <Button
              variant="tertiary"
              disabled={pending}
              onClick={() =>
                startTransition(() => updateEstadoEntrevista(entrevista.id, EstadoEntrevista.AGENDADA))
              }
            >
              Agendar
            </Button>
          )}
          {entrevista.estado !== "HECHA" && (
            <Button
              variant="tertiary"
              disabled={pending}
              onClick={() =>
                startTransition(() => updateEstadoEntrevista(entrevista.id, EstadoEntrevista.HECHA))
              }
            >
              Marcar hecha
            </Button>
          )}
          <Button
            variant="ghost"
            disabled={pending}
            onClick={() => startTransition(() => deleteEntrevista(entrevista.id))}
          >
            Quitar
          </Button>
        </>
      )}
    </div>
  );
}
