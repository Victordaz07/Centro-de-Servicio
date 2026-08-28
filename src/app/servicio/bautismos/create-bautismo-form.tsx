"use client";

import { useActionState, useState } from "react";
import { createBautismo } from "./actions";
import { Button } from "@/components/ui/button";
import { PersonaAutocomplete } from "@/components/persona-autocomplete";
import { IconPlus } from "@/components/icons";

export function CreateBautismoForm() {
  const [open, setOpen] = useState(false);
  const [state, action, pending] = useActionState(createBautismo, undefined);

  if (!open) {
    return (
      <Button variant="primary" className="w-full" onClick={() => setOpen(true)}>
        <IconPlus width={16} height={16} stroke="currentColor" />
        Registrar bautismo
      </Button>
    );
  }

  return (
    <form
      action={action}
      className="flex flex-col gap-3 rounded-2xl border border-deep-water/8 bg-white p-4"
    >
      <h2 className="font-serif text-lg text-deep-water">Registrar bautismo</h2>

      <div className="space-y-1">
        <label className="font-sans text-xs font-medium text-ink">Persona</label>
        <PersonaAutocomplete name="personaId" placeholder="Buscar persona…" />
        {state?.errors?.personaId && (
          <p className="font-sans text-xs text-rojo">{state.errors.personaId[0]}</p>
        )}
      </div>

      <div className="space-y-1">
        <label htmlFor="fecha" className="font-sans text-xs font-medium text-ink">
          Fecha del bautismo
        </label>
        <input
          id="fecha"
          name="fecha"
          type="date"
          required
          className="w-full rounded-xl border border-line px-3 py-2 font-sans text-sm outline-none focus:border-living-teal"
        />
        {state?.errors?.fecha && (
          <p className="font-sans text-xs text-rojo">{state.errors.fecha[0]}</p>
        )}
      </div>

      <p className="font-sans text-xs text-water-mid">
        Al guardar se crea automáticamente el Plan de Integración con los 12 hitos del primer año.
      </p>

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
