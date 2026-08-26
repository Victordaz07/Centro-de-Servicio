import { prisma } from "@/lib/prisma";
import { PageHero } from "@/components/shell/page-hero";
import { EmptyState } from "@/components/ui/empty-state";
import { IconServicio } from "@/components/icons";
import { CreateRecomendoForm } from "./create-recomendo-form";
import { RecomendoRow } from "./recomendo-row";

export const dynamic = "force-dynamic";

export default async function RecomendosPage() {
  const recomendos = await prisma.recomendoTemplo.findMany({
    include: { persona: { select: { id: true, nombres: true, apellidos: true } } },
    orderBy: { fechaVencimiento: "asc" },
  });

  const vencidos = recomendos.filter((r) => r.fechaVencimiento < new Date()).length;

  return (
    <main className="flex flex-1 flex-col">
      <PageHero
        eyebrow="Servicio · Secretario Ejecutivo"
        title="Recomendos"
        subtitle={
          recomendos.length > 0
            ? `${recomendos.length} registrados${vencidos > 0 ? ` · ${vencidos} vencidos` : ""}`
            : "Sin recomendos registrados"
        }
      />

      <div className="mx-auto flex w-full max-w-2xl flex-col gap-3 px-6 py-6 lg:px-10">
        <CreateRecomendoForm />

        {recomendos.length === 0 ? (
          <EmptyState
            icon={<IconServicio width={22} height={22} stroke="currentColor" />}
            illustration
            title="Sin recomendos todavía"
            description="Registra la fecha de vencimiento del recomendo del templo de una persona."
          />
        ) : (
          <div className="flex flex-col gap-2">
            {recomendos.map((r) => (
              <RecomendoRow key={r.id} recomendo={r} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
