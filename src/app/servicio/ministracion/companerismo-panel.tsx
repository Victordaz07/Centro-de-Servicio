"use client";

import { useActionState, useTransition } from "react";
import { createCompanerismo, deleteCompanerismo } from "./actions";
import { Button } from "@/components/ui/button";

export type CompanerismoData = { id: string; nombres: string };

export function CompanerismoPanel({ companerismos }: { companerismos: CompanerismoData[] }) {
  const [state, action, pending] = useActionState(createCompanerismo, undefined);
  const [deleting, startTransition] = useTransition();

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-deep-water/8 bg-white p-4">
      <span className="font-serif text-lg text-deep-water">Compañerismos</span>

      {companerismos.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {companerismos.map((c) => (
            <span
              key={c.id}
              className="flex items-center gap-2 rounded-full bg-mist px-3 py-1.5 font-sans text-xs font-medium text-water-mid"
            >
              {c.nombres}
              <button
                type="button"
                disabled={deleting}
                onClick={() => startTransition(() => deleteCompanerismo(c.id))}
                className="text-water-mid/60 hover:text-rojo"
                aria-label={`Eliminar ${c.nombres}`}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}

      <form action={action} className="flex gap-2">
        <input
          name="nombres"
          placeholder="p. ej. Hno. García / Hna. López"
          required
          className="flex-1 rounded-xl border border-line px-3 py-2 font-sans text-sm outline-none focus:border-living-teal"
        />
        <Button type="submit" variant="tertiary" disabled={pending}>
          + Nuevo
        </Button>
      </form>
      {state?.errors?.nombres && (
        <p className="font-sans text-xs text-rojo">{state.errors.nombres[0]}</p>
      )}
    </div>
  );
}
