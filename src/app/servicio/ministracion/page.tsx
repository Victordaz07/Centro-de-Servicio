import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { PageHero } from "@/components/shell/page-hero";
import { EmptyState } from "@/components/ui/empty-state";
import { IconServicio } from "@/components/icons";
import { CompanerismoPanel } from "./companerismo-panel";
import { NuevaAsignacionForm } from "./nueva-asignacion-form";
import { AsignacionRow } from "./asignacion-row";

export default async function MinistracionPage({
  searchParams,
}: {
  searchParams: Promise<{ trash?: string }>;
}) {
  const { trash } = await searchParams;
  const showTrash = trash === "1";

  const [companerismos, asignaciones, familiasSinAsignar] = await Promise.all([
    prisma.companerismo.findMany({
      where: { deletedAt: null },
      select: { id: true, nombres: true },
      orderBy: { nombres: "asc" },
    }),
    prisma.asignacionMinistracion.findMany({
      where: { deletedAt: showTrash ? { not: null } : null },
      include: {
        familia: { select: { id: true, nombre: true } },
        companerismo: { select: { id: true, nombres: true } },
      },
      orderBy: [{ ultimoContacto: "asc" }],
    }),
    showTrash
      ? Promise.resolve([])
      : prisma.familia.findMany({
          where: { asignaciones: { none: { deletedAt: null } } },
          select: { id: true, nombre: true },
          orderBy: { nombre: "asc" },
        }),
  ]);

  return (
    <main className="flex flex-1 flex-col">
      <PageHero
        eyebrow="Servicio · Cuórum de Élderes / Sociedad de Socorro"
        title="Ministración"
        subtitle={`${companerismos.length} compañerismos · ${asignaciones.filter((a) => !a.deletedAt).length} familias asignadas`}
      />

      <div className="mx-auto flex w-full max-w-2xl flex-col gap-4 px-6 py-6 lg:px-10">
        {!showTrash && (
          <>
            <CompanerismoPanel companerismos={companerismos} />
            <NuevaAsignacionForm companerismos={companerismos} />
          </>
        )}

        {asignaciones.length === 0 ? (
          <EmptyState
            icon={<IconServicio width={22} height={22} stroke="currentColor" />}
            title={showTrash ? "La papelera está vacía" : "Sin asignaciones todavía"}
            description={
              showTrash
                ? undefined
                : "Crea un compañerismo y asígnale una familia para empezar a llevar el seguimiento."
            }
          />
        ) : (
          <div className="flex flex-col gap-2">
            {asignaciones.map((a) => (
              <AsignacionRow key={a.id} asignacion={a} />
            ))}
          </div>
        )}

        {!showTrash && familiasSinAsignar.length > 0 && (
          <div className="flex flex-col gap-2">
            <span className="font-sans text-[11px] font-medium tracking-[0.14em] text-water-mid uppercase">
              Familias sin compañerismo
            </span>
            {familiasSinAsignar.map((f) => (
              <div
                key={f.id}
                className="rounded-2xl border-[1.5px] border-dashed border-deep-water/22 bg-white p-3.5"
              >
                <span className="font-serif text-base text-deep-water">{f.nombre}</span>
                <p className="font-sans text-sm text-water-mid">Sin compañerismo asignado.</p>
              </div>
            ))}
          </div>
        )}

        <Link
          href={showTrash ? "/servicio/ministracion" : "/servicio/ministracion?trash=1"}
          className="text-center font-sans text-xs font-medium text-ink/60 hover:text-deep-water"
        >
          {showTrash ? "← Ver activas" : "Ver papelera"}
        </Link>
      </div>
    </main>
  );
}
