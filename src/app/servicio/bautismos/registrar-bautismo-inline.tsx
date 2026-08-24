"use client";

import { useActionState } from "react";
import { createBautismo } from "./actions";
import { Button } from "@/components/ui/button";

export function RegistrarBautismoInline({ personaId }: { personaId: string }) {
  const [state, action, pending] = useActionState(createBautismo, undefined);

  return (
    <form action={action} className="flex flex-col gap-3 rounded-[20px] border border-deep-water/8 bg-white p-5">
      <div>
        <span className="font-serif text-lg text-deep-water">Plan de Integración</span>
        <p className="mt-1 font-sans text-sm text-water-mid">
          Registra la fecha de bautismo para generar automáticamente los 12 hitos del primer año.
        </p>
      </div>

      <input type="hidden" name="personaId" value={personaId} />

      <div className="flex flex-wrap items-end gap-3">
        <div className="space-y-1">
          <label htmlFor="fecha" className="font-sans text-xs font-medium text-ink">
            Fecha del bautismo
          </label>
          <input
            id="fecha"
            name="fecha"
            type="date"
            required
            className="rounded-xl border border-line px-3 py-2 font-sans text-sm outline-none focus:border-living-teal"
          />
        </div>
        <Button type="submit" variant="primary" disabled={pending}>
          {pending ? "Guardando…" : "Registrar bautismo"}
        </Button>
      </div>
      {state?.errors?.fecha && <p className="font-sans text-xs text-rojo">{state.errors.fecha[0]}</p>}
      {state?.errors?.personaId && (
        <p className="font-sans text-xs text-rojo">{state.errors.personaId[0]}</p>
      )}
    </form>
  );
}
