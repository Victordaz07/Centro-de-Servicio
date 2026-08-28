"use client";

import { useEffect, useRef, useState } from "react";
import { quickCreateFamilia } from "@/app/servicio/ministracion/actions";

type FamiliaResult = { id: string; nombre: string };

type Props = {
  name: string;
  placeholder?: string;
};

/**
 * Mismo patrón que PersonaAutocomplete: busca familias existentes antes de
 * permitir crear una nueva. Escribe el id seleccionado en un input oculto.
 */
export function FamiliaAutocomplete({ name, placeholder }: Props) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<FamiliaResult[]>([]);
  const [selectedId, setSelectedId] = useState("");
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
    if (selectedId) return;
    if (!query.trim()) return;

    const timeout = setTimeout(async () => {
      const res = await fetch(`/api/familias/search?q=${encodeURIComponent(query)}`);
      if (!res.ok) return;
      const data = await res.json();
      setResults(data.familias as FamiliaResult[]);
      setOpen(true);
    }, 250);

    return () => clearTimeout(timeout);
  }, [query, selectedId]);

  function selectFamilia(f: FamiliaResult) {
    setSelectedId(f.id);
    setQuery(f.nombre);
    setOpen(false);
  }

  async function createAndSelect() {
    const familia = await quickCreateFamilia(query);
    selectFamilia(familia);
  }

  const visibleResults = selectedId || !query.trim() ? [] : results;

  return (
    <div ref={containerRef} className="relative">
      <input type="hidden" name={name} value={selectedId} />
      <input
        type="text"
        value={query}
        placeholder={placeholder ?? "Buscar familia…"}
        onChange={(e) => {
          setQuery(e.target.value);
          setSelectedId("");
        }}
        onFocus={() => visibleResults.length > 0 && setOpen(true)}
        className="w-full rounded-xl border border-line px-3 py-2 font-sans text-sm outline-none focus:border-living-teal"
      />

      {open && (
        <div className="absolute z-10 mt-1 w-full rounded-xl border border-line bg-white shadow-md">
          {visibleResults.map((f) => (
            <button
              type="button"
              key={f.id}
              onClick={() => selectFamilia(f)}
              className="block w-full px-3 py-2 text-left font-sans text-sm hover:bg-linen"
            >
              {f.nombre}
            </button>
          ))}

          {query.trim() && (
            <button
              type="button"
              onClick={createAndSelect}
              className="block w-full border-t border-line px-3 py-2 text-left font-sans text-sm text-living-teal hover:bg-linen"
            >
              + Crear &ldquo;{query.trim()}&rdquo; como nueva familia
            </button>
          )}
        </div>
      )}
    </div>
  );
}
