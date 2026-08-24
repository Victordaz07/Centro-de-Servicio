"use client";

import { useTransition } from "react";
import { deleteReserva } from "./actions";
import { IconTrash } from "@/components/icons";

export type ReservaData = {
  id: string;
  horaInicio: string;
  horaFin: string;
  area: string;
  solicitante: string;
  proposito: string | null;
};

export function ReservaRow({ reserva }: { reserva: ReservaData }) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex items-center gap-3 rounded-xl border border-deep-water/8 bg-white p-3">
      <span className="w-[100px] flex-none font-sans text-sm font-medium text-living-teal">
        {reserva.horaInicio}–{reserva.horaFin}
      </span>
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="truncate font-serif text-base text-deep-water">{reserva.area}</span>
        <span className="truncate font-sans text-xs text-water-mid">
          {reserva.solicitante}
          {reserva.proposito && ` · ${reserva.proposito}`}
        </span>
      </div>
      <button
        type="button"
        disabled={pending}
        onClick={() => startTransition(() => deleteReserva(reserva.id))}
        className="flex h-8 w-8 flex-none items-center justify-center rounded-full text-rojo/70 hover:bg-rojo-light"
        aria-label="Eliminar reserva"
      >
        <IconTrash width={15} height={15} stroke="currentColor" />
      </button>
    </div>
  );
}
