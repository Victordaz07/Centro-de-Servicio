import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PageHero } from "@/components/shell/page-hero";
import { LogoutButton } from "@/components/shell/logout-button";
import { Card } from "@/components/ui/card";

const ROL_LABELS: Record<string, string> = {
  CUORUM_SDS: "Cuórum de Élderes / Sociedad de Socorro",
  EJECUTIVO: "Secretario Ejecutivo",
  OBISPADO: "Secretario de Obispado",
  ED: "Escuela Dominical",
};

export default async function AjustesPage() {
  const session = await auth();
  const user = session?.user?.id
    ? await prisma.user.findUnique({ where: { id: session.user.id } })
    : null;

  return (
    <main className="flex flex-1 flex-col">
      <PageHero eyebrow="Ajustes" title="Tu cuenta" />
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 px-6 py-6 lg:px-10">
        <Card className="flex flex-col gap-3">
          <div>
            <p className="font-sans text-[11px] font-medium tracking-[0.12em] text-water-mid uppercase">
              Email
            </p>
            <p className="font-serif text-lg text-deep-water">{session?.user?.email}</p>
          </div>

          <div>
            <p className="font-sans text-[11px] font-medium tracking-[0.12em] text-water-mid uppercase">
              Llamamientos
            </p>
            {user?.roles?.length ? (
              <ul className="mt-1 flex flex-col gap-1 font-sans text-sm text-ink">
                {user.roles.map((rol) => (
                  <li key={rol}>{ROL_LABELS[rol] ?? rol}</li>
                ))}
              </ul>
            ) : (
              <p className="mt-1 font-sans text-sm text-water-mid">
                Sin llamamientos configurados todavía.
              </p>
            )}
          </div>
        </Card>

        <div>
          <LogoutButton />
        </div>
      </div>
    </main>
  );
}
