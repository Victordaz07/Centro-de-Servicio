"use client";

import { useActionState, useState } from "react";
import { createTarea } from "./actions";
import { Button } from "@/components/ui/button";
import { IconPlus } from "@/components/icons";

export function CreateTareaForm() {
  const [open, setOpen] = useState(false);
  const [state, action, pending] = useActionState(createTarea, undefined);

  if (!open) {
    return (
      <Button variant="primary" className="w-full" onClick={() => setOpen(true)}>
        <IconPlus width={16} height={16} stroke="currentColor" />
        Nueva asignación
      </Button>
    );
  }

  return (
    <form
      action={action}
      className="grid grid-cols-1 gap-3 rounded-2xl border border-deep-water/8 bg-white p-4 sm:grid-cols-2"
    >
      <h2 className="col-span-full font-serif text-lg text-deep-water">Nueva asignación</h2>

      <div className="space-y-1">
        <label htmlFor="que" className="font-sans text-xs font-medium text-ink">
          Qué
        </label>
        <input
          id="que"
          name="que"
          placeholder="p. ej. Preparar el número musical"
          required
          className="w-full rounded-xl border border-line px-3 py-2 font-sans text-sm outline-none focus:border-living-teal"
        />
        {state?.errors?.que && (
          <p className="font-sans text-xs text-rojo">{state.errors.que[0]}</p>
        )}
      </div>

      <div className="space-y-1">
        <label htmlFor="quien" className="font-sans text-xs font-medium text-ink">
          Quién
        </label>
        <input
          id="quien"
          name="quien"
          placeholder="p. ej. Hna. López"
          required
          className="w-full rounded-xl border border-line px-3 py-2 font-sans text-sm outline-none focus:border-living-teal"
        />
        {state?.errors?.quien && (
          <p className="font-sans text-xs text-rojo">{state.errors.quien[0]}</p>
        )}
      </div>

      <div className="col-span-full flex items-center gap-3">
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
