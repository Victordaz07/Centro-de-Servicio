import { PersonaRow } from "./persona-row";
import type { PersonaRowData } from "./types";

export function PersonaList({
  personas,
  activeId,
}: {
  personas: PersonaRowData[];
  activeId?: string;
}) {
  if (personas.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-deep-water/15 bg-white/60 p-6 text-center font-sans text-sm text-water-mid">
        No hay personas todavía.
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-1.5">
      {personas.map((persona) => (
        <li key={persona.id}>
          <PersonaRow persona={persona} active={persona.id === activeId} />
        </li>
      ))}
    </ul>
  );
}
