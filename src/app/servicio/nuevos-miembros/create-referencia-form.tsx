"use client";

import { useActionState, useState } from "react";
import { createReferencia } from "./actions";
import { Button } from "@/components/ui/button";
import { PersonaAutocomplete } from "@/components/persona-autocomplete";
import { IconPlus } from "@/components/icons";

export function CreateReferenciaForm() {
  const [open, setOpen] = useState(false);
  const [state, action, pending] = useActionState(createReferencia, undefined);

  if (!open) {
    return (
      <Button variant="secondary" className="w-full" onClick={() => setOpen(true)}>
        <IconPlus width={16} height={16} stroke="currentColor" />
        Nueva referencia
      </Button>
    );
  }

  return (
    <form
      action={action}
      className="flex flex-col gap-3 rounded-2xl border border-deep-water/8 bg-white p-4"
    >
      <h2 className="font-serif text-lg text-deep-water">Nueva referencia</h2>

      <div className="space-y-1">
        <label className="font-sans text-xs font-medium text-ink">Quién refiere</label>
        <PersonaAutocomplete name="personaQueRefiereId" placeholder="Buscar persona…" />
        {state?.errors?.personaQueRefiereId && (
          <p className="font-sans text-xs text-rojo">{state.errors.personaQueRefiereId[0]}</p>
        )}
      </div>

      <div className="space-y-1">
        <label className="font-sans text-xs font-medium text-ink">
          Persona referida (opcional si aún no tienes el nombre completo)
        </label>
        <PersonaAutocomplete name="personaReferidaId" placeholder="Buscar o crear persona…" />
      </div>

      <div className="space-y-1">
        <label htmlFor="notas" className="font-sans text-xs font-medium text-ink">
          Notas (opcional)
        </label>
        <input
          id="notas"
          name="notas"
          placeholder="p. ej. primera cita el jueves"
          className="w-full rounded-xl border border-line px-3 py-2 font-sans text-sm outline-none focus:border-living-teal"
        />
      </div>

      <div className="flex items-center gap-3">
        <Button type="submit" variant="primary" disabled={pending}>
          {pending ? "Guardando…" : "Crear"}
        </Button>
        <Button type="button" variant="tertiary" onClick={() => setOpen(false)}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}
