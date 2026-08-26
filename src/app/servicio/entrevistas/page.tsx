import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { PageHero } from "@/components/shell/page-hero";
import { EmptyState } from "@/components/ui/empty-state";
import { IconServicio } from "@/components/icons";
import { CreateEntrevistaForm } from "./create-entrevista-form";
import { EntrevistaRow } from "./entrevista-row";

export const dynamic = "force-dynamic";

const ESTADO_PRIORIDAD: Record<string, number> = { PENDIENTE: 0, AGENDADA: 1, HECHA: 2 };

export default async function EntrevistasPage({
  searchParams,
}: {
  searchParams: Promise<{ trash?: string }>;
}) {
  const { trash } = await searchParams;
  const showTrash = trash === "1";

  const entrevistas = await prisma.entrevista.findMany({
    where: { deletedAt: showTrash ? { not: null } : null },
    include: { persona: { select: { id: true, nombres: true, apellidos: true } } },
  });

  entrevistas.sort((a, b) => {
    const prioridad = ESTADO_PRIORIDAD[a.estado] - ESTADO_PRIORIDAD[b.estado];
    if (prioridad !== 0) return prioridad;
    if (!a.fecha && !b.fecha) return 0;
    if (!a.fecha) return 1;
    if (!b.fecha) return -1;
    return a.fecha.getTime() - b.fecha.getTime();
  });

  const pendientes = entrevistas.filter((e) => e.estado === "PENDIENTE").length;

  return (
    <main className="flex flex-1 flex-col">
      <PageHero
        eyebrow="Servicio · Secretario Ejecutivo"
        title="Entrevistas"
        subtitle={showTrash ? "Papelera" : `${pendientes} pendientes de agendar`}
      />

      <div className="mx-auto flex w-full max-w-2xl flex-col gap-3 px-6 py-6 lg:px-10">
        {!showTrash && <CreateEntrevistaForm />}

        {entrevistas.length === 0 ? (
          <EmptyState
            icon={<IconServicio width={22} height={22} stroke="currentColor" />}
            illustration={!showTrash}
            title={showTrash ? "La papelera está vacía" : "Sin entrevistas todavía"}
            description={
              showTrash ? undefined : "Registra la primera entrevista pendiente con una persona."
            }
          />
        ) : (
          <div className="flex flex-col gap-2">
            {entrevistas.map((e) => (
              <EntrevistaRow key={e.id} entrevista={e} />
            ))}
          </div>
        )}

        <Link
          href={showTrash ? "/servicio/entrevistas" : "/servicio/entrevistas?trash=1"}
          className="text-center font-sans text-xs font-medium text-ink/60 hover:text-deep-water"
        >
          {showTrash ? "← Ver activas" : "Ver papelera"}
        </Link>
      </div>
    </main>
  );
}
