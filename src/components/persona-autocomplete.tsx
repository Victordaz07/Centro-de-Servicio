"use client";

import { useEffect, useRef, useState } from "react";
import { quickCreatePersona } from "@/app/personas/actions";

type PersonaResult = {
  id: string;
  nombres: string;
  apellidos: string;
  telefono: string | null;
};

type Props = {
  name: string;
  defaultValue?: { id: string; nombre: string };
  placeholder?: string;
};

/**
 * Busca personas existentes antes de permitir crear una nueva — la regla de
 * diseño del proyecto: ningún campo de "responsable"/"nombre" vuelve a ser
 * texto libre. Escribe el id seleccionado en un input oculto `name`.
 */
export function PersonaAutocomplete({ name, defaultValue, placeholder }: Props) {
  const [query, setQuery] = useState(defaultValue?.nombre ?? "");
  const [results, setResults] = useState<PersonaResult[]>([]);
  const [selectedId, setSelectedId] = useState(defaultValue?.id ?? "");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  useEffect(() => {
    if (selectedId) return; // no re-buscar si ya hay una selección exacta
    if (!query.trim()) return;

    const timeout = setTimeout(async () => {
      const res = await fetch(`/api/personas/search?q=${encodeURIComponent(query)}`);
      if (!res.ok) return;
      const data = await res.json();
      setResults(data.personas as PersonaResult[]);
      setOpen(true);
    }, 250);

    return () => clearTimeout(timeout);
  }, [query, selectedId]);

  function selectPersona(p: PersonaResult) {
    setSelectedId(p.id);
    setQuery(`${p.nombres} ${p.apellidos}`);
    setOpen(false);
  }

  async function createAndSelect() {
    const persona = await quickCreatePersona(query);
    selectPersona({ ...persona, telefono: null });
  }

  const visibleResults = selectedId || !query.trim() ? [] : results;

  return (
    <div ref={containerRef} className="relative">
      <input type="hidden" name={name} value={selectedId} />
      <input
        type="text"
        value={query}
        placeholder={placeholder ?? "Buscar persona…"}
        onChange={(e) => {
          setQuery(e.target.value);
          setSelectedId("");
        }}
        onFocus={() => visibleResults.length > 0 && setOpen(true)}
        className="w-full rounded-md border border-line px-3 py-2 text-sm outline-none focus:border-living-teal"
      />

      {open && (
        <div className="absolute z-10 mt-1 w-full rounded-md border border-line bg-white shadow-md">
          {visibleResults.map((p) => (
            <button
              type="button"
              key={p.id}
              onClick={() => selectPersona(p)}
              className="block w-full px-3 py-2 text-left text-sm hover:bg-linen"
            >
              {p.nombres} {p.apellidos}
              {p.telefono && (
                <span className="ml-2 text-xs text-ink/60">{p.telefono}</span>
              )}
            </button>
          ))}

          {query.trim() && (
            <button
              type="button"
              onClick={createAndSelect}
              className="block w-full border-t border-line px-3 py-2 text-left text-sm text-living-teal hover:bg-linen"
            >
              + Crear &ldquo;{query.trim()}&rdquo; como nueva persona
            </button>
          )}
        </div>
      )}
    </div>
  );
}
