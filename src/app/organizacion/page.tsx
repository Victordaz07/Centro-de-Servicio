import Link from "next/link";
import { PageHero } from "@/components/shell/page-hero";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { IconInicio, IconOrganizacion } from "@/components/icons";

export default function OrganizacionPage() {
  return (
    <main className="flex flex-1 flex-col">
      <PageHero eyebrow="Organización" title="Núcleo operativo" />
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 px-6 py-6 lg:px-10">
        <Link href="/organizacion/agenda">
          <Card className="flex items-center gap-4 transition hover:border-living-teal">
            <div className="flex h-11 w-11 flex-none items-center justify-center rounded-2xl bg-mist text-water-mid">
              <IconInicio width={20} height={20} stroke="currentColor" />
            </div>
            <div className="flex flex-1 flex-col">
              <span className="font-serif text-lg text-deep-water">Agenda</span>
              <span className="font-sans text-sm text-water-mid">
                Puntos para el consejo de barrio o cualquier reunión, con responsable.
              </span>
            </div>
          </Card>
        </Link>

        <EmptyState
          icon={<IconOrganizacion width={22} height={22} stroke="currentColor" />}
          title="El resto llega en la próxima fase"
          description="Minutas, asignaciones, llamamientos, rotaciones, reservas del edificio y reporte se construyen sobre el mismo modelo de Persona ya sembrado."
        />
      </div>
    </main>
  );
}
