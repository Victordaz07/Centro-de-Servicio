"use client";

import { useTransition } from "react";
import { toggleAgendaItem, deleteAgendaItem } from "./actions";
import { IconCheck, IconTrash } from "@/components/icons";

export type AgendaItemData = {
  id: string;
  texto: string;
  completado: boolean;
  responsable: { id: string; nombres: string; apellidos: string } | null;
};

export function AgendaItemRow({ item }: { item: AgendaItemData }) {
  const [pending, startTransition] = useTransition();

  return (
    <div
      className={`flex min-h-[56px] items-start gap-3 rounded-2xl border bg-white p-3.5 transition ${
        item.completado ? "border-deep-water/8 opacity-65" : "border-deep-water/8"
      }`}
    >
      <button
        type="button"
        disabled={pending}
        onClick={() => startTransition(() => toggleAgendaItem(item.id, !item.completado))}
        className={`mt-0.5 flex h-[22px] w-[22px] flex-none items-center justify-center rounded-[7px] ${
          item.completado ? "bg-living-teal" : "border-[1.5px] border-deep-water/28"
        }`}
      >
        {item.completado && <IconCheck width={12} height={12} stroke="var(--linen)" />}
      </button>

      <div className="flex flex-1 flex-col gap-1">
        <span
          className={`font-sans text-[15px] leading-[21px] text-ink ${
            item.completado ? "line-through" : ""
          }`}
        >
          {item.texto}
        </span>
        {item.responsable && (
          <span className="font-sans text-xs text-water-mid">
            {item.responsable.nombres} {item.responsable.apellidos}
          </span>
        )}
      </div>

      <button
        type="button"
        disabled={pending}
        onClick={() => startTransition(() => deleteAgendaItem(item.id))}
        className="flex h-8 w-8 flex-none items-center justify-center rounded-full text-rojo/70 hover:bg-rojo-light"
        aria-label="Eliminar punto"
      >
        <IconTrash width={15} height={15} stroke="currentColor" />
      </button>
    </div>
  );
}
