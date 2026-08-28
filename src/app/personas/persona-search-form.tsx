import { IconSearch } from "@/components/icons";

export function PersonaSearchForm({ q, showTrash }: { q?: string; showTrash: boolean }) {
  return (
    <form className="flex gap-2">
      {showTrash && <input type="hidden" name="trash" value="1" />}
      <div className="flex min-h-[46px] flex-1 items-center gap-2.5 rounded-xl border border-line bg-white px-3.5">
        <IconSearch width={17} height={17} stroke="var(--water-mid)" className="flex-none" />
        <input
          type="text"
          name="q"
          defaultValue={q ?? ""}
          placeholder="Buscar por nombre o apellido…"
          className="w-full font-sans text-sm text-ink outline-none placeholder:text-ink/45"
        />
      </div>
    </form>
  );
}
