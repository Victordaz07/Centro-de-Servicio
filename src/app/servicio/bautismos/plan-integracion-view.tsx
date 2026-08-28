"use client";

import { useTransition } from "react";
import { toggleHito } from "./actions";
import { IconCheck } from "@/components/icons";
import { ROL_TAG_LABEL } from "./hitos-seed";

export type HitoData = {
  id: string;
  ventana: string;
  ordenVentana: number;
  accion: string;
  responsableRoles: string[];
  completado: boolean;
  completadoFecha: Date | null;
};

export function PlanIntegracionView({ hitos }: { hitos: HitoData[] }) {
  const [pending, startTransition] = useTransition();

  const completados = hitos.filter((h) => h.completado).length;
  const progreso = hitos.length > 0 ? Math.round((completados / hitos.length) * 100) : 0;

  const ventanas = Array.from(new Set(hitos.map((h) => h.ventana))).sort((a, b) => {
    const oa = hitos.find((h) => h.ventana === a)?.ordenVentana ?? 0;
    const ob = hitos.find((h) => h.ventana === b)?.ordenVentana ?? 0;
    return oa - ob;
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <span className="font-sans text-[11px] font-medium tracking-[0.12em] text-water-mid uppercase">
            {completados} de {hitos.length} hitos completados
          </span>
          <span className="font-sans text-xs text-water-mid">{progreso}%</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-mist">
          <div
            className="h-full rounded-full bg-living-teal transition-all"
            style={{ width: `${progreso}%` }}
          />
        </div>
      </div>

      {ventanas.map((ventana) => (
        <div key={ventana} className="flex flex-col gap-1.5">
          <span className="font-sans text-[11px] font-medium tracking-[0.14em] text-water-mid uppercase">
            {ventana}
          </span>
          {hitos
            .filter((h) => h.ventana === ventana)
            .map((h) => (
              <button
                key={h.id}
                type="button"
                disabled={pending}
                onClick={() => startTransition(() => toggleHito(h.id, !h.completado))}
                className="flex items-start gap-3 rounded-xl border-t border-deep-water/7 py-2.5 text-left first:border-t-0"
              >
                <div
                  className={`mt-0.5 flex h-[21px] w-[21px] flex-none items-center justify-center rounded-[7px] ${
                    h.completado ? "bg-living-teal" : "border-[1.5px] border-deep-water/28"
                  }`}
                >
                  {h.completado && <IconCheck width={12} height={12} stroke="var(--linen)" />}
                </div>
                <div className="flex flex-1 flex-col gap-1">
                  <span
                    className={`font-sans text-[15px] leading-[21px] text-ink ${
                      h.completado ? "line-through opacity-60" : ""
                    }`}
                  >
                    {h.accion}
                  </span>
                  {h.responsableRoles.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {h.responsableRoles.map((r) => (
                        <span
                          key={r}
                          className="rounded-md bg-mist px-2 py-0.5 font-sans text-[10px] font-medium tracking-[0.08em] text-water-mid uppercase"
                        >
                          {ROL_TAG_LABEL[r] ?? r}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </button>
            ))}
        </div>
      ))}
    </div>
  );
}
