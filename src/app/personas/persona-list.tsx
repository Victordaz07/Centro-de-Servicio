"use client";

import { useState, useTransition } from "react";
import { updatePersona, softDeletePersona, restorePersona, type PersonaFormState } from "./actions";

export type PersonaRowData = {
  id: string;
  nombres: string;
  apellidos: string;
  telefono: string | null;
  notas: string | null;
  deletedAt: Date | null;
};

export function PersonaList({ personas }: { personas: PersonaRowData[] }) {
  if (personas.length === 0) {
    return (
      <p className="rounded-xl border border-line bg-white p-6 text-center text-sm text-ink/60">
        No hay personas todavía.
      </p>
    );
  }

  return (
    <ul className="space-y-2">
      {personas.map((persona) => (
        <PersonaRow key={persona.id} persona={persona} />
      ))}
    </ul>
  );
}

function PersonaRow({ persona }: { persona: PersonaRowData }) {
  const [editing, setEditing] = useState(false);
  const [errors, setErrors] = useState<PersonaFormState>(undefined);
  const [pending, startTransition] = useTransition();

  function handleSave(formData: FormData) {
    startTransition(async () => {
      const result = await updatePersona(persona.id, undefined, formData);
      if (result?.errors) {
        setErrors(result);
        return;
      }
      setErrors(undefined);
      setEditing(false);
    });
  }

  if (editing) {
    return (
      <li className="rounded-xl border border-living-teal bg-white p-4">
        <form action={handleSave} className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <input
            name="nombres"
            defaultValue={persona.nombres}
            required
            className="rounded-md border border-line px-3 py-2 text-sm"
          />
          <input
            name="apellidos"
            defaultValue={persona.apellidos}
            required
            className="rounded-md border border-line px-3 py-2 text-sm"
          />
          <input
            name="telefono"
            defaultValue={persona.telefono ?? ""}
            className="rounded-md border border-line px-3 py-2 text-sm"
          />
          <input
            name="notas"
            defaultValue={persona.notas ?? ""}
            className="rounded-md border border-line px-3 py-2 text-sm"
          />
          {errors?.errors && (
            <p className="col-span-full text-xs text-rojo">
              Revisa nombres y apellidos.
            </p>
          )}
          <div className="col-span-full flex gap-2">
            <button
              type="submit"
              disabled={pending}
              className="rounded-md bg-deep-water px-3 py-1.5 text-xs font-medium text-white disabled:opacity-60"
            >
              Guardar
            </button>
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="rounded-md border border-line px-3 py-1.5 text-xs font-medium text-ink"
            >
              Cancelar
            </button>
          </div>
        </form>
      </li>
    );
  }

  return (
    <li
      className={`flex items-center justify-between rounded-xl border border-line bg-white p-4 ${
        persona.deletedAt ? "opacity-60" : ""
      }`}
    >
      <div>
        <p className="text-sm font-medium text-ink">
          {persona.nombres} {persona.apellidos}
          {persona.deletedAt && (
            <span className="ml-2 rounded bg-rojo-light px-1.5 py-0.5 text-[10px] font-semibold uppercase text-rojo">
              Eliminada
            </span>
          )}
        </p>
        {(persona.telefono || persona.notas) && (
          <p className="text-xs text-ink/60">
            {[persona.telefono, persona.notas].filter(Boolean).join(" · ")}
          </p>
        )}
      </div>

      <div className="flex gap-2">
        {persona.deletedAt ? (
          <button
            onClick={() => startTransition(() => restorePersona(persona.id))}
            disabled={pending}
            className="rounded-md border border-line px-3 py-1.5 text-xs font-medium text-sage"
          >
            Restaurar
          </button>
        ) : (
          <>
            <button
              onClick={() => setEditing(true)}
              className="rounded-md border border-line px-3 py-1.5 text-xs font-medium text-ink"
            >
              Editar
            </button>
            <button
              onClick={() => startTransition(() => softDeletePersona(persona.id))}
              disabled={pending}
              className="rounded-md border border-line px-3 py-1.5 text-xs font-medium text-rojo"
            >
              Eliminar
            </button>
          </>
        )}
      </div>
    </li>
  );
}
