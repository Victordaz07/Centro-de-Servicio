"use client";

import { useActionState } from "react";
import { createPersona } from "./actions";

export function CreatePersonaForm() {
  const [state, action, pending] = useActionState(createPersona, undefined);

  return (
    <form
      action={action}
      className="grid grid-cols-1 gap-3 rounded-xl border border-line bg-white p-4 sm:grid-cols-2"
    >
      <h2 className="col-span-full text-sm font-semibold text-deep-water">
        Nueva persona
      </h2>

      <div className="space-y-1">
        <label htmlFor="nombres" className="text-xs font-medium text-ink">
          Nombres
        </label>
        <input
          id="nombres"
          name="nombres"
          required
          className="w-full rounded-md border border-line px-3 py-2 text-sm outline-none focus:border-living-teal"
        />
        {state?.errors?.nombres && (
          <p className="text-xs text-rojo">{state.errors.nombres[0]}</p>
        )}
      </div>

      <div className="space-y-1">
        <label htmlFor="apellidos" className="text-xs font-medium text-ink">
          Apellidos
        </label>
        <input
          id="apellidos"
          name="apellidos"
          required
          className="w-full rounded-md border border-line px-3 py-2 text-sm outline-none focus:border-living-teal"
        />
        {state?.errors?.apellidos && (
          <p className="text-xs text-rojo">{state.errors.apellidos[0]}</p>
        )}
      </div>

      <div className="space-y-1">
        <label htmlFor="telefono" className="text-xs font-medium text-ink">
          Teléfono
        </label>
        <input
          id="telefono"
          name="telefono"
          className="w-full rounded-md border border-line px-3 py-2 text-sm outline-none focus:border-living-teal"
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="notas" className="text-xs font-medium text-ink">
          Notas
        </label>
        <input
          id="notas"
          name="notas"
          className="w-full rounded-md border border-line px-3 py-2 text-sm outline-none focus:border-living-teal"
        />
      </div>

      <div className="col-span-full flex items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-dawn-coral px-4 py-2 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-60"
        >
          {pending ? "Guardando…" : "Crear persona"}
        </button>
        {state?.message && (
          <span className="text-xs text-sage">{state.message}</span>
        )}
      </div>
    </form>
  );
}
