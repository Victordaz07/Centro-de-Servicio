"use client";

import { useTransition } from "react";
import { registrarVisita, quitarAsignacion, restoreAsignacion } from "./actions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export type AsignacionData = {
  id: string;
  ultimoContacto: Date | null;
  deletedAt: Date | null;
  familia: { id: string; nombre: string };
  companerismo: { id: string; nombres: string };
};

function contactoInfo(ultimoContacto: Date | null): {
  label: string;
  variant: "completado" | "pendiente" | "eliminado";
} {
  if (!ultimoContacto) return { label: "Sin visitas", variant: "eliminado" };

  const dias = Math.floor((Date.now() - ultimoContacto.getTime()) / (1000 * 60 * 60 * 24));
  if (dias <= 0) return { label: "Visita hoy", variant: "completado" };
  if (dias <= 30) return { label: `Hace ${dias} día${dias === 1 ? "" : "s"}`, variant: "completado" };
  if (dias <= 90) return { label: `Hace ${dias} días`, variant: "pendiente" };
  return { label: `Hace ${dias} días`, variant: "eliminado" };
}

export function AsignacionRow({ asignacion }: { asignacion: AsignacionData }) {
  const [pending, startTransition] = useTransition();
  const contacto = contactoInfo(asignacion.ultimoContacto);

  return (
    <div
      className={`flex flex-wrap items-center gap-3 rounded-2xl border border-deep-water/8 bg-white p-3.5 ${
        asignacion.deletedAt ? "opacity-60" : ""
      }`}
    >
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="truncate font-serif text-base text-deep-water">
          {asignacion.familia.nombre}
        </span>
        <span className="truncate font-sans text-xs text-water-mid">
          {asignacion.companerismo.nombres}
        </span>
      </div>

      <Badge variant={contacto.variant}>{contacto.label}</Badge>

      {asignacion.deletedAt ? (
        <Button
          variant="tertiary"
          disabled={pending}
          onClick={() => startTransition(() => restoreAsignacion(asignacion.id))}
        >
          Restaurar
        </Button>
      ) : (
        <>
          <Button
            variant="tertiary"
            disabled={pending}
            onClick={() => startTransition(() => registrarVisita(asignacion.id))}
          >
            Registrar visita
          </Button>
          <Button
            variant="ghost"
            disabled={pending}
            onClick={() => startTransition(() => quitarAsignacion(asignacion.id))}
          >
            Quitar
          </Button>
        </>
      )}
    </div>
  );
}
