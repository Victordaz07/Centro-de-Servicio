import { prisma } from "@/lib/prisma";
import { PageHero } from "@/components/shell/page-hero";
import { EmptyState } from "@/components/ui/empty-state";
import { IconServicio } from "@/components/icons";
import { CreateBautismoForm } from "./create-bautismo-form";
import { BautismoRow } from "./bautismo-row";

export const dynamic = "force-dynamic";

export default async function BautismosPage() {
  const bautismos = await prisma.bautismo.findMany({
    where: { personaId: { not: null } },
    include: {
      persona: { select: { id: true, nombres: true, apellidos: true } },
      planIntegracion: { include: { hitos: { select: { completado: true } } } },
    },
    orderBy: { fecha: "desc" },
  });

  return (
    <main className="flex flex-1 flex-col">
      <PageHero
        eyebrow="Servicio · BautizApp"
        title="Bautismos"
        subtitle="Plan de Integración del primer año, por persona"
      />

      <div className="mx-auto flex w-full max-w-2xl flex-col gap-3 px-6 py-6 lg:px-10">
        <CreateBautismoForm />

        {bautismos.length === 0 ? (
          <EmptyState
            icon={<IconServicio width={22} height={22} stroke="currentColor" />}
            title="Sin bautismos registrados"
            description="Registra el primer bautismo para generar su Plan de Integración."
          />
        ) : (
          <div className="flex flex-col gap-2">
            {bautismos.map((b) => (
              <BautismoRow
                key={b.id}
                bautismo={{
                  id: b.id,
                  fecha: b.fecha,
                  persona: b.persona!,
                  hitosTotal: b.planIntegracion?.hitos.length ?? 0,
                  hitosCompletados: b.planIntegracion?.hitos.filter((h) => h.completado).length ?? 0,
                }}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
