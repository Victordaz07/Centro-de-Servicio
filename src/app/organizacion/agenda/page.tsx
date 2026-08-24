import { prisma } from "@/lib/prisma";
import { PageHero } from "@/components/shell/page-hero";
import { EmptyState } from "@/components/ui/empty-state";
import { IconInicio } from "@/components/icons";
import { AgendaItemRow } from "./agenda-item-row";
import { CreateAgendaItemForm } from "./create-agenda-item-form";

export const dynamic = "force-dynamic";

export default async function AgendaPage() {
  const items = await prisma.agendaItem.findMany({
    include: { responsable: { select: { id: true, nombres: true, apellidos: true } } },
    orderBy: [{ completado: "asc" }, { id: "asc" }],
  });

  const total = items.length;
  const completados = items.filter((i) => i.completado).length;
  const progreso = total > 0 ? Math.round((completados / total) * 100) : 0;

  return (
    <main className="flex flex-1 flex-col">
      <PageHero
        eyebrow="Organización"
        title="Agenda"
        subtitle={total > 0 ? `${completados} de ${total} puntos cubiertos` : "Sin puntos todavía"}
      >
        {total > 0 && (
          <div className="mt-1 h-1.5 w-full max-w-sm overflow-hidden rounded-full bg-mist/20">
            <div
              className="h-full rounded-full bg-living-teal transition-all"
              style={{ width: `${progreso}%` }}
            />
          </div>
        )}
      </PageHero>

      <div className="mx-auto flex w-full max-w-2xl flex-col gap-3 px-6 py-6 lg:px-10">
        <CreateAgendaItemForm />

        {items.length === 0 ? (
          <EmptyState
            icon={<IconInicio width={22} height={22} stroke="currentColor" />}
            title="Sin puntos de agenda"
            description="Agrega el primer punto para empezar a armar el consejo o la reunión de hoy."
          />
        ) : (
          <div className="flex flex-col gap-2">
            {items.map((item) => (
              <AgendaItemRow key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
