"use client";

import { useActionState, useState } from "react";
import { createMinuta } from "./actions";
import { Button } from "@/components/ui/button";
import { IconPlus } from "@/components/icons";

export function CreateMinutaForm() {
  const [open, setOpen] = useState(false);
  const [state, action, pending] = useActionState(createMinuta, undefined);

  if (!open) {
    return (
      <Button variant="primary" className="w-full" onClick={() => setOpen(true)}>
        <IconPlus width={16} height={16} stroke="currentColor" />
        Nueva minuta
      </Button>
    );
  }

  return (
    <form
      action={action}
      className="flex flex-col gap-3 rounded-2xl border border-deep-water/8 bg-white p-4"
    >
      <h2 className="font-serif text-lg text-deep-water">Nueva minuta</h2>

      <div className="space-y-1">
        <label htmlFor="fecha" className="font-sans text-xs font-medium text-ink">
          Fecha
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

      <div className="space-y-1">
        <label htmlFor="texto" className="font-sans text-xs font-medium text-ink">
          Texto
        </label>
        <textarea
          id="texto"
          name="texto"
          rows={4}
          placeholder="Puntos tratados, acuerdos, asignaciones…"
          required
          className="w-full rounded-xl border border-line px-3 py-2 font-sans text-sm outline-none focus:border-living-teal"
        />
        {state?.errors?.texto && (
          <p className="font-sans text-xs text-rojo">{state.errors.texto[0]}</p>
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
