import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { PageHero } from "@/components/shell/page-hero";
import { EmptyState } from "@/components/ui/empty-state";
import { IconOrganizacion } from "@/components/icons";
import { CreateTareaForm } from "./create-tarea-form";
import { TareaRow } from "./tarea-row";

export const dynamic = "force-dynamic";

export default async function AsignacionesPage({
  searchParams,
}: {
  searchParams: Promise<{ trash?: string }>;
}) {
  const { trash } = await searchParams;
  const showTrash = trash === "1";

  const tareas = await prisma.tarea.findMany({
    where: { deletedAt: showTrash ? { not: null } : null },
    orderBy: [{ completado: "asc" }, { id: "asc" }],
  });

  const pendientes = tareas.filter((t) => !t.completado).length;

  return (
    <main className="flex flex-1 flex-col">
      <PageHero
        eyebrow="Organización"
        title="Asignaciones"
        subtitle={showTrash ? "Papelera" : `${pendientes} pendientes`}
      />

      <div className="mx-auto flex w-full max-w-2xl flex-col gap-3 px-6 py-6 lg:px-10">
        {!showTrash && <CreateTareaForm />}

        {tareas.length === 0 ? (
          <EmptyState
            icon={<IconOrganizacion width={22} height={22} stroke="currentColor" />}
            illustration={!showTrash}
            title={showTrash ? "La papelera está vacía" : "Sin asignaciones todavía"}
            description={showTrash ? undefined : "Crea la primera asignación para el barrio."}
          />
        ) : (
          <div className="flex flex-col gap-2">
            {tareas.map((t) => (
              <TareaRow key={t.id} tarea={t} />
            ))}
          </div>
        )}

        <Link
          href={showTrash ? "/organizacion/asignaciones" : "/organizacion/asignaciones?trash=1"}
          className="text-center font-sans text-xs font-medium text-ink/60 hover:text-deep-water"
        >
          {showTrash ? "← Ver activas" : "Ver papelera"}
        </Link>
      </div>
    </main>
  );
}
