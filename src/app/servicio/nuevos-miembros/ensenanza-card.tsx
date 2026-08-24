"use client";

import { useState, useTransition } from "react";
import {
  updateEstadoEnsenanza,
  deleteEnsenanza,
  addLeccion,
  addCompromiso,
  toggleCompromiso,
} from "./actions";
import { EstadoEnsenanza } from "@/generated/prisma/enums";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { IconCheck, IconTrash } from "@/components/icons";

export type EnsenanzaData = {
  id: string;
  estado: EstadoEnsenanza;
  lecciones: { tema: string; fecha: string }[];
  compromisos: { descripcion: string; cumplido: boolean }[];
  persona: { id: string; nombres: string; apellidos: string };
};

const ESTADO_BADGE = {
  CONTACTADO: "neutro",
  ENSENANDO: "en-curso",
  COMPROMISO_BAUTISMO: "pendiente",
  BAUTIZADO: "completado",
} as const;

const ESTADO_LABEL = {
  CONTACTADO: "Contactado",
  ENSENANDO: "En enseñanza",
  COMPROMISO_BAUTISMO: "Compromiso de bautismo",
  BAUTIZADO: "Bautizado",
} as const;

const ESTADOS_ORDEN: EstadoEnsenanza[] = [
  EstadoEnsenanza.CONTACTADO,
  EstadoEnsenanza.ENSENANDO,
  EstadoEnsenanza.COMPROMISO_BAUTISMO,
  EstadoEnsenanza.BAUTIZADO,
];

export function EnsenanzaCard({ ensenanza }: { ensenanza: EnsenanzaData }) {
  const [pending, startTransition] = useTransition();
  const [leccionTexto, setLeccionTexto] = useState("");
  const [compromisoTexto, setCompromisoTexto] = useState("");

  function handleAddLeccion(e: React.FormEvent) {
    e.preventDefault();
    if (!leccionTexto.trim()) return;
    const tema = leccionTexto;
    setLeccionTexto("");
    startTransition(() => addLeccion(ensenanza.id, tema));
  }

  function handleAddCompromiso(e: React.FormEvent) {
    e.preventDefault();
    if (!compromisoTexto.trim()) return;
    const descripcion = compromisoTexto;
    setCompromisoTexto("");
    startTransition(() => addCompromiso(ensenanza.id, descripcion));
  }

  return (
    <Card className="flex flex-col gap-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1.5">
          <span className="font-serif text-lg text-deep-water">
            {ensenanza.persona.nombres} {ensenanza.persona.apellidos}
          </span>
          <Badge variant={ESTADO_BADGE[ensenanza.estado]}>{ESTADO_LABEL[ensenanza.estado]}</Badge>
        </div>
        <button
          type="button"
          disabled={pending}
          onClick={() => startTransition(() => deleteEnsenanza(ensenanza.id))}
          className="flex h-8 w-8 flex-none items-center justify-center rounded-full text-rojo/70 hover:bg-rojo-light"
          aria-label="Eliminar"
        >
          <IconTrash width={15} height={15} stroke="currentColor" />
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {ESTADOS_ORDEN.filter((e) => e !== ensenanza.estado).map((estado) => (
          <Button
            key={estado}
            variant="tertiary"
            disabled={pending}
            onClick={() => startTransition(() => updateEstadoEnsenanza(ensenanza.id, estado))}
          >
            {ESTADO_LABEL[estado]}
          </Button>
        ))}
      </div>

      <div className="flex flex-col gap-2">
        <span className="font-sans text-[11px] font-medium tracking-[0.14em] text-water-mid uppercase">
          Lecciones ({ensenanza.lecciones.length})
        </span>
        {ensenanza.lecciones.map((l, i) => (
          <div
            key={i}
            className="flex items-center justify-between gap-3 rounded-xl border border-deep-water/8 bg-linen/50 p-2.5"
          >
            <span className="font-sans text-sm text-ink">{l.tema}</span>
            <span className="font-sans text-xs text-water-mid">
              {new Intl.DateTimeFormat("es-MX", { day: "numeric", month: "short" }).format(
                new Date(l.fecha)
              )}
            </span>
          </div>
        ))}
        <form onSubmit={handleAddLeccion} className="flex gap-2">
          <input
            value={leccionTexto}
            onChange={(e) => setLeccionTexto(e.target.value)}
            placeholder="p. ej. Mandamientos"
            className="flex-1 rounded-xl border border-line px-3 py-2 font-sans text-sm outline-none focus:border-living-teal"
          />
          <Button type="submit" variant="tertiary" disabled={pending}>
            + Agregar
          </Button>
        </form>
      </div>

      <div className="flex flex-col gap-2">
        <span className="font-sans text-[11px] font-medium tracking-[0.14em] text-water-mid uppercase">
          Compromisos
        </span>
        {ensenanza.compromisos.map((c, i) => (
          <button
            key={i}
            type="button"
            disabled={pending}
            onClick={() => startTransition(() => toggleCompromiso(ensenanza.id, i))}
            className="flex items-center gap-3 rounded-xl border border-deep-water/8 bg-linen/50 p-2.5 text-left"
          >
            <div
              className={`flex h-[20px] w-[20px] flex-none items-center justify-center rounded-[6px] ${
                c.cumplido ? "bg-living-teal" : "border-[1.5px] border-deep-water/28"
              }`}
            >
              {c.cumplido && <IconCheck width={11} height={11} stroke="var(--linen)" />}
            </div>
            <span
              className={`font-sans text-sm text-ink ${c.cumplido ? "line-through opacity-60" : ""}`}
            >
              {c.descripcion}
            </span>
          </button>
        ))}
        <form onSubmit={handleAddCompromiso} className="flex gap-2">
          <input
            value={compromisoTexto}
            onChange={(e) => setCompromisoTexto(e.target.value)}
            placeholder="p. ej. Leer 3 Nefi 11"
            className="flex-1 rounded-xl border border-line px-3 py-2 font-sans text-sm outline-none focus:border-living-teal"
          />
          <Button type="submit" variant="tertiary" disabled={pending}>
            + Agregar
          </Button>
        </form>
      </div>
    </Card>
  );
}
