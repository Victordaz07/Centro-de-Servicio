"use client";

import { useActionState, useState, useTransition } from "react";
import {
  deletePrograma,
  addOrador,
  removeOrador,
  addNumeroMusical,
  removeNumeroMusical,
} from "./actions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PersonaAutocomplete } from "@/components/persona-autocomplete";
import { IconTrash } from "@/components/icons";

export type ProgramaData = {
  id: string;
  fecha: Date;
  conductor: string | null;
  numerosMusicales: { texto: string }[];
  oradores: { id: string; tema: string | null; persona: { id: string; nombres: string; apellidos: string } }[];
};

export function ProgramaCard({ programa }: { programa: ProgramaData }) {
  const [pending, startTransition] = useTransition();
  const [addOradorState, addOradorAction, addOradorPending] = useActionState(
    addOrador.bind(null, programa.id),
    undefined
  );
  const [numeroTexto, setNumeroTexto] = useState("");

  const fechaRaw = new Intl.DateTimeFormat("es-MX", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(programa.fecha);
  const fechaFmt = fechaRaw.charAt(0).toUpperCase() + fechaRaw.slice(1);

  function handleAddNumero(e: React.FormEvent) {
    e.preventDefault();
    if (!numeroTexto.trim()) return;
    const texto = numeroTexto;
    setNumeroTexto("");
    startTransition(() => addNumeroMusical(programa.id, texto));
  }

  return (
    <Card className="flex flex-col gap-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-0.5">
          <span className="font-serif text-xl text-deep-water">{fechaFmt}</span>
          {programa.conductor && (
            <span className="font-sans text-xs text-water-mid">Conduce: {programa.conductor}</span>
          )}
        </div>
        <button
          type="button"
          disabled={pending}
          onClick={() => startTransition(() => deletePrograma(programa.id))}
          className="flex h-8 w-8 flex-none items-center justify-center rounded-full text-rojo/70 hover:bg-rojo-light"
          aria-label="Eliminar programa"
        >
          <IconTrash width={15} height={15} stroke="currentColor" />
        </button>
      </div>

      <div className="flex flex-col gap-2">
        <span className="font-sans text-[11px] font-medium tracking-[0.14em] text-water-mid uppercase">
          Oradores
        </span>
        {programa.oradores.map((o) => (
          <div
            key={o.id}
            className="flex items-center gap-3 rounded-xl border border-deep-water/8 bg-linen/50 p-2.5"
          >
            <div className="flex min-w-0 flex-1 flex-col">
              <span className="truncate font-serif text-sm text-deep-water">
                {o.persona.nombres} {o.persona.apellidos}
              </span>
              {o.tema && <span className="truncate font-sans text-xs text-water-mid">{o.tema}</span>}
            </div>
            <button
              type="button"
              disabled={pending}
              onClick={() => startTransition(() => removeOrador(o.id))}
              className="text-water-mid/60 hover:text-rojo"
              aria-label="Quitar orador"
            >
              ×
            </button>
          </div>
        ))}

        <form action={addOradorAction} className="flex flex-col gap-2 sm:flex-row">
          <div className="flex-1">
            <PersonaAutocomplete name="personaId" placeholder="Agregar orador…" />
          </div>
          <input
            name="tema"
            placeholder="Tema (opcional)"
            className="rounded-xl border border-line px-3 py-2 font-sans text-sm outline-none focus:border-living-teal sm:w-40"
          />
          <Button type="submit" variant="tertiary" disabled={addOradorPending}>
            + Agregar
          </Button>
        </form>
        {addOradorState?.errors?.personaId && (
          <p className="font-sans text-xs text-rojo">{addOradorState.errors.personaId[0]}</p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <span className="font-sans text-[11px] font-medium tracking-[0.14em] text-water-mid uppercase">
          Números musicales
        </span>
        {programa.numerosMusicales.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {programa.numerosMusicales.map((n, i) => (
              <span
                key={i}
                className="flex items-center gap-2 rounded-full bg-mist px-3 py-1.5 font-sans text-xs font-medium text-water-mid"
              >
                {n.texto}
                <button
                  type="button"
                  disabled={pending}
                  onClick={() => startTransition(() => removeNumeroMusical(programa.id, i))}
                  className="text-water-mid/60 hover:text-rojo"
                  aria-label={`Quitar ${n.texto}`}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
        <form onSubmit={handleAddNumero} className="flex gap-2">
          <input
            value={numeroTexto}
            onChange={(e) => setNumeroTexto(e.target.value)}
            placeholder="p. ej. Himno 152 · Coro del barrio"
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
