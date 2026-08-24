import type { ReactNode } from "react";
import Link from "next/link";
import { PageHero } from "@/components/shell/page-hero";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { IconServicio } from "@/components/icons";

function ServicioCard({
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

export default function ServicioPage() {
  return (
    <main className="flex flex-1 flex-col">
      <PageHero eyebrow="Servicio" title="Módulos por llamamiento" />
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 px-6 py-6 lg:px-10">
        <ServicioCard
          href="/servicio/ministracion"
          title="Ministración"
          description="Compañerismos, familias asignadas y seguimiento de visitas."
          icon={<IconServicio width={20} height={20} stroke="currentColor" />}
        />
        <ServicioCard
          href="/servicio/entrevistas"
          title="Entrevistas"
          description="Pendientes, agendadas y hechas, con motivo y fecha."
          icon={<IconServicio width={20} height={20} stroke="currentColor" />}
        />
        <ServicioCard
          href="/servicio/recomendos"
          title="Recomendos"
          description="Vencimientos del recomendo del templo, con renovación rápida."
          icon={<IconServicio width={20} height={20} stroke="currentColor" />}
        />
        <ServicioCard
          href="/servicio/oradores"
          title="Oradores y música"
          description="Programa sacramental por domingo: oradores, temas y números musicales."
          icon={<IconServicio width={20} height={20} stroke="currentColor" />}
        />

        <EmptyState
          icon={<IconServicio width={22} height={22} stroke="currentColor" />}
          title="El resto llega en la próxima fase"
          description="Nuevos miembros y clases se activan según los llamamientos configurados en Ajustes."
        />
      </div>
    </main>
  );
}
