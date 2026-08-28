"use client";

import { useActionState, useState } from "react";
import { createEnsenanza } from "./actions";
import { Button } from "@/components/ui/button";
import { PersonaAutocomplete } from "@/components/persona-autocomplete";
import { IconPlus } from "@/components/icons";

export function CreateEnsenanzaForm() {
  const [open, setOpen] = useState(false);
  const [state, action, pending] = useActionState(createEnsenanza, undefined);

  if (!open) {
    return (
      <Button variant="primary" className="w-full" onClick={() => setOpen(true)}>
        <IconPlus width={16} height={16} stroke="currentColor" />
        Nueva persona en enseñanza
      </Button>
    );
  }

  return (
    <form
      action={action}
      className="flex flex-col gap-3 rounded-2xl border border-deep-water/8 bg-white p-4"
    >
      <h2 className="font-serif text-lg text-deep-water">Nueva persona en enseñanza</h2>

      <div className="space-y-1">
        <label className="font-sans text-xs font-medium text-ink">Persona</label>
        <PersonaAutocomplete name="personaId" placeholder="Buscar persona…" />
        {state?.errors?.personaId && (
          <p className="font-sans text-xs text-rojo">{state.errors.personaId[0]}</p>
        )}
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
