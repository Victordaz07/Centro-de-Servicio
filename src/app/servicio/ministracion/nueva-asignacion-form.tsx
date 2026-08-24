"use client";

import { useActionState, useState } from "react";
import { createAsignacion } from "./actions";
import { Button } from "@/components/ui/button";
import { FamiliaAutocomplete } from "@/components/familia-autocomplete";
import { IconPlus } from "@/components/icons";
import type { CompanerismoData } from "./companerismo-panel";

export function NuevaAsignacionForm({ companerismos }: { companerismos: CompanerismoData[] }) {
  const [open, setOpen] = useState(false);
  const [state, action, pending] = useActionState(createAsignacion, undefined);

  if (!open) {
    return (
      <Button
        variant="primary"
        className="w-full"
        onClick={() => setOpen(true)}
        disabled={companerismos.length === 0}
      >
        <IconPlus width={16} height={16} stroke="currentColor" />
        {companerismos.length === 0 ? "Crea un compañerismo primero" : "Asignar familia"}
      </Button>
    );
  }

  return (
    <form
      action={action}
      className="flex flex-col gap-3 rounded-2xl border border-deep-water/8 bg-white p-4"
    >
      <h2 className="font-serif text-lg text-deep-water">Nueva asignación</h2>

      <div className="space-y-1">
        <label htmlFor="companerismoId" className="font-sans text-xs font-medium text-ink">
          Compañerismo
        </label>
        <select
          id="companerismoId"
          name="companerismoId"
          required
          className="w-full rounded-xl border border-line px-3 py-2 font-sans text-sm outline-none focus:border-living-teal"
        >
          {companerismos.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nombres}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-1">
        <label className="font-sans text-xs font-medium text-ink">Familia</label>
        <FamiliaAutocomplete name="familiaId" />
        {state?.errors?.familiaId && (
          <p className="font-sans text-xs text-rojo">{state.errors.familiaId[0]}</p>
        )}
      </div>

      <div className="flex items-center gap-3">
        <Button type="submit" variant="primary" disabled={pending}>
          {pending ? "Guardando…" : "Asignar"}
        </Button>
        <Button type="button" variant="tertiary" onClick={() => setOpen(false)}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}
