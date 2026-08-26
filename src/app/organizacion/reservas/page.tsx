import { prisma } from "@/lib/prisma";
import { PageHero } from "@/components/shell/page-hero";
import { EmptyState } from "@/components/ui/empty-state";
import { IconOrganizacion } from "@/components/icons";
import { CreateReservaForm } from "./create-reserva-form";
import { ReservaRow } from "./reserva-row";

export const dynamic = "force-dynamic";

export default async function ReservasPage() {
  const reservas = await prisma.reservaEdificio.findMany({
    orderBy: [{ fecha: "asc" }, { horaInicio: "asc" }],
  });

  const grupos = new Map<string, typeof reservas>();
  for (const r of reservas) {
    const key = r.fecha.toISOString().slice(0, 10);
    if (!grupos.has(key)) grupos.set(key, []);
    grupos.get(key)!.push(r);
  }

  return (
    <main className="flex flex-1 flex-col">
      <PageHero eyebrow="Organización" title="Reservas del edificio" />

      <div className="mx-auto flex w-full max-w-2xl flex-col gap-4 px-6 py-6 lg:px-10">
        <CreateReservaForm />

        {reservas.length === 0 ? (
          <EmptyState
            icon={<IconOrganizacion width={22} height={22} stroke="currentColor" />}
            illustration
            title="Sin reservas todavía"
            description="Crea la primera reserva de un área del edificio."
          />
        ) : (
          Array.from(grupos.entries()).map(([key, items]) => (
            <div key={key} className="flex flex-col gap-2">
              <span className="font-sans text-[11px] font-medium tracking-[0.14em] text-water-mid uppercase">
                {new Intl.DateTimeFormat("es-MX", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                }).format(items[0].fecha)}
              </span>
              {items.map((r) => (
                <ReservaRow key={r.id} reserva={r} />
              ))}
            </div>
          ))
        )}
      </div>
    </main>
  );
}
