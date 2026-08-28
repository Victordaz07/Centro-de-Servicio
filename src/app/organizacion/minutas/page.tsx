import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { PageHero } from "@/components/shell/page-hero";
import { EmptyState } from "@/components/ui/empty-state";
import { IconOrganizacion } from "@/components/icons";
import { CreateMinutaForm } from "./create-minuta-form";
import { MinutaRow } from "./minuta-row";

export const dynamic = "force-dynamic";

export default async function MinutasPage({
  searchParams,
}: {
  searchParams: Promise<{ trash?: string }>;
}) {
  const { trash } = await searchParams;
  const showTrash = trash === "1";

  const minutas = await prisma.minuta.findMany({
    where: { deletedAt: showTrash ? { not: null } : null },
    orderBy: { fecha: "desc" },
  });

  return (
    <main className="flex flex-1 flex-col">
      <PageHero eyebrow="Organización" title="Minutas" image="/art/header-minutas-agenda.webp" />

      <div className="mx-auto flex w-full max-w-2xl flex-col gap-3 px-6 py-6 lg:px-10">
        {!showTrash && <CreateMinutaForm />}

        {minutas.length === 0 ? (
          <EmptyState
            icon={<IconOrganizacion width={22} height={22} stroke="currentColor" />}
            illustration={!showTrash}
            title={showTrash ? "La papelera está vacía" : "Sin minutas todavía"}
            description={showTrash ? undefined : "Registra la minuta de la primera reunión."}
          />
        ) : (
          <div className="flex flex-col gap-3">
            {minutas.map((m) => (
              <MinutaRow
                key={m.id}
                minuta={{ ...m, history: (m.history as { texto: string; editedAt: string }[]) ?? [] }}
              />
            ))}
          </div>
        )}

        <Link
          href={showTrash ? "/organizacion/minutas" : "/organizacion/minutas?trash=1"}
          className="text-center font-sans text-xs font-medium text-ink/60 hover:text-deep-water"
        >
          {showTrash ? "← Ver activas" : "Ver papelera"}
        </Link>
      </div>
    </main>
  );
}
