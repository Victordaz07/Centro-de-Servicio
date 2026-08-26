import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { PageHero } from "@/components/shell/page-hero";
import { EmptyState } from "@/components/ui/empty-state";
import { IconServicio } from "@/components/icons";
import { CreateClaseForm } from "./create-clase-form";
import { ClaseCard } from "./clase-card";

export const dynamic = "force-dynamic";

export default async function ClasesPage({
  searchParams,
}: {
  searchParams: Promise<{ trash?: string }>;
}) {
  const { trash } = await searchParams;
  const showTrash = trash === "1";

  const clases = await prisma.claseEscDominical.findMany({
    where: { deletedAt: showTrash ? { not: null } : null },
    include: { maestro: { select: { id: true, nombres: true, apellidos: true } } },
    orderBy: { nombre: "asc" },
  });

  const suplenteIds = Array.from(
    new Set(clases.flatMap((c) => (c.suplentes as string[]) ?? []))
  );
  const suplentesPersonas = suplenteIds.length
    ? await prisma.persona.findMany({
        where: { id: { in: suplenteIds } },
        select: { id: true, nombres: true, apellidos: true },
      })
    : [];
  const personasMap = Object.fromEntries(
    suplentesPersonas.map((p) => [p.id, { nombres: p.nombres, apellidos: p.apellidos }])
  );

  return (
    <main className="flex flex-1 flex-col">
      <PageHero eyebrow="Servicio · Escuela Dominical" title="Clases y maestros" />

      <div className="mx-auto flex w-full max-w-2xl flex-col gap-3 px-6 py-6 lg:px-10">
        {!showTrash && <CreateClaseForm />}

        {clases.length === 0 ? (
          <EmptyState
            icon={<IconServicio width={22} height={22} stroke="currentColor" />}
            illustration={!showTrash}
            title={showTrash ? "La papelera está vacía" : "Sin clases todavía"}
            description={showTrash ? undefined : "Crea la primera clase de Escuela Dominical."}
          />
        ) : (
          <div className="flex flex-col gap-3">
            {clases.map((c) => (
              <ClaseCard
                key={c.id}
                clase={{ ...c, suplentes: (c.suplentes as string[]) ?? [] }}
                personasMap={personasMap}
              />
            ))}
          </div>
        )}

        <Link
          href={showTrash ? "/servicio/clases" : "/servicio/clases?trash=1"}
          className="text-center font-sans text-xs font-medium text-ink/60 hover:text-deep-water"
        >
          {showTrash ? "← Ver activas" : "Ver papelera"}
        </Link>
      </div>
    </main>
  );
}
