import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { PageHero } from "@/components/shell/page-hero";
import { Card } from "@/components/ui/card";

export const dynamic = "force-dynamic";

function StatCard({
  value,
  label,
  href,
  tone = "neutral",
}: {
  value: number;
  label: string;
  href: string;
  tone?: "neutral" | "warn" | "danger";
}) {
  const color =
    tone === "danger" ? "text-rojo" : tone === "warn" ? "text-amber" : "text-deep-water";

  return (
    <Link href={href}>
      <Card className="flex h-full flex-col gap-1 transition hover:border-living-teal">
        <span className={`font-serif text-[34px] leading-[38px] ${color}`}>{value}</span>
        <span className="font-sans text-[11px] font-medium tracking-[0.1em] text-water-mid uppercase">
          {label}
        </span>
      </Card>
    </Link>
  );
}

function Seccion({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3">
      <span className="font-serif text-lg text-deep-water">{titulo}</span>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">{children}</div>
    </div>
  );
}

export default async function ReportePage() {
  const en30dias = new Date();
  en30dias.setDate(en30dias.getDate() + 30);
  const hace30dias = new Date();
  hace30dias.setDate(hace30dias.getDate() - 30);

  const [
    personasActivas,
    personasPapelera,
    agendaPendiente,
    familiasSinCompanerismo,
    asignacionesSinVisitaReciente,
    entrevistasPendientes,
    recomendosVencidos,
    recomendosPorVencer,
    enEnsenanza,
    referenciasSinContactar,
    clasesSinMaestro,
    hitosAbiertos,
  ] = await Promise.all([
    prisma.persona.count({ where: { deletedAt: null } }),
    prisma.persona.count({ where: { deletedAt: { not: null } } }),
    prisma.agendaItem.count({ where: { completado: false } }),
    prisma.familia.count({ where: { asignaciones: { none: { deletedAt: null } } } }),
    prisma.asignacionMinistracion.count({
      where: {
        deletedAt: null,
        OR: [{ ultimoContacto: null }, { ultimoContacto: { lt: hace30dias } }],
      },
    }),
    prisma.entrevista.count({ where: { deletedAt: null, estado: "PENDIENTE" } }),
    prisma.recomendoTemplo.count({ where: { fechaVencimiento: { lt: new Date() } } }),
    prisma.recomendoTemplo.count({
      where: { fechaVencimiento: { gte: new Date(), lte: en30dias } },
    }),
    prisma.ensenanzaProgreso.count({ where: { estado: { not: "BAUTIZADO" } } }),
    prisma.referencia.count({ where: { contactada: false } }),
    prisma.claseEscDominical.count({ where: { deletedAt: null, maestroPersonaId: null } }),
    prisma.hitoIntegracion.findMany({
      where: { completado: false },
      select: { diasDesdeBautismo: true, plan: { select: { fechaBautismo: true } } },
    }),
  ]);

  const hitosAtrasados = hitosAbiertos.filter((h) => {
    const objetivo = new Date(h.plan.fechaBautismo);
    objetivo.setDate(objetivo.getDate() + h.diasDesdeBautismo);
    return objetivo < new Date();
  }).length;

  return (
    <main className="flex flex-1 flex-col">
      <PageHero eyebrow="Organización" title="Reporte" subtitle="Estado general del barrio hoy" />

      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-6 py-6 lg:px-10">
        <Seccion titulo="Personas">
          <StatCard value={personasActivas} label="Activas" href="/personas" />
          <StatCard value={personasPapelera} label="En papelera" href="/personas?trash=1" />
        </Seccion>

        <Seccion titulo="Organización">
          <StatCard
            value={agendaPendiente}
            label="Puntos de agenda pendientes"
            href="/organizacion/agenda"
            tone={agendaPendiente > 0 ? "warn" : "neutral"}
          />
        </Seccion>

        <Seccion titulo="Servicio">
          <StatCard
            value={familiasSinCompanerismo}
            label="Familias sin compañerismo"
            href="/servicio/ministracion"
            tone={familiasSinCompanerismo > 0 ? "danger" : "neutral"}
          />
          <StatCard
            value={asignacionesSinVisitaReciente}
            label="Sin visita en 30+ días"
            href="/servicio/ministracion"
            tone={asignacionesSinVisitaReciente > 0 ? "warn" : "neutral"}
          />
          <StatCard
            value={entrevistasPendientes}
            label="Entrevistas pendientes"
            href="/servicio/entrevistas"
            tone={entrevistasPendientes > 0 ? "warn" : "neutral"}
          />
          <StatCard
            value={recomendosVencidos}
            label="Recomendos vencidos"
            href="/servicio/recomendos"
            tone={recomendosVencidos > 0 ? "danger" : "neutral"}
          />
          <StatCard
            value={recomendosPorVencer}
            label="Recomendos vencen en 30 días"
            href="/servicio/recomendos"
            tone={recomendosPorVencer > 0 ? "warn" : "neutral"}
          />
          <StatCard value={enEnsenanza} label="Personas en enseñanza" href="/servicio/nuevos-miembros" />
          <StatCard
            value={referenciasSinContactar}
            label="Referencias sin contactar"
            href="/servicio/nuevos-miembros"
            tone={referenciasSinContactar > 0 ? "warn" : "neutral"}
          />
          <StatCard
            value={hitosAtrasados}
            label="Hitos de integración atrasados"
            href="/servicio/bautismos"
            tone={hitosAtrasados > 0 ? "danger" : "neutral"}
          />
          <StatCard
            value={clasesSinMaestro}
            label="Clases sin maestro"
            href="/servicio/clases"
            tone={clasesSinMaestro > 0 ? "warn" : "neutral"}
          />
        </Seccion>
      </div>
    </main>
  );
}
