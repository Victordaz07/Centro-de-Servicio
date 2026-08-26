import type { ReactNode } from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { PageHero } from "@/components/shell/page-hero";
import { EmptyState } from "@/components/ui/empty-state";
import { IconPersonas } from "@/components/icons";
import { PersonaList } from "./persona-list";
import { PersonaSearchForm } from "./persona-search-form";
import { CreatePersonaForm } from "./create-persona-form";

export async function PersonaShell({
  q,
  showTrash,
  activeId,
  detail,
}: {
  q?: string;
  showTrash: boolean;
  activeId?: string;
  detail?: ReactNode;
}) {
  const personas = await prisma.persona.findMany({
    where: {
      deletedAt: showTrash ? { not: null } : null,
      ...(q?.trim()
        ? {
            OR: [
              { nombres: { contains: q.trim(), mode: "insensitive" as const } },
              { apellidos: { contains: q.trim(), mode: "insensitive" as const } },
            ],
          }
        : {}),
    },
    orderBy: [{ apellidos: "asc" }, { nombres: "asc" }],
  });

  return (
    <main className="flex flex-1 flex-col lg:flex-row lg:items-stretch">
      <div
        className={`${
          activeId ? "hidden lg:flex" : "flex"
        } flex-col lg:w-[340px] lg:flex-none lg:border-r lg:border-deep-water/8`}
      >
        <PageHero
          eyebrow={showTrash ? "Papelera" : "Directorio del barrio"}
          title="Personas"
          subtitle={`${personas.length} ${showTrash ? "en papelera" : "registradas"}`}
          image="/art/header-perfil-persona.webp"
        />
        <div className="flex flex-1 flex-col gap-3 p-4">
          <PersonaSearchForm q={q} showTrash={showTrash} />
          {!showTrash && <CreatePersonaForm />}
          <PersonaList personas={personas} activeId={activeId} />
          <Link
            href={showTrash ? "/personas" : "/personas?trash=1"}
            className="mt-auto pt-2 text-center font-sans text-xs font-medium text-ink/60 hover:text-deep-water"
          >
            {showTrash ? "← Ver activas" : "Ver papelera"}
          </Link>
        </div>
      </div>

      <div className={`${activeId ? "flex" : "hidden lg:flex"} flex-1 flex-col`}>
        {detail ?? (
          <div className="flex flex-1 items-center justify-center p-8">
            <EmptyState
              icon={<IconPersonas width={22} height={22} stroke="currentColor" />}
              title="Selecciona una persona"
              description="Elige a alguien del directorio para ver su perfil, o crea uno nuevo."
            />
          </div>
        )}
      </div>
    </main>
  );
}
