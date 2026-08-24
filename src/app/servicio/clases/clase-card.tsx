"use client";

import { useTransition } from "react";
import { deleteClase, restoreClase, addSuplente, removeSuplente, rotarSuplente } from "./actions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PersonaAutocomplete } from "@/components/persona-autocomplete";
import { IconTrash } from "@/components/icons";

export type ClaseData = {
  id: string;
  nombre: string;
  deletedAt: Date | null;
  turnoActualSuplente: number;
  suplentes: string[];
  maestro: { id: string; nombres: string; apellidos: string } | null;
};

export function ClaseCard({
  clase,
  personasMap,
}: {
  clase: ClaseData;
  personasMap: Record<string, { nombres: string; apellidos: string }>;
}) {
  const [pending, startTransition] = useTransition();

  function handleAddSuplente(formData: FormData) {
    const personaId = String(formData.get("personaId") ?? "");
    startTransition(() => addSuplente(clase.id, personaId));
  }

  return (
    <Card className={`flex flex-col gap-4 ${clase.deletedAt ? "opacity-60" : ""}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-0.5">
          <span className="font-serif text-lg text-deep-water">{clase.nombre}</span>
          <span className="font-sans text-sm text-water-mid">
            {clase.maestro
              ? `Maestro: ${clase.maestro.nombres} ${clase.maestro.apellidos}`
              : "Sin maestro asignado"}
          </span>
        </div>
        {clase.deletedAt ? (
          <Button
            variant="tertiary"
            disabled={pending}
            onClick={() => startTransition(() => restoreClase(clase.id))}
          >
            Restaurar
          </Button>
        ) : (
          <button
            type="button"
            disabled={pending}
            onClick={() => startTransition(() => deleteClase(clase.id))}
            className="flex h-8 w-8 flex-none items-center justify-center rounded-full text-rojo/70 hover:bg-rojo-light"
            aria-label="Eliminar clase"
          >
            <IconTrash width={15} height={15} stroke="currentColor" />
          </button>
        )}
      </div>

      {!clase.deletedAt && (
        <div className="flex flex-col gap-2 rounded-xl bg-linen/50 p-3">
          <span className="font-sans text-[10px] font-medium tracking-[0.14em] text-water-mid uppercase">
            Rotación de suplentes
          </span>

          {clase.suplentes.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {clase.suplentes.map((id, i) => {
                const persona = personasMap[id];
                const activo = i === clase.turnoActualSuplente;
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
                      onClick={() => startTransition(() => removeSuplente(clase.id, id))}
                      className={activo ? "text-linen/70 hover:text-white" : "text-water-mid/60 hover:text-rojo"}
                    >
                      ×
                    </button>
                  </span>
                );
              })}
            </div>
          )}

          <form action={handleAddSuplente} className="flex flex-col gap-2 sm:flex-row">
            <div className="flex-1">
              <PersonaAutocomplete name="personaId" placeholder="Agregar suplente…" />
            </div>
            <Button type="submit" variant="tertiary" disabled={pending}>
              + Agregar
            </Button>
            {clase.suplentes.length > 1 && (
              <Button
                type="button"
                variant="tertiary"
                disabled={pending}
                onClick={() => startTransition(() => rotarSuplente(clase.id))}
              >
                Rotar turno
              </Button>
            )}
          </form>
        </div>
      )}
    </Card>
  );
}
