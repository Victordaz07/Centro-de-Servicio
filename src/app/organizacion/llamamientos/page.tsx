import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { PageHero } from "@/components/shell/page-hero";
import { EmptyState } from "@/components/ui/empty-state";
import { IconOrganizacion } from "@/components/icons";
import { CreateLlamamientoForm } from "./create-llamamiento-form";
import { LlamamientoRow } from "./llamamiento-row";

export const dynamic = "force-dynamic";

export default async function LlamamientosPage({
  searchParams,
}: {
  searchParams: Promise<{ trash?: string }>;
}) {
  const { trash } = await searchParams;
  const showTrash = trash === "1";

  const llamamientos = await prisma.llamamientoConsideracion.findMany({
    where: { deletedAt: showTrash ? { not: null } : null },
    include: { persona: { select: { id: true, nombres: true, apellidos: true } } },
  });

  const orden: Record<string, number> = { ORANDO: 0, PROPUESTO: 1, EXTENDIDO: 2 };
  llamamientos.sort((a, b) => orden[a.estado] - orden[b.estado]);

  return (
    <main className="flex flex-1 flex-col">
      <PageHero eyebrow="Organización" title="Llamamientos en consideración" />

      <div className="mx-auto flex w-full max-w-2xl flex-col gap-3 px-6 py-6 lg:px-10">
        {!showTrash && <CreateLlamamientoForm />}

        {llamamientos.length === 0 ? (
          <EmptyState
            icon={<IconOrganizacion width={22} height={22} stroke="currentColor" />}
            title={showTrash ? "La papelera está vacía" : "Sin consideraciones todavía"}
            description={
              showTrash ? undefined : "Registra la primera persona en consideración para un llamamiento."
            }
          />
        ) : (
          <div className="flex flex-col gap-2">
            {llamamientos.map((l) => (
              <LlamamientoRow key={l.id} llamamiento={l} />
            ))}
          </div>
        )}

        <Link
          href={showTrash ? "/organizacion/llamamientos" : "/organizacion/llamamientos?trash=1"}
          className="text-center font-sans text-xs font-medium text-ink/60 hover:text-deep-water"
        >
          {showTrash ? "← Ver activas" : "Ver papelera"}
        </Link>
      </div>
    </main>
  );
}
