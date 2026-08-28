"use client";

import { useState, useTransition } from "react";
import { updateMinuta, deleteMinuta, restoreMinuta, type MinutaFormState } from "./actions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export type MinutaData = {
  id: string;
  fecha: Date;
  texto: string;
  editedAt: Date | null;
  deletedAt: Date | null;
  history: { texto: string; editedAt: string }[];
};

export function MinutaRow({ minuta }: { minuta: MinutaData }) {
  const [editing, setEditing] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [errors, setErrors] = useState<MinutaFormState>(undefined);
  const [pending, startTransition] = useTransition();

  function handleSave(formData: FormData) {
    startTransition(async () => {
      const result = await updateMinuta(minuta.id, undefined, formData);
      if (result?.errors) {
        setErrors(result);
        return;
      }
      setErrors(undefined);
      setEditing(false);
    });
  }

  return (
    <Card className={`flex flex-col gap-3 ${minuta.deletedAt ? "opacity-60" : ""}`}>
      <div className="flex items-start justify-between gap-3">
        <span className="font-serif text-lg text-deep-water">
          {new Intl.DateTimeFormat("es-MX", { weekday: "long", day: "numeric", month: "long" }).format(
            minuta.fecha
          )}
        </span>
        {minuta.editedAt && <Badge variant="neutro">Editada</Badge>}
      </div>

      {editing ? (
        <form action={handleSave} className="flex flex-col gap-2">
          <textarea
            name="texto"
            defaultValue={minuta.texto}
            rows={4}
            required
            className="w-full rounded-xl border border-line px-3 py-2 font-sans text-sm outline-none focus:border-living-teal"
          />
          {errors?.errors?.texto && (
            <p className="font-sans text-xs text-rojo">{errors.errors.texto[0]}</p>
          )}
          <div className="flex gap-2">
            <Button type="submit" variant="primary" disabled={pending}>
              Guardar
            </Button>
            <Button type="button" variant="tertiary" onClick={() => setEditing(false)}>
              Cancelar
            </Button>
          </div>
        </form>
      ) : (
        <p className="whitespace-pre-wrap font-sans text-sm text-ink">{minuta.texto}</p>
      )}

      {!editing && minuta.history.length > 0 && (
        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={() => setShowHistory((v) => !v)}
            className="self-start font-sans text-xs font-medium text-living-teal"
          >
            {showHistory ? "Ocultar" : "Ver"} historial ({minuta.history.length})
          </button>
          {showHistory && (
            <div className="flex flex-col gap-2 rounded-xl bg-linen/50 p-3">
              {minuta.history
                .slice()
                .reverse()
                .map((h, i) => (
                  <div key={i} className="flex flex-col gap-1 border-t border-deep-water/7 pt-2 first:border-t-0 first:pt-0">
                    <span className="font-sans text-[11px] text-water-mid">
                      {new Intl.DateTimeFormat("es-MX", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" }).format(
                        new Date(h.editedAt)
                      )}
                    </span>
                    <p className="whitespace-pre-wrap font-sans text-xs text-ink/70">{h.texto}</p>
                  </div>
                ))}
            </div>
          )}
        </div>
      )}

      {!editing && (
        <div className="flex gap-2">
          {minuta.deletedAt ? (
            <Button
              variant="tertiary"
              disabled={pending}
              onClick={() => startTransition(() => restoreMinuta(minuta.id))}
            >
              Restaurar
            </Button>
          ) : (
            <>
              <Button variant="tertiary" onClick={() => setEditing(true)}>
                Editar
              </Button>
              <Button
                variant="ghost"
                disabled={pending}
                onClick={() => startTransition(() => deleteMinuta(minuta.id))}
              >
                Eliminar
              </Button>
            </>
          )}
        </div>
      )}
    </Card>
  );
}
