"use client";

import { useActionState, useState } from "react";
import { createClase } from "./actions";
import { Button } from "@/components/ui/button";
import { PersonaAutocomplete } from "@/components/persona-autocomplete";
import { IconPlus } from "@/components/icons";

export function CreateClaseForm() {
  const [open, setOpen] = useState(false);
  const [state, action, pending] = useActionState(createClase, undefined);

  if (!open) {
    return (
      <Button variant="primary" className="w-full" onClick={() => setOpen(true)}>
        <IconPlus width={16} height={16} stroke="currentColor" />
        Nueva clase
      </Button>
    );
  }

  return (
    <form
      action={action}
      className="flex flex-col gap-3 rounded-2xl border border-deep-water/8 bg-white p-4"
    >
      <h2 className="font-serif text-lg text-deep-water">Nueva clase</h2>

      <div className="space-y-1">
        <label htmlFor="nombre" className="font-sans text-xs font-medium text-ink">
          Nombre
        </label>
        <input
          id="nombre"
          name="nombre"
          placeholder="p. ej. Doctrina del Evangelio"
          required
          className="w-full rounded-xl border border-line px-3 py-2 font-sans text-sm outline-none focus:border-living-teal"
        />
        {state?.errors?.nombre && (
          <p className="font-sans text-xs text-rojo">{state.errors.nombre[0]}</p>
        )}
      </div>

      <div className="space-y-1">
        <label className="font-sans text-xs font-medium text-ink">Maestro (opcional)</label>
        <PersonaAutocomplete name="maestroPersonaId" placeholder="Buscar persona…" />
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
