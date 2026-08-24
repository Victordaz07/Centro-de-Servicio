import { PageHero } from "@/components/shell/page-hero";
import { EmptyState } from "@/components/ui/empty-state";
import { IconServicio } from "@/components/icons";

export default function ServicioPage() {
  return (
    <main className="flex flex-1 flex-col">
      <PageHero eyebrow="Servicio" title="Módulos por llamamiento" />
      <div className="mx-auto w-full max-w-3xl px-6 py-6 lg:px-10">
        <EmptyState
          icon={<IconServicio width={24} height={24} stroke="currentColor" />}
          title="Este módulo llega en la próxima fase"
          description="Entrevistas, recomendos, oradores, ministración, nuevos miembros y clases se activan según los llamamientos configurados en Ajustes."
        />
      </div>
    </main>
  );
}
