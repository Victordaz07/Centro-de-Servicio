import { prisma } from "@/lib/prisma";
import { PageHero } from "@/components/shell/page-hero";
import { EmptyState } from "@/components/ui/empty-state";
import { IconServicio } from "@/components/icons";
import { CreateEnsenanzaForm } from "./create-ensenanza-form";
import { EnsenanzaCard } from "./ensenanza-card";
import { CreateReferenciaForm } from "./create-referencia-form";
import { ReferenciaRow } from "./referencia-row";

export const dynamic = "force-dynamic";

export default async function NuevosMiembrosPage() {
  const [ensenanzas, referencias] = await Promise.all([
    prisma.ensenanzaProgreso.findMany({
      include: { persona: { select: { id: true, nombres: true, apellidos: true } } },
    }),
    prisma.referencia.findMany({
      include: {
        personaQueRefiere: { select: { id: true, nombres: true, apellidos: true } },
        personaReferida: { select: { id: true, nombres: true, apellidos: true } },
      },
      orderBy: { fecha: "desc" },
    }),
  ]);

  return (
    <main className="flex flex-1 flex-col">
      <PageHero
        eyebrow="Servicio · Líder misional · Gather"
        title="Nuevos miembros"
        image="/art/header-nuevos-miembros-integracion.webp"
      />

      <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-6 py-6 lg:px-10">
        <div className="flex flex-col gap-3">
          <span className="font-sans text-[11px] font-medium tracking-[0.14em] text-water-mid uppercase">
            En enseñanza
          </span>
          <CreateEnsenanzaForm />
          {ensenanzas.length === 0 ? (
            <EmptyState
              icon={<IconServicio width={22} height={22} stroke="currentColor" />}
              illustration
              title="Sin nadie en enseñanza todavía"
              description="Agrega a la primera persona con quien estás enseñando."
            />
          ) : (
            <div className="flex flex-col gap-3">
              {ensenanzas.map((e) => (
                <EnsenanzaCard
                  key={e.id}
                  ensenanza={{
                    ...e,
                    lecciones: (e.lecciones as { tema: string; fecha: string }[]) ?? [],
                    compromisos: (e.compromisos as { descripcion: string; cumplido: boolean }[]) ?? [],
                  }}
                />
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3">
          <span className="font-sans text-[11px] font-medium tracking-[0.14em] text-water-mid uppercase">
            Referencias
          </span>
          <CreateReferenciaForm />
          {referencias.length === 0 ? (
            <EmptyState
              icon={<IconServicio width={22} height={22} stroke="currentColor" />}
              illustration
              title="Sin referencias todavía"
              description="Registra la primera referencia de los misioneros o de un miembro."
            />
          ) : (
            <div className="flex flex-col gap-2">
              {referencias.map((r) => (
                <ReferenciaRow key={r.id} referencia={r} />
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
