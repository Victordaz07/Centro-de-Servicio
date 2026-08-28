"use client";

import { useActionState, useState } from "react";
import { createLlamamiento } from "./actions";
import { Button } from "@/components/ui/button";
import { PersonaAutocomplete } from "@/components/persona-autocomplete";
import { IconPlus } from "@/components/icons";

export function CreateLlamamientoForm() {
  const [open, setOpen] = useState(false);
  const [state, action, pending] = useActionState(createLlamamiento, undefined);

  if (!open) {
    return (
      <Button variant="primary" className="w-full" onClick={() => setOpen(true)}>
        <IconPlus width={16} height={16} stroke="currentColor" />
        Nueva consideración
      </Button>
    );
  }

  return (
    <form
      action={action}
      className="flex flex-col gap-3 rounded-2xl border border-deep-water/8 bg-white p-4"
    >
      <h2 className="font-serif text-lg text-deep-water">Nueva consideración</h2>

      <div className="space-y-1">
        <label className="font-sans text-xs font-medium text-ink">Persona</label>
        <PersonaAutocomplete name="personaId" placeholder="Buscar persona…" />
        {state?.errors?.personaId && (
          <p className="font-sans text-xs text-rojo">{state.errors.personaId[0]}</p>
        )}
      </div>

      <div className="space-y-1">
        <label htmlFor="llamamientoPropuesto" className="font-sans text-xs font-medium text-ink">
          Llamamiento propuesto
        </label>
        <input
          id="llamamientoPropuesto"
          name="llamamientoPropuesto"
          placeholder="p. ej. Maestra de Escuela Dominical"
          required
          className="w-full rounded-xl border border-line px-3 py-2 font-sans text-sm outline-none focus:border-living-teal"
        />
        {state?.errors?.llamamientoPropuesto && (
          <p className="font-sans text-xs text-rojo">{state.errors.llamamientoPropuesto[0]}</p>
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
