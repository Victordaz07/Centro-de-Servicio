import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PageHero } from "@/components/shell/page-hero";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IconPersonas, IconSearch } from "@/components/icons";

function greeting(hour: number) {
  if (hour < 12) return "Buenos días";
  if (hour < 19) return "Buenas tardes";
  return "Buenas noches";
}

export default async function InicioPage() {
  const session = await auth();
  const now = new Date();

  const [total, activas, enPapelera] = await Promise.all([
    prisma.persona.count(),
    prisma.persona.count({ where: { deletedAt: null } }),
    prisma.persona.count({ where: { deletedAt: { not: null } } }),
  ]);

  const fecha = new Intl.DateTimeFormat("es-MX", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(now);

  return (
    <main className="flex flex-1 flex-col">
      <PageHero
        eyebrow={fecha}
        title={`${greeting(now.getHours())}${session?.user?.email ? `, ${session.user.email.split("@")[0]}` : ""}`}
        subtitle="Esto es lo que hay en el sistema hoy."
      />

      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-6 py-6 lg:px-10">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
          <Card className="flex flex-col gap-1">
            <span className="font-serif text-[34px] leading-[38px] text-deep-water">{activas}</span>
            <span className="font-sans text-[11px] font-medium tracking-[0.1em] text-water-mid uppercase">
              Personas activas
            </span>
          </Card>
          <Card className="flex flex-col gap-1">
            <span className="font-serif text-[34px] leading-[38px] text-amber">{enPapelera}</span>
            <span className="font-sans text-[11px] font-medium tracking-[0.1em] text-water-mid uppercase">
              En papelera
            </span>
          </Card>
          <Card className="flex flex-col gap-1">
            <span className="font-serif text-[34px] leading-[38px] text-deep-water">{total}</span>
            <span className="font-sans text-[11px] font-medium tracking-[0.1em] text-water-mid uppercase">
              Total registradas
            </span>
          </Card>
        </div>

        <Card className="flex flex-col gap-3">
          <span className="font-serif text-lg text-deep-water">Personas</span>
          <p className="font-sans text-sm text-water-mid">
            Directorio central del barrio: busca, crea y da seguimiento a cada persona.
          </p>
          <div className="flex flex-wrap gap-2">
            <Link href="/personas">
              <Button variant="primary">
                <IconPersonas width={16} height={16} stroke="currentColor" />
                Ver personas
              </Button>
            </Link>
            <Link href="/personas?focus=buscar">
              <Button variant="secondary">
                <IconSearch width={16} height={16} stroke="currentColor" />
                Buscar persona
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </main>
  );
}
