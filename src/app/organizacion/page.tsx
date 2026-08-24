import type { ReactNode } from "react";
import Link from "next/link";
import { PageHero } from "@/components/shell/page-hero";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { IconInicio, IconOrganizacion } from "@/components/icons";

function OrganizacionCard({
  href,
  title,
  description,
  icon,
}: {
  href: string;
  title: string;
  description: string;
  icon: ReactNode;
}) {
  return (
    <Link href={href}>
      <Card className="flex items-center gap-4 transition hover:border-living-teal">
        <div className="flex h-11 w-11 flex-none items-center justify-center rounded-2xl bg-mist text-water-mid">
          {icon}
        </div>
        <div className="flex flex-1 flex-col">
          <span className="font-serif text-lg text-deep-water">{title}</span>
          <span className="font-sans text-sm text-water-mid">{description}</span>
        </div>
      </Card>
    </Link>
  );
}

export default function OrganizacionPage() {
  return (
    <main className="flex flex-1 flex-col">
      <PageHero eyebrow="Organización" title="Núcleo operativo" />
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 px-6 py-6 lg:px-10">
        <OrganizacionCard
          href="/organizacion/agenda"
          title="Agenda"
          description="Puntos para el consejo de barrio o cualquier reunión, con responsable."
          icon={<IconInicio width={20} height={20} stroke="currentColor" />}
        />
        <OrganizacionCard
          href="/organizacion/reservas"
          title="Reservas del edificio"
          description="Capilla, salones y aulas por fecha y horario."
          icon={<IconOrganizacion width={20} height={20} stroke="currentColor" />}
        />
        <OrganizacionCard
          href="/organizacion/reporte"
          title="Reporte"
          description="Estado general del barrio: lo urgente en un solo vistazo."
          icon={<IconOrganizacion width={20} height={20} stroke="currentColor" />}
        />

        <EmptyState
          icon={<IconOrganizacion width={22} height={22} stroke="currentColor" />}
          title="El resto llega en la próxima fase"
          description="Minutas, asignaciones, llamamientos y rotaciones se construyen sobre el mismo modelo de Persona ya sembrado."
        />
      </div>
    </main>
  );
}
