"use client";

import { useActionState, useState } from "react";
import { createReserva } from "./actions";
import { Button } from "@/components/ui/button";
import { IconPlus } from "@/components/icons";

export function CreateReservaForm() {
  const [open, setOpen] = useState(false);
  const [state, action, pending] = useActionState(createReserva, undefined);

  if (!open) {
    return (
      <Button variant="primary" className="w-full" onClick={() => setOpen(true)}>
        <IconPlus width={16} height={16} stroke="currentColor" />
        Nueva reserva
      </Button>
    );
  }

  return (
    <form
      action={action}
      className="grid grid-cols-1 gap-3 rounded-2xl border border-deep-water/8 bg-white p-4 sm:grid-cols-2"
    >
      <h2 className="col-span-full font-serif text-lg text-deep-water">Nueva reserva</h2>

      <div className="space-y-1">
        <label htmlFor="area" className="font-sans text-xs font-medium text-ink">
          Área
        </label>
        <input
          id="area"
          name="area"
          placeholder="p. ej. Capilla, Salón cultural…"
          required
          className="w-full rounded-xl border border-line px-3 py-2 font-sans text-sm outline-none focus:border-living-teal"
        />
        {state?.errors?.area && (
          <p className="font-sans text-xs text-rojo">{state.errors.area[0]}</p>
        )}
      </div>

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
        <label htmlFor="horaInicio" className="font-sans text-xs font-medium text-ink">
          Hora de inicio
        </label>
        <input
          id="horaInicio"
          name="horaInicio"
          type="time"
          required
          className="w-full rounded-xl border border-line px-3 py-2 font-sans text-sm outline-none focus:border-living-teal"
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="horaFin" className="font-sans text-xs font-medium text-ink">
          Hora de fin
        </label>
        <input
          id="horaFin"
          name="horaFin"
          type="time"
          required
          className="w-full rounded-xl border border-line px-3 py-2 font-sans text-sm outline-none focus:border-living-teal"
        />
        {state?.errors?.horaFin && (
          <p className="font-sans text-xs text-rojo">{state.errors.horaFin[0]}</p>
        )}
      </div>

      <div className="space-y-1">
        <label htmlFor="solicitante" className="font-sans text-xs font-medium text-ink">
          Solicitante
        </label>
        <input
          id="solicitante"
          name="solicitante"
          placeholder="p. ej. Cuórum de Élderes"
          required
          className="w-full rounded-xl border border-line px-3 py-2 font-sans text-sm outline-none focus:border-living-teal"
        />
        {state?.errors?.solicitante && (
          <p className="font-sans text-xs text-rojo">{state.errors.solicitante[0]}</p>
        )}
      </div>

      <div className="space-y-1">
        <label htmlFor="proposito" className="font-sans text-xs font-medium text-ink">
          Propósito (opcional)
        </label>
        <input
          id="proposito"
          name="proposito"
          className="w-full rounded-xl border border-line px-3 py-2 font-sans text-sm outline-none focus:border-living-teal"
        />
      </div>

      <div className="col-span-full flex items-center gap-3">
        <Button type="submit" variant="primary" disabled={pending}>
          {pending ? "Guardando…" : "Reservar"}
        </Button>
        <Button type="button" variant="tertiary" onClick={() => setOpen(false)}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}
