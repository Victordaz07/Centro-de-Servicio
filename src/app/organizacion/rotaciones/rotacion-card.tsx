"use client";

import { useTransition } from "react";
import {
  deleteRotacion,
  restoreRotacion,
  addPersonaRotacion,
  removePersonaRotacion,
  rotarTurno,
} from "./actions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PersonaAutocomplete } from "@/components/persona-autocomplete";
import { IconTrash } from "@/components/icons";

export type RotacionData = {
  id: string;
  tarea: string;
  deletedAt: Date | null;
  turnoActual: number;
  personas: string[];
};

export function RotacionCard({
  rotacion,
  personasMap,
}: {
  rotacion: RotacionData;
  personasMap: Record<string, { nombres: string; apellidos: string }>;
}) {
  const [pending, startTransition] = useTransition();

  function handleAdd(formData: FormData) {
    const personaId = String(formData.get("personaId") ?? "");
    startTransition(() => addPersonaRotacion(rotacion.id, personaId));
  }

  return (
    <Card className={`flex flex-col gap-3 ${rotacion.deletedAt ? "opacity-60" : ""}`}>
      <div className="flex items-start justify-between gap-3">
        <span className="font-serif text-lg text-deep-water">{rotacion.tarea}</span>
        {rotacion.deletedAt ? (
          <Button
            variant="tertiary"
            disabled={pending}
            onClick={() => startTransition(() => restoreRotacion(rotacion.id))}
          >
            Restaurar
          </Button>
        ) : (
          <button
            type="button"
            disabled={pending}
            onClick={() => startTransition(() => deleteRotacion(rotacion.id))}
            className="flex h-8 w-8 flex-none items-center justify-center rounded-full text-rojo/70 hover:bg-rojo-light"
            aria-label="Eliminar rotación"
          >
            <IconTrash width={15} height={15} stroke="currentColor" />
          </button>
        )}
      </div>

      {!rotacion.deletedAt && (
        <>
          {rotacion.personas.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {rotacion.personas.map((id, i) => {
                const persona = personasMap[id];
                const activo = i === rotacion.turnoActual;
                return (
                  <span
                    key={id}
                    className={`flex items-center gap-2 rounded-full px-3 py-1.5 font-sans text-xs font-medium ${
                      activo ? "bg-living-teal text-linen" : "bg-mist text-water-mid"
                    }`}
                  >
                    {persona ? `${persona.nombres} ${persona.apellidos}` : "—"}
                    <button
                      type="button"
                      disabled={pending}
                      onClick={() => startTransition(() => removePersonaRotacion(rotacion.id, id))}
                      className={activo ? "text-linen/70 hover:text-white" : "text-water-mid/60 hover:text-rojo"}
                    >
                      ×
                    </button>
                  </span>
                );
              })}
            </div>
          )}

          <form action={handleAdd} className="flex flex-col gap-2 sm:flex-row">
            <div className="flex-1">
              <PersonaAutocomplete name="personaId" placeholder="Agregar persona…" />
            </div>
            <Button type="submit" variant="tertiary" disabled={pending}>
              + Agregar
            </Button>
            {rotacion.personas.length > 1 && (
              <Button
                type="button"
                variant="tertiary"
                disabled={pending}
                onClick={() => startTransition(() => rotarTurno(rotacion.id))}
              >
                Rotar turno
              </Button>
            )}
          </form>
        </>
      )}
    </Card>
  );
}
