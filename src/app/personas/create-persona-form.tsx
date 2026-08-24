"use client";

import { useActionState, useState } from "react";
import { createPersona } from "./actions";
import { Button } from "@/components/ui/button";
import { IconPlus } from "@/components/icons";

export function CreatePersonaForm() {
  const [open, setOpen] = useState(false);
  const [state, action, pending] = useActionState(createPersona, undefined);

  if (!open) {
    return (
      <Button variant="primary" className="w-full" onClick={() => setOpen(true)}>
        <IconPlus width={16} height={16} stroke="currentColor" />
        Nueva persona
      </Button>
    );
  }

  return (
    <form
      action={action}
      className="grid grid-cols-1 gap-3 rounded-2xl border border-deep-water/8 bg-white p-4 sm:grid-cols-2"
    >
      <h2 className="col-span-full font-serif text-lg text-deep-water">Nueva persona</h2>

      <div className="space-y-1">
        <label htmlFor="nombres" className="font-sans text-xs font-medium text-ink">
          Nombres
        </label>
        <input
          id="nombres"
          name="nombres"
          required
          className="w-full rounded-xl border border-line px-3 py-2 font-sans text-sm outline-none focus:border-living-teal"
        />
        {state?.errors?.nombres && (
          <p className="font-sans text-xs text-rojo">{state.errors.nombres[0]}</p>
        )}
      </div>

      <div className="space-y-1">
        <label htmlFor="apellidos" className="font-sans text-xs font-medium text-ink">
          Apellidos
        </label>
        <input
          id="apellidos"
          name="apellidos"
          required
          className="w-full rounded-xl border border-line px-3 py-2 font-sans text-sm outline-none focus:border-living-teal"
        />
        {state?.errors?.apellidos && (
          <p className="font-sans text-xs text-rojo">{state.errors.apellidos[0]}</p>
        )}
      </div>

      <div className="space-y-1">
        <label htmlFor="telefono" className="font-sans text-xs font-medium text-ink">
          Teléfono
        </label>
        <input
          id="telefono"
          name="telefono"
          className="w-full rounded-xl border border-line px-3 py-2 font-sans text-sm outline-none focus:border-living-teal"
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="notas" className="font-sans text-xs font-medium text-ink">
          Notas
        </label>
        <input
          id="notas"
          name="notas"
          className="w-full rounded-xl border border-line px-3 py-2 font-sans text-sm outline-none focus:border-living-teal"
        />
      </div>

      <div className="col-span-full flex items-center gap-3">
        <Button type="submit" variant="primary" disabled={pending}>
          {pending ? "Guardando…" : "Crear persona"}
        </Button>
        <Button type="button" variant="tertiary" onClick={() => setOpen(false)}>
          Cancelar
        </Button>
        {state?.message && <span className="font-sans text-xs text-sage">{state.message}</span>}
      </div>
    </form>
  );
}
