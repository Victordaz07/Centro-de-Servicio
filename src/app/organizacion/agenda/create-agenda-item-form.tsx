"use client";

import { useActionState, useState } from "react";
import { createAgendaItem } from "./actions";
import { Button } from "@/components/ui/button";
import { PersonaAutocomplete } from "@/components/persona-autocomplete";
import { IconPlus } from "@/components/icons";

export function CreateAgendaItemForm() {
  const [open, setOpen] = useState(false);
  const [state, action, pending] = useActionState(createAgendaItem, undefined);

  if (!open) {
    return (
      <Button variant="primary" className="w-full" onClick={() => setOpen(true)}>
        <IconPlus width={16} height={16} stroke="currentColor" />
        Agregar punto
      </Button>
    );
  }

  return (
    <form
      action={action}
      className="flex flex-col gap-3 rounded-2xl border border-deep-water/8 bg-white p-4"
    >
      <h2 className="font-serif text-lg text-deep-water">Nuevo punto</h2>

      <div className="space-y-1">
        <label htmlFor="texto" className="font-sans text-xs font-medium text-ink">
          Punto de agenda
        </label>
        <input
          id="texto"
          name="texto"
          required
          className="w-full rounded-xl border border-line px-3 py-2 font-sans text-sm outline-none focus:border-living-teal"
        />
        {state?.errors?.texto && (
          <p className="font-sans text-xs text-rojo">{state.errors.texto[0]}</p>
        )}
      </div>

      <div className="space-y-1">
        <label className="font-sans text-xs font-medium text-ink">Responsable (opcional)</label>
        <PersonaAutocomplete name="responsablePersonaId" placeholder="Buscar persona…" />
      </div>

      <div className="flex items-center gap-3">
        <Button type="submit" variant="primary" disabled={pending}>
          {pending ? "Guardando…" : "Agregar"}
        </Button>
        <Button type="button" variant="tertiary" onClick={() => setOpen(false)}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}
