import Link from "next/link";
import { PageHero } from "@/components/shell/page-hero";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { IconServicio } from "@/components/icons";

export default function ServicioPage() {
  return (
    <main className="flex flex-1 flex-col">
      <PageHero eyebrow="Servicio" title="Módulos por llamamiento" />
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 px-6 py-6 lg:px-10">
        <Link href="/servicio/ministracion">
          <Card className="flex items-center gap-4 transition hover:border-living-teal">
            <div className="flex h-11 w-11 flex-none items-center justify-center rounded-2xl bg-mist text-water-mid">
              <IconServicio width={20} height={20} stroke="currentColor" />
            </div>
            <div className="flex flex-1 flex-col">
              <span className="font-serif text-lg text-deep-water">Ministración</span>
              <span className="font-sans text-sm text-water-mid">
                Compañerismos, familias asignadas y seguimiento de visitas.
              </span>
            </div>
          </Card>
        </Link>

        <EmptyState
          icon={<IconServicio width={22} height={22} stroke="currentColor" />}
          title="El resto llega en la próxima fase"
          description="Entrevistas, recomendos, oradores, nuevos miembros y clases se activan según los llamamientos configurados en Ajustes."
        />
      </div>
    </main>
  );
}
