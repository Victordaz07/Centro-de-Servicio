import { PageHero } from "@/components/shell/page-hero";
import { EmptyState } from "@/components/ui/empty-state";
import { IconOrganizacion } from "@/components/icons";

export default function OrganizacionPage() {
  return (
    <main className="flex flex-1 flex-col">
      <PageHero eyebrow="Organización" title="Núcleo operativo" />
      <div className="mx-auto w-full max-w-3xl px-6 py-6 lg:px-10">
        <EmptyState
          icon={<IconOrganizacion width={24} height={24} stroke="currentColor" />}
          title="Este módulo llega en la próxima fase"
          description="Agenda, minutas, asignaciones, llamamientos, rotaciones y reservas del edificio se construyen sobre el mismo modelo de Persona ya sembrado. Por ahora, trabaja en Personas."
        />
      </div>
    </main>
  );
}
