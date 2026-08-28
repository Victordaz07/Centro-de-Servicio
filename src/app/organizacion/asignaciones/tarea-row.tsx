"use client";

import { useTransition } from "react";
import { toggleTarea, deleteTarea, restoreTarea } from "./actions";
import { IconCheck } from "@/components/icons";
import { Button } from "@/components/ui/button";

export type TareaData = {
  id: string;
  quien: string;
  que: string;
  completado: boolean;
  deletedAt: Date | null;
};

export function TareaRow({ tarea }: { tarea: TareaData }) {
  const [pending, startTransition] = useTransition();

  return (
    <div
      className={`flex items-start gap-3 rounded-2xl border border-deep-water/8 bg-white p-3.5 ${
        tarea.deletedAt ? "opacity-60" : ""
      }`}
    >
      <button
        type="button"
        disabled={pending || !!tarea.deletedAt}
        onClick={() => startTransition(() => toggleTarea(tarea.id, !tarea.completado))}
        className={`mt-0.5 flex h-[22px] w-[22px] flex-none items-center justify-center rounded-[7px] ${
          tarea.completado ? "bg-living-teal" : "border-[1.5px] border-deep-water/28"
        }`}
      >
        {tarea.completado && <IconCheck width={12} height={12} stroke="var(--linen)" />}
      </button>

      <div className="flex flex-1 flex-col gap-0.5">
        <span
          className={`font-sans text-[15px] leading-[21px] text-ink ${
            tarea.completado ? "line-through opacity-60" : ""
          }`}
        >
          {tarea.que}
        </span>
        <span className="font-sans text-xs text-water-mid">{tarea.quien}</span>
      </div>

      {tarea.deletedAt ? (
        <Button
          variant="tertiary"
          disabled={pending}
          onClick={() => startTransition(() => restoreTarea(tarea.id))}
        >
          Restaurar
        </Button>
      ) : (
        <Button
          variant="ghost"
          disabled={pending}
          onClick={() => startTransition(() => deleteTarea(tarea.id))}
        >
          Quitar
        </Button>
      )}
    </div>
  );
}
