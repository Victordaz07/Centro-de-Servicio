import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { PageHero } from "@/components/shell/page-hero";
import { EmptyState } from "@/components/ui/empty-state";
import { IconOrganizacion } from "@/components/icons";
import { CreateRotacionForm } from "./create-rotacion-form";
import { RotacionCard } from "./rotacion-card";

export const dynamic = "force-dynamic";

export default async function RotacionesPage({
  searchParams,
}: {
  searchParams: Promise<{ trash?: string }>;
}) {
  const { trash } = await searchParams;
  const showTrash = trash === "1";

  const rotaciones = await prisma.rotacion.findMany({
    where: { deletedAt: showTrash ? { not: null } : null },
    orderBy: { tarea: "asc" },
  });

  const personaIds = Array.from(
    new Set(rotaciones.flatMap((r) => (r.personas as string[]) ?? []))
  );
  const personas = personaIds.length
    ? await prisma.persona.findMany({
        where: { id: { in: personaIds } },
        select: { id: true, nombres: true, apellidos: true },
      })
    : [];
  const personasMap = Object.fromEntries(
    personas.map((p) => [p.id, { nombres: p.nombres, apellidos: p.apellidos }])
  );

  return (
    <main className="flex flex-1 flex-col">
      <PageHero eyebrow="Organización" title="Rotaciones" />

      <div className="mx-auto flex w-full max-w-2xl flex-col gap-3 px-6 py-6 lg:px-10">
        {!showTrash && <CreateRotacionForm />}

        {rotaciones.length === 0 ? (
          <EmptyState
            icon={<IconOrganizacion width={22} height={22} stroke="currentColor" />}
            illustration={!showTrash}
            title={showTrash ? "La papelera está vacía" : "Sin rotaciones todavía"}
            description={
              showTrash ? undefined : "Crea la primera rotación para una tarea recurrente."
            }
          />
        ) : (
          <div className="flex flex-col gap-3">
            {rotaciones.map((r) => (
              <RotacionCard
                key={r.id}
                rotacion={{ ...r, personas: (r.personas as string[]) ?? [] }}
                personasMap={personasMap}
              />
            ))}
          </div>
        )}

        <Link
          href={showTrash ? "/organizacion/rotaciones" : "/organizacion/rotaciones?trash=1"}
          className="text-center font-sans text-xs font-medium text-ink/60 hover:text-deep-water"
        >
          {showTrash ? "← Ver activas" : "Ver papelera"}
        </Link>
      </div>
    </main>
  );
}
