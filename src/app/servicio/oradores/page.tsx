import { prisma } from "@/lib/prisma";
import { PageHero } from "@/components/shell/page-hero";
import { EmptyState } from "@/components/ui/empty-state";
import { IconServicio } from "@/components/icons";
import { CreateProgramaForm } from "./create-programa-form";
import { ProgramaCard } from "./programa-card";

export const dynamic = "force-dynamic";

export default async function OradoresPage() {
  const programas = await prisma.programaSacramental.findMany({
    include: {
      oradores: {
        include: { persona: { select: { id: true, nombres: true, apellidos: true } } },
      },
    },
    orderBy: { fecha: "asc" },
  });

  return (
    <main className="flex flex-1 flex-col">
      <PageHero eyebrow="Servicio · Coordinación" title="Oradores y música" />

      <div className="mx-auto flex w-full max-w-2xl flex-col gap-3 px-6 py-6 lg:px-10">
        <CreateProgramaForm />

        {programas.length === 0 ? (
          <EmptyState
            icon={<IconServicio width={22} height={22} stroke="currentColor" />}
            illustration
            title="Sin programas todavía"
            description="Crea el primer domingo para empezar a asignar oradores y números musicales."
          />
        ) : (
          <div className="flex flex-col gap-3">
            {programas.map((p) => (
              <ProgramaCard
                key={p.id}
                programa={{
                  ...p,
                  numerosMusicales: (p.numerosMusicales as { texto: string }[]) ?? [],
                }}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
