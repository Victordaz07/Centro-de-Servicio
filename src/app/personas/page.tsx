import { prisma } from "@/lib/prisma";
import { CreatePersonaForm } from "./create-persona-form";
import { PersonaList } from "./persona-list";

export default async function PersonasPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; trash?: string }>;
}) {
  const { q, trash } = await searchParams;
  const showTrash = trash === "1";

  const personas = await prisma.persona.findMany({
    where: {
      deletedAt: showTrash ? { not: null } : null,
      ...(q?.trim()
        ? {
            OR: [
              { nombres: { contains: q.trim(), mode: "insensitive" } },
              { apellidos: { contains: q.trim(), mode: "insensitive" } },
            ],
          }
        : {}),
    },
    orderBy: [{ apellidos: "asc" }, { nombres: "asc" }],
  });

  return (
    <main className="mx-auto max-w-3xl space-y-6 px-4 py-8">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-deep-water">Personas</h1>
        <a
          href={showTrash ? "/personas" : "/personas?trash=1"}
          className="text-xs font-medium text-ink/60 hover:text-deep-water"
        >
          {showTrash ? "← Ver activas" : "Ver papelera"}
        </a>
      </header>

      <form className="flex gap-2">
        {showTrash && <input type="hidden" name="trash" value="1" />}
        <input
          type="text"
          name="q"
          defaultValue={q ?? ""}
          placeholder="Buscar por nombre o apellido…"
          className="w-full rounded-md border border-line bg-white px-3 py-2 text-sm outline-none focus:border-living-teal"
        />
        <button
          type="submit"
          className="rounded-md border border-line bg-white px-4 py-2 text-sm font-medium text-ink"
        >
          Buscar
        </button>
      </form>

      {!showTrash && <CreatePersonaForm />}

      <PersonaList personas={personas} />
    </main>
  );
}
