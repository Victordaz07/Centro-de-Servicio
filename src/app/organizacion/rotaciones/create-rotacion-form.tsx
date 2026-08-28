"use client";

import { useActionState, useState } from "react";
import { createRotacion } from "./actions";
import { Button } from "@/components/ui/button";
import { IconPlus } from "@/components/icons";

export function CreateRotacionForm() {
  const [open, setOpen] = useState(false);
  const [state, action, pending] = useActionState(createRotacion, undefined);

  if (!open) {
    return (
      <Button variant="primary" className="w-full" onClick={() => setOpen(true)}>
        <IconPlus width={16} height={16} stroke="currentColor" />
        Nueva rotación
      </Button>
    );
  }

  return (
    <form
      action={action}
      className="flex flex-col gap-3 rounded-2xl border border-deep-water/8 bg-white p-4"
    >
      <h2 className="font-serif text-lg text-deep-water">Nueva rotación</h2>

      <div className="space-y-1">
        <label htmlFor="tarea" className="font-sans text-xs font-medium text-ink">
          Tarea
        </label>
        <input
          id="tarea"
          name="tarea"
          placeholder="p. ej. Oración de apertura"
          required
          className="w-full rounded-xl border border-line px-3 py-2 font-sans text-sm outline-none focus:border-living-teal"
        />
        {state?.errors?.tarea && (
          <p className="font-sans text-xs text-rojo">{state.errors.tarea[0]}</p>
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
